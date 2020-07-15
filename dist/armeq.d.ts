import { ArmContractSettings } from "./interfaces/armeq";
import { EosdtConnectorInterface } from "./interfaces/connector";
import { ITrxParamsArgument } from "./interfaces/transaction";
/**
 * Module to manage EOSDT arming operations
 */
export declare class ArmContract {
    private rpc;
    private api;
    private contractName;
    constructor(connector: EosdtConnectorInterface);
    /**
     * Creates EOSDT position with given EOS, then sells received EOSDT to buy more EOS and add it
     * to position. Contract would continue for 20 iterations or until given arm is reached
     * @param {string} accountName - name of account that sends EOS and receives position
     * @param {number | string} amount - transferred amount of EOS
     * @param {number} arm - arm value. With arm = 2.1 and 100 EOS user will receive position with 210 EOS
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    armEos(accountName: string, amount: number | string, arm: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Gives EOS-EOSDT position to 'arm.eq' contract and it arms that position (see `armEos`)
     * @param {string} owner - name of position maker account
     * @param {number} positionId
     * @param {number} arm - arm value. With arm = 2.1 and 100 EOS user will receive position with 210 EOS
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    armExistingEosPosition(owner: string, positionId: number, arm: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Reduces debt on position, selling it's collateral. Will stop, when position has LTV,
     * equal to critical LTV + arm safety margin. Excess EOSDT would be returned to maker acc
     * balance
     * @param {string} owner - name of maker account
     * @param {number} positionId
     * @param {number} debtTarget - approximate desired debt amount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    dearmEosPosition(owner: string, positionId: number, debtTarget: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * @returns {Promise<object>} Positions contract settings
     */
    getSettings(): Promise<ArmContractSettings>;
}
