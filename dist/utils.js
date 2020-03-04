"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    else if (assetSymbol === "EOSDT" || assetSymbol === "NUT") {
        decimals = 9;
    }
    else if (customDecimals) {
        decimals = customDecimals;
    }
    else
        throw new Error(`${amountToAssetString.name}(): unknown interface
    interfacesymbol ${assetSymbol}`);
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
        else
            throw new Error(`balanceToNumber(): balance string does not contain numbers. Arg: ${balance}`);
    }
    else
        throw new Error(`balanceToNumber(): received invalid balance argument. Arg array: ${balance}`);
}
exports.balanceToNumber = balanceToNumber;
