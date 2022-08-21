// contracts/TWDF.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// Import ERC20 from the OpenZeppelin Contracts library
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Make TWDFVault inherit from the ERC4626 contract
contract TWDFVault is ERC20, ERC4626 {
    constructor(IERC20Metadata asset_)
        ERC20("Fake TWD Vault", "vTWDF")
        ERC4626(asset_)
    {}
}
