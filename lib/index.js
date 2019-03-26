// utils
const net = require('net');

const isNumber = n => typeof n === 'number';
const isString = s => typeof s === 'string';
const isObject = o => typeof o === 'object';

const delay = (time, data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), time));

const toPromise = f => (...args) => {
  return new Promise((resolve, reject) => {
    f(...args, (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  })
}

function basePing(host, port, callback) {
  if (isObject(host)) {
    host = host.host;
    port = host.port;
  }

  {
    if (!isString(host)) throw new Error('host must be string');
    if (!isNumber(port)) throw new Error('port must be number');
  }

  let socket;
  let isDisconnect = false;
  const disconnectTIme = 500;

  host = host || 'localhost';
  port = port || 80;
  socket = net.connect({ host, port });
  socket.on('error', error => {
    isDisconnect = true;
    socket.destroy();
    callback(error);
  });
  socket.on('close', () => {
    isDisconnect = true;
    socket.destroy();
    callback(null, true);
  });

  setTimeout(() => !isDisconnect && socket.destroy(), disconnectTIme);
}

const ping = toPromise(basePing);

const pingBackOff = (host, port, time = 5, count = 10) => {
  if (isObject(host)) {
    port = host.port || 80;
    time = host.time || time;
    count = host.count || count;
    host = host.host; // must be back
  }
  {
    if (!isString(host)) throw new Error('host must be string');
    if (!isNumber(port)) throw new Error('port must be number');
    if (!isNumber(time)) throw new Error('time must be number');
    if (!isNumber(count)) throw new Error('count must be number');
  }

  return (function recur() {
    if (!count--) return Promise.reject('The server is not ready.');
    const isRecur = async e => {
      await delay(time * 1000);
      return (count >= 0 && e instanceof Error) ? recur() : true;
    }

    return ping(host, port).catch(isRecur);
  })()
}


module.exports = {
  ping,
  pingBackOff,
}