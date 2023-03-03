import {
  Finding, 
  HandleTransaction, 
  FindingSeverity, 
  FindingType,
  ethers
} from 'forta-agent'
import {
  isTracked,
  trackNft,
  getBuyer,
  getSeller,
  nftList,
  getNftWithOldestSale,
  deleteNft
} from './utils'
import {
  EXCHANGE_CONTRACT_ADDRESSES,
  EXCHANGE_TRADE_EVENTS,
  TRANSFER_EVENT,
  MAX_TOKENS
} from './constants'


const provider = new ethers.providers.EtherscanProvider('goerli', process.env.ETHERSCAN_API_KEY);

 const loadConfig = () => {
  try {
    return require('./bot-config.json');
  } catch (e) {
    return require('../bot-config.json');
  }
};

const config = loadConfig();

const {
  nftCollectionAddress,
  nftCollectionName,
  nftExchangeName
} = config;

const tradeEvent: string = EXCHANGE_TRADE_EVENTS[nftExchangeName] 
const nftExchangeAddress: string = EXCHANGE_CONTRACT_ADDRESSES[nftExchangeName] 



export async function findFirstSender(buyerAddress: string): Promise<string | undefined> {
  // Get the transaction history for the wallet A
  // use this for Goerli (alchemy node):: const txs = await provider.getHistory(walletAAddress);
  const txs = await provider.getHistory(buyerAddress);

  // Sort the transactions by block number, ascending order
  txs.sort((a, b) => {
    if (a.blockNumber === undefined || b.blockNumber === undefined) {
      return 0; 
    }
    return a.blockNumber - b.blockNumber;
  });

  // Find the first transaction that transferred Ether to wallet A
  const fundedBy = txs.find(
  (tx) =>
    tx.to === buyerAddress &&
    tx.value.gt(0)
  );

  if (!fundedBy) {
    // If no transaction transferred Ether to wallet A, return undefined
    return undefined;
  }

  const sender = fundedBy.from;
  // Get the sender address from the input data of the transaction
  // const txData = await provider.getTransaction(txWithEtherIn.hash);
  // const inputData = txData.data ?? '0x';
  // const iface = new ethers.utils.Interface(['function transfer(address to, uint256 value)']);
  // const parsedInput = iface.parseTransaction({ data: inputData });
  // const sender = parsedInput.args[0];

  return sender;
}


export async function checkRelationship(buyer: string, seller: string): Promise<Finding[]> { 
  const results: Finding[] = [] 
  
  console.log(`the seller is ${seller}`)

  const sender = await findFirstSender(buyer);
  console.log("Sender address:", sender);

  if (sender && sender === seller) {
    const finding = Finding.fromObject({
      name: "NFT Wash Trade",
      // description: `${nftCollectionName} Wash Trade on ${nftExchangeName}`,
      description: `Wash Trade on`,
      alertId: "NFT-WASH-TRADE",
      severity: FindingSeverity.Medium,
      type: FindingType.Suspicious,
      metadata: {
        buyer: buyer,
        seller: seller,
        tokenId: "test",
        // collectionContract: nftCollectionAddress,
        // collectionName: nftCollectionName,
        // exchangeContract: nftExchangeAddress,
        // exchangeName: nftExchangeName,
        salesCountSoFar: "test",
        firstSaleTimestampTracked: "test",
        salesHistory: "test"
      },
    })
    results.push(finding)
    console.log(`The buyer wallet ${buyer} was funded by the seller wallet ${seller}`)
  } else {
    console.log(`No prior relationship between buyer ${buyer} and seller ${seller}`);
  }
  return results;
}

// const handleTransaction: HandleTransaction = async (txEvent) => {
//   const findings: Finding[] = []

//   const tradeEvents = txEvent.filterLog(tradeEvent, nftExchangeAddress) 
//   const transferEvents = txEvent.filterLog(TRANSFER_EVENT, nftCollectionAddress) 
   
//   if (tradeEvents.length == transferEvents.length) { 
//     transferEvents.forEach((transfer) => { 
//       const saleTimestamp = txEvent.timestamp 
//       const buyer = getBuyer(transfer)
//       const seller = getSeller(transfer)
//       if (isTracked(transfer)) { 
//         findings.push(...checkRelationship(buyer, seller)) 
//       } else { 
//         trackNft(transfer, saleTimestamp)
//         if (nftList.length > MAX_TOKENS) {
//           const tokenId = getNftWithOldestSale()
//           deleteNft(tokenId)
//         }
//       }
//     })
//   }

//   return findings
// }

export default {
  // handleTransaction,
  findFirstSender,
  checkRelationship
}