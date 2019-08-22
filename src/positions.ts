import { Api, JsonRpc } from "eosjs"
import { EosdtConnectorInterface } from "./interfaces/connector"
import {
    EosdtContractParameters,
    EosdtContractSettings,
    EosdtPosition,
    TokenRate
} from "./interfaces/positions-contract"
import { ITrxParamsArgument } from "./interfaces/transaction"
import { amountToAssetString, balanceToNumber, setTransactionParams } from "./utils"

export class PositionsContract {
    private contractName: string
    private rpc: JsonRpc
    private api: Api

    constructor(connector: EosdtConnectorInterface) {
        this.rpc = connector.rpc
        this.api = connector.api
        this.contractName = "eosdtcntract"
    }

    public async create(
        accountName: string,
        eosAmount: string | number,
        eosdtAmount: string | number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const eosAssetString = amountToAssetString(eosAmount, "EOS")
        const eosdtAssetString = amountToAssetString(eosdtAmount, "EOSDT")
        const authorization = [{ actor: accountName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "positionadd",
                        authorization,
                        data: { maker: accountName }
                    },
                    {
                        account: "eosio.token",
                        name: "transfer",
                        authorization,
                        data: {
                            from: accountName,
                            to: this.contractName,
                            quantity: eosAssetString,
                            memo: eosdtAssetString
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

    public async createEmptyPosition(
        accountName: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: accountName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "positionadd",
                        authorization,
                        data: { maker: accountName }
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

    public async close(
        senderAccount: string,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderAccount, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "close",
                        authorization,
                        data: { position_id: positionId }
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

    public async del(
        creator: string,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: creator, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "positiondel",
                        authorization,
                        data: { position_id: positionId }
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

    public async give(
        giverAccount: string,
        receiver: string,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: giverAccount, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "positiongive",
                        authorization,
                        data: {
                            position_id: positionId,
                            to: receiver
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

    public async addCollateral(
        senderName: string,
        amount: string | number,
        positionId: number,
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
                            to: this.contractName,
                            from: senderName,
                            maker: senderName,
                            quantity: eosAssetString,
                            memo: `position_id:${positionId}`
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

    public async deleteCollateral(
        senderName: string,
        amount: string | number,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const eosAssetString = amountToAssetString(amount, "EOS")
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "colateraldel",
                        authorization,
                        data: {
                            position_id: positionId,
                            collateral: eosAssetString
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

    public async generateDebt(
        senderName: string,
        amount: string | number,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const eosdtAssetString = amountToAssetString(amount, "EOSDT")
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "debtgenerate",
                        authorization,
                        data: {
                            debt: eosdtAssetString,
                            position_id: positionId
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

    public async burnbackDebt(
        senderName: string,
        amount: string | number,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const eosdtAssetString = amountToAssetString(amount, "EOSDT")
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
                            to: this.contractName,
                            from: senderName,
                            maker: senderName,
                            quantity: eosdtAssetString,
                            memo: `position_id:${positionId}`
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

    public async marginCall(
        senderName: string,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "margincall",
                        authorization,
                        data: {
                            position_id: positionId
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

    public async getContractEosAmount(): Promise<number> {
        const balance = await this.rpc.get_currency_balance(
            "eosio.token",
            "eosdtcntract",
            "EOS"
        )
        return balanceToNumber(balance)
    }

    public async getRates(): Promise<TokenRate[]> {
        const table = await this.rpc.get_table_rows({
            code: "eosdtorclize",
            scope: "eosdtorclize",
            table: "orarates",
            json: true,
            limit: 1000
        })
        return table.rows
    }

    public async getPositionById(id: number): Promise<EosdtPosition | undefined> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "positions",
            table_key: "position_id",
            lower_bound: id,
            upper_bound: id
        })
        return table.rows[0]
    }

    public async getAllUserPositions(maker: string): Promise<EosdtPosition[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "positions",
            limit: 1000,
            table_key: "maker",
            index_position: "secondary",
            key_type: "name",
            lower_bound: maker,
            upper_bound: maker
        })
        return table.rows
    }

    public async getParameters(): Promise<EosdtContractParameters> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "parameters"
        })
        return table.rows[0]
    }

    public async getSettings(): Promise<EosdtContractSettings> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "ctrsettings"
        })
        return table.rows[0]
    }
}
