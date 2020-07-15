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
const config_1 = require("./config");
const basic_positions_contract_1 = require("./interfaces/basic-positions-contract");
const positions_contract_1 = require("./interfaces/positions-contract");
const utils_1 = require("./utils");
/**
 * Module to manage EOSDT positions with non-EOS collateral
 */
class BasicPositionsContract {
    /**
     * Creates an instance of `BasicPositionsContract`
     * @param connector EosdtConnector (see `README` section `Usage`)
     * @param {string} tokenSymbol Currently only "PBTC"
     */
    constructor(connector, tokenSymbol) {
        const availableCollateralTokens = ["EOS", "PBTC"];
        if (!availableCollateralTokens.includes(tokenSymbol)) {
            const errMsg = `Cannot initiate positions contract logic for token '${tokenSymbol}'. ` +
                `Available tokens: ${availableCollateralTokens.join(", ")}`;
            throw new Error(errMsg);
        }
        this.tokenSymbol = tokenSymbol;
        this.decimals = config_1.DECIMALS[tokenSymbol];
        this.rpc = connector.rpc;
        this.api = connector.api;
        this.contractName = config_1.POSITION_CONTRACTS[tokenSymbol];
        this.tokenContract = config_1.TOKEN_CONTRACTS[tokenSymbol];
        this.contractSettingsKeys = basic_positions_contract_1.posContractSettingsKeys;
        if (tokenSymbol === "EOS") {
            this.positionKeys = positions_contract_1.positionKeys;
            this.contractParametersKeys = positions_contract_1.eosdtPosParametersKeys;
        }
        else {
            this.positionKeys = basic_positions_contract_1.basicPositionKeys;
            this.contractParametersKeys = basic_positions_contract_1.basicEosdtPosParametersKeys;
        }
    }
    /**
     * Creates new position, sending specified amount of collateral and issuing specified amount
     * of EOSDT to creator.
     *
     * @param {string} accountName Creator's account name
     * @param {string | number} collatAmount Amount of collateral tokens to transfer to position
     * @param {string | number} eosdtAmount EOSDT amount to issue
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    newPosition(accountName, collatAmount, eosdtAmount, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: accountName, permission: trxParams.permission }];
            if (typeof collatAmount === "string")
                collatAmount = parseFloat(collatAmount);
            if (typeof eosdtAmount === "string")
                eosdtAmount = parseFloat(eosdtAmount);
            if (collatAmount <= 0) {
                const errMsg = `To create position via transfer you need to transfer positive amount of ` +
                    `${this.tokenSymbol}. Cannot transfer '${collatAmount}'. You can create empty ` +
                    `position, using method '${this.newEmptyPosition.name}'`;
                throw new Error(errMsg);
            }
            const collatAssetString = utils_1.amountToAssetString(collatAmount, this.tokenSymbol);
            const eosdtAssetString = utils_1.amountToAssetString(eosdtAmount, "EOSDT");
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.tokenContract,
                        name: "transfer",
                        authorization,
                        data: {
                            from: accountName,
                            to: this.contractName,
                            quantity: collatAssetString,
                            memo: eosdtAssetString
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
     * Creates new position with 0 debt and collateral
     *
     * @param {string} maker Account to create position for
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     */
    newEmptyPosition(maker, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: maker, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "positionadd",
                        authorization,
                        data: { maker }
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
     * Transfers position ownership to another account
     * @param {string} giverAccount Account name
     * @param {string} receiver Account name
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    give(giverAccount, receiver, positionId, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: giverAccount, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "positiongive",
                        authorization,
                        data: {
                            position_id: positionId,
                            to: receiver
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
     * Sends collateral to position to increase it's collateralization.
     *
     * @param {string} senderName Account name
     * @param {string | number} amount Amount of added collateral
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    addCollateral(senderName, amount, positionId, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const collatAssetString = utils_1.amountToAssetString(amount, this.tokenSymbol, this.decimals);
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.tokenContract,
                        name: "transfer",
                        authorization,
                        data: {
                            to: this.contractName,
                            from: senderName,
                            quantity: collatAssetString,
                            memo: `position_id:${positionId}`
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
     * Returns collateral from position, LTV must remain above critical for this action to work
     * @param {string} senderName Account name
     * @param {string | number} amount
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    deleteCollateral(senderName, amount, positionId, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const collatAssetString = utils_1.amountToAssetString(amount, this.tokenSymbol, this.decimals);
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "colateraldel",
                        authorization,
                        data: {
                            position_id: positionId,
                            collateral: collatAssetString
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
     * Issues additional EOSDT if this does not bring position LTV below critical.
     * @param {string} senderName Account name
     * @param {string | number} amount Not more than 4 significant decimals
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    generateDebt(senderName, amount, positionId, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const eosdtAssetString = utils_1.amountToAssetString(amount, "EOSDT");
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "debtgenerate",
                        authorization,
                        data: {
                            debt: eosdtAssetString,
                            position_id: positionId
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
     * Transfers EOSDT to position to burn debt. Excess debt would be refunded to user account
     * @param {string} senderName Account name
     * @param {string | number} amount Not more than 4 significant decimals
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    burnbackDebt(senderName, amount, positionId, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const eosdtAssetString = utils_1.amountToAssetString(amount, "EOSDT");
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const actions = [
                {
                    account: "eosdtsttoken",
                    name: "transfer",
                    authorization,
                    data: {
                        to: this.contractName,
                        from: senderName,
                        quantity: eosdtAssetString,
                        memo: `position_id:${positionId}`
                    }
                }
            ];
            const receipt = yield this.api.transact({ actions }, {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            });
            return receipt;
        });
    }
    /**
     * Transfers collateral tokens to position and generates EOSDT debt
     * @param {string} senderName Account name
     * @param {string | number} addedCollatAmount
     * @param {string | number} generatedDebtAmount
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    addCollatAndDebt(senderName, addedCollatAmount, generatedDebtAmount, positionId, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const collatAssetString = utils_1.amountToAssetString(addedCollatAmount, this.tokenSymbol, this.decimals);
            const debtAssetString = utils_1.amountToAssetString(generatedDebtAmount, "EOSDT");
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.tokenContract,
                        name: "transfer",
                        authorization,
                        data: {
                            to: this.contractName,
                            from: senderName,
                            quantity: collatAssetString,
                            memo: `position_id:${positionId}`
                        }
                    },
                    {
                        account: this.contractName,
                        name: "debtgenerate",
                        authorization,
                        data: {
                            debt: debtAssetString,
                            position_id: positionId
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
     * Withdraws specified amount of PBTC tokens from position and redeems that PBTCs
     * @param {string} senderName Account name
     * @param {string | number} amount
     * @param {number} positionId
     * @param {string} btcAddress
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    pbtcDelCollatAndRedeem(senderName, amount, positionId, btcAddress, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tokenSymbol !== "PBTC") {
                throw new Error(`pbtcDelCollatAndRedeem() can only be used with PBTC positions wrapper`);
            }
            const collatAssetString = utils_1.amountToAssetString(amount, this.tokenSymbol, this.decimals);
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "colateraldel",
                        authorization,
                        data: {
                            position_id: positionId,
                            collateral: collatAssetString
                        }
                    },
                    {
                        account: this.tokenContract,
                        name: "redeem",
                        authorization,
                        data: {
                            sender: senderName,
                            quantity: collatAssetString,
                            memo: btcAddress
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
     * Called on a position with critical LTV to perform a margin call
     * @param {string} senderName Account name
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    marginCall(senderName, positionId, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "margincall",
                        authorization,
                        data: {
                            position_id: positionId
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
     * Deletes position that has 0 debt.
     * @param {string} creator Account name
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    del(creator, positionId, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: creator, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "positiondel",
                        authorization,
                        data: { position_id: positionId }
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
     * Burns debt on position and deletes it. Debt must be = 0 to delete position. Excess debt
     * would be refunded to user account
     * @param {string} maker Account name
     * @param {string | number} debtAmount Must be > than position debt
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    paybackAndDelete(maker, positionId, debtAmount, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: maker, permission: trxParams.permission }];
            const eosdtAssetString = utils_1.amountToAssetString(debtAmount, "EOSDT");
            if (typeof debtAmount === "string")
                debtAmount = parseFloat(debtAmount);
            let actions = [];
            // Burning debt on position
            if (debtAmount > 0) {
                actions.push({
                    account: "eosdtsttoken",
                    name: "transfer",
                    authorization,
                    data: {
                        to: this.contractName,
                        from: maker,
                        quantity: eosdtAssetString,
                        memo: `position_id:${positionId}`
                    }
                });
            }
            // Deleting position
            actions.push({
                account: this.contractName,
                name: "positiondel",
                authorization,
                data: { position_id: positionId }
            });
            const receipt = yield this.api.transact({ actions }, {
                blocksBehind: trxParams.blocksBehind,
                expireSeconds: trxParams.expireSeconds
            });
            return receipt;
        });
    }
    /**
     * Used to close a position in an event of global shutdown.
     * @param {string} senderAccount Account name
     * @param {number} positionId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    close(senderAccount, positionId, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderAccount, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "close",
                        authorization,
                        data: { position_id: positionId }
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
     * @returns {Promise<number>} Contract's collateral asset balance.
     */
    getContractTokenBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.rpc.get_currency_balance(this.tokenContract, this.contractName, this.tokenSymbol);
            return utils_1.balanceToNumber(balance);
        });
    }
    /**
     * @returns {Promise<Array<object>>} Table of current system token prices (rates)
     */
    getRates() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: "eosdtorclize",
                scope: "eosdtorclize",
                table: "oraclerates",
                limit: 1000
            });
            return utils_1.validateExternalData(table.rows, "rate", positions_contract_1.tokenRateKeys);
        });
    }
    getRelativeRates() {
        return __awaiter(this, void 0, void 0, function* () {
            const warning = `[WARNING] PositionsContract.getRelativeRates() is deprecated and will be removed ` +
                `soon. It is currently an alias for PositionsContract.getRates(). Use it instead`;
            console.error(warning);
            return this.getRates();
        });
    }
    /**
     * @returns {Promise<Array<object>>} Table of current LTV ratios for all positions.
     */
    getLtvRatiosTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "ctrltvratios",
                limit: 10000
            });
            return utils_1.validateExternalData(table.rows, "ltv ratio", positions_contract_1.ltvRatiosKeys);
        });
    }
    /**
     * @param {number} id Position id
     * @returns {Promise<object | undefined>} Current LTV ratio for position by id
     */
    getPositionLtvRatio(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "ctrltvratios",
                table_key: "position_id",
                lower_bound: id,
                upper_bound: id
            });
            return utils_1.validateExternalData(table.rows[0], "ltv ratio", positions_contract_1.ltvRatiosKeys, true);
        });
    }
    /**
     * @param {number} id Position id
     * @returns {Promise<object | undefined>} A position object
     */
    getPositionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "positions",
                table_key: "position_id",
                lower_bound: id,
                upper_bound: id
            });
            return utils_1.validateExternalData(table.rows[0], "position", this.positionKeys, true);
        });
    }
    /**
     * @param {string} maker Account name
     * @returns {Promise<object | undefined>} Position object - first position that belongs to
     * maker account
     */
    getPositionByMaker(maker) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "positions",
                limit: 1,
                table_key: "maker",
                index_position: "secondary",
                key_type: "name",
                lower_bound: maker,
                upper_bound: maker
            });
            return utils_1.validateExternalData(table.rows[0], "position", this.positionKeys, true);
        });
    }
    /**
     * @param {string} maker Account name
     * @returns {Promise<Array<object>>} Array of all positions objects, created by the maker
     */
    getAllUserPositions(maker) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "positions",
                limit: 10000,
                table_key: "maker",
                index_position: "secondary",
                key_type: "name",
                lower_bound: maker,
                upper_bound: maker
            });
            return utils_1.validateExternalData(table.rows, "position", this.positionKeys);
        });
    }
    /**
     * @returns {Promise<Array<object>>} An array of all positions created on this contract
     */
    getAllPositions() {
        return __awaiter(this, void 0, void 0, function* () {
            let lowerBound = 0;
            const limit = 10000;
            const getTablePart = () => __awaiter(this, void 0, void 0, function* () {
                const table = yield this.rpc.get_table_rows({
                    code: this.contractName,
                    scope: this.contractName,
                    table: "positions",
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
            return utils_1.validateExternalData(result, "position", this.positionKeys);
        });
    }
    /**
     * @param {string} accountName
     * @returns {Promise<object | undefined>} Position object - position of the account with
     * maximum id value
     */
    getLatestUserPosition(accountName) {
        return __awaiter(this, void 0, void 0, function* () {
            const userPositions = yield this.getAllUserPositions(accountName);
            if (userPositions.length === 0)
                return;
            return userPositions.reduce((a, b) => {
                if (Math.max(a.position_id, b.position_id) === a.position_id)
                    return a;
                else
                    return b;
            });
        });
    }
    /**
     * @returns {Promise<object>} Positions contract parameters
     */
    getParameters() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "parameters"
            });
            return utils_1.validateExternalData(table.rows[0], "positions contract parameters", this.contractParametersKeys);
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
                table: "ctrsettings"
            });
            return utils_1.validateExternalData(table.rows[0], "positions contract settings", this.contractSettingsKeys);
        });
    }
}
exports.BasicPositionsContract = BasicPositionsContract;
