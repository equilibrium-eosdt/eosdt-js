const EosdtConnector = require("../../../dist/connector").EosdtConnector
const PositionsContract = require("../../../dist/basic-positions").BasicPositionsContract
const ACCOUNT = require("./config")
const logStructure = require("../../log-structure")

;(async () => {
    const connector = new EosdtConnector("http://jungle2.cryptolions.io:80", [ACCOUNT.privateKey])
    const posContract = new PositionsContract(connector, "PBTC")

    let positions = await posContract.getAllPositions() // Works
    console.log("Positions:")
    logStructure(positions)

    const newPosition = await posContract.create(ACCOUNT.name, 0.0001, 0.0001) // Works
    console.log("New position:")
    logStructure(newPosition)

    positions = await posContract.getAllUserPositions(ACCOUNT.name)
    console.log("Positions:")
    logStructure(positions)
})()
