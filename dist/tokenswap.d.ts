import { EosdtConnectorInterface } from "./interfaces/connector";
import { TokenswapContractParams, TokenswapContractSettings, TokenswapPositions } from "./interfaces/tokenswap";
import { ITrxParamsArgument } from "./interfaces/transaction";
/**
 * A wrapper class to invoke actions of Equilibrium Token Swap contract
 */
export declare class TokenSwapContract {
    private name;
    private rpc;
    private api;
    /**
     * Instantiates TokenSwapContract
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector: EosdtConnectorInterface);
    /**
     * Sends NUT tokens to TokenSwap contract. Send Ethereum address (format with prefix "0x")
     * in memo to verify Ethereum signature
     * @param {string} senderName
     * @param {string | number} nutAmount
     * @param {string} ethereumAddress
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    transferNut(senderName: string, nutAmount: string | number, ethereumAddress: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Returns NUT from TokenSwap contract to account balance
     * and verifies Ethereum signature (format with prefix "0x")
     * @param {string} toAccount
     * @param {number} positionId
     * @param {string} ethereumSignature
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    claim(toAccount: string, positionId: number, ethereumSignature: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * @returns {Promise<object>} TokenSwap contract parameters
     */
    getParameters(): Promise<TokenswapContractParams>;
    /**
     * @returns {Promise<object>} TokenSwap contract settings
     */
    getSettings(): Promise<TokenswapContractSettings>;
    /**
     * @returns {Promise<Array<object>>} An array of all positions created on TokenSwap contract
     */
    getAllPositions(): Promise<TokenswapPositions[]>;
}
