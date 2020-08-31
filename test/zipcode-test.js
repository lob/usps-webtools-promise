const test = require("ava");
const USPS = require("..").default;

// Load .env
if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line global-require
  require("dotenv").config({ path: "test/.env" });
}

const usps = new USPS({
  staging: true,
  userId: process.env.USPS_ID,
});

const ZIP = "94607";

test("Zipcode Lookup should return the address with zip", async (t) => {
  const address = await usps.zipCodeLookup({
    city: "Oakland",
    state: "CA",
    street1: "121 Embarcadero West",
    street2: "Apt 2205",
  });
  t.is(address.zip, ZIP);
});

test("Zipcode Lookup should error if address is invalid", async (t) => {
  const address = await usps.zipCodeLookup({
    city: "Seattle",
    state: "WA",
    street1: "sdfisd",
    street2: "Apt 2205",
  });
  t.is(address.message, "Address Not Found.");
});

test("Zipcode Lookup should pass error to callback if street is missing", async (t) => {
  const address = await usps.zipCodeLookup({
    city: "Oakland",
    state: "CA",
  });
  t.truthy(address);
});

test("Zipcode Lookup error should be passed to callback if city is missing", async (t) => {
  const address = await usps.zipCodeLookup({
    state: "CA",
    street1: "121 Embarcadero West",
    street2: "Apt 2205",
  });
  t.truthy(address);
});

test("Zipcode Lookup should return an error if the address is fake", async (t) => {
  const address = await usps.zipCodeLookup({
    city: "kojs",
    state: "LS",
    street1: "453 sdfsdfa Road",
    street2: "sdfadf",
  });
  t.truthy(address);
});
