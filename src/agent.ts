import {
  Finding,
  HandleTransaction,
  FindingSeverity,
  FindingType,
  ethers,
  LogDescription,
} from "forta-agent";
import { getBuyer, getSeller, getNftId } from "./utils";
import {
  EXCHANGE_CONTRACT_ADDRESSES,
  EXCHANGE_TRADE_EVENTS,
  TRANSFER_EVENT,
} from "./constants";

const provider = new ethers.providers.EtherscanProvider(
  "mainnet",
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
async function findFirstSender(
  buyerAddress: string
): Promise<string | undefined> {
  const txs = await provider.getHistory(buyerAddress);

  if (!txs.length) {
    // If there is no transaction history, return undefined
    return undefined;
  }

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

async function checkRelationship(transfer: LogDescription): Promise<Finding[]> {
  const results: Finding[] = [];

  const buyer = getBuyer(transfer);
  const seller = getSeller(transfer);
  console.log(`buyer is ${buyer}`);
  console.log(`seller is ${seller}`);

  const tokenId = getNftId(transfer);
  const sender = await findFirstSender(buyer);

  if (sender && sender === seller) {
    const finding = Finding.fromObject({
      name: "NFT Wash Trade",
      description: `${nftCollectionName} Wash Trade on ${nftExchangeName}`,
      alertId: "NFT-WASH-TRADE",
      severity: FindingSeverity.Medium,
      type: FindingType.Suspicious,
      metadata: {
        attackerBuyerWallet: buyer,
        attackerSellerWallet: seller,
        token: `Wash Traded NFT Token ID: ${tokenId}`,
        collectionContract: nftCollectionAddress,
        collectionName: nftCollectionName,
        exchangeContract: nftExchangeAddress,
        exchangeName: nftExchangeName,
        // anomalyScore:
        //   "x% of trading volume for NFT(tokenId) has alerted for possible wash trading in the past 30 days",
      },
    });
    console.log(
      `attacker used the seller wallet ${seller} to fund the buyer wallet ${buyer}`
    );
    results.push(finding);
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

  // check that the transfers are for the trades
  if (tradeEvents.length == transferEvents.length) {
    for (let i = 0; i < transferEvents.length; i++) {
      const transfer = transferEvents[i];

      const transferFindings = await checkRelationship(transfer);
      findings.push(...transferFindings);
    }
  }

  return findings;
};

export default {
  handleTransaction,
};
