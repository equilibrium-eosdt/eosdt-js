import BigNumber from "bignumber.js";
import { EosdtConnectorInterface } from "./interfaces/connector";
import { GovernanceSettings, StoredProposal, EosdtVote, ProposeObject, BPVotes, VoterInfo } from "./interfaces/governance";
export declare class GovernanceContract {
    private contractName;
    private rpc;
    private api;
    constructor(connector: EosdtConnectorInterface);
    propose(proposal: ProposeObject, sender?: string): Promise<any>;
    expire(proposalName: string, creator: string): Promise<any>;
    applyChanges(proposalName: string, fromAccount: string): Promise<any>;
    cleanProposal(proposalName: string, deletedVotes: number, actor: string): Promise<any>;
    stake(sender: string, amount: string | number | BigNumber): Promise<any>;
    stakeAndVote(sender: string, amount: string | number | BigNumber, producers: string[]): Promise<any>;
    getVoterInfo(accountName: string): Promise<VoterInfo | undefined>;
    unstake(amount: string | number | BigNumber, voter: string): Promise<any>;
    vote(proposalName: string, vote: number, voter: string, voteJson: string): Promise<any>;
    voteForBlockProducers(voter: string, ...producers: string[]): Promise<any>;
    unvote(proposalName: string, voter: string): Promise<any>;
    getSettings(): Promise<GovernanceSettings>;
    getProposals(): Promise<StoredProposal[]>;
    getVotes(): Promise<EosdtVote[]>;
    getBpVotes(): Promise<BPVotes[]>;
}
