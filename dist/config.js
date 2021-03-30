"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_CONTRACTS = exports.LIQUIDATOR_CONTRACTS = exports.POSITION_CONTRACTS = exports.DECIMALS = void 0;
exports.DECIMALS = {
    EOS: 4,
    PBTC: 8,
    PETH: 9
};
exports.POSITION_CONTRACTS = {
    EOS: "eosdtcntract",
    PBTC: "eosdtpbtcpos",
    PETH: "pethpos.eq"
};
exports.LIQUIDATOR_CONTRACTS = {
    EOS: "eosdtliqdatr",
    PBTC: "eosdtpbtcliq",
    PETH: "pethliq.eq"
};
exports.TOKEN_CONTRACTS = {
    EOS: "eosio.token",
    PBTC: "btc.ptokens",
    PETH: "eth.ptokens"
};
