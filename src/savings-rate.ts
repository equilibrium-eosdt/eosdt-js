import { Api, JsonRpc } from "eosjs"
import { EosdtConnectorInterface } from "./interfaces/connector"
import {
    SRContractParams,
    srContractParamsKeys,
    SRContractSettings,
    srContractSettingsKeys,
    SRPosition,
    srPositionKeys
} from "./interfaces/savings-rate"
import { ITrxParamsArgument } from "./interfaces/transaction"
import { amountToAssetString, setTransactionParams, validateExternalData } from "./utils"

/**
 * A wrapper class to invoke actions of Equilibrium Savings Rate contract
 */
export class SavingsRateContract {
    private name = "eosdtsavings"
    private rpc: JsonRpc
    private api: Api

    /**
     * A wrapper class to invoke actions of Equilibrium Savings Rate contract
     */
    constructor(connector: EosdtConnectorInterface) {
        this.rpc = connector.rpc
        this.api = connector.api
    }

    /**
     * Transfers EOSDT from user to Savings Rate contract
     */
    public async stake(
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
                            to: this.name,
                            quantity: eosdtAssetString,
                            memo: trxMemo ? trxMemo : "eosdt-js SR transfer()"
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
     * Returns EOSDT from Savings Rate contract to account balance
     */
    public async unstake(
        toAccount: string,
        eosdtAmount: string | number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const eosdtAssetString = amountToAssetString(eosdtAmount, "EOSDT")
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: toAccount, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.name,
                        name: "unstake",
                        authorization,
                        data: {
                            to: toAccount,
                            quantity: eosdtAssetString
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
     * @returns An array of all positions on Savings Rate contract
     */
    public async getAllPositions(): Promise<SRPosition[]> {
        let lowerBound = 0
        const limit = 10_000

        const getTablePart = async (): Promise<any> => {
            const table = await this.rpc.get_table_rows({
                code: this.name,
                scope: this.name,
                table: "savpositions",
                lower_bound: lowerBound,
                limit
            })
            return table
        }

        const firstRequest = await getTablePart()
        const result: SRPosition[] = [...firstRequest.rows]
        let more = firstRequest.more

        while (more) {
            lowerBound = result[result.length - 1].position_id + 1
            const morePositions = await getTablePart()
            result.push(...morePositions.rows)
            more = morePositions.more
        }

        return validateExternalData(result, "SR position", srPositionKeys)
    }

    /**
     * @returns A Savings Rate position object with given id
     */
    public async getPositionById(id: number): Promise<SRPosition | undefined> {
        const table = await this.rpc.get_table_rows({
            code: this.name,
            scope: this.name,
            table: "savpositions",
            table_key: "position_id",
            lower_bound: id,
            upper_bound: id
        })
        return validateExternalData(table.rows[0], "SR position", srPositionKeys)
    }

    /**
     * @returns Array of all positions objects, created by the maker
     */
    public async getUserPositions(maker: string): Promise<SRPosition[]> {
        const table = await this.rpc.get_table_rows({
            code: this.name,
            scope: this.name,
            table: "savpositions",
            limit: 10_000,
            table_key: "owner",
            index_position: "secondary",
            key_type: "name",
            lower_bound: maker,
            upper_bound: maker
        })
        return validateExternalData(table.rows, "SR position", srPositionKeys)
    }

    /**
     * @returns Positions contract parameters
     */
    public async getParameters(): Promise<SRContractParams> {
        const table = await this.rpc.get_table_rows({
            code: this.name,
            scope: this.name,
            table: "savparams"
        })
        return validateExternalData(
            table.rows[0],
            "SR contract parameters",
            srContractParamsKeys
        )
    }

    /**
     * @returns Positions contract settings
     */
    public async getSettings(): Promise<SRContractSettings> {
        const table = await this.rpc.get_table_rows({
            code: this.name,
            scope: this.name,
            table: "savsettings"
        })
        return validateExternalData(
            table.rows[0],
            "SR contract settings",
            srContractSettingsKeys
        )
    }
}
