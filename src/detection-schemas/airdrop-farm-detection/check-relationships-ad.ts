import { getProviderForNetwork } from "../../agent-config/network-config";
import { Network } from "forta-agent";
import { sequenceDetect } from "./sequential-detection";
import { Finding } from "forta-agent";
import { detectFarmer } from "../../alerts/airdrop-farmer-found-alert";
import { createOrAddToCluster } from "../../database/cluster-logic";

export async function checkAirdropRelationship(
  origin: string,
  network: Network
): Promise<Finding[]> {
  console.log(`checking relationship`);
  const results: Finding[] = [];

  const { allAddr, botCluster } = await sequenceDetect(origin, network);

  if (allAddr.size > 10) {
    let finding: Finding;
    finding = detectFarmer();
    results.push(finding);
    await createOrAddToCluster(Array.from(allAddr), "placeholder");
  }
  return results;
}
