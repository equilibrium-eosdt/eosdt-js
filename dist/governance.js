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
class GovernanceContract {
    constructor(connector) {
        this.rpc = connector.rpc;
        this.api = connector.api;
        this.contractName = "eosdtgovernc";
    }
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
    stake(senderName, nutAmount, trxMemo, transactionParams) {
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
    getVotes() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "votes",
                limit: 1000
            });
            return utils_1.validateExternalData(table.rows, "eosdt vote", governance_1.eosdtVoteKeys);
        });
    }
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
    getProposals() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "proposals",
                limit: 1000
            });
            return utils_1.validateExternalData(table.rows, "stored proposal", governance_1.storedProposalKeys);
        });
    }
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
