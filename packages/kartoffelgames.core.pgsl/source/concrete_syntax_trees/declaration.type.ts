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
} & Cst;

/*
 * Enum.
 */

export type EnumDeclarationCst = {
    name: string;
    values: Array<EnumDeclarationValueCst>;
    attributeList: AttributeListDst;
} & Cst;

export type EnumDeclarationValueCst = {
    name: string;
    value: ExpressionCst;
} & Cst;

/*
 * Function.
 */

export type FunctionDeclarationCst = {
    name: string;
    headers: Array<FunctionDeclarationHeaderCst>;
    genericType: TypeDeclarationCst | null;
    block: BlockStatementCst;
    attributeList: AttributeListDst;
} & Cst;

export type FunctionDeclarationHeaderCst = {
    parameters: Array<FunctionDeclarationParameterCst>;
    returnType: TypeDeclarationCst;
} & Cst;

export type FunctionDeclarationParameterCst = {
    name: string;
    type: TypeDeclarationCst;
} & Cst;

/*
 * Struct.
 */

export type StructDeclarationCst = {
    name: string;
    properties: Array<StructPropertyDeclarationCst>;
    attributeList: AttributeListDst;
} & Cst;

export type StructPropertyDeclarationCst = {
    name: string;
    typeDefinition: TypeDeclarationCst;
    attributeList: AttributeListDst;
} & Cst;

/*
 * Variable.
 */

export type VariableDeclarationCst = {
    name: string;
    declarationType: string;
    typeDeclaration: TypeDeclarationCst;
    expression: ExpressionCst | null;
    attributeList: AttributeListDst;
} & Cst;