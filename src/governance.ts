import { Api, JsonRpc } from "eosjs"
import { EosdtConnectorInterface } from "./interfaces/connector"
import {
    BPVotes,
    EosdtVote,
    EosVoterInfo,
    GovernanceSettings,
    ProposeObject,
    StoredProposal,
    VoterInfo
} from "./interfaces/governance"
import { ITrxParamsArgument } from "./interfaces/transaction"
import { amountToAssetString, dateToEosDate, setTransactionParams } from "./utils"

export class GovernanceContract {
    private contractName: string
    private rpc: JsonRpc
    private api: Api

    constructor(connector: EosdtConnectorInterface) {
        this.rpc = connector.rpc
        this.api = connector.api
        this.contractName = "eosdtgovernc"
    }

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

    public async stake(
        senderName: string,
        nutAmount: string | number,
        trxMemo?: string,
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

    public async voteForBlockProducers(
        voterName: string,
        transactionParams?: ITrxParamsArgument,
        ...producers: string[]
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

    public async getVoterInfo(accountName: string): Promise<VoterInfo | undefined> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            table: "voters",
            scope: accountName
        })
        return table.rows[0]
    }

    public async getVotes(): Promise<EosdtVote[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "votes",
            limit: 1000
        })
        return table.rows
    }

    public async getProposals(): Promise<StoredProposal[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "proposals",
            limit: 1000
        })
        return table.rows
    }

    public async getBpVotes(): Promise<BPVotes[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "bpvotes",
            limit: 1000
        })
        return table.rows
    }

    public async getProxyInfo(): Promise<EosVoterInfo | undefined> {
        const table = await this.rpc.get_table_rows({
            code: "eosio",
            scope: "eosio",
            table: "voters",
            lower_bound: "eosdtbpproxy",
            upper_bound: "eosdtbpproxy"
        })
        return table.rows[0]
    }

    public async getSettings(): Promise<GovernanceSettings> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "govsettings"
        })
        return table.rows[0]
    }
}
