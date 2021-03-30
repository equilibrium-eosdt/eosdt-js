# Changelog

All notable changes will be documented in this file.

### [1.3.6] - 2021-03-30 - No changes

Update just to increment npm version

### [1.3.5] - 2021-03-29 - Updates for 'pricefeed.eq' contract

A new table 'newrates' was added to 'pricefeed.eq' contract, it contains Equilibrium prices feed data. Previously you could use `getRates` on `BasicPositionsContract` to get system rates. This works same as before, but now you can also use `getRatesNew`. Property `rate` property would be the same in both old and new `TokenRate` objects, but `TokenRateNew` contains more system data.

-   New interface added: `TokenRateNew`
-   Added method `getRatesNew` to `BasicPositionsContract`

### [1.3.4] - 2021-03-15 - Optional argument is now interface with contract data

Default behavior didn't change. If it is needed to explicitly configure contract - use optional argument.
Contract that support optional argument configuration:

-   `BasicPositionsContract`
-   `PositionsContract`
-   `TokenSwapContract`
-   `LiquidatorContract`

#### [1.3.3] - 2021-03-11 - Optional argument added to main positions contract

Default contract name didn't change. If optional argument is not stated mainnet contract name is used.
Contract that now support two networks names:

-   `PositionsContract`

#### [1.3.2] - 2021-03-11 - Added optional argument for different networks contracts names

Default contracts names didn't change. If optional argument is not stated mainnet contract name is used.
Contracts that now support two networks names:

-   `TokenSwapContract`
-   `LiquidatorContract`
-   `BasicPositionsContract`

#### [1.3.1] - 2020-11-05 - Added support for PETH positions contracts

-   `EosdtConnector` can now construct adapters to work with PETH positions and liquidator contracts. `BasicPositionsContract` and `LiquidatorContract` can now be instantiated with PETH as collateral token.
-   Function `getPeth` added to `BalanceGetter`
-   Util function `amountToAssetString` now supports PETH tokens.

#### [1.2.1] - 2020-08-27 - Updated wrappers for 'tokenswap.eq' contract

-   Updated `TokenswapContract` wrapper.
    Both methods accept string with prefix "0x", without prefix and with spaces on any side: - `transferNut` method now doesn't have limitations for Ethereum address in memo - `claim` method now doesn't have limitations for Ethereum signature in parameters

#### [1.2.0] - 2020-08-19 - Added wrappers for 'tokenswap.eq' contract

#### and updated liquidator and positions contracts

-   Updated to support liquidator and position contracts changes
-   `Liquidator` updated interface `LiquidatorSettings`: field `set_aside_rate` renamed to `tokenswap_rate`
-   `BasicPositionsContract` updated interface `PosContractSettings`: new field `tokenswap_account`

-   Added `TokenswapContract` wrapper and method to create instance of it to `EosdtConnector`.
    It is used to interact with contract `tokenswap.eq`: - `getParameters` method to get contract parameters - `getSettings` method to get contract settings - `getAllPositions` method to get array of all positions created on contract - `transferNut` method to transfer NUT to contract with Ethereum address in memo - `claim` method to get back NUT and verify Ethereum signature

-   `Tokenswap` new interfaces:
    -   `TokenswapContractParams`
    -   `TokenswapContractSettings`
    -   `TokenswapPositions`

#### [1.1.0] - 2020-07-15 - Added wrappers for 'arm.eq' contract

Added `ArmContract` as an export, added method to create instance of it to `EosdtConnector`

#### [1.0.0] - 2020-06-09 - Position creation changes

Positions creation changed to enable creating a new position by transferring collateral, even if maker already has a position. This resulted in following changes in `BasicPositionsContract` and `PositionsContract`

-   method `create` removed
-   method `createWhenPositionsExist` removed
-   method `createWithReferral` removed
-   new method `newPosition`. It can be used to create position with any amount of debt and some collateral
-   to create new empty position use method `createEmptyPosition`
-   EOS positions with referral can now only be created with `newEmptyPositionWithRef`. It creates empty position and requires adding debt and collateral as separate actions.

Also, `BpManager` method `registerBlockProducer` updated. It is now an EOS transfer, not `eosdtgovernc` action

#### [0.9.2] - 2020-04-28 - PBTC collateral positions

-   Positions contracts wrappers split into 2 different classes:
    -   `BasicPositionsContract` - used for non-EOS collateral positions management. Currently only for PBTC collateral contract `eosdtpbtcpos`. Can be initiated directly of through `EosdtConnector`.
    -   `PositionsContract` - used for positions contract `eosdtcntract`. It is backward compatible. `PositionsContract` extends `BasicPositionsContract` and includes all it's methods.
-   Method `addCollatAndDebt` added to positions contracts wrapper classes.
-   Liquidator wrapper class now can be initiated with `collateralToken` argument. `EOS` is used by default. If you use `PBTC` it would work with PBTC-based liquidator (contract `eosdtpbtcliq`)
-   `PositionsContract` and `BasicPositionsContract` method `create` now works with O EOSDT
-   Added TypeScript interfaces for contract `BasicPositionsContract`:
    -   BasicEosdtPosition
    -   BasicEosdtPosSettings
    -   BasicEosdtPosParameters
-   Removed `PositionsContract` deprecated method `getContractEosBalance`. Use `getContractTokenBalance` instead
-   `PositionsContract` method `getRates` now works with updated rates object (TS interface TokenRate), method `getRelativeRates` is now deprecated and works as an alias of `getRates`
-   Deprecated interface `TokenRate_deprecated` removed
-   Readme now has detailed documentation

#### [0.8.0] - 2020-04-20

-   Added `SavingsRateContract` wrapper. It is used to interact with contract `eosdtsavings`:
    -   `stake` and `unstake` methods to stake EOSDT to contract
    -   `getParameters` to get contract total discounted balance
    -   `getSettings` to get contract settings
    -   3 position getters to get information about staked EOSDT (all stakes/unstakes of a user are represented with a position)
-   Added method `getSavingsRateCont` to `EosdtConnector`. It returns an instance of `SavingsRateContract`
-   Liquidator and Positions contracts settings updated to include Savings Rate settings.
-   Package exports specified. All internal exports removed
-   Interface `TokenRate_deprecated` removed
-   Previously deprecated `Positions` method `getRates` now works the same as `getRelativeRates` and they both return table `oraclerates` of the contract `eosdtorclize`. Method `getRelativeRates` would be removed in future updates, please, use `getRates`.

#### [0.7.21] - 2020-03-30

-   Updated to support governance changes

-   `Governance` updated interfaces:
    -   `GovernanceParameters`: new parameter `min_reward`,
    -   `GovernanceSettings` removed setting `min_reward`, added `stake_reward`

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

-   `PositionsContract` method `getPositionReferralsTable()` fixed for big ids

#### [0.6.2] - 2019-10-11

-   `PositionsContract.createEmptyPosition()` - removed. To create empty position, use `create()` or `createWithReferral()` with `eosAmount` equal to zero
-   `PositionsContract`: added methods to work with referrals :
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
