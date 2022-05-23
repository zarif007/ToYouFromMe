// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract PayloadPortal {
    uint256 totalPayloads;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function payload() public {
        totalPayloads += 1;
        console.log("%s has waved!", msg.sender);
    }

    function getTotalPayloads() public view returns (uint256) {
        console.log("We have %d total Payloads!", totalPayloads);
        return totalPayloads;
    }
}