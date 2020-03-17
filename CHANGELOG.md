# Changelog

All notable changes will be documented in this file.

#### [0.7.2] - 2020-03-12

-   Update with validation and interfaces fix

-   `Positions` methods renamed:
    -   `createInThreeActions` renamed to `createWhenPositionsExist`
    -   `getContractTokenAmount` renamed to `getContractTokenBalance`
    -   `getContractEosAmount` renamed to `getContractEosBalance`

-   `Positions` updated interface `TokenRate`: new field `id`

-   `Governance` updated interface `GovernanceParameters`: new parameter `param_id`

#### [0.7.1] - 2020-03-11

-   Update to validate data extracted from blockchain. Some new methods added

-   `Positions` added methods:
    -   `getAllPositions` - returns an array of all positions for all users.
    -   `paybackAndDelete` - if debt defined burn all available debt on position and delete it. Otherwise delete position.

-   `Positions` updated interface `TokenRate_deprecated`: fields `eosnationdsp_price`, `eosnationdsp_update` renamed to `delphioracle_price`, `delphioracle_update`

-   `Governance` updated interfaces:
    -   `GovernanceParameters`: changed `NUT_voting_balance` type from number to string 
    -   `GovernanceSettings`: removed settings `bpproxy_account`, `governc_account`

#### [0.7] - 2020-03-06

-   Update to support multicollateral contract changes

-   `Positions` added methods: 
    -   `createInThreeActions` - create position when creator already have positions.
    -   `getPositionByMaker` - returns a first position object, selecting it by maker name.
    -   `getLatestUserPosition` - returns latest position (with maximum id value), selecting it by maker name.
    -   `getLtvRatiosTable` - returns table of current LTV ratios for all positions.
    -   `getPositionLtvRatio` - returns current LTV ratio for position by id.

-   `Positions` interface `TokenRate` renamed to `TokenRate_deprecated`

-   `Positions` new interfaces:
    -   `TokenRate`
    -   `LtvRatios`

-   `Positions` new settings in interface `EosdtContractSettings`:
    -   `collateral_account`
    -   `collateral_token`

-   `Liquidator` added methods:
    -   `getSettings` - returns liquidator contract settings.
    -   `getNutCollatBalance` - returns amount of nut_collateral on liquidator contract balance.

-   `Liquidator` updated methods:
    -   `marginCallAndBuyoutCollat` instead of `marginCallAndBuyoutEos`
    -   `getCollatBalance` instead of `getEosBalance`
    -   `transferEos` removed

-   `Liquidator` updated interface `LiquidatorParameters`: `eos_balance` renamed to `collat_balance`

-   `Liquidator` new interface: `LiquidatorSettings`

-   `Governance` added methods:
    -   `getParameters` - returns Governance contract parameters.
    -   `getVotesForAccount` - returns an array with all votes for voter, selecting it by name.

-   `Governance` updated interface `GovernanceSettings`: `eosdtcntract_account` renamed to `position_account` 

-   `Governance` new interface `GovernanceParameters`

#### [0.6.38] - 2020-03-04

-   Updated `Positions` following methods due to contracts update
    -   `getContractEosBalance` became deprecated
    -   `getContractTokenBalance` instead of `getContractEosBalance`
    -   `getRates` became deprecated
    -   `getRelativeRates` instead of `getRates` updated to work with new table `oraclerates`

#### [0.6.37] - 2019-11-20

-   Added `BpManager` with following methods to help manage block producers positions
    -   `getBpPosition()`
    -   `getAllBpPositions()`
    -   `registerBlockProducer()`
    -   `changeBlockProducerReward()`
    -   `unRegisterBlockProducer()`
    -   `depositEos()`

-   `Governance`: new settings in interface `GovernanceSettings`
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
