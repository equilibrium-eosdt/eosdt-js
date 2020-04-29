import { Api, JsonRpc } from "eosjs"

export interface EosdtConnectorInterface {
    rpc: JsonRpc
    api: Api
}
