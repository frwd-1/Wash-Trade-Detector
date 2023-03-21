import { ethers, Network } from "forta-agent";
import { CustomProviders } from "./custom-providers";

export const EXCHANGE_CONTRACT_ADDRESSES: Record<string, string> = {
  // Ethereum
  LooksRare: "0x59728544B08AB483533076417FbBB2fD0B17CE3a", // LooksRare: Exchange
  OpenSea: "0x00000000006c3852cbEf3e08E8dF289169EdE581", // OpenSea: Seaport 1.1
  Rarible: "0x9757F2d2b135150BBeb65308D4a91804107cd8D6", // Rarible: Exchange V2
  SuperRare: "0x6D7c44773C52D396F43c2D511B81aa168E9a7a42",
  X2Y2: "0x74312363e45DCaBA76c59ec49a7Aa8A65a67EeD3",
  NftMarketplace: "0x3819579b236e5Ab5C695DD4762c2B18bB0Aee1c8", // test (goerli)
  // Avalanche
  JoePegs: "0xaE079eDA901F7727D0715aff8f82BA8295719977",
};

export const EXCHANGE_TRADE_EVENTS: Record<string, string> = {
  LooksRare:
    "event TakerBid(bytes32 orderHash, uint256 orderNonce, address indexed taker, address indexed maker, address indexed strategy, address currency, address collection, uint256 tokenId, uint256 amount, uint256 price)",
  OpenSea:
    //Rarible
    //JoePegs
    "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  SuperRare:
    "event AuctionSettled(address indexed _contractAddress, address indexed _bidder, address _seller, uint256 indexed _tokenId, address _currencyAddress, uint256 _amount)",
  X2Y2: "event EvProfit(bytes32 itemHash, address currency, address to, uint256 amount)",
  NftMarketplace:
    "event ItemBought(address indexed buyer, address indexed seller, address indexed nftAddress, uint256 tokenId, uint256 price)",
};

export const TRANSFER_EVENT =
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)";

export const ethProvider = new ethers.providers.EtherscanProvider(
  "mainnet",
  process.env.ETHERSCAN_API_KEY
);

export const avaxProvider = new CustomProviders(
  Network.AVALANCHE,
  process.env.SNOWTRACE_API_KEY
);

export const ftmProvider = new CustomProviders(
  Network.FANTOM,
  process.env.FTMSCAN_API_KEY
);

export const optProvider = new ethers.providers.EtherscanProvider(
  "optimism",
  process.env.OTPIMISM_API_KEY
);

export const mtcProvider = new ethers.providers.EtherscanProvider(
  "matic",
  process.env.POLYGONSCAN_API_KEY
);

export const bscProvider = new CustomProviders(
  Network.BSC,
  process.env.BSCSCAN_API_KEY
);

export const arbProvider = new ethers.providers.EtherscanProvider(
  "arbitrum",
  process.env.ARBITRUM_API_KEY
);
