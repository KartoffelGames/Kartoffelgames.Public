import { EnumUtil, Exception } from "@kartoffelgames/core";
import { PgslTrace } from "../../trace/pgsl-trace.ts";
import { PgslType } from "../../type/pgsl-type.ts";
import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { PgslVoidType } from "../../type/pgsl-void-type.ts";
import { PgslVectorType } from "../../type/pgsl-vector-type.ts";
import { PgslBuildInTypeName } from "../../type/enum/pgsl-build-in-type-name.enum.ts";
import { PgslMatrixTypeName } from "../../type/enum/pgsl-matrix-type-name.enum.ts";
import { PgslNumericTypeName } from "../../type/enum/pgsl-numeric-type-name.enum.ts";
import { PgslSamplerTypeName } from "../../type/enum/pgsl-sampler-build-name.enum.ts";
import { PgslTextureTypeName } from "../../type/enum/pgsl-texture-type-name.enum.ts";
import { PgslVectorTypeName } from "../../type/enum/pgsl-vector-type-name.enum.ts";
import { PgslArrayType } from "../../type/pgsl-array-type.ts";
import { PgslBooleanType } from "../../type/pgsl-boolean-type.ts";
import { PgslBuildInType } from "../../type/pgsl-build-in-type.ts";
import { PgslEnumType } from "../../type/pgsl-enum-type.ts";
import { PgslMatrixType } from "../../type/pgsl-matrix-type.ts";
import { PgslNumericType } from "../../type/pgsl-numeric-type.ts";
import { PgslPointerType } from "../../type/pgsl-pointer-type.ts";
import { PgslSamplerType } from "../../type/pgsl-sampler-type.ts";
import { PgslStringType } from "../../type/pgsl-string-type.ts";
import { PgslStructType } from "../../type/pgsl-struct-type.ts";
import { PgslTextureType } from "../../type/pgsl-texture-type.ts";
import { BasePgslExpression } from "../expression/base-pgsl-expression.ts";

// TODO: There are types that should not be transpiled, how do we handle them?

/**
 * PGSL base type definition.
 */
export class PgslTypeDefinition extends BasePgslSyntaxTree {
    private readonly mTypeName: string;
    private readonly mTemplate: Array<BasePgslSyntaxTree>;
    private readonly mIsPointer: boolean;

    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pTypeName: string, pTemplate: Array<BasePgslSyntaxTree>, pIsPointer: boolean, pMeta?: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Add templates as children.
        for (const lTemplate of pTemplate) {
            this.appendChild(lTemplate);
        }

        this.mTypeName = pTypeName;
        this.mTemplate = pTemplate;
        this.mIsPointer = pIsPointer;
    }

    /**
     * Resolve the type definition based on the current trace context.
     * 
     * @param pTrace - Trace to use for type resolution.
     * 
     * @returns Resolved type.
     */
    public resolveType(pTrace: PgslTrace): PgslType {
        // Type to pointer.
        if (this.mIsPointer) {
            return this.resolvePointer(pTrace, this.mTypeName, this.mTemplate);
        }

        let lType: PgslType | null = null;

        // Try to parse to void type.
        if ((lType = this.resolveVoid(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse to struct type.
        if ((lType = this.resolveStruct(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse alias type.
        if ((lType = this.resolveAlias(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse enum type.
        if ((lType = this.resolveEnum(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse build in type.
        if ((lType = this.resolveBuildIn(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse numeric type.
        if ((lType = this.resolveNumeric(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse boolean type.
        if ((lType = this.resolveBoolean(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse string type.
        if ((lType = this.resolveString(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse vector type.
        if ((lType = this.resolveVector(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse matrix type.
        if ((lType = this.resolveMatrix(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse sampler type.
        if ((lType = this.resolveSampler(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse array type.
        if ((lType = this.resolveArray(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        // Try to parse texture type.
        if ((lType = this.resolveTexture(pTrace, this.mTypeName, this.mTemplate)) !== null) {
            return lType;
        }

        throw new Exception(`Typename "${this.mTypeName}" not defined`, this);
    }

    /**
     * Trace this syntax tree node and its children.
     * Only traces the templates as they are the only children.
     * 
     * @param pTrace - Trace to use for tracing.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        for (const lTemplate of this.mTemplate) {
            lTemplate.trace(pTrace);
        }
    }

    /**
     * Try to resolve raw type as alias type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveAlias(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Resolve alias
        if (!this.mTypePredefinition.aliasNames.has(pRawName)) {
            return null;
        }

        // No templares allowed.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Alias can't have templates values.`, this);
        }

        return new PgslAliasedType(pMeta, pRawName);
    }

    /**
     * Try to resolve raw type as array type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveArray(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
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
        const lTypeTemplate: PgslType | BasePgslExpression = pRawTemplate[0];
        if (!(lTypeTemplate instanceof PgslType)) {
            throw new Exception(`First array template parameter must be a type.`, this);
        }

        // Second length parameter.
        let lLengthParameter: BasePgslExpression | null = null;
        if (pRawTemplate.length > 1) {
            const lLengthTemplate: PgslType | BasePgslExpression = pRawTemplate[1];
            if (!(lLengthTemplate instanceof BasePgslExpression)) {
                throw new Exception(`Arra length template parameter cant be a type.`, this);
            }

            // Set optional length expression.
            lLengthParameter = lLengthTemplate;
        }

        // Build BuildInType definition.
        return new PgslArrayType(pMeta, lTypeTemplate, lLengthParameter);
    }

    /**
     * Try to resolve raw type as boolean type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveBoolean(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Resolve boolean type.
        if (pRawName !== 'Boolean') { // TODO: Use some sort of constant.
            return null;
        }

        // Boolean should not have any templates.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Boolean can't have templates values.`, this);
        }

        return new PgslBooleanType(pMeta);
    }

    /**
     * Try to resolve raw type as build in value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveBuildIn(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Try to resolve type name.
        const lTypeName: PgslBuildInTypeName | undefined = EnumUtil.cast(PgslBuildInTypeName, pRawName);
        if (!lTypeName) {
            return null;
        }

        // Build BuildInType definition.
        return new PgslBuildInType(pMeta, lTypeName, pRawTemplate[0] ?? null);
    }

    /**
     * Try to resolve raw type as enum type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveEnum(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Resolve enum.
        if (!this.mTypePredefinition.enumNames.has(pRawName)) {
            return null;
        }

        // Enums should not have any templates.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Enum can't have templates values.`, this);
        }

        return new PgslEnumType(pRawName, pMeta);
    }

    /**
     * Try to resolve raw type as matrix value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveMatrix(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
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
        const lMatrixInnerTypeTemplate: PgslType | BasePgslExpression = pRawTemplate[0];
        if (!(lMatrixInnerTypeTemplate instanceof PgslType)) {
            throw new Exception(`Matrix template parameter needs to be a type definition.`, this);
        }

        // Build matrix definition.
        return new PgslMatrixType(lTypeName, lMatrixInnerTypeTemplate, pMeta);
    }

    /**
     * Try to resolve raw type as numeric value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveNumeric(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
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
        return new PgslNumericType(lTypeName, pMeta);
    }

    /**
     * Try to resolve raw type as pointer value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolvePointer(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType {
        // Parse type again but this time without pointer.
        const lTypeDeclaration: PgslType = this.resolveType(pRawName, false, pRawTemplate);

        // Build pointer type definition.
        return new PgslPointerType(pMeta, lTypeDeclaration);
    }

    /**
     * Try to resolve raw type as sampler value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveSampler(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
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
        return new PgslSamplerType(lTypeName, pMeta);
    }

    /**
     * Try to resolve raw type as string type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveString(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Resolve string type.
        if (pRawName !== 'string') { // TODO: Use some sort of constant.
            return null;
        }

        // String should not have any templates.
        if (pRawTemplate.length > 0) {
            throw new Exception(`String can't have templates values.`, this);
        }

        return new PgslStringType(pMeta);
    }

    /**
     * Try to resolve raw type as struct type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveStruct(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Resolve struct
        if (!this.structNames.has(pRawName)) {
            return null;
        }

        // Structs should not have any templates.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Structs can't have templates values.`, this);
        }

        // Create new struct type definition.
        return new PgslStructType(pRawName, pMeta);
    }

    /**
     * Try to resolve raw type as texture value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveTexture(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Try to resolve type name.
        const lTypeName: PgslTextureTypeName | undefined = EnumUtil.cast(PgslTextureTypeName, pRawName);
        if (!lTypeName) {
            return null;
        }

        // Build texture type definition.
        return new PgslTextureType(lTypeName, pRawTemplate, pMeta);
    }

    /**
     * Try to resolve raw type as vector value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveVector(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
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
        const lVectorInnerTypeTemplate: PgslType | BasePgslExpression = pRawTemplate[0];
        if (!(lVectorInnerTypeTemplate instanceof PgslType)) {
            throw new Exception(`Vector template parameter needs to be a type definition.`, this);
        }

        // Build vector definition.
        return new PgslVectorType(lTypeName, lVectorInnerTypeTemplate);
    }

    /**
     * Try to resolve raw type as void type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveVoid(pTrace: PgslTrace, pRawName: string, pRawTemplate: Array<BasePgslSyntaxTree>): PgslType | null {
        // Resolve void type.
        if (pRawName !== 'void') { // TODO: Use some sort of constant.
            return null;
        }

        // Void should not have any templates.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Void can't have templates values.`, this);
        }

        return new PgslVoidType();
    }
}
