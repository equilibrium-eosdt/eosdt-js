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

    // Getting last user position and it's id
    const allUserPositions = await positions.getAllUserPositions(accountName)
    const lastUserPosition = allUserPositions[allUserPositions.length - 1]
    const positionId = lastUserPosition.position_id

    // Returning 6 EOSDT to Positions contract. All excessive tokens will be returned to user.
    // Appropriate amount of NUT tokens will be withdrawn from user balance. User required
    // to have NUT tokens to burn debt.
    await positions.burnbackDebt(accountName, 6, positionId)

    let updatedPosition = await positions.getPositionById(positionId)
    console.log("Position debt decreased: ", updatedPosition)

    // Returning 1.35 EOS of collateral to user (partial collateral return). If there is
    // debt still left, user cannot return more collateral, than required for position
    // to have LTV above critical
    await positions.deleteCollateral(accountName, 1.35, positionId)

    updatedPosition = await positions.getPositionById(positionId)
    console.log("Position collateral decreased: ", updatedPosition)

    // Deleting position and returning all collateral left. Would only work, if
    // position has zero debts.
    await positions.delete(accountName, positionId)

    updatedPosition = await positions.getPositionById(positionId)
    console.log(
        "Position deleted, excess EOS returned to user, position must now be undefined: ",
        updatedPosition
    )
}
