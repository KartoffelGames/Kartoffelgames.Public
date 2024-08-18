import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../base-pgsl-syntax-tree';
import { PgslExpressionSyntaxTree, PgslExpressionSyntaxTreeFactory, PgslExpressionSyntaxTreeStructureData } from '../expression/pgsl-expression-syntax-tree-factory';
import { PgslVariableNameExpressionSyntaxTreeStructureData } from '../expression/variable/pgsl-variable-name-expression-syntax-tree';
import { PgslEnumValueExpressionSyntaxTree, PgslEnumValueExpressionSyntaxTreeStructureData } from '../expression/variable/pgsl-enum-value-expression-syntax-tree';

/**
 * Generic attributre list.
 */
export class PgslAttributeListSyntaxTree extends BasePgslSyntaxTree<PgslAttributeListSyntaxTreeStructureData['meta']['type'], PgslAttributeListSyntaxTreeStructureData['data']> {
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

    private readonly mAttributes: Dictionary<string, Array<PgslExpressionSyntaxTree | string>>;

    /**
     * Constructor.
     */
    public constructor() {
        super('General-AttributeList');

        this.mAttributes = new Dictionary<string, Array<PgslExpressionSyntaxTree | string>>();
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslAttributeListSyntaxTreeStructureData['data']): void {
        // Validate parameter types.
        const lConvertParameter = (pParameterSourceList: Array<PgslExpressionSyntaxTreeStructureData>, pValidationList: Array<Array<AttributeParameterType>>): Array<PgslExpressionSyntaxTree | string> | null => {
            // Attribute doesn needs parameter.
            if (pParameterSourceList.length === 0 && pValidationList.length === 0) {
                return new Array<PgslExpressionSyntaxTree | string>();
            }

            // Validate all templates.
            for (const lValidation of pValidationList) {
                // Parameter length not matched.
                if (pParameterSourceList.length !== lValidation.length) {
                    continue;
                }

                // Match every single template parameter.
                const lConvertedParameterList: Array<PgslExpressionSyntaxTree | string> = new Array<PgslExpressionSyntaxTree | string>();
                CONVERT_LOOP: for (let lIndex = 0; lIndex < lValidation.length; lIndex++) {
                    const lExpectedTemplateType: 'Expression' | 'String' | string = lValidation[lIndex];
                    const lActualTemplateParameter: PgslExpressionSyntaxTreeStructureData = pParameterSourceList[lIndex];

                    let lConvertedParameter: PgslExpressionSyntaxTree | string;
                    switch (lExpectedTemplateType) {
                        case 'Expression': {
                            lConvertedParameter = PgslExpressionSyntaxTreeFactory.createFrom(lActualTemplateParameter, this);
                            break;
                        }
                        case 'String': {
                            // Not a string parameter.
                            if (lActualTemplateParameter.meta.type !== 'Expression-VariableName') {
                                break CONVERT_LOOP;
                            }

                            lConvertedParameter = (<PgslVariableNameExpressionSyntaxTreeStructureData>lActualTemplateParameter).data.name;
                            break;
                        }
                        default: { // Enum
                            // Not a string parameter.
                            if (lActualTemplateParameter.meta.type !== 'Expression-EnumValue') {
                                break CONVERT_LOOP;
                            }

                            // Convert enum value and validate if the right enum was used.
                            const lEnumSyntaxTree: PgslEnumValueExpressionSyntaxTree = new PgslEnumValueExpressionSyntaxTree().applyDataStructure(lActualTemplateParameter as PgslEnumValueExpressionSyntaxTreeStructureData, this);
                            if (lEnumSyntaxTree.name !== lExpectedTemplateType) {
                                break CONVERT_LOOP;
                            }

                            lConvertedParameter = lEnumSyntaxTree;
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
        };

        // Convert and add each attribute to list.
        for (const lAttribute of pData.attributes) {
            // Validate validity of name.
            if (!PgslAttributeListSyntaxTree.mValidAttributes.has(lAttribute.name)) {
                throw new Exception(`Invalid attribute "${lAttribute}" used.`, this);
            }

            // Validate existance.
            if (this.mAttributes.has(lAttribute.name)) {
                throw new Exception(`Attribute "${lAttribute}" already exists for this entity.`, this);
            }

            // Validate and convert parameter.
            const lParameterList: Array<PgslExpressionSyntaxTree | string> | null = lConvertParameter(lAttribute.parameter, PgslAttributeListSyntaxTree.mValidAttributes.get(lAttribute.name)!);
            if (!lParameterList) {
                throw new Exception(`Attribute "${lAttribute.name}" has invalid parameters.`, this);
            }

            // Set attribute.
            this.mAttributes.set(lAttribute.name, lParameterList);
        }
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslAttributeListSyntaxTreeStructureData['data'] {
        return {
            attributes: this.mAttributes.map((pKey: string, pValue: Array<PgslExpressionSyntaxTree | string>) => {
                return {
                    name: pKey,
                    parameter: pValue.map((pParameter) => {
                        // When type is string, then export it as variable expression.
                        if (typeof pParameter === 'string') {
                            return {
                                meta: {
                                    type: 'Expression-VariableName', file: '<UNTRACEABLE>',
                                    position: {
                                        start: { column: 0, line: 0 },
                                        end: { column: 0, line: 0 }
                                    }
                                },
                                data: {
                                    name: pParameter
                                }
                            };
                        }

                        return pParameter.retrieveDataStructure();
                    })
                };
            })
        };
    }
}

export type PgslAttributeListSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'General-AttributeList', {
    attributes: Array<{
        name: string,
        parameter: Array<PgslExpressionSyntaxTreeStructureData>;
    }>;
}>;

type AttributeParameterType = 'Expression' | 'String' | string;
type AttributeDefinitionInformation = Array<Array<AttributeParameterType>>;