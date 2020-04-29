import {
    BasicEosdtPosition,
    BasicEosdtPosParameters,
    basicEosdtPosParametersKeys,
    basicPositionKeys
} from "./basic-positions-contract"

export interface EosdtPosition extends BasicEosdtPosition {
    governance: string // EOS type: asset
}
export const positionKeys = [...basicPositionKeys, "governance"]

export interface Referral {
    referral_id: number // EOS type: uint64
    referral: string // EOS type: name
    staked_amount: string // EOS type: asset
}
export const referralKeys = ["referral_id", "referral", "staked_amount"]

export interface PositionReferral {
    referral_id: number // EOS type: uint64
    position_id: number // EOS type: uint64
}
export const positionReferralKeys = ["referral_id", "position_id"]

export interface TokenRate {
    rate: string // EOS type: asset
    update: string // EOS type: time_point_sec
    provablecb1a_price: string // EOS type: asset
    provablecb1a_update: string // EOS type: time_point_sec
    delphioracle_price: string // EOS type: asset
    delphioracle_update: string // EOS type: time_point_sec
    equilibriumdsp_price: string // EOS type: asset
    equilibriumdsp_update: string // EOS type: time_point_sec
    id: number // EOS type: uint64
    base: string // EOS type: symbol
}
export const tokenRateKeys = [
    "rate",
    "update",
    "provablecb1a_price",
    "provablecb1a_update",
    "delphioracle_price",
    "delphioracle_update",
    "equilibriumdsp_price",
    "equilibriumdsp_update",
    "id",
    "base"
]

export interface LtvRatios {
    position_id: number // EOS type: uint64
    ltv_ratio: string // EOS type: float64
}
export const ltvRatiosKeys = ["position_id", "ltv_ratio"]

export interface EosdtContractParameters extends BasicEosdtPosParameters {
    governance_rate: string // EOS type: float64
    prev_vote: string // EOS type: time_point_sec
    prev_stake: string // EOS type: time_point_sec
    eos_staked: string // EOS type: asset
}
export const eosdtPosParametersKeys = [
    ...basicEosdtPosParametersKeys,
    "governance_rate",
    "prev_vote",
    "prev_stake",
    "eos_staked"
]

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
    savings_account: string // EOS type: name
}
export const contractSettingsKeys = [
    "setting_id",
    "global_lock",
    "time_shift",
    "liquidator_account",
    "oraclize_account",
    "sttoken_account",
    "nutoken_account",
    "governance_fee",
    "stability_fee",
    "critical_ltv",
    "liquidation_penalty",
    "liquidator_discount",
    "liquidation_price",
    "nut_auct_ratio",
    "nut_discount",
    "profit_factor",
    "vote_period",
    "stake_period",
    "reserve_ratio",
    "staking_weight",
    "bpproxy_account",
    "governc_account",
    "referral_min_stake",
    "referral_ratio",
    "collateral_account",
    "collateral_token",
    "savings_account"
]
