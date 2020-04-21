/**
 * Object with parameters of the Equilibrium Savings Rate contract
 */
export interface SRContractParams {
    param_id: number // EOS type: uint64
    total_discounted_balance: string // EOS type: asset
}
export const srContractParamsKeys = ["param_id", "total_discounted_balance"]

/**
 * Object with settings of the Equilibrium Savings Rate contract
 */
export interface SRContractSettings {
    setting_id: number // EOS type: uint64
    sttoken_account: string // EOS type: name
    min_deposit: string // EOS type: asset
}
export const srContractSettingsKeys = ["setting_id", "sttoken_account", "min_deposit"]

/**
 * Position in Equilibrium Savings Rate contract. Represents amount of EOSDT user transferred to
 * contract
 */
export interface SRPosition {
    position_id: number // EOS type: uint64
    owner: string // EOS type: name
    balance: string // EOS type: asset
}
export const srPositionKeys = ["position_id", "owner", "balance"]
