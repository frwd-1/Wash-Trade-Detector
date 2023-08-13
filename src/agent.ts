import { Finding, HandleTransaction } from "forta-agent";
import { checkRelationship } from "./check-relationship";
import {
  EXCHANGE_CONTRACT_ADDRESSES,
  EXCHANGE_TRADE_EVENTS,
  TRANSFER_EVENT,
} from "./constants";

const exchangeTrades = Object.values(EXCHANGE_TRADE_EVENTS);

console.log("hello");
const handleTransaction: HandleTransaction = async (txEvent) => {
  console.log("hola buenos dias");
  const findings: Finding[] = [];

  const network = txEvent.network;

  const tradeEvents = txEvent.filterLog(exchangeTrades);

  const exchanges = Object.values(EXCHANGE_CONTRACT_ADDRESSES);

  // const toAddress = txEvent.to;
  // console.log(`Interacted with (to) address is ${toAddress}`);

  const transferEvents = txEvent.filterLog(TRANSFER_EVENT);

  // checks that the transfers are for the trades on a monitored NFT exchange
  if (
    // tradeEvents.length > 0 &&
    // transferEvents.length > 0 &&
    // transferEvents.length < 4
    tradeEvents.length === transferEvents.length &&
    transferEvents.length > 0 &&
    transferEvents.length < 5
  ) {
    if (txEvent.to) {
      const isExchangeAddress = exchanges
        .map((addr) => addr.toLowerCase())
        .includes(txEvent.to.toLowerCase());
      if (isExchangeAddress) {
        console.log(`interacted with (to) ${txEvent.to}`);
        console.log(`number of transfer events ${transferEvents.length}`);
        console.log(`number of trade events ${tradeEvents.length}`);
        console.log(`network is ${network}`);
        console.log(`chain ID is ${network}`);
        for (let i = 0; i < transferEvents.length; i++) {
          const transfer = transferEvents[i];
          const transferFindings = await checkRelationship(transfer, network);
          findings.push(...transferFindings);
        }
      }
    }
  }

  return findings;
};

export default {
  handleTransaction,
};
