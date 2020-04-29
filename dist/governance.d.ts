import { EosdtConnectorInterface } from "./interfaces/connector";
import { BPVotes, EosdtVote, EosVoterInfo, GovernanceParameters, GovernanceSettings, ProposeObject, StoredProposal, VoterInfo } from "./interfaces/governance";
import { ITrxParamsArgument } from "./interfaces/transaction";
/**
 * A class to work with EOSDT Governance contract (`eosdtgovernc`)
 */
export declare class GovernanceContract {
    private contractName;
    private rpc;
    private api;
    /**
     * Creates an instance of `GovernanceContract`
     * @param connector EosdtConnector (see `README` section `Usage`)
     */
    constructor(connector: EosdtConnectorInterface);
    /**
     * Creates a proposal
     * @param {object} proposal
     * @param {string} proposal.proposer
     * @param {string} proposal.name
     * @param {string} proposal.title
     * @param {string} proposal.json
     * @param {Date} proposal.expiresAt
     * @param {number} proposal.type
     * @param {string} senderName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    propose(proposal: ProposeObject, senderName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Expires an active proposal
     * @param {string} proposalName
     * @param {string} senderName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    expire(proposalName: string, senderName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Applies proposed changes. At least 51% of all issued NUT tokens must vote, at least 55%
     * of votes must be for proposal
     * @param {string} proposalName
     * @param {string} senderName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    applyChanges(proposalName: string, senderName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Removes specified amount of votes from an expired proposal. If 0 votes left, removes proposal
     * @param {string} proposalName
     * @param {number} deletedVotes
     * @param {string} senderName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    cleanProposal(proposalName: string, deletedVotes: number, senderName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Sends NUT tokens to contract, staking them and allowing to vote for block producers and for
     * proposals
     * @param {string} senderName
     * @param {string | number} nutsAmount
     * @param {string} [trxMemo]
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    stake(senderName: string, nutsAmount: string | number, trxMemo?: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Unstakes NUT tokens to user's balance
     * @param {string | number} nutAmount
     * @param {string} voterName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    unstake(nutAmount: string | number, voterName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Vote for or against a proposal
     * @param {string} proposalName
     * @param {number} vote Vote `1` as "yes", `0` or any other number as "no"
     * @param {string} voterName
     * @param {string} voteJson
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    vote(proposalName: string, vote: number, voterName: string, voteJson: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Removes all user votes from a proposal
     * @param {string} proposalName
     * @param {string} voterName
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    unvote(proposalName: string, voterName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Votes with staked NUTs for block producers
     * @param {string} voterName
     * @param {string[]} producers
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    voteForBlockProducers(voterName: string, producers: string[], transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Stakes NUTs and votes for BPs in one transaction
     * @param {string} voterName
     * @param {string | number} nutAmount
     * @param {string[]} producers
     * @param {object} [transactionParams] see [<code>ITrxParamsArgument</code>](#ITrxParamsArgument)
     * @returns {Promise} Promise of transaction receipt
     */
    stakeAndVoteForBlockProducers(voterName: string, nutAmount: string | number, producers: string[], transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * @returns {Promise<object | undefined>} Amount of NUTs staked by account in Governance
     * contract and their unstake date
     */
    getVoterInfo(accountName: string): Promise<VoterInfo | undefined>;
    /**
     * @returns {Promise<object[]>} Table of information on accounts that staked NUT
     */
    getVoterInfosTable(): Promise<VoterInfo[]>;
    /**
     * @returns {Promise<object[]>} An array with all Governance contract votes (up to 10000)
     */
    getVotes(): Promise<EosdtVote[]>;
    /**
     * @returns {Promise<object[]>} All account votes
     */
    getVotesForAccount(accountName: string): Promise<EosdtVote[]>;
    /**
     * @returns {Promise<object[]>} An array with all Governance contract proposals (up to 10000)
     */
    getProposals(): Promise<StoredProposal[]>;
    /**
     * @returns {Promise<object[]>} Array of objects, containing block producers names and
     * amount of NUT votes for them
     */
    getBpVotes(): Promise<BPVotes[]>;
    /**
     * @returns {Promise<object | undefined>} Voter info for `eosdtbpproxy`
     */
    getProxyInfo(): Promise<EosVoterInfo | undefined>;
    /**
     * @returns {Promise<object>} Governance contract settings
     */
    getSettings(): Promise<GovernanceSettings>;
    /**
     * @returns {Promise<object>} Governance contract parameters
     */
    getParameters(): Promise<GovernanceParameters>;
}
