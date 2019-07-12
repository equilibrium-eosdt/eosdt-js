import { JsonRpc, Api } from "eosjs"
import BigNumber from "bignumber.js"
import { LiquidatorParameters } from "./interfaces/liquidator"
import { EosdtConnectorInterface } from "./interfaces/connector"
import { toBigNumber } from "./utils";

export class LiquidatorContract {
    private contractName: string
    private rpc: JsonRpc
    private api: Api

    constructor(connector: EosdtConnectorInterface) {
        this.rpc = connector.rpc
        this.api = connector.api
        this.contractName = "eosdtliqdatr"
    }

    public async marginCallAndBuyoutEos(senderAccount: string, positionId: number,
        eosdtToTransfer: string | number | BigNumber): Promise<any> {

        eosdtToTransfer = toBigNumber(eosdtToTransfer)

        const receipt = await this.api.transact(
            {
                actions: [{
                    account: "eosdtcntract",
                    name: "margincall",
                    authorization: [{ actor: senderAccount, permission: "active" }],
                    data: {
                        position_id: positionId
                    }
                },
                {
                    account: "eosdtsttoken",
                    name: "transfer",
                    authorization: [{ actor: senderAccount, permission: "active" }],
                    data: {
                        from: senderAccount,
                        to: this.contractName,
                        quantity: `${eosdtToTransfer.toFixed(9)} EOSDT`,
                        memo: "",
                    }
                }],
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async transferEos(sender: string, amount: string | number | BigNumber,
        memo: string): Promise<any> {

        amount = toBigNumber(amount)

        const result = await this.api.transact(
            {
                actions: [{
                    account: "eosio.token",
                    name: "transfer",
                    authorization: [{ actor: sender, permission: "active" }],
                    data: {
                        from: sender,
                        to: this.contractName,
                        quantity: `${amount.toFixed(4)} EOS`,
                        memo,
                    },
                }],
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return result
    }

    public async transferEosdt(sender: string, amount: string | number | BigNumber,
        memo: string): Promise<any> {

        amount = toBigNumber(amount)

        const result = await this.api.transact(
            {
                actions: [{
                    account: "eosdtsttoken",
                    name: "transfer",
                    authorization: [{ actor: sender, permission: "active" }],
                    data: {
                        from: sender,
                        to: this.contractName,
                        quantity: `${amount.toFixed(9)} EOSDT`,
                        memo,
                    },
                }],
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return result
    }

    public async transferNut(sender: string, amount: string | number | BigNumber,
        memo: string): Promise<any> {

        amount = toBigNumber(amount)

        const result = await this.api.transact(
            {
                actions: [{
                    account: "eosdtnutoken",
                    name: "transfer",
                    authorization: [{ actor: sender, permission: "active" }],
                    data: {
                        from: sender,
                        to: this.contractName,
                        quantity: `${amount.toFixed(9)} NUT`,
                        memo,
                    },
                }],
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return result
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
            code: this.contractName, scope: this.contractName, table: "parameters", json: true, limit: 1,
        })
        return table.rows[0]
    }
}
