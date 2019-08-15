"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class GovernanceContract {
    constructor(connector) {
        this.rpc = connector.rpc;
        this.api = connector.api;
        this.contractName = "eosdtgovernc";
    }
    propose(proposal, sender) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!sender)
                sender = proposal.proposer;
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "propose",
                        authorization: [{ actor: sender, permission: "active" }],
                        data: {
                            proposer: proposal.proposer,
                            proposal_name: proposal.name,
                            title: proposal.title,
                            proposal_json: proposal.json,
                            expires_at: utils_1.toEosDate(proposal.expiresAt),
                            proposal_type: proposal.type
                        }
                    }
                ]
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    expire(proposalName, creator) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "expire",
                        authorization: [{ actor: creator, permission: "active" }],
                        data: {
                            proposal_name: proposalName
                        }
                    }
                ]
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    applyChanges(proposalName, fromAccount) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "apply",
                        authorization: [{ actor: fromAccount, permission: "active" }],
                        data: {
                            proposal_name: proposalName
                        }
                    }
                ]
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    cleanProposal(proposalName, deletedVotes, actor) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "clnproposal",
                        authorization: [{ actor, permission: "active" }],
                        data: {
                            proposal_name: proposalName,
                            max_count: deletedVotes
                        }
                    }
                ]
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    stake(sender, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            amount = utils_1.toBigNumber(amount);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: "eosdtnutoken",
                        name: "transfer",
                        authorization: [{ actor: sender, permission: "active" }],
                        data: {
                            from: sender,
                            to: this.contractName,
                            quantity: `${amount.toFixed(9)} NUT`,
                            memo: ""
                        }
                    }
                ]
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    stakeAndVote(sender, amount, producers) {
        return __awaiter(this, void 0, void 0, function* () {
            amount = utils_1.toBigNumber(amount);
            const voter = sender;
            const vote_json = JSON.stringify({ "eosdtbpproxy.producers": producers });
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: "eosdtnutoken",
                        name: "transfer",
                        authorization: [{ actor: sender, permission: "active" }],
                        data: {
                            from: sender,
                            to: this.contractName,
                            quantity: `${amount.toFixed(9)} NUT`,
                            memo: ""
                        }
                    },
                    {
                        account: this.contractName,
                        name: "vote",
                        authorization: [{ actor: voter, permission: "active" }],
                        data: {
                            voter,
                            proposal_name: "blockproduce",
                            vote: 1,
                            vote_json
                        }
                    }
                ]
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    getVoterInfo(accountName) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.rpc.get_table_rows({
                code: this.contractName,
                table: "voters",
                scope: accountName
            });
            return result.rows[0];
        });
    }
    unstake(amount, voter) {
        return __awaiter(this, void 0, void 0, function* () {
            amount = utils_1.toBigNumber(amount);
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "unstake",
                        authorization: [{ actor: voter, permission: "active" }],
                        data: {
                            voter,
                            quantity: `${amount.toFixed(9)} NUT`
                        }
                    }
                ]
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    vote(proposalName, vote, voter, voteJson) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "vote",
                        authorization: [{ actor: voter, permission: "active" }],
                        data: {
                            voter,
                            proposal_name: proposalName,
                            vote,
                            vote_json: voteJson
                        }
                    }
                ]
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    voteForBlockProducers(voter, ...producers) {
        return __awaiter(this, void 0, void 0, function* () {
            const vote_json = JSON.stringify({ "eosdtbpproxy.producers": producers });
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "vote",
                        authorization: [{ actor: voter, permission: "active" }],
                        data: {
                            voter,
                            proposal_name: "blockproduce",
                            vote: 1,
                            vote_json
                        }
                    }
                ]
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    unvote(proposalName, voter) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.api.transact({
                actions: [
                    {
                        account: this.contractName,
                        name: "unvote",
                        authorization: [{ actor: voter, permission: "active" }],
                        data: {
                            voter,
                            proposal_name: proposalName
                        }
                    }
                ]
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "govsettings",
                json: true,
                limit: 1
            });
            return table.rows[0];
        });
    }
    getProposals() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "proposals",
                json: true,
                limit: 1000
            });
            return table.rows;
        });
    }
    getVotes() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName,
                scope: this.contractName,
                table: "votes",
                json: true,
                limit: 1000
            });
            return table.rows;
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
            return table.rows;
        });
    }
}
exports.GovernanceContract = GovernanceContract;
