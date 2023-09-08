// checks whether two or more addresses were funded by the same funder address or sweep to the same sweep address
// a Sybil attacker might always start by transferring funds to a new wallet, then interacting with a contract, and finally transferring out to another wallet. That's a sequential pattern. If many wallets always send funds to a central wallet, that's a radial pattern.
// check if sweep is funder***
