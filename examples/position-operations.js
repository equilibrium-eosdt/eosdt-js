const { EosdtConnector } = require("../dist/connector")

main()
async function main() {
    // Change node address here. This one will connect you to Jungle testnet node
    const nodeAddress = "http://jungle2.cryptolions.io:80"

    // Change or add private keys used to sign transactions here. This one is from Jungle
    // testnet account "exampleaccnt"
    const privateKeys = ["5JEVy6QujTsFzxWtBbQrG53vkszRybabE4wSyA2Tg1uZFEeVPks"]
    const accountName = "exampleaccnt"

    const connector = new EosdtConnector(nodeAddress, privateKeys)

    const currentBlockNumber = (await connector.rpc.get_info()).head_block_num
    console.log(`Connected to blockchain, current block number is: ${currentBlockNumber}`)

    const positions = connector.getPositions()

    // Creating a position to issue 2 EOSDT for 1.5 EOS collateral
    // ATTENTION: this will throw if a user already has a position
    await positions.create(accountName, 1.5, 2)

    const allUserPositions = await positions.getAllUserPositions(accountName)
    const lastUserPosition = allUserPositions[allUserPositions.length - 1]
    const positionId = lastUserPosition.position_id
    console.log("Position created:", lastUserPosition)

    // Adding 1.6 EOS collateral to position
    await positions.addCollateral(accountName, 1.6, positionId)

    let updatedPosition = await positions.getPositionById(positionId)
    console.log("Position collateral increased: ", updatedPosition)

    // Issuing addintional 2.15 EOSDT of debt
    await positions.generateDebt(accountName, 2.15, positionId)

    updatedPosition = await positions.getPositionById(positionId)
    console.log("Position outstanding and governance debts increased: ", updatedPosition)
}
