


# ping
```
const client = require('ping-js)
const HOST = 'google.com';
const PORT = 80;

client
  .ping(HOST, PORT)
  .then(() => console.log('connect ping'))
  .catch((e) => console.error('not disconnet', e))
```

# pingBackOff
time : Reconnect time

count : Number of times
```
client
  .pingBackOff({ host: HOST, port: PORT ,time = 5, count = 10})
  .then(() => console.log('connect pingBackOff'))
  .catch((e) => console.error('not disconnet', e))
```