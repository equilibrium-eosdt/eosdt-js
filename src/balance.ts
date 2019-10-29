import { JsonRpc } from "eosjs"
import { EosdtConnectorInterface } from "./interfaces/connector"
import { balanceToNumber } from "./utils"

export class BalanceGetter {
    private rpc: JsonRpc

    constructor(connector: EosdtConnectorInterface) {
        this.rpc = connector.rpc
    }

    public async getNut(account: string): Promise<number> {
        const balance = await this.rpc.get_currency_balance(
            "eosdtnutoken",
            account,
            "NUT"
        )

        return balanceToNumber(balance)
    }

    public async getEosdt(account: string): Promise<number> {
        const balance = await this.rpc.get_currency_balance(
            "eosdtsttoken",
            account,
            "EOSDT"
        )

        return balanceToNumber(balance)
    }

    public async getEos(account: string): Promise<number> {
        const balance = await this.rpc.get_currency_balance("eosio.token", account, "EOS")
        return balanceToNumber(balance)
    }
}
