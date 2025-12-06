import type { ExpressionCst, ExpressionCstType } from "./expression.type.ts";
import type { AttributeListCst, Cst, TypeDeclarationCst } from "./general.type.ts";
import type { BlockStatementCst } from "./statement.type.ts";

/*
 * Core.
 */
export type DeclarationCstType = 'AliasDeclaration' | 'EnumDeclaration' | 'EnumDeclarationValue' | 'FunctionDeclaration' | 'FunctionDeclarationHeader' | 'FunctionDeclarationParameter' | 'StructDeclaration' | 'StructPropertyDeclaration' | 'VariableDeclaration';
export type DeclarationCst<TDeclarationType extends DeclarationCstType> = Cst<TDeclarationType>;

/*
 * Alias.
 */

export type AliasDeclarationCst = {
    name: string;
    typeDefinition: TypeDeclarationCst;
    attributeList: AttributeListCst;
} & DeclarationCst<'AliasDeclaration'>;

/*
 * Enum.
 */

export type EnumDeclarationCst = {
    name: string;
    values: Array<EnumDeclarationValueCst>;
    attributeList: AttributeListCst;
} & DeclarationCst<'EnumDeclaration'>;

export type EnumDeclarationValueCst = {
    name: string;
    value: ExpressionCst<ExpressionCstType>;
} & DeclarationCst<'EnumDeclarationValue'>;

/*
 * Function.
 */

export type FunctionDeclarationCst = {
    name: string;
    headers: Array<FunctionDeclarationHeaderCst>;
    genericType: TypeDeclarationCst | null;
    block: BlockStatementCst;
    attributeList: AttributeListCst;
} & DeclarationCst<'FunctionDeclaration'>;

export type FunctionDeclarationHeaderCst = {
    parameters: Array<FunctionDeclarationParameterCst>;
    returnType: TypeDeclarationCst;
} & DeclarationCst<'FunctionDeclarationHeader'>;

export type FunctionDeclarationParameterCst = {
    name: string;
    typeDeclaration: TypeDeclarationCst;
} & DeclarationCst<'FunctionDeclarationParameter'>;

/*
 * Struct.
 */

export type StructDeclarationCst = {
    name: string;
    properties: Array<StructPropertyDeclarationCst>;
    attributeList: AttributeListCst;
} & DeclarationCst<'StructDeclaration'>;

export type StructPropertyDeclarationCst = {
    name: string;
    typeDefinition: TypeDeclarationCst;
    attributeList: AttributeListCst;
} & DeclarationCst<'StructPropertyDeclaration'>;

/*
 * Variable.
 */

export type VariableDeclarationCst = {
    name: string;
    declarationType: string;
    typeDeclaration: TypeDeclarationCst;
    expression: ExpressionCst<ExpressionCstType> | null;
    attributeList: AttributeListCst;
} & DeclarationCst<'VariableDeclaration'>;