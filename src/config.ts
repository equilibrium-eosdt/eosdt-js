export const DECIMALS: { [key: string]: number } = {
    EOS: 4,
    PBTC: 8
}

export const POSITION_CONTRACTS: { [key: string]: string } = {
    EOS: "eosdtcntract",
    PBTC: "eosdtpbtcpos"
}

export const LIQUIDATOR_CONTRACTS: { [key: string]: string } = {
    EOS: "eosdtliqdatr",
    PBTC: "eosdtpbtcliq"
}

export const TOKEN_CONTRACTS: { [key: string]: string } = {
    EOS: "eosio.token",
    PBTC: "btc.ptokens"
}
