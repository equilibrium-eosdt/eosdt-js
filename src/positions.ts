import { Api, JsonRpc } from "eosjs"
import { EosdtConnectorInterface } from "./interfaces/connector"
import {
    contractSettingsKeys,
    EosdtContractParameters,
    EosdtContractSettings,
    EosdtPosition,
    LtvRatios,
    ltvRatiosKeys,
    positionKeys,
    PositionReferral,
    positionReferralKeys,
    Referral,
    referralKeys,
    TokenRate,
    tokenRateKeys,
    tokenRateKeys_deprecated,
    TokenRate_deprecated,
    сontractParametersKeys
} from "./interfaces/positions-contract"
import { ITrxParamsArgument } from "./interfaces/transaction"
import {
    amountToAssetString,
    balanceToNumber,
    setTransactionParams,
    validateExternalData
} from "./utils"

export class PositionsContract {
    protected contractName: string = "eosdtcntract"
    protected tokenSymbol: string = "EOS"
    protected tokenContract: string = "eosio.token"
    protected decimals: number = 4
    private rpc: JsonRpc
    private api: Api

    constructor(connector: EosdtConnectorInterface) {
        this.rpc = connector.rpc
        this.api = connector.api
    }

    public async create(
        accountName: string,
        collatAmount: string | number,
        eosdtAmount: string | number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: accountName, permission: trxParams.permission }]

        // Creates a new empty position
        const actions = []
        actions.push({
            account: this.contractName,
            name: "positionadd",
            authorization,
            data: { maker: accountName }
        })

        // Sends collateral and generates EOSDT if collatAmount > 0
        if (typeof collatAmount === "string") collatAmount = parseFloat(collatAmount)

        if (collatAmount > 0) {
            const collatAssetString = amountToAssetString(
                collatAmount,
                this.tokenSymbol,
                this.decimals
            )

            const eosdtAssetString = amountToAssetString(eosdtAmount, "EOSDT")

            actions.push({
                account: this.tokenContract,
                name: "transfer",
                authorization,
                data: {
                    from: accountName,
                    to: this.contractName,
                    quantity: collatAssetString,
                    memo: eosdtAssetString
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
                    memo: eosdtAssetString
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

    public async createWhenPositionsExist(
        accountName: string,
        collatAmount: string | number,
        eosdtAmount: string | number,
        referralId?: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: accountName, permission: trxParams.permission }]

        let createPosAction: any
        if (referralId !== undefined) {
            createPosAction = {
                account: this.contractName,
                name: "posandrefadd",
                authorization,
                data: {
                    referral_id: referralId,
                    maker: accountName
                }
            }
        } else {
            createPosAction = {
                account: this.contractName,
                name: "positionadd",
                authorization,
                data: { maker: accountName }
            }
        }

        // Creating position and getting it's ID
        const creationReceipt = await this.api.transact(
            { actions: [createPosAction] },
            {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            }
        )

        const position = await this.getLatestUserPosition(accountName)
        if (!position) throw new Error(`Couldn't find position for user ${accountName}`)
        const positionId = position.position_id

        const actions = []
        // Sends collateral and generates EOSDT if collatAmount > 0
        if (typeof collatAmount === "string") collatAmount = parseFloat(collatAmount)
        if (collatAmount > 0) {
            const collatAssetString = amountToAssetString(
                collatAmount,
                this.tokenSymbol,
                this.decimals
            )

            actions.push({
                account: this.tokenContract,
                name: "transfer",
                authorization,
                data: {
                    from: accountName,
                    to: this.contractName,
                    quantity: collatAssetString,
                    memo: `position_id:${positionId}`
                }
            })
        }

        if (typeof eosdtAmount === "string") eosdtAmount = parseFloat(eosdtAmount)
        if (eosdtAmount > 0) {
            const eosdtAssetString = amountToAssetString(eosdtAmount, "EOSDT")
            actions.push({
                account: this.contractName,
                name: "debtgenerate",
                authorization,
                data: {
                    debt: eosdtAssetString,
                    position_id: positionId
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

        return [creationReceipt, receipt]
    }

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

    public async paybackAndDelete(
        maker: string,
        positionId: number,
        debtAmount?: string | number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: maker, permission: trxParams.permission }]

        if (debtAmount !== undefined) {
            const eosdtAssetString = amountToAssetString(debtAmount, "EOSDT")

            const receipt = await this.api.transact(
                {
                    actions: [
                        {
                            account: "eosdtsttoken",
                            name: "transfer",
                            authorization,
                            data: {
                                to: this.contractName,
                                from: maker,
                                quantity: eosdtAssetString,
                                memo: `position_id:${positionId}`
                            }
                        },
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

        const receiptDel = await this.del(maker, positionId)
        return receiptDel
    }

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

    public async addCollateral(
        senderName: string,
        amount: string | number,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const collatAssetString = amountToAssetString(
            amount,
            this.tokenSymbol,
            this.decimals
        )
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
                            maker: senderName,
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

    public async deleteCollateral(
        senderName: string,
        amount: string | number,
        positionId: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const collatAssetString = amountToAssetString(
            amount,
            this.tokenSymbol,
            this.decimals
        )
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

    public async burnbackDebt(
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
            },
            {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            }
        )

        return receipt
    }

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

    public async getContractTokenBalance(): Promise<number> {
        const balance = await this.rpc.get_currency_balance(
            this.tokenContract,
            this.contractName,
            this.tokenSymbol
        )
        return balanceToNumber(balance)
    }

    /* @deprecated */
    public async getContractEosBalance(): Promise<number> {
        const balance = await this.rpc.get_currency_balance(
            "eosio.token",
            "eosdtcntract",
            "EOS"
        )
        return balanceToNumber(balance)
    }

    /* @deprecated */
    public async getRates(): Promise<TokenRate_deprecated[]> {
        const table = await this.rpc.get_table_rows({
            code: "eosdtorclize",
            scope: "eosdtorclize",
            table: "orarates",
            limit: 1000
        })
        return validateExternalData(
            table.rows,
            "rate_deprecated",
            tokenRateKeys_deprecated
        )
    }

    public async getRelativeRates(): Promise<TokenRate[]> {
        const table = await this.rpc.get_table_rows({
            code: "eosdtorclize",
            scope: "eosdtorclize",
            table: "oraclerates",
            limit: 1000
        })
        return validateExternalData(table.rows, "rate", tokenRateKeys)
    }

    public async getPositionById(id: number): Promise<EosdtPosition | undefined> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "positions",
            table_key: "position_id",
            lower_bound: id,
            upper_bound: id
        })
        return validateExternalData(table.rows[0], "position", positionKeys, true)
    }

    public async getPositionByMaker(maker: string): Promise<EosdtPosition | undefined> {
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
        return validateExternalData(table.rows[0], "position", positionKeys, true)
    }

    public async getAllUserPositions(maker: string): Promise<EosdtPosition[]> {
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
        return validateExternalData(table.rows, "position", positionKeys)
    }

    public async getParameters(): Promise<EosdtContractParameters> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "parameters"
        })
        return validateExternalData(
            table.rows[0],
            "positions parameters",
            сontractParametersKeys
        )
    }

    public async getSettings(): Promise<EosdtContractSettings> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "ctrsettings"
        })
        return validateExternalData(
            table.rows[0],
            "positions settings",
            contractSettingsKeys
        )
    }

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
                        account: "eosdtcntract",
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

    public async getAllReferrals(): Promise<Referral[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "ctrreferrals",
            limit: 10_000
        })
        return validateExternalData(table.rows, "referral", referralKeys)
    }

    public async getReferralByName(name: string): Promise<Referral | undefined> {
        const table = await this.getAllReferrals()
        return table.find(row => row.referral === name)
    }

    public async getPositionReferral(
        positionId: number
    ): Promise<PositionReferral | undefined> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "positionrefs",
            table_key: "position_id",
            lower_bound: positionId,
            upper_bound: positionId
        })
        return validateExternalData(
            table.rows,
            "position referral",
            positionReferralKeys,
            true
        )
    }

    public async getPositionReferralsTable(): Promise<PositionReferral[]> {
        let lowerBound = 0
        const limit = 10_000

        async function getTablePart(that: any): Promise<any> {
            const table = await that.rpc.get_table_rows({
                code: that.contractName,
                scope: that.contractName,
                table: "positionrefs",
                lower_bound: lowerBound,
                limit
            })
            return validateExternalData(
                table.rows,
                "position referral",
                positionReferralKeys
            )
        }

        const firstRequest = await getTablePart(this)
        const result: PositionReferral[] = firstRequest
        let more = firstRequest.more

        while (more) {
            lowerBound = result[result.length - 1].position_id + 1
            const moreReferrals = await getTablePart(this)
            result.push(...moreReferrals)
            more = moreReferrals.more
        }

        return result
    }

    public async getAllPositions(): Promise<EosdtPosition[]> {
        let lowerBound = 0
        const limit = 10_000

        async function getTablePart(that: any): Promise<any> {
            const table = await that.rpc.get_table_rows({
                code: that.contractName,
                scope: that.contractName,
                table: "positions",
                lower_bound: lowerBound,
                limit
            })
            return validateExternalData(table.rows, "position", positionKeys)
        }

        const firstRequest = await getTablePart(this)
        const result: EosdtPosition[] = firstRequest
        let more = firstRequest.more

        while (more) {
            lowerBound = result[result.length - 1].position_id + 1
            const morePositions = await getTablePart(this)
            result.push(...morePositions)
            more = morePositions.more
        }

        return result
    }

    public async getAllReferralPositionsIds(referralId: number): Promise<number[]> {
        return (await this.getPositionReferralsTable())
            .filter(refPos => refPos.referral_id === referralId)
            .map(refInfo => refInfo.position_id)
    }

    public async getLatestUserPosition(
        accountName: string
    ): Promise<EosdtPosition | undefined> {
        const userPositions = await this.getAllUserPositions(accountName)

        if (userPositions.length === 0) return

        return userPositions.reduce((a, b) => {
            if (Math.max(a.position_id, b.position_id) === a.position_id) return a
            else return b
        })
    }

    public async getLtvRatiosTable(): Promise<LtvRatios[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "ctrltvratios",
            limit: 10_000
        })
        return validateExternalData(table.rows, "ltv ratio", ltvRatiosKeys)
    }

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
}
