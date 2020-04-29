const EosdtConnector = require("../../dist/connector").EosdtConnector
const PositionsContract = require("../../dist/basic-positions").BasicPositionsContract
const ACCOUNT = require("./config")
const logStructure = require("../log-structure")

;(async () => {
    const connector = new EosdtConnector("http://jungle2.cryptolions.io:80", [ACCOUNT.privateKey])
    const positionsContract = new PositionsContract(connector)

    let positions = await positionsContract.getAllUserPositions(ACCOUNT.name)
    console.log("Positions:")
    logStructure(positions)

    const position = await positionsContract.paybackAndDelete(
        ACCOUNT.name,
        positions[positions.length - 1].position_id,
        1.6
    )
    console.log("Result:")
    logStructure(position)
})()
