# データベース設計書

## テーブル定義: `memos`

自分専用のメモを保存するテーブル。

| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `DEFAULT gen_random_uuid()`, `PRIMARY KEY` | メモの固有ID |
| `user_id` | `uuid` | `NOT NULL`, `REFERENCES auth.users(id)` | 作成者のユーザーID |
| `content` | `text` | `NOT NULL` | メモの本文 |
| `created_at` | `timestamptz` | `DEFAULT now()` | 作成日時 |

## セキュリティ設定 (RLS: Row Level Security)

`memos` テーブルに対し、以下の RLS ポリシーを適用する。

1.  **SELECT**: `auth.uid() = user_id` (自分のメモのみ取得可能)
2.  **INSERT**: `auth.uid() = user_id` (自分の memo としてのみ投稿可能)
3.  **UPDATE**: `auth.uid() = user_id` (自分のメモのみ更新可能)
4.  **DELETE**: `auth.uid() = user_id` (自分のメモのみ削除可能)

## セットアップ SQL 案

```sql
create table public.memos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table public.memos enable row level security;

create policy "Users can only access their own memos"
  on public.memos
  for all
  using (auth.uid() = user_id);
```
