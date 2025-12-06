import type { ExpressionCst } from "./expression.type.ts";
import type { Cst, AttributeListDst, TypeDeclarationCst } from "./general.type.ts";
import type { BlockStatementCst } from "./statement.type.ts";

/*
 * Core.
 */

export type DeclarationCst = AliasDeclarationCst | EnumDeclarationCst | FunctionDeclarationCst | StructDeclarationCst | StructPropertyDeclarationCst | VariableDeclarationCst;

/*
 * Alias.
 */

export type AliasDeclarationCst = {
    name: string;
    typeDefinition: TypeDeclarationCst;
    attributeList: AttributeListDst;
} & Cst<'AliasDeclaration'>;

/*
 * Enum.
 */

export type EnumDeclarationCst = {
    name: string;
    values: Array<EnumDeclarationValueCst>;
    attributeList: AttributeListDst;
} & Cst<'EnumDeclaration'>;

export type EnumDeclarationValueCst = {
    name: string;
    value: ExpressionCst;
} & Cst<'EnumDeclarationValue'>;

/*
 * Function.
 */

export type FunctionDeclarationCst = {
    name: string;
    headers: Array<FunctionDeclarationHeaderCst>;
    genericType: TypeDeclarationCst | null;
    block: BlockStatementCst;
    attributeList: AttributeListDst;
} & Cst<'FunctionDeclaration'>;

export type FunctionDeclarationHeaderCst = {
    parameters: Array<FunctionDeclarationParameterCst>;
    returnType: TypeDeclarationCst;
} & Cst<'FunctionDeclarationHeader'>;

export type FunctionDeclarationParameterCst = {
    name: string;
    type: TypeDeclarationCst;
} & Cst<'FunctionDeclarationParameter'>;

/*
 * Struct.
 */

export type StructDeclarationCst = {
    name: string;
    properties: Array<StructPropertyDeclarationCst>;
    attributeList: AttributeListDst;
} & Cst<'StructDeclaration'>;

export type StructPropertyDeclarationCst = {
    name: string;
    typeDefinition: TypeDeclarationCst;
    attributeList: AttributeListDst;
} & Cst<'StructPropertyDeclaration'>;

/*
 * Variable.
 */

export type VariableDeclarationCst = {
    name: string;
    declarationType: string;
    typeDeclaration: TypeDeclarationCst;
    expression: ExpressionCst | null;
    attributeList: AttributeListDst;
} & Cst<'VariableDeclaration'>;