const EosdtConnector = require("../../dist/connector").EosdtConnector
const PositionsContract = require("../../dist/basic-positions").BasicPositionsContract
const ACCOUNT = require("./config")
const logStructure = require("../log-structure")

;(async () => {
    const connector = new EosdtConnector("http://jungle2.cryptolions.io:80", [ACCOUNT.privateKey])
    const positionsContract = new PositionsContract(connector)

    // get oracle rates
    const rates = await positionsContract.getRelativeRates()
    console.log("Rates:")
    logStructure(rates)
})()
