// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract STLToken is ERC20, Ownable, AccessControl {
    bytes32 public constant USE_ROLE = keccak256("USE_ROLE");
    address private _owner;

    constructor(
        uint256 initialSupply
    ) ERC20("STLToken", "STL") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** 18);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _owner = payable(msg.sender);
    }

    function grantRoleUse(address _to) public onlyOwner {
        require(_to != address(0), "Invalid address");
        require(!hasRole(USE_ROLE, _to), "Role already granted");
        grantRole(USE_ROLE, _to);
    }

    function revokeRoleUse(address _to) public onlyOwner {
        require(
            hasRole(USE_ROLE, _to),
            "This address does not have the role of use"
        );
        revokeRole(USE_ROLE, _to);
    }

    function mint(address to, uint256 quantity) public onlyRole(USE_ROLE) {
        _mint(to, quantity);
    }
}
