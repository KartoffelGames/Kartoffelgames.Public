import { Dictionary, EnumUtil } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum.ts';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../expression/base-pgsl-expression.ts';
import type { PgslAttributeList } from '../general/pgsl-attribute-list.ts';
import { PgslFileMetaInformation, PgslFileMetaInformationBindingType } from "../pgsl-build-result.ts";
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from '../type/base-pgsl-type-definition.ts';
import { BasePgslDeclaration } from './base-pgsl-declaration.ts';
import { PgslAccessMode } from "../../buildin/pgsl-access-mode.enum.ts";

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslVariableDeclaration extends BasePgslDeclaration<PgslVariableDeclarationSyntaxTreeValidationAttachment> {
    /**
     * Mapping of declaration type to address space.
     */
    private static readonly mDeclarationAddressSpaceMapping: Dictionary<PgslDeclarationType, PgslValueAddressSpace> = (() => {
        const lAddressSpaceMapping: Dictionary<PgslDeclarationType, PgslValueAddressSpace> = new Dictionary<PgslDeclarationType, PgslValueAddressSpace>();
        lAddressSpaceMapping.set(PgslDeclarationType.Storage, PgslValueAddressSpace.Storage);
        lAddressSpaceMapping.set(PgslDeclarationType.Uniform, PgslValueAddressSpace.Uniform);
        lAddressSpaceMapping.set(PgslDeclarationType.Workgroup, PgslValueAddressSpace.Workgroup);
        lAddressSpaceMapping.set(PgslDeclarationType.Private, PgslValueAddressSpace.Private);
        lAddressSpaceMapping.set(PgslDeclarationType.Const, PgslValueAddressSpace.Private);
        lAddressSpaceMapping.set(PgslDeclarationType.Param, PgslValueAddressSpace.Private);

        return lAddressSpaceMapping;
    })();

    private readonly mDeclarationTypeName: string;
    private readonly mExpression: BasePgslExpression | null;
    private readonly mName: string;
    private readonly mTypeDeclaration: BasePgslTypeDefinition;

    /**
     * Declaration type name.
     */
    public get declarationType(): PgslDeclarationType {
        const lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, this.mDeclarationTypeName);
        return lDeclarationType ?? PgslDeclarationType.Private;
    }

    /**
     * Value initialization expression.
     */
    public get expression(): BasePgslExpression | null {
        return this.mExpression;
    }

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Variable type.
     */
    public get type(): BasePgslTypeDefinition {
        return this.mTypeDeclaration;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslVariableDeclarationSyntaxTreeConstructorParameter, pAttributes: PgslAttributeList, pMeta: BasePgslSyntaxTreeMeta) {
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
     * Transpile current variable declaration into a string.
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns Transpiled code.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
        // Try to parse declaration type.
        let lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, this.mDeclarationTypeName);
        if (!lDeclarationType) {
            lDeclarationType = PgslDeclarationType.Private;
        }

        // Access mode attribute is optional and only used for meta.
        let lAccessMode: PgslAccessMode = ((): PgslAccessMode => {
            // Default access mode is read.
            if (!this.attributes.hasAttribute('AccessMode')) {
                return PgslAccessMode.Read;
            }

            // Read attribute parameters group binding attribute must have one parameter.
            const lAttributeParameter: Array<BasePgslExpression> = this.attributes.getAttributeParameter('AccessMode')!;
            if (lAttributeParameter.length !== 1) {
                return PgslAccessMode.Read;
            }

            // Transpile attribute parameters. We assume the transpiled value is valid here as it was validated before.
            return lAttributeParameter[0].transpile(pTrace) as PgslAccessMode;
        })();

        // Get type, resolving any aliases.
        const [lDeclarationTypeString, lBindingType] = ((): [string, PgslFileMetaInformationBindingType] => {
            // TODO: Needs some better handling for texture and sampler types.

            switch (lDeclarationType) {
                case PgslDeclarationType.Const:
                    return ['const', 'uniform'];
                case PgslDeclarationType.Storage: {
                    // Dependent on the access mode, set correct binding type.
                    // Cast back to string, as lAccessMode can be outside of enum values.
                    switch (lAccessMode as string) {
                        case PgslAccessMode.Read:
                            return [`var<storage, ${lAccessMode}>`, 'read-storage'];
                        case PgslAccessMode.Write:
                            return [`var<storage, ${lAccessMode}>`, 'write-storage'];
                        case PgslAccessMode.ReadWrite:
                            return [`var<storage, ${lAccessMode}>`, 'read-write-storage'];
                    }

                    return [`var<storage, ${lAccessMode}>`, 'write-storage'];
                }
                case PgslDeclarationType.Workgroup:
                    return ['var<workgroup>', 'uniform'];
                case PgslDeclarationType.Private:
                    return ['var<private>', 'uniform'];
                case PgslDeclarationType.Param:
                    return ['override', 'uniform'];
                case PgslDeclarationType.Uniform: {
                    return ['var<uniform>', 'uniform'];
                }
            }

            return ['var<private>', 'uniform'];
        })();

        // Transpile binding attribute.
        const lBindingAttribute: string = (() => {
            // If no group binding attribute is present, return empty string.
            if (!this.attributes.hasAttribute('GroupBinding')) {
                return '';
            }

            // Read attribute parameters group binding attribute must have two parameters.
            const lAttributeParameter: Array<BasePgslExpression> = this.attributes.getAttributeParameter('GroupBinding')!;
            if (lAttributeParameter.length !== 2) {
                return '';
            }

            // Transpile attribute parameters.
            const lGroupName: string = lAttributeParameter[0].transpile(pTrace);
            const lBindingName: string = lAttributeParameter[1].transpile(pTrace);

            // Resolve binding location.
            const lBindingLocation: { bindGroup: number; binding: number; } = pTrace.setBinding(lGroupName, lBindingName, this.mTypeDeclaration, lBindingType);

            return this.attributes.transpileAttributeWithParameter('GroupBinding', [lBindingLocation.bindGroup.toString(), lBindingLocation.binding.toString()]);
        })();

        // Transpile declaration parts to fit spaces correctly.
        const lTypeDeclaration: string = this.mTypeDeclaration.transpile(pTrace);
        const lAttributeString: string = lBindingAttribute.length > 0 ? `${lBindingAttribute} ` : '';

        // If no expression is given, return declaration without expression.
        if (!this.mExpression) {
            return `${lAttributeString}${lDeclarationTypeString} ${this.mName}: ${lTypeDeclaration};`;
        }

        return `${lAttributeString}${lDeclarationTypeString} ${this.mName}: ${lTypeDeclaration} = ${this.mExpression.transpile(pTrace)};`;
    }

    /**
     * Validate data of current structure.
     * https://www.w3.org/TR/WGSL/#var-and-value
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): PgslVariableDeclarationSyntaxTreeValidationAttachment {
        // Push variable definition to current scope.
        pValidationTrace.pushScopedValue(this.mName, this);

        // Validate attributes and type declaration.
        this.attributes.validate(pValidationTrace);
        this.mTypeDeclaration.validate(pValidationTrace);

        // Validate optional expression when set.
        if (this.mExpression) {
            this.mExpression.validate(pValidationTrace);
        }

        // Try to parse declaration type.
        let lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, this.mDeclarationTypeName);
        if (!lDeclarationType) {
            pValidationTrace.pushError(`Declaration type "${this.mDeclarationTypeName}" can not be used for module scope variable declarations.`, this.meta, this);

            // Set default declaration type to avoid further errors.
            // Private is a good default as it has the least restrictions.
            lDeclarationType = PgslDeclarationType.Private;
        }

        // Read attachments of type declaration.
        const lTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mTypeDeclaration);

        // Read optional expression attachment.
        let lExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment | null = null;
        if (this.mExpression) {
            lExpressionAttachment = pValidationTrace.getAttachment(this.mExpression);
        }

        // A bunch of specific validation function to easy build a validation for each declaration type.
        const lMustBeConstructible = () => {
            if (!lTypeAttachment.constructible) {
                pValidationTrace.pushError(`The type of declaration type "${this.mDeclarationTypeName}" must be constructible.`, this.meta, this);
            }
        };
        const lMustBeScalar = () => {
            if (!lTypeAttachment.scalar) {
                pValidationTrace.pushError(`The type of declaration type "${this.mDeclarationTypeName}" must be a scalar type.`, this.meta, this);
            }
        };
        const lMustHaveAnInitializer = () => {
            if (!this.mExpression) {
                pValidationTrace.pushError(`Declaration type "${this.mDeclarationTypeName}" must have an initializer.`, this.meta, this);
            }
        };
        const lMustNotHaveAnInitializer = () => {
            if (this.mExpression) {
                pValidationTrace.pushError(`Declaration type "${this.mDeclarationTypeName}" must not have an initializer.`, this.meta, this);
            }
        };
        const lMustBeHostShareable = () => {
            if (!lTypeAttachment.hostShareable) {
                pValidationTrace.pushError(`The type of declaration type "${this.mDeclarationTypeName}" must be host shareable.`, this.meta, this);
            }
        };
        const lMustHaveAFixedFootprint = () => {
            if (!lTypeAttachment.fixedFootprint) {
                pValidationTrace.pushError(`The type of declaration type "${this.mDeclarationTypeName}" must have a fixed footprint.`, this.meta, this);
            }
        };
        const lExpressionMustBeConst = () => {
            if (lExpressionAttachment && lExpressionAttachment.fixedState !== PgslValueFixedState.Constant) {
                pValidationTrace.pushError(`The expression of declaration type "${this.mDeclarationTypeName}" must be a constant expression.`, this.meta, this);
            }
        };
        const lMustBePlain = () => {
            if (!lTypeAttachment.plain) {
                pValidationTrace.pushError(`The type of declaration type "${this.mDeclarationTypeName}" must be a plain type.`, this.meta, this);
                return;
            }
        };
        const lAllowedAttributes = (pAttributes: Array<{ name: string, required: boolean; }>) => {
            // Sort into required and optional attributes.
            const lRequiredAttributes: Set<string> = new Set<string>();
            const lOptionalAttributes: Set<string> = new Set<string>();
            for (const pAttribute of pAttributes) {
                if (pAttribute.required) {
                    lRequiredAttributes.add(pAttribute.name);
                } else {
                    lOptionalAttributes.add(pAttribute.name);
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
                    pValidationTrace.pushError(`Declaration type "${this.mDeclarationTypeName}" does not allow attribute "${lAttributeName}".`, this.meta, this);
                }
            }

            // Check if all required attributes are present.
            for (const lRequiredAttributeName of lRequiredAttributes) {
                pValidationTrace.pushError(`Declaration type "${this.mDeclarationTypeName}" requires attribute "${lRequiredAttributeName}".`, this.meta, this);
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
                lMustNotHaveAnInitializer();
                lMustBeConstructible();
                lMustBeHostShareable();

                // Uniform require a [GroupBinding] attribute.
                lAllowedAttributes([
                    { name: 'GroupBinding', required: true },
                    { name: 'AccessMode', required: false },
                ]);
                break;
            }
            case PgslDeclarationType.Workgroup: {
                lMustHaveAFixedFootprint();
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
                pValidationTrace.pushError(`Declaration type "${this.mDeclarationTypeName}" can not be used for module scope variable declarations.`, this.meta, this);
            }
        }

        // Validate if expression fits declaration type.
        if (lExpressionAttachment && !lExpressionAttachment.resolveType.isImplicitCastableInto(pValidationTrace, this.mTypeDeclaration)) {
            // Read the attachment of the expression type.
            const lExpressionTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lExpressionAttachment.resolveType);

            // Expression type is not castable into declaration type.
            pValidationTrace.pushError(`Initializing value of type "${lExpressionTypeAttachment.baseType}" can't be assigned to "${lTypeAttachment.baseType}"`, this.meta, this);
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

        return {
            addressSpace: PgslVariableDeclaration.mDeclarationAddressSpaceMapping.get(lDeclarationType)!,
            declarationType: lDeclarationType,
            type: this.mTypeDeclaration,
            fixedState: lFixedState
        };
    }
}

export type PgslVariableDeclarationSyntaxTreeValidationAttachment = {
    fixedState: PgslValueFixedState;
    declarationType: PgslDeclarationType;
    addressSpace: PgslValueAddressSpace;
    type: BasePgslTypeDefinition;
};

export type PgslVariableDeclarationSyntaxTreeConstructorParameter = {
    declarationType: string;
    name: string;
    type: BasePgslTypeDefinition;
    expression?: BasePgslExpression;
};