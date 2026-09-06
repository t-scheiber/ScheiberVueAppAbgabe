import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const source = fs.readFileSync(new URL('../generate-config.js', import.meta.url), 'utf8');
function generate(env, localEnv) {
  let output;
  const logs = [];
  const context = {
    __dirname: '/fixture', process: {env, exit(code) {throw Error(`exit ${code}`);}},
    console: {log: (...args) => logs.push(args.join(' ')), error: (...args) => logs.push(args.join(' '))},
    require(name) {
      if (name === 'path') return path;
      assert.equal(name, 'fs');
      return {existsSync: () => localEnv !== undefined, readFileSync: () => localEnv, writeFileSync(file, value) {assert.equal(file, '/fixture/config.js'); output = value;}};
    },
  };
  vm.runInNewContext(source, context, {timeout: 1000});
  const result = vm.runInNewContext(output + '\nCONFIG', {}, {timeout: 1000});
  return {result, logs};
}
test('provided synthetic configuration is generated without logging values or prefixes', () => {
  const {result, logs} = generate({OPENWEATHER_API_KEY: 'synthetic-weather-value', GOOGLE_MAPS_API_KEY: 'synthetic-google-value'});
  assert.equal(result.OPENWEATHER_API_KEY, 'synthetic-weather-value');
  assert.equal(result.GOOGLE_MAPS_API_KEY, 'synthetic-google-value');
  assert.doesNotMatch(logs.join('\n'), /synthetic-/);
});
test('quotes, newlines and backslashes remain configuration data', () => {
  const value = "synthetic'\n\\value";
  const {result} = generate({OPENWEATHER_API_KEY: value, GOOGLE_MAPS_API_KEY: value});
  assert.equal(result.OPENWEATHER_API_KEY, value); assert.equal(result.GOOGLE_MAPS_API_KEY, value);
});
test('CI placeholders keep their existing behavior', () => {
  const {result} = generate({CI: 'true'});
  assert.equal(result.OPENWEATHER_API_KEY, 'ci-placeholder'); assert.equal(result.GOOGLE_MAPS_API_KEY, 'ci-placeholder');
});
test('local environment configuration remains supported', () => {
  const {result} = generate({}, '# fixture\nOPENWEATHER_API_KEY=synthetic-local-weather\nGOOGLE_MAPS_API_KEY=synthetic-local-google\n');
  assert.equal(result.OPENWEATHER_API_KEY, 'synthetic-local-weather'); assert.equal(result.GOOGLE_MAPS_API_KEY, 'synthetic-local-google');
});
test('missing configuration still stops generation', () => {
  assert.throws(() => generate({}), /exit 1/);
});
