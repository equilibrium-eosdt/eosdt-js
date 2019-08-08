import BigNumber from "bignumber.js"
import { JsonRpc, Api } from "eosjs"
import { EosdtConnectorInterface } from "./interfaces/connector"
import { toEosDate, toBigNumber } from "./utils"
import {
    GovernanceSettings,
    StoredProposal,
    EosdtVote,
    ProposeObject,
    BPVotes,
    VoterInfo
} from "./interfaces/governance"

export class GovernanceContract {
    private contractName: string
    private rpc: JsonRpc
    private api: Api

    constructor(connector: EosdtConnectorInterface) {
        this.rpc = connector.rpc
        this.api = connector.api
        this.contractName = "eosdtgovernc"
    }

    public async propose(proposal: ProposeObject, sender?: string): Promise<any> {
        if (!sender) sender = proposal.proposer

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "propose",
                        authorization: [{ actor: sender, permission: "active" }],
                        data: {
                            proposer: proposal.proposer,
                            proposal_name: proposal.name,
                            title: proposal.title,
                            proposal_json: proposal.json,
                            expires_at: toEosDate(proposal.expiresAt),
                            proposal_type: proposal.type
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async expire(proposalName: string, creator: string): Promise<any> {
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "expire",
                        authorization: [{ actor: creator, permission: "active" }],
                        data: {
                            proposal_name: proposalName
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async applyChanges(proposalName: string, fromAccount: string): Promise<any> {
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "apply",
                        authorization: [{ actor: fromAccount, permission: "active" }],
                        data: {
                            proposal_name: proposalName
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async cleanProposal(
        proposalName: string,
        deletedVotes: number,
        actor: string
    ): Promise<any> {
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "clnproposal",
                        authorization: [{ actor, permission: "active" }],
                        data: {
                            proposal_name: proposalName,
                            max_count: deletedVotes
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async stake(
        sender: string,
        amount: string | number | BigNumber
    ): Promise<any> {
        amount = toBigNumber(amount)

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: "eosdtnutoken",
                        name: "transfer",
                        authorization: [{ actor: sender, permission: "active" }],
                        data: {
                            from: sender,
                            to: this.contractName,
                            quantity: `${amount.toFixed(9)} NUT`,
                            memo: ""
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async getVoterInfo(accountName: string): Promise<VoterInfo | undefined> {
        const result = await this.rpc.get_table_rows({
            code: this.contractName,
            table: "voters",
            scope: accountName
        })
        return result.rows[0]
    }

    public async unstake(
        amount: string | number | BigNumber,
        voter: string
    ): Promise<any> {
        amount = toBigNumber(amount)

        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "unstake",
                        authorization: [{ actor: voter, permission: "active" }],
                        data: {
                            voter,
                            quantity: `${amount.toFixed(9)} NUT`
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async vote(
        proposalName: string,
        vote: number,
        voter: string,
        voteJson: string
    ): Promise<any> {
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "vote",
                        authorization: [{ actor: voter, permission: "active" }],
                        data: {
                            voter,
                            proposal_name: proposalName,
                            vote,
                            vote_json: voteJson
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async voteForBlockProducers(
        voter: string,
        ...producers: string[]
    ): Promise<any> {
        const vote_json = JSON.stringify({ "eosdtbpproxy.producers": producers })
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "vote",
                        authorization: [{ actor: voter, permission: "active" }],
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
                blocksBehind: 3,
                expireSeconds: 60
            }
        )
        return receipt
    }

    public async unvote(proposalName: string, voter: string): Promise<any> {
        const receipt = await this.api.transact(
            {
                actions: [
                    {
                        account: this.contractName,
                        name: "unvote",
                        authorization: [{ actor: voter, permission: "active" }],
                        data: {
                            voter,
                            proposal_name: proposalName
                        }
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 60
            }
        )

        return receipt
    }

    public async getSettings(): Promise<GovernanceSettings> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "govsettings",
            json: true,
            limit: 1
        })
        return table.rows[0]
    }

    public async getProposals(): Promise<StoredProposal[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "proposals",
            json: true,
            limit: 1000
        })
        return table.rows
    }

    public async getVotes(): Promise<EosdtVote[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "votes",
            json: true,
            limit: 1000
        })
        return table.rows
    }

    public async getBpVotes(): Promise<BPVotes[]> {
        const table = await this.rpc.get_table_rows({
            code: this.contractName,
            scope: this.contractName,
            table: "bpvotes"
        })
        return table.rows
    }
}
