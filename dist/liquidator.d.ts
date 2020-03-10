import { EosdtConnectorInterface } from "./interfaces/connector";
import { LiquidatorParameters, LiquidatorSettings } from "./interfaces/liquidator";
import { ITrxParamsArgument } from "./interfaces/transaction";
export declare class LiquidatorContract {
    protected posContractName: string;
    protected tokenSymbol: string;
    private contractName;
    private rpc;
    private api;
    constructor(connector: EosdtConnectorInterface);
    marginCallAndBuyoutCollat(senderName: string, positionId: number, eosdtToTransfer: string | number, trxMemo?: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    transferEosdt(senderName: string, eosdtAmount: string | number, trxMemo?: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    transferNut(senderName: string, nutAmount: string | number, trxMemo: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    getSurplusDebt(): Promise<string>;
    getBadDebt(): Promise<string>;
    getCollatBalance(): Promise<string>;
    getNutCollatBalance(): Promise<string>;
    getParameters(): Promise<LiquidatorParameters>;
    getSettings(): Promise<LiquidatorSettings>;
}
