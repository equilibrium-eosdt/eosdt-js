import { Api, JsonRpc } from "eosjs"
import { EosdtConnectorInterface } from "./interfaces/connector"
import { BpPosition, bpPositionKeys } from "./interfaces/governance"
import { ITrxParamsArgument } from "./interfaces/transaction"
import { amountToAssetString, dateToEosDate, setTransactionParams, validateExternalData } from "./utils"

export class BpManager {
    private contractName: string
    private rpc: JsonRpc
    private api: Api

    constructor(connector: EosdtConnectorInterface) {
        this.rpc = connector.rpc
        this.api = connector.api
        this.contractName = "eosdtgovernc"
    }

    public async getAllBpPositions(): Promise<BpPosition[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "govbpparams",
            limit: 10_000
        })
        return validateExternalData(table.rows, "bp position", bpPositionKeys)
    }

    public async getBpPosition(bpName: string): Promise<BpPosition | undefined> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "govbpparams",
            upper_bound: bpName,
            lower_bound: bpName
        })
        return validateExternalData(table.rows[0], "bp position", bpPositionKeys, true)
    }

    public async registerBlockProducer(
        bpName: string,
        rewardAmount: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "bpregister",
                        authorization: [{ actor: bpName, permission: "active" }],
                        data: {
                            bp_name: bpName,
                            reward_amount: amountToAssetString(rewardAmount, "EOS")
                        }
                    }
                ]
            },
            {
                expireSeconds: trxParams.expireSeconds,
                blocksBehind: trxParams.blocksBehind
            }
        )

        return receipt
    }

    public async changeBlockProducerReward(
        bpName: string,
        rewardAmount: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "bpsetparams",
                        authorization: [{ actor: bpName, permission: "active" }],
                        data: {
                            bp_name: bpName,
                            reward_amount: amountToAssetString(rewardAmount, "EOS")
                        }
                    }
                ]
            },
            {
                expireSeconds: trxParams.expireSeconds,
                blocksBehind: trxParams.blocksBehind
            }
        )

        return receipt
    }

    public async unregisterBlockProducer(
        bpName: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "bpunregister",
                        authorization: [{ actor: bpName, permission: "active" }],
                        data: {
                            bp_name: bpName
                        }
                    }
                ]
            },
            {
                expireSeconds: trxParams.expireSeconds,
                blocksBehind: trxParams.blocksBehind
            }
        )

        return receipt
    }

    public async depositEos(
        fromAccount: string,
        bpName: string,
        eosAmount: number | string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: "eosio.token",
                        name: "transfer",
                        authorization: [{ actor: fromAccount, permission: "active" }],
                        data: {
                            from: fromAccount,
                            to: this.contractName,
                            quantity: amountToAssetString(eosAmount, "EOS"),
                            memo: `bp_deposit:${bpName}`
                        }
                    }
                ]
            },
            {
                expireSeconds: trxParams.expireSeconds,
                blocksBehind: trxParams.blocksBehind
            }
        )

        return receipt
    }
}
