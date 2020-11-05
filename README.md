# EOSDT JS

[![view on npm](http://img.shields.io/npm/v/@eosdt/eosdt-js)](https://www.npmjs.com/package/@eosdt/eosdt-js)

A JavaScript library to execute EOSDT contracts methods.

## Usage

Install the module using NPM:

```bash
$ npm install @eosdt/eosdt-js
```

Use service module `Connector` to initiate one of functional modules. `Connector` uses EOS node address and an array of private keys. Transactions would be signed with given keys and sent to blockchain through given node.

```Javascript
const { EosdtConnector } = require("@eosdt/eosdt-js")

const nodeAddress = "http://node-address.example.com:80"

const connector = new EosdtConnector(nodeAddress, ["private-key-1", "private-key-2"])

const eosPositions = connector.getPositions()
const eosLiquidator = connector.getLiquidator()

const pbtcPositions = connector.getBasicPositions("PBTC")
const pbtcLiquidator = connector.getLiquidator("PBTC")

const pethPositions = connector.getBasicPositions("PETH")
const pethLiquidator = connector.getLiquidator("PETH")

const governance = connector.getGovernance()
const balances = connector.getBalances()
const savings = connector.getSavingsRate()
```

Fore more code examples, checkout `examples` folder.

# Modules documentation

<a name="ITrxParamsArgument"></a>

## ITrxParamsArgument

<p>This object is used as optional argument in each method that sends actions to blockchain. Use it to manage transaction and action parameters.</p>
<p>This object has following properties:</p>

| Property        | Type                | Description                                                       |
| --------------- | ------------------- | ----------------------------------------------------------------- |
| [permission]    | <code>string</code> | <p>Name of permission, <code>active</code> is used by default</p> |
| [blocksBehind]  | <code>number</code> | <p>Default value is <code>3</code></p>                            |
| [expireSeconds] | <code>number</code> | <p>Default value is <code>60</code></p>                           |

## Classes

<dl>
<dt><a href="#ArmContract">ArmContract</a></dt>
<dd><p>Module to manage EOSDT arming operations</p></dd>
<dt><a href="#BalanceGetter">BalanceGetter</a></dt>
<dd><p>Module to get account's balances of EOSDT, EOS, PBTC, PETH and NUT</p></dd>
<dt><a href="#BasicPositionsContract">BasicPositionsContract</a></dt>
<dd><p>Module to manage EOSDT positions with non-EOS collateral</p></dd>
<dt><a href="#BpManager">BpManager</a></dt>
<dd><p>Class for EOSDT Governance actions, related to block producers management</p></dd>
<dt><a href="#EosdtConnector">EosdtConnector</a></dt>
<dd><p>A connector object, used to build classes to work with EOSDT ecosystem contracts</p></dd>
<dt><a href="#GovernanceContract">GovernanceContract</a></dt>
<dd><p>A class to work with EOSDT Governance contract (<code>eosdtgovernc</code>)</p></dd>
<dt><a href="#LiquidatorContract">LiquidatorContract</a></dt>
<dd><p>A class to work with EOSDT Liquidator contract. Creates EOS liquidator by default</p></dd>
<dt><a href="#PositionsContract">PositionsContract</a></dt>
<dd><p>Module to manage EOS-collateral positions (on contract <code>eosdtcntract</code>). It is inherited from
<code>BasicPositionsContract</code> and includes all it's methods.</p></dd>
<dt><a href="#SavingsRateContract">SavingsRateContract</a></dt>
<dd><p>A wrapper class to invoke actions of Equilibrium Savings Rate contract</p></dd>
<dt><a href="#TokenSwapContract">TokenSwapContract</a></dt>
<dd><p>A wrapper class to invoke actions of Equilibrium Token Swap contract</p></dd>
</dl>

<a name="ArmContract"></a>

## ArmContract

<p>Module to manage EOSDT arming operations</p>

**Kind**: global class

-   [ArmContract](#ArmContract)
    -   [.armEos(accountName, amount, arm, [transactionParams])](#ArmContract+armEos) ⇒ <code>Promise</code>
    -   [.armExistingEosPosition(owner, positionId, arm, [transactionParams])](#ArmContract+armExistingEosPosition) ⇒ <code>Promise</code>
    -   [.dearmEosPosition(owner, positionId, debtTarget, [transactionParams])](#ArmContract+dearmEosPosition) ⇒ <code>Promise</code>
    -   [.getSettings()](#ArmContract+getSettings) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="ArmContract+armEos"></a>

### armContract.armEos(accountName, amount, arm, [transactionParams]) ⇒ <code>Promise</code>

<p>Creates EOSDT position with given EOS, then sells received EOSDT to buy more EOS and add it
to position. Contract would continue for 20 iterations or until given arm is reached</p>

**Kind**: instance method of [<code>ArmContract</code>](#ArmContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                          |
| ------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------ |
| accountName         | <code>string</code>                        | <p>name of account that sends EOS and receives position</p>                          |
| amount              | <code>number</code> \| <code>string</code> | <p>transferred amount of EOS</p>                                                     |
| arm                 | <code>number</code>                        | <p>arm value. With arm = 2.1 and 100 EOS user will receive position with 210 EOS</p> |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p>         |

<a name="ArmContract+armExistingEosPosition"></a>

### armContract.armExistingEosPosition(owner, positionId, arm, [transactionParams]) ⇒ <code>Promise</code>

<p>Gives EOS-EOSDT position to 'arm.eq' contract and it arms that position (see <code>armEos</code>)</p>

**Kind**: instance method of [<code>ArmContract</code>](#ArmContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                          |
| ------------------- | ------------------- | ------------------------------------------------------------------------------------ |
| owner               | <code>string</code> | <p>name of position maker account</p>                                                |
| positionId          | <code>number</code> |                                                                                      |
| arm                 | <code>number</code> | <p>arm value. With arm = 2.1 and 100 EOS user will receive position with 210 EOS</p> |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p>         |

<a name="ArmContract+dearmEosPosition"></a>

### armContract.dearmEosPosition(owner, positionId, debtTarget, [transactionParams]) ⇒ <code>Promise</code>

<p>Reduces debt on position, selling it's collateral. Will stop, when position has LTV,
equal to critical LTV + arm safety margin. Excess EOSDT would be returned to maker acc
balance</p>

**Kind**: instance method of [<code>ArmContract</code>](#ArmContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| owner               | <code>string</code> | <p>name of maker account</p>                                                 |
| positionId          | <code>number</code> |                                                                              |
| debtTarget          | <code>number</code> | <p>approximate desired debt amount</p>                                       |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="ArmContract+getSettings"></a>

### armContract.getSettings() ⇒ <code>Promise.&lt;object&gt;</code>

**Kind**: instance method of [<code>ArmContract</code>](#ArmContract)  
**Returns**: <code>Promise.&lt;object&gt;</code> - <p>Positions contract settings</p>  
<a name="BalanceGetter"></a>

## BalanceGetter

<p>Module to get account's balances of EOSDT, EOS, PBTC, PETH and NUT</p>

**Kind**: global class

-   [BalanceGetter](#BalanceGetter)
    -   [new BalanceGetter(connector)](#new_BalanceGetter_new)
    -   [.getEos(account)](#BalanceGetter+getEos) ⇒ <code>Promise.&lt;number&gt;</code>
    -   [.getEosdt(account)](#BalanceGetter+getEosdt) ⇒ <code>Promise.&lt;number&gt;</code>
    -   [.getNut(account)](#BalanceGetter+getNut) ⇒ <code>Promise.&lt;number&gt;</code>
    -   [.getPbtc(account)](#BalanceGetter+getPbtc) ⇒ <code>Promise.&lt;number&gt;</code>
    -   [.getPeth(account)](#BalanceGetter+getPeth) ⇒ <code>Promise.&lt;number&gt;</code>

<a name="new_BalanceGetter_new"></a>

### new BalanceGetter(connector)

<p>Creates instance of <code>BalanceGetter</code></p>

| Param     | Description                                                                |
| --------- | -------------------------------------------------------------------------- |
| connector | <p>EosdtConnector (see <code>README</code> section <code>Usage</code>)</p> |

<a name="BalanceGetter+getEos"></a>

### balanceGetter.getEos(account) ⇒ <code>Promise.&lt;number&gt;</code>

**Kind**: instance method of [<code>BalanceGetter</code>](#BalanceGetter)  
**Returns**: <code>Promise.&lt;number&gt;</code> - <p>EOS balance of account</p>

| Param   | Type                | Description         |
| ------- | ------------------- | ------------------- |
| account | <code>string</code> | <p>Account name</p> |

<a name="BalanceGetter+getEosdt"></a>

### balanceGetter.getEosdt(account) ⇒ <code>Promise.&lt;number&gt;</code>

**Kind**: instance method of [<code>BalanceGetter</code>](#BalanceGetter)  
**Returns**: <code>Promise.&lt;number&gt;</code> - <p>EOSDT balance of account</p>

| Param   | Type                | Description         |
| ------- | ------------------- | ------------------- |
| account | <code>string</code> | <p>Account name</p> |

<a name="BalanceGetter+getNut"></a>

### balanceGetter.getNut(account) ⇒ <code>Promise.&lt;number&gt;</code>

**Kind**: instance method of [<code>BalanceGetter</code>](#BalanceGetter)  
**Returns**: <code>Promise.&lt;number&gt;</code> - <p>NUT balance of account</p>

| Param   | Type                | Description         |
| ------- | ------------------- | ------------------- |
| account | <code>string</code> | <p>Account name</p> |

<a name="BalanceGetter+getPbtc"></a>

### balanceGetter.getPbtc(account) ⇒ <code>Promise.&lt;number&gt;</code>

**Kind**: instance method of [<code>BalanceGetter</code>](#BalanceGetter)  
**Returns**: <code>Promise.&lt;number&gt;</code> - <p>PBTC balance of account</p>

| Param   | Type                | Description         |
| ------- | ------------------- | ------------------- |
| account | <code>string</code> | <p>Account name</p> |

<a name="BalanceGetter+getPeth"></a>

### balanceGetter.getPeth(account) ⇒ <code>Promise.&lt;number&gt;</code>

**Kind**: instance method of [<code>BalanceGetter</code>](#BalanceGetter)  
**Returns**: <code>Promise.&lt;number&gt;</code> - <p>PETH balance of account</p>

| Param   | Type                | Description         |
| ------- | ------------------- | ------------------- |
| account | <code>string</code> | <p>Account name</p> |

<a name="BasicPositionsContract"></a>

## BasicPositionsContract

<p>Module to manage EOSDT positions with non-EOS collateral</p>

**Kind**: global class

-   [BasicPositionsContract](#BasicPositionsContract)
    -   [new BasicPositionsContract(connector, tokenSymbol)](#new_BasicPositionsContract_new)
    -   [.newPosition(accountName, collatAmount, eosdtAmount, [transactionParams])](#BasicPositionsContract+newPosition) ⇒ <code>Promise</code>
    -   [.newEmptyPosition(maker, [transactionParams])](#BasicPositionsContract+newEmptyPosition)
    -   [.give(giverAccount, receiver, positionId, [transactionParams])](#BasicPositionsContract+give) ⇒ <code>Promise</code>
    -   [.addCollateral(senderName, amount, positionId, [transactionParams])](#BasicPositionsContract+addCollateral) ⇒ <code>Promise</code>
    -   [.deleteCollateral(senderName, amount, positionId, [transactionParams])](#BasicPositionsContract+deleteCollateral) ⇒ <code>Promise</code>
    -   [.generateDebt(senderName, amount, positionId, [transactionParams])](#BasicPositionsContract+generateDebt) ⇒ <code>Promise</code>
    -   [.burnbackDebt(senderName, amount, positionId, [transactionParams])](#BasicPositionsContract+burnbackDebt) ⇒ <code>Promise</code>
    -   [.addCollatAndDebt(senderName, addedCollatAmount, generatedDebtAmount, positionId, [transactionParams])](#BasicPositionsContract+addCollatAndDebt) ⇒ <code>Promise</code>
    -   [.pbtcDelCollatAndRedeem(senderName, amount, positionId, btcAddress, [transactionParams])](#BasicPositionsContract+pbtcDelCollatAndRedeem) ⇒ <code>Promise</code>
    -   [.marginCall(senderName, positionId, [transactionParams])](#BasicPositionsContract+marginCall) ⇒ <code>Promise</code>
    -   [.del(creator, positionId, [transactionParams])](#BasicPositionsContract+del) ⇒ <code>Promise</code>
    -   [.paybackAndDelete(maker, debtAmount, positionId, [transactionParams])](#BasicPositionsContract+paybackAndDelete) ⇒ <code>Promise</code>
    -   [.close(senderAccount, positionId, [transactionParams])](#BasicPositionsContract+close) ⇒ <code>Promise</code>
    -   [.getContractTokenBalance()](#BasicPositionsContract+getContractTokenBalance) ⇒ <code>Promise.&lt;number&gt;</code>
    -   [.getRates()](#BasicPositionsContract+getRates) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getLtvRatiosTable()](#BasicPositionsContract+getLtvRatiosTable) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getPositionLtvRatio(id)](#BasicPositionsContract+getPositionLtvRatio) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>
    -   [.getPositionById(id)](#BasicPositionsContract+getPositionById) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>
    -   [.getPositionByMaker(maker)](#BasicPositionsContract+getPositionByMaker) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>
    -   [.getAllUserPositions(maker)](#BasicPositionsContract+getAllUserPositions) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getAllPositions()](#BasicPositionsContract+getAllPositions) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getLatestUserPosition(accountName)](#BasicPositionsContract+getLatestUserPosition) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>
    -   [.getParameters()](#BasicPositionsContract+getParameters) ⇒ <code>Promise.&lt;object&gt;</code>
    -   [.getSettings()](#BasicPositionsContract+getSettings) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="new_BasicPositionsContract_new"></a>

### new BasicPositionsContract(connector, tokenSymbol)

<p>Creates an instance of <code>BasicPositionsContract</code></p>

| Param       | Type                | Description                                                                |
| ----------- | ------------------- | -------------------------------------------------------------------------- |
| connector   |                     | <p>EosdtConnector (see <code>README</code> section <code>Usage</code>)</p> |
| tokenSymbol | <code>string</code> | <p>&quot;PBTC&quot; or &quot;PETH&quot;</p>                                |

<a name="BasicPositionsContract+newPosition"></a>

### basicPositionsContract.newPosition(accountName, collatAmount, eosdtAmount, [transactionParams]) ⇒ <code>Promise</code>

<p>Creates new position, sending specified amount of collateral and issuing specified amount
of EOSDT to creator.</p>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| accountName         | <code>string</code>                        | <p>Creator's account name</p>                                                |
| collatAmount        | <code>string</code> \| <code>number</code> | <p>Amount of collateral tokens to transfer to position</p>                   |
| eosdtAmount         | <code>string</code> \| <code>number</code> | <p>EOSDT amount to issue</p>                                                 |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BasicPositionsContract+newEmptyPosition"></a>

### basicPositionsContract.newEmptyPosition(maker, [transactionParams])

<p>Creates new position with 0 debt and collateral</p>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| maker               | <code>string</code> | <p>Account to create position for</p>                                        |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BasicPositionsContract+give"></a>

### basicPositionsContract.give(giverAccount, receiver, positionId, [transactionParams]) ⇒ <code>Promise</code>

<p>Transfers position ownership to another account</p>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| giverAccount        | <code>string</code> | <p>Account name</p>                                                          |
| receiver            | <code>string</code> | <p>Account name</p>                                                          |
| positionId          | <code>number</code> |                                                                              |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BasicPositionsContract+addCollateral"></a>

### basicPositionsContract.addCollateral(senderName, amount, positionId, [transactionParams]) ⇒ <code>Promise</code>

<p>Sends collateral to position to increase it's collateralization.</p>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code>                        | <p>Account name</p>                                                          |
| amount              | <code>string</code> \| <code>number</code> | <p>Amount of added collateral</p>                                            |
| positionId          | <code>number</code>                        |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BasicPositionsContract+deleteCollateral"></a>

### basicPositionsContract.deleteCollateral(senderName, amount, positionId, [transactionParams]) ⇒ <code>Promise</code>

<p>Returns collateral from position, LTV must remain above critical for this action to work</p>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code>                        | <p>Account name</p>                                                          |
| amount              | <code>string</code> \| <code>number</code> |                                                                              |
| positionId          | <code>number</code>                        |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BasicPositionsContract+generateDebt"></a>

### basicPositionsContract.generateDebt(senderName, amount, positionId, [transactionParams]) ⇒ <code>Promise</code>

<p>Issues additional EOSDT if this does not bring position LTV below critical.</p>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code>                        | <p>Account name</p>                                                          |
| amount              | <code>string</code> \| <code>number</code> | <p>Not more than 4 significant decimals</p>                                  |
| positionId          | <code>number</code>                        |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BasicPositionsContract+burnbackDebt"></a>

### basicPositionsContract.burnbackDebt(senderName, amount, positionId, [transactionParams]) ⇒ <code>Promise</code>

<p>Transfers EOSDT to position to burn debt. Excess debt would be refunded to user account</p>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code>                        | <p>Account name</p>                                                          |
| amount              | <code>string</code> \| <code>number</code> | <p>Not more than 4 significant decimals</p>                                  |
| positionId          | <code>number</code>                        |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BasicPositionsContract+addCollatAndDebt"></a>

### basicPositionsContract.addCollatAndDebt(senderName, addedCollatAmount, generatedDebtAmount, positionId, [transactionParams]) ⇒ <code>Promise</code>

<p>Transfers collateral tokens to position and generates EOSDT debt</p>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code>                        | <p>Account name</p>                                                          |
| addedCollatAmount   | <code>string</code> \| <code>number</code> |                                                                              |
| generatedDebtAmount | <code>string</code> \| <code>number</code> |                                                                              |
| positionId          | <code>number</code>                        |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BasicPositionsContract+pbtcDelCollatAndRedeem"></a>

### basicPositionsContract.pbtcDelCollatAndRedeem(senderName, amount, positionId, btcAddress, [transactionParams]) ⇒ <code>Promise</code>

<p>Withdraws specified amount of PBTC tokens from position and redeems that PBTCs</p>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code>                        | <p>Account name</p>                                                          |
| amount              | <code>string</code> \| <code>number</code> |                                                                              |
| positionId          | <code>number</code>                        |                                                                              |
| btcAddress          | <code>string</code>                        |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BasicPositionsContract+marginCall"></a>

### basicPositionsContract.marginCall(senderName, positionId, [transactionParams]) ⇒ <code>Promise</code>

<p>Called on a position with critical LTV to perform a margin call</p>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code> | <p>Account name</p>                                                          |
| positionId          | <code>number</code> |                                                                              |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BasicPositionsContract+del"></a>

### basicPositionsContract.del(creator, positionId, [transactionParams]) ⇒ <code>Promise</code>

<p>Deletes position that has 0 debt.</p>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| creator             | <code>string</code> | <p>Account name</p>                                                          |
| positionId          | <code>number</code> |                                                                              |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BasicPositionsContract+paybackAndDelete"></a>

### basicPositionsContract.paybackAndDelete(maker, debtAmount, positionId, [transactionParams]) ⇒ <code>Promise</code>

<p>Burns debt on position and deletes it. Debt must be = 0 to delete position. Excess debt
would be refunded to user account</p>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| maker               | <code>string</code>                        | <p>Account name</p>                                                          |
| debtAmount          | <code>string</code> \| <code>number</code> | <p>Must be &gt; than position debt</p>                                       |
| positionId          | <code>number</code>                        |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BasicPositionsContract+close"></a>

### basicPositionsContract.close(senderAccount, positionId, [transactionParams]) ⇒ <code>Promise</code>

<p>Used to close a position in an event of global shutdown.</p>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| senderAccount       | <code>string</code> | <p>Account name</p>                                                          |
| positionId          | <code>number</code> |                                                                              |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BasicPositionsContract+getContractTokenBalance"></a>

### basicPositionsContract.getContractTokenBalance() ⇒ <code>Promise.&lt;number&gt;</code>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise.&lt;number&gt;</code> - <p>Contract's collateral asset balance.</p>  
<a name="BasicPositionsContract+getRates"></a>

### basicPositionsContract.getRates() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>Table of current system token prices (rates)</p>  
<a name="BasicPositionsContract+getLtvRatiosTable"></a>

### basicPositionsContract.getLtvRatiosTable() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>Table of current LTV ratios for all positions.</p>  
<a name="BasicPositionsContract+getPositionLtvRatio"></a>

### basicPositionsContract.getPositionLtvRatio(id) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise.&lt;(object\|undefined)&gt;</code> - <p>Current LTV ratio for position by id</p>

| Param | Type                | Description        |
| ----- | ------------------- | ------------------ |
| id    | <code>number</code> | <p>Position id</p> |

<a name="BasicPositionsContract+getPositionById"></a>

### basicPositionsContract.getPositionById(id) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise.&lt;(object\|undefined)&gt;</code> - <p>A position object</p>

| Param | Type                | Description        |
| ----- | ------------------- | ------------------ |
| id    | <code>number</code> | <p>Position id</p> |

<a name="BasicPositionsContract+getPositionByMaker"></a>

### basicPositionsContract.getPositionByMaker(maker) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise.&lt;(object\|undefined)&gt;</code> - <p>Position object - first position that belongs to
maker account</p>

| Param | Type                | Description         |
| ----- | ------------------- | ------------------- |
| maker | <code>string</code> | <p>Account name</p> |

<a name="BasicPositionsContract+getAllUserPositions"></a>

### basicPositionsContract.getAllUserPositions(maker) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>Array of all positions objects, created by the maker</p>

| Param | Type                | Description         |
| ----- | ------------------- | ------------------- |
| maker | <code>string</code> | <p>Account name</p> |

<a name="BasicPositionsContract+getAllPositions"></a>

### basicPositionsContract.getAllPositions() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>An array of all positions created on this contract</p>  
<a name="BasicPositionsContract+getLatestUserPosition"></a>

### basicPositionsContract.getLatestUserPosition(accountName) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise.&lt;(object\|undefined)&gt;</code> - <p>Position object - position of the account with
maximum id value</p>

| Param       | Type                |
| ----------- | ------------------- |
| accountName | <code>string</code> |

<a name="BasicPositionsContract+getParameters"></a>

### basicPositionsContract.getParameters() ⇒ <code>Promise.&lt;object&gt;</code>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise.&lt;object&gt;</code> - <p>Positions contract parameters</p>  
<a name="BasicPositionsContract+getSettings"></a>

### basicPositionsContract.getSettings() ⇒ <code>Promise.&lt;object&gt;</code>

**Kind**: instance method of [<code>BasicPositionsContract</code>](#BasicPositionsContract)  
**Returns**: <code>Promise.&lt;object&gt;</code> - <p>Positions contract settings</p>  
<a name="BpManager"></a>

## BpManager

<p>Class for EOSDT Governance actions, related to block producers management</p>

**Kind**: global class

-   [BpManager](#BpManager)
    -   [new BpManager(connector)](#new_BpManager_new)
    -   [.getAllBpPositions()](#BpManager+getAllBpPositions) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getBpPosition()](#BpManager+getBpPosition) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>
    -   [.registerBlockProducer(bpName, depositedAmount, [transactionParams])](#BpManager+registerBlockProducer) ⇒ <code>Promise</code>
    -   [.changeBlockProducerReward(bpName, rewardAmount, [transactionParams])](#BpManager+changeBlockProducerReward) ⇒ <code>Promise</code>
    -   [.unregisterBlockProducer(bpName, [transactionParams])](#BpManager+unregisterBlockProducer) ⇒ <code>Promise</code>
    -   [.depositEos(fromAccount, bpName, eosAmount, [transactionParams])](#BpManager+depositEos) ⇒ <code>Promise</code>

<a name="new_BpManager_new"></a>

### new BpManager(connector)

<p>Creates instance of <code>BpManager</code></p>

| Param     | Description                                                                |
| --------- | -------------------------------------------------------------------------- |
| connector | <p>EosdtConnector (see <code>README</code> section <code>Usage</code>)</p> |

<a name="BpManager+getAllBpPositions"></a>

### bpManager.getAllBpPositions() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>BpManager</code>](#BpManager)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>An array of objects, that contain information about
registered block producers</p>  
<a name="BpManager+getBpPosition"></a>

### bpManager.getBpPosition() ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>

**Kind**: instance method of [<code>BpManager</code>](#BpManager)  
**Returns**: <code>Promise.&lt;(object\|undefined)&gt;</code> - <p>Object with information about a registered block
producer</p>  
<a name="BpManager+registerBlockProducer"></a>

### bpManager.registerBlockProducer(bpName, depositedAmount, [transactionParams]) ⇒ <code>Promise</code>

<p>Registers a block producer in BP voting reward program via EOS transfer. Transferred EOS
is added to BP reward balance</p>

**Kind**: instance method of [<code>BpManager</code>](#BpManager)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| bpName              | <code>string</code> | <p>Account name</p>                                                          |
| depositedAmount     | <code>number</code> | <p>EOS amount to transfer</p>                                                |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BpManager+changeBlockProducerReward"></a>

### bpManager.changeBlockProducerReward(bpName, rewardAmount, [transactionParams]) ⇒ <code>Promise</code>

<p>Changes amount of EOS reward payed by block producer</p>

**Kind**: instance method of [<code>BpManager</code>](#BpManager)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| bpName              | <code>string</code> | <p>Account name</p>                                                          |
| rewardAmount        | <code>number</code> |                                                                              |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BpManager+unregisterBlockProducer"></a>

### bpManager.unregisterBlockProducer(bpName, [transactionParams]) ⇒ <code>Promise</code>

<p>Deactivates block producer</p>

**Kind**: instance method of [<code>BpManager</code>](#BpManager)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| bpName              | <code>string</code> | <p>Account name</p>                                                          |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="BpManager+depositEos"></a>

### bpManager.depositEos(fromAccount, bpName, eosAmount, [transactionParams]) ⇒ <code>Promise</code>

<p>Deposit EOS into block producer Governance account to pay reward. Any account can deposit
EOS for a block producer</p>

**Kind**: instance method of [<code>BpManager</code>](#BpManager)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| fromAccount         | <code>string</code>                        | <p>Paying account name</p>                                                   |
| bpName              | <code>string</code>                        |                                                                              |
| eosAmount           | <code>number</code> \| <code>string</code> |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="EosdtConnector"></a>

## EosdtConnector

<p>A connector object, used to build classes to work with EOSDT ecosystem contracts</p>

**Kind**: global class

-   [EosdtConnector](#EosdtConnector)
    -   [new EosdtConnector(nodeAddress, privateKeys)](#new_EosdtConnector_new)
    -   [.getBasicPositions(collateralToken)](#EosdtConnector+getBasicPositions) ⇒
    -   [.getPositions()](#EosdtConnector+getPositions)
    -   [.getLiquidator([collateralToken])](#EosdtConnector+getLiquidator) ⇒
    -   [.getSavingsRateCont()](#EosdtConnector+getSavingsRateCont) ⇒
    -   [.getArmContract()](#EosdtConnector+getArmContract) ⇒
    -   [.getTokenSwapContract()](#EosdtConnector+getTokenSwapContract) ⇒
    -   [.getGovernance()](#EosdtConnector+getGovernance) ⇒
    -   [.getBalances()](#EosdtConnector+getBalances) ⇒

<a name="new_EosdtConnector_new"></a>

### new EosdtConnector(nodeAddress, privateKeys)

<p>A connector object, used to build classes to work with EOSDT ecosystem contracts</p>

| Param       | Type                              | Description                                              |
| ----------- | --------------------------------- | -------------------------------------------------------- |
| nodeAddress | <code>string</code>               | <p>URL of blockchain node, used to send transactions</p> |
| privateKeys | <code>Array.&lt;string&gt;</code> | <p>Array of private keys used to sign transactions</p>   |

<a name="EosdtConnector+getBasicPositions"></a>

### eosdtConnector.getBasicPositions(collateralToken) ⇒

<p>Creates class to work with basic positions contract (non-EOS collateral)</p>

**Kind**: instance method of [<code>EosdtConnector</code>](#EosdtConnector)  
**Returns**: <p>Instance of <code>BasicPositionsContract</code></p>

| Param           | Type                | Description                                 |
| --------------- | ------------------- | ------------------------------------------- |
| collateralToken | <code>string</code> | <p>&quot;PBTC&quot; or &quot;PETH&quot;</p> |

<a name="EosdtConnector+getPositions"></a>

### eosdtConnector.getPositions()

<p>Creates a class to work with EOS-collateral positions contract (<code>eosdtcntract</code>)</p>

**Kind**: instance method of [<code>EosdtConnector</code>](#EosdtConnector)  
<a name="EosdtConnector+getLiquidator"></a>

### eosdtConnector.getLiquidator([collateralToken]) ⇒

<p>Creates a class to work with specified liquidator contract</p>

**Kind**: instance method of [<code>EosdtConnector</code>](#EosdtConnector)  
**Returns**: <p>Instance of <code>LiquidatorContract</code></p>

| Param             | Type                | Default                      | Description                                                  |
| ----------------- | ------------------- | ---------------------------- | ------------------------------------------------------------ |
| [collateralToken] | <code>string</code> | <code>&quot;EOS&quot;</code> | <p>&quot;EOS&quot;, &quot;PBTC&quot; or &quot;PETH&quot;</p> |

<a name="EosdtConnector+getSavingsRateCont"></a>

### eosdtConnector.getSavingsRateCont() ⇒

<p>Creates a wrapper for Savings Rate contract</p>

**Kind**: instance method of [<code>EosdtConnector</code>](#EosdtConnector)  
**Returns**: <p>Instance of <code>SavingsRateContract</code></p>  
<a name="EosdtConnector+getArmContract"></a>

### eosdtConnector.getArmContract() ⇒

<p>Creates a wrapper for 'arm.eq' contract</p>

**Kind**: instance method of [<code>EosdtConnector</code>](#EosdtConnector)  
**Returns**: <p>Instance of <code>ArmContract</code></p>  
<a name="EosdtConnector+getTokenSwapContract"></a>

### eosdtConnector.getTokenSwapContract() ⇒

<p>Creates a wrapper for 'tokenswap.eq' contract</p>

**Kind**: instance method of [<code>EosdtConnector</code>](#EosdtConnector)  
**Returns**: <p>Instance of <code>TokenSwapContract</code></p>  
<a name="EosdtConnector+getGovernance"></a>

### eosdtConnector.getGovernance() ⇒

<p>Instantiates <code>GovernanceContract</code> - a wrapper to work with <code>eosdtgovernc</code></p>

**Kind**: instance method of [<code>EosdtConnector</code>](#EosdtConnector)  
**Returns**: <p>Instance of <code>GovernanceContract</code></p>  
<a name="EosdtConnector+getBalances"></a>

### eosdtConnector.getBalances() ⇒

<p>Instantiates a simple class to read blockchain balances</p>

**Kind**: instance method of [<code>EosdtConnector</code>](#EosdtConnector)  
**Returns**: <p>Instance of <code>BalanceGetter</code></p>  
<a name="GovernanceContract"></a>

## GovernanceContract

<p>A class to work with EOSDT Governance contract (<code>eosdtgovernc</code>)</p>

**Kind**: global class

-   [GovernanceContract](#GovernanceContract)
    -   [new GovernanceContract(connector)](#new_GovernanceContract_new)
    -   [.propose(proposal, senderName, [transactionParams])](#GovernanceContract+propose) ⇒ <code>Promise</code>
    -   [.expire(proposalName, senderName, [transactionParams])](#GovernanceContract+expire) ⇒ <code>Promise</code>
    -   [.applyChanges(proposalName, senderName, [transactionParams])](#GovernanceContract+applyChanges) ⇒ <code>Promise</code>
    -   [.cleanProposal(proposalName, deletedVotes, senderName, [transactionParams])](#GovernanceContract+cleanProposal) ⇒ <code>Promise</code>
    -   [.stake(senderName, nutsAmount, [trxMemo], [transactionParams])](#GovernanceContract+stake) ⇒ <code>Promise</code>
    -   [.unstake(nutAmount, voterName, [transactionParams])](#GovernanceContract+unstake) ⇒ <code>Promise</code>
    -   [.vote(proposalName, vote, voterName, voteJson, [transactionParams])](#GovernanceContract+vote) ⇒ <code>Promise</code>
    -   [.unvote(proposalName, voterName, [transactionParams])](#GovernanceContract+unvote) ⇒ <code>Promise</code>
    -   [.voteForBlockProducers(voterName, producers, [transactionParams])](#GovernanceContract+voteForBlockProducers) ⇒ <code>Promise</code>
    -   [.stakeAndVoteForBlockProducers(voterName, nutAmount, producers, [transactionParams])](#GovernanceContract+stakeAndVoteForBlockProducers) ⇒ <code>Promise</code>
    -   [.getVoterInfo()](#GovernanceContract+getVoterInfo) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>
    -   [.getVoterInfosTable()](#GovernanceContract+getVoterInfosTable) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getVotes()](#GovernanceContract+getVotes) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getVotesForAccount()](#GovernanceContract+getVotesForAccount) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getProposals()](#GovernanceContract+getProposals) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getBpVotes()](#GovernanceContract+getBpVotes) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getProxyInfo()](#GovernanceContract+getProxyInfo) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>
    -   [.getSettings()](#GovernanceContract+getSettings) ⇒ <code>Promise.&lt;object&gt;</code>
    -   [.getParameters()](#GovernanceContract+getParameters) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="new_GovernanceContract_new"></a>

### new GovernanceContract(connector)

<p>Creates an instance of <code>GovernanceContract</code></p>

| Param     | Description                                                                |
| --------- | -------------------------------------------------------------------------- |
| connector | <p>EosdtConnector (see <code>README</code> section <code>Usage</code>)</p> |

<a name="GovernanceContract+propose"></a>

### governanceContract.propose(proposal, senderName, [transactionParams]) ⇒ <code>Promise</code>

<p>Creates a proposal</p>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| proposal            | <code>object</code> |                                                                              |
| proposal.proposer   | <code>string</code> |                                                                              |
| proposal.name       | <code>string</code> |                                                                              |
| proposal.title      | <code>string</code> |                                                                              |
| proposal.json       | <code>string</code> |                                                                              |
| proposal.expiresAt  | <code>Date</code>   |                                                                              |
| proposal.type       | <code>number</code> |                                                                              |
| senderName          | <code>string</code> |                                                                              |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="GovernanceContract+expire"></a>

### governanceContract.expire(proposalName, senderName, [transactionParams]) ⇒ <code>Promise</code>

<p>Expires an active proposal</p>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| proposalName        | <code>string</code> |                                                                              |
| senderName          | <code>string</code> |                                                                              |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="GovernanceContract+applyChanges"></a>

### governanceContract.applyChanges(proposalName, senderName, [transactionParams]) ⇒ <code>Promise</code>

<p>Applies proposed changes. At least 51% of all issued NUT tokens must vote, at least 55%
of votes must be for proposal</p>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| proposalName        | <code>string</code> |                                                                              |
| senderName          | <code>string</code> |                                                                              |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="GovernanceContract+cleanProposal"></a>

### governanceContract.cleanProposal(proposalName, deletedVotes, senderName, [transactionParams]) ⇒ <code>Promise</code>

<p>Removes specified amount of votes from an expired proposal. If 0 votes left, removes proposal</p>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| proposalName        | <code>string</code> |                                                                              |
| deletedVotes        | <code>number</code> |                                                                              |
| senderName          | <code>string</code> |                                                                              |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="GovernanceContract+stake"></a>

### governanceContract.stake(senderName, nutsAmount, [trxMemo], [transactionParams]) ⇒ <code>Promise</code>

<p>Sends NUT tokens to contract, staking them and allowing to vote for block producers and for
proposals</p>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code>                        |                                                                              |
| nutsAmount          | <code>string</code> \| <code>number</code> |                                                                              |
| [trxMemo]           | <code>string</code>                        |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="GovernanceContract+unstake"></a>

### governanceContract.unstake(nutAmount, voterName, [transactionParams]) ⇒ <code>Promise</code>

<p>Unstakes NUT tokens to user's balance</p>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| nutAmount           | <code>string</code> \| <code>number</code> |                                                                              |
| voterName           | <code>string</code>                        |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="GovernanceContract+vote"></a>

### governanceContract.vote(proposalName, vote, voterName, voteJson, [transactionParams]) ⇒ <code>Promise</code>

<p>Vote for or against a proposal</p>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                                         |
| ------------------- | ------------------- | --------------------------------------------------------------------------------------------------- |
| proposalName        | <code>string</code> |                                                                                                     |
| vote                | <code>number</code> | <p>Vote <code>1</code> as &quot;yes&quot;, <code>0</code> or any other number as &quot;no&quot;</p> |
| voterName           | <code>string</code> |                                                                                                     |
| voteJson            | <code>string</code> |                                                                                                     |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p>                        |

<a name="GovernanceContract+unvote"></a>

### governanceContract.unvote(proposalName, voterName, [transactionParams]) ⇒ <code>Promise</code>

<p>Removes all user votes from a proposal</p>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| proposalName        | <code>string</code> |                                                                              |
| voterName           | <code>string</code> |                                                                              |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="GovernanceContract+voteForBlockProducers"></a>

### governanceContract.voteForBlockProducers(voterName, producers, [transactionParams]) ⇒ <code>Promise</code>

<p>Votes with staked NUTs for block producers</p>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                              | Description                                                                  |
| ------------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| voterName           | <code>string</code>               |                                                                              |
| producers           | <code>Array.&lt;string&gt;</code> |                                                                              |
| [transactionParams] | <code>object</code>               | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="GovernanceContract+stakeAndVoteForBlockProducers"></a>

### governanceContract.stakeAndVoteForBlockProducers(voterName, nutAmount, producers, [transactionParams]) ⇒ <code>Promise</code>

<p>Stakes NUTs and votes for BPs in one transaction</p>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| voterName           | <code>string</code>                        |                                                                              |
| nutAmount           | <code>string</code> \| <code>number</code> |                                                                              |
| producers           | <code>Array.&lt;string&gt;</code>          |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="GovernanceContract+getVoterInfo"></a>

### governanceContract.getVoterInfo() ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise.&lt;(object\|undefined)&gt;</code> - <p>Amount of NUTs staked by account in Governance
contract and their unstake date</p>  
<a name="GovernanceContract+getVoterInfosTable"></a>

### governanceContract.getVoterInfosTable() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>Table of information on accounts that staked NUT</p>  
<a name="GovernanceContract+getVotes"></a>

### governanceContract.getVotes() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>An array with all Governance contract votes (up to 10000)</p>  
<a name="GovernanceContract+getVotesForAccount"></a>

### governanceContract.getVotesForAccount() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>All account votes</p>  
<a name="GovernanceContract+getProposals"></a>

### governanceContract.getProposals() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>An array with all Governance contract proposals (up to 10000)</p>  
<a name="GovernanceContract+getBpVotes"></a>

### governanceContract.getBpVotes() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>Array of objects, containing block producers names and
amount of NUT votes for them</p>  
<a name="GovernanceContract+getProxyInfo"></a>

### governanceContract.getProxyInfo() ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise.&lt;(object\|undefined)&gt;</code> - <p>Voter info for <code>eosdtbpproxy</code></p>  
<a name="GovernanceContract+getSettings"></a>

### governanceContract.getSettings() ⇒ <code>Promise.&lt;object&gt;</code>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise.&lt;object&gt;</code> - <p>Governance contract settings</p>  
<a name="GovernanceContract+getParameters"></a>

### governanceContract.getParameters() ⇒ <code>Promise.&lt;object&gt;</code>

**Kind**: instance method of [<code>GovernanceContract</code>](#GovernanceContract)  
**Returns**: <code>Promise.&lt;object&gt;</code> - <p>Governance contract parameters</p>  
<a name="LiquidatorContract"></a>

## LiquidatorContract

<p>A class to work with EOSDT Liquidator contract. Creates EOS liquidator by default</p>

**Kind**: global class

-   [LiquidatorContract](#LiquidatorContract)
    -   [new LiquidatorContract(connector)](#new_LiquidatorContract_new)
    -   [.marginCallAndBuyoutCollat(senderName, positionId, eosdtToTransfer, [trxMemo], [transactionParams])](#LiquidatorContract+marginCallAndBuyoutCollat) ⇒ <code>Promise</code>
    -   [.transferEosdt(senderName, eosdtAmount, [trxMemo], [transactionParams])](#LiquidatorContract+transferEosdt) ⇒ <code>Promise</code>
    -   [.transferNut(senderName, nutAmount, trxMemo, [transactionParams])](#LiquidatorContract+transferNut) ⇒ <code>Promise</code>
    -   [.getSurplusDebt()](#LiquidatorContract+getSurplusDebt) ⇒ <code>Promise.&lt;string&gt;</code>
    -   [.getBadDebt()](#LiquidatorContract+getBadDebt) ⇒ <code>Promise.&lt;string&gt;</code>
    -   [.getCollatBalance()](#LiquidatorContract+getCollatBalance) ⇒ <code>Promise.&lt;string&gt;</code>
    -   [.getNutCollatBalance()](#LiquidatorContract+getNutCollatBalance) ⇒ <code>Promise.&lt;string&gt;</code>
    -   [.getParameters()](#LiquidatorContract+getParameters) ⇒ <code>Promise.&lt;object&gt;</code>
    -   [.getSettings()](#LiquidatorContract+getSettings) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="new_LiquidatorContract_new"></a>

### new LiquidatorContract(connector)

<p>Instantiates <code>LiquidatorContract</code></p>

| Param     | Description                                                                |
| --------- | -------------------------------------------------------------------------- |
| connector | <p>EosdtConnector (see <code>README</code> section <code>Usage</code>)</p> |

<a name="LiquidatorContract+marginCallAndBuyoutCollat"></a>

### liquidatorContract.marginCallAndBuyoutCollat(senderName, positionId, eosdtToTransfer, [trxMemo], [transactionParams]) ⇒ <code>Promise</code>

<p>Performs margin call on a position and transfers specified amount of EOSDT to liquidator
to buyout freed collateral</p>

**Kind**: instance method of [<code>LiquidatorContract</code>](#LiquidatorContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code>                        |                                                                              |
| positionId          | <code>number</code>                        |                                                                              |
| eosdtToTransfer     | <code>string</code> \| <code>number</code> |                                                                              |
| [trxMemo]           | <code>string</code>                        |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="LiquidatorContract+transferEosdt"></a>

### liquidatorContract.transferEosdt(senderName, eosdtAmount, [trxMemo], [transactionParams]) ⇒ <code>Promise</code>

<p>Sends EOSDT to liquidator contract. Used to cancel bad debt and buyout liquidator
collateral with discount</p>

**Kind**: instance method of [<code>LiquidatorContract</code>](#LiquidatorContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code>                        |                                                                              |
| eosdtAmount         | <code>string</code> \| <code>number</code> |                                                                              |
| [trxMemo]           | <code>string</code>                        |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="LiquidatorContract+transferNut"></a>

### liquidatorContract.transferNut(senderName, nutAmount, trxMemo, [transactionParams]) ⇒ <code>Promise</code>

<p>Sends NUT tokens to liquidator contract. Send token symbol in memo to buyout collateral
asset (liquidator parameter <code>nut_collat_balance</code>). With memo &quot;EOSDT&quot; it is used to
buyout EOSDT (liquidator parameter <code>surplus_debt</code>)</p>

**Kind**: instance method of [<code>LiquidatorContract</code>](#LiquidatorContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code>                        |                                                                              |
| nutAmount           | <code>string</code> \| <code>number</code> |                                                                              |
| trxMemo             | <code>string</code>                        |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="LiquidatorContract+getSurplusDebt"></a>

### liquidatorContract.getSurplusDebt() ⇒ <code>Promise.&lt;string&gt;</code>

**Kind**: instance method of [<code>LiquidatorContract</code>](#LiquidatorContract)  
**Returns**: <code>Promise.&lt;string&gt;</code> - <p>Amount of system surplus debt</p>  
<a name="LiquidatorContract+getBadDebt"></a>

### liquidatorContract.getBadDebt() ⇒ <code>Promise.&lt;string&gt;</code>

**Kind**: instance method of [<code>LiquidatorContract</code>](#LiquidatorContract)  
**Returns**: <code>Promise.&lt;string&gt;</code> - <p>Amount of system bad debt</p>  
<a name="LiquidatorContract+getCollatBalance"></a>

### liquidatorContract.getCollatBalance() ⇒ <code>Promise.&lt;string&gt;</code>

**Kind**: instance method of [<code>LiquidatorContract</code>](#LiquidatorContract)  
**Returns**: <code>Promise.&lt;string&gt;</code> - <p>Amount of collateral on liquidator contract balance</p>  
<a name="LiquidatorContract+getNutCollatBalance"></a>

### liquidatorContract.getNutCollatBalance() ⇒ <code>Promise.&lt;string&gt;</code>

**Kind**: instance method of [<code>LiquidatorContract</code>](#LiquidatorContract)  
**Returns**: <code>Promise.&lt;string&gt;</code> - <p>Amount of NUT collateral on liquidator</p>  
<a name="LiquidatorContract+getParameters"></a>

### liquidatorContract.getParameters() ⇒ <code>Promise.&lt;object&gt;</code>

**Kind**: instance method of [<code>LiquidatorContract</code>](#LiquidatorContract)  
**Returns**: <code>Promise.&lt;object&gt;</code> - <p>Liquidator contract parameters object</p>  
<a name="LiquidatorContract+getSettings"></a>

### liquidatorContract.getSettings() ⇒ <code>Promise.&lt;object&gt;</code>

**Kind**: instance method of [<code>LiquidatorContract</code>](#LiquidatorContract)  
**Returns**: <code>Promise.&lt;object&gt;</code> - <p>Liquidator contract settings object</p>  
<a name="PositionsContract"></a>

## PositionsContract

<p>Module to manage EOS-collateral positions (on contract <code>eosdtcntract</code>). It is inherited from
<code>BasicPositionsContract</code> and includes all it's methods.</p>

**Kind**: global class

-   [PositionsContract](#PositionsContract)
    -   [new PositionsContract(connector)](#new_PositionsContract_new)
    -   [.newEmptyPositionWithRef(maker, referralId, [transactionParams])](#PositionsContract+newEmptyPositionWithRef)
    -   [.getPositionById(id)](#PositionsContract+getPositionById) ⇒ <code>Promise.&lt;object&gt;</code>
    -   [.getPositionByMaker(maker)](#PositionsContract+getPositionByMaker) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>
    -   [.getAllUserPositions(maker)](#PositionsContract+getAllUserPositions) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getAllPositions()](#PositionsContract+getAllPositions) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getLatestUserPosition()](#PositionsContract+getLatestUserPosition) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>
    -   [.getParameters()](#PositionsContract+getParameters) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.addReferral(senderName, nutAmount, [transactionParams])](#PositionsContract+addReferral) ⇒ <code>Promise</code>
    -   [.deleteReferral(senderName, referralId, [transactionParams])](#PositionsContract+deleteReferral) ⇒ <code>Promise</code>
    -   [.getReferralById(id)](#PositionsContract+getReferralById) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>
    -   [.getAllReferrals()](#PositionsContract+getAllReferrals) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getReferralByName(name)](#PositionsContract+getReferralByName) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>
    -   [.getPositionReferral(positionId)](#PositionsContract+getPositionReferral) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>
    -   [.getPositionReferralsTable()](#PositionsContract+getPositionReferralsTable) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getAllReferralPositionsIds()](#PositionsContract+getAllReferralPositionsIds) ⇒ <code>Promise.&lt;Array.&lt;number&gt;&gt;</code>

<a name="new_PositionsContract_new"></a>

### new PositionsContract(connector)

<p>Creates an instance of PositionsContract</p>

| Param     | Description                                                                |
| --------- | -------------------------------------------------------------------------- |
| connector | <p>EosdtConnector (see <code>README</code> section <code>Usage</code>)</p> |

<a name="PositionsContract+newEmptyPositionWithRef"></a>

### positionsContract.newEmptyPositionWithRef(maker, referralId, [transactionParams])

<p>Creates position that has a referral. Position would have 0 collateral and 0 debt</p>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| maker               | <code>string</code> | <p>Account to create position for</p>                                        |
| referralId          | <code>number</code> | <p>Id of a referral</p>                                                      |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="PositionsContract+getPositionById"></a>

### positionsContract.getPositionById(id) ⇒ <code>Promise.&lt;object&gt;</code>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)  
**Returns**: <code>Promise.&lt;object&gt;</code> - <p>A position object</p>

| Param | Type                |
| ----- | ------------------- |
| id    | <code>number</code> |

<a name="PositionsContract+getPositionByMaker"></a>

### positionsContract.getPositionByMaker(maker) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)  
**Returns**: <code>Promise.&lt;(object\|undefined)&gt;</code> - <p>Position object - first position that belongs to
maker account</p>

| Param | Type                | Description         |
| ----- | ------------------- | ------------------- |
| maker | <code>string</code> | <p>Account name</p> |

<a name="PositionsContract+getAllUserPositions"></a>

### positionsContract.getAllUserPositions(maker) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>Array of all positions objects, created by the maker</p>

| Param | Type                | Description         |
| ----- | ------------------- | ------------------- |
| maker | <code>string</code> | <p>Account name</p> |

<a name="PositionsContract+getAllPositions"></a>

### positionsContract.getAllPositions() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>An array of all positions created on this contract</p>  
<a name="PositionsContract+getLatestUserPosition"></a>

### positionsContract.getLatestUserPosition() ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)  
**Returns**: <code>Promise.&lt;(object\|undefined)&gt;</code> - <p>Position object - position of the account with
maximum id value</p>  
<a name="PositionsContract+getParameters"></a>

### positionsContract.getParameters() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>Positions contract parameters</p>  
<a name="PositionsContract+addReferral"></a>

### positionsContract.addReferral(senderName, nutAmount, [transactionParams]) ⇒ <code>Promise</code>

<p>Creates new referral, staking given amount of NUT tokens. Rejects when amount is less then
<code>referral_min_stake</code> in positions contract settings.</p>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code>                        |                                                                              |
| nutAmount           | <code>string</code> \| <code>number</code> |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="PositionsContract+deleteReferral"></a>

### positionsContract.deleteReferral(senderName, referralId, [transactionParams]) ⇒ <code>Promise</code>

<p>Removes referral and unstakes that referral's NUTs</p>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code> |                                                                              |
| referralId          | <code>number</code> |                                                                              |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="PositionsContract+getReferralById"></a>

### positionsContract.getReferralById(id) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)  
**Returns**: <code>Promise.&lt;(object\|undefined)&gt;</code> - <p>An object with information about referral</p>

| Param | Type                |
| ----- | ------------------- |
| id    | <code>number</code> |

<a name="PositionsContract+getAllReferrals"></a>

### positionsContract.getAllReferrals() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>Table of existing referrals</p>  
<a name="PositionsContract+getReferralByName"></a>

### positionsContract.getReferralByName(name) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)  
**Returns**: <code>Promise.&lt;(object\|undefined)&gt;</code> - <p>An object with information about referral</p>

| Param | Type                | Description         |
| ----- | ------------------- | ------------------- |
| name  | <code>string</code> | <p>Account name</p> |

<a name="PositionsContract+getPositionReferral"></a>

### positionsContract.getPositionReferral(positionId) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)  
**Returns**: <code>Promise.&lt;(object\|undefined)&gt;</code> - <p>Returns referral information object if position
with given id has a referral</p>

| Param      | Type                |
| ---------- | ------------------- |
| positionId | <code>number</code> |

<a name="PositionsContract+getPositionReferralsTable"></a>

### positionsContract.getPositionReferralsTable() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>An array of objects, containing positions ids and those
positions referrals ids</p>  
<a name="PositionsContract+getAllReferralPositionsIds"></a>

### positionsContract.getAllReferralPositionsIds() ⇒ <code>Promise.&lt;Array.&lt;number&gt;&gt;</code>

**Kind**: instance method of [<code>PositionsContract</code>](#PositionsContract)  
**Returns**: <code>Promise.&lt;Array.&lt;number&gt;&gt;</code> - <p>An array of position objects with given referral id</p>  
<a name="SavingsRateContract"></a>

## SavingsRateContract

<p>A wrapper class to invoke actions of Equilibrium Savings Rate contract</p>

**Kind**: global class

-   [SavingsRateContract](#SavingsRateContract)
    -   [new SavingsRateContract(connector)](#new_SavingsRateContract_new)
    -   [.stake(senderName, eosdtAmount, [trxMemo], [transactionParams])](#SavingsRateContract+stake) ⇒ <code>Promise</code>
    -   [.unstake(toAccount, eosdtAmount, [transactionParams])](#SavingsRateContract+unstake) ⇒ <code>Promise</code>
    -   [.getAllPositions()](#SavingsRateContract+getAllPositions) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getPositionById()](#SavingsRateContract+getPositionById) ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>
    -   [.getUserPositions()](#SavingsRateContract+getUserPositions) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    -   [.getParameters()](#SavingsRateContract+getParameters) ⇒ <code>Promise.&lt;object&gt;</code>
    -   [.getSettings()](#SavingsRateContract+getSettings) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="new_SavingsRateContract_new"></a>

### new SavingsRateContract(connector)

<p>Instantiates SavingsRateContract</p>

| Param     | Description                                                                |
| --------- | -------------------------------------------------------------------------- |
| connector | <p>EosdtConnector (see <code>README</code> section <code>Usage</code>)</p> |

<a name="SavingsRateContract+stake"></a>

### savingsRateContract.stake(senderName, eosdtAmount, [trxMemo], [transactionParams]) ⇒ <code>Promise</code>

<p>Transfers EOSDT from user to Savings Rate contract</p>

**Kind**: instance method of [<code>SavingsRateContract</code>](#SavingsRateContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code>                        |                                                                              |
| eosdtAmount         | <code>string</code> \| <code>number</code> |                                                                              |
| [trxMemo]           | <code>string</code>                        |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="SavingsRateContract+unstake"></a>

### savingsRateContract.unstake(toAccount, eosdtAmount, [transactionParams]) ⇒ <code>Promise</code>

<p>Returns EOSDT from Savings Rate contract to account balance</p>

**Kind**: instance method of [<code>SavingsRateContract</code>](#SavingsRateContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| toAccount           | <code>string</code>                        |                                                                              |
| eosdtAmount         | <code>string</code> \| <code>number</code> |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="SavingsRateContract+getAllPositions"></a>

### savingsRateContract.getAllPositions() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>SavingsRateContract</code>](#SavingsRateContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>An array of all positions on Savings Rate contract</p>  
<a name="SavingsRateContract+getPositionById"></a>

### savingsRateContract.getPositionById() ⇒ <code>Promise.&lt;(object\|undefined)&gt;</code>

**Kind**: instance method of [<code>SavingsRateContract</code>](#SavingsRateContract)  
**Returns**: <code>Promise.&lt;(object\|undefined)&gt;</code> - <p>A Savings Rate position object with given id</p>  
<a name="SavingsRateContract+getUserPositions"></a>

### savingsRateContract.getUserPositions() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>SavingsRateContract</code>](#SavingsRateContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>Array of all positions objects, created by the maker</p>  
<a name="SavingsRateContract+getParameters"></a>

### savingsRateContract.getParameters() ⇒ <code>Promise.&lt;object&gt;</code>

**Kind**: instance method of [<code>SavingsRateContract</code>](#SavingsRateContract)  
**Returns**: <code>Promise.&lt;object&gt;</code> - <p>Savings Rate contract parameters</p>  
<a name="SavingsRateContract+getSettings"></a>

### savingsRateContract.getSettings() ⇒ <code>Promise.&lt;object&gt;</code>

**Kind**: instance method of [<code>SavingsRateContract</code>](#SavingsRateContract)  
**Returns**: <code>Promise.&lt;object&gt;</code> - <p>Savings Rate contract settings</p>  
<a name="TokenSwapContract"></a>

## TokenSwapContract

<p>A wrapper class to invoke actions of Equilibrium Token Swap contract</p>

**Kind**: global class

-   [TokenSwapContract](#TokenSwapContract)
    -   [new TokenSwapContract(connector)](#new_TokenSwapContract_new)
    -   [.transferNut(senderName, nutAmount, ethereumAddress, [transactionParams])](#TokenSwapContract+transferNut) ⇒ <code>Promise</code>
    -   [.claim(toAccount, positionId, ethereumSignature, [transactionParams])](#TokenSwapContract+claim) ⇒ <code>Promise</code>
    -   [.getParameters()](#TokenSwapContract+getParameters) ⇒ <code>Promise.&lt;object&gt;</code>
    -   [.getSettings()](#TokenSwapContract+getSettings) ⇒ <code>Promise.&lt;object&gt;</code>
    -   [.getAllPositions()](#TokenSwapContract+getAllPositions) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

<a name="new_TokenSwapContract_new"></a>

### new TokenSwapContract(connector)

<p>Instantiates TokenSwapContract</p>

| Param     | Description                                                                |
| --------- | -------------------------------------------------------------------------- |
| connector | <p>EosdtConnector (see <code>README</code> section <code>Usage</code>)</p> |

<a name="TokenSwapContract+transferNut"></a>

### tokenSwapContract.transferNut(senderName, nutAmount, ethereumAddress, [transactionParams]) ⇒ <code>Promise</code>

<p>Sends NUT tokens to TokenSwap contract. Send Ethereum address
(available format with and without prefix &quot;0x&quot;)
in memo to verify Ethereum signature</p>

**Kind**: instance method of [<code>TokenSwapContract</code>](#TokenSwapContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                                       | Description                                                                  |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| senderName          | <code>string</code>                        |                                                                              |
| nutAmount           | <code>string</code> \| <code>number</code> |                                                                              |
| ethereumAddress     | <code>string</code>                        |                                                                              |
| [transactionParams] | <code>object</code>                        | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="TokenSwapContract+claim"></a>

### tokenSwapContract.claim(toAccount, positionId, ethereumSignature, [transactionParams]) ⇒ <code>Promise</code>

<p>Returns NUT from TokenSwap contract to account balance
and verifies Ethereum signature (available format with and without prefix &quot;0x&quot;)</p>

**Kind**: instance method of [<code>TokenSwapContract</code>](#TokenSwapContract)  
**Returns**: <code>Promise</code> - <p>Promise of transaction receipt</p>

| Param               | Type                | Description                                                                  |
| ------------------- | ------------------- | ---------------------------------------------------------------------------- |
| toAccount           | <code>string</code> |                                                                              |
| positionId          | <code>number</code> |                                                                              |
| ethereumSignature   | <code>string</code> |                                                                              |
| [transactionParams] | <code>object</code> | <p>see <a href="#ITrxParamsArgument"><code>ITrxParamsArgument</code></a></p> |

<a name="TokenSwapContract+getParameters"></a>

### tokenSwapContract.getParameters() ⇒ <code>Promise.&lt;object&gt;</code>

**Kind**: instance method of [<code>TokenSwapContract</code>](#TokenSwapContract)  
**Returns**: <code>Promise.&lt;object&gt;</code> - <p>TokenSwap contract parameters</p>  
<a name="TokenSwapContract+getSettings"></a>

### tokenSwapContract.getSettings() ⇒ <code>Promise.&lt;object&gt;</code>

**Kind**: instance method of [<code>TokenSwapContract</code>](#TokenSwapContract)  
**Returns**: <code>Promise.&lt;object&gt;</code> - <p>TokenSwap contract settings</p>  
<a name="TokenSwapContract+getAllPositions"></a>

### tokenSwapContract.getAllPositions() ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

**Kind**: instance method of [<code>TokenSwapContract</code>](#TokenSwapContract)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - <p>An array of all positions created on TokenSwap contract</p>

---

&copy; 2019-2020 Equilibrium
