export interface LiquidatorParameters {
    parameter_id: number // EOS type:  uint64
    surplus_debt: string // EOS type: asset
    bad_debt: string // EOS type: asset
    collat_balance: string // EOS type: asset
    nut_collat_balance: string // EOS type: asset
}

export const liquidatorParametersKeys = [
    "parameter_id",
    "surplus_debt",
    "bad_debt",
    "collat_balance",
    "nut_collat_balance"
]

export interface LiquidatorSettings {
    setting_id: number // EOS type: uint64
    position_account: string // EOS type: name
    global_unlock: number // EOS type: uint8
    auction_price: string // EOS type: asset
    burn_rate: string // EOS type: float64
    gov_return_rate: string // EOS type: float64
    set_aside_rate: string // EOS type: float64
}

export const liquidatorSettingsKeys = [
    "setting_id",
    "position_account",
    "global_unlock",
    "auction_price",
    "burn_rate",
    "gov_return_rate",
    "set_aside_rate"
]
