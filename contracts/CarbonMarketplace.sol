// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CarbonCreditToken.sol";

contract CarbonMarketplace {

    CarbonCreditToken public token;

    struct Listing {
        address seller;
        uint256 totalAmount;      // 🔥 total listed
        uint256 remainingAmount;  // 🔥 remaining for sale
        uint256 pricePerCredit;   // 🔥 price per 1 credit
        bool active;
    }

    uint256 public listingCounter;
    mapping(uint256 => Listing) public listings;

    address public registry;

    event CreditsPurchased(
        uint256 listingId,
        address seller,
        address buyer,
        uint256 amount,
        uint256 totalPrice
    );

    constructor(address tokenAddress) {
        token = CarbonCreditToken(tokenAddress);
    }

    function setRegistry(address _registry) public {
        registry = _registry;
    }

    modifier onlyRegistry() {
        require(msg.sender == registry, "Only registry");
        _;
    }

    // ✅ LIST CREDITS
    function listCredits(uint256 amount, uint256 pricePerCredit) public {
        require(amount > 0, "Invalid amount");
        require(token.balanceOf(msg.sender) >= amount, "Not enough tokens");

        token.transferFrom(msg.sender, address(this), amount);

        listingCounter++;

        listings[listingCounter] = Listing(
            msg.sender,
            amount,
            amount,             // 🔥 remaining = total initially
            pricePerCredit,
            true
        );
    }

    // ✅ GET LISTING
    function getListing(uint256 listingId) public view returns (
        address seller,
        uint256 totalAmount,
        uint256 remainingAmount,
        uint256 pricePerCredit,
        bool active
    ) {
        Listing memory l = listings[listingId];

        return (
            l.seller,
            l.totalAmount,
            l.remainingAmount,
            l.pricePerCredit,
            l.active
        );
    }

    // ✅ PARTIAL BUY
    function buyCredits(uint256 listingId, uint256 amountToBuy) public payable {
        Listing storage listing = listings[listingId];

        require(listing.active, "Inactive");
        require(amountToBuy > 0, "Invalid amount");
        require(amountToBuy <= listing.remainingAmount, "Not enough available");

        // ✅ correct calculation
        uint256 totalPrice = (listing.pricePerCredit * amountToBuy) / 1e18;

        require(msg.value >= totalPrice, "Insufficient payment");

        // transfer tokens
        token.transfer(msg.sender, amountToBuy);

        // transfer ETH
        (bool success, ) = payable(listing.seller).call{value: msg.value}("");
        require(success, "Payment failed");

        // reduce listing
        listing.remainingAmount -= amountToBuy;

        // deactivate if empty
        if (listing.remainingAmount == 0) {
            listing.active = false;
        }

        emit CreditsPurchased(
            listingId,
            listing.seller,
            msg.sender,
            amountToBuy,
            totalPrice
        );
    }

    // ✅ REDUCE LISTING (for penalties)
    function reduceListing(address user, uint256 amount) public onlyRegistry {
        uint256 remaining = amount;

        for (uint256 i = 1; i <= listingCounter; i++) {
            Listing storage l = listings[i];

            if (l.seller == user && l.active) {

                if (l.remainingAmount > remaining) {
                    l.remainingAmount -= remaining;

                    token.burnFrom(address(this), remaining);
                    return;
                } 
                else {
                    remaining -= l.remainingAmount;

                    token.burnFrom(address(this), l.remainingAmount);

                    l.remainingAmount = 0;
                    l.active = false;
                }
            }
        }
    }
}