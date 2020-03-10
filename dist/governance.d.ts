import { EosdtConnectorInterface } from "./interfaces/connector";
import { BPVotes, EosdtVote, EosVoterInfo, GovernanceSettings, ProposeObject, StoredProposal, VoterInfo, GovernanceParameters } from "./interfaces/governance";
import { ITrxParamsArgument } from "./interfaces/transaction";
export declare class GovernanceContract {
    private contractName;
    private rpc;
    private api;
    constructor(connector: EosdtConnectorInterface);
    propose(proposal: ProposeObject, senderName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    expire(proposalName: string, senderName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    applyChanges(proposalName: string, senderName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    cleanProposal(proposalName: string, deletedVotes: number, senderName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    stake(senderName: string, nutAmount: string | number, trxMemo?: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    unstake(nutAmount: string | number, voterName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    vote(proposalName: string, vote: number, voterName: string, voteJson: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    unvote(proposalName: string, voterName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    voteForBlockProducers(voterName: string, producers: string[], transactionParams?: ITrxParamsArgument): Promise<any>;
    stakeAndVoteForBlockProducers(voterName: string, nutAmount: string | number, producers: string[], transactionParams?: ITrxParamsArgument): Promise<any>;
    getVoterInfo(accountName: string): Promise<VoterInfo | undefined>;
    getVoterInfosTable(): Promise<VoterInfo[]>;
    getVotes(): Promise<EosdtVote[]>;
    getVotesForAccount(accountName: string): Promise<EosdtVote[]>;
    getProposals(): Promise<StoredProposal[]>;
    getBpVotes(): Promise<BPVotes[]>;
    getProxyInfo(): Promise<EosVoterInfo | undefined>;
    getSettings(): Promise<GovernanceSettings>;
    getParameters(): Promise<GovernanceParameters>;
}
