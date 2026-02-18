/**
 * Numeric step type for range and number property metas.
 */
export enum NumberType {
    Float = 'Float',
    Integer = 'Integer'
}

/**
 * Discriminated union of all property meta descriptors.
 * Each descriptor defines how a UI system should render the editor control for a property.
 */
export type PropertyMetaDescriptor =
    | ColorDescriptor
    | RangeDescriptor
    | NumberDescriptor
    | ObjectLinkDescriptor
    | VectorDescriptor
    | BooleanDescriptor
    | TextDescriptor
    | EnumDescriptor;

type ColorDescriptor = { type: 'color' };
type RangeDescriptor = { type: 'range'; min: number; max: number; numberType: NumberType };
type NumberDescriptor = { type: 'number'; min: number; max: number; numberType: NumberType };
type ObjectLinkDescriptor = { type: 'objectLink'; targetClass: object };
type VectorDescriptor = { type: 'vector'; dimensions: number };
type BooleanDescriptor = { type: 'boolean' };
type TextDescriptor = { type: 'text' };
type EnumDescriptor = { type: 'enum'; enumType: object };
