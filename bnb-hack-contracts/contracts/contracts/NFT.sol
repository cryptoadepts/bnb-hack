// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC1155, Ownable {
    uint public lastItemId;
    mapping(uint => uint) public values;

    event CreateItem(uint _id, uint _value);

    constructor(string memory _uri) ERC1155(_uri) {}

    function _beforeTokenTransfer(
        address,
        address from,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) internal pure override {
        require(from == address(0), "Only minting and burning");
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function createItem(uint256 value, string memory newuri) public onlyOwner {
        values[lastItemId] = value;

        uint id = lastItemId;
        lastItemId++;

        _setURI(newuri);
        emit CreateItem(id, value);
        emit URI(newuri, id);
    }

    function mint(address account, uint256 id) public onlyOwner {
        require(id < lastItemId, "POAP is not active");

        _mint(account, id, 1, "");
    }
}
