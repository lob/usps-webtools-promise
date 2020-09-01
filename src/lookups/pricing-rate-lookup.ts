import type USPSClass from "../usps";
import type { ErrorResponse } from "../usps";
import callUSPS from "../utils/request";

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
  Error?: ErrorResponse;
  Package?: {
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

export default async function (
  this: USPSClass,
  pricingRate: PricingRateInput
  // @ts-expect-error I'm checking to see if Postage exists before returning
): Promise<RateV4Response["Package"]["Postage"] | Error> {
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
      this.config,
      parameters
    )) as RateV4Response["Package"];
    if (response && response.Postage) {
      return response.Postage;
    }
    throw new Error("Can't find result");
  } catch (error) {
    return error as Error;
  }
}
