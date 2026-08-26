import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const exactVersion = /^\d+\.\d+\.\d+$/;

for (const field of ['dependencies', 'devDependencies']) {
  assert.equal(typeof packageJson[field], 'object', `${field} must be present`);
  for (const [name, version] of Object.entries(packageJson[field])) {
    assert.match(version, exactVersion, `${field}.${name} must be an exact semantic version`);
  }
}

assert.equal(packageJson.packageManager, 'npm@11.17.0');
assert.equal(packageJson.engines.node, '>=24 <25');
assert.equal(packageJson.engines.npm, '>=11.17.0 <12');
console.log('DOMHamster dependency manifest uses exact versions.');
