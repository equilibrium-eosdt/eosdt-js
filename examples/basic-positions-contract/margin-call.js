const EosdtConnector = require("../../dist/connector").MainEosdtConnector
const PositionsContract = require("../../dist/basic-positions").BasicPositionsContract
const ACCOUNT = require("./config")

const logStructure = (value) => console.log(JSON.stringify(value, null, 4))

main()
async function main() {
    const nodeAddress = "http://jungle2.cryptolions.io:80"

    const connector = new EosdtConnector(nodeAddress, [ACCOUNT.privateKey])

    const currentBlockNumber = (await connector.rpc.get_info()).head_block_num
    console.log(`Connected to blockchain, current block number is: ${currentBlockNumber}`)

    const positionsCtr = new PositionsContract(connector)
    const accountName = ACCOUNT.name

    let latestPosition = await positionsCtr.getLatestUserPosition(accountName)
    logStructure(latestPosition)

    await positionsCtr.marginCall(accountName, latestPosition.position_id)
    latestPosition = await positionsCtr.getLatestUserPosition(accountName)
    logStructure(latestPosition)
}
