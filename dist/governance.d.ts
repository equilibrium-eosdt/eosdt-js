import BigNumber from "bignumber.js";
import { GovernanceSettings, StoredProposal, EosdtVote, ProposeObject } from "./interfaces/governance";
import { EosdtConnectorInterface } from "./interfaces/connector";
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
    unstake(amount: string | number | BigNumber, voter: string): Promise<any>;
    vote(proposalName: string, vote: number, voter: string, voteJson: string): Promise<any>;
    unvote(proposalName: string, voter: string): Promise<any>;
    getSettings(): Promise<GovernanceSettings>;
    getProposals(): Promise<StoredProposal[]>;
    getVotes(): Promise<EosdtVote[]>;
}
