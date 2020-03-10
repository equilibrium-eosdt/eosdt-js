export interface LiquidatorParameters {
    parameter_id: number // EOS type:  uint64
    surplus_debt: string // EOS type: asset
    bad_debt: string // EOS type: asset
    collat_balance: string // EOS type: asset
    nut_collat_balance: string // EOS type: asset
}

export interface LiquidatorSettings {
    setting_id: number // EOS type: uint64
    position_account: string // EOS type: name
    global_unlock: number // EOS type: uint8
    auction_price: string // EOS type: asset
    burn_rate: string // EOS type: float64
    gov_return_rate: string // EOS type: float64
    set_aside_rate: string // EOS type: float64
}
