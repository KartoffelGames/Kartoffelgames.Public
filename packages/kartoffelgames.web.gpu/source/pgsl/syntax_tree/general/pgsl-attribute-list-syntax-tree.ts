import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslEnumValueExpressionSyntaxTree } from '../expression/single_value/pgsl-enum-value-expression-syntax-tree';
import { PgslStringValueExpressionSyntaxTree } from '../expression/single_value/pgsl-string-value-expression-syntax-tree';

/**
 * Generic attributre list.
 */
export class PgslAttributeListSyntaxTree extends BasePgslSyntaxTree<PgslAttributeListSyntaxTreeStructureData> {
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
            [['perspective','linear','flat']],
            [['perspective','linear','flat'], ['centroid','sample','first','either']]
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

    private readonly mAttributes: Dictionary<string, Array<BasePgslExpressionSyntaxTree>>;

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslAttributeListSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mAttributes = new Dictionary<string, Array<BasePgslExpressionSyntaxTree>>();

        // Convert and add each attribute to list.
        for (const lAttribute of pData.attributes) {
            // Validate existance.
            if (this.mAttributes.has(lAttribute.name)) {
                throw new Exception(`Attribute "${lAttribute}" already exists for this entity.`, this);
            }

            // Allow own attribute names but ignore it.
            if (!PgslAttributeListSyntaxTree.mValidAttributes.has(lAttribute.name)) {
                this.mAttributes.set(lAttribute.name, lAttribute.parameter);
                continue;
            }


            // Set attribute.
            this.mAttributes.set(lAttribute.name, lAttribute.parameter);
        }
    }

    public getAttribute(pName: string): Array<BasePgslExpressionSyntaxTree> {
        // Try to read attribute parameters.
        const lAttributeParameter: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>> | undefined = this.mAttributes.get(pName);
        if (!lAttributeParameter) {
            throw new Exception(`Attribute "${pName}" is not defined for the declaration.`, this);
        }

        return lAttributeParameter;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Only const expressions allowed.
        for (const [lAttributeName, lAttributeParameter] of this.mAttributes) {
            for (const lParameter of lAttributeParameter) {
                if (!lParameter.isConstant) {
                    throw new Exception(`Attribute "${lAttributeName}" contains a none constant parameter.`, this);
                }
            }

            // Validate parameters when it is a build in attribute.
            if (PgslAttributeListSyntaxTree.mValidAttributes.has(lAttributeName)) {
                if (!this.validateParameter(lAttributeParameter, PgslAttributeListSyntaxTree.mValidAttributes.get(lAttributeName)!)) {
                    throw new Exception(`Attribute "${lAttributeName}" has invalid parameters.`, this);
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

type PgslAttributeListSyntaxTreeStructureData = {
    attributes: Array<{
        name: string,
        parameter: Array<BasePgslExpressionSyntaxTree>;
    }>;
};

type AttributeParameterType = 'Expression' | 'String' | Array<string>;
type AttributeDefinitionInformation = Array<Array<AttributeParameterType>>;