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
const governance_1 = require("./interfaces/governance");
const utils_1 = require("./utils");
class BpManager {
    constructor(connector) {
        this.rpc = connector.rpc;
        this.api = connector.api;
        this.contractName = "eosdtgovernc";
    }
    getAllBpPositions() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "govbpparams",
                limit: 10000
            });
            return utils_1.validateExternalData(table.rows, "bp position", governance_1.bpPositionKeys);
        });
    }
    getBpPosition(bpName) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "govbpparams",
                upper_bound: bpName,
                lower_bound: bpName
            });
            return utils_1.validateExternalData(table.rows[0], "bp position", governance_1.bpPositionKeys, true);
        });
    }
    registerBlockProducer(bpName, rewardAmount, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "bpregister",
                        authorization: [{ actor: bpName, permission: "active" }],
                        data: {
                            bp_name: bpName,
                            reward_amount: utils_1.amountToAssetString(rewardAmount, "EOS")
                        }
                    }
                ]
            }, {
                expireSeconds: trxParams.expireSeconds,
                blocksBehind: trxParams.blocksBehind
            });
            return receipt;
        });
    }
    changeBlockProducerReward(bpName, rewardAmount, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "bpsetparams",
                        authorization: [{ actor: bpName, permission: "active" }],
                        data: {
                            bp_name: bpName,
                            reward_amount: utils_1.amountToAssetString(rewardAmount, "EOS")
                        }
                    }
                ]
            }, {
                expireSeconds: trxParams.expireSeconds,
                blocksBehind: trxParams.blocksBehind
            });
            return receipt;
        });
    }
    unregisterBlockProducer(bpName, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "bpunregister",
                        authorization: [{ actor: bpName, permission: "active" }],
                        data: {
                            bp_name: bpName
                        }
                    }
                ]
            }, {
                expireSeconds: trxParams.expireSeconds,
                blocksBehind: trxParams.blocksBehind
            });
            return receipt;
        });
    }
    depositEos(fromAccount, bpName, eosAmount, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: "eosio.token",
                        name: "transfer",
                        authorization: [{ actor: fromAccount, permission: "active" }],
                        data: {
                            from: fromAccount,
                            to: this.contractName,
                            quantity: utils_1.amountToAssetString(eosAmount, "EOS"),
                            memo: `bp_deposit:${bpName}`
                        }
                    }
                ]
            }, {
                expireSeconds: trxParams.expireSeconds,
                blocksBehind: trxParams.blocksBehind
            });
            return receipt;
        });
    }
}
exports.BpManager = BpManager;
