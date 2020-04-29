const EosdtConnector = require("../../dist/connector").EosdtConnector
const PositionsContract = require("../../dist/main-positions").PositionsContract
const BalanceGetter = require("../../dist/balance").BalanceGetter
const ACCOUNT = require("../basic-positions-contract/config")
const logStructure = require("../log-structure")

;(async () => {
    const connector = new EosdtConnector("http://jungle2.cryptolions.io:80", [ACCOUNT.privateKey])
    const positionsContract = new PositionsContract(connector)
    const balancer = new BalanceGetter(connector)

    const NUTs = await balancer.getNut(ACCOUNT.name)
    console.log("NUTs")
    logStructure(NUTs)

    const ref = await positionsContract.getReferralByName(ACCOUNT.name)
    console.log("Referral:")
    logStructure(ref)

    let position = await positionsContract.createWithReferral(
        ACCOUNT.name,
        "2",
        "1",
        ref.referral_id
    ) // Works
    console.log("Position created")
    logStructure(position)

    position = await positionsContract.getPositionByMaker(ACCOUNT.name)
    console.log("Position")
    logStructure(position)
})()
