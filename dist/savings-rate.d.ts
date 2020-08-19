import { EosdtConnectorInterface } from "./interfaces/connector";
import { SRContractParams, SRContractSettings, SRPosition } from "./interfaces/savings-rate";
import { ITrxParamsArgument } from "./interfaces/transaction";
/**
 * A wrapper class to invoke actions of Equilibrium Savings Rate contract
 */
export declare class SavingsRateContract {
    private name;
    private rpc;
    private api;
    /**
     * Instantiates SavingsRateContract
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector: EosdtConnectorInterface);
    /**
     * Transfers EOSDT from user to Savings Rate contract
     * @param {string} senderName
     * @param {string | number} eosdtAmount
     * @param {string} [trxMemo]
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    stake(senderName: string, eosdtAmount: string | number, trxMemo?: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Returns EOSDT from Savings Rate contract to account balance
     * @param {string} toAccount
     * @param {string | number} eosdtAmount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    unstake(toAccount: string, eosdtAmount: string | number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * @returns {Promise<object[]>} An array of all positions on Savings Rate contract
     */
    getAllPositions(): Promise<SRPosition[]>;
    /**
     * @returns {Promise<object | undefined>} A Savings Rate position object with given id
     */
    getPositionById(id: number): Promise<SRPosition | undefined>;
    /**
     * @returns {Promise<object[]>} Array of all positions objects, created by the maker
     */
    getUserPositions(maker: string): Promise<SRPosition[]>;
    /**
     * @returns {Promise<object>} Savings Rate contract parameters
     */
    getParameters(): Promise<SRContractParams>;
    /**
     * @returns {Promise<object>} Savings Rate contract settings
     */
    getSettings(): Promise<SRContractSettings>;
}
