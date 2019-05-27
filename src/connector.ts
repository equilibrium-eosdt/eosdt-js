import JsSignatureProvider from "eosjs/dist/eosjs-jssig"
import Fetch from "node-fetch"
import { JsonRpc, Api } from "eosjs"
import { Positions, Liquidator, Governance } from "."
import {TextDecoder, TextEncoder} from "text-encoding"

export class EosdtConnector {
  public readonly rpc: JsonRpc
  public readonly api: Api

  constructor(nodeAddress: string, privateKeys: string[]) {
    const fetch: any = Fetch // Workaroung to avoid incompatibility of fetch types in 'eosjs' and 'node-fetch'
    this.rpc = new JsonRpc(nodeAddress, { fetch })
    const signatureProvider = new JsSignatureProvider(privateKeys)
    this.api = new Api({
      rpc: this.rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder(),
    })
  }

  public getPositions(): Positions {
    return new Positions(this)
  }

  public getLiquidator(): Liquidator {
    return new Liquidator(this)
  }

  public getGovernance(): Governance {
    return new Governance(this)
  }
}