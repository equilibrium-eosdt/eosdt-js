"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toEosDate(date) {
    return date.toISOString().slice(0, -5);
}
exports.toEosDate = toEosDate;
