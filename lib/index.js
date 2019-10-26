// utils
const net = require('net');
const axios = require('axios');
const isUrl = require('is-url');
const {
  isNumber,
  isString,
  isObject,
  isFunction,
  toPromise
} = require('maketype');

const delay = (time, data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), time));

function basePing(host, port, callback) {
  if (isUrl(host)) {
    callback = port;
    return axios
      .get(host)
      .then(data =>
        data.status === 200 ? callback(null) : callback(data)).catch(callback);
  } else if (isObject(host)) {
    callback = port;
    port = host.port;
    host = host.host;

    if (isUrl(host)) return basePing(host, callback);
  }

  {
    if (!isString(host)) throw new Error('Host must be string');
    if (!isNumber(port)) throw new Error('Port must be number');
    if (!isFunction(callback)) throw new Error('Callback must be function');
  }

  let socket;
  let isDisconnect = false;
  const destroyTime = 5000;

  host = host || 'localhost';
  port = port || 80;
  socket = net.connect({ host, port });

  socket.on('error', done(false));
  socket.on('connect', done(true));
  setTimeout(timeoutDone, destroyTime);

  function done(isConnect) {
    return (error) => {
      if (isDisconnect) {
        return;
      }

      if (!isConnect) {
        socket.destroy();
        callback(error);
        return;
      }

      isDisconnect = true;
      socket.destroy();
      callback(null, true);
    }
  }

  function timeoutDone() {
    if (isDisconnect) {
      return;
    }
    socket.destroy()
    callback(new Error('Time out error 5000ms'));
  }
}

const ping = toPromise(basePing);

const pingBackOff = (host, port, time = 5, count = 10) => {
  if (isUrl(host)) {
    count = time;
    time = port;
  } else if (isObject(host)) {
    port = host.port || 80;
    time = host.time || time;
    count = host.count || count;
    host = host.host; // must be back

    if (isUrl(host)) return pingBackOff(host, time, count);
  } {
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

    return ping({ host, port }).catch(isRecur);
  })()
}


module.exports = {
  ping,
  pingBackOff,
}

