import { Dictionary, Exception } from '@kartoffelgames/core';
import { PgslValueFixedState } from '../../enum/pgsl-value-fixed-state.ts';
import type { PgslExpressionTrace } from '../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../trace/pgsl-trace.ts';
import { PgslNumericType, type PgslNumericTypeName } from '../../type/pgsl-numeric-type.ts';
import { PgslStringType } from '../../type/pgsl-string-type.ts';
import type { PgslType } from '../../type/pgsl-type.ts';
import { BasePgslSyntaxTree, type PgslSyntaxTreeConstructor, type BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslDeclaration } from '../declaration/pgsl-declaration.ts';
import { PgslFunctionDeclaration } from '../declaration/pgsl-function-declaration.ts';
import { PgslStructPropertyDeclaration } from '../declaration/pgsl-struct-property-declaration.ts';
import { PgslVariableDeclaration } from '../declaration/pgsl-variable-declaration.ts';
import type { PgslExpression } from '../expression/pgsl-expression.ts';

/**
 * Generic attribute list.
 */
export class PgslAttributeList extends BasePgslSyntaxTree {
    /**
     * All possible attribute names.
     */
    public static get attributeNames() {
        return {
            groupBinding: 'GroupBinding',
            accessMode: 'AccessMode',
            align: 'Align',
            blendSource: 'BlendSource',
            interpolate: 'Interpolate',
            invariant: 'Invariant',
            location: 'Location',
            size: 'Size',
            vertex: 'Vertex',
            fragment: 'Fragment',
            compute: 'Compute'
        } as const;
    }

    /**
     * All valid attributes.
     */
    private static readonly mValidAttributes: Dictionary<PgslAttributeName, AttributeDefinitionInformation> = (() => {
        const lAttributes: Dictionary<PgslAttributeName, AttributeDefinitionInformation> = new Dictionary<PgslAttributeName, AttributeDefinitionInformation>();

        // Function and declaration config.
        lAttributes.set(PgslAttributeList.attributeNames.groupBinding, {
            enforcedParentType: PgslVariableDeclaration,
            parameterTypes: [
                [{ values: [] }, { values: [] }]
            ]
        });
        lAttributes.set(PgslAttributeList.attributeNames.accessMode, {
            enforcedParentType: PgslVariableDeclaration,
            parameterTypes: [
                [{ values: ['read', 'write', 'read_write'] }]
            ]
        });

        // Struct type.
        lAttributes.set(PgslAttributeList.attributeNames.align, {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ type: PgslNumericType.typeName.unsignedInteger, state: PgslValueFixedState.Constant }]
            ]
        });
        lAttributes.set(PgslAttributeList.attributeNames.blendSource, {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ type: PgslNumericType.typeName.unsignedInteger, state: PgslValueFixedState.Constant }] // Location output.
            ]
        });
        lAttributes.set(PgslAttributeList.attributeNames.interpolate, {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ values: ['perspective', 'linear', 'flat'] }],
                [{ values: ['perspective', 'linear', 'flat'] }, { values: ['center', 'centroid', 'sample', 'first', 'either'] }]
            ]
        });
        lAttributes.set(PgslAttributeList.attributeNames.invariant, {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: []
        });
        lAttributes.set(PgslAttributeList.attributeNames.location, {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ values: [] }]
            ]
        });
        lAttributes.set(PgslAttributeList.attributeNames.size, {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ type: PgslNumericType.typeName.unsignedInteger, state: PgslValueFixedState.Constant }]
            ]
        });

        // Entry points.
        lAttributes.set(PgslAttributeList.attributeNames.vertex, {
            enforcedParentType: PgslFunctionDeclaration,
            parameterTypes: []
        });
        lAttributes.set(PgslAttributeList.attributeNames.fragment, {
            enforcedParentType: PgslFunctionDeclaration,
            parameterTypes: []
        });
        lAttributes.set(PgslAttributeList.attributeNames.compute, {
            enforcedParentType: PgslFunctionDeclaration,
            parameterTypes: [ // Parameters for workgroup size.
                [
                    { type: PgslNumericType.typeName.signedInteger, state: PgslValueFixedState.Constant }
                ],
                [
                    { type: PgslNumericType.typeName.signedInteger, state: PgslValueFixedState.Constant },
                    { type: PgslNumericType.typeName.signedInteger, state: PgslValueFixedState.Constant }
                ],
                [
                    { type: PgslNumericType.typeName.signedInteger, state: PgslValueFixedState.Constant },
                    { type: PgslNumericType.typeName.signedInteger, state: PgslValueFixedState.Constant },
                    { type: PgslNumericType.typeName.signedInteger, state: PgslValueFixedState.Constant }
                ]
            ]
        });

        return lAttributes;
    })();

    private readonly mAttributeDefinitionList: Dictionary<string, Array<PgslExpression>>;
    private mAttachedDeclaration: PgslDeclaration | null;

    /**
     * All attribute names defined in this list.
     */
    public get attributeNames(): ReadonlyArray<string> {
        return Array.from(this.mAttributeDefinitionList.keys());
    }

    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     * @param pAttributes - Attribute list.
     */
    public constructor(pAttributes: Array<PgslAttributeListSyntaxTreeConstructorParameterAttribute>, pMeta?: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Init empty attribute list.
        this.mAttributeDefinitionList = new Dictionary<string, Array<PgslExpression>>();
        this.mAttachedDeclaration = null;

        // Convert and add each attribute to list.
        for (const lAttribute of pAttributes) {
            const lAttributeParameterList: Array<PgslExpression> = lAttribute.parameter ?? [];
            // Add attribute to syntax tree.
            this.appendChild(...lAttributeParameterList);

            // Allow own attribute names but ignore it.
            this.mAttributeDefinitionList.set(lAttribute.name, lAttributeParameterList);
        }
    }

    /**
     * Attach the attribute list to a declaration.
     * 
     * @param pDeclaration - Declaration to attach to.
     */
    public attachToDeclaration(pDeclaration: PgslDeclaration): void {
        // Only attach once.
        if (this.mAttachedDeclaration) {
            throw new Exception(`Attribute list is already attached to a declaration.`, this);
        }

        this.mAttachedDeclaration = pDeclaration;
    }

    /**
     * Check if an attribute is defined.
     * 
     * @param pName - Attribute name.
     * 
     * @returns True when attribute is defined. 
     */
    public hasAttribute(pName: PgslAttributeName): boolean {
        return this.mAttributeDefinitionList.has(pName);
    }

    /**
     * Get all parameter of attributes by name.
     * 
     * @param pName - Attribute name.
     * 
     * @returns all attribute parameters 
     */
    public getAttributeParameter(pName: PgslAttributeName): Array<PgslExpression> {
        // Try to read attribute parameters.
        const lAttributeParameter: Array<PgslExpression> | undefined = this.mAttributeDefinitionList.get(pName);
        if (!lAttributeParameter) {
            throw new Exception(`Attribute "${pName}" is not defined for the declaration.`, this);
        }

        return lAttributeParameter;
    }

    /**
     * Validate data of current structure.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Must be attached to a declaration.
        if (!this.mAttachedDeclaration) {
            pTrace.pushIncident(`Attribute list is not attached to a declaration.`, this);
            return;
        }

        // Validate each attribute.
        for (const [lAttributeName, lAttributeParameter] of this.mAttributeDefinitionList) {
            // Check if attribute has a definition.
            if (!PgslAttributeList.mValidAttributes.has(lAttributeName as PgslAttributeName)) {
                pTrace.pushIncident(`Attribute "${lAttributeName}" is not a valid attribute.`, this);
                continue;
            }

            // Read the attribute definition.
            const lAttributeDefinition: AttributeDefinitionInformation = PgslAttributeList.mValidAttributes.get(lAttributeName as PgslAttributeName)!;

            // Check if parent type is correct.
            if (lAttributeDefinition.enforcedParentType) {
                if (!(this.mAttachedDeclaration instanceof lAttributeDefinition.enforcedParentType)) {
                    pTrace.pushIncident(`Attribute "${lAttributeName}" is not attached to a valid parent type.`, this);
                }
            }

            // Search for parameter definition that matches the given parameter count.
            let lParameterDefinition: Array<AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter> = new Array<AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter>();
            if (lAttributeDefinition.parameterTypes.length > 0) {
                // Find a parameter definition that matches the given parameter count.
                const lFoundParameterDefinition = lAttributeDefinition.parameterTypes.find(pEntry => pEntry.length === lAttributeParameter.length);
                if (!lFoundParameterDefinition) {
                    pTrace.pushIncident(`Attribute "${lAttributeName}" has invalid number of parameters.`, this);
                    continue;
                }
                lParameterDefinition = lFoundParameterDefinition ?? [];
            }

            // Validate integrity of each parameter.
            for (const lParameter of lAttributeParameter) {
                lParameter.trace(pTrace);
            }

            // Validate parameter.
            this.validateParameter(pTrace, lAttributeName, lAttributeParameter, lParameterDefinition);
        }
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pTrace - Validation trace to use.
     * @param pParameterSourceList - List of parameters to validate.
     * @param pValidationParameterList - List of parameter definitions to validate against.
     */
    private validateParameter(pTrace: PgslTrace, pAttributeName: string, pParameterSourceList: Array<PgslExpression>, pValidationParameterList: Array<AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter>): void {
        // Match every single template parameter.
        for (let lIndex = 0; lIndex < pValidationParameterList.length; lIndex++) {
            const lExpectedTemplateType: AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter = pValidationParameterList[lIndex];

            // Read and get the trace of the actual attribute parameter.
            const lActualAttributeParameter: PgslExpression = pParameterSourceList[lIndex];
            const lActualAttributeParameterTrace: PgslExpressionTrace = pTrace.getExpression(lActualAttributeParameter);
            const lActualAttributeParameterType: PgslType = lActualAttributeParameterTrace.resolveType;

            // Validate based on expected template type.
            if ('values' in lExpectedTemplateType) { // String or enum.
                // String parameter must be constants.
                if (lActualAttributeParameterTrace.fixedState < PgslValueFixedState.Constant) {
                    pTrace.pushIncident(`Attribute "${pAttributeName}" parameter ${lIndex} must be a constant expression.`, lActualAttributeParameter);
                    continue;
                }

                // Not a string parameter.
                if (!(lActualAttributeParameterType instanceof PgslStringType)) {
                    pTrace.pushIncident(`Attribute "${pAttributeName}" parameter ${lIndex} must be a string.`, lActualAttributeParameter);
                    continue;
                }

                // Not a constant string parameter.
                if (typeof lActualAttributeParameterTrace.constantValue !== 'string') {
                    pTrace.pushIncident(`Attribute "${pAttributeName}" parameter ${lIndex} must be a constant string.`, lActualAttributeParameter);
                    continue;
                }

                // Check if parameter value matches one of the expected values, if any are defined.
                if (lExpectedTemplateType.values.length > 0 && !lExpectedTemplateType.values.includes(lActualAttributeParameterTrace.constantValue)) {
                    pTrace.pushIncident(`Attribute "${pAttributeName}" parameter ${lIndex} has an invalid value.`, lActualAttributeParameter);
                }
            } else if ('type' in lExpectedTemplateType) { // Number
                // Not a number parameter.
                if (!(lActualAttributeParameterType instanceof PgslNumericType)) {
                    pTrace.pushIncident(`Attribute "${pAttributeName}" parameter ${lIndex} must be a number.`, lActualAttributeParameter);
                    continue;
                }

                // Check if parameter type matches expected type.
                if (!lActualAttributeParameterType.isImplicitCastableInto(new PgslNumericType(pTrace, lExpectedTemplateType.type))) {
                    pTrace.pushIncident(`Attribute "${pAttributeName}" parameter ${lIndex} must be of type ${lExpectedTemplateType.type}.`, lActualAttributeParameter);
                }

                // Check fixed state is same or higher than expected.
                if (lActualAttributeParameterTrace.fixedState < lExpectedTemplateType.state) {
                    pTrace.pushIncident(`Attribute "${pAttributeName}" parameter ${lIndex} has the wrong fixed state.`, lActualAttributeParameter);
                }
            }
        }
    }
}

export type PgslAttributeName = typeof PgslAttributeList.attributeNames[keyof typeof PgslAttributeList.attributeNames];

export type PgslAttributeListSyntaxTreeConstructorParameterAttribute = {
    name: string,
    parameter?: Array<PgslExpression>;
};

type AttributeDefinitionNumberParameter = {
    type: PgslNumericTypeName;
    state: PgslValueFixedState;
};

type AttributeDefinitionStringParameter = {
    values: Array<string>;
};

type AttributeDefinitionInformation = {
    /**
     * Enforced parent type. If not set, any parent type is valid.
     */
    enforcedParentType?: PgslSyntaxTreeConstructor;

    /**
     * Name: Valid parameter types.
     * Each entry in the outer array represents a valid parameter count.
     */
    parameterTypes: Array<
        Array<AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter>
    >;
};