from forta_agent import Finding, FindingType, FindingSeverity
from .constants import EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI
import networkx as nx
from web3 import Web3
# import matplotlib.pyplot as plt
import json


def loadConfig():
    try:
        with open('./bot-config.json') as f:
            return json.load(f)
    except FileNotFoundError:
        # test environment
        with open('../bot-config.json') as f:
            return json.load(f)


config = loadConfig()

# load configuration data from agent config file
nftCollectionAddress = config['nftCollectionAddress']
nftCollectionName = config['nftCollectionName']
nftExchangeName = config['nftExchangeName']

# Connect to an Ethereum node
web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545/'))

# Define the contract ABI and address
abi = json.loads(EXCHANGE_CONTRACT_ABI[nftExchangeName])
contract_address = EXCHANGE_CONTRACT_ADDRESS[nftExchangeName]

# Get a contract instance
contract = web3.eth.contract(address=contract_address, abi=abi)
print(contract)

# Define the event
Nft_Bought = contract.events.ItemBought()

# Create a new networkx graph
G = nx.Graph()

# may need to use nested functions if i want to adjust inputs like the block range


def handle_transaction(nft_bought):
    findings = []

    nft_bought = Nft_Bought

    # Query the blockchain for all previous transactions directly between the buyer and seller
    latest_block = web3.eth.block_number
    # iterate through blocks within range
    # set range, may want to abstract out to external variable for adjustment
    for block_number in range(latest_block - 1, latest_block + 1):
        block = web3.eth.get_block(block_number)
        for tx in block.transactions:
            receipt = web3.eth.get_transaction_receipt(tx)
            if (receipt['from'] == buyer and receipt['to'] == seller) or (receipt['from'] == seller and receipt['to'] == buyer) and \
                    (receipt['contractAddress'] is None):
                amount = web3.fromWei(receipt['value'], 'ether')
                G.add_edge(receipt['from'], receipt['to'], value=amount)
                findings.append(Finding({
                    'name': 'test NFT Wash Trade',
                    'description': 'test test abc',
                    'alert_id': 'test test 123',
                    'type': FindingType.Info,
                    'severity': FindingSeverity.Info,
                    'metadata': {
                        'from': buyer,
                        'to': seller,
                        'amount': amount
                    }
                }))
    return findings


# if nx.has_path(G, buyer, seller):
#     print('Buyer and seller have sent funds directly to each other previously.')
# else:
#     print('Buyer and seller have not sent funds directly to each other previously.')

# Find the shortest path between the buyer and seller
# try:
#     path = nx.shortest_path(G, buyer, seller)
#     print('Buyer and seller have sent funds to each other previously.')
#     plt.show()
# except nx.NetworkXNoPath:
#     print('Buyer and seller have not sent funds to each other previously.')
