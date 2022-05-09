import { expectType } from 'tsd'
import { getPGBuilder } from '..'
import { PGEnum } from '../types/common'

describe('enum', () => {
  it('Creates an Enum & Set it to the Build Cache', () => {
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

  it('Returns an existing resource because a resource with the same name cannot be created', () => {
    const pg = getPGBuilder<any>()
    pg.enum('SomeRole', 'A', 'B')

    expect(pg.enum('SomeRole', 'A', 'B', 'C')).toEqual({
      name: 'SomeRole',
      values: ['A', 'B'],
      kind: 'enum',
    })
  })
})
