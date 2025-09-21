import { EnumUtil, Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTreeMeta } from '../syntax_tree/base-pgsl-syntax-tree.ts';
import { BasePgslExpressionSyntaxTree } from '../syntax_tree/expression/base-pgsl-expression-syntax-tree.ts';
import { BasePgslTypeDefinitionSyntaxTree } from '../syntax_tree/type/base-pgsl-type-definition-syntax-tree.ts';
import { PgslAliasedTypeDefinitionSyntaxTree } from '../syntax_tree/type/pgsl-aliased-type-definition-syntax-tree.ts';
import { PgslArrayTypeDefinitionSyntaxTree } from '../syntax_tree/type/pgsl-array-type-definition-syntax-tree.ts';
import { PgslBooleanTypeDefinitionSyntaxTree } from '../syntax_tree/type/pgsl-boolean-type-definition-syntax-tree.ts';
import { PgslBuildInTypeDefinitionSyntaxTree } from '../syntax_tree/type/pgsl-build-in-type-definition-syntax-tree.ts';
import { PgslEnumTypeDefinitionSyntaxTree } from '../syntax_tree/type/pgsl-enum-type-definition-syntax-tree.ts';
import { PgslMatrixTypeDefinitionSyntaxTree } from '../syntax_tree/type/pgsl-matrix-type-definition-syntax-tree.ts';
import { PgslNumericTypeDefinitionSyntaxTree } from '../syntax_tree/type/pgsl-numeric-type-definition-syntax-tree.ts';
import { PgslPointerTypeDefinitionSyntaxTree } from '../syntax_tree/type/pgsl-pointer-type-definition-syntax-tree.ts';
import { PgslSamplerTypeDefinitionSyntaxTree } from '../syntax_tree/type/pgsl-sampler-type-definition-syntax-tree.ts';
import { PgslStringTypeDefinitionSyntaxTree } from '../syntax_tree/type/pgsl-string-type-definition-syntax-tree.ts';
import { PgslStructTypeDefinitionSyntaxTree } from '../syntax_tree/type/pgsl-struct-type-definition-syntax-tree.ts';
import { PgslTextureTypeDefinitionSyntaxTree } from '../syntax_tree/type/pgsl-texture-type-definition-syntax-tree.ts';
import { PgslVectorTypeDefinitionSyntaxTree } from '../syntax_tree/type/pgsl-vector-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from '../syntax_tree/type/enum/pgsl-base-type-name.enum.ts';
import { PgslBuildInTypeName } from '../syntax_tree/type/enum/pgsl-build-in-type-name.enum.ts';
import { PgslMatrixTypeName } from '../syntax_tree/type/enum/pgsl-matrix-type-name.enum.ts';
import { PgslNumericTypeName } from '../syntax_tree/type/enum/pgsl-numeric-type-name.enum.ts';
import { PgslSamplerTypeName } from '../syntax_tree/type/enum/pgsl-sampler-build-name.enum.ts';
import { PgslTextureTypeName } from '../syntax_tree/type/enum/pgsl-texture-type-name.enum.ts';
import { PgslVectorTypeName } from '../syntax_tree/type/enum/pgsl-vector-type-name.enum.ts';
import { PgslVoidTypeDefinitionSyntaxTree } from '../syntax_tree/type/pgsl-void-type-definition-syntax-tree.ts';

/**
 * General PGSL syntax tree factory of a type definition.
 */
export class PgslTypeDeclarationSyntaxTreeFactory {
    private readonly mTypePredefinition: TypePredefinitions;

    /**
     * Predefined alias names.
     */
    public get aliasNames(): Set<string> {
        return this.mTypePredefinition.aliasNames;
    }

    /**
     * Predefined enum names.
     */
    public get enumNames(): Set<string> {
        return this.mTypePredefinition.enumNames;
    }

    /**
     * Predefined struct names.
     */
    public get structNames(): Set<string> {
        return this.mTypePredefinition.structNames;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mTypePredefinition = {
            aliasNames: new Set<string>(),
            structNames: new Set<string>(),
            enumNames: new Set<string>()
        };
    }

    /**
     * Add alias name as pre definition.
     * 
     * @param pAliasName - Alias name.
     */
    public addAliasPredefinition(pAliasName: string): void {
        // Restrict multi definition of names.
        if (this.mTypePredefinition.aliasNames.has(pAliasName)) {
            throw new Exception(`Alias "${pAliasName}" already defined.`, this);
        }

        this.mTypePredefinition.aliasNames.add(pAliasName);
    }

    /**
     * Add enum name as pre definition.
     * 
     * @param pEnumName - Enum name.
     */
    public addEnumPredefinition(pEnumName: string): void {
        // Restrict multi definition of names.
        if (this.mTypePredefinition.enumNames.has(pEnumName)) {
            throw new Exception(`Enum "${pEnumName}" already defined.`, this);
        }

        this.mTypePredefinition.enumNames.add(pEnumName);
    }

    /**
     * Add struct name as pre definition.
     * 
     * @param pStructName - Struct name.
     */
    public addStructPredefinition(pStructName: string): void {
        // Restrict multi definition of names.
        if (this.mTypePredefinition.structNames.has(pStructName)) {
            throw new Exception(`Struct "${pStructName}" already defined.`, this);
        }

        this.mTypePredefinition.structNames.add(pStructName);
    }

    /**
     * Generate type definition from data.
     * 
     * @param pTypeName - type name.
     * @param pIsPointer - Type is marked as pointer.
     * @param pTemplateList - Optional template list.
     * 
     * @returns generated type definition. 
     */
    public generate(pTypeName: string, pIsPointer: boolean, pTemplateList: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree {
        const lTemplateList: PgslTypeTemplateList = pTemplateList;

        // Type to pointer.
        if (pIsPointer) {
            return this.resolvePointer(pTypeName, lTemplateList, pMeta);
        }

        let lTypeDefinition: BasePgslTypeDefinitionSyntaxTree | null = null;

        // Try to parse to void type.
        lTypeDefinition = this.resolveVoid(pTypeName, lTemplateList, pMeta);
        if (lTypeDefinition) {
            return lTypeDefinition;
        }

        // Try to parse to struct type.
        lTypeDefinition = this.resolveStruct(pTypeName, lTemplateList, pMeta);
        if (lTypeDefinition) {
            return lTypeDefinition;
        }

        // Try to parse alias type.
        lTypeDefinition = this.resolveAlias(pTypeName, lTemplateList, pMeta);
        if (lTypeDefinition) {
            return lTypeDefinition;
        }

        // Try to parse enum type.
        lTypeDefinition = this.resolveEnum(pTypeName, lTemplateList, pMeta);
        if (lTypeDefinition) {
            return lTypeDefinition;
        }

        // Try to parse build in type.
        lTypeDefinition = this.resolveBuildIn(pTypeName, lTemplateList, pMeta);
        if (lTypeDefinition) {
            return lTypeDefinition;
        }

        // Try to parse numeric type.
        lTypeDefinition = this.resolveNumeric(pTypeName, lTemplateList, pMeta);
        if (lTypeDefinition) {
            return lTypeDefinition;
        }

        // Try to parse boolean type.
        lTypeDefinition = this.resolveBoolean(pTypeName, lTemplateList, pMeta);
        if (lTypeDefinition) {
            return lTypeDefinition;
        }

        // Try to parse string type.
        lTypeDefinition = this.resolveString(pTypeName, lTemplateList, pMeta);
        if (lTypeDefinition) {
            return lTypeDefinition;
        }

        // Try to parse vector type.
        lTypeDefinition = this.resolveVector(pTypeName, lTemplateList, pMeta);
        if (lTypeDefinition) {
            return lTypeDefinition;
        }

        // Try to parse matrix type.
        lTypeDefinition = this.resolveMatrix(pTypeName, lTemplateList, pMeta);
        if (lTypeDefinition) {
            return lTypeDefinition;
        }

        // Try to parse sampler type.
        lTypeDefinition = this.resolveSampler(pTypeName, lTemplateList, pMeta);
        if (lTypeDefinition) {
            return lTypeDefinition;
        }

        // Try to parse array type.
        lTypeDefinition = this.resolveArray(pTypeName, lTemplateList, pMeta);
        if (lTypeDefinition) {
            return lTypeDefinition;
        }

        // Try to parse texture type.
        lTypeDefinition = this.resolveTexture(pTypeName, lTemplateList, pMeta);
        if (lTypeDefinition) {
            return lTypeDefinition;
        }

        throw new Exception(`Typename "${pTypeName}" not defined`, this);
    }

    /**
     * Try to resolve raw type as alias type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveAlias(pRawName: string, pRawTemplate: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree | null {
        // Resolve alias
        if (!this.mTypePredefinition.aliasNames.has(pRawName)) {
            return null;
        }

        // No templares allowed.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Alias can't have templates values.`, this);
        }

        return new PgslAliasedTypeDefinitionSyntaxTree(pMeta, pRawName);
    }

    /**
     * Try to resolve raw type as array type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveArray(pRawName: string, pRawTemplate: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree | null {
        // Resolve array type.
        if (pRawName !== 'Array') { // TODO: Use some sort of constant.
            return null;
        }

        // Arrays need at least one type parameter.
        if (!pRawTemplate || pRawTemplate.length < 1) {
            throw new Exception(`Arrays need at least one template parameter`, this);
        }

        // But not more than two parameter.
        if (pRawTemplate.length > 2) {
            throw new Exception(`Arrays supports only two template parameter.`, this);
        }

        // First template needs to be a type.
        const lTypeTemplate: BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree = pRawTemplate[0];
        if (!(lTypeTemplate instanceof BasePgslTypeDefinitionSyntaxTree)) {
            throw new Exception(`First array template parameter must be a type.`, this);
        }

        // Second length parameter.
        let lLengthParameter: BasePgslExpressionSyntaxTree | null = null;
        if (pRawTemplate.length > 1) {
            const lLengthTemplate: BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree = pRawTemplate[1];
            if (!(lLengthTemplate instanceof BasePgslExpressionSyntaxTree)) {
                throw new Exception(`Arra length template parameter cant be a type.`, this);
            }

            // Set optional length expression.
            lLengthParameter = lLengthTemplate;
        }

        // Build BuildInType definition.
        return new PgslArrayTypeDefinitionSyntaxTree(pMeta, lTypeTemplate, lLengthParameter);
    }

    /**
     * Try to resolve raw type as boolean type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveBoolean(pRawName: string, pRawTemplate: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree | null {
        // Resolve boolean type.
        if (pRawName !== 'Boolean') { // TODO: Use some sort of constant.
            return null;
        }

        // Boolean should not have any templates.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Boolean can't have templates values.`, this);
        }

        return new PgslBooleanTypeDefinitionSyntaxTree(pMeta);
    }

    /**
     * Try to resolve raw type as build in value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveBuildIn(pRawName: string, pRawTemplate: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree | null {
        // Try to resolve type name.
        const lTypeName: PgslBuildInTypeName | undefined = EnumUtil.cast(PgslBuildInTypeName, pRawName);
        if (!lTypeName) {
            return null;
        }

        // Build BuildInType definition.
        return new PgslBuildInTypeDefinitionSyntaxTree(pMeta, lTypeName, pRawTemplate[0] ?? null);
    }

    /**
     * Try to resolve raw type as enum type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveEnum(pRawName: string, pRawTemplate: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree | null {
        // Resolve enum.
        if (!this.mTypePredefinition.enumNames.has(pRawName)) {
            return null;
        }

        // Enums should not have any templates.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Enum can't have templates values.`, this);
        }

        return new PgslEnumTypeDefinitionSyntaxTree(pRawName, pMeta);
    }

    /**
     * Try to resolve raw type as matrix value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveMatrix(pRawName: string, pRawTemplate: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree | null {
        // Try to resolve type name.
        const lTypeName: PgslMatrixTypeName | undefined = EnumUtil.cast(PgslMatrixTypeName, pRawName);
        if (!lTypeName) {
            return null;
        }

        // Validate matrix type.
        if (!pRawTemplate || pRawTemplate.length !== 1) {
            throw new Exception(`Matrix types need a single template type.`, this);
        }

        // Validate template parameter.
        const lMatrixInnerTypeTemplate: BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree = pRawTemplate[0];
        if (!(lMatrixInnerTypeTemplate instanceof BasePgslTypeDefinitionSyntaxTree)) {
            throw new Exception(`Matrix template parameter needs to be a type definition.`, this);
        }

        // Build matrix definition.
        return new PgslMatrixTypeDefinitionSyntaxTree(lTypeName, lMatrixInnerTypeTemplate, pMeta);
    }

    /**
     * Try to resolve raw type as numeric value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveNumeric(pRawName: string, pRawTemplate: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree | null {
        // Try to resolve type name.
        const lTypeName: PgslNumericTypeName | undefined = EnumUtil.cast(PgslNumericTypeName, pRawName);
        if (!lTypeName) {
            return null;
        }

        // Numerics should not have any templates.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Numeric can't have templates values.`, this);
        }

        // Build numeric definition.
        return new PgslNumericTypeDefinitionSyntaxTree(lTypeName, pMeta);
    }

    /**
     * Try to resolve raw type as pointer value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolvePointer(pRawName: string, pRawTemplate: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree {
        // Parse type again but this time without pointer.
        const lTypeDeclaration: BasePgslTypeDefinitionSyntaxTree = this.generate(pRawName, false, pRawTemplate, pMeta);

        // Build pointer type definition.
        return new PgslPointerTypeDefinitionSyntaxTree(pMeta,lTypeDeclaration);
    }

    /**
     * Try to resolve raw type as sampler value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveSampler(pRawName: string, pRawTemplate: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree | null {
        // Try to resolve type name.
        const lTypeName: PgslSamplerTypeName | undefined = EnumUtil.cast(PgslSamplerTypeName, pRawName);
        if (!lTypeName) {
            return null;
        }

        // Sampler should not have any templates.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Numeric can't have templates values.`, this);
        }

        // Build numeric definition.
        return new PgslSamplerTypeDefinitionSyntaxTree(lTypeName, pMeta);
    }

    /**
     * Try to resolve raw type as string type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveString(pRawName: string, pRawTemplate: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree | null {
        // Resolve string type.
        if (pRawName !== 'string') { // TODO: Use some sort of constant.
            return null;
        }

        // String should not have any templates.
        if (pRawTemplate.length > 0) {
            throw new Exception(`String can't have templates values.`, this);
        }

        return new PgslStringTypeDefinitionSyntaxTree(pMeta);
    }

    /**
     * Try to resolve raw type as struct type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveStruct(pRawName: string, pRawTemplate: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree<any> | null {
        // Resolve struct
        if (!this.structNames.has(pRawName)) {
            return null;
        }

        // Structs should not have any templates.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Structs can't have templates values.`, this);
        }

        // Create new struct type definition.
        return new PgslStructTypeDefinitionSyntaxTree(pRawName, pMeta);
    }

    /**
     * Try to resolve raw type as texture value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveTexture(pRawName: string, pRawTemplate: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree<any> | null {
        // Try to resolve type name.
        const lTypeName: PgslTextureTypeName | undefined = EnumUtil.cast(PgslTextureTypeName, pRawName);
        if (!lTypeName) {
            return null;
        }

        // Build texture type definition.
        return new PgslTextureTypeDefinitionSyntaxTree(lTypeName, pRawTemplate, pMeta);
    }

    /**
     * Try to resolve raw type as vector value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveVector(pRawName: string, pRawTemplate: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree | null {
        // Try to resolve type name.
        const lTypeName: PgslVectorTypeName | undefined = EnumUtil.cast(PgslVectorTypeName, pRawName);
        if (!lTypeName) {
            return null;
        }

        // Validate vector type.
        if (!pRawTemplate || pRawTemplate.length !== 1) {
            throw new Exception(`Vector types need a single template type.`, this);
        }

        // Validate template parameter.
        const lVectorInnerTypeTemplate: BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree = pRawTemplate[0];
        if (!(lVectorInnerTypeTemplate instanceof BasePgslTypeDefinitionSyntaxTree)) {
            throw new Exception(`Vector template parameter needs to be a type definition.`, this);
        }

        // Build vector definition.
        return new PgslVectorTypeDefinitionSyntaxTree(lTypeName, lVectorInnerTypeTemplate, pMeta);
    }

    /**
     * Try to resolve raw type as void type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveVoid(pRawName: string, pRawTemplate: PgslTypeTemplateList, pMeta: BasePgslSyntaxTreeMeta): BasePgslTypeDefinitionSyntaxTree | null {
        // Resolve void type.
        if (pRawName !== 'void') { // TODO: Use some sort of constant.
            return null;
        }

        // Void should not have any templates.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Void can't have templates values.`, this);
        }

        return new PgslVoidTypeDefinitionSyntaxTree(pMeta);
    }
}

type TypePredefinitions = {
    aliasNames: Set<string>;
    structNames: Set<string>;
    enumNames: Set<string>;
};
type PgslTypeTemplateList = Array<BasePgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree>;