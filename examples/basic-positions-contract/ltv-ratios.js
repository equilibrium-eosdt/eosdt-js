const EosdtConnector = require("../../dist/connector").MainEosdtConnector
const PositionsContract = require("../../dist/basic-positions").BasicPositionsContract
const ACCOUNT = require("./config")

const logStructure = (value) => console.log(JSON.stringify(value, null, 4))

;(async () => {
    const nodeAddress = "http://jungle2.cryptolions.io:80"

    const connector = new EosdtConnector(nodeAddress, [ACCOUNT.privateKey])
    const positionsCtr = new PositionsContract(connector)

    const ltvRatios = await positionsCtr.getLtvRatiosTable()
    console.log("Ltv ratios of contract:")
    logStructure(ltvRatios)

    const allUserPositions = await positionsCtr.getAllUserPositions(ACCOUNT.name)
    const lastUserPosition = allUserPositions[allUserPositions.length - 1]
    const positionId = lastUserPosition.position_id

    const positionLtvRatios = await positionsCtr.getPositionLtvRatio(positionId)
    console.log("Ltv ratios by position:")
    logStructure(positionLtvRatios)
})()
