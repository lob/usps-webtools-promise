import verify from "./address-validate";
import zipCodeLookup from "./lookups/zip-code-lookup";
import cityStateLookup from "./lookups/city-state-lookup";
import pricingRateLookup from "./lookups/pricing-rate-lookup";

export interface ErrorResponse {
  Description: string;
  HelpContext: string;
  HelpFile: string;
  Number: string;
  Source: string;
}

export interface Config {
  properCase: boolean;
  staging: boolean;
  userId: string;
}

export interface Address {
  Address1?: string;
  Address2?: string;
  City?: string;
  FirmName?: string;
  State?: string;
  Urbanization?: string;
  Zip4?: string;
  Zip5?: string;
}

export default class {
  config: Config;

  constructor(config: Config) {
    if (!(config && config.userId)) {
      throw new Error("Must pass USPS userId");
    }
    this.config = {
      ...config,
    };
  }

  public cityStateLookup = cityStateLookup;

  public pricingRateV4 = pricingRateLookup;

  public zipCodeLookup = zipCodeLookup;

  public verify = verify;
}
