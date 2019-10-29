# Changelog

All notable changes will be documented in this file.

#### [0.6.2] - 2019-10-11

-   `PostionsContract.createEmptyPosition()` - removed. To create empty position, use `create()` or `createWithReferral()` with `eosAmount` equal to zero
-   `PostionsContract`: added methods to work with referrals :
    -   `addReferral()`
    -   `deleteReferral()`
    -   `getReferralById()`
    -   `getAllReferrals()`
    -   `getReferralByName()`
    -   `getPositionReferral()`
    -   `getPositionReferralsTable()`
    -   `getAllReferralPositionsIds()`
-   Util function `balanceToNumber` fixed for undefined balances
-   `GovernanceContract.getVoterInfo()` updated to work with new table `govvoters`
-   Added method `getVoterInfosTable` to `GovernanceContract`. It returns the whole table of information on accounts that staked NUT at EOSDT governance contract

#### [0.6.1] - 2019-08-22

-   All action sending methods now have `transactionParams` optional argument. It may be used to overwrite transaction's parameters `permission`, `blocksBehind` and `expireSeconds`.
-   Renamed `GovernanceContract.stakeAndVote()` to `GovernanceContract.stakeAndVoteForBlockProducers()`
-   `GovernanceContract.voteForBlockProducers()` now requires Block Producers names to be an array.
-   New method `GovernanceContract.getProxyInfo()`
-   `GovernanceContract.propose()` now requires `senderName` argument
-   Removed rounding EOSDT asset amounts to 4th decimal
-   Removed JSON-RPC argument `json: true` from `get_table_rows` requests
-   JSON-RPC argument `limit` was increased for some `get_table_rows` requests
