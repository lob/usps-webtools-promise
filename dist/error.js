"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_merge_1 = __importDefault(require("lodash.merge"));
class USPSError extends Error {
    constructor(message, ...additions) {
        super(message);
        lodash_merge_1.default(this, additions);
        this.name = "USPS Webtools Error";
        this.message = message;
    }
}
exports.default = USPSError;
