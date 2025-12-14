import { Exception } from '@kartoffelgames/core';
import { PgslArrayType } from '../../type/pgsl-array-type.ts';
import { PgslBooleanType } from '../../type/pgsl-boolean-type.ts';
import { PgslBuildInType } from '../../type/pgsl-build-in-type.ts';
import { PgslInvalidType } from '../../type/pgsl-invalid-type.ts';
import { PgslMatrixType } from '../../type/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../type/pgsl-numeric-type.ts';
import { PgslPointerType } from '../../type/pgsl-pointer-type.ts';
import { PgslSamplerType } from '../../type/pgsl-sampler-type.ts';
import { PgslStringType } from '../../type/pgsl-string-type.ts';
import { PgslStructType } from '../../type/pgsl-struct-type.ts';
import { PgslTextureType } from '../../type/pgsl-texture-type.ts';
import type { PgslType } from '../../type/pgsl-type.ts';
import { PgslVectorType } from '../../type/pgsl-vector-type.ts';
import { PgslVoidType } from '../../type/pgsl-void-type.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import { IExpressionAst } from '../expression/i-expression-ast.interface.ts';
import { TypeDeclarationCst } from "../../concrete_syntax_tree/general.type.ts";
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";

/**
 * PGSL base type definition.
 */
export class TypeDeclarationAst extends AbstractSyntaxTree<TypeDeclarationCst, TypeDeclarationAstData> {
    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pConcreteSyntaxTree: TypeDeclarationCst, pContext: AbstractSyntaxTreeContext) {
        super(pConcreteSyntaxTree, pContext);
    }

    /**
     * Process this syntax tree node and its children.
     * Only traces the templates as they are the only children.
     * 
     * @param pContext - Ast build context.
     */
    protected override process(pContext: AbstractSyntaxTreeContext): TypeDeclarationAstData {
        return {
            type: this.resolveType(pContext)
        }
    }

    /**
     * Resolve the type definition based on the current trace context.
     * 
     * @param pContext - Trace to use for type resolution.
     * 
     * @returns Resolved type.
     */
    private resolveType(pContext: AbstractSyntaxTreeContext): PgslType {
        // Type to pointer.
        if (this.cst.isPointer) {
            return this.resolvePointer(pContext, this.cst.typeName, this.cst.template);
        }

        let lType: PgslType | null = null;

        // Try to parse to void type.
        if ((lType = this.resolveVoid(pContext, this.cst.typeName, this.cst.template)) !== null) {
            return lType;
        }

        // Try to parse to struct type.
        if ((lType = this.resolveStruct(pContext, this.cst.typeName, this.cst.template)) !== null) {
            return lType;
        }

        // Try to parse alias type.
        if ((lType = this.resolveAlias(pContext, this.cst.typeName, this.cst.template)) !== null) {
            return lType;
        }

        // Try to parse enum type.
        if ((lType = this.resolveEnum(pContext, this.cst.typeName, this.cst.template)) !== null) {
            return lType;
        }

        // Try to parse build in type.
        if ((lType = this.resolveBuildIn(pContext, this.cst.typeName, this.cst.template)) !== null) {
            return lType;
        }

        // Try to parse numeric type.
        if ((lType = this.resolveNumeric(pContext, this.cst.typeName, this.cst.template)) !== null) {
            return lType;
        }

        // Try to parse boolean type.
        if ((lType = this.resolveBoolean(pContext, this.cst.typeName, this.cst.template)) !== null) {
            return lType;
        }

        // Try to parse string type.
        if ((lType = this.resolveString(pContext, this.cst.typeName, this.cst.template)) !== null) {
            return lType;
        }

        // Try to parse vector type.
        if ((lType = this.resolveVector(pContext, this.cst.typeName, this.cst.template)) !== null) {
            return lType;
        }

        // Try to parse matrix type.
        if ((lType = this.resolveMatrix(pContext, this.cst.typeName, this.cst.template)) !== null) {
            return lType;
        }

        // Try to parse sampler type.
        if ((lType = this.resolveSampler(pContext, this.cst.typeName, this.cst.template)) !== null) {
            return lType;
        }

        // Try to parse array type.
        if ((lType = this.resolveArray(pContext, this.cst.typeName, this.cst.template)) !== null) {
            return lType;
        }

        // Try to parse texture type.
        if ((lType = this.resolveTexture(pContext, this.cst.typeName, this.cst.template)) !== null) {
            return lType;
        }

        // Type not found.
        pContext.pushIncident(`Typename "${this.cst.typeName}" not defined.`, this);
        return new PgslInvalidType(pContext);
    }

    /**
     * Try to resolve raw type as alias type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveAlias(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<AbstractSyntaxTree>): PgslType | null {
        // Resolve alias
        const lAlias = pContext.getAlias(pRawName);
        if (!lAlias) {
            return null;
        }

        // No templates allowed.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Alias can't have templates values.`, this);
        }

        return lAlias.underlyingType;
    }

    /**
     * Try to resolve raw type as array type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveArray(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<AbstractSyntaxTree>): PgslType | null {
        // Resolve array type.
        if (pRawName !== PgslArrayType.typeName.array) {
            return null;
        }

        // Arrays need at least one type parameter.
        if (!pRawTemplate || pRawTemplate.length < 1) {
            pContext.pushIncident(`Arrays need at least one template parameter`, this);
        }

        // But not more than two parameter.
        if (pRawTemplate.length > 2) {
            pContext.pushIncident(`Arrays supports only two template parameter.`, this);
        }

        // First template needs to be a type.
        const lTypeTemplate: AbstractSyntaxTree | undefined = pRawTemplate[0];
        if (!(lTypeTemplate instanceof TypeDeclarationAst)) {
            pContext.pushIncident(`First array template parameter must be a type.`, this);

            // Fallback to invalid type.
            return new PgslInvalidType(pContext);
        }

        // Second length parameter.
        let lLengthParameter: IExpressionAst | null = null;
        if (pRawTemplate.length > 1) {
            const lLengthTemplate: AbstractSyntaxTree = pRawTemplate[1];
            if (!(lLengthTemplate instanceof IExpressionAst)) {
                pContext.pushIncident(`Array length template must be a expression.`, this);
            } else {
                // Set optional length expression.
                lLengthParameter = lLengthTemplate;
            }
        }

        // Build BuildInType definition.
        return new PgslArrayType(pContext, lTypeTemplate.data.type, lLengthParameter);
    }

    /**
     * Try to resolve raw type as boolean type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveBoolean(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<AbstractSyntaxTree>): PgslType | null {
        // Resolve boolean type.
        if (pRawName !== PgslBooleanType.typeName.boolean) {
            return null;
        }

        // Boolean should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Boolean can't have templates values.`, this);
        }

        return new PgslBooleanType(pContext);
    }

    /**
     * Try to resolve raw type as build in value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveBuildIn(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<AbstractSyntaxTree>): PgslType | null {
        // Try to resolve type name.
        if (!Object.values(PgslBuildInType.typeName).includes(pRawName as any)) {
            return null;
        }

        // Validate build in type with template.
        if (pRawTemplate.length > 1) {
            // Build in types support only a single expression parameter.
            const lTemplateExpression: AbstractSyntaxTree = pRawTemplate[0];
            if (!(lTemplateExpression instanceof IExpressionAst)) {
                pContext.pushIncident(`Array length template must be a expression.`, this);
                return new PgslInvalidType(pContext);
            }

            // Build BuildInType definition with template. 
            return new PgslBuildInType(pContext, pRawName as any, lTemplateExpression);
        }

        // Build BuildInType definition without template.
        return new PgslBuildInType(pContext, pRawName as any, null);
    }

    /**
     * Try to resolve raw type as enum type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveEnum(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<AbstractSyntaxTree>): PgslType | null {
        // Resolve enum.
        const lEnum = pContext.getEnum(pRawName);
        if (!lEnum) {
            return null;
        }

        // Enums should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Enum can't have templates values.`, this);
        }

        return lEnum.underlyingType;
    }

    /**
     * Try to resolve raw type as matrix value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveMatrix(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<AbstractSyntaxTree>): PgslType | null {
        // Try to resolve type name.
        if (!Object.values(PgslMatrixType.typeName).includes(pRawName as any)) {
            return null;
        }

        // Validate matrix type.
        if (!pRawTemplate || pRawTemplate.length !== 1) {
            pContext.pushIncident(`Matrix types need a single template type.`, this);
        }

        // Validate template parameter.
        const lInnerTypeDefinition: AbstractSyntaxTree = pRawTemplate[0];
        if (!(lInnerTypeDefinition instanceof TypeDeclarationAst)) {
            pContext.pushIncident(`Matrix template parameter needs to be a type definition.`, this);
            return new PgslInvalidType(pContext);
        }

        // Build matrix definition.
        return new PgslMatrixType(pContext, pRawName as any, lInnerTypeDefinition.data.type);
    }

    /**
     * Try to resolve raw type as numeric value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveNumeric(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<AbstractSyntaxTree>): PgslType | null {
        // Try to resolve type name.
        if (!Object.values(PgslNumericType.typeName).includes(pRawName as any)) {
            return null;
        }

        // Numerics should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Numeric can't have templates values.`, this);
        }

        // Build numeric definition.
        return new PgslNumericType(pContext, pRawName as any);
    }

    /**
     * Try to resolve raw type as pointer value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolvePointer(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<AbstractSyntaxTree>): PgslType {
        // Create a new type declaration without pointer.
        const lInnerTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(pRawName, pRawTemplate, false);
        lInnerTypeDeclaration.trace(pContext);

        // Resolve inner type.
        const lTypeDeclaration: PgslType = lInnerTypeDeclaration.type;

        // Build pointer type definition.
        return new PgslPointerType(pContext, lTypeDeclaration);
    }

    /**
     * Try to resolve raw type as sampler value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveSampler(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<AbstractSyntaxTree>): PgslType | null {
        // Try to resolve type name.
        if (pRawName !== PgslSamplerType.typeName.sampler && pRawName !== PgslSamplerType.typeName.samplerComparison) {
            return null;
        }

        // Sampler should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Sampler type can't have template parameters.`, this);
        }

        // Build numeric definition.
        return new PgslSamplerType(pContext, pRawName === PgslSamplerType.typeName.samplerComparison);
    }

    /**
     * Try to resolve raw type as string type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveString(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<AbstractSyntaxTree>): PgslType | null {
        // Resolve string type.
        if (pRawName !== PgslStringType.typeName.string) {
            return null;
        }

        // String should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`String type can't have template parameters.`, this);
        }

        // String should never be used directly.
        pContext.pushIncident(`String type can't be explicit defined.`, this);

        return new PgslStringType(pContext);
    }

    /**
     * Try to resolve raw type as struct type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveStruct(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<AbstractSyntaxTree>): PgslType | null {
        // Resolve struct
        if (!pContext.getStruct(pRawName)) {
            return null;
        }

        // Structs should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Structs can't have templates values.`, this);
        }

        // Create new struct type definition.
        return new PgslStructType(pContext, pRawName);
    }

    /**
     * Try to resolve raw type as texture value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveTexture(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<AbstractSyntaxTree>): PgslType | null {
        // Try to resolve type name.
        if (!Object.values(PgslTextureType.typeName).includes(pRawName as any)) {
            return null;
        }

        // Validate texture templates, that they are eighter a PgslExpression or PgslTypeDeclaration.
        for (const lTemplate of pRawTemplate) {
            if (!(lTemplate instanceof IExpressionAst) && !(lTemplate instanceof TypeDeclarationAst)) {
                pContext.pushIncident(`Texture template parameters must be either a type definition or an expression.`, this);
            }
        }

        // Build texture type definition.
        return new PgslTextureType(pContext, pRawName as any, pRawTemplate as Array<TypeDeclarationAst | IExpressionAst>);
    }

    /**
     * Try to resolve raw type as vector value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveVector(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<AbstractSyntaxTree>): PgslType | null {
        // Try to resolve type name.
        if (!Object.values(PgslVectorType.typeName).includes(pRawName as any)) {
            return null;
        }

        const lVectorDimension: number = (() => {
            switch (pRawName) {
                case PgslVectorType.typeName.vector2: return 2;
                case PgslVectorType.typeName.vector3: return 3;
                case PgslVectorType.typeName.vector4: return 4;
                default: return 2; // Should never happen.
            }
        })();

        let lInnerType: PgslType | null = (() => {
            // Vector needs a single template parameter.
            if (!pRawTemplate || pRawTemplate.length < 1) {
                pContext.pushIncident(`Vector types need a single template type.`, this);
                return null;
            }

            // First template must to be a type definition.
            const lVectorInnerTypeTemplate: AbstractSyntaxTree = pRawTemplate[0];
            if (!(lVectorInnerTypeTemplate instanceof TypeDeclarationAst)) {
                pContext.pushIncident(`Vector template parameter needs to be a type definition.`, this);
                return null;
            }

            return lVectorInnerTypeTemplate.resolveType(pContext);
        })();

        // Fallback to invalid type.
        if (lInnerType === null) {
            lInnerType = new PgslInvalidType(pContext);
        }

        // Build vector definition.
        return new PgslVectorType(pContext, lVectorDimension, lInnerType);
    }

    /**
     * Try to resolve raw type as void type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveVoid(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<AbstractSyntaxTree>): PgslType | null {
        // Resolve void type.
        if (pRawName !== PgslVoidType.typeName.void) {
            return null;
        }

        // Void should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Void type can't have template parameters.`, this);
        }

        return new PgslVoidType(pContext);
    }
}

export type TypeDeclarationAstData = {
    type: PgslType;
};