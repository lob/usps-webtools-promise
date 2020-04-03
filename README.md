### Installation:

``` sh
npm install usps-webtools-promise
```

### Usage:

Initializing the usps model with a user id.

__Example:__

``` js
const USPS = require('usps-webtools').default;

const usps = new USPS({
  userId: 'USPS User id',
});
```

### verify(object)

Verify takes one parameter: object

object: street1, street2, city, state, zip

__Example__

``` js
usps.verify({
  street1: '322 3rd st.',
  street2: 'Apt 2',
  city: 'San Francisco',
  state: 'CA',
  zip: '94103'
}).then(address => {
  console.log(address);
});
```

### zipCodeLookup(object)

zipCodeLookup takes one parameter: object.

object: street1, street2, city, state

__Example__

``` js
const address = await usps.zipCodeLookup({
  street1: '322 3rd st.',
  street2: 'Apt 2',
  city: 'San Francisco',
  state: 'CA'
});

console.log(address);
});
```

### cityStateLookup(object)

cityStateLookup takes one parameter: zipcode.

zipcode: 5 digit zipcode as a string

__Example__

``` js
const result = await usps.cityStateLookup('94107');
console.log(result);
});
```
