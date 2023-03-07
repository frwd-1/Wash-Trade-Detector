# NFT Wash Trade Bot Overview

This bot returns an alert that indicates, with a relatively high degree of confidence, that a wash trade has occurred. According to a recent report by Chainalysis (https://blog.chainalysis.com/reports/2022-crypto-crime-report-preview-nft-wash-trading-money-laundering/), wash trades can often be identified by looking for NFT sales that were "self-financed", meaning the address of the purchaser was initially funded by the address of the seller.

## Supported Chains

- Ethereum

## Alerts

- NFT-WASH-TRADE
  - Fired when an NFT was bought by a wallet address that was funded by the seller address
  - Severity is always set to "medium"
  - Type is always set to "suspicious"

## Test Data

The bot behavior can be verified with the following transaction:

```bash
$ npm run tx 0x172c781eeabf4b2529384b867c0de76a6f415a690ec79e930eb79899dc51db27
...
attacker used the seller wallet 0xa4D77537852444C4cB3CE8Df1D5144C65d458088 to fund the buyer wallet 0xd1f322CD8e0F2af195ace36644056e20aa628b06
1 findings for transaction 0x172c781eeabf4b2529384b867c0de76a6f415a690ec79e930eb79899dc51db27 {
  "name": "NFT Wash Trade",
  "description": "BasicNft Wash Trade on NftMarketplace",
  "alertId": "NFT-WASH-TRADE",
  "protocol": "ethereum",
  "severity": "Medium",
  "type": "Suspicious",
  "metadata": {
    "attackerBuyerWallet": "0xd1f322CD8e0F2af195ace36644056e20aa628b06",
    "attackerSellerWallet": "0xa4D77537852444C4cB3CE8Df1D5144C65d458088",
    "token": "Wash Traded NFT Token ID: 0",
    "collectionContract": "0xa0AA720a441e62B0bEedA2db452cb728E9AEA6B1",
    "collectionName": "BasicNft",
    "exchangeContract": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "exchangeName": "NftMarketplace"
  }
}
```
