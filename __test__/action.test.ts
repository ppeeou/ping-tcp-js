import assert from "assert";
import { ping, pingBackOff } from "../src";

describe("Ping test", function () {
  this.timeout(5000);
  it("ping", function (done) {
    ping({
      host: "google.com",
      port: 80,
    })
      .then(assert.ok)
      .then(done);
  });

  it("fail ping", function (done) {
    ping({
      host: "abc.xxx",
      port: 80,
    })
      .catch(assert.ok)
      .then(done);
  });

  it("ping url", function (done) {
    ping({
      host: "https://google.com",
    })
      .then(assert.ok)
      .then(done);
  });

  it("ping backoff", function (done) {
    pingBackOff(
      {
        host: "google.com",
        port: 80,
      },
      {
        time: 1000,
        count: 5,
      }
    )
      .then(assert.ok)
      .then(done);
  });
});
