import { EosdtConnectorInterface } from "./interfaces/connector";
import { BpPosition } from "./interfaces/governance";
import { ITrxParamsArgument } from "./interfaces/transaction";
export declare class BpManager {
    private contractName;
    private rpc;
    private api;
    constructor(connector: EosdtConnectorInterface);
    getAllBpPositions(): Promise<BpPosition[]>;
    getBpPosition(bpName: string): Promise<BpPosition | undefined>;
    registerBlockProducer(bpName: string, rewardAmount: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    changeBlockProducerReward(bpName: string, rewardAmount: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    unregisterBlockProducer(bpName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    depositEos(fromAccount: string, bpName: string, eosAmount: number | string, transactionParams?: ITrxParamsArgument): Promise<any>;
}
