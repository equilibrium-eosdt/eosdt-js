import { EosdtConnector } from "./connector";
import BigNumber from "bignumber.js";
import { GovernanceSettings, Proposal, Vote } from "./models";
export declare class Governance {
    private contractName;
    private rpc;
    private api;
    constructor(connector: EosdtConnector);
    propose(proposalName: string, title: string, proposalJson: string, expire: string, creatorName: string): Promise<any>;
    expire(proposalName: string, creator: string): Promise<any>;
    applyChanges(proposalName: string, fromAccount: string): Promise<any>;
    cleanProposal(proposalName: string, deletedVotes: number, actor: string): Promise<any>;
    stake(sender: string, amount: string | number | BigNumber): Promise<any>;
    unstake(amount: string | number | BigNumber, voter: string): Promise<any>;
    vote(proposalName: string, vote: number, voter: string): Promise<any>;
    unvote(proposalName: string, voter: string): Promise<any>;
    getSettings(): Promise<GovernanceSettings>;
    getProposals(): Promise<Proposal[]>;
    getVotes(): Promise<Vote[]>;
}
