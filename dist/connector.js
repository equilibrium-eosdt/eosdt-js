"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EosdtConnector = void 0;
const eosjs_1 = require("eosjs");
const eosjs_jssig_1 = require("eosjs/dist/eosjs-jssig");
const node_fetch_1 = __importDefault(require("node-fetch"));
const text_encoding_1 = require("text-encoding");
const _1 = require(".");
const armeq_1 = require("./armeq");
const balance_1 = require("./balance");
const basic_positions_1 = require("./basic-positions");
const main_positions_1 = require("./main-positions");
const savings_rate_1 = require("./savings-rate");
const tokenswap_1 = require("./tokenswap");
/**
 * A connector object, used to build classes to work with EOSDT ecosystem contracts
 */
class EosdtConnector {
    /**
     * A connector object, used to build classes to work with EOSDT ecosystem contracts
     * @param {string} nodeAddress URL of blockchain node, used to send transactions
     * @param {string[]} privateKeys Array of private keys used to sign transactions
     */
    constructor(nodeAddress, privateKeys) {
        // Workaround to avoid incompatibility of fetch types in 'eosjs' and 'node-fetch'
        const fetch = node_fetch_1.default;
        this.rpc = new eosjs_1.JsonRpc(nodeAddress, { fetch });
        const signatureProvider = new eosjs_jssig_1.JsSignatureProvider(privateKeys);
        this.api = new eosjs_1.Api({
            rpc: this.rpc,
            signatureProvider,
            textDecoder: new text_encoding_1.TextDecoder(),
            textEncoder: new text_encoding_1.TextEncoder()
        });
    }
    /**
     * Creates class to work with basic positions contract (non-EOS collateral)
     * @param {string} collateralToken "PBTC" or "PETH"
     * @returns Instance of `BasicPositionsContract`
     */
    getBasicPositions(collateralToken) {
        return new basic_positions_1.BasicPositionsContract(this, collateralToken);
    }
    /**
     * Creates a class to work with EOS-collateral positions contract (`eosdtcntract`)
     */
    getPositions() {
        return new main_positions_1.PositionsContract(this);
    }
    /**
     * Creates a class to work with specified liquidator contract
     * @param {string=} [collateralToken] "EOS", "PBTC" or "PETH"
     * @returns Instance of `LiquidatorContract`
     */
    getLiquidator(collateralToken = "EOS") {
        return new _1.LiquidatorContract(this, collateralToken);
    }
    /**
     * Creates a wrapper for Savings Rate contract
     * @returns Instance of `SavingsRateContract`
     */
    getSavingsRateCont() {
        return new savings_rate_1.SavingsRateContract(this);
    }
    /**
     * Creates a wrapper for 'arm.eq' contract
     * @returns Instance of `ArmContract`
     */
    getArmContract() {
        return new armeq_1.ArmContract(this);
    }
    /**
     * Creates a wrapper for 'tokenswap.eq' contract
     * @returns Instance of `TokenSwapContract`
     */
    getTokenSwapContract() {
        return new tokenswap_1.TokenSwapContract(this);
    }
    /**
     * Instantiates `GovernanceContract` - a wrapper to work with `eosdtgovernc`
     * @returns Instance of `GovernanceContract`
     */
    getGovernance() {
        return new _1.GovernanceContract(this);
    }
    /**
     * Instantiates a simple class to read blockchain balances
     * @returns Instance of `BalanceGetter`
     */
    getBalances() {
        return new balance_1.BalanceGetter(this);
    }
}
exports.EosdtConnector = EosdtConnector;
