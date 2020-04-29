const EosdtConnector = require("../../dist/connector").EosdtConnector
const PositionsContract = require("../../dist/main-positions").PositionsContract
const ACCOUNT = require("../basic-positions-contract/config")
const logStructure = require("../log-structure")

;(async () => {
    const connector = new EosdtConnector("http://jungle2.cryptolions.io:80", [ACCOUNT.privateKey])
    const positionsContract = new PositionsContract(connector)

    let refs = await positionsContract.getAllReferrals()
    console.log("Refs:")
    logStructure(refs)

    refs = await positionsContract.getPositionReferralsTable()
    console.log("Position refs:")
    logStructure(refs)
})()
