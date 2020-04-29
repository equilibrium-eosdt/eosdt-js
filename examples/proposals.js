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

    const proposalJson = `{"eosdtcntract.critical_ltv":1.4,"eosdtcntract.stability_fee":0.086,"reserved":"Update production contracts to v2.1"}`
    const newProposal = {
        proposer: accountName,
        name: "test proposal",
        title: "Test proposal title",
        json: proposalJson,
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000), // 7 days from current moment
        type: 1
    }

    // Creating a proposal for users to vote
    await governance.propose(newProposal)

    // Logging all proposals
    console.log(`Proposal created: \n`, await governance.getProposals())

    // Expiring a proposal and stooping voting on it. Expiration date changes to
    // time of this method execution.
    await governance.expire("test proposal", accountName)
    console.log(`Proposal expired: \n`, await governance.getProposals())

    // If your proposal is expired, has 55% "yes" votes and 51% of all NUT tokens
    // voted - you can apply changes from this proposal to system

    // await governance.applyChanges("test proposal", accountName)
}
