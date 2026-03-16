import { describe, it, expect } from 'vitest'
import { calculateGrowthLevel, incrementTaskCount } from './growthLogic'

describe('growthLogic', () => {
  describe('calculateGrowthLevel', () => {
    it('完了数が0ならレベル0を返す', () => {
      expect(calculateGrowthLevel(0)).toBe(0)
    })

    it('完了数が1〜2ならレベル1を返す', () => {
      expect(calculateGrowthLevel(1)).toBe(1)
      expect(calculateGrowthLevel(2)).toBe(1)
    })

    it('完了数が3〜6ならレベル2を返す', () => {
      expect(calculateGrowthLevel(3)).toBe(2)
      expect(calculateGrowthLevel(6)).toBe(2)
    })

    it('完了数が7以上ならレベル3を返す', () => {
      expect(calculateGrowthLevel(7)).toBe(3)
      expect(calculateGrowthLevel(100)).toBe(3)
    })

    it('負の数の場合は0を返す', () => {
      expect(calculateGrowthLevel(-5)).toBe(0)
    })
  })

  describe('incrementTaskCount', () => {
    it('現在のカウントを1増やす', () => {
      expect(incrementTaskCount(0)).toBe(1)
      expect(incrementTaskCount(10)).toBe(11)
    })
  })
})
