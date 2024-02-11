const client = require("../src");

const HOST = "google.com";
const PORT = 80;

client
  .ping({ host: HOST, port: PORT })
  .then(() => console.log("connect ping"))
  .catch((e) => console.error("not disconnet", e));

client
  .pingBackOff({ host: HOST, port: PORT })
  .then(() => console.log("connect pingBackOff"))
  .catch((e) => console.error("not disconnet", e));
