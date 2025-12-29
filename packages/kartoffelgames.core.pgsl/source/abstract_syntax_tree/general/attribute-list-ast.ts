import { Dictionary, Exception } from '@kartoffelgames/core';
import type { ExpressionCst } from '../../concrete_syntax_tree/expression.type.ts';
import type { AttributeListCst } from '../../concrete_syntax_tree/general.type.ts';
import { PgslValueFixedState } from '../../enum/pgsl-value-fixed-state.ts';
import { PgslNumericType, type PgslNumericTypeName } from '../type/pgsl-numeric-type.ts';
import { PgslStringType } from '../type/pgsl-string-type.ts';
import type { IType } from '../type/i-type.interface.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree, type AbstractSyntaxTreeConstructor } from '../abstract-syntax-tree.ts';
import { FunctionDeclarationAst } from '../declaration/function-declaration-ast.ts';
import type { IDeclarationAst } from '../declaration/i-declaration-ast.interface.ts';
import { StructPropertyDeclarationAst } from '../declaration/struct-property-declaration-ast.ts';
import { VariableDeclarationAst } from '../declaration/variable-declaration-ast.ts';
import { ExpressionAstBuilder } from '../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../expression/i-expression-ast.interface.ts';

/**
 * Generic attribute list.
 */
export class AttributeListAst extends AbstractSyntaxTree<AttributeListCst, AttributeListAstData> {
    private static mValidAttributes: Dictionary<PgslAttributeName, AttributeDefinitionInformation> | null = null;

    /**
     * All possible attribute names.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
     * Get all valid attributes.
     */
    public static get validAttributes(): Dictionary<PgslAttributeName, AttributeDefinitionInformation> {
        // Initialize cached attributes when they are not set.
        if (AttributeListAst.mValidAttributes === null) {
            throw new Exception(`Attribute definitions have not been initialized yet.`, AttributeListAst);
        }
        return AttributeListAst.mValidAttributes;
    }

    private readonly mAttachedDeclaration: IDeclarationAst | null;

    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     * @param pAttributes - Attribute list.
     */
    public constructor(pCst: AttributeListCst, pAttachedDeclaration: IDeclarationAst) {
        super(pCst);

        // Init empty attribute list.
        this.mAttachedDeclaration = pAttachedDeclaration;

        // Initialize cached attributes when they are not set.
        if (AttributeListAst.mValidAttributes === null) {
            AttributeListAst.mValidAttributes = this.readAttributeDefintions();
        }
    }

    /**
     * Get all parameter of attributes by name.
     * 
     * @param pName - Attribute name.
     * 
     * @returns all attribute parameters 
     */
    public getAttributeParameter(pName: PgslAttributeName): Array<IExpressionAst> {
        // Try to read attribute parameters.
        const lAttributeParameter: Array<IExpressionAst> | undefined = this.data.attributes.get(pName);
        if (!lAttributeParameter) {
            throw new Exception(`Attribute "${pName}" is not defined for the declaration.`, this);
        }

        return lAttributeParameter;
    }

    /**
     * Check if an attribute is defined.
     * 
     * @param pName - Attribute name.
     * 
     * @returns True when attribute is defined. 
     */
    public hasAttribute(pName: PgslAttributeName): boolean {
        return this.data.attributes.has(pName);
    }

    /**
     * Validate data of current structure.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): AttributeListAstData {
        // Create attribute list data.
        const lAttributeListData: AttributeListAstData = {
            attributes: new Map<PgslAttributeName, Array<IExpressionAst>>()
        };

        // Must be attached to a declaration.
        if (!this.mAttachedDeclaration) {
            pContext.pushIncident(`Attribute list is not attached to a declaration.`, this);

            // Return empty attribute list.
            return lAttributeListData;
        }

        // Validate each attribute.
        for (const lAttributeCst of this.cst.attributes) {
            // Check if attribute has a definition.
            if (!AttributeListAst.validAttributes.has(lAttributeCst.name as PgslAttributeName)) {
                pContext.pushIncident(`Attribute "${lAttributeCst.name}" is not a valid attribute.`, this);
                continue;
            }

            // Read the attribute definition.
            const lAttributeDefinition: AttributeDefinitionInformation = AttributeListAst.validAttributes.get(lAttributeCst.name as PgslAttributeName)!;

            // Check if parent type is correct.
            if (lAttributeDefinition.enforcedParentType) {
                if (!(this.mAttachedDeclaration instanceof lAttributeDefinition.enforcedParentType)) {
                    pContext.pushIncident(`Attribute "${lAttributeCst.name}" is not attached to a valid parent type.`, this);
                }
            }

            // Search for parameter definition that matches the given parameter count.
            let lParameterDefinition: Array<AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter> = new Array<AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter>();
            if (lAttributeDefinition.parameterTypes.length > 0) {
                // Find a parameter definition that matches the given parameter count.
                const lFoundParameterDefinition = lAttributeDefinition.parameterTypes.find(pEntry => pEntry.length === lAttributeCst.parameters.length);
                if (!lFoundParameterDefinition) {
                    pContext.pushIncident(`Attribute "${lAttributeCst.name}" has invalid number of parameters.`, this);
                    continue;
                }
                lParameterDefinition = lFoundParameterDefinition ?? [];
            }

            // Create parameter ASTs and append with the attribute name.
            const lValidatedParameters = this.validateParameter(pContext, lAttributeCst.name, lAttributeCst.parameters, lParameterDefinition);
            lAttributeListData.attributes.set(lAttributeCst.name as PgslAttributeName, lValidatedParameters);
        }

        return lAttributeListData;
    }

    /**
     * Read all attribute definitions.
     * 
     * @returns Dictionary of all valid attributes.
     */
    private readAttributeDefintions(): Dictionary<PgslAttributeName, AttributeDefinitionInformation> {
        const lAttributes: Dictionary<PgslAttributeName, AttributeDefinitionInformation> = new Dictionary<PgslAttributeName, AttributeDefinitionInformation>();

        // Function and declaration config.
        lAttributes.set(AttributeListAst.attributeNames.groupBinding, {
            enforcedParentType: VariableDeclarationAst,
            parameterTypes: [
                [{ values: [] }, { values: [] }]
            ]
        });
        lAttributes.set(AttributeListAst.attributeNames.accessMode, {
            enforcedParentType: VariableDeclarationAst,
            parameterTypes: [
                [{ values: ['read', 'write', 'read_write'] }] // TODO: Read from enum.
            ]
        });

        // Struct type.
        lAttributes.set(AttributeListAst.attributeNames.align, {
            enforcedParentType: StructPropertyDeclarationAst,
            parameterTypes: [
                [{ type: PgslNumericType.typeName.unsignedInteger, state: PgslValueFixedState.Constant }]
            ]
        });
        lAttributes.set(AttributeListAst.attributeNames.blendSource, {
            enforcedParentType: StructPropertyDeclarationAst,
            parameterTypes: [
                [{ type: PgslNumericType.typeName.unsignedInteger, state: PgslValueFixedState.Constant }] // Location output.
            ]
        });
        lAttributes.set(AttributeListAst.attributeNames.interpolate, {
            enforcedParentType: StructPropertyDeclarationAst,
            parameterTypes: [
                [{ values: ['perspective', 'linear', 'flat'] }],
                [{ values: ['perspective', 'linear', 'flat'] }, { values: ['center', 'centroid', 'sample', 'first', 'either'] }]
            ]
        });
        lAttributes.set(AttributeListAst.attributeNames.invariant, {
            enforcedParentType: StructPropertyDeclarationAst,
            parameterTypes: []
        });
        lAttributes.set(AttributeListAst.attributeNames.location, {
            enforcedParentType: StructPropertyDeclarationAst,
            parameterTypes: [
                [{ values: [] }]
            ]
        });
        lAttributes.set(AttributeListAst.attributeNames.size, {
            enforcedParentType: StructPropertyDeclarationAst,
            parameterTypes: [
                [{ type: PgslNumericType.typeName.unsignedInteger, state: PgslValueFixedState.Constant }]
            ]
        });

        // Entry points.
        lAttributes.set(AttributeListAst.attributeNames.vertex, {
            enforcedParentType: FunctionDeclarationAst,
            parameterTypes: []
        });
        lAttributes.set(AttributeListAst.attributeNames.fragment, {
            enforcedParentType: FunctionDeclarationAst,
            parameterTypes: []
        });
        lAttributes.set(AttributeListAst.attributeNames.compute, {
            enforcedParentType: FunctionDeclarationAst,
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
    };

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pContext - Validation trace to use.
     * @param pParameterSourceList - List of parameters to validate.
     * @param pValidationParameterList - List of parameter definitions to validate against.
     */
    private validateParameter(pContext: AbstractSyntaxTreeContext, pAttributeName: string, pParameterSourceList: Array<ExpressionCst>, pValidationParameterList: Array<AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter>): Array<IExpressionAst> {
        // Store validated parameters.
        const lValidatedParameters: Array<IExpressionAst> = new Array<IExpressionAst>();

        // Match every single template parameter.
        for (let lIndex = 0; lIndex < pValidationParameterList.length; lIndex++) {
            const lExpectedTemplateType: AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter = pValidationParameterList[lIndex];

            // Create expression AST from parameter CST.
            const lAttributeParameterAst: IExpressionAst = ExpressionAstBuilder.build(pParameterSourceList[lIndex], pContext);

            // Store validated parameter.
            lValidatedParameters.push(lAttributeParameterAst);

            // Read and get the actual attribute parameter.
            const lActualAttributeParameterType: IType = lAttributeParameterAst.data.resolveType;

            // Validate based on expected template type.
            if ('values' in lExpectedTemplateType) { // String or enum.
                // String parameter must be constants.
                if (lAttributeParameterAst.data.fixedState < PgslValueFixedState.Constant) {
                    pContext.pushIncident(`Attribute "${pAttributeName}" parameter ${lIndex} must be a constant expression.`, lAttributeParameterAst);
                    continue;
                }

                // Not a string parameter.
                if (!(lActualAttributeParameterType instanceof PgslStringType)) {
                    pContext.pushIncident(`Attribute "${pAttributeName}" parameter ${lIndex} must be a string.`, lAttributeParameterAst);
                    continue;
                }

                // Not a constant string parameter.
                if (typeof lAttributeParameterAst.data.constantValue !== 'string') {
                    pContext.pushIncident(`Attribute "${pAttributeName}" parameter ${lIndex} must be a constant string.`, lAttributeParameterAst);
                    continue;
                }

                // Check if parameter value matches one of the expected values, if any are defined.
                if (lExpectedTemplateType.values.length > 0 && !lExpectedTemplateType.values.includes(lAttributeParameterAst.data.constantValue)) {
                    pContext.pushIncident(`Attribute "${pAttributeName}" parameter ${lIndex} has an invalid value.`, lAttributeParameterAst);
                }
            } else if ('type' in lExpectedTemplateType) { // Number
                // Not a number parameter.
                if (!(lActualAttributeParameterType instanceof PgslNumericType)) {
                    pContext.pushIncident(`Attribute "${pAttributeName}" parameter ${lIndex} must be a number.`, lAttributeParameterAst);
                    continue;
                }

                // Check if parameter type matches expected type.
                if (!lActualAttributeParameterType.isImplicitCastableInto(new PgslNumericType(lExpectedTemplateType.type).process(pContext))) {
                    pContext.pushIncident(`Attribute "${pAttributeName}" parameter ${lIndex} must be of type ${lExpectedTemplateType.type}.`, lAttributeParameterAst);
                }

                // Check fixed state is same or higher than expected.
                if (lAttributeParameterAst.data.fixedState < lExpectedTemplateType.state) {
                    pContext.pushIncident(`Attribute "${pAttributeName}" parameter ${lIndex} has the wrong fixed state.`, lAttributeParameterAst);
                }
            }
        }

        return lValidatedParameters;
    }
}

export type PgslAttributeName = typeof AttributeListAst.attributeNames[keyof typeof AttributeListAst.attributeNames];

export type PgslAttributeListSyntaxTreeConstructorParameterAttribute = {
    name: string,
    parameter?: Array<IExpressionAst>;
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
    enforcedParentType?: AbstractSyntaxTreeConstructor;

    /**
     * Name: Valid parameter types.
     * Each entry in the outer array represents a valid parameter count.
     */
    parameterTypes: Array<
        Array<AttributeDefinitionNumberParameter | AttributeDefinitionStringParameter>
    >;
};

type AttributeListAstData = {
    attributes: Map<PgslAttributeName, Array<IExpressionAst>>;
};