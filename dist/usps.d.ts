import USPSError from "./error";
export interface AddressValidateRequest {
    Revision: number;
    Address: {
        FirmName?: string;
        Address1?: string;
        Address2?: string;
        City?: string;
        State?: string;
        Urbanization?: string;
        Zip5?: string;
        Zip4?: string;
    };
}
export interface AddressValidateResponse {
    FirmName?: string;
    Address1?: string;
    Address2?: string;
    Address2Abbreviation?: string;
    City?: string;
    CityAbbreviation?: string;
    State?: string;
    Urbanization?: string;
    Zip5?: string;
    Zip4?: string;
    DeliveryPoint?: string;
    CarrierRoute?: string;
    Footnotes?: string;
    DPVConfirmation?: string;
    DPVCMRA?: string;
    DPVFootnotes?: string;
    Business?: string;
    CentralDeliveryPoint?: string;
    Vacant?: string;
}
export interface ZipCodeLookupRequest {
    Address: {
        FirmName?: string;
        Address1?: string;
        Address2?: string;
        City?: string;
        State?: string;
        Zip5?: string;
        Zip4?: string;
    };
}
export interface ZipCodeLookupResponse {
    Address: {
        FirmName?: string;
        Address1?: string;
        Address2?: string;
        City?: string;
        State?: string;
        Urbanization?: string;
        Zip5?: string;
        Zip4?: string;
    };
}
export interface CityStateLookupRequest {
    ZipCode: {
        Zip5: string;
    };
}
export interface CityStateLookupResponse {
    ZipCode: {
        Zip5: string;
        City: string;
        State: string;
    };
}
export interface ErrorResponse {
    Error: {
        Number: string;
        Source: string;
        Description: string;
        HelpFile: string;
        HelpContext: string;
    };
}
export interface RateV4Request {
    Package: {
        "@ID": string;
        Service: string;
        FirstClassMailType?: string;
        ZipOrigination: string;
        ZipDestination: string;
        Pounds: string;
        Ounces: string;
        Container: string;
        Width?: string;
        Length?: string;
        Height?: string;
        Girth?: string;
        Value?: string;
        AmountToCollect?: string;
        SpecialServices?: {
            SpecialService?: string;
        };
        Content?: {
            ContentType?: string;
            ContentDescription?: string;
        };
        GroundOnly?: boolean;
        SortBy?: string;
        Machinable?: string;
        ReturnLocations?: boolean;
        ReturnServiceInfo?: boolean;
        DropOffTime?: string;
        ShipDate?: {
            Option?: string;
        };
        ReturnDimensionalWeight?: boolean;
        TrackingRetentionPeriod?: string;
    };
}
export interface RateV4Response {
    Package: {
        ZipOrigination: string;
        ZipDestination: string;
        Pounds: number;
        Ounces: number;
        FirstClassMailType?: string;
        Container?: string;
        Width?: string;
        Length?: string;
        Height?: string;
        Girth?: string;
        Machinable?: string;
        Zone?: string;
        Postage: {
            CLASSID?: string;
            MailService?: string;
            Rate?: string;
            CommercialRate?: string;
            CommercialPlusRate?: string;
            MaxDimensions?: string;
            ServiceInformation?: string;
            SpecialServices?: [{
                SpecialService?: {
                    ServiceID?: string;
                    ServiceName?: string;
                    Available?: string;
                    AvailableOnline?: string;
                    AvailableCPP?: string;
                    Price?: string;
                    PriceOnline?: string;
                    PriceCPP?: string;
                    DeclaredValueRequired?: string;
                    DueSenderRequired?: string;
                };
            }];
            DimensionalWeightRate?: string;
            DimensionalWeightCommercialPlusRate?: string;
        };
        Restriction: {
            Restrictions?: string;
        };
        Error?: string;
    };
}
export interface PricingRateInput {
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
export interface Config {
    userId: string;
    properCase: boolean;
}
export interface Address {
    firm_name?: string;
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    zip4?: string;
    urbanization?: string;
}
export default class {
    #private;
    constructor(config: Config);
    verify(address: Address): Promise<Address | USPSError>;
    zipCodeLookup(address: Address): Promise<USPSError | Address>;
    pricingRateV4(pricingRate: PricingRateInput): Promise<USPSError | {
        CLASSID?: string | undefined;
        MailService?: string | undefined;
        Rate?: string | undefined;
        CommercialRate?: string | undefined;
        CommercialPlusRate?: string | undefined;
        MaxDimensions?: string | undefined;
        ServiceInformation?: string | undefined;
        SpecialServices?: [{
            SpecialService?: {
                ServiceID?: string | undefined;
                ServiceName?: string | undefined;
                Available?: string | undefined;
                AvailableOnline?: string | undefined;
                AvailableCPP?: string | undefined;
                Price?: string | undefined;
                PriceOnline?: string | undefined;
                PriceCPP?: string | undefined;
                DeclaredValueRequired?: string | undefined;
                DueSenderRequired?: string | undefined;
            } | undefined;
        }] | undefined;
        DimensionalWeightRate?: string | undefined;
        DimensionalWeightCommercialPlusRate?: string | undefined;
    }>;
    cityStateLookup(zip: string): Promise<USPSError | Address>;
}
