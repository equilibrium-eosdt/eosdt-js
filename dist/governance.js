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
exports.GovernanceContract = void 0;
const governance_1 = require("./interfaces/governance");
const utils_1 = require("./utils");
/**
 * A class to work with EOSDT Governance contract (`eosdtgovernc`)
 */
class GovernanceContract {
    /**
     * Creates an instance of `GovernanceContract`
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector) {
        this.rpc = connector.rpc;
        this.api = connector.api;
        this.contractName = "eosdtgovernc";
    }
    /**
     * Creates a proposal
     * @param {object} proposal
     * @param {string} proposal.proposer
     * @param {string} proposal.name
     * @param {string} proposal.title
     * @param {string} proposal.json
     * @param {Date} proposal.expiresAt
     * @param {number} proposal.type
     * @param {string} senderName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    propose(proposal, senderName, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "propose",
                        authorization,
                        data: {
                            proposer: proposal.proposer,
                            proposal_name: proposal.name,
                            title: proposal.title,
                            proposal_json: proposal.json,
                            expires_at: utils_1.dateToEosDate(proposal.expiresAt),
                            proposal_type: proposal.type
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
     * Expires an active proposal
     * @param {string} proposalName
     * @param {string} senderName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    expire(proposalName, senderName, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "expire",
                        authorization,
                        data: { proposal_name: proposalName }
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
     * Applies proposed changes. At least 51% of all issued NUT tokens must vote, at least 55%
     * of votes must be for proposal
     * @param {string} proposalName
     * @param {string} senderName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    applyChanges(proposalName, senderName, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "apply",
                        authorization,
                        data: { proposal_name: proposalName }
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
     * Removes specified amount of votes from an expired proposal. If 0 votes left, removes proposal
     * @param {string} proposalName
     * @param {number} deletedVotes
     * @param {string} senderName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    cleanProposal(proposalName, deletedVotes, senderName, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: senderName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "clnproposal",
                        authorization,
                        data: {
                            proposal_name: proposalName,
                            max_count: deletedVotes
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
     * Sends NUT tokens to contract, staking them and allowing to vote for block producers and for
     * proposals
     * @param {string} senderName
     * @param {string | number} nutsAmount
     * @param {string} [trxMemo]
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    stake(senderName, nutsAmount, trxMemo, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const nutAssetString = utils_1.amountToAssetString(nutsAmount, "NUT");
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
                            memo: trxMemo ? trxMemo : "eosdt-js stake()"
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
     * Unstakes NUT tokens to user's balance
     * @param {string | number} nutAmount
     * @param {string} voterName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    unstake(nutAmount, voterName, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const nutAssetString = utils_1.amountToAssetString(nutAmount, "NUT");
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: voterName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "unstake",
                        authorization,
                        data: {
                            voter: voterName,
                            quantity: nutAssetString
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
     * Vote for or against a proposal
     * @param {string} proposalName
     * @param {number} vote Vote `1` as "yes", `0` or any other number as "no"
     * @param {string} voterName
     * @param {string} voteJson
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    vote(proposalName, vote, voterName, voteJson, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: voterName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "vote",
                        authorization,
                        data: {
                            voter: voterName,
                            proposal_name: proposalName,
                            vote,
                            vote_json: voteJson
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
     * Removes all user votes from a proposal
     * @param {string} proposalName
     * @param {string} voterName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    unvote(proposalName, voterName, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: voterName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "unvote",
                        authorization,
                        data: {
                            voter: voterName,
                            proposal_name: proposalName
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
     * Votes with staked NUTs for block producers
     * @param {string} voterName
     * @param {string[]} producers
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    voteForBlockProducers(voterName, producers, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const vote_json = JSON.stringify({ "eosdtbpproxy.producers": producers });
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: voterName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "vote",
                        authorization,
                        data: {
                            voter: voterName,
                            proposal_name: "blockproduce",
                            vote: 1,
                            vote_json
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
     * Stakes NUTs and votes for BPs in one transaction
     * @param {string} voterName
     * @param {string | number} nutAmount
     * @param {string[]} producers
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    stakeAndVoteForBlockProducers(voterName, nutAmount, producers, transactionParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const nutAssetString = utils_1.amountToAssetString(nutAmount, "NUT");
            const voter = voterName;
            const vote_json = JSON.stringify({ "eosdtbpproxy.producers": producers });
            const trxParams = utils_1.setTransactionParams(transactionParams);
            const authorization = [{ actor: voterName, permission: trxParams.permission }];
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: "eosdtnutoken",
                        name: "transfer",
                        authorization,
                        data: {
                            from: voterName,
                            to: this.contractName,
                            quantity: nutAssetString,
                            memo: ""
                        }
                    },
                    {
                        account: this.contractName,
                        name: "vote",
                        authorization,
                        data: {
                            voter,
                            proposal_name: "blockproduce",
                            vote: 1,
                            vote_json
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
     * @returns {Promise<object | undefined>} Amount of NUTs staked by account in Governance
     * contract and their unstake date
     */
    getVoterInfo(accountName) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                table: "govvoters",
                scope: this.contractName,
                lower_bound: accountName,
                upper_bound: accountName
            });
            return utils_1.validateExternalData(table.rows[0], "voter info", governance_1.voterInfoKeys, true);
        });
    }
    /**
     * @returns {Promise<object[]>} Table of information on accounts that staked NUT
     */
    getVoterInfosTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                table: "govvoters",
                scope: this.contractName,
                limit: 100000
            });
            return utils_1.validateExternalData(table.rows, "voter info", governance_1.voterInfoKeys);
        });
    }
    /**
     * @returns {Promise<object[]>} An array with all Governance contract votes (up to 10000)
     */
    getVotes() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "votes",
                limit: 10000
            });
            return utils_1.validateExternalData(table.rows, "eosdt vote", governance_1.eosdtVoteKeys);
        });
    }
    /**
     * @returns {Promise<object[]>} All account votes
     */
    getVotesForAccount(accountName) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "votes",
                limit: 1000
            });
            return utils_1.validateExternalData(table.rows, "eosdt vote", governance_1.eosdtVoteKeys).filter((vote) => vote.voter === accountName);
        });
    }
    /**
     * @returns {Promise<object[]>} An array with all Governance contract proposals (up to 10000)
     */
    getProposals() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "proposals",
                limit: 10000
            });
            return utils_1.validateExternalData(table.rows, "stored proposal", governance_1.storedProposalKeys);
        });
    }
    /**
     * @returns {Promise<object[]>} Array of objects, containing block producers names and
     * amount of NUT votes for them
     */
    getBpVotes() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "bpvotes",
                limit: 1000
            });
            return utils_1.validateExternalData(table.rows, "bp votes", governance_1.bpVotesKeys);
        });
    }
    /**
     * @returns {Promise<object | undefined>} Voter info for `eosdtbpproxy`
     */
    getProxyInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: "eosio",
                scope: "eosio",
                table: "voters",
                lower_bound: "eosdtbpproxy",
                upper_bound: "eosdtbpproxy"
            });
            return utils_1.validateExternalData(table.rows[0], "eos voter info", governance_1.eosVoterInfoKeys, true);
        });
    }
    /**
     * @returns {Promise<object>} Governance contract settings
     */
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "govsettings"
            });
            return utils_1.validateExternalData(table.rows[0], "governance settings", governance_1.governanceSettingsKeys);
        });
    }
    /**
     * @returns {Promise<object>} Governance contract parameters
     */
    getParameters() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "govparams"
            });
            return utils_1.validateExternalData(table.rows[0], "governance parameters", governance_1.governanceParametersKeys);
        });
    }
}
exports.GovernanceContract = GovernanceContract;
