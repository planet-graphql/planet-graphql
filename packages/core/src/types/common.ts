import type { PGUnion } from './output'
import type { Decimal } from 'decimal.js'
import type { GraphQLResolveInfo, GraphQLScalarType } from 'graphql'
import type { PartialDeep, Promisable } from 'type-fest'
import type { IsAny } from 'type-fest/source/set-return-type'
import type { z } from 'zod'

export type ExcludeNullish<T> = Exclude<T, null | undefined>
export type ExtractNullish<T> = Extract<T, null | undefined>
export type AnyWithNote<Note extends string> = { [key: string]: any } & Note
export type NeverWithNote<Note extends string> = { [key: string]: never } & Note

export interface PGScalarLike {
  scalar: GraphQLScalarType<any>
  schema: () => z.ZodSchema
}

export interface PGScalar<
  TSchema extends z.ZodSchema,
  TInput = z.infer<TSchema>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TOutput = TInput,
> {
  scalar: GraphQLScalarType<any>
  schema: () => TSchema
}

// NOTE:
// From Decimal.js & Prisma Client
export declare class PGInputDecimal {
  readonly d: number[]
  readonly e: number
  readonly s: number
  private readonly toStringTag: string

  constructor(n: Decimal.Value)

  absoluteValue(): Decimal
  abs(): Decimal

  ceil(): Decimal

  clampedTo(min: Decimal.Value, max: Decimal.Value): Decimal
  clamp(min: Decimal.Value, max: Decimal.Value): Decimal

  comparedTo(n: Decimal.Value): number
  cmp(n: Decimal.Value): number

  cosine(): Decimal
  cos(): Decimal

  cubeRoot(): Decimal
  cbrt(): Decimal

  decimalPlaces(): number
  dp(): number

  dividedBy(n: Decimal.Value): Decimal
  div(n: Decimal.Value): Decimal

  dividedToIntegerBy(n: Decimal.Value): Decimal
  divToInt(n: Decimal.Value): Decimal

  equals(n: Decimal.Value): boolean
  eq(n: Decimal.Value): boolean

  floor(): Decimal

  greaterThan(n: Decimal.Value): boolean
  gt(n: Decimal.Value): boolean

  greaterThanOrEqualTo(n: Decimal.Value): boolean
  gte(n: Decimal.Value): boolean

  hyperbolicCosine(): Decimal
  cosh(): Decimal

  hyperbolicSine(): Decimal
  sinh(): Decimal

  hyperbolicTangent(): Decimal
  tanh(): Decimal

  inverseCosine(): Decimal
  acos(): Decimal

  inverseHyperbolicCosine(): Decimal
  acosh(): Decimal

  inverseHyperbolicSine(): Decimal
  asinh(): Decimal

  inverseHyperbolicTangent(): Decimal
  atanh(): Decimal

  inverseSine(): Decimal
  asin(): Decimal

  inverseTangent(): Decimal
  atan(): Decimal

  isFinite(): boolean

  isInteger(): boolean
  isInt(): boolean

  isNaN(): boolean

  isNegative(): boolean
  isNeg(): boolean

  isPositive(): boolean
  isPos(): boolean

  isZero(): boolean

  lessThan(n: Decimal.Value): boolean
  lt(n: Decimal.Value): boolean

  lessThanOrEqualTo(n: Decimal.Value): boolean
  lte(n: Decimal.Value): boolean

  logarithm(n?: Decimal.Value): Decimal
  log(n?: Decimal.Value): Decimal

  minus(n: Decimal.Value): Decimal
  sub(n: Decimal.Value): Decimal

  modulo(n: Decimal.Value): Decimal
  mod(n: Decimal.Value): Decimal

  naturalExponential(): Decimal
  exp(): Decimal

  naturalLogarithm(): Decimal
  ln(): Decimal

  negated(): Decimal
  neg(): Decimal

  plus(n: Decimal.Value): Decimal
  add(n: Decimal.Value): Decimal

  precision(includeZeros?: boolean): number
  sd(includeZeros?: boolean): number

  round(): Decimal

  sine(): Decimal
  sin(): Decimal

  squareRoot(): Decimal
  sqrt(): Decimal

  tangent(): Decimal
  tan(): Decimal

  times(n: Decimal.Value): Decimal
  mul(n: Decimal.Value): Decimal

  toBinary(significantDigits?: number): string
  toBinary(significantDigits: number, rounding: Decimal.Rounding): string

  toDecimalPlaces(decimalPlaces?: number): Decimal
  toDecimalPlaces(decimalPlaces: number, rounding: Decimal.Rounding): Decimal
  toDP(decimalPlaces?: number): Decimal
  toDP(decimalPlaces: number, rounding: Decimal.Rounding): Decimal

  toExponential(decimalPlaces?: number): string
  toExponential(decimalPlaces: number, rounding: Decimal.Rounding): string

  toFixed(decimalPlaces?: number): string
  toFixed(decimalPlaces: number, rounding: Decimal.Rounding): string

  // eslint-disable-next-line @typescript-eslint/naming-convention
  toFraction(max_denominator?: Decimal.Value): Decimal[]

  toHexadecimal(significantDigits?: number): string
  toHexadecimal(significantDigits: number, rounding: Decimal.Rounding): string
  toHex(significantDigits?: number): string
  toHex(significantDigits: number, rounding?: Decimal.Rounding): string

  toJSON(): string

  toNearest(n: Decimal.Value, rounding?: Decimal.Rounding): Decimal

  toNumber(): number

  toOctal(significantDigits?: number): string
  toOctal(significantDigits: number, rounding: Decimal.Rounding): string

  toPower(n: Decimal.Value): Decimal
  pow(n: Decimal.Value): Decimal

  toPrecision(significantDigits?: number): string
  toPrecision(significantDigits: number, rounding: Decimal.Rounding): string

  toSignificantDigits(significantDigits?: number): Decimal
  toSignificantDigits(significantDigits: number, rounding: Decimal.Rounding): Decimal
  toSD(significantDigits?: number): Decimal
  toSD(significantDigits: number, rounding: Decimal.Rounding): Decimal

  toString(): string

  truncated(): Decimal
  trunc(): Decimal

  valueOf(): string

  static abs(n: Decimal.Value): Decimal
  static acos(n: Decimal.Value): Decimal
  static acosh(n: Decimal.Value): Decimal
  static add(x: Decimal.Value, y: Decimal.Value): Decimal
  static asin(n: Decimal.Value): Decimal
  static asinh(n: Decimal.Value): Decimal
  static atan(n: Decimal.Value): Decimal
  static atanh(n: Decimal.Value): Decimal
  static atan2(y: Decimal.Value, x: Decimal.Value): Decimal
  static cbrt(n: Decimal.Value): Decimal
  static ceil(n: Decimal.Value): Decimal
  static clamp(n: Decimal.Value, min: Decimal.Value, max: Decimal.Value): Decimal
  static clone(object?: Decimal.Config): Decimal.Constructor
  static config(object: Decimal.Config): Decimal.Constructor
  static cos(n: Decimal.Value): Decimal
  static cosh(n: Decimal.Value): Decimal
  static div(x: Decimal.Value, y: Decimal.Value): Decimal
  static exp(n: Decimal.Value): Decimal
  static floor(n: Decimal.Value): Decimal
  static hypot(...n: Decimal.Value[]): Decimal
  static isDecimal(object: any): boolean
  static ln(n: Decimal.Value): Decimal
  static log(n: Decimal.Value, base?: Decimal.Value): Decimal
  static log2(n: Decimal.Value): Decimal
  static log10(n: Decimal.Value): Decimal
  static max(...n: Decimal.Value[]): Decimal
  static min(...n: Decimal.Value[]): Decimal
  static mod(x: Decimal.Value, y: Decimal.Value): Decimal
  static mul(x: Decimal.Value, y: Decimal.Value): Decimal
  static noConflict(): Decimal.Constructor // Browser only
  static pow(base: Decimal.Value, exponent: Decimal.Value): Decimal
  static random(significantDigits?: number): Decimal
  static round(n: Decimal.Value): Decimal
  static set(object: Decimal.Config): Decimal.Constructor
  static sign(n: Decimal.Value): Decimal
  static sin(n: Decimal.Value): Decimal
  static sinh(n: Decimal.Value): Decimal
  static sqrt(n: Decimal.Value): Decimal
  static sub(x: Decimal.Value, y: Decimal.Value): Decimal
  static sum(...n: Decimal.Value[]): Decimal
  static tan(n: Decimal.Value): Decimal
  static tanh(n: Decimal.Value): Decimal
  static trunc(n: Decimal.Value): Decimal

  static readonly default?: Decimal.Constructor
  static readonly Decimal?: Decimal.Constructor

  static readonly precision: number
  static readonly rounding: Decimal.Rounding
  static readonly toExpNeg: number
  static readonly toExpPos: number
  static readonly minE: number
  static readonly maxE: number
  static readonly crypto: boolean
  static readonly modulo: Decimal.Modulo

  static readonly ROUND_UP: 0
  static readonly ROUND_DOWN: 1
  static readonly ROUND_CEIL: 2
  static readonly ROUND_FLOOR: 3
  static readonly ROUND_HALF_UP: 4
  static readonly ROUND_HALF_DOWN: 5
  static readonly ROUND_HALF_EVEN: 6
  static readonly ROUND_HALF_CEIL: 7
  static readonly ROUND_HALF_FLOOR: 8
  static readonly EUCLID: 9
}
export type PGDecimal = {
  d: number[]
  e: number
  s: number
}

// NOTE:
// From Prisma Client
type PGJsonObject = { [Key in string]?: PGJson }
type PGJsonArray = PGJson[]
export type PGJson = string | number | boolean | PGJsonObject | PGJsonArray | null
type PGInputJsonObject = { readonly [Key in string]?: PGInputJson | null }
type PGInputJsonArray = ReadonlyArray<PGInputJson | null>
export type PGInputJson = string | number | boolean | PGInputJsonObject | PGInputJsonArray

export type PGFieldKindAndType =
  | {
      kind: 'scalar'
      type: string
    }
  | {
      kind: 'enum'
      type: PGEnum<any>
    }
  | {
      kind: 'object'
      type: Function
    }

export type TypeOfPGFieldType<T> = IsAny<T> extends true
  ? any
  : T extends () => any
  ? TypeOfPGFieldType<ReturnType<T>>
  : T extends any[]
  ? Array<TypeOfPGFieldType<T[0]>>
  : T extends PGEnum<any>
  ? TypeOfPGEnum<T>
  : T extends PGModelBase<any>
  ? TypeOfPGModelBase<T>
  : T extends PGUnion<any>
  ? TypeOfPGUnion<T>
  : T

export type PGFieldValue = {
  isOptional: boolean
  isNullable: boolean
  isList: boolean
  default?: any
} & PGFieldKindAndType

export interface PGField<T> {
  value: PGFieldValue
  __type: T
}

export type TypeOfPGField<T extends PGField<any>> = TypeOfPGFieldType<T['__type']>

export interface PGEnum<TFieldValues extends string[]> {
  name: string
  values: TFieldValues
  kind: 'enum'
}

export type TypeOfPGEnum<T extends PGEnum<any>> = T['values'][number]

export type TypeOfPGUnion<T extends PGUnion<any>> = TypeOfPGModelBase<
  T['value']['types'][number]
>

export interface PGFieldMap {
  [name: string]: PGField<any>
}

export type TypeOfPGFieldMap<T extends PGFieldMap> = {
  [P in keyof T]: TypeOfPGField<T[P]>
}

export interface PGModelBase<TFieldMap extends PGFieldMap> {
  value: {
    fieldMap: TFieldMap
  }
}

export type TypeOfPGModelBase<T extends PGModelBase<any>> = TypeOfPGFieldMap<
  T['value']['fieldMap']
>

export type IsObject<T> = T extends any[]
  ? false
  : T extends Date
  ? false
  : T extends Buffer
  ? false
  : T extends Decimal
  ? false
  : T extends object
  ? true
  : false

export type TypeToScalarName<T> = T extends string
  ? 'String'
  : T extends number
  ? 'Int' | 'Float'
  : T extends boolean
  ? 'Boolean'
  : T extends bigint
  ? 'BigInt'
  : T extends Date
  ? 'DateTime'
  : T extends Buffer
  ? 'Bytes'
  : T extends Decimal
  ? 'Decimal'
  : never

export type ScalarNameToType<T> = T extends 'String' | 'Json'
  ? string
  : T extends 'Int' | 'Float'
  ? number
  : T extends 'Boolean'
  ? boolean
  : T extends 'BigInt'
  ? bigint
  : T extends 'DateTime'
  ? Date
  : T extends 'Bytes'
  ? Buffer
  : T extends 'Decimal'
  ? Decimal
  : never

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PGResolveParams<TSource, TArgs, TPrismaArgs, TContext, TResolve> {
  source: IsAny<TSource> extends true
    ? AnyWithNote<'The type is not fixed as it is currently being created & If you need the fixed type, consider using the modify() method of PGObject'>
    : TSource
  args: TArgs
  prismaArgs: TPrismaArgs
  context: TContext
  info: GraphQLResolveInfo
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PGSubscribeParams<TSource, TArgs, TContext, TResolve> {
  source: IsAny<TSource> extends true
    ? AnyWithNote<'The type is not fixed as it is currently being created & If you need the fixed type, consider using the modify() method of PGObject'>
    : TSource
  args: TArgs
  context: TContext
  info: GraphQLResolveInfo
}

export type ResolveResponse<T> = Promisable<
  T extends Array<infer U> ? Array<PartialDeep<U>> : PartialDeep<T>
>

export type RequiredNonNullable<T> = {
  [P in keyof T]-?: Exclude<T[P], null | undefined>
}
