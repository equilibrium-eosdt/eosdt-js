import { EosdtConnectorInterface } from "./interfaces/connector";
import { LiquidatorParameters } from "./interfaces/liquidator";
import { ITrxParamsArgument } from "./interfaces/transaction";
export declare class LiquidatorContract {
    private contractName;
    private rpc;
    private api;
    constructor(connector: EosdtConnectorInterface);
    marginCallAndBuyoutEos(senderName: string, positionId: number, eosdtToTransfer: string | number, trxMemo?: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    transferEos(senderName: string, amount: string | number, trxMemo?: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    transferEosdt(senderName: string, eosdtAmount: string | number, trxMemo?: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    transferNut(senderName: string, nutAmount: string | number, trxMemo: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    getSurplusDebt(): Promise<string>;
    getBadDebt(): Promise<string>;
    getEosBalance(): Promise<string>;
    getParameters(): Promise<LiquidatorParameters>;
}
