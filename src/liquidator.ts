import { Api, JsonRpc } from "eosjs"
import { LIQUIDATOR_CONTRACTS, POSITION_CONTRACTS } from "./config"
import { EosdtConnectorInterface } from "./interfaces/connector"
import {
    LiquidatorParameters,
    liquidatorParametersKeys,
    LiquidatorSettings,
    liquidatorSettingsKeys
} from "./interfaces/liquidator"
import { ITrxParamsArgument } from "./interfaces/transaction"
import { amountToAssetString, setTransactionParams, validateExternalData } from "./utils"

/**
 * A class to work with EOSDT Liquidator contract. Creates EOS liquidator by default
 */
export class LiquidatorContract {
    protected posContractName: string
    protected tokenSymbol: string
    private contractName: string
    private rpc: JsonRpc
    private api: Api

    /**
     * Instantiates `LiquidatorContract`
     *  @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector: EosdtConnectorInterface, collateralToken: string = "EOS") {
        this.rpc = connector.rpc
        this.api = connector.api

        this.tokenSymbol = collateralToken
        this.contractName = LIQUIDATOR_CONTRACTS[collateralToken]
        this.posContractName = POSITION_CONTRACTS[collateralToken]
    }

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
    public async marginCallAndBuyoutCollat(
        senderName: string,
        positionId: number,
        eosdtToTransfer: string | number,
        trxMemo?: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const eosdtAssetString = amountToAssetString(eosdtToTransfer, "EOSDT")
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.posContractName,
                        name: "margincall",
                        authorization,
                        data: { position_id: positionId }
                    },
                    {
                        account: "eosdtsttoken",
                        name: "transfer",
                        authorization,
                        data: {
                            from: senderName,
                            to: this.contractName,
                            quantity: eosdtAssetString,
                            memo: trxMemo ? trxMemo : "eosdt-js buyout"
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
     * Sends EOSDT to liquidator contract. Used to cancel bad debt and buyout liquidator
     * collateral with discount
     * @param {string} senderName
     * @param {string | number} eosdtAmount
     * @param {string} [trxMemo]
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async transferEosdt(
        senderName: string,
        eosdtAmount: string | number,
        trxMemo?: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const eosdtAssetString = amountToAssetString(eosdtAmount, "EOSDT")
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: "eosdtsttoken",
                        name: "transfer",
                        authorization,
                        data: {
                            from: senderName,
                            to: this.contractName,
                            quantity: eosdtAssetString,
                            memo: trxMemo ? trxMemo : "eosdt-js transferEosdt()"
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
     * Sends NUT tokens to liquidator contract. Send token symbol in memo to buyout collateral
     * asset (liquidator parameter `nut_collat_balance`). With memo "EOSDT" it is used to
     * buyout EOSDT (liquidator parameter `surplus_debt`)
     * @param {string} senderName
     * @param {string | number} nutAmount
     * @param {string} trxMemo
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async transferNut(
        senderName: string,
        nutAmount: string | number,
        trxMemo: string,
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
                            to: this.contractName,
                            quantity: nutAssetString,
                            memo: trxMemo ? trxMemo : "eosdt-js transferNut()"
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
     * @returns {Promise<string>} Amount of system surplus debt
     */
    public async getSurplusDebt(): Promise<string> {
        const parameters = await this.getParameters()
        return parameters.surplus_debt
    }

    /**
     * @returns {Promise<string>} Amount of system bad debt
     */
    public async getBadDebt(): Promise<string> {
        const parameters = await this.getParameters()
        return parameters.bad_debt
    }

    /**
     * @returns {Promise<string>} Amount of collateral on liquidator contract balance
     */
    public async getCollatBalance(): Promise<string> {
        const parameters = await this.getParameters()
        return parameters.collat_balance
    }

    /**
     * @returns {Promise<string>} Amount of NUT collateral on liquidator
     */
    public async getNutCollatBalance(): Promise<string> {
        const parameters = await this.getParameters()
        return parameters.nut_collat_balance
    }

    /**
     * @returns {Promise<object>} Liquidator contract parameters object
     */
    public async getParameters(): Promise<LiquidatorParameters> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "parameters"
        })
        return validateExternalData(
            table.rows[0],
            "liquidator parameters",
            liquidatorParametersKeys
        )
    }

    /**
     * @returns {Promise<object>} Liquidator contract settings object
     */
    public async getSettings(): Promise<LiquidatorSettings> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "liqsettings"
        })
        return validateExternalData(table.rows[0], "liquidator settings", liquidatorSettingsKeys)
    }
}
