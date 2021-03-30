export interface ConstructorData {
    contractName: string;
}
export interface PositionsConstructorData extends ConstructorData {
    tokenContract: string;
    ratesContract: string;
}
export interface LiquidatorConstructorData extends ConstructorData {
    positionsContract: string;
}
export declare const DECIMALS: {
    [key: string]: number;
};
export declare const POSITION_CONTRACTS: {
    [key: string]: string;
};
export declare const LIQUIDATOR_CONTRACTS: {
    [key: string]: string;
};
export declare const TOKEN_CONTRACTS: {
    [key: string]: string;
};
