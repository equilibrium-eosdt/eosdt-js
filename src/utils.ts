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

export function balanceToNumber(balance: string[]): number {
    if (Array.isArray(balance) && typeof balance[0] === "string") {
        const x = balance[0].match(/[0-9,\.]+/g)
        if (Array.isArray(x)) {
            return parseFloat(x[0])
        } else
            throw new Error(
                `balanceToNumber(): balance string does not contain numbers. Arg: ${balance}`
            )
    } else
        throw new Error(
            `balanceToNumber(): recieved invalid balance argument. Arg array: ${balance}`
        )
}
