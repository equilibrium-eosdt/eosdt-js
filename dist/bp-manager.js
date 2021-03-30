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
exports.BpManager = void 0;
const governance_1 = require("./interfaces/governance");
const utils_1 = require("./utils");
/**
 * Class for EOSDT Governance actions, related to block producers management
 */
class BpManager {
    /**
     * Creates instance of `BpManager`
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector) {
        this.rpc = connector.rpc;
        this.api = connector.api;
        this.contractName = "eosdtgovernc";
    }
    /**
     * @returns {Promise<object[]>} An array of objects, that contain information about
     * registered block producers
     */
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
    /**
     * @returns {Promise<object | undefined>} Object with information about a registered block
     * producer
     */
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
    /**
     * Registers a block producer in BP voting reward program via EOS transfer. Transferred EOS
     * is added to BP reward balance
     * @param {string} bpName Account name
     * @param {number} depositedAmount EOS amount to transfer
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    registerBlockProducer(bpName, depositedAmount, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: "eosio.token",
                        name: "transfer",
                        authorization: [{ actor: bpName, permission: trxParams.permission }],
                        data: {
                            from: bpName,
                            to: this.contractName,
                            quantity: utils_1.amountToAssetString(depositedAmount, "EOS"),
                            memo: ""
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
     * Changes amount of EOS reward payed by block producer
     * @param {string} bpName Account name
     * @param {number} rewardAmount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    changeBlockProducerReward(bpName, rewardAmount, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "bpsetparams",
                        authorization: [{ actor: bpName, permission: trxParams.permission }],
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
    /**
     * Deactivates block producer
     * @param {string} bpName Account name
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    unregisterBlockProducer(bpName, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "bpunregister",
                        authorization: [{ actor: bpName, permission: trxParams.permission }],
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
    /**
     * Deposit EOS into block producer Governance account to pay reward. Any account can deposit
     * EOS for a block producer
     * @param {string} fromAccount Paying account name
     * @param {string} bpName
     * @param {number | string} eosAmount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    depositEos(fromAccount, bpName, eosAmount, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: "eosio.token",
                        name: "transfer",
                        authorization: [{ actor: fromAccount, permission: trxParams.permission }],
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
