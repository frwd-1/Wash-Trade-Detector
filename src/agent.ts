import { Finding, HandleTransaction } from "forta-agent";
import { detectWashTrade } from "./alert-frameworks/wash-trade-detection/alerts/asset-wash-traded-alert";
import { checkForNftListing } from "./alert-frameworks/wash-trade-detection/alerts/tainted-asset-listed-alert";

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

  return findings;
};

export default {
  handleTransaction,
};
