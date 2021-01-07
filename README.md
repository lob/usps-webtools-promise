![Node.js CI](https://github.com/Sparticuz/usps-webtools-promise/workflows/Node.js%20CI/badge.svg) ![CodeQL](https://github.com/Sparticuz/usps-webtools-promise/workflows/CodeQL/badge.svg)

### About:

This package was forked from [MadisonReed/usps-webtools](https://github.com/MadisonReed/usps-webtools), but it has been modernized with Typescript and Promises (async/await). Note: Version 2 is a drop-in replacement for MadisonReed/usps-webtools, it produces the same output. Version 3 uses the same output from USPS, with the exception of Address1 and Address2 being switched, per social norms.

### Installation:

``` sh
npm install usps-webtools-promise
```

### Usage:

Initializing the usps model with a user id.

__Example:__

``` js
const USPS = require('usps-webtools-promise').default;
// or
import USPS from "usps-webtools-promise";

const usps = new USPS({
  // USPS returns ALL CAPS, this boolean turns on Proper Caps for both Street lines and City. This is an optional item. Defaults to true.
  properCase: boolean,
  // Staging will run all functions on the USPS Staging servers instead of Production. Defaults to false.
  staging: boolean,
  // This can be created by going to https://www.usps.com/business/web-tools-apis/ and registering for an id
  userId: 'USPS User id',
});
```

### verify(object)

Verify takes one parameter: object

object: Address1, Address2, City, State, Zip

__Example__

``` js
usps.verify({
  Address1: '322 3rd st.',
  Address2: 'Apt 2',
  City: 'San Francisco',
  State: 'CA',
  Zip5: '94103'
}).then(address => {
  console.log(address);
});
```

### zipCodeLookup(object)

zipCodeLookup takes one parameter: object.

object: Address1, Address2, City, State

__Example__

``` js
const address = await usps.zipCodeLookup({
  Address1: '322 3rd st.',
  Address2: 'Apt 2',
  City: 'San Francisco',
  State: 'CA'
});

console.log(address);
```

### cityStateLookup(object)

cityStateLookup takes one parameter: zipcode.

zipcode: 5 digit Zip Code as a string

__Example__

``` js
const result = await usps.cityStateLookup('94107');
console.log(result);
```
