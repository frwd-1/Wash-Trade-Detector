![hydra](./images/defender.png)

# Sybil Defender Overview

The Sybil Defender is a real-time, on-chain monitoring application built on the Forta Network that protects users, investors, and protocols from Sybil attacks in DeFi. The Sybil Defender currently covers two subcategories of Sybil attacks commonly found in DeFi - Airdrop Farming and NFT Wash Trading.

## Background

Sybil attacks in DeFi are characterized by the ability any single user has to create an arbitrary number of user accounts (wallets) that they alone control. This has allowed some users to gain an outsized advantage in DeFi networks at the expense of the network as a whole. In the case of NFTs, Sybil attackers engage in Wash Trading by trading assets between two or more wallets that they control in order to artificially inflate the price of the asset, then resell it back to the unsuspecting DeFi community. Sybil attackers also engage in Airdrop Farming by creating a chain of dozens or sometimes hundreds of wallets, controlled by a single person, that qualify for an airdrop and draining that protocol of funds that would otherwise be allocated toward building a legitimate user base.

The solution in traditional finance has ordinarily been to require customers provide Know Your Customer (KYC) verification, essentially verifying customers' identity as well as their status as a trusted entity. DeFi has generally been opposed to KYC verification given its inherent requirement that a user's identity be verified by a central authority or otherwise trusted third party.

Given the public nature of on-chain activity, however, protocols and users can choose who they interact with based on some criteria that they determine. The Sybil Defender uncovers activity indicative of Sybil attacks, and simply allows protocols and users to decide whether or not to transact with Sybil attackers. This enables investors to make better decisions based on whether an asset's historical activity is genuine, or artificially inflated. It helps protocols build communities of legitimate users. And it helps the DeFi community as a whole build infrastructure that is trusted and secure.

## Methodology

The Sybil Defender monitors transactions for all supported chains via the Forta SDK and node operators on the Forta Network.

I) agent.ts - handles transactions initially and runs them through a series of functions

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

The bot behavior can be verified using jest by running: npm run test

The bot behavior can also be verified on Goerli testnet with the following steps:

1. set the bot-config.json to the following test NFT contract and marketplace:
   {
   "nftCollectionName": "BasicNft",
   "nftCollectionAddress": "0xa0AA720a441e62B0bEedA2db452cb728E9AEA6B1",
   "nftExchangeName": "NftMarketplace"
   }

2. set the etherscan provider on ln18 in agent.ts to "goerli"
3. set chain ID in ln5 of package.json to 5
4. update forta.config.json ln2 to goerli jsonRpcUrl
5. run the following:

```bash
$ npm run validate-config
$ npm run tx 0x6187fe36ae6f499de089a100cbfa27173e63bd2f07f362ecbb76569c0e99e620

...
the seller wallet 0xa4D77537852444C4cB3CE8Df1D5144C65d458088 was used to fund the buyer wallet 0xd1f322CD8e0F2af195ace36644056e20aa628b06
1 findings for transaction 0x6187fe36ae6f499de089a100cbfa27173e63bd2f07f362ecbb76569c0e99e620 {
  "name": "NFT Wash Trade",
  "description": "BasicNft Wash Trade on NftMarketplace",
  "alertId": "NFT-WASH-TRADE",
  "protocol": "ethereum",
  "severity": "Medium",
  "type": "Suspicious",
  "metadata": {
    "BuyerWallet": "0xd1f322CD8e0F2af195ace36644056e20aa628b06",
    "SellerWallet": "0xa4D77537852444C4cB3CE8Df1D5144C65d458088",
    "token": "Wash Traded NFT Token ID: 8",
    "collectionContract": "0xa0AA720a441e62B0bEedA2db452cb728E9AEA6B1",
    "collectionName": "BasicNft",
    "exchangeContract": "0x3819579b236e5Ab5C695DD4762c2B18bB0Aee1c8",
    "exchangeName": "NftMarketplace",
    "anomalyScore": "100% of total trades observed for BasicNft are possible wash trades"
  },
  "addresses": [],
  "labels": [
    {
      "entityType": "Address",
      "entity": "0xa4D77537852444C4cB3CE8Df1D5144C65d458088",
      "label": "attacker",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "0xd1f322CD8e0F2af195ace36644056e20aa628b06",
      "label": "attacker",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "0xa0AA720a441e62B0bEedA2db452cb728E9AEA6B1",
      "label": "Wash traded NFT at address 0xa0AA720a441e62B0bEedA2db452cb728E9AEA6B1 with Token ID 8",
      "confidence": 0.9,
      "remove": false
    }
  ]
}
```
