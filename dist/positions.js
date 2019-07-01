"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const utils_1 = require("./utils");
class PositionsContract {
    constructor(connector) {
        this.rpc = connector.rpc;
        this.api = connector.api;
        this.contractName = "eosdtcntract";
    }
    create(accountName, eosAmount, eosdtAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            eosAmount = utils_1.toBigNumber(eosAmount);
            const roundedDebtAmount = utils_1.toBigNumber(eosdtAmount).dp(4, 1);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "positionadd",
                        authorization: [{ actor: accountName, permission: "active" }],
                        data: {
                            maker: accountName,
                        },
                    },
                    {
                        account: "eosio.token",
                        name: "transfer",
                        authorization: [{ actor: accountName, permission: "active" }],
                        data: {
                            from: accountName,
                            to: this.contractName,
                            quantity: `${eosAmount.toFixed(4)} EOS`,
                            memo: `${roundedDebtAmount.toFixed(9)} EOSDT`,
                        }
                    }
                ]
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    close(senderAccount, positionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.api.transact({
                actions: [{
                        account: this.contractName,
                        name: "close",
                        authorization: [{ actor: senderAccount, permission: "active" }],
                        data: { position_id: positionId },
                    }]
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    delete(creator, positionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.api.transact({
                actions: [{
                        account: this.contractName,
                        name: "positiondel",
                        authorization: [{ actor: creator, permission: "active" }],
                        data: { position_id: positionId },
                    }]
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    addCollateral(account, amount, positionId) {
        return __awaiter(this, void 0, void 0, function* () {
            amount = utils_1.toBigNumber(amount);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: "eosio.token",
                        name: "transfer",
                        authorization: [{ actor: account, permission: "active" }],
                        data: {
                            to: this.contractName,
                            from: account,
                            maker: account,
                            quantity: `${amount.toFixed(4)} EOS`,
                            memo: `position_id:${positionId}`,
                        },
                    },
                ],
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    deleteCollateral(sender, amount, positionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof amount === "string" || typeof amount === "number") {
                amount = new bignumber_js_1.default(amount);
            }
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "colateraldel",
                        authorization: [{ actor: sender, permission: "active" }],
                        data: {
                            position_id: positionId,
                            collateral: `${amount.toFixed(4)} EOS`,
                        },
                    },
                ],
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    generateDebt(account, amount, positionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const roundedAmount = utils_1.toBigNumber(amount).dp(4, 1);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "debtgenerate",
                        authorization: [{ actor: account, permission: "active" }],
                        data: {
                            debt: `${roundedAmount.toFixed(9)} EOSDT`,
                            position_id: positionId,
                        },
                    },
                ],
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    burnbackDebt(account, amount, positionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const roundedAmount = utils_1.toBigNumber(amount).dp(4, 1);
            const receipt = yield this.api.transact({
                actions: [{
                        account: "eosdtsttoken",
                        name: "transfer",
                        authorization: [{ actor: account, permission: "active" }],
                        data: {
                            to: this.contractName,
                            from: account,
                            maker: account,
                            quantity: `${roundedAmount.toFixed(9)} EOSDT`,
                            memo: `position_id:${positionId}`,
                        },
                    }]
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    marginCall(senderAccount, positionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.api.transact({
                actions: [{
                        account: this.contractName,
                        name: "margincall",
                        authorization: [{ actor: senderAccount, permission: "active" }],
                        data: {
                            position_id: positionId
                        },
                    }],
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    getRates() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: "eosdtorclize", scope: "eosdtorclize", table: "oracle.rates", json: true,
                limit: 500
            });
            return table.rows;
        });
    }
    getPositionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName, scope: this.contractName, table: "positions", json: true, limit: 1,
                table_key: "position_id", lower_bound: id, upper_bound: id
            });
            return table.rows[0];
        });
    }
    getAllUserPositions(maker) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName, scope: this.contractName, table: "positions", json: true, limit: 100,
                table_key: "maker", index_position: "secondary", key_type: "name",
                lower_bound: maker, upper_bound: maker
            });
            return table.rows;
        });
    }
    getParameters() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName, scope: this.contractName, table: "parameters", json: true,
            });
            return table.rows[0];
        });
    }
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName, scope: this.contractName, table: "ctrsettings", json: true,
            });
            return table.rows[0];
        });
    }
}
exports.PositionsContract = PositionsContract;
