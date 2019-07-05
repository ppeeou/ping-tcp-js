// utils
const net = require('net');
const {
  isNumber,
  isString,
  isObject,
  isFunction,
  toPromise } = require('maketype');

const delay = (time, data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), time));

function basePing(host, port, callback) {
  if (isObject(host)) {
    callback = port;
    port = host.port;
    host = host.host;
  }

  {
    if (!isString(host)) throw new Error('Host must be string');
    if (!isNumber(port)) throw new Error('Port must be number');
    if (!isFunction(callback)) throw new Error('Callback must be function');
  }

  let socket;
  let isDisconnect = false;
  const distroyTime = 0;

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

  setTimeout(() => !isDisconnect && socket.destroy(), distroyTime);
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
    if (!isString(host)) throw new Error('Host must be string');
    if (!isNumber(port)) throw new Error('Port must be number');
    if (!isNumber(time)) throw new Error('Time must be number');
    if (!isNumber(count)) throw new Error('Count must be number');
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