"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const xmlbuilder2_1 = require("xmlbuilder2");
const error_1 = __importDefault(require("./error"));
exports.default = async (options) => {
    return new Promise((resolve, reject) => {
        const request = https_1.default.request(options, (response) => {
            let body = "";
            response.on("data", (chunk) => (body += chunk));
            response.on("end", () => {
                try {
                    const xml = xmlbuilder2_1.create(body);
                    resolve(xml.end({ format: "object" }));
                }
                catch (error) {
                    reject(new error_1.default("XML Parse", error, body));
                }
            });
        });
        request.on("error", (error) => {
            reject(new error_1.default("Request Error", error));
        });
        request.end();
    });
};
