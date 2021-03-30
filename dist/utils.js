"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExternalData = exports.balanceToNumber = exports.amountToAssetString = exports.dateToEosDate = exports.setTransactionParams = void 0;
const util_1 = __importDefault(require("util"));
function setTransactionParams(trxParams) {
    const parameters = {
        permission: "active",
        blocksBehind: 3,
        expireSeconds: 60
    };
    if (!trxParams)
        return parameters;
    if (trxParams.permission)
        parameters.permission = trxParams.permission;
    if (trxParams.blocksBehind)
        parameters.blocksBehind = trxParams.blocksBehind;
    if (trxParams.expireSeconds)
        parameters.expireSeconds = trxParams.expireSeconds;
    return parameters;
}
exports.setTransactionParams = setTransactionParams;
function dateToEosDate(date) {
    return date.toISOString().slice(0, -5);
}
exports.dateToEosDate = dateToEosDate;
function amountToAssetString(amount, assetSymbol, customDecimals) {
    if (typeof amount === "string")
        amount = parseFloat(amount);
    assetSymbol = assetSymbol.toUpperCase();
    let decimals;
    if (assetSymbol === "EOS") {
        decimals = 4;
    }
    else if (assetSymbol === "PBTC") {
        decimals = 8;
    }
    else if (assetSymbol === "EOSDT" || assetSymbol === "NUT" || assetSymbol === "PETH") {
        decimals = 9;
    }
    else if (customDecimals) {
        decimals = customDecimals;
    }
    else
        throw new Error(`${amountToAssetString.name}(): unknown interface symbol ${assetSymbol}`);
    return `${amount.toFixed(decimals)} ${assetSymbol}`;
}
exports.amountToAssetString = amountToAssetString;
function balanceToNumber(balance) {
    if (balance.length === 0)
        return 0;
    if (Array.isArray(balance) && typeof balance[0] === "string") {
        const x = balance[0].match(/[0-9,\.]+/g);
        if (Array.isArray(x)) {
            return parseFloat(x[0]);
        }
        else {
            const logMsg = `${balanceToNumber.name}(): balance string does not contain numbers. ` +
                `Arg: ${balance}`;
            throw new Error(logMsg);
        }
    }
    else {
        const logMsg = `${balanceToNumber.name}(): received invalid balance argument. ` +
            `Arg array: ${balance}`;
        throw new Error(logMsg);
    }
}
exports.balanceToNumber = balanceToNumber;
function firstCharToUpper(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}
function logObject(obj) {
    return util_1.default.inspect(obj, false, null, true);
}
function predicate(raw, keys, name) {
    keys.forEach((key) => {
        if (!raw.hasOwnProperty(key)) {
            const msg = `${firstCharToUpper(name)} format mismatch: missing property "${key}". ` +
                `Received object: \n${logObject(raw)}"`;
            throw new Error(msg);
        }
    });
    const properties = Object.keys(raw);
    if (properties.length !== keys.length) {
        const propertiesDiff = properties.filter((prop) => !keys.includes(prop));
        if (propertiesDiff.length !== 0) {
            const propNames = propertiesDiff.map((p) => `"${p}"`).join(", ");
            let ending = "ies";
            if (propertiesDiff.length === 1)
                ending = "y";
            const msg = `${firstCharToUpper(name)} format mismatch: unknown propert${ending} ` +
                `${propNames}.\nReceived object: \n${logObject(raw)}"`;
            throw new Error(msg);
        }
    }
}
function validateExternalData(data, name, keys, canBeUndefined = false) {
    if (data === undefined)
        if (canBeUndefined)
            return;
        else
            throw new Error(`${firstCharToUpper(name)} does not exist`);
    if (!Array.isArray(data)) {
        predicate(data, keys, name);
        return data;
    }
    data.forEach((entry) => predicate(entry, keys, name));
    return data;
}
exports.validateExternalData = validateExternalData;
