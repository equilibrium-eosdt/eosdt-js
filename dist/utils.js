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
