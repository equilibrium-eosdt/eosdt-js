import { Api, JsonRpc } from "eosjs"
import { ArmContractSettings, armContractSettings } from "./interfaces/armeq"
import { EosdtConnectorInterface } from "./interfaces/connector"
import { ITrxParamsArgument } from "./interfaces/transaction"
import { amountToAssetString, setTransactionParams, validateExternalData } from "./utils"

/**
 * Module to manage EOSDT arming operations
 */
export class ArmContract {
    private rpc: JsonRpc
    private api: Api
    private contractName: string

    constructor(connector: EosdtConnectorInterface) {
        this.rpc = connector.rpc
        this.api = connector.api
        this.contractName = `arm.eq`
    }

    /**
     * Creates EOSDT position with given EOS, then sells received EOSDT to buy more EOS and add it
     * to position. Contract would continue for 20 iterations or until given arm is reached
     * @param {string} accountName - name of account that sends EOS and receives position
     * @param {number | string} amount - transferred amount of EOS
     * @param {number} arm - arm value. With arm = 2.1 and 100 EOS user will receive position with 210 EOS
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async armEos(
        accountName: string,
        amount: number | string,
        arm: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const memoObj = {
            arm,
            backend: `newdex`
        }

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: `eosio.token`,
                        name: `transfer`,
                        authorization: [{ actor: accountName, permission: trxParams.permission }],
                        data: {
                            from: accountName,
                            to: this.contractName,
                            quantity: amountToAssetString(amount, `EOS`),
                            memo: JSON.stringify(memoObj)
                        }
                    }
                ]
            },
            {
                expireSeconds: trxParams.expireSeconds,
                blocksBehind: trxParams.blocksBehind
            }
        )

        return receipt
    }

    /**
     * Gives EOS-EOSDT position to 'arm.eq' contract and it arms that position (see `armEos`)
     * @param {string} owner - name of position maker account
     * @param {number} positionId
     * @param {number} arm - arm value. With arm = 2.1 and 100 EOS user will receive position with 210 EOS
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async armExistingEosPosition(
        owner: string,
        positionId: number,
        arm: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: `eosdtcntract`,
                        name: `positiongive`,
                        authorization: [{ actor: owner, permission: trxParams.permission }],
                        data: {
                            position_id: positionId,
                            to: this.contractName
                        }
                    },
                    {
                        account: this.contractName,
                        name: `armexisting`,
                        authorization: [{ actor: owner, permission: trxParams.permission }],
                        data: {
                            arm,
                            position_id: positionId,
                            user_acc: owner,
                            backend: `newdex`
                        }
                    }
                ]
            },
            {
                expireSeconds: trxParams.expireSeconds,
                blocksBehind: trxParams.blocksBehind
            }
        )

        return receipt
    }

    /**
     * Reduces debt on position, selling it's collateral. Will stop, when position has LTV,
     * equal to critical LTV + arm safety margin. Excess EOSDT would be returned to maker acc
     * balance
     * @param {string} owner - name of maker account
     * @param {number} positionId
     * @param {number} debtTarget - approximate desired debt amount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async dearmEosPosition(
        owner: string,
        positionId: number,
        debtTarget: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: `eosdtcntract`,
                        name: `positiongive`,
                        authorization: [{ actor: owner, permission: trxParams.permission }],
                        data: {
                            position_id: positionId,
                            to: this.contractName
                        }
                    },
                    {
                        account: this.contractName,
                        name: `dearm`,
                        authorization: [{ actor: owner, permission: trxParams.permission }],
                        data: {
                            debt_target: amountToAssetString(debtTarget, `EOSDT`),
                            position_id: positionId,
                            user_acc: owner,
                            backend: `newdex`
                        }
                    }
                ]
            },
            {
                expireSeconds: trxParams.expireSeconds,
                blocksBehind: trxParams.blocksBehind
            }
        )

        return receipt
    }

    /**
     * @returns {Promise<object>} Positions contract settings
     */
    public async getSettings(): Promise<ArmContractSettings> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: `rmssettings`
        })
        return validateExternalData(table.rows[0], `arms.eq contract settings`, armContractSettings)
    }
}
