import { LogDescription, TransactionEvent } from "forta-agent";

export function getBuyer(transfer: LogDescription): string {
  const buyer = transfer.args.to;
  return buyer;
}

export function getSeller(transfer: LogDescription): string {
  const seller = transfer.args.from;
  return seller;
}

export function getDateTime(timestamp: number) {
  return new Date(timestamp * 1000).toUTCString();
}

export function getTimestamp(txEvent: TransactionEvent): number {
  return txEvent.timestamp;
}

export function getNftId(transfer: LogDescription): string {
  const tokenId = transfer.args.tokenId.toString();
  return tokenId;
}

export function getNftContractAddress(transfer: LogDescription): string {
  return transfer.address;
}
