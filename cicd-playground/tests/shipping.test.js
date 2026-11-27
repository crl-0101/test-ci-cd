import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateShipping } from '../site/shipping.js';

// 这是业务约定：满 99 元包邮。期望值故意不从实现中的常量读取，
// 这样业务门槛被意外改动时，测试才能真正发现错误。
test('商品金额低于 99 元，收取 10 元运费', () => {
  assert.equal(calculateShipping(0.01), 10);
  assert.equal(calculateShipping(50), 10);
  assert.equal(calculateShipping(98.99), 10);
});

test('商品金额恰好 99 元，免运费', () => {
  assert.equal(calculateShipping(99), 0);
});

test('商品金额超过 99 元，免运费', () => {
  assert.equal(calculateShipping(99.01), 0);
  assert.equal(calculateShipping(200), 0);
});

test('拒绝空金额、负数及其他无效输入', () => {
  for (const amount of [0, -1, NaN, Infinity, -Infinity, '99', '', null, undefined]) {
    assert.throws(() => calculateShipping(amount), RangeError);
  }
});
