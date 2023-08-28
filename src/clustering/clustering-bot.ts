import { getClusterIdForAddress } from "../database/db-controller";
import { addAddressToCluster } from "../database/db-controller";

let currentClusterId: number = 0;

export async function createOrAddToCluster(
  addresses: string[],
  dateTime: string
): Promise<number> {
  // 1. Check if any of the addresses already belong to a cluster
  const existingClusterId = await getExistingClusterId(addresses);

  // 2. If they do, use that cluster. Otherwise, create a new cluster.
  const clusterId = existingClusterId ? existingClusterId : ++currentClusterId;

  // 3. Add addresses to the cluster
  for (const address of addresses) {
    await addAddressToCluster(clusterId, address, dateTime);
  }

  return clusterId;
}

async function getExistingClusterId(
  addresses: string[]
): Promise<number | null> {
  for (const address of addresses) {
    const clusterId = await getClusterIdForAddress(address);
    if (clusterId) return clusterId;
  }
  return null;
}
