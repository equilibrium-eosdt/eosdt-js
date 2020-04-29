import { JsonRpc } from "eosjs"
import { EosdtConnectorInterface } from "./interfaces/connector"
import { balanceToNumber } from "./utils"

/**
 * Module to get account's balances of EOSDT, EOS, PBTC and NUT
 */
export class BalanceGetter {
    private rpc: JsonRpc

    /**
     * Creates instance of `BalanceGetter`
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector: EosdtConnectorInterface) {
        this.rpc = connector.rpc
    }

    /**
     * @param {string} account Account name
     * @returns {Promise<number>} EOS balance of account
     */
    public async getEos(account: string): Promise<number> {
        const balance = await this.rpc.get_currency_balance("eosio.token", account, "EOS")
        return balanceToNumber(balance)
    }

    /**
     * @param {string} account Account name
     * @returns {Promise<number>} EOSDT balance of account
     */
    public async getEosdt(account: string): Promise<number> {
        const balance = await this.rpc.get_currency_balance("eosdtsttoken", account, "EOSDT")

        return balanceToNumber(balance)
    }

    /**
     * @param {string} account Account name
     * @returns {Promise<number>} NUT balance of account
     */
    public async getNut(account: string): Promise<number> {
        const balance = await this.rpc.get_currency_balance("eosdtnutoken", account, "NUT")

        return balanceToNumber(balance)
    }

    /**
     * @param {string} account Account name
     * @returns {Promise<number>} PBTC balance of account
     */
    public async getPbtc(account: string): Promise<number> {
        const balance = await this.rpc.get_currency_balance("btc.ptokens", account, "PBTC")
        return balanceToNumber(balance)
    }
}
