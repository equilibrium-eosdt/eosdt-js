import { Api, JsonRpc } from "eosjs"
import { EosdtConnectorInterface } from "./interfaces/connector"
import { BpPosition, bpPositionKeys } from "./interfaces/governance"
import { ITrxParamsArgument } from "./interfaces/transaction"
import { amountToAssetString, setTransactionParams, validateExternalData } from "./utils"

/**
 * Class for EOSDT Governance actions, related to block producers management
 */
export class BpManager {
    private contractName: string
    private rpc: JsonRpc
    private api: Api

    /**
     * Creates instance of `BpManager`
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector: EosdtConnectorInterface) {
        this.rpc = connector.rpc
        this.api = connector.api
        this.contractName = "eosdtgovernc"
    }

    /**
     * @returns {Promise<object[]>} An array of objects, that contain information about
     * registered block producers
     */
    public async getAllBpPositions(): Promise<BpPosition[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "govbpparams",
            limit: 10_000
        })
        return validateExternalData(table.rows, "bp position", bpPositionKeys)
    }

    /**
     * @returns {Promise<object | undefined>} Object with information about a registered block
     * producer
     */
    public async getBpPosition(bpName: string): Promise<BpPosition | undefined> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "govbpparams",
            upper_bound: bpName,
            lower_bound: bpName
        })
        return validateExternalData(table.rows[0], "bp position", bpPositionKeys, true)
    }

    /**
     * Registers a block producer in BP voting reward program
     * @param {string} bpName Account name
     * @param {number} rewardAmount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async registerBlockProducer(
        bpName: string,
        rewardAmount: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "bpregister",
                        authorization: [{ actor: bpName, permission: trxParams.permission }],
                        data: {
                            bp_name: bpName,
                            reward_amount: amountToAssetString(rewardAmount, "EOS")
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
     * Changes amount of EOS reward payed by block producer
     * @param {string} bpName Account name
     * @param {number} rewardAmount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async changeBlockProducerReward(
        bpName: string,
        rewardAmount: number,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "bpsetparams",
                        authorization: [{ actor: bpName, permission: trxParams.permission }],
                        data: {
                            bp_name: bpName,
                            reward_amount: amountToAssetString(rewardAmount, "EOS")
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
     * Deactivates block producer
     * @param {string} bpName Account name
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async unregisterBlockProducer(
        bpName: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "bpunregister",
                        authorization: [{ actor: bpName, permission: trxParams.permission }],
                        data: {
                            bp_name: bpName
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
     * Deposit EOS into block producer Governance account to pay reward. Any account can deposit
     * EOS for a block producer
     * @param {string} fromAccount Paying account name
     * @param {string} bpName
     * @param {number | string} eosAmount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async depositEos(
        fromAccount: string,
        bpName: string,
        eosAmount: number | string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: "eosio.token",
                        name: "transfer",
                        authorization: [{ actor: fromAccount, permission: trxParams.permission }],
                        data: {
                            from: fromAccount,
                            to: this.contractName,
                            quantity: amountToAssetString(eosAmount, "EOS"),
                            memo: `bp_deposit:${bpName}`
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
}
