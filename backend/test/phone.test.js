const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizePhone } = require('../utils/phone');

test('normalizes Indian mobile numbers with or without a country code', () => {
  assert.equal(normalizePhone('9876543210'), '+919876543210');
  assert.equal(normalizePhone('+91 98765 43210'), '+919876543210');
  assert.equal(normalizePhone('919876543210'), '+919876543210');
});

test('rejects invalid mobile numbers', () => {
  assert.equal(normalizePhone('123'), null);
  assert.equal(normalizePhone(''), null);
});
