import { Api, JsonRpc } from "eosjs";
import { GovernanceContract, LiquidatorContract } from ".";
import { BalanceGetter } from "./balance";
import { PositionsContract } from "./positions";
import { SavingsRateContract } from "./savings-rate";
export declare class EosdtConnector {
    readonly rpc: JsonRpc;
    readonly api: Api;
    constructor(nodeAddress: string, privateKeys: string[]);
    getPositions(): PositionsContract;
    getLiquidator(): LiquidatorContract;
    getGovernance(): GovernanceContract;
    getBalances(): BalanceGetter;
    /**
     * Creates a wrapper for Savings Rate contract
     */
    getSavingsRate(): SavingsRateContract;
}
