import { Finding, TransactionEvent } from "forta-agent";
import { AIRDROP_QUALIFYING_EVENTS } from "src/agent-config/constants/airdrop-qual-events";
import { AIRDROP_CONTRACT_ADDRESSES } from "src/agent-config/constants/airdrop-contracts";
import { EVENT_PARAMETER_VALIDATORS } from "src/agent-config/constants/airdrop-qual-parameters";
import { checkAirdropRelationship } from "./check-relationship-airdrop";

export async function detectAirdropFarm(
  txEvent: TransactionEvent
): Promise<Finding[] | null> {
  const findings: Finding[] = [];
  //   const qualEvents = Object.values(AIRDROP_QUALIFYING_EVENTS);
  //   const protocols = Object.values(AIRDROP_CONTRACT_ADDRESSES);
  const network = txEvent.network;

  if (txEvent.to) {
    const protocolName = Object.keys(AIRDROP_CONTRACT_ADDRESSES).find(
      (key) =>
        AIRDROP_CONTRACT_ADDRESSES[key].toLowerCase() ===
        txEvent.to.toLowerCase()
    );

    if (protocolName) {
      const isQualifyingEvent = AIRDROP_QUALIFYING_EVENTS[protocolName];

      if (isQualifyingEvent) {
        const protocolValidators = EVENT_PARAMETER_VALIDATORS[protocolName];

        // If all validators pass
        if (
          Object.values(protocolValidators).every((validator) =>
            validator(txEvent)
          )
        ) {
          for (let i = 0; i < transferEvents.length; i++) {
            const transfer = transferEvents[i];
            const transferFindings = await checkAirdropRelationship(
              txEvent,
              transfer,
              network
            );
            findings.push(...transferFindings);
          }
        }
      }
    }
  }

  return findings.length ? findings : null;
}
