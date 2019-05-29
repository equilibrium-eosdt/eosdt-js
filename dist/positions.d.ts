import BigNumber from "bignumber.js";
import { EosdtContractParameters, EosdtContractSettings, Rate } from "./interfaces/positions-contract";
import { EosdtConnectorInterface } from "./interfaces/connector";
export declare class Positions {
    private contractName;
    private rpc;
    private api;
    constructor(connector: EosdtConnectorInterface);
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
