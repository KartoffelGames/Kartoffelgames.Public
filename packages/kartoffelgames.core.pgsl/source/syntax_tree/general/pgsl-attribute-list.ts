import { Dictionary, Exception } from '@kartoffelgames/core';
import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import { PgslExpressionTrace } from "../../trace/pgsl-expression-trace.ts";
import { PgslTrace } from "../../trace/pgsl-trace.ts";
import { PgslNumericType, PgslNumericTypeName } from "../../type/pgsl-numeric-type.ts";
import { PgslStringType } from "../../type/pgsl-string-type.ts";
import { PgslType } from "../../type/pgsl-type.ts";
import { BasePgslSyntaxTree, PgslSyntaxTreeConstructor, type BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { PgslDeclaration } from "../declaration/pgsl-declaration.ts";
import { PgslFunctionDeclaration } from "../declaration/pgsl-function-declaration.ts";
import { PgslStructPropertyDeclaration } from "../declaration/pgsl-struct-property-declaration.ts";
import { PgslVariableDeclaration } from "../declaration/pgsl-variable-declaration.ts";
import { type BasePgslExpression } from '../expression/base-pgsl-expression.ts';

/**
 * Generic attribute list.
 */
export class PgslAttributeList extends BasePgslSyntaxTree {
    /**
     * All valid attributes.
     */
    private static readonly mValidAttributes: Dictionary<PgslAttributeName, AttributeDefinitionInformation> = (() => {
        const lAttributes: Dictionary<PgslAttributeName, AttributeDefinitionInformation> = new Dictionary<PgslAttributeName, AttributeDefinitionInformation>();

        // Function and declaration config.
        lAttributes.set('GroupBinding', {
            enforcedParentType: PgslVariableDeclaration,
            parameterTypes: [
                [{ values: [] }, { values: [] }]
            ],
            transpiledAttributes: {
                'group': [0], // TODO: Some global way of converting names into numbers.
                'binding': [1] // TODO: Some global way of converting names into numbers.
            }
        });
        lAttributes.set('AccessMode', {
            enforcedParentType: PgslVariableDeclaration,
            parameterTypes: [
                [{ values: ['Read', 'Write', 'ReadWrite'] }]
            ],
            transpiledAttributes: {} // Only used for metadata information for declaration transpilation.
        });

        // Struct type.
        lAttributes.set('Align', {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ type: PgslNumericType.typeName.unsignedInteger, state: PgslValueFixedState.Constant }]
            ],
            transpiledAttributes: {
                'align': [0]
            }
        });
        lAttributes.set('BlendSource', {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ values: [] }] // Location output.
            ],
            transpiledAttributes: {
                'blend_src': [0] // TODO: Some global way of converting names into numbers.
            }
        });
        lAttributes.set('Interpolate', {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ values: ['perspective', 'linear', 'flat'] }],
                [{ values: ['perspective', 'linear', 'flat'] }, { values: ['centroid', 'sample', 'first', 'either'] }]
            ],
            transpiledAttributes: {
                'interpolate': [0, 1],
            }
        });
        lAttributes.set('Invariant', {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [],
            transpiledAttributes: {
                'invariant': []
            }
        });
        lAttributes.set('Location', {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ values: [] }]
            ],
            transpiledAttributes: {
                'location': [0] // TODO: Some global way of converting names into numbers.
            }
        });
        lAttributes.set('Size', {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ type: PgslNumericType.typeName.unsignedInteger, state: PgslValueFixedState.Constant }]
            ],
            transpiledAttributes: {
                'size': [0]
            }
        });

        // Entry points.
        lAttributes.set('Vertex', {
            enforcedParentType: PgslFunctionDeclaration,
            parameterTypes: [],
            transpiledAttributes: {
                'vertex': []
            }
        });
        lAttributes.set('Fragment', {
            enforcedParentType: PgslFunctionDeclaration,
            parameterTypes: [],
            transpiledAttributes: {
                'fragment': []
            }
        });
        lAttributes.set('Compute', {
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
            ],
            transpiledAttributes: {
                'compute': [],
                'workgroup_size': [0, 1, 2],
            }
        });

        return lAttributes;
    })();

    private readonly mAttributeDefinitionList: Dictionary<string, Array<BasePgslExpression>>;
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
        this.mAttributeDefinitionList = new Dictionary<string, Array<BasePgslExpression>>();
        this.mAttachedDeclaration = null;

        // Convert and add each attribute to list.
        for (const lAttribute of pAttributes) {
            const lAttributeParameterList: Array<BasePgslExpression> = lAttribute.parameter ?? [];
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
    public getAttributeParameter(pName: PgslAttributeName): Array<BasePgslExpression> {
        // Try to read attribute parameters.
        const lAttributeParameter: Array<BasePgslExpression> | undefined = this.mAttributeDefinitionList.get(pName);
        if (!lAttributeParameter) {
            throw new Exception(`Attribute "${pName}" is not defined for the declaration.`, this);
        }

        return lAttributeParameter;
    }

    /**
     * Transpile an attribute with its parameters.
     * 
     * @param pName - Attribute name.
     * @param pAttributeParameterList - Transpiled attribute parameter list.
     * 
     * @returns Transpiled attribute string.
     */
    public transpileAttributeWithParameter(pName: PgslAttributeName, pAttributeParameterList: Array<string>): string {
        // Read attribute definition.
        const lAttributeDefinition: AttributeDefinitionInformation = PgslAttributeList.mValidAttributes.get(pName)!;

        let lResult: string = '';

        // Output each attribute in transpile information.
        for (const [lTranspileName, lTranspileParameterIndices] of Object.entries(lAttributeDefinition.transpiledAttributes)) {
            // Transpile all parameters.
            const lTranspiledParameter: Array<string> = new Array<string>();
            for (const lParameterIndex of lTranspileParameterIndices) {
                // Check if attribute has enough parameters. Exit when not.
                if (lParameterIndex >= pAttributeParameterList.length) {
                    break;
                }

                lTranspiledParameter.push(pAttributeParameterList[lParameterIndex]);
            }

            // Transpile attribute name.
            lResult += ` @${lTranspileName}(${lTranspiledParameter.join(', ')})`;
        }

        // Return result.
        return lResult.trim();
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
            this.validateParameter(pTrace, lAttributeParameter, lParameterDefinition);
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
    private validateParameter(pTrace: PgslTrace, pParameterSourceList: Array<BasePgslExpression>, pValidationParameterList: Array<AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter>): void {
        // Match every single template parameter.
        for (let lIndex = 0; lIndex < pValidationParameterList.length; lIndex++) {
            const lExpectedTemplateType: AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter = pValidationParameterList[lIndex];

            // Read and get the trace of the actual attribute parameter.
            let lActualAttributeParameter: BasePgslExpression = pParameterSourceList[lIndex];
            const lActualAttributeParameterTrace: PgslExpressionTrace = pTrace.getExpression(lActualAttributeParameter);
            const lActualAttributeParameterType: PgslType = lActualAttributeParameterTrace.resolveType;

            // Validate based on expected template type.
            if ('values' in lExpectedTemplateType) { // String or enum.
                // String parameter must be constants.
                if (lActualAttributeParameterTrace.fixedState < PgslValueFixedState.Constant) {
                    pTrace.pushIncident(`Attribute parameter ${lIndex} must be a constant expression.`, lActualAttributeParameter);
                    continue;
                }

                // Not a string parameter.
                if (!(lActualAttributeParameterType instanceof PgslStringType)) {
                    pTrace.pushIncident(`Attribute parameter ${lIndex} must be a string.`, lActualAttributeParameter);
                    continue;
                }

                // Not a constant string parameter.
                if (typeof lActualAttributeParameterTrace.constantValue !== 'string') {
                    pTrace.pushIncident(`Attribute parameter ${lIndex} must be a constant string.`, lActualAttributeParameter);
                    continue;
                }

                // Check if parameter value matches one of the expected values, if any are defined.
                if (lExpectedTemplateType.values.length > 0 && !lExpectedTemplateType.values.includes(lActualAttributeParameterTrace.constantValue)) {
                    pTrace.pushIncident(`Attribute parameter ${lIndex} has an invalid value.`, lActualAttributeParameter);
                }
            } else if ('type' in lExpectedTemplateType) { // Number
                // Not a number parameter.
                if (!(lActualAttributeParameterType instanceof PgslNumericType)) {
                    pTrace.pushIncident(`Attribute parameter ${lIndex} must be a number.`, lActualAttributeParameter);
                    continue;
                }

                // Check if parameter type matches expected type.
                if (!lActualAttributeParameterType.isImplicitCastableInto(new PgslNumericType(pTrace, lExpectedTemplateType.type))) {
                    pTrace.pushIncident(`Attribute parameter ${lIndex} must be of type ${lExpectedTemplateType.type}.`, lActualAttributeParameter);
                }

                // Check fixed state is same or higher than expected.
                if (lActualAttributeParameterTrace.fixedState < lExpectedTemplateType.state) {
                    pTrace.pushIncident(`Attribute parameter ${lIndex} has the wrong fixed state.`, lActualAttributeParameter);
                }
            }
        }
    }
}

export type PgslAttributeName = 'GroupBinding' | 'AccessMode' | 'Align' | 'BlendSource' | 'Interpolate' | 'Invariant' | 'Location' | 'Size' | 'Vertex' | 'Fragment' | 'Compute';

export type PgslAttributeListSyntaxTreeConstructorParameterAttribute = {
    name: string,
    parameter?: Array<BasePgslExpression>;
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

    /**
     * Name: Used parameter indices.
     */
    transpiledAttributes: Record<string, Array<number>>;
};