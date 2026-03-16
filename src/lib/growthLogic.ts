/**
 * タスク完了数に基づいて成長レベルを計算する
 * @param completedCount 完了したタスクの数
 * @returns 0 (初期) から 3 (最大) のレベル
 */
export const calculateGrowthLevel = (completedCount: number): number => {
  if (completedCount <= 0) return 0
  if (completedCount < 3) return 1
  if (completedCount < 7) return 2
  return 3
}

/**
 * プロフィールのタスク完了数を更新する
 * @param currentCount 現在の完了数
 * @returns 新しい完了数
 */
export const incrementTaskCount = (currentCount: number): number => {
  return currentCount + 1
}
