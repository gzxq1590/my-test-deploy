import { Given, When, Then, After, Before } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';

let browser: Browser;
let page: Page;

Before(async function () {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage();
});

After(async function () {
  await browser.close();
});

Given('ログイン画面を表示している', async function () {
  await page.goto('http://localhost:3000/login');
});

When('メールアドレス {string} と パスワード {string} でログインしている', async function (email, password) {
  // 実際には Supabase のモックやテスト用ユーザーが必要ですが、
  // ここでは UI 上の操作を記述します。
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  // ログイン後の遷移を待つ（モック等がない場合はタイムアウトする可能性があるため、実際の実装では注意が必要）
});

When('メモ入力欄に {string} と入力する', async function (content) {
  await page.fill('input[placeholder="ここにメモを書いてください..."]', content);
});

When('「保存」ボタンをクリックする', async function () {
  await page.click('button:has-text("保存")');
});

Then('メモ一覧の {int} 番目に {string} と表示される', async function (index, content) {
  const memo = page.locator('.grid > div').nth(index - 1);
  await expect(memo).toContainText(content);
});

Given('すでに {string} というメモが存在する', async function (content) {
  // 事前条件としてメモを追加する操作
  await page.fill('input[placeholder="ここにメモを書いてください..."]', content);
  await page.click('button:has-text("保存")');
});

When('{string} の「削除」ボタンをクリックする', async function (content) {
  const memoItem = page.locator('.grid > div', { hasText: content });
  await memoItem.locator('button:has-text("削除")').click();
  // Confirm ダイアログの制御が必要な場合は page.on('dialog') を使用
});

Then('メモ一覧に {string} が存在しないこと', async function (content) {
  const memoItem = page.locator('.grid > div', { hasText: content });
  await expect(memoItem).toHaveCount(0);
});
