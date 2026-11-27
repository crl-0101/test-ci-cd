import { calculateShipping, FREE_SHIPPING_THRESHOLD } from './shipping.js';

const form = document.querySelector('#calculator');
const input = document.querySelector('#amount');
const result = document.querySelector('#result');
const currency = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
});

document.querySelector('#threshold').textContent = FREE_SHIPPING_THRESHOLD;

function updateResult() {
  try {
    const amount = Number(input.value);
    const shipping = calculateShipping(amount);
    result.textContent = `运费 ${currency.format(shipping)} · 合计 ${currency.format(amount + shipping)}`;
    result.classList.remove('error');
  } catch (error) {
    result.textContent = error.message;
    result.classList.add('error');
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  updateResult();
});

updateResult();
