import { EosdtConnectorInterface } from "./interfaces/connector";
import { BpPosition } from "./interfaces/governance";
import { ITrxParamsArgument } from "./interfaces/transaction";
/**
 * Class for EOSDT Governance actions, related to block producers management
 */
export declare class BpManager {
    private contractName;
    private rpc;
    private api;
    /**
     * Creates instance of `BpManager`
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector: EosdtConnectorInterface);
    /**
     * @returns {Promise<object[]>} An array of objects, that contain information about
     * registered block producers
     */
    getAllBpPositions(): Promise<BpPosition[]>;
    /**
     * @returns {Promise<object | undefined>} Object with information about a registered block
     * producer
     */
    getBpPosition(bpName: string): Promise<BpPosition | undefined>;
    /**
     * Registers a block producer in BP voting reward program
     * @param {string} bpName Account name
     * @param {number} rewardAmount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    registerBlockProducer(bpName: string, rewardAmount: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Changes amount of EOS reward payed by block producer
     * @param {string} bpName Account name
     * @param {number} rewardAmount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    changeBlockProducerReward(bpName: string, rewardAmount: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Deactivates block producer
     * @param {string} bpName Account name
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    unregisterBlockProducer(bpName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Deposit EOS into block producer Governance account to pay reward. Any account can deposit
     * EOS for a block producer
     * @param {string} fromAccount Paying account name
     * @param {string} bpName
     * @param {number | string} eosAmount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    depositEos(fromAccount: string, bpName: string, eosAmount: number | string, transactionParams?: ITrxParamsArgument): Promise<any>;
}
