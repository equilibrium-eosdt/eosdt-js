import { ITrxParams, ITrxParamsArgument } from "./interfaces/transaction";
export declare function setTransactionParams(trxParams?: ITrxParamsArgument): ITrxParams;
export declare function dateToEosDate(date: Date): string;
export declare function amountToAssetString(amount: number | string, assetSymbol: string): string;
export declare function balanceToNumber(balance: string[]): number;
