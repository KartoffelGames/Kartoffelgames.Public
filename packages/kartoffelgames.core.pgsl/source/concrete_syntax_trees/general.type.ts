import type { DeclarationCst } from "./declaration.type.ts";
import type { ExpressionCst } from "./expression.type.ts";

/**
 * Core
 */
export type Cst = {
    range: [lineStart: number, columnStart: number, lineEnd: number, columnEnd: number];
};

/*
 * Document.
 */

export type DocumentCst = {
    declarations: Array<DeclarationCst>;
} & Cst;

/*
 * Attributes.
 */

export type AttributeCst = {
    name: string;
    parameters: Array<ExpressionCst>;
} & Cst;;

export type AttributeListDst = {
    attributes: Array<AttributeCst>;
} & Cst;

/*
 * Type declaration.
 */

export type TypeDeclarationCst = {
    typeName: string;
    template: Array<Cst>,
    isPointer: boolean;
} & Cst;