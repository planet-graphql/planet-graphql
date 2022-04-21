import { expectType } from 'tsd'
import { getPGBuilder } from '..'
import { PGEnum } from '../types/common'

describe('enum', () => {
  it('Enumが作られて、cacheにEnumValueが設定される', () => {
    const pg = getPGBuilder<any>()
    const result = pg.enum('UserRole', 'USER', 'MANAGER', 'ADMIN')
    const expectValue = {
      name: 'UserRole',
      values: ['USER', 'MANAGER', 'ADMIN'],
      kind: 'enum',
    }
    expect(result).toEqual(expectValue)
    expectType<PGEnum<['USER', 'MANAGER', 'ADMIN']>>(result)

    const cache = pg.cache().enum.UserRole
    expect(cache).toEqual(expectValue)
  })

  it('同じ名前のPGEnumは作成できず既存のリソースを返却する', () => {
    const pg = getPGBuilder<any>()
    pg.enum('SomeRole', 'A', 'B')

    expect(pg.enum('SomeRole', 'A', 'B', 'C')).toEqual({
      name: 'SomeRole',
      values: ['A', 'B'],
      kind: 'enum',
    })
  })
})
