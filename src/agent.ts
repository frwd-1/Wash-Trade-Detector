import { Finding, HandleTransaction } from "forta-agent";
import { detectWashTrade } from "./detection-schemas/wash-trade-detection/handler";
import { checkForNftListing } from "./alerts/tainted-asset-listed-alert";
import { detectAirdropFarm } from "./detection-schemas/airdrop-farm-detection/airdrop-farm-handler";

const handleTransaction: HandleTransaction = async (txEvent) => {
  const findings: Finding[] = [];

  console.log("checking wash trade...");
  const washTradeFindings = await detectWashTrade(txEvent);
  if (washTradeFindings) {
    findings.push(...washTradeFindings);
  }

  console.log("checking nft listing...");
  const nftListingFindings = await checkForNftListing(txEvent);
  if (nftListingFindings) {
    findings.push(nftListingFindings);
  }

  console.log("checking for airdrop farm...");
  const airdropFarmFindings = await detectAirdropFarm(txEvent);
  if (airdropFarmFindings) {
    findings.push(...airdropFarmFindings);
  }

  return findings;
};

export default {
  handleTransaction,
};
