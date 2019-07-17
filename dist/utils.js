"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
function toEosDate(date) {
    return date.toISOString().slice(0, -5);
}
exports.toEosDate = toEosDate;
function toBigNumber(amount) {
    if (typeof amount === "string" || typeof amount === "number") {
        return new bignumber_js_1.default(amount);
    }
    return amount;
}
exports.toBigNumber = toBigNumber;
function balanceToNumber(balance) {
    if (Array.isArray(balance) && typeof balance[0] === "string") {
        const x = balance[0].match(/[0-9,\.]+/g);
        if (Array.isArray(x)) {
            return parseFloat(x[0]);
        }
        else
            throw new Error(`balanceToNumber(): balance string does not contain numbers. Arg: ${balance}`);
    }
    else
        throw new Error(`balanceToNumber(): recieved invalid balance argument. Arg array: ${balance}`);
}
exports.balanceToNumber = balanceToNumber;
