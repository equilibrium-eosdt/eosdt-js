export interface EosdtPosition {
    position_id: number
    maker: string
    outstanding: string
    governance: string
    collateral: string
}

export interface TokenRate {
    rate: string
    update: string
    provablecb1a_price: string
    provablecb1a_update: string
    eosnationdsp_price: string
    eosnationdsp_update: string
    equilibriumdsp_price: string
    equilibriumdsp_update: string
}

export interface EosdtContractSettings {
    setting_id: number // EOS type: uint64
    global_lock: number // EOS type: uint8
    time_shift: number // EOS type: uint64

    liquidator_account: string // EOS type: name
    oraclize_account: string // EOS type: name
    sttoken_account: string // EOS type: name
    nutoken_account: string // EOS type: name

    governance_fee: string // EOS type: float64
    stability_fee: string // EOS type: float64
    critical_ltv: string // EOS type: float64
    liquidation_penalty: string // EOS type: float64
    liquidator_discount: string // EOS type: float64
    liquidation_price: string // EOS type: asset
    nut_auct_ratio: string // EOS type: float64
    nut_discount: string // EOS type: float64

    profit_factor: string // EOS type: float64
    vote_period: number // EOS type: uint32
    stake_period: number // EOS type: uint32
    reserve_ratio: string // EOS type: float64
    staking_weight: string // EOS type: float64
    bpproxy_account: string // EOS type: name
    governc_account: string // EOS type: name
}

export interface EosdtContractParameters {
    parameter_id: number
    total_collateral: string
    total_debt: string
    stability_rate: string
    governance_rate: string
    prev_date: string
    prev_vote: string
    prev_stake: string
    eos_staked: string
}
