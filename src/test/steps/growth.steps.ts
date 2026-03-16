import { Given, When, Then } from '@cucumber/cucumber'
import { calculateGrowthLevel, incrementTaskCount } from '../../lib/growthLogic.ts'

let completedTasks = 0
let growthLevel = 0

Given('ユーザーがログインしている', function () {
  // 認証のモック
})

Given('完了済みのタスクが {int}つ ある', function (count: number) {
  completedTasks = count
})

When('新しいタスクを完了させる', function () {
  completedTasks = incrementTaskCount(completedTasks)
  growthLevel = calculateGrowthLevel(completedTasks)
})

Then('完了済みのタスクが {int}つ になる', function (expectedCount: number) {
  if (completedTasks !== expectedCount) {
    throw new Error(`Expected ${expectedCount} but got ${completedTasks}`)
  }
})

Then('サイトの成長レベルが {int} になる', function (expectedLevel: number) {
  if (growthLevel !== expectedLevel) {
    throw new Error(`Expected level ${expectedLevel} but got ${growthLevel}`)
  }
})
