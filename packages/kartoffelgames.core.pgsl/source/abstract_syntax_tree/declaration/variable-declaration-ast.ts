import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslAccessMode, PgslAccessModeEnum } from "../../buildin/pgsl-access-mode-enum.ts";
import { VariableDeclarationCst } from "../../concrete_syntax_tree/declaration.type.ts";
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum.ts';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../enum/pgsl-value-fixed-state.ts';
import { PgslSamplerType } from '../../type/pgsl-sampler-type.ts';
import { PgslTextureType } from '../../type/pgsl-texture-type.ts';
import type { PgslType } from '../../type/pgsl-type.ts';
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import { AbstractSyntaxTree } from "../abstract-syntax-tree.ts";
import { AttributeListAst } from '../general/attribute-list-ast.ts';
import { TypeDeclarationAst } from '../general/type-declaration-ast.ts';
import { ValueStoreAstData, IValueStoreAst } from "../i-value-store-ast.interface.ts";
import { DeclarationAstData, IDeclarationAst } from './i-declaration-ast.interface.ts';
import { ExpressionAstBuilder } from "../expression/expression-ast-builder.ts";
import { IExpressionAst } from "../expression/i-expression-ast.interface.ts";
import { PgslPointerType } from "../../type/pgsl-pointer-type.ts";

/**
 * PGSL syntax tree for a alias declaration.
 */
export class VariableDeclarationAst extends AbstractSyntaxTree<VariableDeclarationCst, VariableDeclarationAstData> implements IValueStoreAst, IDeclarationAst {
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
     * Validate data of current structure.
     * https://www.w3.org/TR/WGSL/#var-and-value
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): VariableDeclarationAstData {
        // Create attribute list.
        const lAttributes: AttributeListAst = new AttributeListAst(this.cst.attributeList, this).process(pContext);

        // Read type of type declaration.
        const lTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(this.cst.typeDeclaration).process(pContext);
        const lType: PgslType = lTypeDeclaration.data.type;

        // Read optional expression attachment.
        let lExpression: IExpressionAst | null = null;
        if (this.cst.expression) {
            lExpression = ExpressionAstBuilder.build(this.cst.expression, pContext);
        }

        // Try to parse declaration type.
        let lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, this.cst.declarationType);
        if (!lDeclarationType) {
            pContext.pushIncident(`Declaration type "${this.cst.declarationType}" can not be used for module scope variable declarations.`, this);

            // Set default declaration type to avoid further errors.
            // Private is a good default as it has the least restrictions.
            lDeclarationType = PgslDeclarationType.Private;
        }

        // Validate attributes.
        this.validateDeclaration(pContext, lAttributes, lDeclarationType, lType, lExpression);

        // Validate if expression fits declaration type.
        if (lExpression && !lExpression.data.resolveType.isImplicitCastableInto(lType)) {
            // Expression type is not castable into declaration type.
            pContext.pushIncident(`Initializing value has incompatible type.`, this);
        }

        // For pointer types, assign address space from expression.
        if(lExpression && lType instanceof PgslPointerType) {
            lType.assignAddressSpace(lExpression.data.storageAddressSpace, pContext);
        }

        // Read meta data.
        const lFixedState: PgslValueFixedState = this.getValueFixedState(lDeclarationType);
        const lAccessMode: PgslAccessMode = this.getAccessMode(lAttributes);
        const lAddressSpace: PgslValueAddressSpace = this.getAddressSpace(pContext, lDeclarationType, lType);
        const lConstantValue: number | null = this.getConstantValue(lExpression);
        const lBindingInformation: { bindGroupName: string; bindLocationName: string; } | null = this.getBindingInformation(pContext, lAttributes);

        // Check if variable with same name already exists in scope.
        if (pContext.getValue(this.cst.name)) {
            pContext.pushIncident(`Variable with name "${this.cst.name}" already defined.`, this);
        }

        // Register variable in current scope.
        if(!pContext.addValue(this.cst.name, this)) {
            pContext.pushIncident(`Variable with name "${this.cst.name}" already defined.`, this);
        }

        // Return built data.
        return {
            accessMode: lAccessMode,
            addressSpace: lAddressSpace,
            attributes: lAttributes,
            bindingInformation: lBindingInformation,
            constantValue: lConstantValue,
            declarationType: lDeclarationType,
            expression: lExpression,
            fixedState: lFixedState,
            name: this.cst.name,
            type: lType,
            typeDeclaration: lTypeDeclaration
        };
    }

    /**
     * Gets the access mode from attributes.
     *
     * @param pAttributes - Attribute list.
     *
     * @returns The access mode.
     */
    private getAccessMode(pAttributes: AttributeListAst): PgslAccessMode {
        // Default access mode is read.
        if (!pAttributes.hasAttribute(AttributeListAst.attributeNames.accessMode)) {
            return PgslAccessModeEnum.values.Read;
        }

        // Read attribute parameters access mode attribute must have one parameter.
        const lAttributeParameter: Array<IExpressionAst> = pAttributes.getAttributeParameter(AttributeListAst.attributeNames.accessMode)!;
        if (lAttributeParameter.length !== 1) {
            return PgslAccessModeEnum.values.Read;
        }

        // Read first expression.
        const lAccessModeExpression: IExpressionAst = lAttributeParameter[0];

        // Expression must have a constant value.
        if (typeof lAccessModeExpression.data.constantValue !== 'string') {
            return PgslAccessModeEnum.values.Read;
        }

        // If value is not part of enum, return default.
        if (!PgslAccessModeEnum.containsValue(lAccessModeExpression.data.constantValue)) {
            return PgslAccessModeEnum.values.Read;
        }

        // Transpile attribute parameters. We assume the transpiled value is valid here as it was validated before.
        return lAccessModeExpression.data.constantValue as PgslAccessMode;
    }

    /**
     * Gets the address space based on declaration type and value type.
     *
     * @param pContext - Abstract syntax tree context.
     * @param pDeclarationType - Declaration type.
     * @param pType - Value type.
     *
     * @returns The address space.
     */
    private getAddressSpace(pContext: AbstractSyntaxTreeContext, pDeclarationType: PgslDeclarationType, pType: PgslType): PgslValueAddressSpace {
        // For texture and sampler types, we always use texture address space.
        if (pType instanceof PgslSamplerType || pType instanceof PgslTextureType) {
            return PgslValueAddressSpace.Texture;
        }

        switch (pDeclarationType) {
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
    }

    /**
     * Gets the binding information from attributes.
     *
     * @param pContext - Abstract syntax tree context.
     * @param pAttributes - Attribute list.
     *
     * @returns The binding information or null if not present.
     */
    private getBindingInformation(pContext: AbstractSyntaxTreeContext, pAttributes: AttributeListAst): { bindGroupName: string; bindLocationName: string; } | null {
        // Default binding information is null.
        if (!pAttributes.hasAttribute(AttributeListAst.attributeNames.groupBinding)) {
            return null;
        }

        // Read attribute parameters group binding attribute must have one parameter.
        const lAttributeParameter: Array<IExpressionAst> = pAttributes.getAttributeParameter(AttributeListAst.attributeNames.groupBinding)!;
        if (lAttributeParameter.length !== 2) {
            return null;
        }

        // Read trace of group name parameter.
        const lGroupNameExpression: IExpressionAst = lAttributeParameter[0];
        if (!lGroupNameExpression) {
            throw new Exception('Expression trace for group name is missing. This should never happen.', this);
        }

        // Read trace of location name parameter.
        const lLocationNameExpression: IExpressionAst = lAttributeParameter[1];
        if (!lLocationNameExpression) {
            throw new Exception('Expression trace for location name is missing. This should never happen.', this);
        }

        // Both parameters must be a constant string.
        if (typeof lGroupNameExpression.data.constantValue !== 'string' || typeof lLocationNameExpression.data.constantValue !== 'string') {
            pContext.pushIncident(`Attribute "GroupBinding" must have two constant string parameters.`, this);
            return null;
        }

        // Check for already used bindings.
        if (!pContext.registerBindingName(lGroupNameExpression.data.constantValue, lLocationNameExpression.data.constantValue)) {
            pContext.pushIncident(`Binding name "${lLocationNameExpression.data.constantValue}" in group "${lGroupNameExpression.data.constantValue}" is already used.`, this);
        }

        return {
            bindGroupName: lGroupNameExpression.data.constantValue,
            bindLocationName: lLocationNameExpression.data.constantValue
        };
    }

    /**
     * Gets the constant value from an expression.
     *
     * @param pExpression - Expression to extract constant value from.
     *
     * @returns The constant value or null if not available.
     */
    private getConstantValue(pExpression: IExpressionAst | null): number | null {
        // Constant value must be a number.
        if (!pExpression || typeof pExpression.data.constantValue !== 'number') {
            return null;
        }

        return pExpression.data.constantValue;
    }

    /**
     * Gets the fixed state based on declaration type.
     *
     * @param pDeclarationType - Declaration type.
     *
     * @returns The fixed state.
     */
    private getValueFixedState(pDeclarationType: PgslDeclarationType): PgslValueFixedState {
        switch (pDeclarationType) {
            case PgslDeclarationType.Const:
                return PgslValueFixedState.Constant;
            case PgslDeclarationType.Param:
                return PgslValueFixedState.PipelineCreationFixed;
        }

        return PgslValueFixedState.Variable;
    }

    /**
     * Validate declaration based on its components.
     * 
     * @param pContext - Abstract syntax tree context.
     * @param pAttributes - Attribute list.
     * @param pDeclarationType - Declaration type.
     * @param pType - Declaration type.
     * @param pExpression - Initialization expression.
     */
    private validateDeclaration(pContext: AbstractSyntaxTreeContext, pAttributes: AttributeListAst, pDeclarationType: PgslDeclarationType, pType: PgslType, pExpression: IExpressionAst | null): void {
        // A bunch of specific validation function to easy build a validation for each declaration type.
        const lMustBeConstructible = () => {
            if (!pType.data.constructible) {
                pContext.pushIncident(`The type of declaration type "${this.cst.declarationType}" must be constructible.`, this);
            }
        };
        const lMustBeScalar = () => {
            if (!pType.data.scalar) {
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
            if (!pType.data.hostShareable) {
                pContext.pushIncident(`The type of declaration type "${this.cst.declarationType}" must be host shareable.`, this);
            }
        };
        const lMustHaveFixedFootprint = () => {
            if (!pType.data.fixedFootprint) {
                pContext.pushIncident(`The type of declaration type "${this.cst.declarationType}" must have a fixed footprint.`, this);
            }
        };
        const lExpressionMustBeConst = () => {
            if (pExpression && pExpression.data.fixedState !== PgslValueFixedState.Constant) {
                pContext.pushIncident(`The expression of declaration type "${this.cst.declarationType}" must be a constant expression.`, this);
            }
        };
        const lMustBePlain = () => {
            if (!pType.data.plain) {
                pContext.pushIncident(`The type of declaration type "${this.cst.declarationType}" must be a plain type.`, this);
                return;
            }
        };
        const lAllowedAttributes = (pAllowedAttributeList: Array<{ name: string, required: boolean; }>) => {
            // Sort into required and optional attributes.
            const lRequiredAttributes: Set<string> = new Set<string>();
            const lOptionalAttributes: Set<string> = new Set<string>();
            for (const lAttribute of pAllowedAttributeList) {
                if (lAttribute.required) {
                    lRequiredAttributes.add(lAttribute.name);
                } else {
                    lOptionalAttributes.add(lAttribute.name);
                }
            }

            // Iterate over all attributes defined and check if they are allowed.
            for (const lAttributeName of pAttributes.data.attributes.keys()) {
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

        switch (pDeclarationType) {
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
                    case pType instanceof PgslTextureType: {
                        // Must be a storage texture.
                        if (!PgslTextureType.isStorageTextureType(pType.textureType)) {
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
                    case pType instanceof PgslSamplerType: {
                        break;
                    }
                    case pType instanceof PgslTextureType: {
                        if (PgslTextureType.isStorageTextureType(pType.textureType)) {
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
    }
}

export type VariableDeclarationAstType = (typeof VariableDeclarationAst.declarationType)[keyof typeof VariableDeclarationAst.declarationType];

export type VariableDeclarationAstData = {
    /**
     * Value initialization expression.
     */
    expression: IExpressionAst | null;

    /**
     * Type declaration.
     */
    typeDeclaration: TypeDeclarationAst;

    /**
     * Binding information.
     */
    bindingInformation: { bindGroupName: string; bindLocationName: string; } | null;
} & DeclarationAstData & ValueStoreAstData;