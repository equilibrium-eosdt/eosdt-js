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
exports.ArmContract = void 0;
const armeq_1 = require("./interfaces/armeq");
const utils_1 = require("./utils");
/**
 * Module to manage EOSDT arming operations
 */
class ArmContract {
    constructor(connector) {
        this.rpc = connector.rpc;
        this.api = connector.api;
        this.contractName = `arm.eq`;
    }
    /**
     * Creates EOSDT position with given EOS, then sells received EOSDT to buy more EOS and add it
     * to position. Contract would continue for 20 iterations or until given arm is reached
     * @param {string} accountName - name of account that sends EOS and receives position
     * @param {number | string} amount - transferred amount of EOS
     * @param {number} arm - arm value. With arm = 2.1 and 100 EOS user will receive position with 210 EOS
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    armEos(accountName, amount, arm, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const memoObj = {
                arm,
                backend: `newdex`
            };
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: `eosio.token`,
                        name: `transfer`,
                        authorization: [{ actor: accountName, permission: trxParams.permission }],
                        data: {
                            from: accountName,
                            to: this.contractName,
                            quantity: utils_1.amountToAssetString(amount, `EOS`),
                            memo: JSON.stringify(memoObj)
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
    /**
     * Gives EOS-EOSDT position to 'arm.eq' contract and it arms that position (see `armEos`)
     * @param {string} owner - name of position maker account
     * @param {number} positionId
     * @param {number} arm - arm value. With arm = 2.1 and 100 EOS user will receive position with 210 EOS
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    armExistingEosPosition(owner, positionId, arm, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: `eosdtcntract`,
                        name: `positiongive`,
                        authorization: [{ actor: owner, permission: trxParams.permission }],
                        data: {
                            position_id: positionId,
                            to: this.contractName
                        }
                    },
                    {
                        account: this.contractName,
                        name: `armexisting`,
                        authorization: [{ actor: owner, permission: trxParams.permission }],
                        data: {
                            arm,
                            position_id: positionId,
                            user_acc: owner,
                            backend: `newdex`
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
    /**
     * Reduces debt on position, selling it's collateral. Will stop, when position has LTV,
     * equal to critical LTV + arm safety margin. Excess EOSDT would be returned to maker acc
     * balance
     * @param {string} owner - name of maker account
     * @param {number} positionId
     * @param {number} debtTarget - approximate desired debt amount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    dearmEosPosition(owner, positionId, debtTarget, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: `eosdtcntract`,
                        name: `positiongive`,
                        authorization: [{ actor: owner, permission: trxParams.permission }],
                        data: {
                            position_id: positionId,
                            to: this.contractName
                        }
                    },
                    {
                        account: this.contractName,
                        name: `dearm`,
                        authorization: [{ actor: owner, permission: trxParams.permission }],
                        data: {
                            debt_target: utils_1.amountToAssetString(debtTarget, `EOSDT`),
                            position_id: positionId,
                            user_acc: owner,
                            backend: `newdex`
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
    /**
     * @returns {Promise<object>} Positions contract settings
     */
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: `rmssettings`
            });
            return utils_1.validateExternalData(table.rows[0], `arms.eq contract settings`, armeq_1.armContractSettings);
        });
    }
}
exports.ArmContract = ArmContract;
