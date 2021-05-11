const test = require("ava");
const USPS = require("../dist/usps").default;

const usps = new USPS({
  userId: process.env.USPS_ID,
});

test("Zipcode Lookup should return the address with zip", async (t) => {
  const rate = await usps.pricingRateV4({
    Package: {
      "@ID": "0",
      Service: "FIRST CLASS",
      FirstClassMailType: "LETTER",
      ZipOrigination: "36801",
      ZipDestination: "70525",
      Ounces: 6,
      Container: "FLAT RATE ENVELOPE",
      Pounds: 0,
    },
  });
  console.log(rate);
  t.pass();
});
