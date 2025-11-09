import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum.ts';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../enum/pgsl-value-fixed-state.ts';
import type { PgslExpressionTrace } from '../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../trace/pgsl-trace.ts';
import { PgslValueTrace } from '../../trace/pgsl-value-trace.ts';
import { PgslSamplerType } from '../../type/pgsl-sampler-type.ts';
import { PgslTextureType } from '../../type/pgsl-texture-type.ts';
import type { PgslType } from '../../type/pgsl-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { PgslAccessMode } from '../buildin/pgsl-access-mode.enum.ts';
import type { PgslExpression } from '../expression/pgsl-expression.ts';
import { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import type { PgslTypeDeclaration } from '../general/pgsl-type-declaration.ts';
import { PgslDeclaration } from './pgsl-declaration.ts';


/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslVariableDeclaration extends PgslDeclaration {
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

    private readonly mDeclarationTypeName: string;
    private readonly mExpression: PgslExpression | null;
    private readonly mName: string;
    private readonly mTypeDeclaration: PgslTypeDeclaration;

    /**
     * Declaration type.
     */
    public get declarationType(): PgslVariableDeclarationType {
        return EnumUtil.cast(PgslDeclarationType, this.mDeclarationTypeName) ?? PgslDeclarationType.Private;
    }

    /**
     * Value initialization expression.
     */
    public get expression(): PgslExpression | null {
        return this.mExpression;
    }

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Type declaration.
     */
    public get typeDeclaration(): PgslTypeDeclaration {
        return this.mTypeDeclaration;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslVariableDeclarationConstructorParameter, pAttributes: PgslAttributeList, pMeta: BasePgslSyntaxTreeMeta) {
        super(pAttributes, pMeta);

        // Set data.
        this.mTypeDeclaration = pData.type;
        this.mName = pData.name;
        this.mDeclarationTypeName = pData.declarationType;
        this.mExpression = pData.expression ?? null;

        // Append child trees.
        this.appendChild(this.mTypeDeclaration);
        if (this.mExpression) {
            this.appendChild(this.mExpression);
        }
    }

    /**
     * Validate data of current structure.
     * https://www.w3.org/TR/WGSL/#var-and-value
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Trace attributes, type declaration and optional expression.
        this.attributes.trace(pTrace);
        this.mTypeDeclaration.trace(pTrace);
        if (this.mExpression) {
            this.mExpression.trace(pTrace);
        }

        // Check if variable with same name already exists in scope.
        if (pTrace.getModuleValue(this.mName)) {
            pTrace.pushIncident(`Variable with name "${this.mName}" already defined.`, this);
            return;
        }

        // Try to parse declaration type.
        let lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, this.mDeclarationTypeName);
        if (!lDeclarationType) {
            pTrace.pushIncident(`Declaration type "${this.mDeclarationTypeName}" can not be used for module scope variable declarations.`, this);

            // Set default declaration type to avoid further errors.
            // Private is a good default as it has the least restrictions.
            lDeclarationType = PgslDeclarationType.Private;
        }

        // Read type of type declaration.
        const lType: PgslType = this.mTypeDeclaration.type;

        // Read optional expression attachment.
        let lExpressionTrace: PgslExpressionTrace | null = null;
        if (this.mExpression) {
            lExpressionTrace = pTrace.getExpression(this.mExpression);
        }

        // A bunch of specific validation function to easy build a validation for each declaration type.
        const lMustBeConstructible = () => {
            if (!lType.constructible) {
                pTrace.pushIncident(`The type of declaration type "${this.mDeclarationTypeName}" must be constructible.`, this);
            }
        };
        const lMustBeScalar = () => {
            if (!lType.scalar) {
                pTrace.pushIncident(`The type of declaration type "${this.mDeclarationTypeName}" must be a scalar type.`, this);
            }
        };
        const lMustHaveAnInitializer = () => {
            if (!this.mExpression) {
                pTrace.pushIncident(`Declaration type "${this.mDeclarationTypeName}" must have an initializer.`, this);
            }
        };
        const lMustNotHaveAnInitializer = () => {
            if (this.mExpression) {
                pTrace.pushIncident(`Declaration type "${this.mDeclarationTypeName}" must not have an initializer.`, this);
            }
        };
        const lMustBeHostShareable = () => {
            if (!lType.hostShareable) {
                pTrace.pushIncident(`The type of declaration type "${this.mDeclarationTypeName}" must be host shareable.`, this);
            }
        };
        const lMustHaveFixedFootprint = () => {
            if (!lType.fixedFootprint) {
                pTrace.pushIncident(`The type of declaration type "${this.mDeclarationTypeName}" must have a fixed footprint.`, this);
            }
        };
        const lExpressionMustBeConst = () => {
            if (lExpressionTrace && lExpressionTrace.fixedState !== PgslValueFixedState.Constant) {
                pTrace.pushIncident(`The expression of declaration type "${this.mDeclarationTypeName}" must be a constant expression.`, this);
            }
        };
        const lMustBePlain = () => {
            if (!lType.plain) {
                pTrace.pushIncident(`The type of declaration type "${this.mDeclarationTypeName}" must be a plain type.`, this);
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
                    pTrace.pushIncident(`Declaration type "${this.mDeclarationTypeName}" does not allow attribute "${lAttributeName}".`, this);
                }
            }

            // Check if all required attributes are present.
            for (const lRequiredAttributeName of lRequiredAttributes) {
                pTrace.pushIncident(`Declaration type "${this.mDeclarationTypeName}" requires attribute "${lRequiredAttributeName}".`, this);
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
                lMustBeHostShareable();

                // Uniform require a [GroupBinding] attribute.
                lAllowedAttributes([
                    { name: 'GroupBinding', required: true },
                    { name: 'AccessMode', required: false },
                ]);
                break;
            }
            case PgslDeclarationType.Uniform: {
                // When its a texture or sampler, no other type restrictions apply.
                if (!(lType instanceof PgslSamplerType) && !(lType instanceof PgslTextureType)) {
                    lMustNotHaveAnInitializer();
                    lMustBeConstructible();
                    lMustBeHostShareable();
                }

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
                pTrace.pushIncident(`Declaration type "${this.mDeclarationTypeName}" can not be used for module scope variable declarations.`, this);
            }
        }

        // Validate if expression fits declaration type.
        if (lExpressionTrace && !lExpressionTrace.resolveType.isImplicitCastableInto(this.mTypeDeclaration.type)) {
            // Expression type is not castable into declaration type.
            pTrace.pushIncident(`Initializing value has incompatible type.`, this);
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
                return PgslAccessMode.Read;
            }

            // Read attribute parameters access mode attribute must have one parameter.
            const lAttributeParameter: Array<PgslExpression> = this.attributes.getAttributeParameter(PgslAttributeList.attributeNames.accessMode)!;
            if (lAttributeParameter.length !== 1) {
                return PgslAccessMode.Read;
            }

            // Read expression trace.
            const lExpressionTrace: PgslExpressionTrace = pTrace.getExpression(lAttributeParameter[0]);

            // Expression must have a constant value.
            if (typeof lExpressionTrace.constantValue !== 'string') {
                return PgslAccessMode.Read;
            }

            // If value is not part of enum, return default.
            if (!Object.values(PgslAccessMode).includes(lExpressionTrace.constantValue as PgslAccessMode)) {
                return PgslAccessMode.Read;
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

            pTrace.pushIncident(`Unable to determine address space for declaration type "${this.mDeclarationTypeName}".`, this);

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
            const lAttributeParameter: Array<PgslExpression> = this.attributes.getAttributeParameter(PgslAttributeList.attributeNames.groupBinding)!;
            if (lAttributeParameter.length !== 2) {
                return null;
            }

            // Read trace of group name parameter.
            const lGroupNameExpression: PgslExpression = lAttributeParameter[0];
            const lGroupNameExpressionTrace: PgslExpressionTrace | null = pTrace.getExpression(lGroupNameExpression);
            if (!lGroupNameExpressionTrace) {
                throw new Exception('Expression trace for group name is missing. This should never happen.', this);
            }

            // Read trace of location name parameter.
            const lLocationNameExpression: PgslExpression = lAttributeParameter[1];
            const lLocationNameExpressionTrace: PgslExpressionTrace | null = pTrace.getExpression(lLocationNameExpression);
            if (!lLocationNameExpressionTrace) {
                throw new Exception('Expression trace for location name is missing. This should never happen.', this);
            }

            // Both parameters must be a constant string.
            if (typeof lGroupNameExpressionTrace.constantValue !== 'string' || typeof lLocationNameExpressionTrace.constantValue !== 'string') {
                pTrace.pushIncident(`Attribute "GroupBinding" must have two constant string parameters.`, this);
                return null;
            }

            return {
                bindGroupName: lGroupNameExpressionTrace.constantValue,
                bindLocationName: lLocationNameExpressionTrace.constantValue
            };
        })();

        // Register value trace.
        pTrace.registerModuleValue(new PgslValueTrace({
            fixedState: lFixedState,
            declarationType: lDeclarationType,
            addressSpace: lAddressSpace,
            type: lType,
            name: this.mName,
            constantValue: lConstantValue,
            accessMode: lAccessMode,
            bindingInformation: lBindingInformation
        }));
    }
}

export type PgslVariableDeclarationType = (typeof PgslVariableDeclaration.declarationType)[keyof typeof PgslVariableDeclaration.declarationType];

export type PgslVariableDeclarationConstructorParameter = {
    declarationType: string;
    name: string;
    type: PgslTypeDeclaration;
    expression?: PgslExpression;
};