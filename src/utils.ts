import BigNumber from "bignumber.js"

export function toEosDate(date: Date): string {
    return date.toISOString().slice(0, -5)
}

export function toBigNumber(amount: BigNumber | string | number): BigNumber {
    if (typeof amount === "string" || typeof amount === "number") {
        return new BigNumber(amount)
    }
    return amount
}