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
const savings_rate_1 = require("./interfaces/savings-rate");
const utils_1 = require("./utils");
/**
 * A wrapper class to invoke actions of Equilibrium Savings Rate contract
 */
class SavingsRateContract {
    /**
     * A wrapper class to invoke actions of Equilibrium Savings Rate contract
     */
    constructor(connector) {
        this.name = "eosdtsavings";
        this.rpc = connector.rpc;
        this.api = connector.api;
    }
    /**
     * Transfers EOSDT from user to Savings Rate contract
     */
    stake(senderName, eosdtAmount, trxMemo, transactionParams) {
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
                            to: this.name,
                            quantity: eosdtAssetString,
                            memo: trxMemo ? trxMemo : "eosdt-js SR transfer()"
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
    /**
     * Returns EOSDT from Savings Rate contract to account balance
     */
    unstake(toAccount, eosdtAmount, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const eosdtAssetString = utils_1.amountToAssetString(eosdtAmount, "EOSDT");
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: toAccount, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.name,
                        name: "unstake",
                        authorization,
                        data: {
                            to: toAccount,
                            quantity: eosdtAssetString
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
    /**
     * @returns An array of all positions on Savings Rate contract
     */
    getAllPositions() {
        return __awaiter(this, void 0, void 0, function* () {
            let lowerBound = 0;
            const limit = 10000;
            const getTablePart = () => __awaiter(this, void 0, void 0, function* () {
                const table = yield this.rpc.get_table_rows({
                    code: this.name,
                    scope: this.name,
                    table: "savpositions",
                    lower_bound: lowerBound,
                    limit
                });
                return table;
            });
            const firstRequest = yield getTablePart();
            const result = [...firstRequest.rows];
            let more = firstRequest.more;
            while (more) {
                lowerBound = result[result.length - 1].position_id + 1;
                const morePositions = yield getTablePart();
                result.push(...morePositions.rows);
                more = morePositions.more;
            }
            return utils_1.validateExternalData(result, "SR position", savings_rate_1.srPositionKeys);
        });
    }
    /**
     * @returns A Savings Rate position object with given id
     */
    getPositionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.name,
                scope: this.name,
                table: "savpositions",
                table_key: "position_id",
                lower_bound: id,
                upper_bound: id
            });
            return utils_1.validateExternalData(table.rows[0], "SR position", savings_rate_1.srPositionKeys);
        });
    }
    /**
     * @returns Array of all positions objects, created by the maker
     */
    getUserPositions(maker) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.name,
                scope: this.name,
                table: "savpositions",
                limit: 10000,
                table_key: "owner",
                index_position: "secondary",
                key_type: "name",
                lower_bound: maker,
                upper_bound: maker
            });
            return utils_1.validateExternalData(table.rows, "SR position", savings_rate_1.srPositionKeys);
        });
    }
    /**
     * @returns Positions contract parameters
     */
    getParameters() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.name,
                scope: this.name,
                table: "savparams"
            });
            return utils_1.validateExternalData(table.rows[0], "SR contract parameters", savings_rate_1.srContractParamsKeys);
        });
    }
    /**
     * @returns Positions contract settings
     */
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.name,
                scope: this.name,
                table: "savsettings"
            });
            return utils_1.validateExternalData(table.rows[0], "SR contract settings", savings_rate_1.srContractSettingsKeys);
        });
    }
}
exports.SavingsRateContract = SavingsRateContract;
