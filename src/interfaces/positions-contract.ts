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
