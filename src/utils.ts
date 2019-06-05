import BigNumber from "bignumber.js"

export function toEosDate(date: Date): string {
  return date.toISOString().slice(0, -5)
}

export function toBigNumber(number: BigNumber | string | number): BigNumber {
  if (typeof number === "string" || typeof number === "number") {
    return new BigNumber(number)
  }
  return number
}