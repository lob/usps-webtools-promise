const test = require("ava");
const USPS = require("..").default;

test("USPS should throw an exception when constructor is called without config object", (t) => {
  t.throws(() => {
    USPS();
  });
});

test("USPS should throw an exception when constructor is called without config.userId", (t) => {
  t.throws(() => {
    USPS({
      server: "234DSG",
    });
  });
});
