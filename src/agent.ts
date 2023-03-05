import {
  Finding,
  HandleTransaction,
  FindingSeverity,
  FindingType,
  ethers,
} from "forta-agent";
import {
  isTracked,
  trackNft,
  getBuyer,
  getSeller,
  nftList,
  getNftWithOldestSale,
  deleteNft,
} from "./utils";
import {
  EXCHANGE_CONTRACT_ADDRESSES,
  EXCHANGE_TRADE_EVENTS,
  TRANSFER_EVENT,
  MAX_TOKENS,
} from "./constants";

const provider = new ethers.providers.EtherscanProvider(
  "goerli",
  process.env.ETHERSCAN_API_KEY
);

const loadConfig = () => {
  try {
    return require("./bot-config.json");
  } catch (e) {
    return require("../bot-config.json");
  }
};

const config = loadConfig();

const { nftCollectionAddress, nftCollectionName, nftExchangeName } = config;

const tradeEvent: string = EXCHANGE_TRADE_EVENTS[nftExchangeName];
const nftExchangeAddress: string = EXCHANGE_CONTRACT_ADDRESSES[nftExchangeName];

// returns the wallet address that funded the buyer wallet (ie, the first non-contract transaction to the buyer wallet)
export async function findFirstSender(
  buyerAddress: string
): Promise<string | undefined> {
  const txs = await provider.getHistory(buyerAddress);

  // Sorts the buyer transaction history by block number, ascending order
  txs.sort((a, b) => {
    if (a.blockNumber === undefined || b.blockNumber === undefined) {
      return 0;
    }
    return a.blockNumber - b.blockNumber;
  });

  // Find the first transaction that transferred funds to the buyer wallet
  const fundedBy = txs.find((tx) => tx.to === buyerAddress && tx.value.gt(0));

  if (!fundedBy) {
    // If no transaction transferred funds to the buyer, return undefined
    return undefined;
  }

  // Get the sender's address
  const sender = fundedBy.from;

  return sender;
}

export async function checkRelationship(
  buyer: string,
  seller: string
): Promise<Finding[]> {
  const results: Finding[] = [];

  console.log(`the seller is ${seller}`);

  const sender = await findFirstSender(buyer);
  console.log("Sender address:", sender);

  // checks to see if the first sender to the buyer wallet is the seller of the NFT
  if (sender && sender === seller) {
    const finding = Finding.fromObject({
      name: "NFT Wash Trade",
      description: `${nftCollectionName} Wash Trade on ${nftExchangeName}`,
      alertId: "NFT-WASH-TRADE",
      severity: FindingSeverity.Medium,
      type: FindingType.Suspicious,
      metadata: {
        buyer: buyer,
        seller: seller,
        tokenId: "test",
        collectionContract: nftCollectionAddress,
        collectionName: nftCollectionName,
        exchangeContract: nftExchangeAddress,
        exchangeName: nftExchangeName,
        salesCountSoFar: "test",
        firstSaleTimestampTracked: "test",
        salesHistory: "test",
      },
    });
    results.push(finding);
    console.log(
      `The buyer wallet ${buyer} was funded by the seller wallet ${seller}`
    );
  } else {
    console.log(
      `No prior relationship between buyer ${buyer} and seller ${seller}`
    );
  }
  return results;
}

const handleTransaction: HandleTransaction = async (txEvent) => {
  const findings: Finding[] = [];

  const tradeEvents = txEvent.filterLog(tradeEvent, nftExchangeAddress);
  const transferEvents = txEvent.filterLog(
    TRANSFER_EVENT,
    nftCollectionAddress
  );

  if (tradeEvents.length == transferEvents.length) {
    for (let i = 0; i < transferEvents.length; i++) {
      const transfer = transferEvents[i];
      const saleTimestamp = txEvent.timestamp;
      const buyer = getBuyer(transfer);
      const seller = getSeller(transfer);
      if (isTracked(transfer)) {
        const transferFindings = await checkRelationship(buyer, seller);
        findings.push(...transferFindings);
      } else {
        trackNft(transfer, saleTimestamp);
        if (nftList.length > MAX_TOKENS) {
          const tokenId = getNftWithOldestSale();
          deleteNft(tokenId);
        }
      }
    }
  }

  return findings;
};

export default {
  handleTransaction,
  findFirstSender,
  checkRelationship,
};
