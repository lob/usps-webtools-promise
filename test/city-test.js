const USPS = require('../').default;
const test = require('ava');

const usps = new USPS({
  userId: "325DAZSE5889",
});

test('#cityStateLookup() should return the city when passed a zipcode', async t => {
  const address = await usps.cityStateLookup('98031');
  t.is(address.city, 'KENT');
});

test('#cityStateLookup() should return the state when passed a zipcode', async t => {
  const address = await usps.cityStateLookup('98031');
  t.is(address.state, 'WA');
});

test('#cityStateLookup() should return an err when invalid zip', async t => {
  const address = await usps.cityStateLookup('23234324')
  t.truthy(address);
});
