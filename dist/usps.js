"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _config;
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = require("querystring");
const xmlbuilder2_1 = require("xmlbuilder2");
const error_1 = __importDefault(require("./error"));
const request_1 = __importDefault(require("./request"));
const proper_case_1 = __importDefault(require("./proper-case"));
async function callUSPS(api, method, property, config, parameters) {
    const requestName = `${method}Request`;
    const responseName = `${method}Response`;
    const object = {
        [requestName]: {
            ...parameters,
            "@USERID": config.userId,
        },
    };
    const xml = xmlbuilder2_1.create(object).end();
    const qs = querystring_1.stringify({
        API: api,
        XML: xml,
    });
    const options = {
        hostname: "secure.shippingapis.com",
        method: "GET",
        path: `ShippingAPI.dll?${qs}`,
    };
    let uspsResponse;
    try {
        uspsResponse = await request_1.default(options);
    }
    catch (error) {
        return new error_1.default(error.message, error, {
            method: api,
            during: "request",
        });
    }
    if (uspsResponse.Error) {
        return new error_1.default(uspsResponse.Error.Description.trim(), uspsResponse.Error);
    }
    let specificResult;
    if (uspsResponse &&
        uspsResponse[responseName] &&
        uspsResponse[responseName][property]) {
        specificResult = uspsResponse[responseName][property];
    }
    if (specificResult.Error) {
        return new error_1.default(specificResult.Error.Description.trim(), specificResult.Error);
    }
    return specificResult;
}
function returnAddress(Address, propercase) {
    if (Address.Address2 || Address.Address1) {
        const line2 = Address.Address2;
        Address.Address2 = Address.Address1;
        Address.Address1 = line2;
    }
    if (propercase) {
        Address.Address1 = proper_case_1.default(Address.Address1);
        Address.Address2 = proper_case_1.default(Address.Address2);
        Address.City = proper_case_1.default(Address.City);
    }
    return Address;
}
class default_1 {
    constructor(config) {
        _config.set(this, void 0);
        if (!(config && config.userId)) {
            throw new error_1.default("Must pass USPS userId");
        }
        __classPrivateFieldSet(this, _config, {
            ...config,
        });
    }
    async verify(address) {
        const parameters = {
            Revision: 1,
            Address: {
                FirmName: address.firm_name,
                Address1: address.street2 || "",
                Address2: address.street1,
                City: address.city,
                State: address.state,
                Zip5: address.zip,
                Zip4: address.zip4 || "",
            },
        };
        if (address.urbanization) {
            parameters.Address.Urbanization = address.urbanization;
        }
        let response;
        try {
            response = (await callUSPS("Verify", "AddressValidate", "Address", __classPrivateFieldGet(this, _config), parameters));
            return returnAddress(response, __classPrivateFieldGet(this, _config).properCase);
        }
        catch (error) {
            return new error_1.default(error);
        }
    }
    async zipCodeLookup(address) {
        const parameters = {
            Address: {
                Address1: address.street2 || "",
                Address2: address.street1,
                City: address.city,
                State: address.state,
            },
        };
        let response;
        try {
            response = (await callUSPS("ZipCodeLookup", "ZipCodeLookup", "Address", __classPrivateFieldGet(this, _config), parameters));
            return returnAddress(response, __classPrivateFieldGet(this, _config).properCase);
        }
        catch (error) {
            return new error_1.default(error);
        }
    }
    async pricingRateV4(pricingRate) {
        const parameters = {
            Package: {
                "@ID": "1ST",
                Service: pricingRate.Service || "PRIORITY",
                ZipOrigination: pricingRate.ZipOrigination || "55401",
                ZipDestination: pricingRate.ZipDestination || "",
                Pounds: pricingRate.Pounds || "",
                Ounces: pricingRate.Ounces || "",
                Container: pricingRate.Container || "",
                Width: pricingRate.Width,
                Length: pricingRate.Length,
                Height: pricingRate.Height,
                Girth: pricingRate.Girth,
                Machinable: pricingRate.Machinable,
            },
        };
        let response;
        try {
            response = (await callUSPS("RateV4", "RateV4", "Package", __classPrivateFieldGet(this, _config), parameters));
            return response.Postage;
        }
        catch (error) {
            return new error_1.default(error);
        }
    }
    async cityStateLookup(zip) {
        const object = {
            ZipCode: {
                Zip5: zip,
            },
        };
        let response;
        try {
            response = (await callUSPS("CityStateLookup", "CityStateLookup", "ZipCode", __classPrivateFieldGet(this, _config), object));
            return returnAddress(response, __classPrivateFieldGet(this, _config).properCase);
        }
        catch (error) {
            return new error_1.default(error);
        }
    }
}
exports.default = default_1;
_config = new WeakMap();
