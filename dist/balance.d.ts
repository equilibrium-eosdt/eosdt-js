import { EosdtConnectorInterface } from "./interfaces/connector";
export declare class BalanceGetter {
    private rpc;
    constructor(connector: EosdtConnectorInterface);
    getNut(account: string): Promise<number>;
    getEosdt(account: string): Promise<number>;
    getEos(account: string): Promise<number>;
}
