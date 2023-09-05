import { TransactionEvent } from "forta-agent";

type ValidationFunction = (txEvent: TransactionEvent) => boolean;

export const EVENT_PARAMETER_VALIDATORS: Record<
  string,
  Record<string, ValidationFunction>
> = {
  HopProtocol: {
    transactionValue: (txEvent: TransactionEvent) => {
      const threshold = 500; // in Ether or appropriate units
      return Number(txEvent.transaction.value) >= threshold;
    },
    // Define other validators here...
  },
};
