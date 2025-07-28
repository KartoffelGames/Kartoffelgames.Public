import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { type BasePgslExpressionSyntaxTree, PgslValueFixedState, PgslExpressionSyntaxTreeValidationAttachment } from '../expression/base-pgsl-expression-syntax-tree.ts';
import { PgslEnumValueExpressionSyntaxTree } from '../expression/single_value/pgsl-enum-value-expression-syntax-tree.ts';
import { PgslStringValueExpressionSyntaxTree } from '../expression/single_value/pgsl-string-value-expression-syntax-tree.ts';
import type { PgslSyntaxTreeValidationTrace } from '../pgsl-syntax-tree-validation-trace.ts';

/**
 * Generic attribute list.
 */
export class PgslAttributeListSyntaxTree extends BasePgslSyntaxTree {
    /**
     * All valid attributes.
     */
    private static readonly mValidAttributes: Dictionary<string, AttributeDefinitionInformation> = (() => {
        const lAttributes: Dictionary<string, AttributeDefinitionInformation> = new Dictionary<string, AttributeDefinitionInformation>();

        // Function and declaration config.
        lAttributes.set('GroupBinding', [
            ['String', 'String']
        ]);
        lAttributes.set('AccessMode', [
            [['read', 'write', 'read_write']]
        ]);
        lAttributes.set('WorkgroupSize', [
            ['Expression'],
            ['Expression', 'Expression'],
            ['Expression', 'Expression', 'Expression']
        ]);

        // Struct type.
        lAttributes.set('Align', [
            ['Expression']
        ]);
        lAttributes.set('BlendSource', [
            ['Expression']
        ]);
        lAttributes.set('Interpolate', [
            [['perspective', 'linear', 'flat']],
            [['perspective', 'linear', 'flat'], ['centroid', 'sample', 'first', 'either']]
        ]);

        lAttributes.set('Invariant', []);
        lAttributes.set('location', [
            ['Expression']
        ]);
        lAttributes.set('Size', [
            ['Expression']
        ]);

        // Entry points.
        lAttributes.set('Vertex', []);
        lAttributes.set('Fragment', []);
        lAttributes.set('Compute', []);

        return lAttributes;
    })();

    private readonly mAttributeDefinitionList: Dictionary<string, Array<BasePgslExpressionSyntaxTree>>;

    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     * @param pAttributes - Attribute list.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pAttributes: Array<PgslAttributeListSyntaxTreeConstructorParameterAttribute>) {
        super(pMeta);

        // Init empty attribute list.
        this.mAttributeDefinitionList = new Dictionary<string, Array<BasePgslExpressionSyntaxTree>>();

        // Convert and add each attribute to list.
        for (const lAttribute of pAttributes) {
            const lAttributeParameterList: Array<BasePgslExpressionSyntaxTree> = lAttribute.parameter ?? [];
            // Add attribute to syntax tree.
            this.appendChild(...lAttributeParameterList);

            // Allow own attribute names but ignore it.
            this.mAttributeDefinitionList.set(lAttribute.name, lAttributeParameterList);
        }
    }

    /**
     * Get all parameter of attributes by name.
     * 
     * @param pName - Attribute name.
     * 
     * @returns all attribute parameters 
     */
    public getAttribute(pName: string): Array<BasePgslExpressionSyntaxTree> {
        // Try to read attribute parameters.
        const lAttributeParameter: Array<BasePgslExpressionSyntaxTree> | undefined = this.mAttributeDefinitionList.get(pName);
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
            // Transpile attribute name.
            lResult += `@${lAttributeName}(`;

            // Transpile all parameters.
            lResult += lAttributeParameter
                .map((pParameter: BasePgslExpressionSyntaxTree) => {
                    return pParameter.transpile();
                })
                .join(', ');

            lResult += ')';
        }

        // Return result.
        return lResult;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pScope: PgslSyntaxTreeValidationTrace): void {
        // Only const expressions allowed.
        for (const [lAttributeName, lAttributeParameter] of this.mAttributeDefinitionList) {
            for (const lParameter of lAttributeParameter) {
                // Validate parameter as standalone expression.
                lParameter.validate(pScope);

                const lParameterAttachment: PgslExpressionSyntaxTreeValidationAttachment = pScope.getAttachment(lParameter);

                // Expression must be fixed at shader creation.
                if (lParameterAttachment.fixedState < PgslValueFixedState.ShaderCreationFixed) {
                    pScope.pushError(`Attribute "${lAttributeName}" contains a none shader creation fixed parameter.`, this.meta, this);
                }
            }

            // Validate parameters when it is a build in attribute.
            if (PgslAttributeListSyntaxTree.mValidAttributes.has(lAttributeName)) {
                if (!this.validateParameter(lAttributeParameter, PgslAttributeListSyntaxTree.mValidAttributes.get(lAttributeName)!)) {
                    pScope.pushError(`Attribute "${lAttributeName}" has invalid parameters.`, this.meta, this);
                }
            }
        }
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    private validateParameter(pParameterSourceList: Array<BasePgslExpressionSyntaxTree>, pValidationParameterList: Array<Array<AttributeParameterType>>): boolean {
        // Attribute doesn needs parameter.
        if (pParameterSourceList.length === 0 && pValidationParameterList.length === 0) {
            return true;
        }

        // Validate all templates.
        for (const lValidationParameter of pValidationParameterList) {
            // Parameter length not matched.
            if (pParameterSourceList.length !== lValidationParameter.length) {
                continue;
            }

            // Match every single template parameter.
            let lValidParameterCount: number = 0;
            CONVERT_LOOP: for (let lIndex = 0; lIndex < lValidationParameter.length; lIndex++) {
                const lExpectedTemplateType: 'Expression' | 'String' | Array<string> = lValidationParameter[lIndex];

                // Convert enum to literal or string. expression.
                let lActualAttributeParameter: BasePgslExpressionSyntaxTree = pParameterSourceList[lIndex];
                if (lActualAttributeParameter instanceof PgslEnumValueExpressionSyntaxTree) {
                    lActualAttributeParameter = lActualAttributeParameter.value;
                }

                switch (lExpectedTemplateType) {
                    case 'Expression': {
                        break;
                    }
                    case 'String': {
                        // Not a string parameter.
                        if (!(lActualAttributeParameter instanceof PgslStringValueExpressionSyntaxTree)) {
                            break CONVERT_LOOP;
                        }

                        break;
                    }
                    default: { // Enum
                        // Not a string parameter.
                        if (!(lActualAttributeParameter instanceof PgslStringValueExpressionSyntaxTree)) {
                            break CONVERT_LOOP;
                        }

                        // Convert enum value and validate if the right enum was used.
                        if (!lExpectedTemplateType.includes(lActualAttributeParameter.value)) {
                            break CONVERT_LOOP;
                        }

                        break;
                    }
                }

                lValidParameterCount++;
            }

            // All parameter were converted, so they are all valid.
            if (lValidParameterCount === lValidationParameter.length) {
                return true;
            }
        }

        return false;
    }
}

type PgslAttributeListSyntaxTreeSetupData = {
    attributes: Dictionary<string, Array<BasePgslExpressionSyntaxTree>>;
};

export type PgslAttributeListSyntaxTreeConstructorParameterAttribute = {
    name: string,
    parameter?: Array<BasePgslExpressionSyntaxTree>;
};

export type PgslAttributeListSyntaxTreeAttribute = {
    name: string,
    parameter: Array<BasePgslExpressionSyntaxTree>;
};

type AttributeParameterType = 'Expression' | 'String' | Array<string>;
type AttributeDefinitionInformation = Array<Array<AttributeParameterType>>;