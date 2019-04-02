export interface EosdtContractSettings {
    id: number;
    global_lock: number;
    time_shift: number;
    liquidator_account: string;
    oraclize_account: string;
    sttoken_account: string;
    nutoken_account: string;
    governance_account: string;
    governance_fee: string;
    stability_fee: string;
    critical_ltv: string;
    liquidation_penalty: string;
    liquidator_discount: string;
    liquidation_price: string;
    nut_auct_ratio: string;
    nut_discount: string;
}
export interface EosdtContractParameters {
    parameter_id: number;
    total_collateral: string;
    total_debt: string;
    stability_rate: string;
    governance_rate: string;
    prev_date: string;
}
export interface Position {
    position_id: number;
    maker: string;
    outstanding: string;
    governance: string;
    collateral: string;
}
export interface Rate {
    rate: string;
    last_update: string;
    master_update: string;
    slave_update: string;
    onerror_update: string;
}
export interface GovernanceSettings {
    id: number;
    time_shift: number;
    eosdtcntract_account: string;
    liquidator_account: string;
    oraclize_account: string;
    nutoken_account: string;
    min_proposal_weight: string;
    freeze_period: number;
    min_participation: string;
    success_margin: string;
    top_holders_amount: number;
}
export interface Proposal {
    proposal_name: string;
    proposer: string;
    title: string;
    proposal_json: string;
    created_at: string;
    expires_at: string;
}
export interface Vote {
    id: number;
    proposal_name: string;
    voter: string;
    vote: number;
    updated_at: string;
    quantity: string;
}
export interface LiquidatorParameters {
    parameter_id: number;
    surplus_debt: string;
    bad_debt: string;
    eos_balance: string;
    nut_collat_balance: string;
}
