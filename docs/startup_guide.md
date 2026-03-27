# スタートアップガイド (Pj04: 自分専用メモアプリ)

## 必要条件
- Node.js 18.x 以上
- npm
- Supabase アカウント

## セットアップ手順

1. **リポジトリの準備**:
   ```bash
   # プロジェクトディレクトリへ移動
   cd Pj04
   # 依存関係のインストール
   npm install
   ```

2. **環境変数の設定**:
   `.env.local.example` をコピーして `.env.local` を作成し、自身の Supabase プロジェクト情報を入力してください。
   ```text
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Supabase 設定の変更 (重要)**:
   MVP 開発をスムーズに進めるため（メール送信制限を避けるため）、以下の設定を推奨します。
   - Supabase Dashboard > **Auth** > **Settings**
   - **Confirm email** を **OFF** に設定
   これにより、新規登録直後にログインが可能になります。

4. **データベースの準備**:
   Supabase の SQL Editor で `docs/database_design.md` に記載されている SQL を実行し、`memos` テーブルと RLS ポリシーを作成してください。

4. **開発サーバーの起動**:
   ```bash
   npm run dev
   ```
   ブラウザで `http://localhost:3000` を開きます。

## テストの実行

- **単体テスト & カバレッジ**:
  ```bash
  npm run test:coverage
  ```
- **BDD (振る舞いテスト)**:
  ```bash
  npm run test:bdd
  ```

---
品質管理：C1 カバレッジ 100% 達成済み。
