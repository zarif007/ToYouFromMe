// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract PayloadPortal {
    uint256 totalPayloads;

    event NewPayload(address indexed from, string text, string url, uint256 timestamp);

    struct Payload {
        address sender; 
        string text;
        string url; 
        uint256 timestamp; 
    }

    /*
     * I declare a variable waves that lets me store an array of structs.
     * This is what lets me hold all the waves anyone ever sends to me!
     */
    Payload[] payloads;


    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function payload(string memory _text, string memory _url) public {
        totalPayloads += 1;

        payloads.push(Payload(msg.sender, _text, _url, block.timestamp));

        emit NewPayload(msg.sender, _text, _url, block.timestamp);
    }

    function getAllPayloads() public view returns (Payload[] memory) {
        return payloads;
    }

    function getTotalPayloads() public view returns (uint256) {
        console.log("We have %d total Payloads!", totalPayloads);
        return totalPayloads;
    }
}