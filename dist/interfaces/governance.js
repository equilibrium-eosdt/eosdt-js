"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storedProposalKeys = [
    "proposal_name",
    "proposer",
    "title",
    "proposal_json",
    "created_at",
    "expires_at",
    "proposal_type"
];
exports.proposeObjectKeys = [
    "proposer",
    "name",
    "title",
    "json",
    "expiresAt",
    "type"
];
exports.eosdtVoteKeys = [
    "id",
    "proposal_name",
    "updated_at",
    "voter",
    "vote",
    "vote_json"
];
exports.governanceSettingsKeys = [
    "setting_id",
    "position_account",
    "min_proposal_weight",
    "freeze_period",
    "min_participation",
    "success_margin",
    "top_holders_amount",
    "max_bp_count",
    "max_bp_votes",
    "min_vote_stake",
    "unstake_period",
    "min_reward",
    "reward_weight"
];
exports.governanceParametersKeys = ["NUT_voting_balance", "param_id"];
exports.bpVotesKeys = ["producer", "votes"];
exports.voterInfoKeys = ["voter", "voting_amount", "withdrawal_date"];
exports.eosVoterInfoKeys = [
    "owner",
    "proxy",
    "producers",
    "staked",
    "last_vote_weight",
    "proxied_vote_weight",
    "is_proxy",
    "flags1",
    "reserved2",
    "reserved3"
];
exports.bpPositionKeys = [
    "bp_name",
    "reward_amount",
    "balance",
    "enabled",
    "is_active",
    "active_since"
];
