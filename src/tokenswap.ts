import { Api, JsonRpc } from "eosjs"
import { ConstructorData } from "./config"
import { EosdtConnectorInterface } from "./interfaces/connector"
import {
    TokenswapContractParams,
    TokenswapContractSettings,
    TokenswapPositions,
    tsContractParamsKeys,
    tsContractPositionsKeys,
    tsContractSettingsKeys
} from "./interfaces/tokenswap"
import { validateExternalData, setTransactionParams, amountToAssetString } from "./utils"
import { ITrxParamsArgument } from "./interfaces/transaction"

/**
 * A wrapper class to invoke actions of Equilibrium Token Swap contract
 */
export class TokenSwapContract {
    private name: string
    private rpc: JsonRpc
    private api: Api

    /**
     * Instantiates TokenSwapContract
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector: EosdtConnectorInterface, data?: ConstructorData) {
        this.rpc = connector.rpc
        this.api = connector.api

        if(data) {
            this.name = data.contractName
        }
        else {
            this.name = "tokenswap.eq"
        }
    }

    /**
     * Sends NUT tokens to TokenSwap contract. Send Ethereum address 
     * (available format with and without prefix "0x")
     * in memo to verify Ethereum signature
     * @param {string} senderName
     * @param {string | number} nutAmount
     * @param {string} ethereumAddress
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async transferNut(
        senderName: string,
        nutAmount: string | number,
        ethereumAddress: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const nutAssetString = amountToAssetString(nutAmount, "NUT")
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: "eosdtnutoken",
                        name: "transfer",
                        authorization,
                        data: {
                            from: senderName,
                            to: this.name,
                            quantity: nutAssetString,
                            memo: ethereumAddress
                        }
                    }
                ]
            },
            {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            }
        )

        return receipt
    }

    /**
     * Returns NUT from TokenSwap contract to account balance
     * and verifies Ethereum signature (available format with and without prefix "0x")
     * @param {string} toAccount
     * @param {number} positionId
     * @param {string} ethereumSignature
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async claim(
        toAccount: string,
        positionId: number,
        ethereumSignature: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: toAccount, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.name,
                        name: "claim",
                        authorization,
                        data: {
                            to: toAccount,
                            position_id: positionId,
                            signature: ethereumSignature
                        }
                    }
                ]
            },
            {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            }
        )
        return receipt
    }

    /**
     * @returns {Promise<object>} TokenSwap contract parameters
     */
    public async getParameters(): Promise<TokenswapContractParams> {
        const table = await this.rpc.get_table_rows({
            code: this.name,
            scope: this.name,
            table: "swpparams"
        })
        return validateExternalData(
            table.rows[0],
            "TokenSwap contract parameters",
            tsContractParamsKeys
        )
    }

    /**
     * @returns {Promise<object>} TokenSwap contract settings
     */
    public async getSettings(): Promise<TokenswapContractSettings> {
        const table = await this.rpc.get_table_rows({
            code: this.name,
            scope: this.name,
            table: "swpsettings"
        })
        return validateExternalData(
            table.rows[0],
            "TokenSwap contract settings",
            tsContractSettingsKeys
        )
    }

    /**
     * @returns {Promise<Array<object>>} An array of all positions created on TokenSwap contract
     */
    public async getAllPositions(): Promise<TokenswapPositions[]> {
        let lowerBound = 0
        const limit = 10_000

        const getTablePart = async (): Promise<any> => {
            const table = await this.rpc.get_table_rows({
                code: this.name,
                scope: this.name,
                table: "swppositions",
                lower_bound: lowerBound,
                limit
            })
            return table
        }

        const firstRequest = await getTablePart()
        const result: TokenswapPositions[] = [...firstRequest.rows]
        let more = firstRequest.more

        while (more) {
            lowerBound = result[result.length - 1].position_id + 1
            const morePositions = await getTablePart()
            result.push(...morePositions.rows)
            more = morePositions.more
        }

        return validateExternalData(result, "TokenSwap contract positions", tsContractPositionsKeys)
    }
}
