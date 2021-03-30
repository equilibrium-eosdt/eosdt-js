import { LiquidatorConstructorData } from "./config";
import { EosdtConnectorInterface } from "./interfaces/connector";
import { LiquidatorParameters, LiquidatorSettings } from "./interfaces/liquidator";
import { ITrxParamsArgument } from "./interfaces/transaction";
/**
 * A class to work with EOSDT Liquidator contract. Creates EOS liquidator by default
 */
export declare class LiquidatorContract {
    protected posContractName: string;
    protected tokenSymbol: string;
    private contractName;
    private rpc;
    private api;
    /**
     * Instantiates `LiquidatorContract`
     *  @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector: EosdtConnectorInterface, collateralToken?: string, data?: LiquidatorConstructorData);
    /**
     * Performs margin call on a position and transfers specified amount of EOSDT to liquidator
     * to buyout freed collateral
     * @param {string} senderName
     * @param {number} positionId
     * @param {string | number} eosdtToTransfer
     * @param {string} [trxMemo]
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    marginCallAndBuyoutCollat(senderName: string, positionId: number, eosdtToTransfer: string | number, trxMemo?: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Sends EOSDT to liquidator contract. Used to cancel bad debt and buyout liquidator
     * collateral with discount
     * @param {string} senderName
     * @param {string | number} eosdtAmount
     * @param {string} [trxMemo]
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    transferEosdt(senderName: string, eosdtAmount: string | number, trxMemo?: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Sends NUT tokens to liquidator contract. Send token symbol in memo to buyout collateral
     * asset (liquidator parameter `nut_collat_balance`). With memo "EOSDT" it is used to
     * buyout EOSDT (liquidator parameter `surplus_debt`)
     * @param {string} senderName
     * @param {string | number} nutAmount
     * @param {string} trxMemo
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    transferNut(senderName: string, nutAmount: string | number, trxMemo: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * @returns {Promise<string>} Amount of system surplus debt
     */
    getSurplusDebt(): Promise<string>;
    /**
     * @returns {Promise<string>} Amount of system bad debt
     */
    getBadDebt(): Promise<string>;
    /**
     * @returns {Promise<string>} Amount of collateral on liquidator contract balance
     */
    getCollatBalance(): Promise<string>;
    /**
     * @returns {Promise<string>} Amount of NUT collateral on liquidator
     */
    getNutCollatBalance(): Promise<string>;
    /**
     * @returns {Promise<object>} Liquidator contract parameters object
     */
    getParameters(): Promise<LiquidatorParameters>;
    /**
     * @returns {Promise<object>} Liquidator contract settings object
     */
    getSettings(): Promise<LiquidatorSettings>;
}
