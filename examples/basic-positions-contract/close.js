const EosdtConnector = require("../../dist/connector").MainEosdtConnector
const PositionsContract = require("../../dist/basic-positions").BasicPositionsContract
const ACCOUNT = require("./config")

const logStructure = (value) => console.log(JSON.stringify(value, null, 4))

;(async () => {
    const nodeAddress = "http://jungle2.cryptolions.io:80"

    const connector = new EosdtConnector(nodeAddress, [ACCOUNT.privateKey])
    const positionsCtr = new PositionsContract(connector)

    await connector.api.transact(
        {
            actions: [
                {
                    account: "eosdtcntract",
                    name: "positionadd",
                    authorization: [
                        {
                            actor: ACCOUNT.name,
                            permission: "active"
                        }
                    ],
                    data: {
                        maker: ACCOUNT.name
                    }
                }
            ]
        },
        {
            blocksBehind: 3,
            expireSeconds: 30
        }
    )

    let lastPosition = await positionsCtr.getPositionByMaker(ACCOUNT.name)
    logStructure(lastPosition)

    await positionsCtr.close(ACCOUNT.name, lastPosition.position_id)

    lastPosition = await positionsCtr.getPositionByMaker(ACCOUNT.name)
    logStructure(lastPosition)
})()
