import { Api, JsonRpc } from "eosjs";
import { GovernanceContract, LiquidatorContract } from ".";
import { ArmContract } from "./armeq";
import { BalanceGetter } from "./balance";
import { BasicPositionsContract } from "./basic-positions";
import { PositionsContract } from "./main-positions";
import { SavingsRateContract } from "./savings-rate";
import { TokenSwapContract } from "./tokenswap";
/**
 * A connector object, used to build classes to work with EOSDT ecosystem contracts
 */
export declare class EosdtConnector {
    readonly rpc: JsonRpc;
    readonly api: Api;
    /**
     * A connector object, used to build classes to work with EOSDT ecosystem contracts
     * @param {string} nodeAddress URL of blockchain node, used to send transactions
     * @param {string[]} privateKeys Array of private keys used to sign transactions
     */
    constructor(nodeAddress: string, privateKeys: string[]);
    /**
     * Creates class to work with basic positions contract (non-EOS collateral)
     * @param {string} collateralToken "PBTC" or "PETH"
     * @returns Instance of `BasicPositionsContract`
     */
    getBasicPositions(collateralToken: string): BasicPositionsContract;
    /**
     * Creates a class to work with EOS-collateral positions contract (`eosdtcntract`)
     */
    getPositions(): PositionsContract;
    /**
     * Creates a class to work with specified liquidator contract
     * @param {string=} [collateralToken] "EOS", "PBTC" or "PETH"
     * @returns Instance of `LiquidatorContract`
     */
    getLiquidator(collateralToken?: string): LiquidatorContract;
    /**
     * Creates a wrapper for Savings Rate contract
     * @returns Instance of `SavingsRateContract`
     */
    getSavingsRateCont(): SavingsRateContract;
    /**
     * Creates a wrapper for 'arm.eq' contract
     * @returns Instance of `ArmContract`
     */
    getArmContract(): ArmContract;
    /**
     * Creates a wrapper for 'tokenswap.eq' contract
     * @returns Instance of `TokenSwapContract`
     */
    getTokenSwapContract(): TokenSwapContract;
    /**
     * Instantiates `GovernanceContract` - a wrapper to work with `eosdtgovernc`
     * @returns Instance of `GovernanceContract`
     */
    getGovernance(): GovernanceContract;
    /**
     * Instantiates a simple class to read blockchain balances
     * @returns Instance of `BalanceGetter`
     */
    getBalances(): BalanceGetter;
}
