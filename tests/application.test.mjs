import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const tick = () => new Promise(resolve => setImmediate(resolve));
function fixture({geo = 'delayed', malformed = false, reject = false} = {}) {
  let options, permission, timer, cancelled = false;
  const requests = [], logs = [], timers = [];
  const sandbox = {
    Vue: {createApp(value) { options = value; return {mount(selector) {assert.equal(selector, '#app');}}; }},
    window: {CONFIG: {OPENWEATHER_API_KEY: 'synthetic-weather-key', GOOGLE_MAPS_API_KEY: 'synthetic-google-key'}},
    navigator: geo === 'unsupported' ? {} : {geolocation: {getCurrentPosition(success, failure, settings) {
      permission = {success, failure, settings};
      if (geo === 'denied') failure({code: 1});
      if (geo === 'throws') throw Error('provider unavailable');
    }}},
    setTimeout(callback, delay) {timers.push(delay); timer = callback; return 1;},
    clearTimeout(id) {assert.equal(id, 1); cancelled = true;},
    console: {log: (...items) => logs.push(items.join(' ')), error: (...items) => logs.push(items.join(' '))},
    alert() {},
    fetch(url) {
      requests.push(new URL(url));
      if (reject) return Promise.reject(Error(`network failure for ${url}`));
      return Promise.resolve({ok: true, json: async () => malformed ? {} : ({dt: 2000000000, main: {temp: 21.3}, weather: [{description: 'clear', icon: '01d'}], list: [{main: {temp: 22.4}, weather: [{description: 'forecast', icon: '02d'}]}], results: [{formatted_address: 'Synthetic location'}]})});
    },
  };
  const context = vm.createContext(sandbox);
  vm.runInContext(source, context, {timeout: 1000});
  const state = Object.assign(options.data(), options.methods);
  return {
    state, requests, logs, context, timers,
    start: () => options.beforeMount.call(state),
    grant: (latitude = 47.2, longitude = 11.4) => permission.success({coords: {latitude, longitude}}),
    deny: () => permission.failure({code: 1}),
    expire: () => {assert.equal(typeof timer, 'function'); timer();},
    settings: () => permission.settings,
    cancelled: () => cancelled,
  };
}
function weatherRequests(f) {return f.requests.filter(url => url.hostname === 'api.openweathermap.org');}
function assertLocation(f, latitude, longitude) {
  const requests = weatherRequests(f); assert.equal(requests.length, 2);
  for (const url of requests) {
    assert.equal(url.searchParams.get('lat'), String(latitude));
    assert.equal(url.searchParams.get('lon'), String(longitude));
  }
}
test('delayed permission resolves before weather and forecast use the granted coordinates', async () => {
  const f = fixture(); const pending = f.start();
  assert.equal(weatherRequests(f).length, 0);
  f.grant(); await pending; await tick();
  assertLocation(f, 47.2, 11.4); assert.equal(f.state.temperature, 21);
  assert.equal(f.state.placeString, 'Synthetic location');
  assert.equal(f.state.temparray[1], 22);
});
for (const geo of ['denied', 'unsupported', 'throws']) {
  test(`${geo} geolocation uses the Vienna fallback`, async () => {
    const f = fixture({geo}); await f.start(); await tick(); assertLocation(f, 48.208174, 16.373819);
  });
}
test('geolocation has an independent bounded timeout and ignores a late grant', async () => {
  const f = fixture(); const pending = f.start();
  assert.equal(weatherRequests(f).length, 0);
  assert.deepEqual(f.timers, [8000]); assert.equal(f.settings().timeout, 8000);
  f.expire(); await pending; await tick();
  assertLocation(f, 48.208174, 16.373819);
  f.grant(); await tick(); assertLocation(f, 48.208174, 16.373819);
  assert.equal(f.state.lat, 48.208174);
});
test('permission success clears the timeout and later denial cannot change coordinates', async () => {
  const f = fixture(); const pending = f.start(); f.grant(); await pending;
  assert.equal(f.cancelled(), true); f.deny(); await tick(); assertLocation(f, 47.2, 11.4);
});
test('invalid coordinates cannot enter weather URLs', async () => {
  const f = fixture(); const pending = f.start(); f.grant(NaN, 999); await pending; await tick();
  assertLocation(f, 48.208174, 16.373819);
});
test('request and error logs contain no synthetic key values or keyed URLs', async () => {
  for (const reject of [false, true]) {
    const f = fixture({geo: 'unsupported', reject}); await f.start(); await tick();
    assert.doesNotMatch(f.logs.join('\n'), /synthetic-weather-key|synthetic-google-key|appid=|[?&]key=/);
  }
});
test('malformed service responses leave initial rendered values intact and are handled', async () => {
  const f = fixture({geo: 'unsupported', malformed: true}); await f.start(); await tick();
  assert.equal(f.state.temperature, 20); assert.equal(f.state.imgUrl, '');
  assert.equal(f.state.temparray.length, 0); assert.equal(f.state.placeString, '');
});
test('formatting uses local variables without leaking state into the global context', () => {
  const f = fixture(); assert.match(f.state.formatDate(2000000000), /2033/);
  assert.match(f.state.formatTime(2000000000), /^\d{2}:\d{2}$/);
  assert.equal(typeof f.state.formatTage(2000000000, 1), 'string');
  for (const key of ['timestampDate', 'tag', 'datum', 'stunden', 'minuten']) assert.equal(Object.hasOwn(f.context, key), false);
});
