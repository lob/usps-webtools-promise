/* eslint-disable sonarjs/no-duplicate-string */
import type USPSClass from "../usps";
import type { ErrorResponse } from "../usps";
import callUSPS from "../utils/request";

export interface RateV4Request {
  Package: {
    // @ID is a special tag for xmlbuilder
    "@ID": string;
    AmountToCollect?: string;
    Container:
      | "VARIABLE"
      | "FLAT RATE ENVELOPE"
      | "PADDED FLAT RATE ENVELOPE"
      | "LEGAL FLAT RATE ENVELOPE"
      | "SM FLAT RATE ENVELOPE"
      | "WINDOW FLAT RATE ENVELOPE"
      | "GIFT CARD FLAT RATE ENVELOPE"
      | "SM FLAT RATE BOX"
      | "MD FLAT RATE BOX"
      | "LG FLAT RATE BOX"
      | "REGIONALRATEBOXA"
      | "REGIONALRATEBOXB"
      | "CUBIC PARCELS"
      | "CUBIC SOFT PACK";
    Content?: {
      ContentDescription?: "BEES" | "DAYOLDPOULTRY" | "ADULTBIRDS" | "OTHER";
      ContentType?:
        | "HAZMAT"
        | "CREMATEDREMAINS"
        | "FRAGILE"
        | "PERISHABLE"
        | "PHARMACEUTICALS"
        | "MEDICAL SUPPLIES"
        | "LIVES";
    };
    DropOffTime?: string;
    FirstClassMailType?:
      | "LETTER"
      | "FLAT"
      | "PACKAGE SERVICE RETAIL"
      | "POSTCARD"
      | "PACKAGE SERVICE";
    Girth?: string;
    GroundOnly?: boolean;
    Height?: string;
    Length?: string;
    Machinable?: boolean;
    Ounces: string;
    Pounds: string;
    ReturnDimensionalWeight?: boolean;
    ReturnLocations?: boolean;
    ReturnServiceInfo?: boolean;
    Service:
      | "FIRST CLASS COMMERCIAL"
      | "FIRST CLASS"
      | "FIRST CLASS COMMERCIAL"
      | "FIRST CLASS HFP COMMERCIAL"
      | "PARCEL SELECT GROUND"
      | "PRIORITY"
      | "PRIORITY COMMERCIAL"
      | "PRIORITY CPP"
      | "PRIORITY HFP COMMERCIAL"
      | "PRIORITY HFP CPP"
      | "PRIORITY MAIL EXPRESS"
      | "PRIORITY MAIL EXPRESS COMMERCIAL"
      | "PRIORITY MAIL EXPRESS CPP"
      | "PRIORITY MAIL EXPRESS SH"
      | "PRIORITY MAIL EXPRESS SH COMMERCIAL"
      | "PRIORITY MAIL EXPRESS HFP"
      | "PRIORITY MAIL EXPRESS HFP COMMERCIAL"
      | "PRIORITY MAIL EXPRESS HFP CPP"
      | "PRIORITY MAIL CUBIC"
      | "RETAIL GROUND"
      | "MEDIA"
      | "LIBRARY"
      | "ALL"
      | "ONLINE"
      | "PLUS"
      | "BPM";
    ShipDate?: {
      Option?: "PEMSH" | "HFP";
    };
    SortBy?: "LETTER" | "LARGEENVELOPE" | "PACKAGE" | "FLATRATE";
    SpecialServices?: {
      SpecialService?:
        | "100"
        | "101"
        | "102"
        | "103"
        | "104"
        | "105"
        | "106"
        | "108"
        | "109"
        | "110"
        | "112"
        | "118"
        | "119"
        | "120"
        | "125"
        | "155"
        | "156"
        | "160"
        | "161"
        | "170"
        | "171"
        | "172"
        | "173"
        | "174"
        | "175"
        | "176"
        | "177"
        | "178"
        | "179"
        | "180"
        | "181"
        | "182"
        | "190";
    };
    TrackingRetentionPeriod?: string;
    Value?: string;
    Width?: string;
    ZipDestination: string;
    ZipOrigination: string;
  };
}

interface RateV4Postage {
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
}

interface RateV4Package {
  Container?: string;
  Error?: string;
  FirstClassMailType?: string;
  Girth?: string;
  Height?: string;
  Length?: string;
  Machinable?: string;
  Ounces: number;
  Postage: RateV4Postage;
  Pounds: number;
  Restriction: {
    Restrictions?: string;
  };
  Width?: string;
  ZipDestination: string;
  ZipOrigination: string;
  Zone?: string;
}

export interface RateV4Response {
  Error?: ErrorResponse;
  Package?: RateV4Package;
}

export default async function (
  this: USPSClass,
  pricingRate: RateV4Request
): Promise<RateV4Postage | Error> {
  let response: RateV4Response;
  try {
    response = (await callUSPS(
      "RateV4",
      "RateV4",
      "Package",
      this.config,
      pricingRate
    )) as RateV4Response;
    if (response && response.Package) {
      return response.Package.Postage;
    }
    throw new Error("Can't find result");
  } catch (error) {
    return error as Error;
  }
}
