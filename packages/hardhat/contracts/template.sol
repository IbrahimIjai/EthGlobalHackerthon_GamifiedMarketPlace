// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface IKRC20 is IERC20 {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint16);
}

interface IWKCS {
    function deposit() external payable;
}

contract NFTMarketplace is Context, Ownable, Pausable, ReentrancyGuard {
    // Libraries
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;
    using Address for address;
    using SafeERC20 for IKRC20;

    // Variables
    address private immutable WKCS; // Native ERC20 token for trades
    uint16 public tradeFee; // marketplace fee
    address public admin; // marketplace controller
    uint16 private constant minFees = 0; // 1% == 100 etc.
    uint16 private constant maxFees = 1000; // 1000 == 10%
    address private proxyAdmin; // marketplace data management
    address private revenueCollector; // marketplace revenue collector

    // Enums
    enum Status {
        Unverified,
        Verified
    }

    // Events
    event ItemListed(
        address indexed seller,
        address indexed collection,
        uint256 tokenId,
        uint256 price
    );
    event ItemUpdated(
        address indexed owner,
        address indexed collection,
        uint256 tokenId,
        uint256 newPrice
    );
    event ItemSold(
        address indexed seller,
        address indexed collection,
        address indexed buyer,
        uint256 tokenId,
        uint256 price
    );
    event ItemDelisted(address indexed collection, uint256 tokenId);
    event CollectionAdded(
        address indexed collection,
        address collectionFeeCollector,
        uint256 royaltyFees
    );
    event CollectionUpdated(
        address indexed collection,
        address collectionFeeCollector,
        uint256 royaltyFees
    );
    event CollectionVerificationStatus(
        address indexed collection,
        Status status,
        string ipfs
    );
    event CollectionRemoved(address indexed collection);
    event TradeFeeUpdated(uint256 fees);
    event RevenueWithdrawn(address indexed account, uint256 amount);
    event ProtocolRemoved(address indexed protocol);
    event ProtocolCreated(
        address indexed protocol,
        string name,
        uint16 protocolFee,
        uint16 securityFee
    );

    // Constructor
    /**
     * @notice Constructor for the marketplace
     * @param _tradeFee trade fee to be in counts of 100: 1% == 100, 10% = 1000
     * @param _admin address of the proxy admin
     * @param _WKCS address of the _WKCS token
     * @param _revenueCollector address of the revenue collector
     */
    constructor(
        uint16 _tradeFee, // trade fee to be in counts of 100: 1% == 100, 10% = 1000
        address _admin,
        address _WKCS,
        address _revenueCollector
    ) {
        tradeFee = _tradeFee;
        admin = _msgSender();
        proxyAdmin = _admin;
        WKCS = _WKCS;
        revenueCollector = _revenueCollector;
        Ownable(_msgSender());
    }

    // Structs
    // Stores Listing data
    struct Listing {
        address seller;
        uint256 price;
    }
    // A struct that tracks the royalty fees collection address, its royalty fees and state of its verification. Paramount for future updates when making the marketplace decentralized
    struct Collection {
        address collectionAddress;
        uint256 royaltyFees;
        Status status;
    }
    // An address set of all supported collections
    EnumerableSet.AddressSet private collections;

    // data mappings
    // mapping from collection address to tokenId to the Listing struct, containing seller address and price
    mapping(address => mapping(uint256 => Listing)) private listedToken;
    // mapping from collection address to an enumerable set of tokenIds. Used to keep track of token existence in the smart contract storage as listed
    mapping(address => EnumerableSet.UintSet) private tokenIdExists;
    // tracks the revenue generation for the protocol and the collection royalty fees
    mapping(address => uint256) private revenue;
    // Maps a collection address to its information
    mapping(address => Collection) private collection;
    // All supported in-house contracts
    mapping(address => bool) private isProtocol;

    /// All read functions
    function getAccountRevenue(
        address _account
    ) external view returns (uint256) {
        return revenue[_account];
    }

    /**
     * @notice Generate listing info for a collection
     * @param _collection address to check listings from
     */
    function getAllListings(
        address _collection
    ) external view returns (Listing[] memory listingData) {
        uint256 length = tokenIdExists[_collection].length();
        listingData = new Listing[](length);
        for (uint256 i; i < length; i++) {
            uint nftId = tokenIdExists[_collection].at(i);
            listingData[i] = listedToken[_collection][nftId];
        }
    }

    /**
     * @notice Get all collections supported by the marketplace
     */
    function getSupportedCollections()
        external
        view
        returns (address[] memory _supportedCollections)
    {
        uint256 length = collections.length();
        _supportedCollections = new address[](length);
        for (uint256 i; i < length; i++) {
            _supportedCollections[i] = collections.at(i);
        }
    }

    /**
     * @notice a public getter function to read from listedToken mapping to get listing data for an  NFT of a collection
     * @param _collection address to check listing from
     * @param _tokenId uint256 to check listing from
     */
    function getListing(
        address _collection,
        uint256 _tokenId
    ) public view returns (Listing memory) {
        return listedToken[_collection][_tokenId];
    }

    /**
     * @notice a public getter function to get a collection information from the collection mapping
     * @param _collection address to check offer from
     */
    function getCollectionData(
        address _collection
    ) public view returns (Collection memory) {
        return collection[_collection];
    }

    // Modifiers
    // modifier to check that only admin can call the function
    modifier isAdmin() {
        require(_msgSender() == admin, "Caller != Admin");
        _;
    }
    // modifier to check that only proxy admin can call the function
    modifier isProxyAdmin() {
        require(_msgSender() == proxyAdmin, "Caller != Proxy Admin");
        _;
    }
    // modifier to check that price is > 0
    modifier isPriceValid(uint256 _price) {
        require(_price > 0, "Price must be > 0");
        _;
    }
    // modifier to check if a collection is supported
    modifier isCollection(address _collection) {
        require(collections.contains(_collection), "Collection not supported");
        _;
    }
    // modifier to check if msg.sender is the NFT owner
    modifier isNftOwner(address _collection, uint256 _tokenId) {
        require(
            IERC721(_collection).ownerOf(_tokenId) == _msgSender(),
            "Caller != NFT Owner"
        );
        _;
    }
    // modifier to check if msg.sender is the NFT seller
    modifier isSeller(address _collection, uint256 _tokenId) {
        require(
            listedToken[_collection][_tokenId].seller == _msgSender(),
            "Caller != NFT Seller"
        );
        _;
    }
    // modifier to check if NFT is listed for sale
    modifier isListed(address _collection, uint256 _tokenId) {
        require(
            tokenIdExists[_collection].contains(_tokenId),
            "NFT not listed"
        );
        _;
    }
    // modifier to check if NFT is not listed for sale
    modifier isNotListed(address _collection, uint256 _tokenId) {
        require(!tokenIdExists[_collection].contains(_tokenId), "NFT listed");
        _;
    }
    // modifier to limit certain external functions from being called by external users
    modifier isProtocolCall() {
        require(isSupportedProtocol(_msgSender()));
        _;
    }

    function isSupportedProtocol(address _address) public view returns (bool) {
        return isProtocol[_address];
    }

    // Write functions

    function delist(
        address _collection,
        uint256 _tokenId
    ) external isProtocolCall {
        _delist(_collection, _tokenId);
    }

    function _delist(
        address _collection,
        uint256 _tokenId
    ) private whenNotPaused {
        if (tokenIdExists[_collection].contains(_tokenId)) {
            delete (listedToken[_collection][_tokenId]);
            tokenIdExists[_collection].remove(_tokenId);
        }
    }

    /**
     * @notice List an NFT for sale
     * @param _collection address of the collection
     * @param _tokenId uint256 of the tokenId
     * @param _price uint256 sale price
     */
    function list(
        address _collection,
        uint256 _tokenId,
        uint256 _price
    )
        external
        whenNotPaused
        isCollection(_collection)
        isNftOwner(_collection, _tokenId)
        isNotListed(_collection, _tokenId)
        isPriceValid(_price)
    {
        Listing memory listing = Listing(_msgSender(), _price);
        listedToken[_collection][_tokenId] = listing;
        tokenIdExists[_collection].add(_tokenId);
        emit ItemListed(_msgSender(), _collection, _tokenId, _price);
    }

    /**
     * @notice Update the price of an NFT listing
     * @param _collection address of the collection
     * @param _tokenId uint256 of the tokenId
     * @param _newPrice uint256 new sale price
     */
    function updateListing(
        address _collection,
        uint256 _tokenId,
        uint256 _newPrice
    )
        external
        isListed(_collection, _tokenId)
        whenNotPaused
        isNftOwner(_collection, _tokenId)
    {
        Listing memory listing = Listing(_msgSender(), _newPrice);
        listedToken[_collection][_tokenId] = listing;
        emit ItemUpdated(_msgSender(), _collection, _tokenId, _newPrice);
    }

    /**
     * @notice Cancel an NFT listing
     * @param _collection address of the collection
     * @param _tokenId uint256 of the tokenId
     */
    function cancelListing(
        address _collection,
        uint256 _tokenId
    )
        external
        isListed(_collection, _tokenId)
        nonReentrant
        isNftOwner(_collection, _tokenId)
    {
        _delist(_collection, _tokenId);
        emit ItemDelisted(_collection, _tokenId);
    }

    /**
     * @notice Buy an NFT using KCS by wrapping into WKCS
     * @param _collection address of the collection
     * @param _tokenId uint256 of the tokenId
     */
    function buyWithKCS(
        address _collection,
        uint256 _tokenId
    ) external payable whenNotPaused nonReentrant {
        uint price = listedToken[_collection][_tokenId].price;
        require(msg.value >= price);
        IWKCS(WKCS).deposit{value: price}();
        _buyNFT(_collection, _tokenId, price, _msgSender());
    }

    /**
     * @notice Buy an NFT using WKCS
     * @param _collection address of the collection
     * @param _tokenId uint256 of the tokenId
     */
    function buyWithWKCS(
        address _collection,
        uint256 _tokenId
    ) external whenNotPaused nonReentrant {
        uint price = listedToken[_collection][_tokenId].price;
        IKRC20(WKCS).safeTransferFrom(
            address(msg.sender),
            address(this),
            price
        );
        _buyNFT(_collection, _tokenId, price, _msgSender());
    }

    /**
     * @notice Internal function to execute Buy NFT
     * @param _collection address of the collection
     * @param _tokenId uint256 of the tokenId
     * @param _price uint256 sale price
     */
    function buyNFT(
        address _collection,
        uint256 _tokenId,
        uint256 _price,
        address buyer
    ) external isProtocolCall {
        _buyNFT(_collection, _tokenId, _price, buyer);
    }

    function _buyNFT(
        address _collection,
        uint256 _tokenId,
        uint256 _price,
        address buyer
    ) private isListed(_collection, _tokenId) {
        Listing memory listing = listedToken[_collection][_tokenId];
        (
            uint256 amount,
            uint256 marketplaceFee,
            uint256 collectionFee
        ) = calculateFee(_collection, _price, tradeFee);
        address seller = listing.seller;
        _delist(_collection, _tokenId);
        _updateRevenue(marketplaceFee, collectionFee, _collection);
        IKRC20(WKCS).safeTransfer(seller, amount);
        IERC721(_collection).safeTransferFrom(seller, buyer, _tokenId);
        emit ItemSold(seller, _collection, buyer, _tokenId, _price);
    }

    function updateRevenue(
        uint256 marketplaceFee,
        uint256 collectionFee,
        address _collection
    ) external isProtocolCall {
        _updateRevenue(marketplaceFee, collectionFee, _collection);
    }

    function _updateRevenue(
        uint256 marketplaceFee,
        uint256 collectionFee,
        address _collection
    ) private {
        if (collectionFee != 0) {
            address collectionFeeCollector = collection[_collection]
                .collectionAddress;
            revenue[collectionFeeCollector] += collectionFee;
        }
        if (marketplaceFee != 0) {
            revenue[revenueCollector] += marketplaceFee;
        }
    }

    function calculateFee(
        address _collection,
        uint256 _price,
        uint256 protocolFee
    )
        public
        view
        returns (uint256 amount, uint256 marketplaceFee, uint256 collectionFee)
    {
        marketplaceFee = (_price * protocolFee) / 10000;
        collectionFee = (_price * collection[_collection].royaltyFees) / 10000;
        amount = _price - (marketplaceFee + collectionFee);
    }

    /** 
        @notice Add a collection to the marketplace
        @param _collection address of the collection
        @param _collectionAddress address of the royalty fees receiver
        @param _royaltyFees uint256 of the royalty fees
    */
    function addCollection(
        address _collection,
        address _collectionAddress,
        uint256 _royaltyFees
    ) external whenNotPaused isAdmin {
        require(!collections.contains(_collection), "Collection exists");
        require(
            IERC721(_collection).supportsInterface(0x80ac58cd),
            "not supported"
        );
        require(
            _royaltyFees >= minFees && _royaltyFees <= (maxFees - tradeFee),
            "fees error"
        );
        collections.add(_collection);
        collection[_collection] = Collection(
            _collectionAddress,
            _royaltyFees,
            Status.Unverified
        );
        emit CollectionAdded(_collection, _collectionAddress, _royaltyFees);
    }

    /** 
        @notice Update a collection to the marketplace
        @param _collection address of the collection
        @param _collectionAddress address of the royalty fees receiver
        @param _royaltyFees uint256 of the royalty fees
    */
    function updateCollection(
        address _collection,
        address _collectionAddress,
        uint256 _royaltyFees
    ) external whenNotPaused isCollection(_collection) isAdmin {
        require(
            _royaltyFees >= minFees && _royaltyFees <= (maxFees - tradeFee),
            "high fees"
        );
        require(
            _msgSender() == collection[_collection].collectionAddress,
            "Only Collection admin can update"
        );
        collection[_collection] = Collection(
            _collectionAddress,
            _royaltyFees,
            Status.Unverified
        );
        emit CollectionUpdated(_collection, _collectionAddress, _royaltyFees);
    }

    /** 
        @notice Remove a collection from the marketplace
        @param _collection address of the collection
    */
    function removeCollection(
        address _collection
    ) external whenNotPaused isAdmin isCollection(_collection) {
        collections.remove(_collection);
        delete (collection[_collection]);
        emit CollectionRemoved(_collection);
    }

    /** 
        @notice Verify a collection from the marketplace
        @param _collection address of the collection
    */
    function verifyCollectionStatus(
        address _collection,
        string calldata _ipfsHash
    ) external isAdmin isCollection(_collection) {
        Collection storage collectionStatus = collection[_collection];
        collectionStatus.status = Status.Verified;
        emit CollectionVerificationStatus(
            _collection,
            collectionStatus.status,
            _ipfsHash
        );
    }

    /**
     * @notice Withdraw revenue generated from the marketplace
     */
    function withdrawRevenue() external whenNotPaused nonReentrant {
        uint256 revenueGenerated = revenue[_msgSender()];
        require(revenueGenerated != 0, "revenue = 0");
        revenue[_msgSender()] = 0;
        IKRC20(WKCS).safeTransfer(_msgSender(), revenueGenerated);
        emit RevenueWithdrawn(_msgSender(), revenueGenerated);
    }

    // Proxy admin functions
    /** 
        @dev script checks for approval and delists the NFT
        @param _collection address to delist from
        @param _tokenId nft to delist
    */
    function proxyDelistToken(
        address _collection,
        uint256 _tokenId
    ) external isProxyAdmin isListed(_collection, _tokenId) nonReentrant {
        address seller = listedToken[_collection][_tokenId].seller;
        IERC721 __collection = IERC721(_collection);
        bool singleApproval = __collection.getApproved(_tokenId) ==
            address(this);
        bool allApproved = __collection.isApprovedForAll(seller, address(this));
        require(!singleApproval && !allApproved, "NFT is approved");
        _delist(_collection, _tokenId);
        emit ItemDelisted(_collection, _tokenId);
    }

    //OnlyOwner function calls
    /** 
        @notice update the trade fee
        @param _newTradeFee uint16 of the new trade fee
    */
    function updateTradeFee(uint16 _newTradeFee) external whenPaused onlyOwner {
        tradeFee = _newTradeFee;
        emit TradeFeeUpdated(_newTradeFee);
    }

    /** 
        @notice update the admin address
        @param _newAdmin address of the new admin
    */
    function updateAdmin(address _newAdmin) external whenPaused onlyOwner {
        admin = _newAdmin;
    }

    /** 
        @notice update the proxy admin address
        @param _newAdmin address of the new admin
    */
    function updateProxyAdmin(address _newAdmin) external whenPaused onlyOwner {
        proxyAdmin = _newAdmin;
    }

    /** 
        @notice update the revenue collector address
        @param _newRevenueCollector address of the new revenue collector
    */
    function updateRevenueCollector(
        address _newRevenueCollector
    ) external whenPaused onlyOwner {
        revenueCollector = _newRevenueCollector;
    }

    function addProtocol(
        address _protocol,
        string calldata _name,
        uint16 _protocolFee,
        uint16 _securityFee
    ) external onlyOwner {
        isProtocol[_protocol] = true;
        emit ProtocolCreated(_protocol, _name, _protocolFee, _securityFee);
    }

    function removeProtocol(address _protocol) external onlyOwner {
        isProtocol[_protocol] = false;
        emit ProtocolRemoved(_protocol);
    }

    /** 
        @notice recover any ERC20 token sent to the contract
        @param _token address of the token to recover
    */
    function recoverToken(address _token) external whenPaused onlyOwner {
        require(_token != WKCS, "Cannot recover");
        if (_token == address(0)) {
            uint etherBalance = address(this).balance;
            require(etherBalance > 0, "Ether balance is 0");
            (bool sent, ) = admin.call{value: etherBalance}("");
            require(sent, "Failed to send Ether");
        } else {
            IKRC20 token = IKRC20(_token);
            uint balanceOf = token.balanceOf(address(this));
            token.safeTransfer(_msgSender(), balanceOf);
        }
    }

    function pause() external whenNotPaused onlyOwner {
        _pause();
    }

    function unpause() external whenPaused onlyOwner {
        _unpause();
    }
}
