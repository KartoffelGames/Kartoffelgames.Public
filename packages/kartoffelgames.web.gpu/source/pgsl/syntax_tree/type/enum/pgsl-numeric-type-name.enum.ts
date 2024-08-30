import { PgslTypeName } from './pgsl-type-name.enum';

export enum PgslNumericTypeName {
    Integer = PgslTypeName.Integer,
    UnsignedInteger = PgslTypeName.UnsignedInteger,
    Float16 = PgslTypeName.Float16,
    Float = PgslTypeName.Float,
    AbstractFloat = PgslTypeName.AbstractFloat,
    AbstractInteger = PgslTypeName.AbstractInteger
}