
//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YourContract is Ownable{
	// State Variables
	address public immutable collectionAddress;
    uint256 floorPrice;
    uint256 totalLiquidity;

    mapping (uint => uint) nftTradingVolume;
    mapping (address => uint) userTradingVolume;


	constructor(address _collectionAddress, uint256 _floorPrice ) {
        collectionAddress = _collectionAddress;
        floorPrice = _floorPrice;
	}



    function List (uint256 _price, uint256 nftId) public {

    }

     function DeList (uint256 _price, uint256 nftId) public {

    }

     function   Buy (uint256 _price, uint256 nftId) public {

    }



	function withdraw() public onlyOwner {
		(bool success, ) = msg.sender.call{ value: address(this).balance }("");
		require(success, "Failed to send Ether");
	}
	receive() external payable {}
}
