import { Dictionary, Exception } from '@kartoffelgames/core';
import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { BasePgslDeclaration } from "../declaration/base-pgsl-declaration.ts";
import { PgslEnumDeclaration, PgslEnumDeclarationSyntaxTreeValidationAttachment } from "../declaration/pgsl-enum-declaration.ts";
import { PgslFunctionDeclaration } from "../declaration/pgsl-function-declaration.ts";
import { PgslStructPropertyDeclaration } from "../declaration/pgsl-struct-property-declaration.ts";
import { PgslVariableDeclaration } from "../declaration/pgsl-variable-declaration.ts";
import { PgslExpressionSyntaxTreeValidationAttachment, type BasePgslExpression } from '../expression/base-pgsl-expression.ts';
import { PgslEnumValueExpression } from '../expression/single_value/pgsl-enum-value-expression.ts';
import { PgslStringValueExpression } from '../expression/single_value/pgsl-string-value-expression.ts';
import type { PgslValidationTrace } from '../pgsl-validation-trace.ts';
import { BasePgslTypeDefinition } from "../type/base-pgsl-type-definition.ts";
import { PgslNumericTypeName } from "../type/enum/pgsl-numeric-type-name.enum.ts";
import { PgslNumericTypeDefinition } from "../type/pgsl-numeric-type-definition.ts";

// TODO: Cooler validation system for attributes. 
// - Required parent type (e.g. @vertex only on functions). (Requires parent set in base declaration syntax tree constructor)
// - Automatic validation in declaration syntax tree. (after parent tree validation) so childs need another validation method. 
// - Set parameter requirements by syntax tree type. [IntegerExpression...]
// - Extended validation function that checks the parameter values (eg. for enums).

/**
 * Generic attribute list.
 */
export class PgslAttributeList extends BasePgslSyntaxTree {
    /**
     * All valid attributes.
     */
    private static readonly mValidAttributes: Dictionary<string, AttributeDefinitionInformation> = (() => {
        const lAttributes: Dictionary<string, AttributeDefinitionInformation> = new Dictionary<string, AttributeDefinitionInformation>();

        // Function and declaration config.
        lAttributes.set('GroupBinding', {
            enforcedParentType: PgslVariableDeclaration,
            parameterTypes: [
                [{ values: [] }, { values: [] }]
            ],
            transpileInformation: {
                'group': [0], // TODO: Some global way of converting names into numbers.
                'binding': [1] // TODO: Some global way of converting names into numbers.
            }
        });
        lAttributes.set('AccessMode', {
            enforcedParentType: PgslVariableDeclaration,
            parameterTypes: [
                [{ values: ['Read', 'Write', 'ReadWrite'] }]
            ],
            transpileInformation: {} // Only used for metadata information for declaration transpilation.
        });

        // Struct type.
        lAttributes.set('Align', {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ type: PgslNumericTypeName.Integer, state: PgslValueFixedState.Constant }]
            ],
            transpileInformation: {
                'align': [0]
            }
        });
        lAttributes.set('BlendSource', {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ values: [] }] // Location output.
            ],
            transpileInformation: {
                'blend_src': [0] // TODO: Some global way of converting names into numbers.
            }
        });
        lAttributes.set('Interpolate', {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ values: ['perspective', 'linear', 'flat'] }],
                [{ values: ['perspective', 'linear', 'flat'] }, { values: ['centroid', 'sample', 'first', 'either'] }]
            ],
            transpileInformation: {
                'interpolate': [0, 1],
            }
        });
        lAttributes.set('Invariant', {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [],
            transpileInformation: {
                'invariant': []
            }
        });
        lAttributes.set('Location', {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ values: [] }]
            ],
            transpileInformation: {
                'location': [0] // TODO: Some global way of converting names into numbers.
            }
        });
        lAttributes.set('Size', {
            enforcedParentType: PgslStructPropertyDeclaration,
            parameterTypes: [
                [{ type: PgslNumericTypeName.Integer, state: PgslValueFixedState.Constant }]
            ],
            transpileInformation: {
                'size': [0]
            }
        });

        // Entry points.
        lAttributes.set('Vertex', {
            enforcedParentType: PgslFunctionDeclaration,
            parameterTypes: [],
            transpileInformation: {
                'vertex': []
            }
        });
        lAttributes.set('Fragment', {
            enforcedParentType: PgslFunctionDeclaration,
            parameterTypes: [],
            transpileInformation: {
                'fragment': []
            }
        });
        lAttributes.set('Compute', {
            enforcedParentType: PgslFunctionDeclaration,
            parameterTypes: [ // Parameters for workgroup size.
                [
                    { type: PgslNumericTypeName.Integer, state: PgslValueFixedState.Constant }
                ],
                [
                    { type: PgslNumericTypeName.Integer, state: PgslValueFixedState.Constant },
                    { type: PgslNumericTypeName.Integer, state: PgslValueFixedState.Constant }
                ],
                [
                    { type: PgslNumericTypeName.Integer, state: PgslValueFixedState.Constant },
                    { type: PgslNumericTypeName.Integer, state: PgslValueFixedState.Constant },
                    { type: PgslNumericTypeName.Integer, state: PgslValueFixedState.Constant }
                ]
            ],
            transpileInformation: {
                'compute': [],
                'workgroup_size': [0, 1, 2],
            }
        });

        return lAttributes;
    })();

    private readonly mAttributeDefinitionList: Dictionary<string, Array<BasePgslExpression>>;
    private mAttachedDeclaration: BasePgslDeclaration | null;

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
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pAttributes: Array<PgslAttributeListSyntaxTreeConstructorParameterAttribute>) {
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
    public attachToDeclaration(pDeclaration: BasePgslDeclaration): void {
        // Only attach once.
        if (this.mAttachedDeclaration) {
            throw new Exception(`Attribute list is already attached to a declaration.`, this);
        }

        this.mAttachedDeclaration = pDeclaration;
    }

    /**
     * Get all parameter of attributes by name.
     * 
     * @param pName - Attribute name.
     * 
     * @returns all attribute parameters 
     */
    public getAttribute(pName: string): Array<BasePgslExpression> {
        // Try to read attribute parameters.
        const lAttributeParameter: Array<BasePgslExpression> | undefined = this.mAttributeDefinitionList.get(pName);
        if (!lAttributeParameter) {
            throw new Exception(`Attribute "${pName}" is not defined for the declaration.`, this);
        }

        return lAttributeParameter;
    }

    /**
     * Transpile syntax tree to WGSL code.
     */
    protected override onTranspile(): string {
        let lResult: string = '';

        // Transpile each attribute.
        for (const [lAttributeName, lAttributeParameter] of this.mAttributeDefinitionList) {
            // Check if attribute has a definition.
            if (!PgslAttributeList.mValidAttributes.has(lAttributeName)) {
                continue;
            }

            // Read the attribute definition.
            const lAttributeDefinition: AttributeDefinitionInformation = PgslAttributeList.mValidAttributes.get(lAttributeName)!;

            // Output each attribute in transpile information.
            for (const [lTranspileName, lTranspileParameterIndices] of Object.entries(lAttributeDefinition.transpileInformation)) {
                // Transpile all parameters.
                const lTranspiledParameter: Array<string> = new Array<string>();
                for (const lParameterIndex of lTranspileParameterIndices) {
                    // Check if attribute has enough parameters. Exit when not.
                    if (lParameterIndex >= lAttributeParameter.length) {
                        break;
                    }

                    lTranspiledParameter.push(lAttributeParameter[lParameterIndex].transpile());
                }

                // Transpile attribute name.
                lResult += ` @${lTranspileName}(${lTranspiledParameter.join(', ')})`;
            }
        }

        // Return result.
        return lResult.trim();
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pTrace: PgslValidationTrace): void {
        // Must be attached to a declaration.
        if (!this.mAttachedDeclaration) {
            pTrace.pushError(`Attribute list is not attached to a declaration.`, this.meta, this);
            return;
        }

        // Validate each attribute.
        for (const [lAttributeName, lAttributeParameter] of this.mAttributeDefinitionList) {
            // Check if attribute has a definition.
            if (!PgslAttributeList.mValidAttributes.has(lAttributeName)) {
                pTrace.pushError(`Attribute "${lAttributeName}" is not a valid attribute.`, this.meta, this);
                continue;
            }

            // Read the attribute definition.
            const lAttributeDefinition: AttributeDefinitionInformation = PgslAttributeList.mValidAttributes.get(lAttributeName)!;

            // Check if parent type is correct.
            if (lAttributeDefinition.enforcedParentType) {
                if (!(this.mAttachedDeclaration instanceof lAttributeDefinition.enforcedParentType)) {
                    pTrace.pushError(`Attribute "${lAttributeName}" is not attached to a valid parent type.`, this.meta, this);
                }
            }

            // Search for parameter definition that matches the given parameter count.
            let lParameterDefinition: Array<AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter> = new Array<AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter>();
            if (lAttributeDefinition.parameterTypes.length > 0) {
                // Find a parameter definition that matches the given parameter count.
                const lFoundParameterDefinition = lAttributeDefinition.parameterTypes.find(pEntry => pEntry.length === lAttributeParameter.length);
                if (!lFoundParameterDefinition) {
                    pTrace.pushError(`Attribute "${lAttributeName}" has invalid number of parameters.`, this.meta, this);
                    continue;
                }
                lParameterDefinition = lFoundParameterDefinition ?? [];
            }

            // Validate integrity of each parameter.
            for (const lParameter of lAttributeParameter) {
                lParameter.validate(pTrace);
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
    private validateParameter(pTrace: PgslValidationTrace, pParameterSourceList: Array<BasePgslExpression>, pValidationParameterList: Array<AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter>): void {
        // Match every single template parameter.
        for (let lIndex = 0; lIndex < pValidationParameterList.length; lIndex++) {
            const lExpectedTemplateType: AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter = pValidationParameterList[lIndex];

            // Convert enum to literal or string. expression.
            let lActualAttributeParameter: BasePgslExpression = pParameterSourceList[lIndex];
            if (lActualAttributeParameter instanceof PgslEnumValueExpression) { // TODO: Cant do this, as alias types could be that as well.
                // Read enum from name.
                const lEnum: BasePgslSyntaxTree = pTrace.getScopedValue(lActualAttributeParameter.name);
                if (lEnum instanceof PgslEnumDeclaration) { // TODO: Cant do this, as alias types could be that as well.
                    // Read the attachment of the enum.
                    const lEnumAttachment: PgslEnumDeclarationSyntaxTreeValidationAttachment = pTrace.getAttachment(lEnum);
                    if (lEnumAttachment.values.has(lActualAttributeParameter.name)) {
                        // Set value of enums property as actual attribute parameter.
                        lActualAttributeParameter = lEnumAttachment.values.get(lActualAttributeParameter.name)!;
                    }
                }
            }

            // Read the attachment of the actual attribute parameter.
            const lActualAttributeParameterAttachment: PgslExpressionSyntaxTreeValidationAttachment = pTrace.getAttachment(lActualAttributeParameter);
            const lActualAttributeParameterType: BasePgslTypeDefinition = lActualAttributeParameterAttachment.resolveType;

            // Validate based on expected template type.
            if ('values' in lExpectedTemplateType) { // String or enum.
                // Not a string parameter.
                if (!(lActualAttributeParameterAttachment instanceof PgslStringValueExpression)) { // TODO: Cant do this, as alias types could be that as well.
                    pTrace.pushError(`Attribute parameter ${lIndex} must be a string.`, lActualAttributeParameter.meta, this);
                    continue;
                }

                // Check if parameter value matches one of the expected values, if any are defined.
                if (lExpectedTemplateType.values.length > 0 && !lExpectedTemplateType.values.includes(lActualAttributeParameterAttachment.value)) {
                    pTrace.pushError(`Attribute parameter ${lIndex} has an invalid value.`, lActualAttributeParameter.meta, this);
                }
            } else if ('type' in lExpectedTemplateType) { // Number
                // Not a number parameter.
                if (!(lActualAttributeParameterType instanceof PgslNumericTypeDefinition)) { // TODO: Cant do this, as alias types could be that as well.
                    pTrace.pushError(`Attribute parameter ${lIndex} must be a number.`, lActualAttributeParameter.meta, this);
                    continue;
                }

                // Check if parameter type matches expected type.
                if (lActualAttributeParameterType.numericType !== lExpectedTemplateType.type) { // TODO: Allow implicit casts
                    pTrace.pushError(`Attribute parameter ${lIndex} must be of type ${lExpectedTemplateType.type}.`, lActualAttributeParameter.meta, this);
                }

                // Check fixed state is same or higher than expected.
                if (lActualAttributeParameterAttachment.fixedState < lExpectedTemplateType.state) {
                    pTrace.pushError(`Attribute parameter ${lIndex} has the wrong fixed state.`, lActualAttributeParameter.meta, this);
                }
            }
        }
    }
}

export type PgslAttributeListSyntaxTreeConstructorParameterAttribute = {
    name: string,
    parameter?: Array<BasePgslExpression>;
};

type PgslSyntaxTreeType<T extends BasePgslSyntaxTree<any>> = new (...pArgs: Array<any>) => T;

type AttributeDefinitionNumberParameter = {
    type: PgslNumericTypeName;
    state: PgslValueFixedState;
};

type AttributeDefinitionStringParameter = {
    values: Array<string>;
};

type AttributeDefinitionInformation = {
    enforcedParentType?: PgslSyntaxTreeType<BasePgslSyntaxTree<any>>;
    parameterTypes: Array<
        Array<AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter>
    >;
    /**
     * Name: Used parameter indices.
     */
    transpileInformation: Record<string, Array<number>>;
};