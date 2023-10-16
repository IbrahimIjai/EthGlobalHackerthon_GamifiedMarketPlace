
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

contract GeneralMarket is Ownable, Pausable, ReentrancyGuard, Context{

    	// State Variables
        uint32 protocolFee;

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
        uint256 royaltyFees;
        uint256 minPrice;
        Status status;
    }

    EnumerableSet.AddressSet private collections;
//collection==>tokenId==>Listing
    mapping(address => mapping(uint256 => Listing)) private listedToken;

     mapping(address => EnumerableSet.UintSet) private tokenIdExists;

     mapping(address => Collection) private collection;

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
        isPriceValid(_price)
    {
        Listing memory listing = Listing(_msgSender(), _price);
        listedToken[_collection][_tokenId] = listing;
        tokenIdExists[_collection].add(_tokenId);
        emit ItemListed(_msgSender(), _collection, _tokenId, _price);
    }

    // function list (uint256 _price, uint256 nftId) public {

    // }

     function deList (uint256 _price, uint256 nftId) public {

    }

     function  Buy (uint256 _price, uint256 nftId) public {

    }



	function withdraw() public onlyOwner {
		(bool success, ) = msg.sender.call{ value: address(this).balance }("");
		require(success, "Failed to send Ether");
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

    modifier isPriceValid(uint256 _price) {
        require(_price > 0, "Price must be > 0");
        _;
    }
    // Events


}
