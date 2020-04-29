const EosdtConnector = require("../../../dist/connector").EosdtConnector
const PositionsContract = require("../../../dist/basic-positions").BasicPositionsContract
const ACCOUNT = require("./config")
const logStructure = require("../../log-structure")

;(async () => {
    const connector = new EosdtConnector("http://jungle2.cryptolions.io:80", [ACCOUNT.privateKey])
    const posContract = new PositionsContract(connector, "PBTC")

    let position = await posContract.getPositionByMaker(ACCOUNT.name) // Works
    console.log("Position:")
    logStructure(position)

    const newDebt = await posContract.generateDebt(ACCOUNT.name, 0.0001, position.position_id) // Works
    console.log("New debt:")
    logStructure(newDebt)

    const positions = await posContract.getAllUserPositions(ACCOUNT.name)
    console.log("Positions:")
    logStructure(positions)
})()
