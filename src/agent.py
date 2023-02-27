import networkx as nx
from web3 import Web3
import matplotlib.pyplot as plt
import json


# Connect to an Ethereum node
web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545/'))

# Define the contract ABI and address
abi = json.loads('[{"inputs": [{"internalType": "address", "name": "nftAddress", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "AlreadyListed", "type": "error"}, {"inputs": [], "name": "NoProceeds", "type": "error"}, {"inputs": [], "name": "NotApprovedForMarketplace", "type": "error"}, {"inputs": [{"internalType": "address", "name": "nftAddress", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "NotListed", "type": "error"}, {"inputs": [], "name": "NotOwner", "type": "error"}, {"inputs": [], "name": "PriceMustBeAboveZero", "type": "error"}, {"inputs": [{"internalType": "address", "name": "nftAddress", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {"internalType": "uint256", "name": "price", "type": "uint256"}], "name": "PriceNotMet", "type": "error"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "buyer", "type": "address"}, {"indexed": true, "internalType": "address", "name": "seller", "type": "address"}, {"indexed": true, "internalType": "address", "name": "nftAddress", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "price", "type": "uint256"}], "name": "ItemBought", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "seller", "type": "address"}, {"indexed": true, "internalType": "address", "name": "nftAddress", "type": "address"}, {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "ItemCanceled", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "seller", "type": "address"}, {"indexed": true, "internalType": "address", "name": "nftAddress", "type": "address"}, {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "price", "type": "uint256"}], "name": "ItemListed", "type": "event"}, {"inputs": [{"internalType": "address", "name": "nftAddress", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "buyItem", "outputs": [], "stateMutability": "payable", "type": "function"}, {"inputs": [{"internalType": "address", "name": "nftAddress", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "cancelListing", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "address", "name": "nftAddress", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "getListing", "outputs": [{"components": [{"internalType": "uint256", "name": "price", "type": "uint256"}, {"internalType": "address", "name": "seller", "type": "address"}], "internalType": "struct NftMarketplace.Listing", "name": "", "type": "tuple"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "address", "name": "seller", "type": "address"}], "name": "getProceeds", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "address", "name": "nftAddress", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {"internalType": "uint256", "name": "price", "type": "uint256"}], "name": "listItem", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "address", "name": "nftAddress", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {"internalType": "uint256", "name": "newPrice", "type": "uint256"}], "name": "updateListing", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [], "name": "withdrawProceeds", "outputs": [], "stateMutability": "nonpayable", "type": "function"}]')

contract_address = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

# Get a contract instance
contract = web3.eth.contract(address=contract_address, abi=abi)
print(contract)

# Define the event signature and filter options
event_signature = 'ItemBought(address,address,address,uint256,uint256)'
event_topic = web3.keccak(text=event_signature).hex()
filter_options = {'fromBlock': 0,
                  'address': contract_address, 'topics': [event_topic]}


# Create a new networkx graph
G = nx.Graph()

# Listen for events and construct the graph
for event in contract.events.ItemBought().create_filter(**filter_options).get_all_entries():
    buyer = event['args']['buyer']
    seller = event['args']['seller']
    price = event['args']['price']
    G.add_edge(buyer, seller, price=price)
    print(f"Buyer: {buyer}, Seller: {seller}")

# Query the blockchain for all previous transactions directly between the buyer and seller
transactions = []
latest_block = web3.eth.block_number
for block_number in range(latest_block - 1, latest_block + 1):
    block = web3.eth.get_block(block_number)
    for tx in block.transactions:
        receipt = web3.eth.get_transaction_receipt(tx)
        if (receipt['from'] == buyer and receipt['to'] == seller) or (receipt['from'] == seller and receipt['to'] == buyer) and \
                (receipt['contractAddress'] is None):
            value = web3.fromWei(receipt['value'], 'ether')
            G.add_edge(receipt['from'], receipt['to'], value=value)


if nx.has_path(G, buyer, seller):
    print('Buyer and seller have sent funds directly to each other previously.')
else:
    print('Buyer and seller have not sent funds directly to each other previously.')

# Find the shortest path between the buyer and seller
# try:
#     path = nx.shortest_path(G, buyer, seller)
#     print('Buyer and seller have sent funds to each other previously.')
#     plt.show()
# except nx.NetworkXNoPath:
#     print('Buyer and seller have not sent funds to each other previously.')
