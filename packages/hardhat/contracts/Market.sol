
//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract GeneralMarket is Context, Ownable, Pausable, ReentrancyGuard {

    	// State Variables
        uint32 protocolFee; //normal intergers, not percentage, eg, 10 for 10%
        address tradeToken;
        address revenueCollector;
        //variables libraries
        using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;

        //data types
        enum collectionStatus {
            notVerified,
            verified
        }
	constructor(address _collectionAddress, uint256 _floorPrice ) {
    
	}

    struct Listing {
         address seller;
        uint256 price;
    }
     struct Collection {
        address collectionAddress;
        uint256 royaltyFees;  //normal intergers, not percentage, eg, 10 for 10%
        uint256 minPrice;
        collectionStatus status;
    }

    EnumerableSet.AddressSet private collections;
//collection==>tokenId==>Listing
    mapping(address => mapping(uint256 => Listing)) private listedToken;

     mapping(address => EnumerableSet.UintSet) private tokenIdExists;

     mapping(address => Collection) private collection;

     mapping(address => uint256) private revenue;


    //Seller typical activities
    function list(
        address _collection,
        uint256 _tokenId,
        uint256 _price
    )
        public
        whenNotPaused
        isCollection(_collection)
        isNftOwner(_collection, _tokenId)
        isNotListed(_collection, _tokenId)
        isPriceValid(_price, _collection)
    {
        Listing memory listing = Listing(_msgSender(), _price);
        listedToken[_collection][_tokenId] = listing;
        tokenIdExists[_collection].add(_tokenId);
        (bool success) = IERC721(_collection).safeTransferFrom(_msgSender(), address(this), _tokenId);
        require (success, "NFT Transfer to contract was unsuccessful");
        emit NFTListed(_msgSender(), _collection, _tokenId, _price);
    }

     function delist(
        address _collection,
        uint256 _tokenId
    ) public isListed(_collection, _tokenId) whenNotPaused {
        require(listedToken[_collection][_tokenId].seller == _msgSender(),  "User didnt listed the NFT");
         (bool success) = IERC721(_collection).safeTransferFrom( address(this), _msgSender(), _tokenId);
        require (success, "NFT Transfer to user was unsuccessful");
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

    //buy

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
        ) = feeCompiler(_collection, _price, protocolFee);
        address seller = listing.seller;
        _delist(_collection, _tokenId);
        _updateRevenue(marketplaceFee, collectionFee, _collection);
        IERC20(tradeToken).safeTransfer(seller, amount);
        IERC721(_collection).safeTransferFrom(address(this), buyer, _tokenId);
        emit NFTSold(seller, _collection, buyer, _tokenId, _price);
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




    //utils
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
       modifier isCollection(address _collection) {
        require(collections.contains(_collection), "Collection not supported");
        _;
    }

    modifier isPriceValid(uint256 _price, address _collection) {
        require(_price > 0, "Price must be > 0");
        require (_price> collection[_collection].minPrice, "cant List below the minimum threshold price");
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
        require(IERC721(_collection).owner(_tokenId) == address(this), "NFT was not found");
        
        _;
    }
    // Events
     event NFTListed(
        address indexed seller,
        address indexed collection,
        uint256 tokenId,
        uint256 price
    );
      event NFTDeListed(
        address indexed collection,
        uint256 tokenId
    );
    event NFTSold(
        address indexed seller,
        address indexed collection,
        address indexed buyer,
        uint256 tokenId,
        uint256 price
    );
     event listingUpdated(
        address indexed owner,
        address indexed collection,
        uint256 tokenId,
        uint256 newPrice
    );
}
