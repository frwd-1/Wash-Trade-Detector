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
