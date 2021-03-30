import { BasicEosdtPosition, BasicEosdtPosParameters } from "./basic-positions-contract";
export interface EosdtPosition extends BasicEosdtPosition {
    governance: string;
}
export declare const positionKeys: string[];
export interface Referral {
    referral_id: number;
    referral: string;
    staked_amount: string;
}
export declare const referralKeys: string[];
export interface PositionReferral {
    referral_id: number;
    position_id: number;
}
export declare const positionReferralKeys: string[];
export interface TokenRateNew {
    id: number;
    base: string;
    rate: string;
    update: string;
    provablecb1a_price: string;
    provablecb1a_update: string;
    delphioracle_price: string;
    delphioracle_update: string;
    equilibriumdsp_price: string;
    equilibriumdsp_update: string;
    backend_price: string;
    backend_update: string;
}
export declare const tokenRateNewKeys: string[];
export interface TokenRate {
    rate: string;
    update: string;
    provablecb1a_price: string;
    provablecb1a_update: string;
    delphioracle_price: string;
    delphioracle_update: string;
    equilibriumdsp_price: string;
    equilibriumdsp_update: string;
    id: number;
    base: string;
}
export declare const tokenRateKeys: string[];
export interface LtvRatios {
    position_id: number;
    ltv_ratio: string;
}
export declare const ltvRatiosKeys: string[];
export interface EosdtContractParameters extends BasicEosdtPosParameters {
    governance_rate: string;
    prev_vote: string;
    prev_stake: string;
    eos_staked: string;
}
export declare const eosdtPosParametersKeys: string[];
