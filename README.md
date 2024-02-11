<h1 align="center">Welcome to  👋</h1>

# install

```
npm install ping-tcp-js
```

# ping

- param

```
const client = require('ping-tcp-js');
// or
import client from 'ping-tcp-js';

const host = 'google.com';
const port = 80;

client.ping(
  {host, port},
  {timeout: 5000} // optional
);
```

1. host

```
const client = require('ping-tcp-js');
// or
import client from 'ping-tcp-js';

const host = 'google.com';
const port = 80;

client
  .ping({host, port})
  .then(() => console.log('connect ping'))
  .catch((e) => console.error('not disconnet', e));
```

2. url

```
const client = require('ping-tcp-js');
// or
import client from 'ping-tcp-js';

const host = 'https://google.com';

client
  .ping({ host })
  .then(() => console.log('connect ping'))
  .catch((e) => console.error('not disconnet', e));
```

# pingBackOff

time : Reconnect time
count : Number of times

- param

```
const client = require('ping-tcp-js');
// or
import client from 'ping-tcp-js';

const host = 'google.com';
const port = 80;

// or
client.pingBackOff(
  {host, port},
  {time: 5000, count:10, timeout: 5000}
);
```

1. host

```
const host = 'google.com';
const port = 80;

client
  .pingBackOff(
    {host, port},
    {time: 5000, count:10, timeout: 5000}
)
  .then(() => console.log('connect pingBackOff'))
  .catch((e) => console.error('not disconnet', e))
```

2. url

```
const host = 'https://google.com';
client
  .pingBackOff(
    { host: host},
    {time: 5000, count:10, timeout: 5000}
  )
  .then(() => console.log('connect pingBackOff'))
  .catch((e) => console.error('not disconnet', e))
```

## Test

```
npm run test
```
