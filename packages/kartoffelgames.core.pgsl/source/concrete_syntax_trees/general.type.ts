import type { DeclarationCst, DeclarationCstType } from "./declaration.type.ts";
import type { ExpressionCst, ExpressionCstType } from "./expression.type.ts";

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
    declarations: Array<DeclarationCst<DeclarationCstType>>;
} & Cst<'Document'>;

/*
 * Attributes.
 */

export type AttributeCst = {
    name: string;
    parameters: Array<ExpressionCst<ExpressionCstType>>;
} & Cst<'Attribute'>;

export type AttributeListCst = {
    attributes: Array<AttributeCst>;
} & Cst<'AttributeList'>;

/*
 * Type declaration.
 */

export type TypeDeclarationCst = {
    typeName: string;
    template: Array<ExpressionCst<ExpressionCstType> | TypeDeclarationCst>;
    isPointer: boolean;
} & Cst<'TypeDeclaration'>;