const test = require('node:test');
const assert = require('node:assert/strict');

const { getCustomerOrderStatus } = require('../utils/order-status');

test('maps a latest processing history entry to accepted', () => {
  assert.equal(getCustomerOrderStatus({
    status: 'pending',
    statusHistory: [{ status: 'processing', changedAt: new Date() }]
  }), 'accepted');
});

test('uses the latest history entry over the stored status', () => {
  assert.equal(getCustomerOrderStatus({
    status: 'accepted',
    statusHistory: [{ status: 'pending' }, { status: 'rejected' }]
  }), 'rejected');
});

test('preserves cancellation and legacy accepted status behavior', () => {
  assert.equal(getCustomerOrderStatus({ status: 'accepted' }), 'accepted');
  assert.equal(getCustomerOrderStatus({ status: 'pending', isAccepted: true }), 'accepted');
  assert.equal(getCustomerOrderStatus({ status: 'pending', isCancelled: true }), 'cancelled');
});
