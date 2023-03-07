# NFT Wash Trade Bot Overview

Builds on prior work done on the NFT Wash Trade forta bot template (https://github.com/forta-network/forta-bot-templates/tree/main/nft-wash-trade) which was originally designed to detect an address that had owned the same NFT more than once. This bot adjusts and expands on that work as follows:

The objective of this bot is to return an alert that indicates, with a relatively high degree of confidence, that a wash trade has occurred. According to a recent report by Chainalysis (https://blog.chainalysis.com/reports/2022-crypto-crime-report-preview-nft-wash-trading-money-laundering/), wash trades can often be identified by looking for NFT sales that were "self-financed", meaning the address of the purchaser was initially funded by the address of the seller.

## Bot Structure

The bot analyzes transactions using 3 core functions:

    1. handleTransaction - maintains a running list of tracked NFTs, if an NFT is being tracked and it is traded, it calls the checkRelationship function passing the "buyer" and "seller" as arguments

    2. checkRelationship - calls the findFirstSender function that returns a "sender" and compares that sender to see if it is the same address as the seller of the NFT. If the sender is the seller, it returns a finding

    3. findFirstSender - checks the transaction history of the "buyer" of the NFT and returns the "sender" address that first funded the buyer's wallet

### Testing

Unit tests for Bot functionality are in the tests folder.
