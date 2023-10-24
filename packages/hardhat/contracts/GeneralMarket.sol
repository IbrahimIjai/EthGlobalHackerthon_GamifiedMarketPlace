//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract GeneralMarket is
	Context,
	Ownable,
	Pausable,
	ReentrancyGuard,
	IERC721Receiver
{
	// State Variables
	uint32 protocolFee = 1; //normal intergers, not percentage, eg, 10 for 10%
	uint32 maxRoyaltyFees = 2; // integer
	address tradeToken;
	address revenueCollector;
	uint256 curPointValue = 0.00060 ether;
	//variables libraries
	using EnumerableSet for EnumerableSet.AddressSet;
	using EnumerableSet for EnumerableSet.UintSet;
	using SafeERC20 for IERC20;

	//data types
	enum collectionStatus {
		notVerified,
		verified
	}

	constructor() {}

	struct Listing {
		address seller;
		uint256 price;
	}
	struct Collection {
		address collectionAddress;
		uint256 royaltyFees; //normal intergers, not percentage, eg, 10 for 10%
		uint256 minPrice;
		collectionStatus status;
		uint256 floorPrice;
		uint256 minLiquidatePoint;
	}

	EnumerableSet.AddressSet private collections;
	//collection==>tokenId==>Listing
	mapping(address => mapping(uint256 => Listing)) private listedToken;

	mapping(address => EnumerableSet.UintSet) private tokenIdExists;

	mapping(address => Collection) private collection;

	mapping(address => uint256) private revenue;

	mapping(address => uint256) public userLiqPts;

	//Seller typical activities
	function list (
		address _collection,
		uint256 _tokenId,
		uint256 _price
	)
		public
		whenNotPaused
		isVerifiedCollection(_collection)
		isNftOwner(_collection, _tokenId)
		isNotListed(_collection, _tokenId)
		isPriceValid(_price, _collection)
		nonReentrant 
	{
		Listing memory listing = Listing(_msgSender(), _price);
		listedToken[_collection][_tokenId] = listing;
		tokenIdExists[_collection].add(_tokenId);
		IERC721(_collection).safeTransferFrom(
			_msgSender(),
			address(this),
			_tokenId
		);
		emit NFTListed(_msgSender(), _collection, _tokenId, _price);
	}

	function delist(
		address _collection,
		uint256 _tokenId
	) public isListed(_collection, _tokenId) whenNotPaused {
		require(
			listedToken[_collection][_tokenId].seller == _msgSender(),
			"User didnt listed the NFT"
		);
		IERC721(_collection).safeTransferFrom(
			address(this),
			_msgSender(),
			_tokenId
		);
		_delist(_collection, _tokenId);
	}

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
		emit listingUpdated(_msgSender(), _collection, _tokenId, _newPrice);
	}

	//buy with native/ether. USDT, AND others will be supported in the future.
	function buyNFT(
		address _collection,
		uint256 _tokenId
	)
		public
		payable
		// address buyer
		isListed(_collection, _tokenId)
	{
		Listing memory listing = listedToken[_collection][_tokenId];
		uint256 price = listing.price;
		(
			uint256 amount,
			uint256 marketplaceFee,
			uint256 collectionFee
		) = feeCompiler(_collection, price, protocolFee);
		
		require(msg.value > price, "You dont have enough funds");

		//transfer to seller
		payable(listing.seller).transfer(amount);

		_delist(_collection, _tokenId);

		//track marketplace revenue and collection revenue
		_updateRevenue(marketplaceFee, collectionFee, _collection);
		IERC721(_collection).safeTransferFrom(
			address(this),
			_msgSender(),
			_tokenId
		);
		userLiqPts[_msgSender()] += 2;
		emit NFTSold(
			listing.seller,
			_collection,
			_msgSender(),
			_tokenId,
			msg.value
		);
	}

	function liquidateNft(
		address _collection,
		uint256 _tokenId
	)
		private
		isListed(_collection, _tokenId)
		isNftOwner(_collection, _tokenId)
	{
		uint256 minLiquidationPoint = collection[_collection].minLiquidatePoint;
		require(
			userLiqPts[_msgSender()] > minLiquidationPoint,
			"not enough points"
		);
		IERC721(_collection).safeTransferFrom(
			_msgSender(),
			address(this),
			_tokenId
		);
		userLiqPts[_msgSender()] -= minLiquidationPoint;
		//function calculate value of points
		// IERC20(_MMCToken).transfer()
		emit NFTLiquidated(_msgSender(), _collection, _tokenId);
	}

	//admin only

	function addCollection(
		address _collectionAddress,
		uint256 _royaltyFees,
		uint256 _minListing,
		uint256 _floorPrice,
		uint256 _minLiquidatePoint
	) external whenNotPaused onlyOwner {
		require(!collections.contains(_collectionAddress), "Collection exists");
		require(
			IERC721(_collectionAddress).supportsInterface(0x80ac58cd),
			"not supported"
		);
		require(_royaltyFees <= maxRoyaltyFees, "error inputing fees");
		collections.add(_collectionAddress);
		collection[_collectionAddress] = Collection(
			_collectionAddress,
			_royaltyFees,
			_minListing,
			collectionStatus.verified,
			_floorPrice,
			_minLiquidatePoint
		);
		emit CollectionAdded(
			_collectionAddress,
			_collectionAddress,
			_royaltyFees
		);
	}

	function updateCollection(
		address _collection,
		address _collectionAddress,
		uint256 _royaltyFees,
		uint256 _minListing,
		uint256 _floorPrice,
		uint256 _minLiquidatePoint
	) external whenNotPaused isSupportedCollection(_collection) onlyOwner {
		require(_royaltyFees <= maxRoyaltyFees, "error inputing fees");
		require(
			_msgSender() == collection[_collection].collectionAddress,
			"Only Collection admin can update"
		);
		collection[_collection] = Collection(
			_collectionAddress,
			_royaltyFees,
			_minListing,
			collectionStatus.verified,
			_floorPrice,
			_minLiquidatePoint
		);
		emit CollectionUpdated(_collection, _collectionAddress, _royaltyFees);
	}

	//shared functions
	function _delist(
		address _collection,
		uint256 _tokenId
	) private whenNotPaused {
		if (tokenIdExists[_collection].contains(_tokenId)) {
			delete (listedToken[_collection][_tokenId]);
			tokenIdExists[_collection].remove(_tokenId);
		}
	}

	//utils and internal

	function getPointsEthValue(
		uint256 _pointqty
	) private view returns (uint256 ethvalue) {
		ethvalue = curPointValue * _pointqty;
	}

	function feeCompiler(
		address _collection,
		uint256 _price,
		uint256 _protocolFee
	)
		public
		view
		returns (uint256 amount, uint256 marketplaceFee, uint256 collectionFee)
	{
		marketplaceFee = (_price * _protocolFee) / 100;
		collectionFee = (_price * collection[_collection].royaltyFees) / 100;
		amount = _price - (marketplaceFee + collectionFee);
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

	function getListing(
		address _collection,
		uint256 _tokenId
	) public view returns (Listing memory) {
		return listedToken[_collection][_tokenId];
	}

	function getCollectionData(
		address _collection
	) public view returns (Collection memory) {
		return collection[_collection];
	}

	receive() external payable {}

	//modifiers

	// check if contract caller is owner of NFT
	modifier isNftOwner(address _collection, uint256 _tokenId) {
		require(
			IERC721(_collection).ownerOf(_tokenId) == _msgSender(),
			"Caller != NFT Owner"
		);
		_;
	}
	//check if collection is verified
	modifier isVerifiedCollection(address _collection) {
		require(collections.contains(_collection), "Collection not supported");
		_;
	}

	modifier isPriceValid(uint256 _price, address _collection) {
		require(_price > 0, "Price must be > 0");
		require(
			_price > collection[_collection].minPrice,
			"cant List below the minimum threshold price"
		);
		_;
	}
	//confirm that NFT has not been listed on the marketplace
	modifier isNotListed(address _collection, uint256 _tokenId) {
		require(!tokenIdExists[_collection].contains(_tokenId), "NFT listed");
		// require(IERC721(_collection).owner(_tokenId) !== address(this), "NFT has been listed");
		_;
	}
	//confirm NFT has been listed on the marketplace
	modifier isListed(address _collection, uint256 _tokenId) {
		require(
			tokenIdExists[_collection].contains(_tokenId),
			"NFT not listed"
		);
		require(
			IERC721(_collection).ownerOf(_tokenId) == address(this),
			"NFT was not found"
		);

		_;
	}

	modifier isSupportedCollection(address _collection) {
		require(collections.contains(_collection), "Collection not supported");
		_;
	}

	//
	function onERC721Received(
		address,
		address from,
		uint256,
		bytes calldata
	) external pure override returns (bytes4) {
		// require(from !== address(0x0), "Cannot send nfts to Vault directly");
		return IERC721Receiver.onERC721Received.selector;
	}

	// Events
	event NFTListed(
		address indexed seller,
		address indexed collection,
		uint256 tokenId,
		uint256 price
	);
	event NFTDeListed(address indexed collection, uint256 tokenId);
	event NFTSold(
		address indexed seller,
		address indexed collection,
		address indexed buyer,
		uint256 tokenId,
		uint256 price
	);
	event NFTLiquidated(
		address indexed seller,
		address indexed collection,
		uint256 indexed token
	);
	event listingUpdated(
		address indexed owner,
		address indexed collection,
		uint256 tokenId,
		uint256 newPrice
	);
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
}
