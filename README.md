![hydra](./images/defender.png)

# Sybil Defender Overview

The Sybil Defender is a real-time, on-chain monitoring application built on the Forta Network that protects users and protocols from Sybil attacks in DeFi. The Sybil Defender currently covers two subcategories of Sybil attacks commonly found in DeFi - Airdrop Farming and NFT Wash Trading. Protocols can use the Sybil Defender to

## Background

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
