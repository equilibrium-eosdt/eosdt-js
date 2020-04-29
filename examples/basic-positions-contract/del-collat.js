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

    // Getting last user position and it's id
    const allUserPositions = await positionsCtr.getAllUserPositions(accountName)
    const lastUserPosition = allUserPositions[allUserPositions.length - 1]
    const positionId = lastUserPosition.position_id

    const parameters = await positionsCtr.getParameters()
    console.log("Parameters:")
    logStructure(parameters)
    logStructure(lastUserPosition)

    await positionsCtr.deleteCollateral(accountName, 0.9998, positionId)

    updatedPosition = await positionsCtr.getPositionById(positionId)
    console.log("Position collateral decreased: ", updatedPosition)
}
