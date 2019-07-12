import BigNumber from "bignumber.js";
import { LiquidatorParameters } from "./interfaces/liquidator";
import { EosdtConnectorInterface } from "./interfaces/connector";
export declare class LiquidatorContract {
    private contractName;
    private rpc;
    private api;
    constructor(connector: EosdtConnectorInterface);
    marginCallAndBuyoutEos(senderAccount: string, positionId: number, eosdtToTransfer: string | number | BigNumber): Promise<any>;
    transferEos(sender: string, amount: string | number | BigNumber, memo: string): Promise<any>;
    transferEosdt(sender: string, amount: string | number | BigNumber, memo: string): Promise<any>;
    transferNut(sender: string, amount: string | number | BigNumber, memo: string): Promise<any>;
    getSurplusDebt(): Promise<string>;
    getBadDebt(): Promise<string>;
    getEosBalance(): Promise<string>;
    getParameters(): Promise<LiquidatorParameters>;
}
