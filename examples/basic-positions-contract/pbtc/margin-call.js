const EosdtConnector = require("../../../dist/connector").EosdtConnector
const PositionsContract = require("../../../dist/basic-positions").BasicPositionsContract
const ACCOUNT = require("./config")
const logStructure = require("../../log-structure")

;(async () => {
    const connector = new EosdtConnector("http://nodeos-2.jungle.eosdt.com:8888", [
        ACCOUNT.privateKey
    ])
    const posContract = new PositionsContract(connector, "PBTC")

    let position = await posContract.getPositionByMaker(ACCOUNT.name) // Works
    console.log("Position:")
    logStructure(position)

    try {
        // Margin call
        const res = await posContract.marginCall(ACCOUNT.name, position.position_id) // Works
        console.log("Result:")
        logStructure(res)

        const positions = await posContract.getAllUserPositions(ACCOUNT.name)
        console.log("Positions:")
        logStructure(positions)
    } catch (err) {
        logStructure(err)
    }
})()
