export interface StoredProposal {
    proposal_name: string // EOS type: name
    proposer: string // EOS type: name
    title: string // EOS type: string
    proposal_json: string // EOS type: string
    created_at: string // EOS type: time_point_sec
    expires_at: string // EOS type: time_point_sec
    proposal_type: number // EOS type: uint8
}
export const storedProposalKeys = [
    "proposal_name",
    "proposer",
    "title",
    "proposal_json",
    "created_at",
    "expires_at",
    "proposal_type"
]

export interface ProposeObject {
    proposer: string
    name: string
    title: string
    json: string
    expiresAt: Date
    type: number
}
export const proposeObjectKeys = ["proposer", "name", "title", "json", "expiresAt", "type"]

export interface EosdtVote {
    id: number // EOS type: uint64
    proposal_name: string // EOS type: name
    updated_at: string // EOS type: time_point_sec
    voter: string // EOS type: name
    vote: number // EOS type: uint8
    vote_json: string // EOS type: string
}
export const eosdtVoteKeys = ["id", "proposal_name", "updated_at", "voter", "vote", "vote_json"]

export interface GovernanceSettings {
    setting_id: number // EOS type: uint64
    position_account: string // EOS type: name
    min_proposal_weight: string // EOS type: asset
    freeze_period: number // EOS type: uint32
    min_participation: string // EOS type: float64
    success_margin: string // EOS type: float64
    top_holders_amount: number // EOS type: uint32
    max_bp_count: number // EOS type: uint32
    max_bp_votes: number // EOS type: uint32
    min_vote_stake: string // EOS type: asset
    unstake_period: number // EOS type: uint32
    reward_weight: number // EOS type: float64
    stake_reward: number // EOS type: float64
}
export const governanceSettingsKeys = [
    "setting_id",
    "position_account",
    "min_proposal_weight",
    "freeze_period",
    "min_participation",
    "success_margin",
    "top_holders_amount",
    "max_bp_count",
    "max_bp_votes",
    "min_vote_stake",
    "unstake_period",
    "reward_weight",
    "stake_reward"
]

export interface GovernanceParameters {
    NUT_voting_balance: string // EOS type: asset
    min_reward: string // EOS type: asset
    param_id: number // EOS type: uint64
}
export const governanceParametersKeys = ["NUT_voting_balance", "param_id", "min_reward"]

export interface BPVotes {
    producer: string // EOS type: name
    votes: string // EOS type: asset
}
export const bpVotesKeys = ["producer", "votes"]

export interface VoterInfo {
    voter: string // EOS type: name
    voting_amount: string // EOS type: asset (NUT)
    withdrawal_date: string // EOS type: time_point_sec
}
export const voterInfoKeys = ["voter", "voting_amount", "withdrawal_date"]

export interface EosVoterInfo {
    owner: string // EOS type: name
    proxy: string // EOS type: name
    producers: string[] // EOS type: name[]
    staked: number // EOS type: int64
    last_vote_weight: string // EOS type: float64
    proxied_vote_weight: string // EOS type: float64
    is_proxy: number // EOS type: bool
    flags1: number // EOS type: uint32
    reserved2: number // EOS type: uint32
    reserved3: string // EOS type: asset
}
export const eosVoterInfoKeys = [
    "owner",
    "proxy",
    "producers",
    "staked",
    "last_vote_weight",
    "proxied_vote_weight",
    "is_proxy",
    "flags1",
    "reserved2",
    "reserved3"
]

export interface BpPosition {
    bp_name: string // EOS type: name
    reward_amount: string // EOS type: asset
    balance: string // EOS type: asset
    enabled: number // EOS type: bool
    is_active: number // EOS type: bool
    active_since: string // EOS type: time_point_sec
}
export const bpPositionKeys = [
    "bp_name",
    "reward_amount",
    "balance",
    "enabled",
    "is_active",
    "active_since"
]
