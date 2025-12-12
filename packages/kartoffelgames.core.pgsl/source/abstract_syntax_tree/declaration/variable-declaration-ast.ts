import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslAccessMode, PgslAccessModeEnum } from "../../buildin/pgsl-access-mode-enum.ts";
import { VariableDeclarationCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum.ts';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../enum/pgsl-value-fixed-state.ts';
import type { PgslExpressionTrace } from '../../trace/pgsl-expression-trace.ts';
import { PgslValueTrace } from '../../trace/pgsl-value-trace.ts';
import { PgslSamplerType } from '../../type/pgsl-sampler-type.ts';
import { PgslTextureType } from '../../type/pgsl-texture-type.ts';
import type { PgslType } from '../../type/pgsl-type.ts';
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import type { ExpressionAst } from '../expression/pgsl-expression.ts';
import { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import type { PgslTypeDeclaration } from '../general/pgsl-type-declaration.ts';
import { AbstractSyntaxTreeValueData, IAbstractSyntaxTreeValue } from "../i-abstract-syntax-tree-value.interface.ts";
import { DeclarationAst, DeclarationAstData } from './declaration-ast.ts';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class VariableDeclarationAst extends DeclarationAst<VariableDeclarationCst, VariableDeclarationAstData> implements IAbstractSyntaxTreeValue {
    /**
     * All possible declaration types.
     */
    public static get declarationType() {
        return {
            const: PgslDeclarationType.Const,
            storage: PgslDeclarationType.Storage,
            uniform: PgslDeclarationType.Uniform,
            workgroup: PgslDeclarationType.Workgroup,
            private: PgslDeclarationType.Private,
            param: PgslDeclarationType.Param
        } as const;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pCst: VariableDeclarationCst, pContext: AbstractSyntaxTreeContext) {
        super(pCst, pContext);
    }

    /**
     * Validate data of current structure.
     * https://www.w3.org/TR/WGSL/#var-and-value
     */
    protected override process(pContext: AbstractSyntaxTreeContext): VariableDeclarationAstData {
        // Create attribute list.
        const lAttributes: PgslAttributeList = new PgslAttributeList(this.cst.attributeList, this, pContext);

        // Try to parse declaration type.
        let lDeclarationType: VariableDeclarationAstType | undefined = EnumUtil.cast(PgslDeclarationType, this.cst.declarationType);
        if (!lDeclarationType) {
            pContext.pushIncident(`Declaration type "${this.cst.declarationType}" can not be used for module scope variable declarations.`, this);

            // Set default declaration type to avoid further errors.
            // Private is a good default as it has the least restrictions.
            lDeclarationType = PgslDeclarationType.Private;
        }

        // Read type of type declaration.
        const lType: PgslType = this.mTypeDeclaration.type;

        // Read optional expression attachment.
        let lExpressionTrace: PgslExpressionTrace | null = null;
        if (this.cst.expression) {
            lExpressionTrace = pContext.getExpression(this.mExpression);
        }

        // A bunch of specific validation function to easy build a validation for each declaration type.
        const lMustBeConstructible = () => {
            if (!lType.constructible) {
                pContext.pushIncident(`The type of declaration type "${this.cst.declarationType}" must be constructible.`, this);
            }
        };
        const lMustBeScalar = () => {
            if (!lType.scalar) {
                pContext.pushIncident(`The type of declaration type "${this.cst.declarationType}" must be a scalar type.`, this);
            }
        };
        const lMustHaveAnInitializer = () => {
            if (!this.cst.expression) {
                pContext.pushIncident(`Declaration type "${this.cst.declarationType}" must have an initializer.`, this);
            }
        };
        const lMustNotHaveAnInitializer = () => {
            if (this.cst.expression) {
                pContext.pushIncident(`Declaration type "${this.cst.declarationType}" must not have an initializer.`, this);
            }
        };
        const lMustBeHostShareable = () => {
            if (!lType.hostShareable) {
                pContext.pushIncident(`The type of declaration type "${this.cst.declarationType}" must be host shareable.`, this);
            }
        };
        const lMustHaveFixedFootprint = () => {
            if (!lType.fixedFootprint) {
                pContext.pushIncident(`The type of declaration type "${this.cst.declarationType}" must have a fixed footprint.`, this);
            }
        };
        const lExpressionMustBeConst = () => {
            if (lExpressionTrace && lExpressionTrace.fixedState !== PgslValueFixedState.Constant) {
                pContext.pushIncident(`The expression of declaration type "${this.cst.declarationType}" must be a constant expression.`, this);
            }
        };
        const lMustBePlain = () => {
            if (!lType.plain) {
                pContext.pushIncident(`The type of declaration type "${this.cst.declarationType}" must be a plain type.`, this);
                return;
            }
        };
        const lAllowedAttributes = (pAttributes: Array<{ name: string, required: boolean; }>) => {
            // Sort into required and optional attributes.
            const lRequiredAttributes: Set<string> = new Set<string>();
            const lOptionalAttributes: Set<string> = new Set<string>();
            for (const lAttribute of pAttributes) {
                if (lAttribute.required) {
                    lRequiredAttributes.add(lAttribute.name);
                } else {
                    lOptionalAttributes.add(lAttribute.name);
                }
            }

            // Iterate over all attributes defined and check if they are allowed.
            for (const lAttributeName of this.attributes.attributeNames) {
                if (lRequiredAttributes.has(lAttributeName)) {
                    // Required attribute is present.
                    lRequiredAttributes.delete(lAttributeName);
                } else if (lOptionalAttributes.has(lAttributeName)) {
                    continue;
                } else {
                    // Unknown attribute is present.
                    pContext.pushIncident(`Declaration type "${this.cst.declarationType}" does not allow attribute "${lAttributeName}".`, this);
                }
            }

            // Check if all required attributes are present.
            for (const lRequiredAttributeName of lRequiredAttributes) {
                pContext.pushIncident(`Declaration type "${this.cst.declarationType}" requires attribute "${lRequiredAttributeName}".`, this);
            }
        };

        switch (lDeclarationType) {
            case PgslDeclarationType.Const: {
                lMustBeConstructible();
                lMustHaveAnInitializer();
                lExpressionMustBeConst();
                lAllowedAttributes([]);
                break;
            }
            case PgslDeclarationType.Storage: {
                lMustNotHaveAnInitializer();

                // When storage is a texture no host shareable restrictions apply.
                switch (true) {
                    case lType instanceof PgslTextureType: {
                        // Must be a storage texture.
                        if (!PgslTextureType.isStorageTextureType(lType.textureType)) {
                            pContext.pushIncident(`The type of declaration type "${this.cst.declarationType}" must be a storage texture type.`, this);
                        }
                        break;
                    }
                    default: {
                        // Only apply to plain types.
                        lMustBeHostShareable();
                    }
                }

                // Uniform require a [GroupBinding] attribute.
                lAllowedAttributes([
                    { name: 'GroupBinding', required: true },
                    { name: 'AccessMode', required: false },
                ]);
                break;
            }
            case PgslDeclarationType.Uniform: {
                // When its a texture or sampler, no other type restrictions apply.
                switch (true) {
                    case lType instanceof PgslSamplerType: {
                        break;
                    }
                    case lType instanceof PgslTextureType: {
                        if (PgslTextureType.isStorageTextureType(lType.textureType)) {
                            pContext.pushIncident(`Storage textures are not allowed in uniform declarations.`, this);
                        }
                        break;
                    }
                    default: {
                        // Only apply to plain types.
                        lMustBeConstructible();
                        lMustBeHostShareable();
                    }
                }

                lMustNotHaveAnInitializer();

                // Uniform require a [GroupBinding] attribute.
                lAllowedAttributes([
                    { name: 'GroupBinding', required: true },
                    { name: 'AccessMode', required: false },
                ]);
                break;
            }
            case PgslDeclarationType.Workgroup: {
                lMustHaveFixedFootprint();
                lMustBePlain();
                lAllowedAttributes([]);
                break;
            }
            case PgslDeclarationType.Private: {
                lMustBeConstructible();
                lAllowedAttributes([]);
                break;
            }
            case PgslDeclarationType.Param: {
                lMustBeConstructible();
                lMustBeScalar();
                lMustHaveAnInitializer();
                lAllowedAttributes([]);
                break;
            }
            default: {
                // Unknown declaration type.
                pContext.pushIncident(`Declaration type "${this.cst.declarationType}" can not be used for module scope variable declarations.`, this);
            }
        }

        // Validate if expression fits declaration type.
        if (lExpressionTrace && !lExpressionTrace.resolveType.isImplicitCastableInto(this.mTypeDeclaration.type)) {
            // Expression type is not castable into declaration type.
            pContext.pushIncident(`Initializing value has incompatible type.`, this);
        }

        // Determine fixed state based on declaration type.
        const lFixedState: PgslValueFixedState = (() => {
            switch (lDeclarationType) {
                case PgslDeclarationType.Const:
                    return PgslValueFixedState.Constant;
                case PgslDeclarationType.Param:
                    return PgslValueFixedState.PipelineCreationFixed;
            }

            return PgslValueFixedState.Variable;
        })();

        // Access mode attribute is optional and only used for meta.
        const lAccessMode: PgslAccessMode = ((): PgslAccessMode => {
            // Default access mode is read.
            if (!this.attributes.hasAttribute(PgslAttributeList.attributeNames.accessMode)) {
                return PgslAccessModeEnum.values.Read;
            }

            // Read attribute parameters access mode attribute must have one parameter.
            const lAttributeParameter: Array<ExpressionAst> = this.attributes.getAttributeParameter(PgslAttributeList.attributeNames.accessMode)!;
            if (lAttributeParameter.length !== 1) {
                return PgslAccessModeEnum.values.Read;
            }

            // Read expression trace.
            const lExpressionTrace: PgslExpressionTrace = pContext.getExpression(lAttributeParameter[0]);

            // Expression must have a constant value.
            if (typeof lExpressionTrace.constantValue !== 'string') {
                return PgslAccessModeEnum.values.Read;
            }

            // If value is not part of enum, return default.
            if (!PgslAccessModeEnum.containsValue(lExpressionTrace.constantValue)) {
                return PgslAccessModeEnum.values.Read;
            }

            // Transpile attribute parameters. We assume the transpiled value is valid here as it was validated before.
            return lExpressionTrace.constantValue as PgslAccessMode;
        })();

        const lAddressSpace: PgslValueAddressSpace = (() => {
            // For texture and sampler types, we always use texture address space.
            if (lType instanceof PgslSamplerType || lType instanceof PgslTextureType) {
                return PgslValueAddressSpace.Texture;
            }

            switch (lDeclarationType) {
                case PgslDeclarationType.Storage:
                    return PgslValueAddressSpace.Storage;
                case PgslDeclarationType.Uniform:
                    return PgslValueAddressSpace.Uniform;
                case PgslDeclarationType.Workgroup:
                    return PgslValueAddressSpace.Workgroup;
                case PgslDeclarationType.Const:
                case PgslDeclarationType.Private:
                case PgslDeclarationType.Param:
                    return PgslValueAddressSpace.Module;
            }

            pContext.pushIncident(`Unable to determine address space for declaration type "${this.cst.declarationType}".`, this);

            return PgslValueAddressSpace.Module;
        })();

        const lConstantValue: number | null = (() => {
            // Constant value must be a number.
            if (!lExpressionTrace || typeof lExpressionTrace.constantValue !== 'number') {
                return null;
            }

            return lExpressionTrace.constantValue;
        })();

        const lBindingInformation: { bindGroupName: string; bindLocationName: string; } | null = (() => {
            // Default binding information is null.
            if (!this.attributes.hasAttribute(PgslAttributeList.attributeNames.groupBinding)) {
                return null;
            }

            // Read attribute parameters group binding attribute must have one parameter.
            const lAttributeParameter: Array<ExpressionAst> = this.attributes.getAttributeParameter(PgslAttributeList.attributeNames.groupBinding)!;
            if (lAttributeParameter.length !== 2) {
                return null;
            }

            // Read trace of group name parameter.
            const lGroupNameExpression: ExpressionAst = lAttributeParameter[0];
            const lGroupNameExpressionTrace: PgslExpressionTrace | null = pContext.getExpression(lGroupNameExpression);
            if (!lGroupNameExpressionTrace) {
                throw new Exception('Expression trace for group name is missing. This should never happen.', this);
            }

            // Read trace of location name parameter.
            const lLocationNameExpression: ExpressionAst = lAttributeParameter[1];
            const lLocationNameExpressionTrace: PgslExpressionTrace | null = pContext.getExpression(lLocationNameExpression);
            if (!lLocationNameExpressionTrace) {
                throw new Exception('Expression trace for location name is missing. This should never happen.', this);
            }

            // Both parameters must be a constant string.
            if (typeof lGroupNameExpressionTrace.constantValue !== 'string' || typeof lLocationNameExpressionTrace.constantValue !== 'string') {
                pContext.pushIncident(`Attribute "GroupBinding" must have two constant string parameters.`, this);
                return null;
            }

            return {
                bindGroupName: lGroupNameExpressionTrace.constantValue,
                bindLocationName: lLocationNameExpressionTrace.constantValue
            };
        })();

        // Check if variable with same name already exists in scope.
        if (pContext.getValue(this.cst.name)) {
            pContext.pushIncident(`Variable with name "${this.cst.name}" already defined.`, this);
        }

        // Return built data.
        return {
            fixedState: lFixedState,
            declarationType: lDeclarationType,
            addressSpace: lAddressSpace,
            type: lType,
            name: this.cst.name,
            constantValue: lConstantValue,
            accessMode: lAccessMode,
            bindingInformation: lBindingInformation
        };
    }
}

export type VariableDeclarationAstType = (typeof VariableDeclarationAst.declarationType)[keyof typeof VariableDeclarationAst.declarationType];

export type VariableDeclarationAstData = {
    /**
     * Value initialization expression.
     */
    expression: ExpressionAst | null;

    /**
     * Type declaration.
     */
    typeDeclaration: PgslTypeDeclaration;

    /**
     * Binding information.
     */
    bindingInformation: { bindGroupName: string; bindLocationName: string; } | null;
} & DeclarationAstData & AbstractSyntaxTreeValueData;