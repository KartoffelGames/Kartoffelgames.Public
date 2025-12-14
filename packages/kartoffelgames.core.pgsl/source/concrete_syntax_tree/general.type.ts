import type { DeclarationCst, DeclarationCstType } from "./declaration.type.ts";
import type { ExpressionCst, ExpressionCstType } from "./expression.type.ts";

/**
 * Core
 */
export type Cst<TType extends string> = {
    type: TType;
    range: CstRange;
};

export type CstRange = [lineStart: number, columnStart: number, lineEnd: number, columnEnd: number];

/*
 * Document.
 */

export type DocumentCst = {
    buildInDeclarations: Array<DeclarationCst>;
    declarations: Array<DeclarationCst>;
} & Cst<'Document'>;

/*
 * Attributes.
 */

export type AttributeCst = {
    name: string;
    parameters: Array<ExpressionCst>;
} & Cst<'Attribute'>;

export type AttributeListCst = {
    attributes: Array<AttributeCst>;
} & Cst<'AttributeList'>;

/*
 * Type declaration.
 */

export type TypeDeclarationCst = {
    typeName: string;
    template: Array<ExpressionCst | TypeDeclarationCst>;
    isPointer: boolean;
} & Cst<'TypeDeclaration'>;