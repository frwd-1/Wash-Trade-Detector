import { TransactionEvent } from "forta-agent";

type ValidationFunction = (txEvent: TransactionEvent) => boolean;

export const EVENT_PARAMETER_VALIDATORS: Record<
  string,
  Record<string, ValidationFunction>
> = {
  HopProtocol: {
    transactionValue: (txEvent: TransactionEvent) => {
      const threshold = 500000000000000000;
      console.log(`threshold is ${threshold}`);
      console.log(`transaction value is ${txEvent.transaction.value}`);
      return Number(txEvent.transaction.value) >= threshold;
    },
    // other validators to be added...
  },
};
