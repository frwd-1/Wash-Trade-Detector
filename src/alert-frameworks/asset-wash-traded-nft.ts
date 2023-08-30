import {
  Finding,
  FindingSeverity,
  FindingType,
  TransactionEvent,
} from "forta-agent";
import {
  EXCHANGE_CONTRACT_ADDRESSES,
  EXCHANGE_TRADE_EVENTS,
  TRANSFER_EVENT,
} from "../wash-trade-detection/constants";
import { checkRelationship } from "../wash-trade-detection/check-relationship";

export async function detectWashTrade(
  txEvent: TransactionEvent
): Promise<Finding[] | null> {
  const findings: Finding[] = [];
  const exchangeTrades = Object.values(EXCHANGE_TRADE_EVENTS);
  const tradeEvents = txEvent.filterLog(exchangeTrades);
  const exchanges = Object.values(EXCHANGE_CONTRACT_ADDRESSES);
  const network = txEvent.network;
  const transferEvents = txEvent.filterLog(TRANSFER_EVENT);
  console.log("value is....");
  console.log(Number(txEvent.transaction.value));

  // checks that the transfers are for the trades on a monitored NFT exchange
  if (
    tradeEvents.length === transferEvents.length &&
    transferEvents.length > 0 &&
    transferEvents.length < 5 &&
    Number(txEvent.transaction.value) > 0
  ) {
    // if txEvent.to has truthy value
    if (txEvent.to) {
      const isExchangeAddress = exchanges
        .map((addr) => addr.toLowerCase())
        .includes(txEvent.to.toLowerCase());
      // if isExchangeAddress has truthy value
      if (isExchangeAddress) {
        console.log(`interacted with (to) ${txEvent.to}`);
        console.log(`number of transfer events ${transferEvents.length}`);
        console.log(`number of trade events ${tradeEvents.length}`);
        console.log(`network is ${network}`);
        console.log(`chain ID is ${network}`);
        for (let i = 0; i < transferEvents.length; i++) {
          const transfer = transferEvents[i];
          const transferFindings = await checkRelationship(
            txEvent,
            transfer,
            network
          );
          findings.push(...transferFindings);
        }
      }
    }
  }
  return findings.length ? findings : null;
}
