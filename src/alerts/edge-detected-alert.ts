import { Finding, FindingSeverity, FindingType, EntityType } from "forta-agent";
import { Address } from "hardhat-deploy/dist/types";

export function detectEdge(
  seller: Address,
  buyer: Address,
  tokenId: Address,
  numberOfTrades: number,
  numberOfWashTrades: number
) {
  return Finding.fromObject({
    name: "NFT Wash Trade",
    description: `NFT Wash Trade detected - wallets controlled by the same cluster`,
    alertId: "NFT-WASH-TRADE",
    severity: FindingSeverity.Medium,
    type: FindingType.Suspicious,
    labels: [
      {
        entityType: EntityType.Address,
        entity: seller,
        label: "cluster",
        confidence: 0.9,
        remove: false,
        metadata: {},
      },
      {
        entityType: EntityType.Address,
        entity: buyer,
        label: "cluster",
        confidence: 0.9,
        remove: false,
        metadata: {},
      },
    ],
    metadata: {
      BuyerWallet: buyer,
      SellerWallet: seller,
      token: tokenId,
      anomalyScore: `${numberOfWashTrades / numberOfTrades}`,
    },
  });
}
