import { ITrxParams, ITrxParamsArgument } from "./interfaces/transaction"

export function setTransactionParams(trxParams?: ITrxParamsArgument): ITrxParams {
    const parameters: ITrxParams = {
        permission: "active",
        blocksBehind: 3,
        expireSeconds: 60
    }

    if (!trxParams) return parameters

    if (trxParams.permission) parameters.permission = trxParams.permission
    if (trxParams.blocksBehind) parameters.blocksBehind = trxParams.blocksBehind
    if (trxParams.expireSeconds) parameters.expireSeconds = trxParams.expireSeconds
    return parameters
}

export function dateToEosDate(date: Date): string {
    return date.toISOString().slice(0, -5)
}

export function amountToAssetString(
    amount: number | string,
    assetSymbol: string,
    customDecimals?: number
): string {
    if (typeof amount === "string") amount = parseFloat(amount)
    assetSymbol = assetSymbol.toUpperCase()

    let decimals
    if (assetSymbol === "EOS") {
        decimals = 4
    } else if (assetSymbol === "EOSDT" || assetSymbol === "NUT") {
        decimals = 9
    } else if (customDecimals) {
        decimals = customDecimals
    } else
        throw new Error(
            `${amountToAssetString.name}(): unknown interface symbol ${assetSymbol}`
        )

    return `${amount.toFixed(decimals)} ${assetSymbol}`
}

export function balanceToNumber(balance: string[]): number {
    if (balance.length === 0) return 0

    if (Array.isArray(balance) && typeof balance[0] === "string") {
        const x = balance[0].match(/[0-9,\.]+/g)
        if (Array.isArray(x)) {
            return parseFloat(x[0])
        } else {
            const logMsg =
                `${balanceToNumber.name}(): balance string does not contain numbers. ` +
                `Arg: ${balance}`
            throw new Error(logMsg)
        }
    } else {
        const logMsg =
            `${balanceToNumber.name}(): received invalid balance argument. ` +
            `Arg array: ${balance}`
        throw new Error(logMsg)
    }
}
