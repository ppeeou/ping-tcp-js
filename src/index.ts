import { isNumber, isString } from "maketype";
import { isUrl } from "./is-url";
import { delay, isNil } from "@fxts/core";
import { connect, connectUrl } from "./connect";
import { RequestOption, Option, BackOffOption } from "./type";

async function ping(
  { host, port }: RequestOption,
  options?: Option
): Promise<boolean> {
  if (!isString(host)) {
    throw new Error("`host` must be string");
  }
  if (!isNil(port) && !isNumber(port)) {
    throw new Error("`post` must be number or string");
  }

  return new Promise<boolean>((resolve, reject) => {
    if (isUrl(host)) {
      return connectUrl({ host, port }, resolve, reject, options);
    }

    return connect({ host, port }, resolve, reject, options);
  });
}

async function pingBackOff(
  { host, port }: RequestOption,
  backOffOption?: BackOffOption
): Promise<boolean> {
  let count = backOffOption?.count ?? 5;
  const time = backOffOption?.time ?? 5000;

  return (function recur(): any {
    if (!count--) return Promise.reject("The server is not ready.");
    const isRecur = async (err: any) => {
      await delay(time);
      return count >= 0 && err instanceof Error ? recur() : true;
    };

    return ping({ host, port }, backOffOption).catch(isRecur);
  })();
}

export { ping, pingBackOff };
export default { ping, pingBackOff };
