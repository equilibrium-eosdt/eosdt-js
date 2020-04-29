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

    const referral = await positionsContract.getReferralByName(ACCOUNT.name)

    // Delete ref

    let refRes = await positionsContract.deleteReferral(ACCOUNT.name, referral.referral_id) // Works
    console.log("Del Ref:")
    logStructure(refRes)

    // Get ref

    refRes = await positionsContract.getAllReferrals()
    console.log("refs:")
    logStructure(refRes)
    refRes = refRes[refRes.length - 1]
    console.log("last ref:")
    logStructure(refRes)
})()
