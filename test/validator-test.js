const USPS = require('../').default;
const test = require('ava');

const usps = new USPS({
  userId: "325DAZSE5889",
});

test('Address verify should validate apartment', async t => {
  const address = await usps.verify({
    street1: '11205 SE 233RD PL.',
    street2: 'Apartment 2',
    city: 'Kent',
    state: 'WA',
    zip: '98031'
  });
  t.is(address.Address2, 'APT 2');
});

test('Address verify should validate Unit', async t => {
  const address = await usps.verify({
    street1: '11205 SE 233RD PL.',
    street2: 'UNIT 2',
    city: 'Kent',
    state: 'WA',
    zip: '98031'
  });
  t.is(address.Address2, 'UNIT 2');
});

test('Address verify should validate Building', async t => {
  const address = await usps.verify({
    street1: '11205 southeast 233Road PLace.',
    street2: 'Building 2',
    city: 'Kent',
    state: 'WA',
    zip: '98031'
  });
  t.is(address.Address2, 'BLDG 2');
});

test('Address verify should validate Floor', async t => {
  const address = await usps.verify({
    street1: '11205 SE 233RD PL.',
    street2: 'Floor 2',
    city: 'Kent',
    state: 'WA',
    zip: '98031'
  });
  t.is(address.Address2, 'FL 2');
});
