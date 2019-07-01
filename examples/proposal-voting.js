const { EosdtConnector } = require("../dist/connector")

main()
async function main() {
    // Change node address here. This one will connect you to Jungle testnet node
    const nodeAddress = "http://jungle2.cryptolions.io:80"

    // Change or add private keys used to sign transactions here. This one is from Jungle 
    // testnet account "exampleaccnt"
    const privateKeys = ["5JEVy6QujTsFzxWtBbQrG53vkszRybabE4wSyA2Tg1uZFEeVPks"]
    const accountName = "exampleaccnt"

    const connector = new EosdtConnector(nodeAddress, privateKeys)

    const currentBlockNumber = (await connector.rpc.get_info()).head_block_num
    console.log(`Connected to blockchain, current block number is: ${currentBlockNumber}`)

    const governance = connector.getGovernance()

    // Transfering 2 NUT tokens to use them in voting. Tokens can be unstaked and 
    // transferred back after 3 days wait period (votes, using these tokens must be 
    // cancelled first)
    await governance.stake(accountName, 2)

    // Voting whith 2 NUT tokens for proposal with name "test proposal". Vote "1" for 
    // proposal and any other number to vote against it. You vote with all your staked tokens
    await governance.vote("test proposal", 1, accountName, "")
    console.log(`Voted successfully, all votes: \n`, await governance.getVotes())

    // Cancelling vote for proposal with name "test proposal"
    await governance.unvote("test proposal", accountName)
    console.log(`Voted cancelled, all votes: \n`, await governance.getVotes())

    // Unstaking NUT tokens to get them back on user's balance
    await governance.unstake(2, accountName)
}
