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
const tokenswap_1 = require("./interfaces/tokenswap");
const utils_1 = require("./utils");
/**
 * A wrapper class to invoke actions of Equilibrium Token Swap contract
 */
class TokenSwapContract {
    /**
     * Instantiates TokenSwapContract
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector) {
        this.name = "tokenswap.eq";
        this.rpc = connector.rpc;
        this.api = connector.api;
    }
    /**
     * Sends NUT tokens to TokenSwap contract. Send Ethereum address (format with prefix "0x")
     * in memo to verify Ethereum signature
     * @param {string} senderName
     * @param {string | number} nutAmount
     * @param {string} ethereumAddress
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    transferNut(senderName, nutAmount, ethereumAddress, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ethereumAddress.length !== 42) {
                const msg = `Ethereum address format mismatch: should start with prefix "0x",` +
                    `example "0xb794f5ea0ba39494ce839613fffba74279579268". ` +
                    `Received address: \n${ethereumAddress}"`;
                throw new Error(msg);
            }
            ethereumAddress = ethereumAddress.slice(2);
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
                            to: this.name,
                            quantity: nutAssetString,
                            memo: ethereumAddress
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
     * Returns NUT from TokenSwap contract to account balance
     * and verifies Ethereum signature (format with prefix "0x")
     * @param {string} toAccount
     * @param {number} positionId
     * @param {string} ethereumSignature
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    claim(toAccount, positionId, ethereumSignature, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ethereumSignature.length !== 132) {
                const msg = `Ethereum signature format mismatch: should start with prefix "0x",` +
                    `example "0xfa076d068ca83ec87203f394c630a1a992f0d39eac5e761aec4c90011204f0b77` +
                    `6adf698fe3d626dfd4e7c6ef1f89adb4b9831adaeac72dd19093381265b45471b". ` +
                    `\nReceived signature: \n${ethereumSignature}"`;
                throw new Error(msg);
            }
            ethereumSignature = ethereumSignature.slice(2);
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: toAccount, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.name,
                        name: "claim",
                        authorization,
                        data: {
                            to: toAccount,
                            position_id: positionId,
                            signature: ethereumSignature
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
     * @returns {Promise<object>} TokenSwap contract parameters
     */
    getParameters() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.name,
                scope: this.name,
                table: "swpparams"
            });
            return utils_1.validateExternalData(table.rows[0], "TokenSwap contract parameters", tokenswap_1.tsContractParamsKeys);
        });
    }
    /**
     * @returns {Promise<object>} TokenSwap contract settings
     */
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.name,
                scope: this.name,
                table: "swpsettings"
            });
            return utils_1.validateExternalData(table.rows[0], "TokenSwap contract settings", tokenswap_1.tsContractSettingsKeys);
        });
    }
    /**
     * @returns {Promise<Array<object>>} An array of all positions created on TokenSwap contract
     */
    getAllPositions() {
        return __awaiter(this, void 0, void 0, function* () {
            let lowerBound = 0;
            const limit = 10000;
            const getTablePart = () => __awaiter(this, void 0, void 0, function* () {
                const table = yield this.rpc.get_table_rows({
                    code: this.name,
                    scope: this.name,
                    table: "swppositions",
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
            return utils_1.validateExternalData(result, "TokenSwap contract positions", tokenswap_1.tsContractPositionsKeys);
        });
    }
}
exports.TokenSwapContract = TokenSwapContract;