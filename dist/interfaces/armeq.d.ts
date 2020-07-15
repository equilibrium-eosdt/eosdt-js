export interface ArmContractSettings {
    setting_id: number;
    safety_margin: string;
    rate_timeout: number;
    max_iterations: number;
    newdex_acc: string;
    newdex_slippage: string;
    arm_tolerance: string;
    loan_acc: string;
    loan_balance_acc: string;
    borrow_fee: string;
    dearm_safety_margin: string;
    min_eos_to_buy: string;
    newdex_mediator: string;
}
export declare const armContractSettings: string[];
