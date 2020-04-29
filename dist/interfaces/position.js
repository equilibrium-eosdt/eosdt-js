"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicPositionKeys = ["position_id", "maker", "outstanding", "collateral"];
exports.positionKeys = [...exports.basicPositionKeys, "governance"];
exports.basicContractParametersKeys = [
    "parameter_id",
    "total_collateral",
    "total_debt",
    "stability_rate",
    "prev_date"
];
exports.contractParametersKeys = [
    ...exports.basicContractParametersKeys,
    "governance_rate",
    "prev_vote",
    "prev_stake",
    "eos_staked"
];
