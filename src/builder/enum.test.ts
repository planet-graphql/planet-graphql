import { expectType, TypeEqual } from 'ts-expect'
import { getPGBuilder } from '..'
import { PGEnum } from '../types/common'

describe('enum', () => {
  it('Creates an Enum & Set it to the Build Cache', () => {
    const pg = getPGBuilder()()
    const result = pg.enum('UserRole', 'USER', 'MANAGER', 'ADMIN')
    const expectValue = {
      name: 'UserRole',
      values: ['USER', 'MANAGER', 'ADMIN'],
      kind: 'enum',
    }
    expect(result).toEqual(expectValue)
    expectType<TypeEqual<typeof result, PGEnum<['USER', 'MANAGER', 'ADMIN']>>>(true)

    const cache = pg.cache().enum.UserRole
    expect(cache).toEqual(expectValue)
  })
})
