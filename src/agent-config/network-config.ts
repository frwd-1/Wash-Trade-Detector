import { ethers, Network } from "forta-agent";
import { CustomProviders } from "./custom-providers";

const ethProvider = new ethers.providers.EtherscanProvider(
  "mainnet",
  process.env.ETHERSCAN_API_KEY
);

const avaxProvider = new CustomProviders(
  Network.AVALANCHE,
  process.env.SNOWTRACE_API_KEY
);

const ftmProvider = new CustomProviders(
  Network.FANTOM,
  process.env.FTMSCAN_API_KEY
);

const optProvider = new ethers.providers.EtherscanProvider(
  "optimism",
  process.env.OTPIMISM_API_KEY
);

const mtcProvider = new ethers.providers.EtherscanProvider(
  "matic",
  process.env.POLYGONSCAN_API_KEY
);

const bscProvider = new CustomProviders(
  Network.BSC,
  process.env.BSCSCAN_API_KEY
);

const arbProvider = new ethers.providers.EtherscanProvider(
  "arbitrum",
  process.env.ARBITRUM_API_KEY
);

export function getProviderForNetwork(chainId: number) {
  switch (chainId) {
    case 1:
      return ethProvider;
    case 43114:
      return avaxProvider;
    case 250:
      return ftmProvider;
    case 10:
      return optProvider;
    case 137:
      return mtcProvider;
    case 56:
      return bscProvider;
    case 42161:
      return arbProvider;
    default:
      throw new Error(`Unsupported network ID: ${chainId}`);
  }
}
