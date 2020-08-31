const USPS = require('../').default;
const test = require('ava');

// Load .env
if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line global-require
  require("dotenv").config({ path: "test/.env" });
}

const usps = new USPS({
  userId: process.env.USPS_ID,
});

test('Address verify should validate apartment', async t => {
  const address = await usps.verify({
    street1: '11205 SE 233RD PL.',
    street2: 'Apartment 2',
    city: 'Kent',
    state: 'WA',
    zip: '98031'
  });
  t.is(address.street2, 'APT 2');
});

test('Address verify should validate Unit', async t => {
  const address = await usps.verify({
    street1: '11205 SE 233RD PL.',
    street2: 'UNIT 2',
    city: 'Kent',
    state: 'WA',
    zip: '98031'
  });
  t.is(address.street2, 'UNIT 2');
});

test('Address verify should validate Building', async t => {
  const address = await usps.verify({
    street1: '11205 southeast 233Road PLace.',
    street2: 'Building 2',
    city: 'Kent',
    state: 'WA',
    zip: '98031'
  });
  t.is(address.street2, 'BLDG 2');
});

test('Address verify should validate Floor', async t => {
  const address = await usps.verify({
    street1: '11205 SE 233RD PL.',
    street2: 'Floor 2',
    city: 'Kent',
    state: 'WA',
    zip: '98031'
  });
  t.is(address.street2, 'FL 2');
});
