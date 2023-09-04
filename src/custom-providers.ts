import { providers } from "ethers";
import { Network } from "forta-agent";

function getNetworkConfiguration(network: Network): {
  chainId: number;
  name: string;
} {
  switch (network) {
    case Network.AVALANCHE:
      return { chainId: Network.AVALANCHE, name: "avalanche" };
    case Network.FANTOM:
      return { chainId: Network.FANTOM, name: "fantom" };
    case Network.BSC:
      return { chainId: Network.BSC, name: "bsc" };
    // Add other cases for other networks if necessary
    default:
      throw new Error("Unsupported network");
  }
}

export class CustomProviders extends providers.EtherscanProvider {
  constructor(network: Network, apiKey?: string) {
    const networkConfig = getNetworkConfiguration(network);
    const customNetwork = {
      name: networkConfig.name,
      chainId: networkConfig.chainId,
      ensAddress: "",
    };
    super(customNetwork, apiKey);
  }

  getBaseUrl() {
    switch (this.network ? this.network.name : "invalid") {
      case "bsc":
        return "https://api.bscscan.com";
      case "fantom":
        return "https://api.ftmscan.com";
      case "avalanche":
        return "https://api.snowtrace.io";
      default:
        return super.getBaseUrl();
    }
  }
}
