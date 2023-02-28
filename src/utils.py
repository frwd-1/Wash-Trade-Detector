from forta_agent import LogDescription


class SaleHistory:
    def __init__(self, buyer: str, saleAt: int):
        self.buyer = buyer
        self.saleAt = saleAt


class SaleMetadata:
    def __init__(self, count: int, firstSaleAt: int, findingSent: int):
        self.count = count
        self.firstSaleAt = firstSaleAt
        self.findingSent = findingSent


class NFTReport:
    def __init__(self, salesHistory: List[SaleHistory], salesMetadata: Dict[str, SaleMetadata]):
        self.salesHistory = salesHistory
        self.salesMetadata = salesMetadata


nftList: List[str] = []
nftMap: Dict[str, NFTReport] = {}


def deleteNft(tokenId: str) -> None:
    global nftList, nftMap
    nftList = [thisId for thisId in nftList if thisId != tokenId]
    nftMap.pop(tokenId, None)


def getBuyer(transfer) -> str:
    buyer = transfer.args.to
    return buyer


def getDateTime(timestamp: int) -> str:
    return datetime.datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')


def getNftId(transfer) -> str:
    tokenId = transfer.args.tokenId
    return str(tokenId)


def getNftWithOldestSale() -> str:
    global nftMap, nftList
    oldestSaleTimestamp = int(datetime.datetime.now().timestamp())
    tokenId = nftList[0]

    for id, report in nftMap.items():
        lastSaleTimestamp = report.salesHistory[-1].saleAt
        if lastSaleTimestamp < oldestSaleTimestamp:
            oldestSaleTimestamp = lastSaleTimestamp
            tokenId = id

    return tokenId


def isTracked(transfer) -> bool:
    tokenId = getNftId(transfer)
    return tokenId in nftMap


def trackNft(transfer, timestamp) -> None:
    global nftMap, nftList
    buyer = getBuyer(transfer)
    tokenId = getNftId(transfer)

    if tokenId not in nftMap:
        nftMap[tokenId] = NFTReport(
            salesHistory=[SaleHistory(buyer=buyer, saleAt=timestamp)],
            salesMetadata={buyer: SaleMetadata(
                count=1, firstSaleAt=timestamp, findingSent=1)}
        )
        nftList.append(tokenId)
        print({'action': 'tracking nft', 'tokenId': tokenId,
              **nftMap[tokenId].__dict__})


def trackNftSale(tokenId: str, transfer, timestamp: int) -> None:
    global nftMap
    buyer = getBuyer(transfer)
    nftReport = nftMap[tokenId]

    nftReport.salesHistory.append(SaleHistory(buyer=buyer, saleAt=timestamp))

    if buyer not in nftReport.salesMetadata:
        nftReport.salesMetadata[buyer] = SaleMetadata(
            count=1, firstSaleAt=timestamp, findingSent=1)
    else:
        nftReport.salesMetadata[buyer].count += 1
