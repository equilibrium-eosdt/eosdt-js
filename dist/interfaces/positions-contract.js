"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eosdtPosParametersKeys = exports.ltvRatiosKeys = exports.tokenRateKeys = exports.tokenRateNewKeys = exports.positionReferralKeys = exports.referralKeys = exports.positionKeys = void 0;
const basic_positions_contract_1 = require("./basic-positions-contract");
exports.positionKeys = [...basic_positions_contract_1.basicPositionKeys, "governance"];
exports.referralKeys = ["referral_id", "referral", "staked_amount"];
exports.positionReferralKeys = ["referral_id", "position_id"];
exports.tokenRateNewKeys = [
    "id",
    "base",
    "rate",
    "update",
    "provablecb1a_price",
    "provablecb1a_update",
    "delphioracle_price",
    "delphioracle_update",
    "equilibriumdsp_price",
    "equilibriumdsp_update",
    "backend_price",
    "backend_update"
];
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
