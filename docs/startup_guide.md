# 実行プロセス・スタートアップガイド

## 1. 動作環境
- Node.js 18.x 以上
- npm
- Supabase アカウント

## 2. セットアップ手順
1. 依存関係のインストール:
   ```bash
   npm install
   ```
2. 環境変数の設定:
   `.env.local.example` を `.env.local` にコピーし、SupabaseのURLとAnon Keyを設定してください。
   ```bash
   cp .env.local.example .env.local
   ```
3. 開発サーバーの起動:
   ```bash
   npm run dev
   ```

## 3. テスト実行方法
- ユニットテスト (Vitest):
  ```bash
  npm test
  ```
- BDDテスト (Cucumber):
  ```bash
  npx cucumber-js src/test/features/growth.feature --loader ts-node/esm
  ```
- カバレッジレポート生成:
  ```bash
  npx vitest run --coverage
  ```
