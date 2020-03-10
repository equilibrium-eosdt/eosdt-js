export interface EosdtPosition {
    position_id: number;
    maker: string;
    outstanding: string;
    governance: string;
    collateral: string;
}
export interface Referral {
    referral_id: number;
    referral: string;
    staked_amount: string;
}
export interface PositionReferral {
    referral_id: number;
    position_id: number;
}
export interface TokenRate_deprecated {
    rate: string;
    update: string;
    provablecb1a_price: string;
    provablecb1a_update: string;
    eosnationdsp_price: string;
    eosnationdsp_update: string;
    equilibriumdsp_price: string;
    equilibriumdsp_update: string;
}
export interface TokenRate {
    rate: string;
    update: string;
    provablecb1a_price: string;
    provablecb1a_update: string;
    delphioracle_price: string;
    delphioracle_update: string;
    equilibriumdsp_price: string;
    equilibriumdsp_update: string;
    base: string;
}
export interface LtvRatios {
    position_id: number;
    ltv_ratio: string;
}
export interface EosdtContractSettings {
    setting_id: number;
    global_lock: number;
    time_shift: number;
    liquidator_account: string;
    oraclize_account: string;
    sttoken_account: string;
    nutoken_account: string;
    governance_fee: string;
    stability_fee: string;
    critical_ltv: string;
    liquidation_penalty: string;
    liquidator_discount: string;
    liquidation_price: string;
    nut_auct_ratio: string;
    nut_discount: string;
    profit_factor: string;
    vote_period: number;
    stake_period: number;
    reserve_ratio: string;
    staking_weight: string;
    bpproxy_account: string;
    governc_account: string;
    referral_min_stake: string;
    referral_ratio: string;
    collateral_account: string;
    collateral_token: string;
}
export interface EosdtContractParameters {
    parameter_id: number;
    total_collateral: string;
    total_debt: string;
    stability_rate: string;
    governance_rate: string;
    prev_date: string;
    prev_vote: string;
    prev_stake: string;
    eos_staked: string;
}
