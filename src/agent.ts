import {
  Finding,
  HandleTransaction,
  FindingSeverity,
  FindingType,
  ethers,
  LogDescription,
  EntityType,
} from "forta-agent";
import { getBuyer, getSeller, getNftId } from "./utils";
import {
  EXCHANGE_CONTRACT_ADDRESSES,
  // EXCHANGE_CONTRACT_ADDRESSES,
  EXCHANGE_TRADE_EVENTS,
  TRANSFER_EVENT,
} from "./constants";

const provider = new ethers.providers.EtherscanProvider(
  "mainnet",
  process.env.ETHERSCAN_API_KEY
);

// const loadConfig = () => {
//   try {
//     return require("./bot-config.json");
//   } catch (e) {
//     return require("../bot-config.json");
//   }
// };

// const config = loadConfig();

// const { nftCollectionAddress, nftCollectionName, nftExchangeName } = config;
const nftCollectionAddress = "test";
const nftCollectionName = "test";
const nftExchangeName = "test";

// const exchangeAddresses = Object.values(EXCHANGE_CONTRACT_ADDRESSES);
const exchangeTrades = Object.values(EXCHANGE_TRADE_EVENTS);
// const exchangeAddresses = Object.values(EXCHANGE_CONTRACT_ADDRESSES);
// const exchangeAddressFilters = Object.values(EXCHANGE_CONTRACT_ADDRESSES).map(
//   (address) => ({
//     address: address.toLowerCase(),
//   })
// );

let numberOfTrades: number = 0;
let numberOfWashTrades: number = 0;

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

  async function countTrades(): Promise<void> {
    numberOfTrades++;
  }

  async function countWashTrades(): Promise<void> {
    numberOfWashTrades++;
  }

  countTrades();
  console.log(numberOfTrades);

  const buyer = getBuyer(transfer);
  const seller = getSeller(transfer);
  console.log(`buyer is ${buyer}`);
  console.log(`seller is ${seller}`);

  const tokenId = getNftId(transfer);
  const sender = await findFirstSender(buyer);

  if (sender && sender === seller) {
    countWashTrades();
    const finding = Finding.fromObject({
      name: "NFT Wash Trade",
      description: `${nftCollectionName} Wash Trade on ${nftExchangeName}`,
      alertId: "NFT-WASH-TRADE",
      severity: FindingSeverity.Medium,
      type: FindingType.Suspicious,
      labels: [
        {
          entityType: EntityType.Address,
          entity: seller,
          label: "attacker",
          confidence: 0.9,
          remove: false,
        },
        {
          entityType: EntityType.Address,
          entity: buyer,
          label: "attacker",
          confidence: 0.9,
          remove: false,
        },
        {
          entityType: EntityType.Address,
          entity: nftCollectionAddress,
          label: `Wash traded NFT at address ${nftCollectionAddress} with Token ID ${tokenId}`,
          confidence: 0.9,
          remove: false,
        },
      ],
      metadata: {
        BuyerWallet: buyer,
        SellerWallet: seller,
        token: `Wash Traded NFT Token ID: ${tokenId}`,
        collectionContract: nftCollectionAddress,
        collectionName: nftCollectionName,
        // exchangeContract: exchangeAddresses,
        exchangeName: nftExchangeName,
        anomalyScore: `${
          (numberOfWashTrades / numberOfTrades) * 100
        }% of total trades observed for ${nftCollectionName} are possible wash trades`,
      },
    });
    console.log(
      `the seller wallet ${seller} was used to fund the buyer wallet ${buyer}`
    );
    results.push(finding);
  }

  return results;
}

const handleTransaction: HandleTransaction = async (txEvent) => {
  const findings: Finding[] = [];

  const tradeEvents = txEvent.filterLog(exchangeTrades);
  // const exchangeAddressEvents = txEvent.filterLog(exchangeAddressFilters);
  const exchangeAddressEvents: LogDescription[] = tradeEvents.filter(
    (log: LogDescription) =>
      Object.values(EXCHANGE_CONTRACT_ADDRESSES).some(
        (address) => log.address.toLowerCase() === address.toLowerCase()
      )
  );

  const transferEvents = txEvent.filterLog(TRANSFER_EVENT);

  // log results
  if (tradeEvents.length > 0 && exchangeAddressEvents.length > 0) {
    console.log(tradeEvents);
    console.log(`tradeEvent length is ${tradeEvents.length}`);
    console.log(
      `exchangeAddressEvent length is ${exchangeAddressEvents.length}`
    );
  }
  // log results
  if (
    tradeEvents.length > 0 &&
    exchangeAddressEvents.length > 0 &&
    transferEvents.length > 0
  ) {
    console.log(`tradeEvent length is ${tradeEvents.length}`);
    console.log(
      `exchangeAddressEvent length is ${exchangeAddressEvents.length}`
    );
    console.log(`transferEvent length is ${transferEvents.length}`);
  }

  // checks that the transfers are for the trades on a monitored NFT exchange
  if (
    tradeEvents.length > 0 &&
    transferEvents.length > 0 &&
    transferEvents.length < 4 &&
    exchangeAddressEvents.length > 0
  ) {
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
