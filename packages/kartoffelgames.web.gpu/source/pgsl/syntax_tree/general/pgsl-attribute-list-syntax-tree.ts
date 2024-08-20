import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslEnumValueExpressionSyntaxTree } from '../expression/single_value/pgsl-enum-value-expression-syntax-tree';
import { PgslVariableNameExpressionSyntaxTree } from '../expression/single_value/pgsl-variable-name-expression-syntax-tree';

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
        lAttributes.set('group_binding', [
            ['String', 'String']
        ]);
        lAttributes.set('access_mode', [
            ['AccessMode']
        ]);
        lAttributes.set('workgroup_size', [
            ['Expression'],
            ['Expression', 'Expression'],
            ['Expression', 'Expression', 'Expression']
        ]);

        // Struct type.
        lAttributes.set('align', [
            ['Expression']
        ]);
        lAttributes.set('blend_src', [
            ['Expression']
        ]);
        lAttributes.set('builtin', [
            ['BuildIn']
        ]);
        lAttributes.set('interpolate', [
            ['InterpolationType'],
            ['InterpolationType', 'InterpolationSampling']
        ]);
        lAttributes.set('invariant', []);
        lAttributes.set('location', [
            ['Expression']
        ]);
        lAttributes.set('size', [
            ['Expression']
        ]);

        // Entry points.
        lAttributes.set('vertex', []);
        lAttributes.set('fragment', []);
        lAttributes.set('compute', []);

        return lAttributes;
    })();

    private readonly mAttributes: Dictionary<string, Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> | string>>;

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
        this.mAttributes = new Dictionary<string, Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> | string>>();

        // Convert and add each attribute to list.
        for (const lAttribute of pData.attributes) {
            // Validate validity of name.
            if (!PgslAttributeListSyntaxTree.mValidAttributes.has(lAttribute.name)) {
                // TODO: Allow own attribute names but ignore it.

                throw new Exception(`Invalid attribute "${lAttribute}" used.`, this);
            }

            // Validate existance.
            if (this.mAttributes.has(lAttribute.name)) {
                throw new Exception(`Attribute "${lAttribute}" already exists for this entity.`, this);
            }

            // Validate and convert parameter.
            const lParameterList: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> | string> | null = this.convertParameter(lAttribute.parameter, PgslAttributeListSyntaxTree.mValidAttributes.get(lAttribute.name)!);
            if (!lParameterList) {
                throw new Exception(`Attribute "${lAttribute.name}" has invalid parameters.`, this);
            }

            // Set attribute.
            this.mAttributes.set(lAttribute.name, lParameterList);
        }
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Maybe the parent can set allowed attributes. 
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    private convertParameter(pParameterSourceList: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>, pValidationList: Array<Array<AttributeParameterType>>): Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> | string> | null {
        // Attribute doesn needs parameter.
        if (pParameterSourceList.length === 0 && pValidationList.length === 0) {
            return new Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> | string>();
        }

        // Validate all templates.
        for (const lValidation of pValidationList) {
            // Parameter length not matched.
            if (pParameterSourceList.length !== lValidation.length) {
                continue;
            }

            // Match every single template parameter.
            const lConvertedParameterList: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> | string> = new Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> | string>();
            CONVERT_LOOP: for (let lIndex = 0; lIndex < lValidation.length; lIndex++) {
                const lExpectedTemplateType: 'Expression' | 'String' | string = lValidation[lIndex];
                const lActualTemplateParameter: BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> = pParameterSourceList[lIndex];

                let lConvertedParameter: BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> | string;
                switch (lExpectedTemplateType) {
                    case 'Expression': {
                        lConvertedParameter = lActualTemplateParameter;
                        break;
                    }
                    case 'String': {
                        // Not a string parameter.
                        if (!(lActualTemplateParameter instanceof PgslVariableNameExpressionSyntaxTree)) {
                            break CONVERT_LOOP;
                        }

                        lConvertedParameter = lActualTemplateParameter.name;
                        break;
                    }
                    default: { // Enum
                        // Not a string parameter.
                        if (!(lActualTemplateParameter instanceof PgslEnumValueExpressionSyntaxTree)) {
                            break CONVERT_LOOP;
                        }

                        // Convert enum value and validate if the right enum was used.
                        if (lActualTemplateParameter.name !== lExpectedTemplateType) {
                            break CONVERT_LOOP;
                        }

                        lConvertedParameter = lActualTemplateParameter;
                        break;
                    }
                }

                lConvertedParameterList.push(lConvertedParameter);
            }

            // All parameter were converted, so they are all valid.
            if (lConvertedParameterList.length === lValidation.length) {
                return lConvertedParameterList;
            }
        }

        return null;
    }
}

type PgslAttributeListSyntaxTreeStructureData = {
    attributes: Array<{
        name: string,
        parameter: Array<BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>>;
    }>;
};

type AttributeParameterType = 'Expression' | 'String' | string;
type AttributeDefinitionInformation = Array<Array<AttributeParameterType>>;