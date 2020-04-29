const EosdtConnector = require("../../../dist/connector").EosdtConnector
const PositionsContract = require("../../../dist/basic-positions").BasicPositionsContract
const ACCOUNT = require("./config")
const logStructure = require("../../log-structure")

;(async () => {
    const connector = new EosdtConnector("http://jungle2.cryptolions.io:80", [ACCOUNT.privateKey])
    const positionsContract = new PositionsContract(connector, "PBTC")

    // Get parameters
    const parameters = await positionsContract.getParameters()
    console.log("Parameters:")
    logStructure(parameters) // Works

    // Get setting
    const settings = await positionsContract.getSettings()
    console.log("Settings:")
    logStructure(settings) // Works

    // Get positions
    const positions = await positionsContract.getAllPositions()
    console.log("Positions:")
    logStructure(positions)
})()
