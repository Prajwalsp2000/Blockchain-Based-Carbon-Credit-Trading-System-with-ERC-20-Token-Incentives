//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CarbonCreditToken is ERC20 {

    address public registry;

    constructor() ERC20("Carbon Credit", "CCT") {}

    // ✅ SET REGISTRY
    function setRegistry(address _registry) public {
        registry = _registry;
    }

    // ✅ ONLY REGISTRY CAN MINT
    function mint(address to, uint256 amount) public {
        require(msg.sender == registry, "Only registry");
        _mint(to, amount);
    }

    // ✅ BURN
    function burnFrom(address from, uint256 amount) public {
        _burn(from, amount);
    }
}



