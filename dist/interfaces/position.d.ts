export interface BasicEosdtPosition {
    position_id: number;
    maker: string;
    outstanding: string;
    collateral: string;
}
export interface EosdtPosition extends BasicEosdtPosition {
    governance: string;
}
export declare const basicPositionKeys: string[];
export declare const positionKeys: string[];
export interface BasicEosdtContractParameters {
    parameter_id: number;
    total_collateral: string;
    total_debt: string;
    stability_rate: string;
    prev_date: string;
}
export interface EosdtContractParameters extends BasicEosdtContractParameters {
    governance_rate: string;
    prev_vote: string;
    prev_stake: string;
    eos_staked: string;
}
export declare const basicContractParametersKeys: string[];
export declare const contractParametersKeys: string[];
