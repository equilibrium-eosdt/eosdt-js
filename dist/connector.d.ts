import { JsonRpc, Api } from "eosjs";
import { Positions, Liquidator, Governance } from ".";
export declare class EosdtConnector {
    readonly rpc: JsonRpc;
    readonly api: Api;
    constructor(nodeAddress: string, privateKeys: string[]);
    getPositions(): Positions;
    getLiquidator(): Liquidator;
    getGovernance(): Governance;
}
