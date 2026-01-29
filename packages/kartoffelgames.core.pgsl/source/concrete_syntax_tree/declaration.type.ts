import type { ExpressionCst, ExpressionCstType } from './expression.type.ts';
import type { AttributeListCst, Cst, TypeDeclarationCst } from './general.type.ts';
import type { BlockStatementCst } from './statement.type.ts';

/*
 * Core.
 */
export type DeclarationCstType = 'AliasDeclaration' | 'EnumDeclaration' | 'EnumDeclarationValue' | 'FunctionDeclaration' | 'FunctionDeclarationHeader' | 'FunctionDeclarationParameter' | 'FunctionDeclarationGeneric' | 'StructDeclaration' | 'StructPropertyDeclaration' | 'VariableDeclaration';
export type DeclarationCst<TDeclarationType extends DeclarationCstType = DeclarationCstType> = Cst<TDeclarationType> & {
    buildIn: boolean;
};

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
    declarations: Array<FunctionDeclarationHeaderCst>;
    isConstant: boolean;
    implicitGenerics: boolean;
} & DeclarationCst<'FunctionDeclaration'>;

export type FunctionDeclarationHeaderCst = {
    attributeList: AttributeListCst;
    generics: Array<FunctionDeclarationGenericCst>;
    parameters: Array<FunctionDeclarationParameterCst>;
    returnType: TypeDeclarationCst | string; // String indicates generic return type of the header.
    block: BlockStatementCst;
} & DeclarationCst<'FunctionDeclarationHeader'>;

export type FunctionDeclarationParameterCst = {
    name: string;
    typeDeclaration: TypeDeclarationCst | string; // String indicates generic parameter type of the header.
} & DeclarationCst<'FunctionDeclarationParameter'>;

export type FunctionDeclarationGenericCst = {
    name: string;
    restrictions: null | Array<string>; // List of Types MetaTypes names that are allowed.
} & DeclarationCst<'FunctionDeclarationGeneric'>;

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
    typeDeclaration: TypeDeclarationCst;
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