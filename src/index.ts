// utils
import * as net from "net";
import axios from "axios";
import { isNumber, isString, isFunction, toPromise, isObject } from "maketype";
import { isUrl } from "./is-url";

const delay = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

function connect(host: string, port: number, callback: Function) {
  {
    if (!isString(host)) throw new Error("Host must be string");
    if (!isNumber(port)) throw new Error("Port must be number");
    if (!isFunction(callback)) throw new Error("Callback must be function");
  }

  let socket: net.Socket;
  let isDisconnect = false;
  const destroyTime = 5000;

  host = host || "localhost";
  port = port || 80;
  socket = net.connect({ host, port });

  socket.on("error", done(false));
  socket.on("connect", done(true));

  const id = setTimeout(timeoutDone, destroyTime);

  function done(isConnect: boolean) {
    return (error: any) => {
      clearTimeout(id);
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
    };
  }

  function timeoutDone() {
    if (isDisconnect) {
      return;
    }
    socket.destroy();
    callback(new Error("Time out error 5000ms"));
  }
}

function basePing(host: any, port: any, callback?: any): any {
  if (isUrl(host)) {
    callback = port;
    return axios
      .head(host)
      .then((data) => (data.status === 200 ? callback(null) : callback(data)))
      .catch(callback);
  } else if (isObject(host)) {
    callback = port;
    port = host.port;
    host = host.host;

    if (isUrl(host)) return basePing(host, callback) as any;
  }

  {
    if (!isString(host)) throw new Error("Host must be string");
    if (!isNumber(port)) throw new Error("Port must be number");
    if (!isFunction(callback)) throw new Error("Callback must be function");
  }

  return connect(host, port, callback);
}

const ping = toPromise(basePing);

const pingBackOff = (host: any, port?: any, time = 5, count = 10): any => {
  if (isUrl(host)) {
    count = time;
    time = port;
  } else if (isObject(host)) {
    port = host.port || 80;
    time = host.time || time;
    count = host.count || count;
    host = host.host; // must be back

    if (isUrl(host)) return pingBackOff(host, time, count);
  }
  {
    if (!isString(host)) throw new Error("Host must be string");
    if (!isNumber(port)) throw new Error("Port must be number");
    if (!isNumber(time)) throw new Error("Time must be number");
    if (!isNumber(count)) throw new Error("Count must be number");
  }

  return (function recur(): any {
    if (!count--) return Promise.reject("The server is not ready.");
    const isRecur = async (e: any) => {
      await delay(time * 1000);
      return count >= 0 && e instanceof Error ? recur() : true;
    };

    return ping({ host, port }).catch(isRecur);
  })();
};

export { ping, pingBackOff };
