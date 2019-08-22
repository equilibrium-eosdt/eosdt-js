# Changelog

All notable changes will be documented in this file.

#### [0.6.0] - 2019-08-22

-   All action sending methods now have `transactionParams` optional argument. It may be used to overwrite transaction's parameters `permission`, `blocksBehind` and `expireSeconds`.
-   Renamed `GovernanceContract.stakeAndVote()` to `GovernanceContract.stakeAndVoteForBlockProducers()`
-   New method `GovernanceContract.getProxyInfo()`
-   `GovernanceContract.propose()` now requires `senderName` argument
-   Removed rounding EOSDT asset amounts to 4th decimal
-   Removed JSON-RPC argument `json: true` from `get_table_rows` requests
-   JSON-RPC argument `limit` was increased for some `get_table_rows` requests
