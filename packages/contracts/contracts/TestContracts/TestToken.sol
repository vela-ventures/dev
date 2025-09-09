// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable {
    constructor(uint256 initialSupply) public ERC20("Arweave", "AR") {
        _mint(msg.sender, initialSupply);
    }

    // Optional: allow owner to mint more tokens later
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
