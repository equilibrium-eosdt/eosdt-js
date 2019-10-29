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
class LiquidatorContract {
    constructor(connector) {
        this.rpc = connector.rpc;
        this.api = connector.api;
        this.contractName = "eosdtliqdatr";
    }
    marginCallAndBuyoutEos(senderName, positionId, eosdtToTransfer, trxMemo, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const eosdtAssetString = utils_1.amountToAssetString(eosdtToTransfer, "EOSDT");
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: "eosdtcntract",
                        name: "margincall",
                        authorization,
                        data: { position_id: positionId }
                    },
                    {
                        account: "eosdtsttoken",
                        name: "transfer",
                        authorization,
                        data: {
                            from: senderName,
                            to: this.contractName,
                            quantity: eosdtAssetString,
                            memo: trxMemo ? trxMemo : "eosdt-js buyout"
                        }
                    }
                ]
            }, {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            });
            return receipt;
        });
    }
    transferEos(senderName, amount, trxMemo, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const eosAssetString = utils_1.amountToAssetString(amount, "EOS");
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: "eosio.token",
                        name: "transfer",
                        authorization,
                        data: {
                            from: senderName,
                            to: this.contractName,
                            quantity: eosAssetString,
                            memo: trxMemo ? trxMemo : "eosdt-js transferEos()"
                        }
                    }
                ]
            }, {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            });
            return receipt;
        });
    }
    transferEosdt(senderName, eosdtAmount, trxMemo, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const eosdtAssetString = utils_1.amountToAssetString(eosdtAmount, "EOSDT");
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: "eosdtsttoken",
                        name: "transfer",
                        authorization,
                        data: {
                            from: senderName,
                            to: this.contractName,
                            quantity: eosdtAssetString,
                            memo: trxMemo ? trxMemo : "eosdt-js transferEosdt()"
                        }
                    }
                ]
            }, {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            });
            return receipt;
        });
    }
    transferNut(senderName, nutAmount, trxMemo, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const nutAssetString = utils_1.amountToAssetString(nutAmount, "NUT");
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: "eosdtnutoken",
                        name: "transfer",
                        authorization,
                        data: {
                            from: senderName,
                            to: this.contractName,
                            quantity: nutAssetString,
                            memo: trxMemo ? trxMemo : "eosdt-js transferNut()"
                        }
                    }
                ]
            }, {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            });
            return receipt;
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
                code: this.contractName,
                scope: this.contractName,
                table: "parameters"
            });
            return table.rows[0];
        });
    }
}
exports.LiquidatorContract = LiquidatorContract;
