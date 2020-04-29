import { BasicPositionsContract } from "./basic-positions"
import { EosdtConnectorInterface } from "./interfaces/connector"
import {
    EosdtContractParameters,
    EosdtContractSettings,
    EosdtPosition,
    PositionReferral,
    positionReferralKeys,
    Referral,
    referralKeys
} from "./interfaces/positions-contract"
import { ITrxParamsArgument } from "./interfaces/transaction"
import { amountToAssetString, setTransactionParams, validateExternalData } from "./utils"

/**
 * Module to manage EOS-collateral positions (on contract `eosdtcntract`). It is inherited from
 * `BasicPositionsContract` and includes all it's methods.
 */
export class PositionsContract extends BasicPositionsContract {
    /**
     * Creates an instance of PositionsContract
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector: EosdtConnectorInterface) {
        super(connector, "EOS")
    }

    /**
     * Same as basic position `create`, but also sets a referral id
     *
     * @param {string} accountName Creator's account name
     * @param {string | number} collatAmount Amount of collateral tokens to transfer to position
     * @param {string | number} eosdtAmount EOSDT amount to issue
     * @param {number} referralId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async createWithReferral(
        accountName: string,
        collatAmount: string | number,
        eosdtAmount: string | number,
        referralId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: accountName, permission: trxParams.permission }]

        // Creates a new empty position
        const actions = []
        actions.push({
            account: this.contractName,
            name: "posandrefadd",
            authorization,
            data: {
                referral_id: referralId,
                maker: accountName
            }
        })

        // Sends collateral and generates EOSDT if collatAmount > 0
        if (typeof collatAmount === "string") collatAmount = parseFloat(collatAmount)
        if (collatAmount > 0) {
            const collatAssetString = amountToAssetString(
                collatAmount,
                this.tokenSymbol,
                this.decimals
            )

            if (typeof eosdtAmount === "string") eosdtAmount = parseFloat(eosdtAmount)
            const eosdtAssetString = amountToAssetString(eosdtAmount, "EOSDT")

            actions.push({
                account: this.tokenContract,
                name: "transfer",
                authorization,
                data: {
                    from: accountName,
                    to: this.contractName,
                    quantity: collatAssetString,
                    memo: eosdtAssetString === "0.000000000 EOSDT" ? "" : eosdtAssetString
                }
            })
        }

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
     * @param {number} id
     * @returns {Promise<object>} A position object
     */
    public async getPositionById(id: number): Promise<EosdtPosition> {
        return super.getPositionById(id) as Promise<EosdtPosition>
    }

    /**
     * @param {string} maker Account name
     * @returns {Promise<object | undefined>} Position object - first position that belongs to
     * maker account
     */
    public async getPositionByMaker(maker: string): Promise<EosdtPosition | undefined> {
        return super.getPositionByMaker(maker) as Promise<EosdtPosition | undefined>
    }

    /**
     * @param {string} maker Account name
     * @returns {Promise<object[]>} Array of all positions objects, created by the maker
     */
    public async getAllUserPositions(maker: string): Promise<EosdtPosition[]> {
        return super.getAllUserPositions(maker) as Promise<EosdtPosition[]>
    }

    /**
     * @returns {Promise<object[]>} An array of all positions created on this contract
     */
    public async getAllPositions(): Promise<EosdtPosition[]> {
        return super.getAllPositions() as Promise<EosdtPosition[]>
    }

    /**
     * @returns {Promise<object | undefined>}Position object - position of the account with
     * maximum id value
     */
    public async getLatestUserPosition(accountName: string): Promise<EosdtPosition | undefined> {
        return super.getLatestUserPosition(accountName) as Promise<EosdtPosition | undefined>
    }

    /**
     * @returns {Promise<object[]>} Positions contract parameters
     */
    public async getParameters(): Promise<EosdtContractParameters> {
        return super.getParameters() as Promise<EosdtContractParameters>
    }

    /**
     * @returns {Promise<object[]>} Positions contract settings
     */
    public async getSettings(): Promise<EosdtContractSettings> {
        return super.getSettings() as Promise<EosdtContractSettings>
    }

    /**
     * Creates new referral, staking given amount of NUT tokens. Rejects when amount is less then
     * `referral_min_stake` in positions contract settings.
     * @param {string} senderName
     * @param {string | number} nutAmount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async addReferral(
        senderName: string,
        nutAmount: string | number,
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
                            to: this.contractName,
                            from: senderName,
                            quantity: nutAssetString,
                            memo: `referral`
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
     * Removes referral and unstakes that referral's NUTs
     * @param {string} senderName
     * @param {number} referralId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async deleteReferral(
        senderName: string,
        referralId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "referraldel",
                        authorization,
                        data: { referral_id: referralId }
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
     * @param {number} id
     * @returns {Promise<object | undefined>} An object with information about referral
     */
    public async getReferralById(id: number): Promise<Referral | undefined> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "ctrreferrals",
            table_key: "referral_id",
            lower_bound: id,
            upper_bound: id
        })
        return validateExternalData(table.rows[0], "referral", referralKeys, true)
    }

    /**
     * @returns {Promise<object[]>} Table of existing referrals
     */
    public async getAllReferrals(): Promise<Referral[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "ctrreferrals",
            limit: 10_000
        })
        return validateExternalData(table.rows, "referral", referralKeys)
    }

    /**
     * @param {string} name Account name
     * @returns {Promise<object | undefined>} An object with information about referral
     */
    public async getReferralByName(name: string): Promise<Referral | undefined> {
        const table = await this.getAllReferrals()
        return table.find((row) => row.referral === name)
    }

    /**
     * @param {number} positionId
     * @returns {Promise<object | undefined>} Returns referral information object if position
     * with given id has a referral
     */
    public async getPositionReferral(positionId: number): Promise<PositionReferral | undefined> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "positionrefs",
            table_key: "position_id",
            lower_bound: positionId,
            upper_bound: positionId
        })
        return validateExternalData(table.rows, "position referral", positionReferralKeys, true)
    }

    /**
     * @returns {Promise<object[]>} An array of objects, containing positions ids and those
     * positions referrals ids
     */
    public async getPositionReferralsTable(): Promise<PositionReferral[]> {
        let lowerBound = 0
        const limit = 10_000

        const getTablePart = async (): Promise<any> => {
            const table = await this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "positionrefs",
                lower_bound: lowerBound,
                limit
            })
            return table
        }

        const firstRequest = await getTablePart()
        const result: PositionReferral[] = [...firstRequest.rows]
        let more = firstRequest.more

        while (more) {
            lowerBound = result[result.length - 1].position_id + 1
            const moreReferrals = await getTablePart()
            result.push(...moreReferrals.rows)
            more = moreReferrals.more
        }

        return validateExternalData(result, "position referral", positionReferralKeys)
    }

    /**
     * @returns {Promise<number[]>} An array of position objects with given referral id
     */
    public async getAllReferralPositionsIds(referralId: number): Promise<number[]> {
        return (await this.getPositionReferralsTable())
            .filter((refPos) => refPos.referral_id === referralId)
            .map((refInfo) => refInfo.position_id)
    }
}
