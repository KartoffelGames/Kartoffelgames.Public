import { Exception } from '@kartoffelgames/core';
import { type PgslAccessMode, PgslAccessModeEnum } from '../../feature_set/enum/pgsl-access-mode-enum.ts';
import { type PgslTexelFormat, PgslTexelFormatEnum } from '../../feature_set/enum/pgsl-texel-format-enum.ts';
import type { ExpressionCst, VariableNameExpressionCst } from '../../concrete_syntax_tree/expression.type.ts';
import type { Cst, TypeDeclarationCst } from '../../concrete_syntax_tree/general.type.ts';
import { PgslValueFixedState } from '../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { AliasDeclarationAst } from '../declaration/alias-declaration-ast.ts';
import type { StructDeclarationAst } from '../declaration/struct-declaration-ast.ts';
import { ExpressionAstBuilder } from '../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../expression/i-expression-ast.interface.ts';
import { type BasePgslType, BasePgslTypeKind } from '../type/definition/base-pgsl-type.ts';
import { PgslArrayType } from '../type/definition/pgsl-array-type.ts';
import { PgslBooleanType } from '../type/definition/pgsl-boolean-type.ts';
import { PgslBuildInType, type PgslBuildInTypeName } from '../type/definition/pgsl-build-in-type.ts';
import { PgslInvalidType } from '../type/definition/pgsl-invalid-type.ts';
import { PgslMatrixType } from '../type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../type/definition/pgsl-numeric-type.ts';
import { PgslPointerType } from '../type/definition/pgsl-pointer-type.ts';
import { PgslSamplerType } from '../type/definition/pgsl-sampler-type.ts';
import { PgslStringType } from '../type/definition/pgsl-string-type.ts';
import { PgslStructType } from '../type/definition/pgsl-struct-type.ts';
import { PgslTextureType, type PgslTextureTypeName } from '../type/definition/pgsl-texture-type.ts';
import { PgslVectorType } from '../type/definition/pgsl-vector-type.ts';
import { PgslVoidType } from '../type/definition/pgsl-void-type.ts';

/**
 * PGSL base type definition.
 */
export class TypeDeclarationAst extends AbstractSyntaxTree<TypeDeclarationCst, TypeDeclarationAstData> {
    /**
     * Process this syntax tree node and its children.
     * Only traces the templates as they are the only children.
     * 
     * @param pContext - Ast build context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: TypeDeclarationCst): TypeDeclarationAstData {
        // Register type name useage.
        pContext.registerSymbolUsage(pCst.typeName);

        // Build-in types are declared with their underlying type and only keep their name for the declaration.
        const lType: BasePgslType = this.resolveType(pContext, pCst);
        if (lType instanceof PgslBuildInType) {
            return {
                type: lType.underlyingType,
                buildIn: lType.typename
            };
        }

        return {
            type: lType
        };
    }

    /**
     * Try to resolve raw type as alias type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveAlias(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: Array<Cst<string>>): BasePgslType | null {
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
    private resolveArray(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): BasePgslType | null {
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
                const lLengthTemplate: ExpressionCst | null = this.resolveTemplateAsExpression(pRawTemplate[1]);
                if (!lLengthTemplate) {
                    pContext.pushIncident(`Array length template must be a expression.`, this);
                    return null;
                }

                const lLengthExpression: IExpressionAst = ExpressionAstBuilder.build(lLengthTemplate).process(pContext);

                // Length expression must be an unsigned integer scalar.
                if (lLengthExpression.data.resolveType.conversionRankTo(new PgslNumericType(PgslNumericType.typeName.unsignedInteger)) === Number.POSITIVE_INFINITY) {
                    pContext.pushIncident(`Array length expression must be of unsigned integer type.`, lLengthExpression);
                }

                // Length expression must be constant or a pipeline parameter constant.
                if (lLengthExpression.data.fixedState < PgslValueFixedState.PipelineCreationFixed) {
                    pContext.pushIncident(`Array length expression must be a constant expression.`, lLengthExpression);
                }

                // Set optional length expression.
                return lLengthExpression;
            }

            return null;
        })();

        if (lTypeTemplate === null) {
            return new PgslInvalidType();
        }

        // Build array definition.
        return new PgslArrayType(lTypeTemplate.data.type, lLengthParameter);
    }

    /**
     * Try to resolve raw type as boolean type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveBoolean(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): BasePgslType | null {
        // Resolve boolean type.
        if (pRawName !== PgslBooleanType.typeName.boolean) {
            return null;
        }

        // Boolean should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Boolean can't have templates values.`, this);
        }

        return new PgslBooleanType();
    }

    /**
     * Try to resolve raw type as build in value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveBuildIn(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): BasePgslType | null {
        // Try to resolve type name.
        if (!Object.values(PgslBuildInType.typeName).includes(pRawName as any)) {
            return null;
        }

        const lBuildInTypeName: PgslBuildInTypeName = pRawName as any;

        // Validate build in type with template.
        const lTemplateExpression: IExpressionAst | null = (() => {
            if (pRawTemplate.length > 0) {
                // Only one template allowed.
                if (pRawTemplate.length > 1) {
                    pContext.pushIncident(`Build-in type supports only a single template value.`, this);
                }

                // Build in types support only a single expression parameter.
                const lTemplateExpression: ExpressionCst | null = this.resolveTemplateAsExpression(pRawTemplate[0]);
                if (!lTemplateExpression) {
                    pContext.pushIncident(`Build-in type  template must be a expression.`, this);
                    return null;
                }

                // Build template expression.
                return ExpressionAstBuilder.build(lTemplateExpression).process(pContext);
            }

            return null;
        })();

        // Only clip distance needs validation.
        if (lBuildInTypeName === PgslBuildInType.typeName.clipDistances) {
            // Template must be provided for ClipDistances.
            if (!lTemplateExpression) {
                pContext.pushIncident(`Clip distance built-in template value must have a value expression.`);
            } else {
                // Template needs to be a constant.
                if (lTemplateExpression.data.fixedState < PgslValueFixedState.Constant) {
                    pContext.pushIncident(`Clip distance built-in template value must be a constant.`);
                }

                // Template needs to be a unsigned integer.
                if (lTemplateExpression.data.resolveType.conversionRankTo(new PgslNumericType(PgslNumericType.typeName.unsignedInteger)) === Number.POSITIVE_INFINITY) {
                    pContext.pushIncident(`Clip distance built-in template value must be an unsigned integer.`);
                }
            }
        }

        // Build BuildInType definition. It is split into its underlying type and name after the type is resolved.
        return new PgslBuildInType(lBuildInTypeName, lTemplateExpression);
    }

    /**
     * Try to resolve raw type as enum type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveEnum(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): BasePgslType | null {
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
    private resolveMatrix(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): BasePgslType | null {
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
            return new PgslInvalidType();
        }

        // Build inner type.
        const lInnerTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(lInnerTypeDefinition).process(pContext);
        const lInnerType: BasePgslType = lInnerTypeDeclaration.data.type;

        // A matrix can only be composed of floating point components.
        if (!lInnerType.isKind(BasePgslTypeKind.Float)) {
            pContext.pushIncident(`Matrix component type must be a floating point type.`, this);
        }

        const [lColumns, lRows] = PgslMatrixType.dimensionsOf(pRawName as any);

        // Build matrix definition.
        return new PgslMatrixType(lColumns, lRows, lInnerType);
    }

    /**
     * Try to resolve raw type as numeric value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveNumeric(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): BasePgslType | null {
        // Try to resolve type name.
        if (!Object.values(PgslNumericType.typeName).includes(pRawName as any)) {
            return null;
        }

        // Numerics should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Numeric can't have templates values.`, this);
        }

        // Build numeric definition.
        return new PgslNumericType(pRawName as any);
    }

    /**
     * Try to resolve raw type as pointer value.
     * 
     * @param pRawName - Type raw name.
     * @param pCst - Cst data of type declaration.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolvePointer(pContext: AbstractSyntaxTreeContext, pCst: TypeDeclarationCst, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): BasePgslType {
        // Create none pointer type definition.
        const lConcreteTypeDeclaration: TypeDeclarationCst = {
            type: 'TypeDeclaration',
            range: pCst.range,
            typeName: pRawName,
            template: pRawTemplate,
            isPointer: false
        };

        // Create a new type declaration without pointer.
        const lInnerTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(lConcreteTypeDeclaration).process(pContext);
        const lInnerType: BasePgslType = lInnerTypeDeclaration.data.type;

        // Only storable types can be referenced by pointers.
        if (!lInnerType.isKind(BasePgslTypeKind.Storable)) {
            pContext.pushIncident('Referenced types of pointers need to be storable', this);
        }

        // Build pointer type definition.
        return new PgslPointerType(lInnerType);
    }

    /**
     * Try to resolve raw type as sampler value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveSampler(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): BasePgslType | null {
        // Try to resolve type name.
        if (pRawName !== PgslSamplerType.typeName.sampler && pRawName !== PgslSamplerType.typeName.samplerComparison) {
            return null;
        }

        // Sampler should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Sampler type can't have template parameters.`, this);
        }

        // Build numeric definition.
        return new PgslSamplerType(pRawName === PgslSamplerType.typeName.samplerComparison);
    }

    /**
     * Try to resolve raw type as string type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveString(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): BasePgslType | null {
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

        return new PgslStringType();
    }

    /**
     * Try to resolve raw type as struct type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveStruct(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): BasePgslType | null {
        // Resolve struct
        const lStruct: StructDeclarationAst | undefined = pContext.getStruct(pRawName);
        if (!lStruct) {
            return null;
        }

        // Structs should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Structs can't have templates values.`, this);
        }

        // Create new struct type definition.
        return new PgslStructType(lStruct);
    }

    /**
     * Read a template value that should be an expression.
     * If it cant be read or converted to an expression, null is returned. 
     *
     * @param pTemplate - Template value.
     *
     * @returns the template value as expression, or null when it can only be a type.
     */
    private resolveTemplateAsExpression(pTemplate: TypeDeclarationAstTemplate | undefined): ExpressionCst | null {
        // Missing template values are no expression.
        if (!pTemplate) {
            return null;
        }

        // Expressions are used as they are.
        if (pTemplate.type !== 'TypeDeclaration') {
            return pTemplate;
        }

        // Variable name is also read like a plain type declaration, try to convert it.

        // Only a plain name can also be the name of a value.
        if (pTemplate.isPointer || pTemplate.template.length > 0) {
            return null;
        }

        const lVariableName: VariableNameExpressionCst = {
            type: 'VariableNameExpression',
            range: pTemplate.range,
            variableName: pTemplate.typeName
        };

        return lVariableName;
    }

    /**
     * Try to resolve raw type as texture value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveTexture(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): BasePgslType | null {
        // Try to resolve type name.
        if (!Object.values(PgslTextureType.typeName).includes(pRawName as any)) {
            return null;
        }

        const lTextureTypeName: PgslTextureTypeName = pRawName as PgslTextureTypeName;

        // Sampled textures are declared with the type they sample.
        if (PgslTextureType.isSampledTextureType(lTextureTypeName)) {
            // Validate texture template.
            if (pRawTemplate.length !== 1) {
                pContext.pushIncident(`Texture type "${lTextureTypeName}" needs a single template type.`, this);
            }

            // Validate template parameter. A missing template is already reported.
            const lSampledTypeDefinition: TypeDeclarationAstTemplate | undefined = pRawTemplate[0];
            if (!lSampledTypeDefinition) {
                return new PgslInvalidType();
            }
            if (lSampledTypeDefinition.type !== 'TypeDeclaration') {
                pContext.pushIncident(`Texture template parameter needs to be a type definition.`, this);
                return new PgslInvalidType();
            }

            // Build sampled type.
            const lSampledType: BasePgslType = new TypeDeclarationAst(lSampledTypeDefinition).process(pContext).data.type;

            // Only 32 bit concrete numeric scalars can be sampled.
            const lSampleable: boolean = lSampledType.isKind(BasePgslTypeKind.Numeric) && (lSampledType.isKind(BasePgslTypeKind.Float32) || lSampledType.isKind(BasePgslTypeKind.SignedInteger) || lSampledType.isKind(BasePgslTypeKind.UnsignedInteger));
            if (!lSampleable) {
                pContext.pushIncident(`Texture sampled type must be a float, int or uint type.`, this);
            }

            return new PgslTextureType(lTextureTypeName, lSampledType, null);
        }

        // Storage textures are declared with a texel format and an access mode.
        if (PgslTextureType.isStorageTextureType(lTextureTypeName)) {
            // Validate texture templates.
            if (pRawTemplate.length !== 2) {
                pContext.pushIncident(`Texture type "${lTextureTypeName}" needs a texel format and an access mode template.`, this);
            }

            // Read a template value from a constant string expression. A missing template is already reported.
            const lReadStringTemplate = (pTemplateIndex: number): string | null => {
                if (!pRawTemplate[pTemplateIndex]) {
                    return null;
                }

                const lTemplate: ExpressionCst | null = this.resolveTemplateAsExpression(pRawTemplate[pTemplateIndex]);
                if (!lTemplate) {
                    pContext.pushIncident(`Texture template parameter ${pTemplateIndex + 1} must be a string value expression.`, this);
                    return null;
                }

                const lTemplateExpression: IExpressionAst = ExpressionAstBuilder.build(lTemplate).process(pContext);
                if (!lTemplateExpression.data.resolveType.isKind(BasePgslTypeKind.String) || typeof lTemplateExpression.data.constantValue !== 'string') {
                    pContext.pushIncident(`Texture template parameter ${pTemplateIndex + 1} must be a string value expression.`, this);
                    return null;
                }

                return lTemplateExpression.data.constantValue;
            };

            // Read texel format.
            let lFormat: PgslTexelFormat = PgslTexelFormatEnum.VALUES.Bgra8unorm;
            const lFormatValue: string | null = lReadStringTemplate(0);
            if (lFormatValue !== null) {
                if (PgslTexelFormatEnum.containsValue(lFormatValue)) {
                    lFormat = lFormatValue;
                } else {
                    pContext.pushIncident(`Unknown texel format: "${lFormatValue}".`, this);
                }
            }

            // Read access mode.
            let lAccess: PgslAccessMode = PgslAccessModeEnum.VALUES.Read;
            const lAccessValue: string | null = lReadStringTemplate(1);
            if (lAccessValue !== null) {
                if (PgslAccessModeEnum.containsValue(lAccessValue)) {
                    lAccess = lAccessValue;
                } else {
                    pContext.pushIncident(`Unknown access mode: "${lAccessValue}".`, this);
                }
            }

            // Storage textures sample the channel type of their texel format.
            const lSampledType: PgslNumericType = new PgslNumericType(PgslTexelFormatEnum.texelNumericType(lFormat));

            return new PgslTextureType(lTextureTypeName, lSampledType, { format: lFormat, access: lAccess });
        }

        // Depth and external textures have no templates and always sample floats.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Texture type "${lTextureTypeName}" can't have template parameters.`, this);
        }

        return new PgslTextureType(lTextureTypeName, new PgslNumericType(PgslNumericType.typeName.float32), null);
    }

    /**
     * Resolve the type definition based on the current trace context.
     * 
     * @param pContext - Trace to use for type resolution.
     * 
     * @returns Resolved type.
     */
    private resolveType(pContext: AbstractSyntaxTreeContext, pCst: TypeDeclarationCst): BasePgslType {
        // Type to pointer.
        if (pCst.isPointer) {
            return this.resolvePointer(pContext, pCst, pCst.typeName, pCst.template);
        }

        let lType: BasePgslType | null = null;

        // Try to parse to void type.
        if ((lType = this.resolveVoid(pContext, pCst.typeName, pCst.template)) !== null) {
            return lType;
        }

        // Try to parse to struct type.
        if ((lType = this.resolveStruct(pContext, pCst.typeName, pCst.template)) !== null) {
            return lType;
        }

        // Try to parse alias type.
        if ((lType = this.resolveAlias(pContext, pCst.typeName, pCst.template)) !== null) {
            return lType;
        }

        // Try to parse enum type.
        if ((lType = this.resolveEnum(pContext, pCst.typeName, pCst.template)) !== null) {
            return lType;
        }

        // Try to parse build in type.
        if ((lType = this.resolveBuildIn(pContext, pCst.typeName, pCst.template)) !== null) {
            return lType;
        }

        // Try to parse numeric type.
        if ((lType = this.resolveNumeric(pContext, pCst.typeName, pCst.template)) !== null) {
            return lType;
        }

        // Try to parse boolean type.
        if ((lType = this.resolveBoolean(pContext, pCst.typeName, pCst.template)) !== null) {
            return lType;
        }

        // Try to parse string type.
        if ((lType = this.resolveString(pContext, pCst.typeName, pCst.template)) !== null) {
            return lType;
        }

        // Try to parse vector type.
        if ((lType = this.resolveVector(pContext, pCst.typeName, pCst.template)) !== null) {
            return lType;
        }

        // Try to parse matrix type.
        if ((lType = this.resolveMatrix(pContext, pCst.typeName, pCst.template)) !== null) {
            return lType;
        }

        // Try to parse sampler type.
        if ((lType = this.resolveSampler(pContext, pCst.typeName, pCst.template)) !== null) {
            return lType;
        }

        // Try to parse array type.
        if ((lType = this.resolveArray(pContext, pCst.typeName, pCst.template)) !== null) {
            return lType;
        }

        // Try to parse texture type.
        if ((lType = this.resolveTexture(pContext, pCst.typeName, pCst.template)) !== null) {
            return lType;
        }

        // Type not found.
        pContext.pushIncident(`Typename "${pCst.typeName}" not defined.`, this);
        return new PgslInvalidType();
    }

    /**
     * Try to resolve raw type as vector value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveVector(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): BasePgslType | null {
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
            return new PgslInvalidType();
        }

        // Build inner type.
        const lInnerTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(lInnerTypeDefinition).process(pContext);
        const lInnerType: BasePgslType = lInnerTypeDeclaration.data.type;

        // A vector can only be composed of scalar components.
        if (!lInnerType.isKind(BasePgslTypeKind.Scalar)) {
            pContext.pushIncident(`Vector component type must be a scalar type.`, this);
        }

        // Build vector definition.
        return new PgslVectorType(lVectorDimension, lInnerType);
    }

    /**
     * Try to resolve raw type as void type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     * @param pMeta - Type definition meta data.
     */
    private resolveVoid(pContext: AbstractSyntaxTreeContext, pRawName: string, pRawTemplate: TypeDeclarationAstTemplateList): BasePgslType | null {
        // Resolve void type.
        if (pRawName !== PgslVoidType.typeName.void) {
            return null;
        }

        // Void should not have any templates.
        if (pRawTemplate.length > 0) {
            pContext.pushIncident(`Void type can't have template parameters.`, this);
        }

        return new PgslVoidType();
    }
}

type TypeDeclarationAstTemplate = ExpressionCst | TypeDeclarationCst;
type TypeDeclarationAstTemplateList = Array<TypeDeclarationAstTemplate>;

export type TypeDeclarationAstData = {
    type: BasePgslType;
    buildIn?: PgslBuildInTypeName;
};