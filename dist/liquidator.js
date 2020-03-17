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
const liquidator_1 = require("./interfaces/liquidator");
const utils_1 = require("./utils");
class LiquidatorContract {
    constructor(connector) {
        this.posContractName = "eosdtcntract";
        this.tokenSymbol = "EOS";
        this.rpc = connector.rpc;
        this.api = connector.api;
        this.contractName = "eosdtliqdatr";
    }
    marginCallAndBuyoutCollat(senderName, positionId, eosdtToTransfer, trxMemo, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const eosdtAssetString = utils_1.amountToAssetString(eosdtToTransfer, "EOSDT");
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.posContractName,
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
    getCollatBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const parameters = yield this.getParameters();
            return parameters.collat_balance;
        });
    }
    getNutCollatBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const parameters = yield this.getParameters();
            return parameters.nut_collat_balance;
        });
    }
    getParameters() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "parameters"
            });
            return utils_1.validateExternalData(table.rows[0], "liquidator parameters", liquidator_1.liquidatorParametersKeys);
        });
    }
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "liqsettings"
            });
            return utils_1.validateExternalData(table.rows[0], "liquidator settings", liquidator_1.liquidatorSettingsKeys);
        });
    }
}
exports.LiquidatorContract = LiquidatorContract;
