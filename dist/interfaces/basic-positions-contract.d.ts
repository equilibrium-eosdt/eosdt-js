export interface BasicEosdtPosition {
    position_id: number;
    maker: string;
    outstanding: string;
    collateral: string;
}
export declare const basicPositionKeys: string[];
export interface PosContractSettings {
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
    savings_account: string;
    min_pos: string;
    tokenswap_account: string;
}
export declare const posContractSettingsKeys: string[];
export interface BasicEosdtPosParameters {
    parameter_id: number;
    total_collateral: string;
    total_debt: string;
    stability_rate: string;
    prev_date: string;
}
export declare const basicEosdtPosParametersKeys: string[];
