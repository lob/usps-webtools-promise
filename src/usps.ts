import { RequestOptions } from "https";
import { stringify } from "querystring";
import { create } from "xmlbuilder2";
import {
  AddressValidateRequest,
  AddressValidateResponse,
  CityStateLookupRequest,
  CityStateLookupResponse,
  ZipCodeLookupRequest,
  ZipCodeLookupResponse,
  ErrorResponse,
  RateV4Request,
  RateV4Response,
} from "../types/usps";
import USPSError from "./error";
import request from "./request";
import properCase from "./proper-case";

interface AddressInput {
  firm_name?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  zip4?: string;
  urbanization?: string;
}

interface PricingRateInput {
  Service?: string;
  ZipOrigination?: string;
  ZipDestination?: string;
  Pounds?: string;
  Ounces?: string;
  Container?: string;
  Size?: string;
  Width?: string;
  Length?: string;
  Height?: string;
  Girth?: string;
  Machinable?: string;
}

interface Config {
  userId: string;
  properCase: boolean;
}

/**
  Method to call USPS
*/
async function callUSPS(
  api: string,
  method: string,
  property: string,
  config: Config,
  parameters:
    | AddressValidateRequest
    | ZipCodeLookupRequest
    | CityStateLookupRequest
    | RateV4Request
): Promise<
  | AddressValidateResponse
  | ZipCodeLookupResponse
  | CityStateLookupResponse
  | RateV4Response
  | ErrorResponse
  | Error
> {
  const requestName = `${method}Request`;
  const responseName = `${method}Response`;

  // Create the XML object
  const object = {
    [requestName]: {
      ...parameters,
      "@USERID": config.userId,
    },
  };
  const xml = create(object).end();

  // Create the QueryString
  const qs = stringify({
    API: api,
    XML: xml,
  });

  const options: RequestOptions = {
    hostname: "secure.shippingapis.com",
    method: "GET",
    path: `ShippingAPI.dll?${qs}`,
  };

  let uspsResponse: any;
  try {
    uspsResponse = await request(options);
  } catch (error) {
    return new USPSError(error.message, error, {
      method: api,
      during: "request",
    });
  }

  // may have a root-level error
  if (uspsResponse.Error) {
    return new USPSError(
      uspsResponse.Error.Description.trim(),
      uspsResponse.Error
    );
  }

  /**
    walking the result, to drill into where we want
    resultDotNotation looks like 'key.key'
    though it may actually have arrays, so returning first cell
  */
  let specificResult;
  if (
    uspsResponse &&
    uspsResponse[responseName] &&
    uspsResponse[responseName][property]
  ) {
    specificResult = uspsResponse[responseName][property];
  }

  // specific error handling
  if (specificResult.Error) {
    return new USPSError(
      specificResult.Error.Description.trim(),
      specificResult.Error
    );
  }

  return specificResult;
}

function returnAddress(Address: any, propercase: boolean) {
  // Switch line 1 and 2
  if (Address.Address2 || Address.Address1) {
    const line2 = Address.Address2;
    Address.Address2 = Address.Address1;
    Address.Address1 = line2;
  }

  if (propercase) {
    Address.Address1 = properCase(Address.Address1 as string);
    Address.Address2 = properCase(Address.Address2 as string);
    Address.City = properCase(Address.City as string);
  }
  return Address;
}

export default class {
  #config: Config;

  constructor(config: Config) {
    if (!(config && config.userId)) {
      throw new USPSError("Must pass USPS userId");
    }
    this.#config = {
      ...config,
    };
  }

  /**
    Verifies an address

    @param {Object} address The address to be verified
    @param {String} address.street1 Street
    @param {String} [address.street2] Secondary street (apartment, etc)
    @param {String} address.city City
    @param {String} address.state State (two-letter, capitalized)
    @param {String} address.zip Zipcode
    @returns {Object} instance of module
  */
  async verify(address: AddressInput) {
    const parameters: AddressValidateRequest = {
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

    let response: AddressValidateResponse;
    try {
      response = (await callUSPS(
        "Verify",
        "AddressValidate",
        "Address",
        this.#config,
        parameters
      )) as AddressValidateResponse;
      return returnAddress(response, this.#config.properCase);
    } catch (error) {
      return new USPSError(error);
    }
  }

  /**
    Looks up a zipcode, given an address

    @param {Object} address Address to find zipcode for
    @param {String} address.street1 Street
    @param {String} [address.street2] Secondary street (apartment, etc)
    @param {String} address.city City
    @param {String} address.state State (two-letter, capitalized)
    @param {String} address.zip Zipcode
    @returns {Object} instance of module
  */
  async zipCodeLookup(address: AddressInput) {
    const parameters: ZipCodeLookupRequest = {
      Address: {
        Address1: address.street2 || "",
        Address2: address.street1,
        City: address.city,
        State: address.state,
      },
    };

    let response;
    try {
      response = (await callUSPS(
        "ZipCodeLookup",
        "ZipCodeLookup",
        "Address",
        this.#config,
        parameters
      )) as ZipCodeLookupResponse["Address"];
      return returnAddress(response, this.#config.properCase);
    } catch (error) {
      return new USPSError(error);
    }
  }

  /**
    Pricing Rate Lookup, based on USPS RateV4

    @param {Object} information about pricing Rate
    @returns {Object} instance of module
  */
  async pricingRateV4(pricingRate: PricingRateInput) {
    const parameters: RateV4Request = {
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

    let response: RateV4Response["Package"];
    try {
      response = (await callUSPS(
        "RateV4",
        "RateV4",
        "Package",
        this.#config,
        parameters
      )) as RateV4Response["Package"];
      return response.Postage;
    } catch (error) {
      return new USPSError(error);
    }
  }

  /**
    City State lookup, based on zip

    @param {String} zip Zipcode to retrieve city & state for
    @returns {Object} instance of module
  */
  async cityStateLookup(zip: string) {
    const object: CityStateLookupRequest = {
      ZipCode: {
        Zip5: zip,
      },
    };

    let response: CityStateLookupResponse["ZipCode"];
    try {
      response = (await callUSPS(
        "CityStateLookup",
        "CityStateLookup",
        "ZipCode",
        this.#config,
        object
      )) as CityStateLookupResponse["ZipCode"];
      return returnAddress(response, this.#config.properCase);
    } catch (error) {
      return new USPSError(error);
    }
  }
}
