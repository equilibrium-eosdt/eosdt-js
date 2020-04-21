import { EosdtConnectorInterface } from "./interfaces/connector";
import { SRContractParams, SRContractSettings, SRPosition } from "./interfaces/savings-rate";
import { ITrxParamsArgument } from "./interfaces/transaction";
/**
 * A wrapper class to invoke actions of Equilibrium Savings Rate contract
 */
export declare class SavingsRateContract {
    private name;
    private rpc;
    private api;
    /**
     * A wrapper class to invoke actions of Equilibrium Savings Rate contract
     */
    constructor(connector: EosdtConnectorInterface);
    /**
     * Transfers EOSDT from user to Savings Rate contract
     */
    stake(senderName: string, eosdtAmount: string | number, trxMemo?: string, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * Returns EOSDT from Savings Rate contract to account balance
     */
    unstake(toAccount: string, eosdtAmount: string | number, transactionParams?: ITrxParamsArgument): Promise<any>;
    /**
     * @returns An array of all positions on Savings Rate contract
     */
    getAllPositions(): Promise<SRPosition[]>;
    /**
     * @returns A Savings Rate position object with given id
     */
    getPositionById(id: number): Promise<SRPosition | undefined>;
    /**
     * @returns Array of all positions objects, created by the maker
     */
    getUserPositions(maker: string): Promise<SRPosition[]>;
    /**
     * @returns Positions contract parameters
     */
    getParameters(): Promise<SRContractParams>;
    /**
     * @returns Positions contract settings
     */
    getSettings(): Promise<SRContractSettings>;
}
