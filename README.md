# EOSDT JS 
A JavaScript library to execute EOSDT contracts methods. 

## Usage
Install the module using NPM:
```bash
$ npm install @eosdt/eosdt-js
```
Use service module `Connector` to initiate one of three functional modules (`Positions`, `Governance` or `Liquidator`). `Connector` requires address of node that would process transactions and an array of private keys, used to sign transactions. 

```Javascript
const { EosdtConnector } = require("@eosdt/eosdt-js")

const nodeAddress = "http://node-address.example.com:80"

const connector = new EosdtConnector(nodeAddress, ["private-key-1", "private-key-2"])

const positions = connector.getPositions()
const governance = connector.getGovernance()
const liquidator = connector.getLiquidator()
```

## Modules

### Connector 
Creates a connector object, used to initiate functional modules and invoke their methods.

### Positions
Module to manage EOSDT positions. Methods:
- `create` - creates new position, using specified amount of EOS as collateral and issuing specified amount of EOSDT to creator. 
- `close` - used to close a position in event of a global shutdown.
- `delete` - deletes position that has 0 debt.
- `addCollateral` - sends EOS to position to increase it's collateralization. 
- `deleteCollateral` - returns specified part of used collateral to user if LTV stays above critical.
- `generateDebt` - issues additional EOSDT for position if this does not bring LTV below critical.
- `burnbackDebt` - repays specified amount of EOSDT decreasing debt.
- `marginCall` - called on a position with critical LTV, to perform a margin call.
- `getRates` - returns table of current system token prices (rates).
- `getPositionById` - returns a position object, selecting it by id.
- `getAllUserPositions` - returns an array of all positions for specified user (up to 100 positions).
- `getParameters` - returns Positions contract parameters. 
- `getSettings` - return Positions contract settings.

### Governance 
Governance methods help manage the system: create proposals to change system parameters, vote on them and stake NUT tokens for voting. Methods:
- `propose` - creates a proposal. 
- `expire` - expires an active proposal.
- `applyChanges` - apply proposed changes (at least 51% of all issued NUT tokens must vote, at least 55% of votes must be positive).
- `cleanProposal` - remove specified amount of votes from an expired proposal. If 0 votes left, removes proposal.
- `stake` - sends NUT tokens to contract, staking them and allowing to vote on proposals.
- `unstake` - unstakes NUT tokens, returning them to user and lowering amount of available votes. 
- `vote` - vote for or against a proposal. Vote `1` as "yes", `0` or any other number as "no".
- `unvote` - removes all user votes from a proposal. 
- `getSettings` - returns governance contract settings.
- `getProposals` - returns an array with all proposals (up to 1000).
- `getVotes` - returns an array with all votes (up to 1000). 

### Liquidator
Methods to get Liquidator contract parameters and exchange EOS and EOSDT in case of global shutdown. 
- `marginCallAndBuyoutEos` - performes margin call on a position and transfers specified amount of EOSDT to buyout freed EOS.
- `transferEos` - sends EOS to Liquidator contract. It is used to buyout surplus debt with discount.
- `transferEosdt` - sends EOSDT to liquidator contract. It is used to cancel bad debt and buyout liquidator EOS with discount.  
- `transferNut` - sends NUT tokens to liquidator contract. It is used to buyout EOS intended to be bought for NUT tokens (parameter "nut_collat_balance").  
- `getSurplusDebt` - returns amount of system surplus debt.
- `getBadDebt` - returns amount of system bad debt. 
- `getEosBalance` - returns amount of EOS on liquidator contract balance.
- `getParameters` - returns all liquidator contract parameters.

## Examples
You can find working example scripts in module directory `examples`.

### Connecting to blockchain
This code block is required for any other example to work.
```Javascript
const { EosdtConnector } = require("@eosdt/eosdt-js")

// Change node address here. This one will connect you to Jungle testnet node
const nodeAddress = "http://jungle2.cryptolions.io:80"

// Change or add private keys used to sign transactions here. This one is from Jungle 
// testnet account "exampleaccnt"
const privateKeys = ["5JEVy6QujTsFzxWtBbQrG53vkszRybabE4wSyA2Tg1uZFEeVPks"]
const accountName = "exampleaccnt"

const connector = new EosdtConnector(nodeAddress, privateKeys)

// This code logs current block number and lets us know that connection 
// has been  established.
const currentBlockNumber = (await connector.rpc.get_info()).head_block_num
console.log(`Connected to blockchain, current block number is: ${currentBlockNumber}`)

// Getting objects with all methods
const positions = connector.getPositions()
const governance = connector.getGovernance()
const liquidator = connector.getLiquidator()
```

### Position operations
Creating position, adding collateral, issuing addintional debt then returning it, returning collateral from postion and closing it.
```Javascript
// Creating a position to issue 2 EOSDT for 1.5 EOS collateral
// ATTENTION: this will throw if a user already has a position
await positions.create(accountName, 1.5, 2)

// Getting last user position
const allUserPositions = await positions.getAllUserPositions(accountName)
const lastUserPosition = allUserPositions[allUserPositions.length - 1]
const positionId = lastUserPosition.position_id
console.log("Position created:", lastUserPosition)

// Adding 1.6 EOS collateral to position
await positions.addCollateral(accountName, 1.6, positionId)

let updatedPosition = await positions.getPositionById(positionId)
console.log("Position collateral increased: ", updatedPosition)

// Issuing addintional 2.15 EOSDT of debt
await positions.generateDebt(accountName, 2.15, positionId)

updatedPosition = await positions.getPositionById(positionId)
console.log("Position outstanding and governance debts increased: ", updatedPosition)

// Returning 6 EOSDT to Positions contract. All excessive tokens will be returned to 
// user. Appropriate amount of NUT tokens will be withdrawn from user balance. User 
// required to have NUT tokens to burn debt.
await positions.burnbackDebt(accountName, 6, positionId)

updatedPosition = await positions.getPositionById(positionId)
console.log("Position debt decreased: ", updatedPosition)

// Returning 1.35 EOS of collateral to user (partial collateral return). If there is 
// debt still left, user cannot return more collateral than required for position 
// to have LTV above critical
await positions.deleteCollateral(accountName, 1.35, positionId)

updatedPosition = await positions.getPositionById(positionId)
console.log("Position collateral decreased: ", updatedPosition)

// Deleting position and returning all collateral to user. Would only work, if 
// position has zero debts.
await positions.delete(accountName, positionId)

updatedPosition = await positions.getPositionById(positionId)
console.log("Position deleted, excess EOS returned to user, position must now be undefined: ",
  updatedPosition)
```

### Proposals management
Creating, expiring and applying a proposal.

```Javascript
const proposalJson = `{"eosdtcntract.critical_ltv":1.4,"eosdtcntract.stability_fee":0.086,"reserved":"Update production contracts to v2.1"}`
const expirationDate = "2019-06-30T23:59:59"

// Creating a proposal for users to vote
await governance.propose("test proposal", "Test proposal title", proposalJson, expirationDate, accountName)

// Logging all proposals
console.log(`Proposal created: \n`, await governance.getProposals())

// Expiring a proposal and stooping voting on it. Expiration date changes to 
// time of this method execution.
await governance.expire("test proposal", accountName)
console.log(`Proposal expired: \n`, await governance.getProposals())

// If your proposal is expired, has 55% "yes" votes and 51% of all NUT tokens
// voted - you can apply changes from this proposal to system
await governance.applyChanges("test proposal", accountName)
```
### Voting
Staking NUT tokens to vote for and against proposals. 
```Javascript
// Transfering 2 NUT tokens to use them in voting. Tokens can be unstaked and 
// transferred back after 3 days wait period (votes, using these tokens must be 
// cancelled first)
await governance.stake(accountName, 2)

// Voting whith 2 NUT tokens for proposal with name "test proposal". Vote "1" for 
// proposal and any other number to vote against it. You vote with all staked tokens
await governance.vote("test proposal", 1, accountName)
console.log(`Voted successfully, all votes: \n`, await governance.getVotes())

// Cancelling vote for proposal with name "test proposal"
await governance.unvote("test proposal", accountName)
console.log(`Voted cancelled, all votes: \n`, await governance.getVotes())

// Unstaking NUT tokens to get them back on user's balance
await governance.unstake(2, accountName)
```

