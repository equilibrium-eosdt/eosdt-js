"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
/**
 * Module to get account's balances of EOSDT, EOS, PBTC, PETH and NUT
 */
class BalanceGetter {
    /**
     * Creates instance of `BalanceGetter`
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector) {
        this.rpc = connector.rpc;
    }
    /**
     * @param {string} account Account name
     * @returns {Promise<number>} EOS balance of account
     */
    getEos(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.rpc.get_currency_balance("eosio.token", account, "EOS");
            return utils_1.balanceToNumber(balance);
        });
    }
    /**
     * @param {string} account Account name
     * @returns {Promise<number>} EOSDT balance of account
     */
    getEosdt(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.rpc.get_currency_balance("eosdtsttoken", account, "EOSDT");
            return utils_1.balanceToNumber(balance);
        });
    }
    /**
     * @param {string} account Account name
     * @returns {Promise<number>} NUT balance of account
     */
    getNut(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.rpc.get_currency_balance("eosdtnutoken", account, "NUT");
            return utils_1.balanceToNumber(balance);
        });
    }
    /**
     * @param {string} account Account name
     * @returns {Promise<number>} PBTC balance of account
     */
    getPbtc(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.rpc.get_currency_balance("btc.ptokens", account, "PBTC");
            return utils_1.balanceToNumber(balance);
        });
    }
    /**
     * @param {string} account Account name
     * @returns {Promise<number>} PETH balance of account
     */
    getPeth(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.rpc.get_currency_balance("eth.ptokens", account, "PETH");
            return utils_1.balanceToNumber(balance);
        });
    }
}
exports.BalanceGetter = BalanceGetter;
