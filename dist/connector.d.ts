import { JsonRpc, Api } from "eosjs";
import { LiquidatorContract, GovernanceContract } from ".";
import { PositionsContract } from "./positions";
import { BalanceGetter } from './balance';
export declare class EosdtConnector {
    readonly rpc: JsonRpc;
    readonly api: Api;
    constructor(nodeAddress: string, privateKeys: string[]);
    getPositions(): PositionsContract;
    getLiquidator(): LiquidatorContract;
    getGovernance(): GovernanceContract;
    getBalances(): BalanceGetter;
}
