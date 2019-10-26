const assert = require('assert');
const { ping, pingBackOff } = require('../lib');

describe('Ping test', function () {
  this.timeout(5000);
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

  it('ping url', function (done) {
    ping('https://google.com')
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

  it('ping backoff', function (done) {
    pingBackOff('https://google.com', 5, 10)
      .then(assert.ok)
      .then(done)
  });

})