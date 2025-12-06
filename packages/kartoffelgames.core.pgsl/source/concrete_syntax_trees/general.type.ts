import type { DeclarationCst } from "./declaration.type.ts";
import type { ExpressionCst } from "./expression.type.ts";

/**
 * Core
 */
export type Cst<TType extends string> = {
    type: TType;
    range: [lineStart: number, columnStart: number, lineEnd: number, columnEnd: number];
};

/*
 * Document.
 */

export type DocumentCst = {
    declarations: Array<DeclarationCst>;
} & Cst<'Document'>;

/*
 * Attributes.
 */

export type AttributeCst = {
    name: string;
    parameters: Array<ExpressionCst>;
} & Cst<'Attribute'>;

export type AttributeListDst = {
    attributes: Array<AttributeCst>;
} & Cst<'AttributeList'>;

/*
 * Type declaration.
 */

export type TypeDeclarationCst = {
    typeName: string;
    template: Array<Cst<string>>,
    isPointer: boolean;
} & Cst<'TypeDeclaration'>;