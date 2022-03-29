// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/**
 * @dev LEARN is a implementation of governance token of Learnverse ecosystem.
 */
contract LEARN is Ownable, ERC20, ERC20Permit, ERC20Votes {
    constructor(uint256 initialAmount_)
        ERC20("Learnverse ecosystem token", "LEARN")
        ERC20Permit("Learnverse ecosystem token")
    {
        _mint(_msgSender(), initialAmount_);
    }

    /**
     * @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply. And only the treasury of Learnverse can mint LEARN.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `msgSender`, reducing the
     * total supply.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - `msgSender` must have at least `amount` tokens.
     */
    function burn(uint256 amount) external {
        _burn(_msgSender(), amount);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }
}
