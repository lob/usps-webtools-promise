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

test("#cityStateLookup() should return the city when passed a zipcode", async (t) => {
  const address = await usps.cityStateLookup("98031");
  t.is(address.city, "KENT");
});

test("#cityStateLookup() should return the state when passed a zipcode", async (t) => {
  const address = await usps.cityStateLookup("98031");
  t.is(address.state, "WA");
});

test("#cityStateLookup() should return an err when invalid zip", async (t) => {
  const address = await usps.cityStateLookup("23234324");
  t.truthy(address);
});
