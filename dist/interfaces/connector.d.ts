import { JsonRpc, Api } from "eosjs";
export interface EosdtConnectorInterface {
    rpc: JsonRpc;
    api: Api;
}
