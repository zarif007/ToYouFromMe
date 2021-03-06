// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract PayloadPortal {
    uint256 totalPayloads;

    event NewPayload(address indexed from, address indexed to, string text, string url, uint256 timestamp);

    struct Payload {
        address sender; 
        address reciever;
        string text;
        string url; 
        uint256 timestamp; 
    }

    /*
     * I declare a variable waves that lets me store an array of structs.
     * This is what lets me hold all the waves anyone ever sends to me!
     */
    Payload[] payloads;


    constructor() payable {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function payload(address _to, string memory _text, string memory _url) public {
        totalPayloads += 1;

        payloads.push(Payload(msg.sender, _to, _text, _url, block.timestamp));

        emit NewPayload(msg.sender, _to, _text, _url, block.timestamp);

        uint256 prizeAmount = 0.0001 ether;
        
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
    }

    function getAllPayloads() public view returns (Payload[] memory) {
        return payloads;
    }

    function getTotalPayloads() public view returns (uint256) {
        console.log("We have %d total Payloads!", totalPayloads);
        return totalPayloads;
    }
}