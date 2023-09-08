import { Finding, TransactionEvent } from "forta-agent";
import { AIRDROP_QUALIFYING_EVENTS } from "../../agent-config/constants/airdrop-qual-events";
import { AIRDROP_CONTRACT_ADDRESSES } from "../../agent-config/constants/airdrop-contracts";
import { EVENT_PARAMETER_VALIDATORS } from "../../agent-config/constants/airdrop-qual-parameters";
import { checkAirdropRelationship } from "./check-relationships-ad";

export async function detectAirdropFarm(
  txEvent: TransactionEvent
): Promise<Finding[] | null> {
  const findings: Finding[] = [];
  const network = txEvent.network;

  console.log(`network is ${network}`);
  console.log(`to address is ${txEvent.to}`);

  if (txEvent.to) {
    const protocolName = Object.keys(AIRDROP_CONTRACT_ADDRESSES).find(
      (key) =>
        AIRDROP_CONTRACT_ADDRESSES[key].toLowerCase() ===
        txEvent.to!.toLowerCase()
    );

    console.log(`protocol name is ${protocolName}`);

    if (protocolName) {
      const isQualifyingEvent = AIRDROP_QUALIFYING_EVENTS[protocolName];
      console.log(`qualifying event is ${isQualifyingEvent}`);

      if (isQualifyingEvent) {
        const protocolValidators = EVENT_PARAMETER_VALIDATORS[protocolName];
        console.log(`Validators for ${protocolName}:`, protocolValidators);

        const allValidatorsPass = Object.values(protocolValidators).every(
          (validator) => {
            const result = validator(txEvent);
            console.log(
              `Validator ${
                validator.name || "unnamed"
              } for ${protocolName} returned: ${result}`
            );
            return result;
          }
        );

        if (allValidatorsPass) {
          console.log("All validators passed for protocol:", protocolName);
          const airdropEventFindings = await checkAirdropRelationship(
            txEvent.from,
            network
          );
          findings.push(...airdropEventFindings);
        } else {
          console.log("Some validators failed for protocol:", protocolName);
        }
      }
    }
  }

  return findings.length ? findings : null;
}
