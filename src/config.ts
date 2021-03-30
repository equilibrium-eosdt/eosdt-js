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

export const DECIMALS: { [key: string]: number } = {
    EOS: 4,
    PBTC: 8,
    PETH: 9
}

export const POSITION_CONTRACTS: { [key: string]: string } = {
    EOS: "eosdtcntract",
    PBTC: "eosdtpbtcpos",
    PETH: "pethpos.eq"
}

export const LIQUIDATOR_CONTRACTS: { [key: string]: string } = {
    EOS: "eosdtliqdatr",
    PBTC: "eosdtpbtcliq",
    PETH: "pethliq.eq"
}

export const TOKEN_CONTRACTS: { [key: string]: string } = {
    EOS: "eosio.token",
    PBTC: "btc.ptokens",
    PETH: "eth.ptokens"
}