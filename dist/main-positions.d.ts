import { BasicPositionsContract } from "./basic-positions";
import { PositionsConstructorData } from "./config";
import { EosdtConnectorInterface } from "./interfaces/connector";
import { EosdtContractParameters, EosdtPosition, PositionReferral, Referral } from "./interfaces/positions-contract";
import { ITrxParamsArgument } from "./interfaces/transaction";
/**
 * Module to manage EOS-collateral positions (on contract `eosdtcntract`). It is inherited from
 * `BasicPositionsContract` and includes all it's methods.
 */
export declare class PositionsContract extends BasicPositionsContract {
    /**
     * Creates an instance of PositionsContract
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector: EosdtConnectorInterface, data?: PositionsConstructorData);
    /**
     * Creates position that has a referral. Position would have 0 collateral and 0 debt
     *
     * @param {string} maker Account to create position for
     * @param {number} referralId Id of a referral
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     */
    newEmptyPositionWithRef(maker: string, referralId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * @param {number} id
     * @returns {Promise<object>} A position object
     */
    getPositionById(id: number): Promise<EosdtPosition>;
    /**
     * @param {string} maker Account name
     * @returns {Promise<object | undefined>} Position object - first position that belongs to
     * maker account
     */
    getPositionByMaker(maker: string): Promise<EosdtPosition | undefined>;
    /**
     * @param {string} maker Account name
     * @returns {Promise<object[]>} Array of all positions objects, created by the maker
     */
    getAllUserPositions(maker: string): Promise<EosdtPosition[]>;
    /**
     * @returns {Promise<object[]>} An array of all positions created on this contract
     */
    getAllPositions(): Promise<EosdtPosition[]>;
    /**
     * @returns {Promise<object | undefined>}Position object - position of the account with
     * maximum id value
     */
    getLatestUserPosition(accountName: string): Promise<EosdtPosition | undefined>;
    /**
     * @returns {Promise<object[]>} Positions contract parameters
     */
    getParameters(): Promise<EosdtContractParameters>;
    /**
     * Creates new referral, staking given amount of NUT tokens. Rejects when amount is less then
     * `referral_min_stake` in positions contract settings.
     * @param {string} senderName
     * @param {string | number} nutAmount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    addReferral(senderName: string, nutAmount: string | number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Removes referral and unstakes that referral's NUTs
     * @param {string} senderName
     * @param {number} referralId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    deleteReferral(senderName: string, referralId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * @param {number} id
     * @returns {Promise<object | undefined>} An object with information about referral
     */
    getReferralById(id: number): Promise<Referral | undefined>;
    /**
     * @returns {Promise<object[]>} Table of existing referrals
     */
    getAllReferrals(): Promise<Referral[]>;
    /**
     * @param {string} name Account name
     * @returns {Promise<object | undefined>} An object with information about referral
     */
    getReferralByName(name: string): Promise<Referral | undefined>;
    /**
     * @param {number} positionId
     * @returns {Promise<object | undefined>} Returns referral information object if position
     * with given id has a referral
     */
    getPositionReferral(positionId: number): Promise<PositionReferral | undefined>;
    /**
     * @returns {Promise<object[]>} An array of objects, containing positions ids and those
     * positions referrals ids
     */
    getPositionReferralsTable(): Promise<PositionReferral[]>;
    /**
     * @returns {Promise<number[]>} An array of position objects with given referral id
     */
    getAllReferralPositionsIds(referralId: number): Promise<number[]>;
}
