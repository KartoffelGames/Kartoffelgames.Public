import type { DeclarationCst } from './declaration.type.ts';
import type { ExpressionCst } from './expression.type.ts';

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
    imports: Array<DocumentCstImport>;
    buildInDeclarations: Array<DeclarationCst>;
    declarations: Array<DeclarationCst>;
} & Cst<'Document'>;

export type DocumentCstImport = {
    name: string;
    declarations: Array<DeclarationCst>;
}

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

export type TypeCst = {} & Cst<'Type'>;