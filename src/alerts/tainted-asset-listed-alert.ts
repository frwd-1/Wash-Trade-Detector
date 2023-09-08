// Alert intended for decentralized NFT exchange

import {
  Finding,
  FindingSeverity,
  FindingType,
  TransactionEvent,
} from "forta-agent";
import { isAssetHighRisk } from "../database/db-utils";

export async function checkForNftListing(
  txEvent: TransactionEvent
): Promise<Finding | null> {
  // Check if the address is in a cluster
  const inTable = await isAssetHighRisk(String(txEvent.to));
  if (inTable) {
    return Finding.fromObject({
      name: "NFT Listing from Clustered Address",
      description: `Address from cluster listed an NFT for sale`,
      alertId: "NFT-CLUSTER-LISTING",
      severity: FindingSeverity.Medium,
      type: FindingType.Suspicious,
    });
  }
  return null;
}
