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
const basic_positions_1 = require("./basic-positions");
const positions_contract_1 = require("./interfaces/positions-contract");
const utils_1 = require("./utils");
/**
 * Module to manage EOS-collateral positions (on contract `eosdtcntract`). It is inherited from
 * `BasicPositionsContract` and includes all it's methods.
 */
class PositionsContract extends basic_positions_1.BasicPositionsContract {
    /**
     * Creates an instance of PositionsContract
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector) {
        super(connector, "EOS");
    }
    /**
     * Creates position that has a referral. Position would have 0 collateral and 0 debt
     *
     * @param {string} maker Account to create position for
     * @param {number} referralId Id of a referral
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     */
    newEmptyPositionWithRef(maker, referralId, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: maker, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "posandrefadd",
                        authorization,
                        data: {
                            maker,
                            referral_id: referralId
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
     * @param {number} id
     * @returns {Promise<object>} A position object
     */
    getPositionById(id) {
        const _super = Object.create(null, {
            getPositionById: { get: () => super.getPositionById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.getPositionById.call(this, id);
        });
    }
    /**
     * @param {string} maker Account name
     * @returns {Promise<object | undefined>} Position object - first position that belongs to
     * maker account
     */
    getPositionByMaker(maker) {
        const _super = Object.create(null, {
            getPositionByMaker: { get: () => super.getPositionByMaker }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.getPositionByMaker.call(this, maker);
        });
    }
    /**
     * @param {string} maker Account name
     * @returns {Promise<object[]>} Array of all positions objects, created by the maker
     */
    getAllUserPositions(maker) {
        const _super = Object.create(null, {
            getAllUserPositions: { get: () => super.getAllUserPositions }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.getAllUserPositions.call(this, maker);
        });
    }
    /**
     * @returns {Promise<object[]>} An array of all positions created on this contract
     */
    getAllPositions() {
        const _super = Object.create(null, {
            getAllPositions: { get: () => super.getAllPositions }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.getAllPositions.call(this);
        });
    }
    /**
     * @returns {Promise<object | undefined>}Position object - position of the account with
     * maximum id value
     */
    getLatestUserPosition(accountName) {
        const _super = Object.create(null, {
            getLatestUserPosition: { get: () => super.getLatestUserPosition }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.getLatestUserPosition.call(this, accountName);
        });
    }
    /**
     * @returns {Promise<object[]>} Positions contract parameters
     */
    getParameters() {
        const _super = Object.create(null, {
            getParameters: { get: () => super.getParameters }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.getParameters.call(this);
        });
    }
    /**
     * Creates new referral, staking given amount of NUT tokens. Rejects when amount is less then
     * `referral_min_stake` in positions contract settings.
     * @param {string} senderName
     * @param {string | number} nutAmount
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    addReferral(senderName, nutAmount, transactionParams) {
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
                            to: this.contractName,
                            from: senderName,
                            quantity: nutAssetString,
                            memo: `referral`
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
     * Removes referral and unstakes that referral's NUTs
     * @param {string} senderName
     * @param {number} referralId
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    deleteReferral(senderName, referralId, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "referraldel",
                        authorization,
                        data: { referral_id: referralId }
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
     * @param {number} id
     * @returns {Promise<object | undefined>} An object with information about referral
     */
    getReferralById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "ctrreferrals",
                table_key: "referral_id",
                lower_bound: id,
                upper_bound: id
            });
            return utils_1.validateExternalData(table.rows[0], "referral", positions_contract_1.referralKeys, true);
        });
    }
    /**
     * @returns {Promise<object[]>} Table of existing referrals
     */
    getAllReferrals() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "ctrreferrals",
                limit: 10000
            });
            return utils_1.validateExternalData(table.rows, "referral", positions_contract_1.referralKeys);
        });
    }
    /**
     * @param {string} name Account name
     * @returns {Promise<object | undefined>} An object with information about referral
     */
    getReferralByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.getAllReferrals();
            return table.find((row) => row.referral === name);
        });
    }
    /**
     * @param {number} positionId
     * @returns {Promise<object | undefined>} Returns referral information object if position
     * with given id has a referral
     */
    getPositionReferral(positionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "positionrefs",
                table_key: "position_id",
                lower_bound: positionId,
                upper_bound: positionId
            });
            return utils_1.validateExternalData(table.rows, "position referral", positions_contract_1.positionReferralKeys, true);
        });
    }
    /**
     * @returns {Promise<object[]>} An array of objects, containing positions ids and those
     * positions referrals ids
     */
    getPositionReferralsTable() {
        return __awaiter(this, void 0, void 0, function* () {
            let lowerBound = 0;
            const limit = 10000;
            const getTablePart = () => __awaiter(this, void 0, void 0, function* () {
                const table = yield this.rpc.get_table_rows({
                    code: this.contractName,
                    scope: this.contractName,
                    table: "positionrefs",
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
                const moreReferrals = yield getTablePart();
                result.push(...moreReferrals.rows);
                more = moreReferrals.more;
            }
            return utils_1.validateExternalData(result, "position referral", positions_contract_1.positionReferralKeys);
        });
    }
    /**
     * @returns {Promise<number[]>} An array of position objects with given referral id
     */
    getAllReferralPositionsIds(referralId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getPositionReferralsTable())
                .filter((refPos) => refPos.referral_id === referralId)
                .map((refInfo) => refInfo.position_id);
        });
    }
}
exports.PositionsContract = PositionsContract;
