/**
 * Object with parameters of the Equilibrium Token Swap contract
 */
export interface TokenswapContractParams {
    param_id: number // EOS type: uint64
    total_nut_amount: string // EOS type: asset
}
export const tsContractParamsKeys = ["param_id", "total_nut_amount"]

/**
 * Object with settings of the Equilibrium Token Swap contract
 */
export interface TokenswapContractSettings {
    setting_id: number // EOS type: uint64
    min_deposit: string // EOS type: asset
    token_address: string // EOS type: name
    swap_lock: number // EOS type: uint8
}
export const tsContractSettingsKeys = ["setting_id", "min_deposit", "token_address", "swap_lock"]

/**
 * Position in Equilibrium Savings Rate contract
 */
export interface TokenswapPositions {
    position_id: number // EOS type: uint64
    moment: string // EOS type: time_point_sec
    nut_amount: string // EOS type: asset
    eth_address: string // EOS type: string
}
export const tsContractPositionsKeys = ["position_id", "moment", "nut_amount", "eth_address"]
