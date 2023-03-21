import { Finding, HandleTransaction, LogDescription } from "forta-agent";
import { checkRelationship } from "./check-relationship";
import {
  EXCHANGE_CONTRACT_ADDRESSES,
  EXCHANGE_TRADE_EVENTS,
  TRANSFER_EVENT,
} from "./constants";

const exchangeTrades = Object.values(EXCHANGE_TRADE_EVENTS);

const handleTransaction: HandleTransaction = async (txEvent) => {
  const findings: Finding[] = [];

  const network = txEvent.network;

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
    console.log(`chain ID is ${network}`);
    for (let i = 0; i < transferEvents.length; i++) {
      const transfer = transferEvents[i];

      const transferFindings = await checkRelationship(transfer, network);
      findings.push(...transferFindings);
    }
  }

  return findings;
};

export default {
  handleTransaction,
};
