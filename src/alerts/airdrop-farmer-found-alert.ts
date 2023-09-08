import { Finding, FindingSeverity, FindingType } from "forta-agent";

export function detectFarmer() {
  return Finding.fromObject({
    name: "Airdrop Sybil Attack Farmer",
    description: `Airdrop farmer detected`,
    alertId: "FARMER-FOUND",
    severity: FindingSeverity.High,
    type: FindingType.Suspicious,
  });
}
