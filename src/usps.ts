/* eslint-disable camelcase */
import { RequestOptions } from "https";
import { stringify } from "querystring";
import { create } from "xmlbuilder2";
import request from "./request";
import properCase from "./proper-case";

export interface AddressValidateRequest {
  Address: {
    Address1?: string;
    Address2?: string;
    City?: string;
    FirmName?: string;
    State?: string;
    Urbanization?: string;
    Zip4?: string;
    Zip5?: string;
  };
  Revision: number;
}

export interface AddressValidateResponse {
  Address1?: string;
  Address2?: string;
  Address2Abbreviation?: string;
  Business?: string;
  CarrierRoute?: string;
  CentralDeliveryPoint?: string;
  City?: string;
  CityAbbreviation?: string;
  DPVCMRA?: string;
  DPVConfirmation?: string;
  DPVFootnotes?: string;
  DeliveryPoint?: string;
  FirmName?: string;
  Footnotes?: string;
  State?: string;
  Urbanization?: string;
  Vacant?: string;
  Zip4?: string;
  Zip5?: string;
}

export interface ZipCodeLookupRequest {
  Address: {
    Address1?: string;
    Address2?: string;
    City?: string;
    FirmName?: string;
    State?: string;
    Zip4?: string;
    Zip5?: string;
  };
}

export interface ZipCodeLookupResponse {
  Address: {
    Address1?: string;
    Address2?: string;
    City?: string;
    FirmName?: string;
    State?: string;
    Urbanization?: string;
    Zip4?: string;
    Zip5?: string;
  };
}

export interface CityStateLookupRequest {
  ZipCode: {
    Zip5: string;
  };
}

export interface CityStateLookupResponse {
  ZipCode: {
    City: string;
    State: string;
    Zip5: string;
  };
}

export interface ErrorResponse {
  Error: {
    Description: string;
    HelpContext: string;
    HelpFile: string;
    Number: string;
    Source: string;
  };
}

export interface RateV4Request {
  Package: {
    // @ID is a special tag for xmlbuilder
    "@ID": string;
    AmountToCollect?: string;
    Container: string;
    Content?: {
      ContentDescription?: string;
      ContentType?: string;
    };
    DropOffTime?: string;
    FirstClassMailType?: string;
    Girth?: string;
    GroundOnly?: boolean;
    Height?: string;
    Length?: string;
    Machinable?: string;
    Ounces: string;
    Pounds: string;
    ReturnDimensionalWeight?: boolean;
    ReturnLocations?: boolean;
    ReturnServiceInfo?: boolean;
    Service: string;
    ShipDate?: {
      Option?: string;
    };
    SortBy?: string;
    SpecialServices?: {
      SpecialService?: string;
    };
    TrackingRetentionPeriod?: string;
    Value?: string;
    Width?: string;
    ZipDestination: string;
    ZipOrigination: string;
  };
}
export interface RateV4Response {
  Package: {
    Container?: string;
    Error?: string;
    FirstClassMailType?: string;
    Girth?: string;
    Height?: string;
    Length?: string;
    Machinable?: string;
    Ounces: number;
    Postage: {
      CLASSID?: string;
      CommercialPlusRate?: string;
      CommercialRate?: string;
      DimensionalWeightCommercialPlusRate?: string;
      DimensionalWeightRate?: string;
      MailService?: string;
      MaxDimensions?: string;
      Rate?: string;
      ServiceInformation?: string;
      SpecialServices?: [
        {
          SpecialService?: {
            Available?: string;
            AvailableCPP?: string;
            AvailableOnline?: string;
            DeclaredValueRequired?: string;
            DueSenderRequired?: string;
            Price?: string;
            PriceCPP?: string;
            PriceOnline?: string;
            ServiceID?: string;
            ServiceName?: string;
          };
        }
      ];
    };
    Pounds: number;
    Restriction: {
      Restrictions?: string;
    };
    Width?: string;
    ZipDestination: string;
    ZipOrigination: string;
    Zone?: string;
  };
}

export interface PricingRateInput {
  Container?: string;
  Girth?: string;
  Height?: string;
  Length?: string;
  Machinable?: string;
  Ounces?: string;
  Pounds?: string;
  Service?: string;
  Size?: string;
  Width?: string;
  ZipDestination?: string;
  ZipOrigination?: string;
}

export interface Config {
  properCase: boolean;
  staging: boolean;
  userId: string;
}

export interface AddressRequest {
  city?: string;
  firm_name?: string;
  state?: string;
  street1?: string;
  street2?: string;
  urbanization?: string;
  zip?: string;
  zip4?: string;
}

export interface AddressResponse {
  Zip4?: string;
  Zip5?: string;
  city?: string;
  firm_name?: string;
  state?: string;
  street1?: string;
  street2?: string;
  urbanization?: string;
  zip?: string;
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
    return new Error(error);
  }

  // may have a root-level error
  if (uspsResponse.Error) {
    return new Error(uspsResponse.Error);
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
    return new Error(specificResult.Error);
  }

  return specificResult;
}

const renameKeys = (keysMap: any, object: any): AddressResponse =>
  Object.keys(object).reduce(
    (accumulator, key) => ({
      ...accumulator,
      ...{ [keysMap[key] || key]: object[key] },
    }),
    {}
  );

const returnAddress = (
  Address:
    | AddressValidateResponse
    | ZipCodeLookupResponse
    | CityStateLookupResponse
    | RateV4Response
    | ErrorResponse
    | Error,
  propercase: boolean
): AddressResponse => {
  const keysMap = {
    Address1: "street2",
    Address2: "street1",
    Address2Abbreviation: "address2_abbreviation",
    Business: "business",
    CarrierRoute: "carrier_route",
    CentralDeliveryPoint: "central_delivery_point",
    City: "city",
    CityAbbreviation: "city_abbreviation",
    DPVCMRA: "dpvcmra",
    DPVConfirmation: "dpv_confirmation",
    DPVFalse: "dpv_false",
    DPVFootnotes: "dpv_footnotes",
    DeliveryPoint: "delivery_point",
    FirmName: "firm_name",
    Footnotes: "footnotes",
    State: "state",
    Urbanization: "urbanization",
    Vacant: "vacant",
  };
  const newAddress: AddressResponse = renameKeys(keysMap, Address);

  if (typeof newAddress.Zip4 === "object") {
    // If Zip4 is not found, USPS returns a {}, change it to a blank string
    newAddress.Zip4 = "";
    newAddress.zip = newAddress.Zip5;
  } else {
    // Combine the zip5 and zip4 into zip
    newAddress.zip = `${newAddress.Zip5}-${newAddress.Zip4}`;
  }

  if (propercase) {
    newAddress.street1 = properCase(
      newAddress.street1 ? newAddress.street1 : ""
    );
    newAddress.street2 = properCase(
      newAddress.street2 ? newAddress.street2 : ""
    );
    newAddress.city = properCase(newAddress.city ? newAddress.city : "");
  }
  return newAddress;
};

export default class {
  #config: Config;

  constructor(config: Config) {
    if (!(config && config.userId)) {
      throw new Error("Must pass USPS userId");
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
  async verify(address: AddressRequest): Promise<AddressResponse | Error> {
    const parameters: AddressValidateRequest = {
      Address: {
        Address1: address.street2 || "",
        Address2: address.street1,
        City: address.city,
        FirmName: address.firm_name,
        State: address.state,
        Zip4: address.zip4 || "",
        Zip5: address.zip,
      },
      Revision: 1,
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
      return new Error(error);
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
  async zipCodeLookup(address: AddressRequest) {
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
      return new Error(error);
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
        Container: pricingRate.Container || "",
        Girth: pricingRate.Girth,
        Height: pricingRate.Height,
        Length: pricingRate.Length,
        Machinable: pricingRate.Machinable,
        Ounces: pricingRate.Ounces || "",
        Pounds: pricingRate.Pounds || "",
        Service: pricingRate.Service || "PRIORITY",
        Width: pricingRate.Width,
        ZipDestination: pricingRate.ZipDestination || "",
        ZipOrigination: pricingRate.ZipOrigination || "55401",
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
      return new Error(error);
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
      return new Error(error);
    }
  }
}
