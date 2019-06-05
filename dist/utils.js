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
function toBigNumber(number) {
    if (typeof number === "string" || typeof number === "number") {
        return new bignumber_js_1.default(number);
    }
    return number;
}
exports.toBigNumber = toBigNumber;
