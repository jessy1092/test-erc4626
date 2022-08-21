// contracts/TWDF.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// Import ERC20 from the OpenZeppelin Contracts library
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Make TWDF inherit from the ERC20 contract
contract TWDF is ERC20 {
    constructor() ERC20("Fake TWD", "TWDF") {
        uint256 n = 100000000;
        _mint(msg.sender, n * 10**uint256(decimals()));
    }

    function mint(address account) public virtual {
        uint256 n = 10000;
        _mint(account, n * 10**uint256(decimals()));
    }
}
