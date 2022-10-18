// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ScoreToken is ERC20, Ownable {
    constructor(string memory _name) ERC20(_name, "SCR") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256
    ) internal pure override(ERC20) {
        require(
            from == address(0) || to == address(0),
            "Only minting and burning"
        );
    }
}
