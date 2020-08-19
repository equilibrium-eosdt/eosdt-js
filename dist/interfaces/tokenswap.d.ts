/**
 * Object with parameters of the Equilibrium Token Swap contract
 */
export interface TokenswapContractParams {
    param_id: number;
    total_nut_amount: string;
}
export declare const tsContractParamsKeys: string[];
/**
 * Object with settings of the Equilibrium Token Swap contract
 */
export interface TokenswapContractSettings {
    setting_id: number;
    min_deposit: string;
    token_address: string;
    swap_lock: number;
}
export declare const tsContractSettingsKeys: string[];
/**
 * Position in Equilibrium Savings Rate contract
 */
export interface TokenswapPositions {
    position_id: number;
    moment: string;
    nut_amount: string;
    eth_address: string;
}
export declare const tsContractPositionsKeys: string[];
