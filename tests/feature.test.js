const test = require('node:test');
const assert = require('node:assert/strict');

const fraudService = require('../services/fraudService');
const surgePricingService = require('../services/surgePricingService');

test('fraud score increases with repeated cancellations and refunds', () => {
  const score = fraudService.calculateRiskScore({ cancelCount: 3, refundCount: 3 });
  assert.equal(score, 80);
});

test('surge pricing applies a peak multiplier during busy hours', () => {
  const fee = surgePricingService.calculateDeliveryFee({ orderCount: 60, hour: 20 });
  assert.ok(fee > 3);
});
