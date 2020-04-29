import { EosdtConnectorInterface } from "./interfaces/connector";
/**
 * Module to get account's balances of EOSDT, EOS, PBTC and NUT
 */
export declare class BalanceGetter {
    private rpc;
    /**
     * Creates instance of `BalanceGetter`
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector: EosdtConnectorInterface);
    /**
     * @param {string} account Account name
     * @returns {Promise<number>} EOS balance of account
     */
    getEos(account: string): Promise<number>;
    /**
     * @param {string} account Account name
     * @returns {Promise<number>} EOSDT balance of account
     */
    getEosdt(account: string): Promise<number>;
    /**
     * @param {string} account Account name
     * @returns {Promise<number>} NUT balance of account
     */
    getNut(account: string): Promise<number>;
    /**
     * @param {string} account Account name
     * @returns {Promise<number>} PBTC balance of account
     */
    getPbtc(account: string): Promise<number>;
}
