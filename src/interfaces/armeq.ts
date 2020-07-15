export interface ArmContractSettings {
    setting_id: number // EOS type: uint64
    safety_margin: string // EOS type: float64
    rate_timeout: number // EOS type: int32
    max_iterations: number // EOS type: uint32
    newdex_acc: string // EOS type: name
    newdex_slippage: string // EOS type: float64
    arm_tolerance: string // EOS type: float64
    loan_acc: string // EOS type: name
    loan_balance_acc: string // EOS type: name
    borrow_fee: string // EOS type: float64
    dearm_safety_margin: string // EOS type: float64
    min_eos_to_buy: string // EOS type: asset (EOS)
    newdex_mediator: string // EOS type: name
}

export const armContractSettings = [
    "setting_id",
    "safety_margin",
    "rate_timeout",
    "max_iterations",
    "newdex_acc",
    "newdex_slippage",
    "arm_tolerance",
    "loan_acc",
    "loan_balance_acc",
    "borrow_fee",
    "dearm_safety_margin",
    "min_eos_to_buy",
    "newdex_mediator"
]
