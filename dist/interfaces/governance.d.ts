export interface StoredProposal {
    proposal_name: string;
    proposer: string;
    title: string;
    proposal_json: string;
    created_at: string;
    expires_at: string;
    proposal_type: number;
}
export declare const storedProposalKeys: string[];
export interface ProposeObject {
    proposer: string;
    name: string;
    title: string;
    json: string;
    expiresAt: Date;
    type: number;
}
export declare const proposeObjectKeys: string[];
export interface EosdtVote {
    id: number;
    proposal_name: string;
    updated_at: string;
    voter: string;
    vote: number;
    vote_json: string;
}
export declare const eosdtVoteKeys: string[];
export interface GovernanceSettings {
    setting_id: number;
    position_account: string;
    min_proposal_weight: string;
    freeze_period: number;
    min_participation: string;
    success_margin: string;
    top_holders_amount: number;
    max_bp_count: number;
    max_bp_votes: number;
    min_vote_stake: string;
    unstake_period: number;
    reward_weight: number;
    stake_reward: number;
}
export declare const governanceSettingsKeys: string[];
export interface GovernanceParameters {
    NUT_voting_balance: string;
    min_reward: string;
    param_id: number;
}
export declare const governanceParametersKeys: string[];
export interface BPVotes {
    producer: string;
    votes: string;
}
export declare const bpVotesKeys: string[];
export interface VoterInfo {
    voter: string;
    voting_amount: string;
    withdrawal_date: string;
}
export declare const voterInfoKeys: string[];
export interface EosVoterInfo {
    owner: string;
    proxy: string;
    producers: string[];
    staked: number;
    last_vote_weight: string;
    proxied_vote_weight: string;
    is_proxy: number;
    flags1: number;
    reserved2: number;
    reserved3: string;
}
export declare const eosVoterInfoKeys: string[];
export interface BpPosition {
    bp_name: string;
    reward_amount: string;
    balance: string;
    enabled: number;
    is_active: number;
    active_since: string;
}
export declare const bpPositionKeys: string[];
