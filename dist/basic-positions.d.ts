import { Api, JsonRpc } from "eosjs";
import { PositionsConstructorData } from "./config";
import { BasicEosdtPosition, BasicEosdtPosParameters, PosContractSettings } from "./interfaces/basic-positions-contract";
import { EosdtConnectorInterface } from "./interfaces/connector";
import { LtvRatios, TokenRate, TokenRateNew } from "./interfaces/positions-contract";
import { ITrxParamsArgument } from "./interfaces/transaction";
/**
 * Module to manage EOSDT positions with non-EOS collateral
 */
export declare class BasicPositionsContract {
    protected rpc: JsonRpc;
    protected api: Api;
    protected tokenSymbol: string;
    protected decimals: number;
    protected contractName: string;
    protected tokenContract: string;
    protected ratesContract: string;
    protected positionKeys: Array<string>;
    protected contractParametersKeys: Array<string>;
    protected contractSettingsKeys: Array<string>;
    /**
     * Creates an instance of `BasicPositionsContract`
     * @param connector EosdtConnector (see `README` section `Usage`)
     * @param {string} tokenSymbol "PBTC" or "PETH"
     */
    constructor(connector: EosdtConnectorInterface, tokenSymbol: string, data?: PositionsConstructorData);
    /**
     * Creates new position, sending specified amount of collateral and issuing specified amount
     * of EOSDT to creator.
     *
     * @param {string} accountName Creator's account name
     * @param {string | number} collatAmount Amount of collateral tokens to transfer to position
     * @param {string | number} eosdtAmount EOSDT amount to issue
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    newPosition(accountName: string, collatAmount: string | number, eosdtAmount: string | number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Creates new position with 0 debt and collateral
     *
     * @param {string} maker Account to create position for
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     */
    newEmptyPosition(maker: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Transfers position ownership to another account
     * @param {string} giverAccount Account name
     * @param {string} receiver Account name
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    give(giverAccount: string, receiver: string, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Sends collateral to position to increase it's collateralization.
     *
     * @param {string} senderName Account name
     * @param {string | number} amount Amount of added collateral
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    addCollateral(senderName: string, amount: string | number, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Returns collateral from position, LTV must remain above critical for this action to work
     * @param {string} senderName Account name
     * @param {string | number} amount
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    deleteCollateral(senderName: string, amount: string | number, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Issues additional EOSDT if this does not bring position LTV below critical.
     * @param {string} senderName Account name
     * @param {string | number} amount Not more than 4 significant decimals
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    generateDebt(senderName: string, amount: string | number, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Transfers EOSDT to position to burn debt. Excess debt would be refunded to user account
     * @param {string} senderName Account name
     * @param {string | number} amount Not more than 4 significant decimals
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    burnbackDebt(senderName: string, amount: string | number, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Transfers collateral tokens to position and generates EOSDT debt
     * @param {string} senderName Account name
     * @param {string | number} addedCollatAmount
     * @param {string | number} generatedDebtAmount
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    addCollatAndDebt(senderName: string, addedCollatAmount: string | number, generatedDebtAmount: string | number, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Withdraws specified amount of PBTC tokens from position and redeems that PBTCs
     * @param {string} senderName Account name
     * @param {string | number} amount
     * @param {number} positionId
     * @param {string} btcAddress
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    pbtcDelCollatAndRedeem(senderName: string, amount: string | number, positionId: number, btcAddress: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Called on a position with critical LTV to perform a margin call
     * @param {string} senderName Account name
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    marginCall(senderName: string, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Deletes position that has 0 debt.
     * @param {string} creator Account name
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    del(creator: string, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Burns debt on position and deletes it. Debt must be = 0 to delete position. Excess debt
     * would be refunded to user account
     * @param {string} maker Account name
     * @param {string | number} debtAmount Must be > than position debt
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    paybackAndDelete(maker: string, positionId: number, debtAmount: string | number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Used to close a position in an event of global shutdown.
     * @param {string} senderAccount Account name
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    close(senderAccount: string, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * @returns {Promise<number>} Contract's collateral asset balance.
     */
    getContractTokenBalance(): Promise<number>;
    /**
     * @returns {Promise<Array<object>>} Table of current system token prices (contract
     * 'pricefeed.eq' - table 'oraclerates'). These are valid rates, except fields
     * 'backend_price' and 'backend_update' are missing
     */
    getRates(): Promise<TokenRate[]>;
    /**
     * @returns {Promise<Array<object>>} Table of current system token prices (contract
     * 'pricefeed.eq' - table 'newrates'). These are valid rates including all rates data
     */
    getRatesNew(): Promise<TokenRateNew[]>;
    getRelativeRates(): Promise<TokenRate[]>;
    /**
     * @returns {Promise<Array<object>>} Table of current LTV ratios for all positions.
     */
    getLtvRatiosTable(): Promise<LtvRatios[]>;
    /**
     * @param {number} id Position id
     * @returns {Promise<object | undefined>} Current LTV ratio for position by id
     */
    getPositionLtvRatio(id: number): Promise<LtvRatios | undefined>;
    /**
     * @param {number} id Position id
     * @returns {Promise<object | undefined>} A position object
     */
    getPositionById(id: number): Promise<BasicEosdtPosition | undefined>;
    /**
     * @param {string} maker Account name
     * @returns {Promise<object | undefined>} Position object - first position that belongs to
     * maker account
     */
    getPositionByMaker(maker: string): Promise<BasicEosdtPosition | undefined>;
    /**
     * @param {string} maker Account name
     * @returns {Promise<Array<object>>} Array of all positions objects, created by the maker
     */
    getAllUserPositions(maker: string): Promise<BasicEosdtPosition[]>;
    /**
     * @returns {Promise<Array<object>>} An array of all positions created on this contract
     */
    getAllPositions(): Promise<BasicEosdtPosition[]>;
    /**
     * @param {string} accountName
     * @returns {Promise<object | undefined>} Position object - position of the account with
     * maximum id value
     */
    getLatestUserPosition(accountName: string): Promise<BasicEosdtPosition | undefined>;
    /**
     * @returns {Promise<object>} Positions contract parameters
     */
    getParameters(): Promise<BasicEosdtPosParameters>;
    /**
     * @returns {Promise<object>} Positions contract settings
     */
    getSettings(): Promise<PosContractSettings>;
}
