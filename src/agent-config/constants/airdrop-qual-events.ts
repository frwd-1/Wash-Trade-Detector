export const AIRDROP_QUALIFYING_EVENTS: Record<string, string> = {
  HopProtocol:
    // crosschain bridge event using hop protocol
    "event TransferSent (index_topic_1 bytes32 transferId, index_topic_2 uint256 chainId, index_topic_3 address recipient, uint256 amount, bytes32 transferNonce, uint256 bonderFee, uint256 index, uint256 amountOutMin, uint256 deadline)",
};
