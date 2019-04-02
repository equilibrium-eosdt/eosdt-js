import { EosdtConnector } from "./connector";
import BigNumber from "bignumber.js";
import { EosdtContractSettings, EosdtContractParameters, Rate } from "./models";
export declare class Positions {
    private contractName;
    private rpc;
    private api;
    constructor(connector: EosdtConnector);
    create(accountName: string, eosAmount: string | number | BigNumber, eosdtAmount: string | number | BigNumber): Promise<any>;
    close(senderAccount: string, positionId: number): Promise<any>;
    delete(senderAccount: string, positionId: number): Promise<any>;
    addCollateral(account: string, amount: string | number | BigNumber, positionId: number): Promise<any>;
    deleteCollateral(sender: string, amount: string | number | BigNumber, positionId: number): Promise<any>;
    generateDebt(account: string, amount: string | number | BigNumber, positionId: number): Promise<any>;
    burnbackDebt(account: string, amount: string | number | BigNumber, positionId: number): Promise<any>;
    marginCall(senderAccount: string, positionId: number): Promise<any>;
    getRates(): Promise<Rate[]>;
    getPositionById(id: number): Promise<Position | undefined>;
    getAllUserPositions(maker: string): Promise<Position[]>;
    getParameters(): Promise<EosdtContractParameters>;
    getSettings(): Promise<EosdtContractSettings>;
}
