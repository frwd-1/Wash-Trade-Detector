![hydra](./images/defender.png)

# Sybil Defender Overview

The Sybil Defender is a real-time, on-chain monitoring application built on the Forta Network that protects users, investors, and protocols from Sybil attacks in DeFi. The Sybil Defender currently covers two subcategories of Sybil attacks commonly found in DeFi - Airdrop Farming and NFT Wash Trading.

## Background

Sybil attacks in DeFi are characterized by the ability any single user has to create an arbitrary number of user accounts (wallets) that they alone control. This has allowed some users to gain an outsized advantage in DeFi networks at the expense of the network as a whole. In the case of NFTs, Sybil attackers engage in Wash Trading by trading assets between two or more wallets that they control in order to artificially inflate the price of the asset, then resell it back to the unsuspecting DeFi community. Sybil attackers also engage in Airdrop Farming by creating a chain of dozens or sometimes hundreds of wallets, controlled by a single person, that qualify for an airdrop and draining that protocol of funds that would otherwise be allocated toward building a legitimate user base.

The solution in traditional finance has ordinarily been to require customers provide Know Your Customer (KYC) verification, essentially verifying customers' identity as well as their status as a trusted entity. DeFi has generally been opposed to KYC verification given its inherent requirement that a user's identity be verified by a central authority or otherwise trusted third party.

Given the public nature of on-chain activity, however, protocols and users can choose who they interact with based on some criteria that they determine. The Sybil Defender uncovers activity indicative of Sybil attacks, and simply allows protocols and users to decide whether or not to transact with Sybil attackers. This enables investors to make better decisions based on whether an asset's historical activity is genuine, or artificially inflated. It helps protocols build communities of legitimate users. And it helps the DeFi community as a whole build infrastructure that is trusted and secure.

## Methodology

The Sybil Defender monitors transactions for all supported chains via the Forta SDK and node operators on the Forta Network.

- agent.ts - handles transactions initially and runs them through a series of high-level functions that will check Sybil typologies including Airdrop Farming

## Supported Chains

- Ethereum
- Arbitrum
- Avalanche
- Polygon
- Optimism
- Fantom

## Alerts

- NFT-WASH-TRADE
  - Fired when an NFT was bought by a wallet address that was funded by the seller address
  - Severity is always set to "medium"
  - Type is always set to "suspicious"

## Test Data
