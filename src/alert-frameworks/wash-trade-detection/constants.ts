import { ethers, Network } from "forta-agent";
import { CustomProviders } from "./custom-providers";

export const EXCHANGE_CONTRACT_ADDRESSES: Record<string, string> = {
  // Ethereum
  LooksRare: "0x59728544B08AB483533076417FbBB2fD0B17CE3a", // LooksRare: Exchange
  OpenSea: "0x00000000006c3852cbEf3e08E8dF289169EdE581", // OpenSea: Seaport 1.1 (same address on Avax, BSC, Arbitrum, Optimism, Polygon)
  OpenSea2: "0x00000000000001ad428e4906aE43D8F9852d0dD6", // OpenSea: Seaport 1.4 (same address on Avax, BSC, Arbitrum, Optimism, Polygon)
  Rarible: "0x9757F2d2b135150BBeb65308D4a91804107cd8D6", // Rarible: Exchange V2
  SuperRare: "0x6D7c44773C52D396F43c2D511B81aa168E9a7a42",
  X2Y2: "0x74312363e45DCaBA76c59ec49a7Aa8A65a67EeD3",
  Blur: "0x000000000000ad05ccc4f10045630fb830b95127",
  GhostMarketEth: "0xfB2F452639cBB0850B46b20D24DE7b0a9cCb665f",
  NftMarketplace: "0x3819579b236e5Ab5C695DD4762c2B18bB0Aee1c8", // test (goerli)

  // Avalanche
  JoePegs: "0xaE079eDA901F7727D0715aff8f82BA8295719977",
  NFTrade: "0xbf6bfe5d6b86308cf3b7f147dd03ef11f80bfde3", //same address on Eth / BSC / Matic
  GhostMarketAvax: "0xEb4ABA7aeba732Fc2FC92a673585d950cCFC1de0",
  Kalao: "0xeff2357c9e40103ac4d268b32de478e4fbbfc4f0",
  TofuNFT: "0x86232f68b5bF2a3A03851D98556352512a3b12B9",

  // Fantom
  PaintSwap: "0xf3dF7b6DCcC267393784a3876d0CbCBDC73147d4", // PaintSwap Marketplace V3
  NFTKey: "0x1a7d6ed890b6c284271ad27e7abe8fb5211d0739",
  AirNFTs: "0x94e22c14118353651636f9af43cd0a5a08b93da3",

  // Polygon //
  GhostMarketPoly: "0x3B48563237C32a1f886FD19DB6F5AFFD23855E2a",
  RariblePolygon: "0x835131b455778559CFdDd358eA3Fc762728F4E3e",
  BitKeep: "0x535a8a4a0d1eb5e9541227ebfb13d98c67c0fbf1",
  OKX: "0x954dab8830ad2b9c312bb87ace96f6cce0f51e3a",
  // OpenSea: "", same contract address as on Ethereum already listed above
  // Floor: "", no contract found, app currently beta testing,
  // NFTrade: "", same contract address as on Ethereum already listed above

  // Arbitrum
  BitKeepArbitrum: "0xd34bece48f35e3695804a354b8f2868aa7b9ad83",
  TofuNFTArbitrum: "0x7bc8b1b5aba4df3be9f9a32dae501214dc0e4f3f",
  // OpenSea: - same contract as on Ethereum already listed above
  // OKX: "0xcce3e3f79cf9091386f84610bb06947e2fc232a3" (already listed above)

  // BSC
  GhostMarketBSC: "0x388171F81FC91EfC7338E07E52555a90c7D87972",
  RareBoard: "0xe0cff9e46c2b50c703a1d8c3b7438e44e4c3d474",
  Biswap: "0x23567c7299702018b133ad63ce28685788ff3f67",
  // OKX: "0xcce3e3f79cf9091386f84610bb06947e2fc232a3" (already listed above)

  // Optimism
  Quix: "0x998ef16ea4111094eb5ee72fc2c6f4e6e8647666",
  // OpenSea: - same contract as on Ethereum already listed above
  // OKX: "0xcce3e3f79cf9091386f84610bb06947e2fc232a3" (already listed above)
};

export const EXCHANGE_TRADE_EVENTS: Record<string, string> = {
  LooksRare:
    "event TakerBid(bytes32 orderHash, uint256 orderNonce, address indexed taker, address indexed maker, address indexed strategy, address currency, address collection, uint256 tokenId, uint256 amount, uint256 price)",
  // note - exchange names not listed below are also covered by the Approval event
  Blur: "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
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
