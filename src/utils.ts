import util from "util"
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

function firstCharToUpper(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

function logObject(obj: object): string {
    return util.inspect(obj, false, null, true)
}

function predicate(raw: object, keys: string[], name: string): void {
    keys.forEach(key => {
        if (!raw.hasOwnProperty(key)) {
            const msg =
                `${firstCharToUpper(name)} format mismatch: missing property "${key}". ` +
                `Received object: \n${logObject(raw)}"`
            throw new Error(msg)
        }
    })

    const properties = Object.keys(raw)
    if (properties.length !== keys.length) {
        const propertiesDiff = properties.filter(prop => !keys.includes(prop))

        if (propertiesDiff.length !== 0) {
            const propNames = propertiesDiff.map(p => `"${p}"`).join(", ")
            let ending = "ies"
            if (propertiesDiff.length === 1) ending = "y"
            const msg =
                `${firstCharToUpper(name)} format mismatch: unknown propert${ending} ` +
                `${propNames}.\nReceived object: \n${logObject(raw)}"`
            throw new Error(msg)
        }
    }
}

export function validateExternalData(
    data: any,
    name: string,
    keys: string[],
    canBeUndefined = false
): any {
    if (data === undefined)
        if (canBeUndefined) return
        else throw new Error(`${firstCharToUpper(name)} does not exist`)

    if (!Array.isArray(data)) {
        predicate(data, keys, name)
        return data
    }

    data.forEach((entry: any) => predicate(entry, keys, name))
    return data
}
