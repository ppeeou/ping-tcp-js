export type RequestOption = {
  host: string;
  // port defaults 80
  port?: number | string;
};

export type Option = {
  // timeout default 5000ms
  timeout?: number;
};

export type BackOffOption = Option & {
  // time default 5000ms
  time?: number;
  // count default 5
  count?: number;
};
