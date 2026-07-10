// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CarbonCreditToken.sol";
import "./CarbonMarketplace.sol";

contract EmissionRegistry {

    uint256 public emissionCap = 100;

    CarbonCreditToken public token;
    CarbonMarketplace public marketplace;

    struct EmissionRecord {
        uint256 timestamp;
        uint256 emissionAmount;
        int256 creditsChange;
    }

    mapping(address => EmissionRecord[]) private records;
    mapping(address => bool) public registered;

    event CompanyRegistered(address company);
    event EmissionRecorded(address company, uint256 amount);
    event CreditsUpdated(address company, int256 creditsChange);

    // ✅ UPDATED CONSTRUCTOR
    constructor(address tokenAddress, address marketAddress) {
        token = CarbonCreditToken(tokenAddress);
        marketplace = CarbonMarketplace(marketAddress);
    }

    function registerCompany() public {
        require(!registered[msg.sender], "Already registered");
        registered[msg.sender] = true;

        emit CompanyRegistered(msg.sender);
    }

    function recordEmission(uint256 value) public {
        require(registered[msg.sender], "Not registered");

        int256 creditsChange = 0;

        if (value < emissionCap) {
            uint256 reward = emissionCap - value;

            token.mint(msg.sender, reward * 1e18);
            creditsChange = int256(reward);

        } 
        else if (value > emissionCap) {

            uint256 penalty = value - emissionCap;
            uint256 penaltyAmount = penalty * 1e18;

            uint256 walletBalance = token.balanceOf(msg.sender);

            if (walletBalance >= penaltyAmount) {
                token.burnFrom(msg.sender, penaltyAmount);
            } 
            else {
                // burn all wallet first
                token.burnFrom(msg.sender, walletBalance);

                uint256 remaining = penaltyAmount - walletBalance;

                // 🔥 NEW: reduce from marketplace listings
                marketplace.reduceListing(msg.sender, remaining);
            }

            creditsChange = -int256(penalty);
        }

        records[msg.sender].push(
            EmissionRecord({
                timestamp: block.timestamp,
                emissionAmount: value,
                creditsChange: creditsChange
            })
        );

        emit EmissionRecorded(msg.sender, value);
        emit CreditsUpdated(msg.sender, creditsChange);
    }

    function getMyRecords() public view returns (EmissionRecord[] memory) {
        return records[msg.sender];
    }
}