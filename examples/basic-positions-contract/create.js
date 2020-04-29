const EosdtConnector = require("../../dist/connector").MainEosdtConnector
const PositionsContract = require("../../dist/basic-positions").BasicPositionsContract
const ACCOUNT = require("./config")

main()
async function main() {
    // Change node address here. This one will connect you to Jungle testnet node
    const nodeAddress = "http://jungle2.cryptolions.io:80"

    const connector = new EosdtConnector(nodeAddress, [ACCOUNT.privateKey])

    const currentBlockNumber = (await connector.rpc.get_info()).head_block_num
    console.log(`Connected to blockchain, current block number is: ${currentBlockNumber}`)

    const positions = new PositionsContract(connector)
    const accountName = ACCOUNT.name

    await positions.create(accountName, 2, 1) // Works

    const allUserPositions = await positions.getAllUserPositions(accountName)
    const lastUserPosition = allUserPositions[allUserPositions.length - 1]
    const positionId = lastUserPosition.position_id
    console.log("Position created:", lastUserPosition) // Works

    await positions.addCollateral(accountName, 1, positionId) // Works

    let updatedPosition = await positions.getPositionById(positionId)
    console.log("Position collateral increased: ", updatedPosition) // Works

    await positions.generateDebt(accountName, 1.6, positionId) // Works

    updatedPosition = await positions.getPositionById(positionId)
    console.log("Position outstanding and governance debts increased: ", updatedPosition)
}
