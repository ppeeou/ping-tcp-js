import { isNil } from "@fxts/core";
import axios from "axios";
import * as net from "net";
import { isNumber, isString, toNumber } from "maketype";
import { RequestOption, Option } from "./type";

export const delay = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export function connect(
  requestOption: RequestOption,
  resolve: (value: boolean) => void,
  reject: (reason?: any) => void,
  options?: Option
) {
  let socket: net.Socket;
  let isDisconnect = false;

  if (!isNil(options?.timeout) && !isNumber(options?.timeout)) {
    throw new Error("`timeout` must be number");
  }

  const destroyTime = options?.timeout ?? 5000;
  const host = requestOption.host;
  const port =
    (isString(requestOption.port)
      ? toNumber(requestOption.port)
      : requestOption.port) ?? 80;

  socket = net.connect({ host, port });
  socket.on("error", done(false));
  socket.on("connect", done(true));

  const id = setTimeout(timeoutDone, destroyTime);

  function done(isConnect: boolean) {
    return (err: any) => {
      clearTimeout(id);
      if (isDisconnect) {
        return;
      }

      if (!isConnect) {
        socket.destroy();
        reject(err);
        return;
      }

      isDisconnect = true;
      socket.destroy();
      resolve(true);
    };
  }

  function timeoutDone() {
    if (isDisconnect) {
      return;
    }
    socket.destroy();
    reject(new Error(`time out error ${destroyTime}ms`));
  }
}

export function connectUrl(
  requestOption: RequestOption,
  resolve: (value: boolean) => void,
  reject: (reason?: any) => void,
  options?: Option
) {
  return axios
    .head(requestOption.host, {
      timeout: options?.timeout,
    })
    .then(() => resolve(true))
    .catch((err) => reject(err));
}
