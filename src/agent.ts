import { Finding, HandleTransaction } from "forta-agent";
import { detectWashTrade } from "./alert-frameworks/asset-wash-traded-nft";
// import { checkForNftListing } from "./alert-frameworks/tainted-asset-listed-nft";

const handleTransaction: HandleTransaction = async (txEvent) => {
  const findings: Finding[] = [];

  const washTradeFindings = await detectWashTrade(txEvent);
  if (washTradeFindings) {
    findings.push(...washTradeFindings);
  }

  // const nftListingFindings = await checkForNftListing(txEvent);
  // if (nftListingFindings) {
  //   allFindings.push(nftListingFindings);
  // }

  return findings;
};

export default {
  handleTransaction,
};
