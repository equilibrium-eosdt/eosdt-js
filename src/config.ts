export const DECIMALS: { [key: string]: number } = {
    EOS: 4,
    PBTC: 8,
    KGRAM: 4
}

export const POSITION_CONTRACTS: { [key: string]: string } = {
    EOS: "eosdtcntract",
    PBTC: "eosdtpbtcpos",
    KGRAM: "eosdtgrampos"
}

export const LIQUIDATOR_CONTRACTS: { [key: string]: string } = {
    EOS: "eosdtliqdatr",
    PBTC: "eosdtpbtcliq",
    KGRAM: "eosdtgramliq"
}

export const TOKEN_CONTRACTS: { [key: string]: string } = {
    EOS: "eosio.token",
    PBTC: "btc.ptokens",
    KGRAM: "eosdtkgtoken"
}
