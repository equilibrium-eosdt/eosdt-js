"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
class Governance {
    constructor(connector) {
        this.rpc = connector.rpc;
        this.api = connector.api;
        this.contractName = "eosdtgovernc";
    }
    propose(proposalName, title, proposalJson, expire, creatorName) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.api.transact({
                actions: [{
                        account: this.contractName,
                        name: "propose",
                        authorization: [{ actor: creatorName, permission: "active" }],
                        data: {
                            proposer: creatorName,
                            proposal_name: proposalName,
                            title,
                            proposal_json: proposalJson,
                            expires_at: expire
                        },
                    }],
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
                actions: [{
                        account: this.contractName,
                        name: "expire",
                        authorization: [{ actor: creator, permission: "active" }],
                        data: {
                            proposal_name: proposalName
                        },
                    }],
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
                actions: [{
                        account: this.contractName,
                        name: "apply",
                        authorization: [{ actor: fromAccount, permission: "active" }],
                        data: {
                            proposal_name: proposalName
                        },
                    }],
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
                actions: [{
                        account: this.contractName,
                        name: "clnproposal",
                        authorization: [{ actor, permission: "active" }],
                        data: {
                            proposal_name: proposalName,
                            max_count: deletedVotes
                        },
                    }],
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    stake(sender, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof amount === "string" || typeof amount === "number") {
                amount = new bignumber_js_1.default(amount);
            }
            const receipt = yield this.api.transact({
                actions: [{
                        account: "eosdtnutoken",
                        name: "transfer",
                        authorization: [{ actor: sender, permission: "active" }],
                        data: {
                            from: sender,
                            to: this.contractName,
                            quantity: `${amount.toFixed(9)} NUT`,
                            memo: "",
                        },
                    }],
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    unstake(amount, voter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof amount === "string" || typeof amount === "number") {
                amount = new bignumber_js_1.default(amount);
            }
            const receipt = yield this.api.transact({
                actions: [{
                        account: this.contractName,
                        name: "unstake",
                        authorization: [{ actor: voter, permission: "active" }],
                        data: {
                            voter,
                            quantity: `${amount.toFixed(9)} NUT`,
                        },
                    }],
            }, {
                blocksBehind: 3,
                expireSeconds: 60
            });
            return receipt;
        });
    }
    vote(proposalName, vote, voter) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.api.transact({
                actions: [{
                        account: this.contractName,
                        name: "vote",
                        authorization: [{ actor: voter, permission: "active" }],
                        data: {
                            voter,
                            proposal_name: proposalName,
                            vote
                        },
                    }],
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
                actions: [{
                        account: this.contractName,
                        name: "unvote",
                        authorization: [{ actor: voter, permission: "active" }],
                        data: {
                            voter,
                            proposal_name: proposalName,
                        },
                    }],
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
                code: this.contractName, scope: this.contractName, table: "settings", json: true,
                limit: 1
            });
            return table.rows[0];
        });
    }
    getProposals() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName, scope: this.contractName, table: "proposals", json: true,
                limit: 1000
            });
            return table.rows;
        });
    }
    getVotes() {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.rpc.get_table_rows({
                code: this.contractName, scope: this.contractName, table: "votes", json: true,
                limit: 1000
            });
            return table.rows;
        });
    }
}
exports.Governance = Governance;
