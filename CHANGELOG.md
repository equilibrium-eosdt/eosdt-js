# Changelog

All notable changes will be documented in this file.

#### [0.6.4] - 2020-03-06

-   Update to support multicollateral contract changes

-   `Positions` added methods
-   `createInThreeActions`
-   `getPositionByMaker`
-   `getLatestUserPosition`
-   `getLtvRatiosTable`
-   `getPositionLtvRatio`

-   `Liquidator` added methods
-   `getSettings`
-   `getNutCollatBalance`

-   `Liquidator` updated methods
-   `marginCallAndBuyoutCollat` instead of `marginCallAndBuyoutEos`
-   `getCollatBalance` instead of `getEosBalance`
-   `transferEos` removed

-   `Governance` added methods
-   `getParameters`
-   `getVotesForAccount`

-   New `Positions` interfaces
-   `TokenRate`
-   `LtvRatios`

-   New `Positions` settings in interface `EosdtContractSettings` 
-   `collateral_account`
-   `collateral_token`

-   Updated `Positions` interfaces
-   `TokenRate_deprecated` instead of old `TokenRate`

-   New `Liquidator` interface `LiquidatorSettings` 

-   Updated `Liquidator` parameters in interface `LiquidatorParameters`
-   `collat_balance` instead of old `eos_balance`

-   New `Governance` interfaces
-   `GovernanceParameters`

-   Updated `Governance` settings in interface `GovernanceSettings`
-   `position_account` instead of old `eosdtcntract_account`

#### [0.6.38] - 2020-03-04

-   Updated `Positions` following methods due to contracts update

-   `getContractEosAmount` become deprecated
-   `getContractTokenAmount` instead of `getContractEosAmount`
-   `getRates` become deprecated
-   `getRelativeRates` instead of `getRates` updated to work with new table `oraclerates`

#### [0.6.37] - 2019-11-20

-   Added `BpManager` with following methods to help manage block producers positions

-   `getBpPosition()`
-   `getAllBpPositions()`
-   `registerBlockProducer()`
-   `changeBlockProducerReward()`
-   `unRegisterBlockProducer()`
-   `depositEos()`

-   New governance settings

-   `min_reward`
-   `reward_weight`

-   `PostionsContract` method `getPositionReferralsTable()` fixed for big ids

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
