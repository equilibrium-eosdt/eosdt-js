"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class LiquidatorContract {
    constructor(connector) {
        this.rpc = connector.rpc;
        this.api = connector.api;
        this.contractName = "eosdtliqdatr";
    }
    marginCallAndBuyoutEos(senderAccount, positionId, eosdtToTransfer) {
        return __awaiter(this, void 0, void 0, function* () {
            eosdtToTransfer = utils_1.toBigNumber(eosdtToTransfer);
            const receipt = yield this.api.transact({
                actions: [{
                        account: "eosdtcntract",
                        name: "margincall",
                        authorization: [{ actor: senderAccount, permission: "active" }],
                        data: {
                            position_id: positionId
                        }
                    },
                    {
                        account: "eosdtsttoken",
                        name: "transfer",
                        authorization: [{ actor: senderAccount, permission: "active" }],
                        data: {
                            from: senderAccount,
                            to: this.contractName,
                            quantity: `${eosdtToTransfer.toFixed(9)} EOSDT`,
                            memo: "",
                        }
                    }],
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    transferEos(sender, amount, memo) {
        return __awaiter(this, void 0, void 0, function* () {
            amount = utils_1.toBigNumber(amount);
            const result = yield this.api.transact({
                actions: [{
                        account: "eosio.token",
                        name: "transfer",
                        authorization: [{ actor: sender, permission: "active" }],
                        data: {
                            from: sender,
                            to: this.contractName,
                            quantity: `${amount.toFixed(4)} EOS`,
                            memo,
                        },
                    }],
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return result;
        });
    }
    transferEosdt(sender, amount, memo) {
        return __awaiter(this, void 0, void 0, function* () {
            amount = utils_1.toBigNumber(amount);
            const result = yield this.api.transact({
                actions: [{
                        account: "eosdtsttoken",
                        name: "transfer",
                        authorization: [{ actor: sender, permission: "active" }],
                        data: {
                            from: sender,
                            to: this.contractName,
                            quantity: `${amount.toFixed(9)} EOSDT`,
                            memo,
                        },
                    }],
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return result;
        });
    }
    getSurplusDebt() {
        return __awaiter(this, void 0, void 0, function* () {
            const parameters = yield this.getParameters();
            return parameters.surplus_debt;
        });
    }
    getBadDebt() {
        return __awaiter(this, void 0, void 0, function* () {
            const parameters = yield this.getParameters();
            return parameters.bad_debt;
        });
    }
    getEosBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const parameters = yield this.getParameters();
            return parameters.eos_balance;
        });
    }
    getParameters() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName, scope: this.contractName, table: "parameters", json: true, limit: 1,
            });
            return table.rows[0];
        });
    }
}
exports.LiquidatorContract = LiquidatorContract;
