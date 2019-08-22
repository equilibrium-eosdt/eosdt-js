import { EosdtConnectorInterface } from "./interfaces/connector";
import { EosdtContractParameters, EosdtContractSettings, EosdtPosition, TokenRate } from "./interfaces/positions-contract";
import { ITrxParamsArgument } from "./interfaces/transaction";
export declare class PositionsContract {
    private contractName;
    private rpc;
    private api;
    constructor(connector: EosdtConnectorInterface);
    create(accountName: string, eosAmount: string | number, eosdtAmount: string | number, transactionParams?: ITrxParamsArgument): Promise<any>;
    createEmptyPosition(accountName: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    close(senderAccount: string, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    del(creator: string, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    give(giverAccount: string, receiver: string, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    addCollateral(senderName: string, amount: string | number, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    deleteCollateral(senderName: string, amount: string | number, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    generateDebt(senderName: string, amount: string | number, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    burnbackDebt(senderName: string, amount: string | number, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    marginCall(senderName: string, positionId: number, transactionParams?: ITrxParamsArgument): Promise<any>;
    getContractEosAmount(): Promise<number>;
    getRates(): Promise<TokenRate[]>;
    getPositionById(id: number): Promise<EosdtPosition | undefined>;
    getAllUserPositions(maker: string): Promise<EosdtPosition[]>;
    getParameters(): Promise<EosdtContractParameters>;
    getSettings(): Promise<EosdtContractSettings>;
}
