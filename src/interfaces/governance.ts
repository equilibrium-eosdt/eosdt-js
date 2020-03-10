export interface StoredProposal {
    proposal_name: string // EOS type: name
    proposer: string // EOS type: name
    title: string // EOS type: string
    proposal_json: string // EOS type: string
    created_at: string // EOS type: time_point_sec
    expires_at: string // EOS type: time_point_sec
    proposal_type: number // EOS type: uint8
}

export interface ProposeObject {
    proposer: string
    name: string
    title: string
    json: string
    expiresAt: Date
    type: number
}

export interface EosdtVote {
    id: number // EOS type: uint64
    proposal_name: string // EOS type: name
    updated_at: string // EOS type: time_point_sec
    voter: string // EOS type: name
    vote: number // EOS type: uint8
    vote_json: string // EOS type: string
}

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
    bpproxy_account: string // EOS type: name
    governc_account: string // EOS type: name
    min_reward: string // EOS type: asset
    reward_weight: number // EOS type: float64
}

export interface GovernanceParameters {
    NUT_voting_balance: number // EOS type: uint64
}

export interface BPVotes {
    producer: string // EOS type: name
    votes: string // EOS type: asset
}

export interface VoterInfo {
    voter: string // EOS type: name
    voting_amount: string // EOS type: asset (NUT)
    withdrawal_date: string // EOS type: time_point_sec
}

export interface EosVoterInfo {
    owner: string // EOS type: name
    proxy: string // EOS type: name
    producers: string[]  // EOS type: name[]
    staked: number // EOS type: int64
    last_vote_weight: string // EOS type: float64
    proxied_vote_weight: string // EOS type: float64
    is_proxy: number // EOS type: bool
    flags1: number // EOS type: uint32
    reserved2: number // EOS type: uint32
    reserved3: string // EOS type: asset
}

export interface BpPosition {
    bp_name: string // EOS type: name
    reward_amount: string // EOS type: asset
    balance: string // EOS type: asset
    enabled: number // EOS type: bool
    is_active: number // EOS type: bool
    active_since: string // EOS type: time_point_sec
}
