import { Api, JsonRpc } from "eosjs"
import { EosdtConnectorInterface } from "./interfaces/connector"
import {
    BPVotes,
    bpVotesKeys,
    EosdtVote,
    eosdtVoteKeys,
    EosVoterInfo,
    eosVoterInfoKeys,
    GovernanceParameters,
    governanceParametersKeys,
    GovernanceSettings,
    governanceSettingsKeys,
    ProposeObject,
    StoredProposal,
    storedProposalKeys,
    VoterInfo,
    voterInfoKeys
} from "./interfaces/governance"
import { ITrxParamsArgument } from "./interfaces/transaction"
import {
    amountToAssetString,
    dateToEosDate,
    setTransactionParams,
    validateExternalData
} from "./utils"

/**
 * A class to work with EOSDT Governance contract (`eosdtgovernc`)
 */
export class GovernanceContract {
    private contractName: string
    private rpc: JsonRpc
    private api: Api

    /**
     * Creates an instance of `GovernanceContract`
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector: EosdtConnectorInterface) {
        this.rpc = connector.rpc
        this.api = connector.api
        this.contractName = "eosdtgovernc"
    }

    /**
     * Creates a proposal
     * @param {object} proposal
     * @param {string} proposal.proposer
     * @param {string} proposal.name
     * @param {string} proposal.title
     * @param {string} proposal.json
     * @param {Date} proposal.expiresAt
     * @param {number} proposal.type
     * @param {string} senderName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async propose(
        proposal: ProposeObject,
        senderName: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "propose",
                        authorization,
                        data: {
                            proposer: proposal.proposer,
                            proposal_name: proposal.name,
                            title: proposal.title,
                            proposal_json: proposal.json,
                            expires_at: dateToEosDate(proposal.expiresAt),
                            proposal_type: proposal.type
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
     * Expires an active proposal
     * @param {string} proposalName
     * @param {string} senderName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async expire(
        proposalName: string,
        senderName: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "expire",
                        authorization,
                        data: { proposal_name: proposalName }
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
     * Applies proposed changes. At least 51% of all issued NUT tokens must vote, at least 55%
     * of votes must be for proposal
     * @param {string} proposalName
     * @param {string} senderName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async applyChanges(
        proposalName: string,
        senderName: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "apply",
                        authorization,
                        data: { proposal_name: proposalName }
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
     * Removes specified amount of votes from an expired proposal. If 0 votes left, removes proposal
     * @param {string} proposalName
     * @param {number} deletedVotes
     * @param {string} senderName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async cleanProposal(
        proposalName: string,
        deletedVotes: number,
        senderName: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: senderName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "clnproposal",
                        authorization,
                        data: {
                            proposal_name: proposalName,
                            max_count: deletedVotes
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
     * Sends NUT tokens to contract, staking them and allowing to vote for block producers and for
     * proposals
     * @param {string} senderName
     * @param {string | number} nutsAmount
     * @param {string} [trxMemo]
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async stake(
        senderName: string,
        nutsAmount: string | number,
        trxMemo?: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const nutAssetString = amountToAssetString(nutsAmount, "NUT")
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
                            memo: trxMemo ? trxMemo : "eosdt-js stake()"
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
     * Unstakes NUT tokens to user's balance
     * @param {string | number} nutAmount
     * @param {string} voterName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async unstake(
        nutAmount: string | number,
        voterName: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const nutAssetString = amountToAssetString(nutAmount, "NUT")
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: voterName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "unstake",
                        authorization,
                        data: {
                            voter: voterName,
                            quantity: nutAssetString
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
     * Vote for or against a proposal
     * @param {string} proposalName
     * @param {number} vote Vote `1` as "yes", `0` or any other number as "no"
     * @param {string} voterName
     * @param {string} voteJson
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async vote(
        proposalName: string,
        vote: number,
        voterName: string,
        voteJson: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: voterName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "vote",
                        authorization,
                        data: {
                            voter: voterName,
                            proposal_name: proposalName,
                            vote,
                            vote_json: voteJson
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
     * Removes all user votes from a proposal
     * @param {string} proposalName
     * @param {string} voterName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async unvote(
        proposalName: string,
        voterName: string,
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: voterName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "unvote",
                        authorization,
                        data: {
                            voter: voterName,
                            proposal_name: proposalName
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
     * Votes with staked NUTs for block producers
     * @param {string} voterName
     * @param {string[]} producers
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async voteForBlockProducers(
        voterName: string,
        producers: string[],
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const vote_json = JSON.stringify({ "eosdtbpproxy.producers": producers })
        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: voterName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "vote",
                        authorization,
                        data: {
                            voter: voterName,
                            proposal_name: "blockproduce",
                            vote: 1,
                            vote_json
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
     * Stakes NUTs and votes for BPs in one transaction
     * @param {string} voterName
     * @param {string | number} nutAmount
     * @param {string[]} producers
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    public async stakeAndVoteForBlockProducers(
        voterName: string,
        nutAmount: string | number,
        producers: string[],
        transactionParams?: ITrxParamsArgument
    ): Promise<any> {
        const nutAssetString = amountToAssetString(nutAmount, "NUT")
        const voter = voterName
        const vote_json = JSON.stringify({ "eosdtbpproxy.producers": producers })

        const trxParams = setTransactionParams(transactionParams)
        const authorization = [{ actor: voterName, permission: trxParams.permission }]

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: "eosdtnutoken",
                        name: "transfer",
                        authorization,
                        data: {
                            from: voterName,
                            to: this.contractName,
                            quantity: nutAssetString,
                            memo: ""
                        }
                    },
                    {
                        account: this.contractName,
                        name: "vote",
                        authorization,
                        data: {
                            voter,
                            proposal_name: "blockproduce",
                            vote: 1,
                            vote_json
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
     * @returns {Promise<object | undefined>} Amount of NUTs staked by account in Governance
     * contract and their unstake date
     */
    public async getVoterInfo(accountName: string): Promise<VoterInfo | undefined> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            table: "govvoters",
            scope: this.contractName,
            lower_bound: accountName,
            upper_bound: accountName
        })
        return validateExternalData(table.rows[0], "voter info", voterInfoKeys, true)
    }

    /**
     * @returns {Promise<object[]>} Table of information on accounts that staked NUT
     */
    public async getVoterInfosTable(): Promise<VoterInfo[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            table: "govvoters",
            scope: this.contractName,
            limit: 100_000
        })
        return validateExternalData(table.rows, "voter info", voterInfoKeys)
    }

    /**
     * @returns {Promise<object[]>} An array with all Governance contract votes (up to 10000)
     */
    public async getVotes(): Promise<EosdtVote[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "votes",
            limit: 10_000
        })
        return validateExternalData(table.rows, "eosdt vote", eosdtVoteKeys)
    }

    /**
     * @returns {Promise<object[]>} All account votes
     */
    public async getVotesForAccount(accountName: string): Promise<EosdtVote[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "votes",
            limit: 1000
        })
        return validateExternalData(table.rows, "eosdt vote", eosdtVoteKeys).filter(
            (vote: EosdtVote) => vote.voter === accountName
        )
    }

    /**
     * @returns {Promise<object[]>} An array with all Governance contract proposals (up to 10000)
     */
    public async getProposals(): Promise<StoredProposal[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "proposals",
            limit: 10_000
        })
        return validateExternalData(table.rows, "stored proposal", storedProposalKeys)
    }

    /**
     * @returns {Promise<object[]>} Array of objects, containing block producers names and
     * amount of NUT votes for them
     */
    public async getBpVotes(): Promise<BPVotes[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "bpvotes",
            limit: 1000
        })
        return validateExternalData(table.rows, "bp votes", bpVotesKeys)
    }

    /**
     * @returns {Promise<object | undefined>} Voter info for `eosdtbpproxy`
     */
    public async getProxyInfo(): Promise<EosVoterInfo | undefined> {
        const table = await this.rpc.get_table_rows({
            code: "eosio",
            scope: "eosio",
            table: "voters",
            lower_bound: "eosdtbpproxy",
            upper_bound: "eosdtbpproxy"
        })
        return validateExternalData(table.rows[0], "eos voter info", eosVoterInfoKeys, true)
    }

    /**
     * @returns {Promise<object>} Governance contract settings
     */
    public async getSettings(): Promise<GovernanceSettings> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "govsettings"
        })
        return validateExternalData(table.rows[0], "governance settings", governanceSettingsKeys)
    }

    /**
     * @returns {Promise<object>} Governance contract parameters
     */
    public async getParameters(): Promise<GovernanceParameters> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "govparams"
        })
        return validateExternalData(
            table.rows[0],
            "governance parameters",
            governanceParametersKeys
        )
    }
}
