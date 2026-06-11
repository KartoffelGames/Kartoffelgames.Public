import { PotatnoProjectTypesDefinition } from '../../../source/project/potatno-project-types-definition.ts';

/**
 * Project type configuration for the PotatnoCode test project.
 */
export class PotatnoTestProjectTypesDefinition extends PotatnoProjectTypesDefinition<PotatnoTestProjectTypesDefinitionValueMap> {
    /**
     * Create the PotatnoCode test project type configuration.
     */
    public constructor() {
        super({
            boolean: {
                default: {
                    string: ['false'],
                    value: false
                },
                convert: (pValues: Array<string>): string => {
                    const lBooleanString: string = pValues[0].toLowerCase();
                    if (lBooleanString === 'true') {
                        return 'true';
                    }

                    if (lBooleanString === 'false') {
                        return 'false';
                    }

                    throw new Error(`Invalid boolean: "${pValues[0]}"`);
                },
                inputs: [
                    { name: 'value', type: 'boolean' }
                ]
            },
            number: {
                default: {
                    string: ['0'],
                    value: 0
                },
                convert: (pValues: Array<string>): string => {
                    const lNumberString: string = pValues[0];
                    const lNumber: number = parseFloat(lNumberString);
                    if (isNaN(lNumber)) {
                        throw new Error(`Invalid number: "${lNumberString}"`);
                    }
                    return lNumber.toString();
                },
                inputs: [
                    { name: 'value', type: 'number' }
                ]
            },
            string: {
                default: {
                    string: [''],
                    value: ''
                },
                convert: (pValues: Array<string>): string => {
                    return JSON.stringify(pValues[0]);
                },
                inputs: [
                    { name: 'value', type: 'string' }
                ]
            }
        });
    }
}

type PotatnoTestProjectTypesDefinitionValueMap = {
    boolean: boolean;
    number: number;
    string: string;
};
