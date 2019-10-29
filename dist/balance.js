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
class BalanceGetter {
    constructor(connector) {
        this.rpc = connector.rpc;
    }
    getNut(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.rpc.get_currency_balance("eosdtnutoken", account, "NUT");
            return utils_1.balanceToNumber(balance);
        });
    }
    getEosdt(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.rpc.get_currency_balance("eosdtsttoken", account, "EOSDT");
            return utils_1.balanceToNumber(balance);
        });
    }
    getEos(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.rpc.get_currency_balance("eosio.token", account, "EOS");
            return utils_1.balanceToNumber(balance);
        });
    }
}
exports.BalanceGetter = BalanceGetter;
