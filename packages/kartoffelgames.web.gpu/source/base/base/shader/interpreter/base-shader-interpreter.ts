import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { BaseMemoryLayout } from '../../memory_layout/base-memory-layout';
import { ShaderFunction, ShaderInformation } from './shader-information';

export abstract class BaseShaderInterpreter {
    private readonly mShaderTypeAliases: Dictionary<string, ShaderTypeAlias>;
    private readonly mShaderTypes: Dictionary<string, ShaderTypeDefinition>;

    /**
     * Constructor.
     */
    public constructor() {
        // Setup all shader types.
        this.mShaderTypes = new Dictionary<string, ShaderTypeDefinition>();
        this.mShaderTypeAliases = new Dictionary<string, ShaderTypeAlias>();
        this.setupShaderTypes((pType: ShaderTypeDefinition) => {
            this.mShaderTypes.set(pType.name, pType);

            // Map all aliases of type.
            for (const lVariant of pType.variants) {
                // No aliases specified.
                if (!lVariant.aliases) {
                    continue;
                }

                // Map each alias with its generics.
                for (const lAlias of lVariant.aliases) {
                    this.mShaderTypeAliases.set(lAlias, {
                        type: pType.name,
                        generics: lVariant.generic ?? []
                    });
                }
            }
        });
    }

    /**
     * Interpret source code of shader.
     * @param pSourceCode - Shader source code.
     */
    public interpret(pSourceCode: string): ShaderInformation {
        // Read defintions.
        const lShaderFunctionDefinitionList: Array<ShaderFunctionDefintion> = this.fetchFunctionDefinitions(pSourceCode);
        const lShaderValueDefinitionList: Array<ShaderValueDefinition> = this.fetchValueDefinitions(pSourceCode);
        const lShaderStructDefinitionList: Array<ShaderStructDefinition> = this.fetchStructDefinitions(pSourceCode);

        // Map shader structs.
        const lShaderStructDefinitions: Dictionary<string, ShaderStructDefinition> = new Dictionary<string, ShaderStructDefinition>();
        for (const lStructDefinition of lShaderStructDefinitionList) {
            lShaderStructDefinitions.set(lStructDefinition.name, lStructDefinition);
        }

        // Meta data storages placeholders.
        const lShaderFunctions: Array<ShaderFunction> = this.convertFunctions(lShaderFunctionDefinitionList);
        const lShaderValue: Array<ShaderValue> = this.convertValues(lShaderValueDefinitionList);

        // Create new shader information.
        return new ShaderInformation({
            sourceCode: pSourceCode,
            bindings: this.readBindings(lShaderValue),
            shaderFunctions: lShaderFunctions
        });
    }

    /**
     * Create struct from value definition.
     * @param pValueDefinition - value definition.
     */
    protected structFromDefinition(pStructDefinition: ShaderStructDefinition): ShaderStruct {
        const lShaderStruct: ShaderStruct = {
            name: pStructDefinition.name,
            properties: new Array<ShaderValue>()
        };

        // Convert all properties to struct values.
        for (const lProperty of pStructDefinition.properies) {
            lShaderStruct.properties.push(this.valueFromDefinition(lProperty));
        }

        return lShaderStruct;
    }

    /**
     * Get type of type, alias or struct name
     * @param pTypeName - Type, alias or struct name.
     * @param pGenericNames - Generics of type. Only valid on type names.
     */
    protected typeFor(pTypeName: string, pGenericNames: Array<string> = [], pShaderStructs: Dictionary<string, ShaderStructDefinition>): ShaderType {
        // Search for regular type.
        if (this.mShaderTypes.has(pTypeName)) {
            const lRegularType: ShaderTypeDefinition = this.mShaderTypes.get(pTypeName)!;
            for (const lVariant of lRegularType.variants) {
                const lVariantGenerics: Array<string> = lVariant.generic ?? [];

                // Validate generics.
                if (lVariantGenerics.length !== pGenericNames.length) {
                    continue;
                }

                // Validate each generic value.
                let lGenericsMatches: boolean = true;
                for (let lIndex: number = 0; lIndex < lVariantGenerics.length; lIndex++) {
                    const lTargetGeneric: string = lVariantGenerics[lIndex];
                    const lSourceGeneric: string = pGenericNames[lIndex];

                    // Matches any on wildcard or strict match otherwise.
                    if (lTargetGeneric !== '*' && lTargetGeneric !== lSourceGeneric) {
                        lGenericsMatches = false;
                        break;
                    }
                }

                // Generics does not match. Search next variant.
                if (!lGenericsMatches) {
                    continue;
                }

                return {
                    typeName: lRegularType.name,
                    type: 'buildIn',
                    size: lVariant.size,
                    align: lVariant.align
                };
            }
        }

        // No gernics allows after this point.
        if (pGenericNames.length > 0) {
            throw new Exception(`No generics allowed for struct or alias types. Regular type "${pTypeName}<${pGenericNames.toString()}>" not found.`, this);
        }

        // Search alias type.
        if (this.mShaderTypeAliases.has(pTypeName)) {
            const lAliasType: ShaderTypeAlias = this.mShaderTypeAliases.get(pTypeName)!;
            return this.typeFor(lAliasType.type, lAliasType.generics, pShaderStructs);
        }

        // Search for struct.
        if (pShaderStructs.has(pTypeName)) {
            const lStructDefinition: ShaderStructDefinition = pShaderStructs.get(pTypeName)!;
            return {
                type: 'struct',
                struct: this.structFromDefinition(lStructDefinition)
            };
        }

        // Nothing found.
        throw new Exception(`Type "${pTypeName}" not found.`, this);
    }

    /**
     * Get visibility of global name.
     * @param pName - Name of a global. 
     */
    protected visibilityOf(pName: string, pShaderFunctions: Dictionary<string, ShaderFunction>): ComputeStage {
        let lComputeStage: ComputeStage = <ComputeStage>0;

        for (const lShaderFunction of this.searchEntryPointsOf(pName, new Set<string>(), pShaderFunctions)) {
            lComputeStage |= lShaderFunction.entryPoints;
        }

        return lComputeStage;
    }

    /**
     * Get all functions.
     * @param pSourceCode - Source code of shader.
     */
    private convertFunctions(pFunctionDefinitions: Array<ShaderFunctionDefintion>): Array<ShaderFunction> {
        return pFunctionDefinitions.map((pDefinition: ShaderFunctionDefintion) => { return this.functionFromDefinition(pDefinition); });
    }

    /**
     * Get all global values.
     * @param pSourceCode - Source code of shader.
     */
    private convertValues(pValueDefinitions: Array<ShaderValueDefinition>): Array<ShaderValue> {
        return pValueDefinitions.map((pDefinition: ShaderValueDefinition) => { return this.valueFromDefinition(pDefinition); });
    }

    /**
     * Fetch shader binds.
     * @param pSourceCode - Shader source code.
     */
    private readBindings(pShaderValueList: Array<ShaderValue>): Dictionary<number, Array<BaseMemoryLayout>> {
        const lBindings: Dictionary<number, Array<BaseMemoryLayout>> = new Dictionary<number, Array<BaseMemoryLayout>>();

        for (const lShaderValue of pShaderValueList) {
            // Skip all values without binding group.
            if (lShaderValue.group === null) {
                continue;
            }

            // Init new bind group.
            if (!lBindings.has(lShaderValue.group)) {
                lBindings.set(lShaderValue.group, new Array<BaseMemoryLayout>());
            }

            lBindings.get(lShaderValue.group)!.push(lShaderValue.value);
        }

        return lBindings;
    }

    /**
     * Search for all functions hat uses the global name.
     * @param pName - variable or function name.
     * @param pScannedNames - All already scanned names. Prevents recursion.
     */
    private searchEntryPointsOf(pName: string, pScannedNames: Set<string>, pShaderFunctions: Dictionary<string, ShaderFunction>): Array<ShaderFunction> {
        // Add current searched name to already scanned names.
        pScannedNames.add(pName);

        const lUsedFunctionList: Array<ShaderFunction> = new Array<ShaderFunction>();

        // Search all global names of all functions.
        for (const lShaderFunction of pShaderFunctions.values()) {
            for (const lGlobal of lShaderFunction.usedGlobals) {
                // Prevent endless recursion.
                if (pScannedNames.has(lGlobal)) {
                    continue;
                }

                // Further down the rabbithole. Search for 
                if (pShaderFunctions.has(lGlobal)) {
                    // Add found function to used function list.
                    lUsedFunctionList.push(pShaderFunctions.get(lGlobal)!);

                    // Recursive search for all functions that use this function.
                    lUsedFunctionList.push(...this.searchEntryPointsOf(lGlobal, pScannedNames, pShaderFunctions));
                }
            }
        }

        return [...new Set<ShaderFunction>(lUsedFunctionList)];
    }

    /**
     * Read all function definitions.
     * @param pSourceCode - Source code of shader.
     */
    protected abstract fetchFunctionDefinitions(pSourceCode: string): Array<ShaderFunctionDefintion>;

    /**
     * Read all global shader values.
     * @param pSourceCode - Source code of shader.
     */
    protected abstract fetchStructDefinitions(pSourceCode: string): Array<ShaderStructDefinition>;

    /**
     * Read all global shader values.
     * @param pSourceCode - Source code of shader.
     */
    protected abstract fetchValueDefinitions(pSourceCode: string): Array<ShaderValueDefinition>;

    /**
     * Convert function definition.
     * @param pDefinition - Function definition.
     */
    protected abstract functionFromDefinition(pDefinition: ShaderFunctionDefintion): ShaderFunction;

    /**
     * Setup all shader types.
     * @param pAddType - Add shader type callback.
     */
    protected abstract setupShaderTypes(pAddType: (pType: ShaderTypeDefinition) => void): void;

    /**
     * Create memory layout from value definition.
     * @param pValueDefinition - value definition.
     */
    protected abstract valueFromDefinition(pValueDefinition: ShaderValueDefinition): ShaderValue;
}

/*
 * Definitions.
 */

export type ShaderValueDefinition = {
    name: string;
    type: ShaderType;
    typeGenerics: Array<string>;
    attachments: Record<string, string>;
};

export type ShaderFunctionDefintion = {
    attachments: Record<string, string>;
    name: string;
    returnType: ShaderValueDefinition;
    parameter: Array<ShaderValueDefinition>;
    body: string;
};

export type ShaderStructDefinition = {
    name: string,
    properies: Array<ShaderValueDefinition>;
};

export type ShaderTypeDefinition = {
    name: string,
    variants: Array<{
        aliases?: Array<string>;
        size: number;
        align: number;
        generic?: Array<string>;
    }>;
};

/*
 * Types.
 */

export type ShaderType = {
    type: 'buildIn';
    typeName: string;
    size: number;
    align: number;
} | {
    type: 'struct';
    struct: ShaderStruct;
};

type ShaderTypeAlias = {
    type: string;
    generics: Array<string>;
};

/*
 * Values.
 */

export type ShaderValue = {
    value: BaseMemoryLayout;
    group: number | null;
};

export type ShaderStruct = {
    name: string;
    properties: Array<ShaderValue>;
};