export interface StoredProposal {
    proposal_name: string
    proposer: string
    title: string
    proposal_json: string
    created_at: string
    expires_at: string
    proposal_type: number
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
    id: number
    proposal_name: string
    updated_at: string
    voter: string
    vote: number
    vote_json: string
}

export interface GovernanceSettings {
    setting_id: number // EOS type: uint64
    eosdtcntract_account: string // EOS type: name
    min_proposal_weight: string // EOS type: asset
    freeze_period: number // EOS type: uint32
    min_participation: string // EOS type: float64
    success_margin: string // EOS type: float64
    top_holders_amount: number // EOS type: uint32
    max_bp_count: number // EOS type: uint32
    max_bp_votes: number // EOS type: uint32
    min_vote_stake: string // EOS type: asset
    unstake_period: number // EOS type: uint32
    bpproxy_account: string
    governc_account: string
    min_reward: string
    reward_weight: number
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
    owner: string
    proxy: string
    producers: string[]
    staked: number
    last_vote_weight: string
    proxied_vote_weight: string
    is_proxy: number
    flags1: number
    reserved2: number
    reserved3: string
}

export interface BpPosition {
    bp_name: string
    reward_amount: string
    balance: string
    enabled: number //  0 or 1
    is_active: number //  0 or 1
    active_since: string
}
