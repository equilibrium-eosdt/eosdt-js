const EosdtConnector = require("../../dist/connector").EosdtConnector
const PositionsContract = require("../../dist/main-positions").PositionsContract
const BalanceGetter = require("../../dist/balance").BalanceGetter
const ACCOUNT = require("../basic-positions-contract/config")
const logStructure = require("../log-structure")

;(async () => {
    const connector = new EosdtConnector("http://jungle2.cryptolions.io:80", [ACCOUNT.privateKey])
    const positionsContract = new PositionsContract(connector)
    const balancer = new BalanceGetter(connector)

    const nuts = await balancer.getNut(ACCOUNT.name)
    console.log("NUTs:")
    logStructure(nuts)

    let refRes = await positionsContract.createWhenPositionsExist(ACCOUNT.name, 2, 1) // Works
    console.log("Ref created")
    logStructure(refRes)

    refRes = await positionsContract.getReferralByName(ACCOUNT.name)
    console.log("Last referral")
    logStructure(refRes)
})()
