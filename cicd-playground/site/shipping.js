// 练习：把下一行的 99 改成 199，提交后观察 CI 阻止发布。
export const FREE_SHIPPING_THRESHOLD = 99;
export const SHIPPING_FEE = 10;

export function calculateShipping(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    throw new RangeError('请输入大于 0 的商品金额。');
  }

  return amount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
