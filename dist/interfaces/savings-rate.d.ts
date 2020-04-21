/**
 * Object with parameters of the Equilibrium Savings Rate contract
 */
export interface SRContractParams {
    param_id: number;
    total_discounted_balance: string;
}
export declare const srContractParamsKeys: string[];
/**
 * Object with settings of the Equilibrium Savings Rate contract
 */
export interface SRContractSettings {
    setting_id: number;
    sttoken_account: string;
    min_deposit: string;
}
export declare const srContractSettingsKeys: string[];
/**
 * Position in Equilibrium Savings Rate contract. Represents amount of EOSDT user transferred to
 * contract
 */
export interface SRPosition {
    position_id: number;
    owner: string;
    balance: string;
}
export declare const srPositionKeys: string[];
