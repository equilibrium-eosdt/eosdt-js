export interface EosdtPosition {
    position_id: number // EOS type: uint64
    maker: string // EOS type: name
    outstanding: string // EOS type: asset
    governance: string // EOS type: asset
    collateral: string // EOS type: float64
}

export interface Referral {
    referral_id: number // EOS type: uint64
    referral: string // EOS type: name
    staked_amount: string // EOS type: asset
}

export interface PositionReferral {
    referral_id: number // EOS type: uint64
    position_id: number // EOS type: uint64
}

export interface TokenRate_deprecated {
    rate: string // EOS type: asset
    update: string // EOS type: time_point_sec
    provablecb1a_price: string // EOS type: asset
    provablecb1a_update: string // EOS type: time_point_sec
    eosnationdsp_price: string // EOS type: asset
    eosnationdsp_update: string // EOS type: time_point_sec
    equilibriumdsp_price: string // EOS type: asset
    equilibriumdsp_update: string // EOS type: time_point_sec
}

export interface TokenRate {
    rate: string // EOS type: asset
    update: string // EOS type: time_point_sec
    provablecb1a_price: string // EOS type: asset
    provablecb1a_update: string // EOS type: time_point_sec
    delphioracle_price: string // EOS type: asset
    delphioracle_update: string // EOS type: time_point_sec
    equilibriumdsp_price: string // EOS type: asset
    equilibriumdsp_update: string // EOS type: time_point_sec
    base: string // EOS type: symbol
}

export interface LtvRatios {
    position_id: number // EOS type: uint64
    ltv_ratio: string // EOS type: float64
}

export interface EosdtContractSettings {
    setting_id: number // EOS type: uint64
    global_lock: number // EOS type: uint8
    time_shift: number // EOS type: uint64

    liquidator_account: string // EOS type: name
    oraclize_account: string // EOS type: name
    sttoken_account: string // EOS type: name
    nutoken_account: string // EOS type: name

    governance_fee: string // EOS type: float64
    stability_fee: string // EOS type: float64
    critical_ltv: string // EOS type: float64
    liquidation_penalty: string // EOS type: float64
    liquidator_discount: string // EOS type: float64
    liquidation_price: string // EOS type: asset
    nut_auct_ratio: string // EOS type: float64
    nut_discount: string // EOS type: float64

    profit_factor: string // EOS type: float64
    vote_period: number // EOS type: uint32
    stake_period: number // EOS type: uint32
    reserve_ratio: string // EOS type: float64
    staking_weight: string // EOS type: float64
    bpproxy_account: string // EOS type: name
    governc_account: string // EOS type: name

    referral_min_stake: string // EOS type: asset
    referral_ratio: string // EOS type: float64

    collateral_account: string // EOS type: name
    collateral_token: string // EOS type: symbol
}

export interface EosdtContractParameters {
    parameter_id: number // EOS type: uint64
    total_collateral: string // EOS type: float64
    total_debt: string // EOS type: asset
    stability_rate: string // EOS type: float64
    governance_rate: string // EOS type: float64
    prev_date: string // EOS type: time_point_sec
    prev_vote: string // EOS type: time_point_sec
    prev_stake: string // EOS type: time_point_sec
    eos_staked: string // EOS type: asset
}
