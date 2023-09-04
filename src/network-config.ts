import {
  ethProvider,
  avaxProvider,
  ftmProvider,
  optProvider,
  mtcProvider,
  bscProvider,
  arbProvider,
} from "./constants";

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
