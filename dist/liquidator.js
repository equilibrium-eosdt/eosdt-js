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
exports.LiquidatorContract = void 0;
const config_1 = require("./config");
const liquidator_1 = require("./interfaces/liquidator");
const utils_1 = require("./utils");
/**
 * A class to work with EOSDT Liquidator contract. Creates EOS liquidator by default
 */
class LiquidatorContract {
    /**
     * Instantiates `LiquidatorContract`
     *  @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector, collateralToken = "EOS", data) {
        this.rpc = connector.rpc;
        this.api = connector.api;
        this.tokenSymbol = collateralToken;
        if (data) {
            this.contractName = data.contractName;
            this.posContractName = data.positionsContract;
        }
        else {
            this.contractName = config_1.LIQUIDATOR_CONTRACTS[collateralToken];
            this.posContractName = config_1.POSITION_CONTRACTS[collateralToken];
        }
    }
    /**
     * Performs margin call on a position and transfers specified amount of EOSDT to liquidator
     * to buyout freed collateral
     * @param {string} senderName
     * @param {number} positionId
     * @param {string | number} eosdtToTransfer
     * @param {string} [trxMemo]
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
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
    /**
     * Sends EOSDT to liquidator contract. Used to cancel bad debt and buyout liquidator
     * collateral with discount
     * @param {string} senderName
     * @param {string | number} eosdtAmount
     * @param {string} [trxMemo]
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
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
    /**
     * Sends NUT tokens to liquidator contract. Send token symbol in memo to buyout collateral
     * asset (liquidator parameter `nut_collat_balance`). With memo "EOSDT" it is used to
     * buyout EOSDT (liquidator parameter `surplus_debt`)
     * @param {string} senderName
     * @param {string | number} nutAmount
     * @param {string} trxMemo
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
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
    /**
     * @returns {Promise<string>} Amount of system surplus debt
     */
    getSurplusDebt() {
        return __awaiter(this, void 0, void 0, function* () {
            const parameters = yield this.getParameters();
            return parameters.surplus_debt;
        });
    }
    /**
     * @returns {Promise<string>} Amount of system bad debt
     */
    getBadDebt() {
        return __awaiter(this, void 0, void 0, function* () {
            const parameters = yield this.getParameters();
            return parameters.bad_debt;
        });
    }
    /**
     * @returns {Promise<string>} Amount of collateral on liquidator contract balance
     */
    getCollatBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const parameters = yield this.getParameters();
            return parameters.collat_balance;
        });
    }
    /**
     * @returns {Promise<string>} Amount of NUT collateral on liquidator
     */
    getNutCollatBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const parameters = yield this.getParameters();
            return parameters.nut_collat_balance;
        });
    }
    /**
     * @returns {Promise<object>} Liquidator contract parameters object
     */
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
    /**
     * @returns {Promise<object>} Liquidator contract settings object
     */
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
