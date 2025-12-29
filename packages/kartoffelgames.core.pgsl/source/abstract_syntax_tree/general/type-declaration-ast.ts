import { Exception } from '@kartoffelgames/core';
import { PgslArrayType } from '../type/pgsl-array-type.ts';
import { PgslBooleanType } from '../type/pgsl-boolean-type.ts';
import { PgslBuildInType } from '../type/pgsl-build-in-type.ts';
import { PgslInvalidType } from '../type/pgsl-invalid-type.ts';
import { PgslMatrixType } from '../type/pgsl-matrix-type.ts';
import { PgslNumericType } from '../type/pgsl-numeric-type.ts';
import { PgslPointerType } from '../type/pgsl-pointer-type.ts';
import { PgslSamplerType } from '../type/pgsl-sampler-type.ts';
import { PgslStringType } from '../type/pgsl-string-type.ts';
import { PgslStructType } from '../type/pgsl-struct-type.ts';
import { PgslTextureType } from '../type/pgsl-texture-type.ts';
import type { IType } from '../type/i-type.interface.ts';
import { PgslVectorType } from '../type/pgsl-vector-type.ts';
import { PgslVoidType } from '../type/pgsl-void-type.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { IExpressionAst } from '../expression/i-expression-ast.interface.ts';
import type { Cst, TypeDeclarationCst } from '../../concrete_syntax_tree/general.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import type { AliasDeclarationAst } from '../declaration/alias-declaration-ast.ts';
import type { ExpressionCst } from '../../concrete_syntax_tree/expression.type.ts';
import { ExpressionAstBuilder } from '../expression/expression-ast-builder.ts';

/**
 * PGSL base type definition.
 */
export class TypeDeclarationAst extends AbstractSyntaxTree<TypeDeclarationCst, TypeDeclarationAstData> {
    /**
     * Process this syntax tree node and its children.
     * Only traces the templates as they are the only children.
     * 
     * @param pContext - Ast build context.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): TypeDeclarationAstData {
        return {
            type: this.resolveType(pContext)
        };
    }

    /**
     * Try to resolve raw type as alias type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveAlias(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<Cst<string>>): IType | null {
        // Resolve alias
        const lAlias: AliasDeclarationAst | undefined = pContext.getAlias(pRawName);
        if (!lAlias) {
            return null;
        }

        // No templates allowed.
        if (pRawTemplate.length > 0) {
            throw new Exception(`Alias can't have templates values.`, this);
        }

        return lAlias.data.underlyingType;
    }

    /**
     * Try to resolve raw type as array type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveArray(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): IType | null {
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
        const lTypeTemplate: TypeDeclarationAst | null = (() => {
            const lTypeTemplate: TypeDeclarationAstTemplate | undefined = pRawTemplate[0];
            if (!lTypeTemplate || lTypeTemplate.type !== 'TypeDeclaration') {
                pContext.pushIncident(`First array template parameter must be a type.`, this);
                return null;
            }

            return new TypeDeclarationAst(lTypeTemplate).process(pContext);
        })();

        // Second length parameter.
        const lLengthParameter: IExpressionAst | null = (() => {
            if (pRawTemplate.length > 1) {
                const lLengthTemplate: TypeDeclarationAstTemplate | undefined = pRawTemplate[1];

                if (!lLengthTemplate || lLengthTemplate.type === 'TypeDeclaration') {
                    pContext.pushIncident(`Array length template must be a expression.`, this);
                    return null;
                }

                // Set optional length expression.
                return ExpressionAstBuilder.build(lLengthTemplate, pContext);
            }

            return null;
        })();

        if (lTypeTemplate === null) {
            return new PgslInvalidType().process(pContext);
        }

        // Build array definition.
        return new PgslArrayType(lTypeTemplate.data.type, lLengthParameter).process(pContext);
    }

    /**
     * Try to resolve raw type as boolean type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveBoolean(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): IType | null {
        // Resolve boolean type.
        if (pRawName !== PgslBooleanType.typeName.boolean) {
            return null;
        }

        // Boolean should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Boolean can't have templates values.`, this);
        }

        return new PgslBooleanType().process(pContext);
    }

    /**
     * Try to resolve raw type as build in value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveBuildIn(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): IType | null {
        // Try to resolve type name.
        if (!Object.values(PgslBuildInType.typeName).includes(pRawName as any)) {
            return null;
        }

        // Validate build in type with template.
        const lTemplateExpression: IExpressionAst | null = (() => {
            if (pRawTemplate.length > 0) {
                // Only one template allowed.
                if (pRawTemplate.length > 1) {
                    pContext.pushIncident(`Build-in type supports only a single template value.`, this);
                }

                // Build in types support only a single expression parameter.
                const lTemplateExpression: TypeDeclarationAstTemplate = pRawTemplate[0];
                if (!lTemplateExpression || lTemplateExpression.type === 'TypeDeclaration') {
                    pContext.pushIncident(`Build-in type  template must be a expression.`, this);
                    return null;
                }

                // Build template expression.
                return ExpressionAstBuilder.build(lTemplateExpression, pContext);
            }

            return null;
        })();


        // Build BuildInType definition without template.
        return new PgslBuildInType(pRawName as any, lTemplateExpression).process(pContext);
    }

    /**
     * Try to resolve raw type as enum type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveEnum(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): IType | null {
        // Resolve enum.
        const lEnum = pContext.getEnum(pRawName);
        if (!lEnum) {
            return null;
        }

        // Enums should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Enum can't have templates values.`, this);
        }

        return lEnum.data.underlyingType;
    }

    /**
     * Try to resolve raw type as matrix value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveMatrix(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): IType | null {
        // Try to resolve type name.
        if (!Object.values(PgslMatrixType.typeName).includes(pRawName as any)) {
            return null;
        }

        // Validate matrix type.
        if (!pRawTemplate || pRawTemplate.length !== 1) {
            pContext.pushIncident(`Matrix types need a single template type.`, this);
        }

        // Validate template parameter.
        const lInnerTypeDefinition: TypeDeclarationAstTemplate = pRawTemplate[0];
        if (lInnerTypeDefinition.type !== 'TypeDeclaration') {
            pContext.pushIncident(`Matrix template parameter needs to be a type definition.`, this);
            return new PgslInvalidType().process(pContext);
        }

        // Build inner type.
        const lInnerTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(lInnerTypeDefinition).process(pContext);

        const [lColumns, lRows] = PgslMatrixType.dimensionsOf(pRawName as any);

        // Build matrix definition.
        return new PgslMatrixType(lColumns, lRows, lInnerTypeDeclaration.data.type).process(pContext);
    }

    /**
     * Try to resolve raw type as numeric value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveNumeric(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): IType | null {
        // Try to resolve type name.
        if (!Object.values(PgslNumericType.typeName).includes(pRawName as any)) {
            return null;
        }

        // Numerics should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Numeric can't have templates values.`, this);
        }

        // Build numeric definition.
        return new PgslNumericType(pRawName as any).process(pContext);
    }

    /**
     * Try to resolve raw type as pointer value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolvePointer(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): IType {
        // Create none pointer type definition.
        const lConcreteTypeDeclaration: TypeDeclarationCst = {
            type: 'TypeDeclaration',
            range: this.cst.range,
            typeName: pRawName,
            template: pRawTemplate,
            isPointer: false
        };

        // Create a new type declaration without pointer.
        const lInnerTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(lConcreteTypeDeclaration).process(pContext);
        const lInnerType: IType = lInnerTypeDeclaration.data.type;

        // Build pointer type definition.
        return new PgslPointerType(lInnerType).process(pContext);
    }

    /**
     * Try to resolve raw type as sampler value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveSampler(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): IType | null {
        // Try to resolve type name.
        if (pRawName !== PgslSamplerType.typeName.sampler && pRawName !== PgslSamplerType.typeName.samplerComparison) {
            return null;
        }

        // Sampler should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Sampler type can't have template parameters.`, this);
        }

        // Build numeric definition.
        return new PgslSamplerType(pRawName === PgslSamplerType.typeName.samplerComparison).process(pContext);
    }

    /**
     * Try to resolve raw type as string type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveString(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): IType | null {
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

        return new PgslStringType().process(pContext);
    }

    /**
     * Try to resolve raw type as struct type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveStruct(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): IType | null {
        // Resolve struct
        if (!pContext.getStruct(pRawName)) {
            return null;
        }

        // Structs should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Structs can't have templates values.`, this);
        }

        // Create new struct type definition.
        return new PgslStructType(pRawName).process(pContext);
    }

    /**
     * Try to resolve raw type as texture value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveTexture(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): IType | null {
        // Try to resolve type name.
        if (!Object.values(PgslTextureType.typeName).includes(pRawName as any)) {
            return null;
        }

        // Validate texture templates, that they are eighter a PgslExpression or ITypeDeclaration.
        const lTemplateAstList: Array<IExpressionAst | TypeDeclarationAst> = new Array<IExpressionAst | TypeDeclarationAst>();
        for (const lTemplate of pRawTemplate) {
            if (lTemplate.type === 'TypeDeclaration') {
                // Build type declaration template.
                lTemplateAstList.push(new TypeDeclarationAst(lTemplate).process(pContext));
            } else {
                const lTemplateExpression: IExpressionAst = ExpressionAstBuilder.build(lTemplate, pContext);

                // Build expression template.
                lTemplateAstList.push(lTemplateExpression);
            }
        }

        // Build texture type definition.
        return new PgslTextureType(pRawName as any, lTemplateAstList).process(pContext);
    }

    /**
     * Resolve the type definition based on the current trace context.
     * 
     * @param pContext - Trace to use for type resolution.
     * 
     * @returns Resolved type.
     */
    private resolveType(pContext: AbstractSyntaxTreeContext): IType {
        // Type to pointer.
        if (this.cst.isPointer) {
            return this.resolvePointer(pContext, this.cst.typeName, this.cst.template);
        }

        let lType: IType | null = null;

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
        return new PgslInvalidType().process(pContext);
    }

    /**
     * Try to resolve raw type as vector value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveVector(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): IType | null {
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

        // Validate vector type.
        if (!pRawTemplate || pRawTemplate.length !== 1) {
            pContext.pushIncident(`Vector types need a single template type.`, this);
        }

        // Validate template parameter.
        const lInnerTypeDefinition: TypeDeclarationAstTemplate = pRawTemplate[0];
        if (lInnerTypeDefinition.type !== 'TypeDeclaration') {
            pContext.pushIncident(`Vector template parameter needs to be a type definition.`, this);
            return new PgslInvalidType().process(pContext);
        }

        // Build inner type.
        const lInnerTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(lInnerTypeDefinition).process(pContext);

        // Build vector definition.
        return new PgslVectorType(lVectorDimension, lInnerTypeDeclaration.data.type).process(pContext);
    }

    /**
     * Try to resolve raw type as void type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveVoid(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): IType | null {
        // Resolve void type.
        if (pRawName !== PgslVoidType.typeName.void) {
            return null;
        }

        // Void should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Void type can't have template parameters.`, this);
        }

        return new PgslVoidType().process(pContext);
    }
}

type TypeDeclarationAstTemplate = ExpressionCst | TypeDeclarationCst;
type TypeDeclarationAstTemplateList = Array<TypeDeclarationAstTemplate>;

export type TypeDeclarationAstData = {
    type: IType;
};