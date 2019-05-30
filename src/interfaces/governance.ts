export interface StoredProposal {
  proposal_name: string,
  proposer: string,
  title: string,
  proposal_json: string,
  created_at: string,
  expires_at: string
  proposal_type: number
}

export interface ProposeObject {
  proposer: string,
  name: string,
  title: string,
  json: string,
  expiresAt: Date,
  type: number,
}

export interface EosdtVote {
  id: number,
  proposal_name: string,
  voter: string,
  vote: number,
  updated_at: string,
  quantity: string
}

export interface GovernanceSettings {
  setting_id: number,
  time_shift: number,
  eosdtcntract_account: string,
  liquidator_account: string,
  oraclize_account: string,
  nutoken_account: string,
  min_proposal_weight: string,
  freeze_period: number,
  min_participation: string,
  success_margin: string,
  top_holders_amount: number
  min_threshold: string
}
