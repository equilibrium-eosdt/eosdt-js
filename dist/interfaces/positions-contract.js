"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basic_positions_contract_1 = require("./basic-positions-contract");
exports.positionKeys = [...basic_positions_contract_1.basicPositionKeys, "governance"];
exports.referralKeys = ["referral_id", "referral", "staked_amount"];
exports.positionReferralKeys = ["referral_id", "position_id"];
exports.tokenRateKeys = [
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
];
exports.ltvRatiosKeys = ["position_id", "ltv_ratio"];
exports.eosdtPosParametersKeys = [
    ...basic_positions_contract_1.basicEosdtPosParametersKeys,
    "governance_rate",
    "prev_vote",
    "prev_stake",
    "eos_staked"
];
// FIX
// export interface EosdtContractSettings {
//     setting_id: number // EOS type: uint64
//     global_lock: number // EOS type: uint8
//     time_shift: number // EOS type: uint64
//     liquidator_account: string // EOS type: name
//     oraclize_account: string // EOS type: name
//     sttoken_account: string // EOS type: name
//     nutoken_account: string // EOS type: name
//     governance_fee: string // EOS type: float64
//     stability_fee: string // EOS type: float64
//     critical_ltv: string // EOS type: float64
//     liquidation_penalty: string // EOS type: float64
//     liquidator_discount: string // EOS type: float64
//     liquidation_price: string // EOS type: asset
//     nut_auct_ratio: string // EOS type: float64
//     nut_discount: string // EOS type: float64
//     profit_factor: string // EOS type: float64
//     vote_period: number // EOS type: uint32
//     stake_period: number // EOS type: uint32
//     reserve_ratio: string // EOS type: float64
//     staking_weight: string // EOS type: float64
//     bpproxy_account: string // EOS type: name
//     governc_account: string // EOS type: name
//     referral_min_stake: string // EOS type: asset
//     referral_ratio: string // EOS type: float64
//     collateral_account: string // EOS type: name
//     collateral_token: string // EOS type: symbol
//     savings_account: string // EOS type: name
// }
// export const contractSettingsKeys = [
//     "setting_id",
//     "global_lock",
//     "time_shift",
//     "liquidator_account",
//     "oraclize_account",
//     "sttoken_account",
//     "nutoken_account",
//     "governance_fee",
//     "stability_fee",
//     "critical_ltv",
//     "liquidation_penalty",
//     "liquidator_discount",
//     "liquidation_price",
//     "nut_auct_ratio",
//     "nut_discount",
//     "profit_factor",
//     "vote_period",
//     "stake_period",
//     "reserve_ratio",
//     "staking_weight",
//     "bpproxy_account",
//     "governc_account",
//     "referral_min_stake",
//     "referral_ratio",
//     "collateral_account",
//     "collateral_token",
//     "savings_account"
// ]
