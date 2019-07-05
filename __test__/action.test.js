const assert = require('assert');
const { ping, pingBackOff } = require('../lib');

describe('Ping test', function () {
  it('ping', function (done) {
    ping('google.com', 80)
      .then(assert.ok)
      .then(done)
  });

  it('ping (options)', function (done) {
    ping({
      host: 'google.com',
      port: 80
    })
      .then(assert.ok)
      .then(done)
  });

  it('ping backoff', function (done) {
    pingBackOff('google.com', 80, 5, 10)
      .then(assert.ok)
      .then(done)
  });

  it('ping backoff (options)', function (done) {
    pingBackOff({
      host: 'google.com',
      port: 80,
      time: 5,
      count: 10,
    })
      .then(assert.ok)
      .then(done)
  });
})