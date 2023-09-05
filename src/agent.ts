import { Finding, HandleTransaction } from "forta-agent";
import { detectWashTrade } from "./alert-frameworks/wash-trade-detection/handler";
import { checkForNftListing } from "./alert-frameworks/wash-trade-detection/alerts/tainted-asset-listed-alert";
import { detectAirdropFarm } from "./alert-frameworks/airdrop-farm-detection/airdrop-farm-handler";

const handleTransaction: HandleTransaction = async (txEvent) => {
  const findings: Finding[] = [];

  const washTradeFindings = await detectWashTrade(txEvent);
  if (washTradeFindings) {
    findings.push(...washTradeFindings);
  }

  const nftListingFindings = await checkForNftListing(txEvent);
  if (nftListingFindings) {
    findings.push(nftListingFindings);
  }

  const airdropFarmFindings = await detectAirdropFarm(txEvent);
  if (airdropFarmFindings) {
    findings.push(airdropFarmFindings);
  }

  return findings;
};

export default {
  handleTransaction,
};
