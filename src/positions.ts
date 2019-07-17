import { JsonRpc, Api } from "eosjs"
import BigNumber from "bignumber.js"
import {
    EosdtContractParameters,
    EosdtContractSettings,
    TokenRate,
    EosdtPosition
} from "./interfaces/positions-contract"
import { EosdtConnectorInterface } from "./interfaces/connector"
import { toBigNumber, balanceToNumber } from "./utils"

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
        eosAmount: string | number | BigNumber,
        eosdtAmount: string | number | BigNumber
    ): Promise<any> {
        eosAmount = toBigNumber(eosAmount)
        const roundedDebtAmount = toBigNumber(eosdtAmount).dp(4, 1)

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "positionadd",
                        authorization: [{ actor: accountName, permission: "active" }],
                        data: {
                            maker: accountName
                        }
                    },
                    {
                        account: "eosio.token",
                        name: "transfer",
                        authorization: [{ actor: accountName, permission: "active" }],
                        data: {
                            from: accountName,
                            to: this.contractName,
                            quantity: `${eosAmount.toFixed(4)} EOS`,
                            memo: `${roundedDebtAmount.toFixed(9)} EOSDT`
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async close(senderAccount: string, positionId: number): Promise<any> {
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "close",
                        authorization: [{ actor: senderAccount, permission: "active" }],
                        data: { position_id: positionId }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async delete(creator: string, positionId: number): Promise<any> {
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "positiondel",
                        authorization: [{ actor: creator, permission: "active" }],
                        data: { position_id: positionId }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async give(
        account: string,
        receiver: string,
        positionId: number
    ): Promise<any> {
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "positiongive",
                        authorization: [{ actor: account, permission: "active" }],
                        data: {
                            position_id: positionId,
                            to: receiver
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )
        return receipt
    }

    public async addCollateral(
        account: string,
        amount: string | number | BigNumber,
        positionId: number
    ): Promise<any> {
        amount = toBigNumber(amount)

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: "eosio.token",
                        name: "transfer",
                        authorization: [{ actor: account, permission: "active" }],
                        data: {
                            to: this.contractName,
                            from: account,
                            maker: account,
                            quantity: `${amount.toFixed(4)} EOS`,
                            memo: `position_id:${positionId}`
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async deleteCollateral(
        sender: string,
        amount: string | number | BigNumber,
        positionId: number
    ): Promise<any> {
        if (typeof amount === "string" || typeof amount === "number") {
            amount = new BigNumber(amount)
        }

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "colateraldel",
                        authorization: [{ actor: sender, permission: "active" }],
                        data: {
                            position_id: positionId,
                            collateral: `${amount.toFixed(4)} EOS`
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async generateDebt(
        account: string,
        amount: string | number | BigNumber,
        positionId: number
    ): Promise<any> {
        const roundedAmount = toBigNumber(amount).dp(4, 1)

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "debtgenerate",
                        authorization: [{ actor: account, permission: "active" }],
                        data: {
                            debt: `${roundedAmount.toFixed(9)} EOSDT`,
                            position_id: positionId
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async burnbackDebt(
        account: string,
        amount: string | number | BigNumber,
        positionId: number
    ): Promise<any> {
        const roundedAmount = toBigNumber(amount).dp(4, 1)

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: "eosdtsttoken",
                        name: "transfer",
                        authorization: [{ actor: account, permission: "active" }],
                        data: {
                            to: this.contractName,
                            from: account,
                            maker: account,
                            quantity: `${roundedAmount.toFixed(9)} EOSDT`,
                            memo: `position_id:${positionId}`
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async marginCall(senderAccount: string, positionId: number): Promise<any> {
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "margincall",
                        authorization: [{ actor: senderAccount, permission: "active" }],
                        data: {
                            position_id: positionId
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
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
            table: "oracle.rates",
            json: true,
            limit: 500
        })
        return table.rows
    }

    public async getPositionById(id: number): Promise<EosdtPosition | undefined> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "positions",
            json: true,
            limit: 1,
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
            json: true,
            limit: 100,
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
            table: "parameters",
            json: true
        })
        return table.rows[0]
    }

    public async getSettings(): Promise<EosdtContractSettings> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "ctrsettings",
            json: true
        })
        return table.rows[0]
    }
}
