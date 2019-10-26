<h1 align="center">Welcome to  👋</h1>

# install
```
npm install ping-tcp-js
```

# ping

- param
```
const host = 'google.com';
const port = 80;

client.ping(host, port);
// or 
client.ping({host, port});
```

1. host
```
const client = require('ping-tcp-js');
const host = 'google.com';
const port = 80;

client
  .ping(host, port)
  .then(() => console.log('connect ping'))
  .catch((e) => console.error('not disconnet', e));
```

2. url

```
const client = require('ping-tcp-js');
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
const host = 'google.com';
const port = 80;

client.pingBackOff(host, port,5,10);
// or 
client.pingBackOff({host, port, time:5, count:10 });
```

1. host
```
const host = 'google.com';
const port = 80;

client
  .pingBackOff({ host: host, port: port ,time = 5, count = 10})
  .then(() => console.log('connect pingBackOff'))
  .catch((e) => console.error('not disconnet', e))
```


2. url
```
const host = 'https://google.com'; 
client
  .pingBackOff({ host: host, time = 5, count = 10})
  .then(() => console.log('connect pingBackOff'))
  .catch((e) => console.error('not disconnet', e))
```


## Test
```
npm run test
```
