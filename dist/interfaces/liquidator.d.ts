export interface LiquidatorParameters {
    parameter_id: number;
    surplus_debt: string;
    bad_debt: string;
    collat_balance: string;
    nut_collat_balance: string;
}
export declare const liquidatorParametersKeys: string[];
export interface LiquidatorSettings {
    setting_id: number;
    position_account: string;
    global_unlock: number;
    auction_price: string;
    burn_rate: string;
    gov_return_rate: string;
    set_aside_rate: string;
    savings_rate: string;
}
export declare const liquidatorSettingsKeys: string[];
