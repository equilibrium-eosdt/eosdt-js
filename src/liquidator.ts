import { Api, JsonRpc } from "eosjs"
import { EosdtConnectorInterface } from "./interfaces/connector"
import { LiquidatorParameters } from "./interfaces/liquidator"
import { ITrxParamsArgument } from "./interfaces/transaction"
import { amountToAssetString, setTransactionParams } from "./utils"

export class LiquidatorContract {
    private contractName: string
    private rpc: JsonRpc
    private api: Api

    constructor(connector: EosdtConnectorInterface) {
        this.rpc = connector.rpc
        this.api = connector.api
        this.contractName = "eosdtliqdatr"
    }

    public async marginCallAndBuyoutEos(
        senderName: string,
        positionId: number,
        eosdtToTransfer: string | number,
        trxMemo?: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const eosdtAssetString = amountToAssetString(eosdtToTransfer, "EOSDT")
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: "eosdtcntract",
                        name: "margincall",
                        authorization,
                        data: { position_id: positionId }
                    },
                    {
                        account: "eosdtsttoken",
                        name: "transfer",
                        authorization,
                        data: {
                            from: senderName,
                            to: this.contractName,
                            quantity: eosdtAssetString,
                            memo: trxMemo ? trxMemo : "eosdt-js buyout"
                        }
                    }
                ]
            },
            {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            }
        )

        return receipt
    }

    public async transferEos(
        senderName: string,
        amount: string | number,
        trxMemo?: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const eosAssetString = amountToAssetString(amount, "EOS")
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: "eosio.token",
                        name: "transfer",
                        authorization,
                        data: {
                            from: senderName,
                            to: this.contractName,
                            quantity: eosAssetString,
                            memo: trxMemo ? trxMemo : "eosdt-js transferEos()"
                        }
                    }
                ]
            },
            {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            }
        )

        return receipt
    }

    public async transferEosdt(
        senderName: string,
        eosdtAmount: string | number,
        trxMemo?: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const eosdtAssetString = amountToAssetString(eosdtAmount, "EOSDT")
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: "eosdtsttoken",
                        name: "transfer",
                        authorization,
                        data: {
                            from: senderName,
                            to: this.contractName,
                            quantity: eosdtAssetString,
                            memo: trxMemo ? trxMemo : "eosdt-js transferEosdt()"
                        }
                    }
                ]
            },
            {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            }
        )

        return receipt
    }

    public async transferNut(
        senderName: string,
        nutAmount: string | number,
        trxMemo: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const nutAssetString = amountToAssetString(nutAmount, "NUT")
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: "eosdtnutoken",
                        name: "transfer",
                        authorization,
                        data: {
                            from: senderName,
                            to: this.contractName,
                            quantity: nutAssetString,
                            memo: trxMemo ? trxMemo : "eosdt-js transferNut()"
                        }
                    }
                ]
            },
            {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            }
        )

        return receipt
    }

    public async getSurplusDebt(): Promise<string> {
        const parameters = await this.getParameters()
        return parameters.surplus_debt
    }

    public async getBadDebt(): Promise<string> {
        const parameters = await this.getParameters()
        return parameters.bad_debt
    }

    public async getEosBalance(): Promise<string> {
        const parameters = await this.getParameters()
        return parameters.eos_balance
    }

    public async getParameters(): Promise<LiquidatorParameters> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "parameters"
        })
        return table.rows[0]
    }
}
