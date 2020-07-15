import { Api, JsonRpc } from "eosjs"
import { DECIMALS, POSITION_CONTRACTS, TOKEN_CONTRACTS } from "./config"
import {
    BasicEosdtPosition,
    BasicEosdtPosParameters,
    basicEosdtPosParametersKeys,
    PosContractSettings,
    basicPositionKeys,
    posContractSettingsKeys
} from "./interfaces/basic-positions-contract"
import { EosdtConnectorInterface } from "./interfaces/connector"
import {
    eosdtPosParametersKeys,
    LtvRatios,
    ltvRatiosKeys,
    positionKeys,
    TokenRate,
    tokenRateKeys
} from "./interfaces/positions-contract"
import { ITrxParamsArgument } from "./interfaces/transaction"
import {
    amountToAssetString,
    balanceToNumber,
    setTransactionParams,
    validateExternalData
} from "./utils"

/**
 * Module to manage EOSDT positions with non-EOS collateral
 */
export class BasicPositionsContract {
    protected rpc: JsonRpc
    protected api: Api

    protected tokenSymbol: string
    protected decimals: number
    protected contractName: string
    protected tokenContract: string

    protected positionKeys: Array<string>
    protected contractParametersKeys: Array<string>
    protected contractSettingsKeys: Array<string>

    /**
     * Creates an instance of `BasicPositionsContract`
     * @param connector EosdtConnector (see `README` section `Usage`)
     * @param {string} tokenSymbol Currently only "PBTC"
     */
    constructor(connector: EosdtConnectorInterface, tokenSymbol: string) {
        const availableCollateralTokens = ["EOS", "PBTC"]
        if (!availableCollateralTokens.includes(tokenSymbol)) {
            const errMsg =
                `Cannot initiate positions contract logic for token '${tokenSymbol}'. ` +
                `Available tokens: ${availableCollateralTokens.join(", ")}`
            throw new Error(errMsg)
        }

        this.tokenSymbol = tokenSymbol
        this.decimals = DECIMALS[tokenSymbol]

        this.rpc = connector.rpc
        this.api = connector.api

        this.contractName = POSITION_CONTRACTS[tokenSymbol]
        this.tokenContract = TOKEN_CONTRACTS[tokenSymbol]
        this.contractSettingsKeys = posContractSettingsKeys

        if (tokenSymbol === "EOS") {
            this.positionKeys = positionKeys
            this.contractParametersKeys = eosdtPosParametersKeys
        } else {
            this.positionKeys = basicPositionKeys
            this.contractParametersKeys = basicEosdtPosParametersKeys
        }
    }

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
    public async newPosition(
        accountName: string,
        collatAmount: string | number,
        eosdtAmount: string | number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: accountName, permission: trxParams.permission }]

        if (typeof collatAmount === "string") collatAmount = parseFloat(collatAmount)
        if (typeof eosdtAmount === "string") eosdtAmount = parseFloat(eosdtAmount)

        if (collatAmount <= 0) {
            const errMsg =
                `To create position via transfer you need to transfer positive amount of ` +
                `${this.tokenSymbol}. Cannot transfer '${collatAmount}'. You can create empty ` +
                `position, using method '${this.newEmptyPosition.name}'`
            throw new Error(errMsg)
        }

        const collatAssetString = amountToAssetString(collatAmount, this.tokenSymbol)

        const eosdtAssetString = amountToAssetString(eosdtAmount, "EOSDT")

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.tokenContract,
                        name: "transfer",
                        authorization,
                        data: {
                            from: accountName,
                            to: this.contractName,
                            quantity: collatAssetString,
                            memo: eosdtAssetString
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
     * Creates new position with 0 debt and collateral
     *
     * @param {string} maker Account to create position for
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     */
    public async newEmptyPosition(
        maker: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: maker, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "positionadd",
                        authorization,
                        data: { maker }
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
     * Transfers position ownership to another account
     * @param {string} giverAccount Account name
     * @param {string} receiver Account name
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async give(
        giverAccount: string,
        receiver: string,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: giverAccount, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "positiongive",
                        authorization,
                        data: {
                            position_id: positionId,
                            to: receiver
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
     * Sends collateral to position to increase it's collateralization.
     *
     * @param {string} senderName Account name
     * @param {string | number} amount Amount of added collateral
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async addCollateral(
        senderName: string,
        amount: string | number,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const collatAssetString = amountToAssetString(amount, this.tokenSymbol, this.decimals)
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.tokenContract,
                        name: "transfer",
                        authorization,
                        data: {
                            to: this.contractName,
                            from: senderName,
                            quantity: collatAssetString,
                            memo: `position_id:${positionId}`
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
     * Returns collateral from position, LTV must remain above critical for this action to work
     * @param {string} senderName Account name
     * @param {string | number} amount
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async deleteCollateral(
        senderName: string,
        amount: string | number,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const collatAssetString = amountToAssetString(amount, this.tokenSymbol, this.decimals)
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "colateraldel",
                        authorization,
                        data: {
                            position_id: positionId,
                            collateral: collatAssetString
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
     * Issues additional EOSDT if this does not bring position LTV below critical.
     * @param {string} senderName Account name
     * @param {string | number} amount Not more than 4 significant decimals
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async generateDebt(
        senderName: string,
        amount: string | number,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const eosdtAssetString = amountToAssetString(amount, "EOSDT")
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "debtgenerate",
                        authorization,
                        data: {
                            debt: eosdtAssetString,
                            position_id: positionId
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
     * Transfers EOSDT to position to burn debt. Excess debt would be refunded to user account
     * @param {string} senderName Account name
     * @param {string | number} amount Not more than 4 significant decimals
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async burnbackDebt(
        senderName: string,
        amount: string | number,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const eosdtAssetString = amountToAssetString(amount, "EOSDT")
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const actions = [
            {
                account: "eosdtsttoken",
                name: "transfer",
                authorization,
                data: {
                    to: this.contractName,
                    from: senderName,
                    quantity: eosdtAssetString,
                    memo: `position_id:${positionId}`
                }
            }
        ]

        const receipt = await this.api.transact(
            { actions },
            {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            }
        )

        return receipt
    }

    /**
     * Transfers collateral tokens to position and generates EOSDT debt
     * @param {string} senderName Account name
     * @param {string | number} addedCollatAmount
     * @param {string | number} generatedDebtAmount
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async addCollatAndDebt(
        senderName: string,
        addedCollatAmount: string | number,
        generatedDebtAmount: string | number,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const collatAssetString = amountToAssetString(
            addedCollatAmount,
            this.tokenSymbol,
            this.decimals
        )
        const debtAssetString = amountToAssetString(generatedDebtAmount, "EOSDT")
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.tokenContract,
                        name: "transfer",
                        authorization,
                        data: {
                            to: this.contractName,
                            from: senderName,
                            quantity: collatAssetString,
                            memo: `position_id:${positionId}`
                        }
                    },
                    {
                        account: this.contractName,
                        name: "debtgenerate",
                        authorization,
                        data: {
                            debt: debtAssetString,
                            position_id: positionId
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
     * Withdraws specified amount of PBTC tokens from position and redeems that PBTCs
     * @param {string} senderName Account name
     * @param {string | number} amount
     * @param {number} positionId
     * @param {string} btcAddress
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async pbtcDelCollatAndRedeem(
        senderName: string,
        amount: string | number,
        positionId: number,
        btcAddress: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        if (this.tokenSymbol !== "PBTC") {
            throw new Error(`pbtcDelCollatAndRedeem() can only be used with PBTC positions wrapper`)
        }

        const collatAssetString = amountToAssetString(amount, this.tokenSymbol, this.decimals)
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "colateraldel",
                        authorization,
                        data: {
                            position_id: positionId,
                            collateral: collatAssetString
                        }
                    },
                    {
                        account: this.tokenContract,
                        name: "redeem",
                        authorization,
                        data: {
                            sender: senderName,
                            quantity: collatAssetString,
                            memo: btcAddress
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
     * Called on a position with critical LTV to perform a margin call
     * @param {string} senderName Account name
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async marginCall(
        senderName: string,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "margincall",
                        authorization,
                        data: {
                            position_id: positionId
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
     * Deletes position that has 0 debt.
     * @param {string} creator Account name
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async del(
        creator: string,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: creator, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "positiondel",
                        authorization,
                        data: { position_id: positionId }
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
     * Burns debt on position and deletes it. Debt must be = 0 to delete position. Excess debt
     * would be refunded to user account
     * @param {string} maker Account name
     * @param {string | number} debtAmount Must be > than position debt
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async paybackAndDelete(
        maker: string,
        positionId: number,
        debtAmount: string | number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: maker, permission: trxParams.permission }]
        const eosdtAssetString = amountToAssetString(debtAmount, "EOSDT")
        if (typeof debtAmount === "string") debtAmount = parseFloat(debtAmount)

        let actions: object[] = []

        // Burning debt on position
        if (debtAmount > 0) {
            actions.push({
                account: "eosdtsttoken",
                name: "transfer",
                authorization,
                data: {
                    to: this.contractName,
                    from: maker,
                    quantity: eosdtAssetString,
                    memo: `position_id:${positionId}`
                }
            })
        }

        // Deleting position
        actions.push({
            account: this.contractName,
            name: "positiondel",
            authorization,
            data: { position_id: positionId }
        })

        const receipt = await this.api.transact(
            { actions },
            {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            }
        )
        return receipt
    }

    /**
     * Used to close a position in an event of global shutdown.
     * @param {string} senderAccount Account name
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async close(
        senderAccount: string,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderAccount, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "close",
                        authorization,
                        data: { position_id: positionId }
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
     * @returns {Promise<number>} Contract's collateral asset balance.
     */
    public async getContractTokenBalance(): Promise<number> {
        const balance = await this.rpc.get_currency_balance(
            this.tokenContract,
            this.contractName,
            this.tokenSymbol
        )
        return balanceToNumber(balance)
    }

    /**
     * @returns {Promise<Array<object>>} Table of current system token prices (rates)
     */
    public async getRates(): Promise<TokenRate[]> {
        const table = await this.rpc.get_table_rows({
            code: "eosdtorclize",
            scope: "eosdtorclize",
            table: "oraclerates",
            limit: 1000
        })
        return validateExternalData(table.rows, "rate", tokenRateKeys)
    }

    public async getRelativeRates(): Promise<TokenRate[]> {
        const warning =
            `[WARNING] PositionsContract.getRelativeRates() is deprecated and will be removed ` +
            `soon. It is currently an alias for PositionsContract.getRates(). Use it instead`
        console.error(warning)
        return this.getRates()
    }

    /**
     * @returns {Promise<Array<object>>} Table of current LTV ratios for all positions.
     */
    public async getLtvRatiosTable(): Promise<LtvRatios[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "ctrltvratios",
            limit: 10_000
        })
        return validateExternalData(table.rows, "ltv ratio", ltvRatiosKeys)
    }

    /**
     * @param {number} id Position id
     * @returns {Promise<object | undefined>} Current LTV ratio for position by id
     */
    public async getPositionLtvRatio(id: number): Promise<LtvRatios | undefined> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "ctrltvratios",
            table_key: "position_id",
            lower_bound: id,
            upper_bound: id
        })
        return validateExternalData(table.rows[0], "ltv ratio", ltvRatiosKeys, true)
    }

    /**
     * @param {number} id Position id
     * @returns {Promise<object | undefined>} A position object
     */
    public async getPositionById(id: number): Promise<BasicEosdtPosition | undefined> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "positions",
            table_key: "position_id",
            lower_bound: id,
            upper_bound: id
        })
        return validateExternalData(table.rows[0], "position", this.positionKeys, true)
    }

    /**
     * @param {string} maker Account name
     * @returns {Promise<object | undefined>} Position object - first position that belongs to
     * maker account
     */
    public async getPositionByMaker(maker: string): Promise<BasicEosdtPosition | undefined> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "positions",
            limit: 1,
            table_key: "maker",
            index_position: "secondary",
            key_type: "name",
            lower_bound: maker,
            upper_bound: maker
        })
        return validateExternalData(table.rows[0], "position", this.positionKeys, true)
    }

    /**
     * @param {string} maker Account name
     * @returns {Promise<Array<object>>} Array of all positions objects, created by the maker
     */
    public async getAllUserPositions(maker: string): Promise<BasicEosdtPosition[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "positions",
            limit: 10_000,
            table_key: "maker",
            index_position: "secondary",
            key_type: "name",
            lower_bound: maker,
            upper_bound: maker
        })
        return validateExternalData(table.rows, "position", this.positionKeys)
    }

    /**
     * @returns {Promise<Array<object>>} An array of all positions created on this contract
     */
    public async getAllPositions(): Promise<BasicEosdtPosition[]> {
        let lowerBound = 0
        const limit = 10_000

        const getTablePart = async (): Promise<any> => {
            const table = await this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "positions",
                lower_bound: lowerBound,
                limit
            })
            return table
        }

        const firstRequest = await getTablePart()
        const result: BasicEosdtPosition[] = [...firstRequest.rows]
        let more = firstRequest.more

        while (more) {
            lowerBound = result[result.length - 1].position_id + 1
            const morePositions = await getTablePart()
            result.push(...morePositions.rows)
            more = morePositions.more
        }

        return validateExternalData(result, "position", this.positionKeys)
    }

    /**
     * @param {string} accountName
     * @returns {Promise<object | undefined>} Position object - position of the account with
     * maximum id value
     */
    public async getLatestUserPosition(
        accountName: string
    ): Promise<BasicEosdtPosition | undefined> {
        const userPositions = await this.getAllUserPositions(accountName)

        if (userPositions.length === 0) return

        return userPositions.reduce((a, b) => {
            if (Math.max(a.position_id, b.position_id) === a.position_id) return a
            else return b
        })
    }

    /**
     * @returns {Promise<object>} Positions contract parameters
     */
    public async getParameters(): Promise<BasicEosdtPosParameters> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "parameters"
        })
        return validateExternalData(
            table.rows[0],
            "positions contract parameters",
            this.contractParametersKeys
        )
    }

    /**
     * @returns {Promise<object>} Positions contract settings
     */
    public async getSettings(): Promise<PosContractSettings> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "ctrsettings"
        })
        return validateExternalData(
            table.rows[0],
            "positions contract settings",
            this.contractSettingsKeys
        )
    }
}
