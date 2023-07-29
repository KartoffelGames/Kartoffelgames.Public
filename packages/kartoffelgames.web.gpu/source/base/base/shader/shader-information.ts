import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { GpuDependent } from '../gpu/gpu-dependent';
import { GpuTypes } from '../gpu/gpu-device';

export abstract class ShaderInformation<TGpuTypes extends GpuTypes> extends GpuDependent<TGpuTypes> {
    private readonly mBindings: Dictionary<number, Array<TGpuTypes['memoryLayout']>>;
    private readonly mEntryPoints: Dictionary<ComputeStage, ShaderFunction<TGpuTypes>>;
    private readonly mShaderFunctions: Dictionary<string, ShaderFunction<TGpuTypes>>;
    private readonly mShaderStructDefinitions: Dictionary<string, ShaderStructDefinition<TGpuTypes>>;
    private readonly mShaderTypeAliases: Dictionary<string, ShaderTypeAlias>;
    private readonly mShaderTypes: Dictionary<string, ShaderTypeDefinition>;
    private readonly mShaderValue: Dictionary<string, ShaderValue<TGpuTypes>>;
    private readonly mSourceCode: string;

    /**
     * Shader bindings. Grouped by group.
     */
    public get bindings(): Map<number, Array<TGpuTypes['memoryLayout']>> {
        return this.mBindings;
    }

    /**
     * Shader entry points.
     */
    public get entryPoints(): Map<ComputeStage, ShaderFunction<TGpuTypes>> {
        return this.mEntryPoints;
    }

    /**
     * Shader source code.
     */
    public get source(): string {
        return this.mSourceCode;
    }

    /**
     * Constructor.
     * @param pSourceCode - Shader source code.
     */
    public constructor(pGpu: TGpuTypes['gpuDevice'], pSourceCode: string) {
        super(pGpu);

        this.mSourceCode = pSourceCode;

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

        // Read defintions.
        const lShaderFunctionDefinitionList: Array<ShaderFunctionDefintion<TGpuTypes>> = this.fetchFunctionDefinitions(pSourceCode);
        const lShaderValueDefinitionList: Array<ShaderValueDefinition<TGpuTypes>> = this.fetchValueDefinitions(pSourceCode);
        const lShaderStructDefinitionList: Array<ShaderStructDefinition<TGpuTypes>> = this.fetchStructDefinitions(pSourceCode);

        // Map shader structs.
        this.mShaderStructDefinitions = new Dictionary<string, ShaderStructDefinition<TGpuTypes>>();
        for (const lStructDefinition of lShaderStructDefinitionList) {
            this.mShaderStructDefinitions.set(lStructDefinition.name, lStructDefinition);
        }

        // Meta data storages placeholders.
        this.mShaderFunctions = this.convertFunctions(lShaderFunctionDefinitionList);
        this.mShaderValue = this.convertValues(lShaderValueDefinitionList);

        // Set entry point and bindings.
        this.mEntryPoints = this.readEntryPoints();
        this.mBindings = this.readBindings();
    }

    /**
     * Create struct from value definition.
     * @param pValueDefinition - value definition.
     */
    protected structFromDefinition(pStructDefinition: ShaderStructDefinition<TGpuTypes>): ShaderStruct<TGpuTypes> {
        const lShaderStruct: ShaderStruct<TGpuTypes> = {
            name: pStructDefinition.name,
            properties: new Array<ShaderValue<TGpuTypes>>()
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
    protected typeFor(pTypeName: string, pGenericNames: Array<string> = []): ShaderType<TGpuTypes> {
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
            return this.typeFor(lAliasType.type, lAliasType.generics);
        }

        // Search for struct.
        if (this.mShaderStructDefinitions.has(pTypeName)) {
            const lStructDefinition: ShaderStructDefinition<TGpuTypes> = this.mShaderStructDefinitions.get(pTypeName)!;
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
    protected visibilityOf(pName: string): ComputeStage {
        let lComputeStage: ComputeStage = <ComputeStage>0;

        for (const lShaderFunction of this.searchEntryPointsOf(pName, new Set<string>())) {
            lComputeStage |= lShaderFunction.tag;
        }

        return lComputeStage;
    }

    /**
     * Get all functions.
     * @param pSourceCode - Source code of shader.
     */
    private convertFunctions(pFunctionDefinitions: Array<ShaderFunctionDefintion<TGpuTypes>>): Dictionary<string, ShaderFunction<TGpuTypes>> {
        const lShaderFunctions: Dictionary<string, ShaderFunction<TGpuTypes>> = new Dictionary<string, ShaderFunction<TGpuTypes>>();
        for (const lDefnition of pFunctionDefinitions) {
            const lShaderFunction: ShaderFunction<TGpuTypes> = this.functionFromDefinition(lDefnition);
            lShaderFunctions.set(lShaderFunction.name, lShaderFunction);
        }

        return lShaderFunctions;
    }

    /**
     * Get all global values.
     * @param pSourceCode - Source code of shader.
     */
    private convertValues(pValueDefinitions: Array<ShaderValueDefinition<TGpuTypes>>): Dictionary<string, ShaderValue<TGpuTypes>> {
        const lShaderValues: Dictionary<string, ShaderValue<TGpuTypes>> = new Dictionary<string, ShaderValue<TGpuTypes>>();
        for (const lDefnition of pValueDefinitions) {
            const lShaderValue: ShaderValue<TGpuTypes> = this.valueFromDefinition(lDefnition);
            lShaderValues.set(lShaderValue.name, lShaderValue);
        }

        return lShaderValues;
    }

    /**
     * Fetch shader binds.
     * @param pSourceCode - Shader source code.
     */
    private readBindings(): Dictionary<number, Array<TGpuTypes['memoryLayout']>> {
        const lBindings: Dictionary<number, Array<TGpuTypes['memoryLayout']>> = new Dictionary<number, Array<TGpuTypes['memoryLayout']>>();

        for (const lShaderValue of this.mShaderValue.values()) {
            // Skip all values without binding group.
            if (lShaderValue.group === null) {
                continue;
            }

            // Init new bind group.
            if (!lBindings.has(lShaderValue.group)) {
                lBindings.set(lShaderValue.group, new Array<TGpuTypes['memoryLayout']>());
            }

            lBindings.get(lShaderValue.group)!.push(lShaderValue.value);
        }

        return lBindings;
    }

    /**
     * Read entry points from crawled shader functions.
     */
    private readEntryPoints(): Dictionary<ComputeStage, ShaderFunction<TGpuTypes>> {
        const lEntryPoints: Dictionary<ComputeStage, ShaderFunction<TGpuTypes>> = new Dictionary<ComputeStage, ShaderFunction<TGpuTypes>>();

        // Map shader function to entry point by function tags.
        for (const lShaderFunction of this.mShaderFunctions.values()) {
            if ((lShaderFunction.tag & ComputeStage.Compute) === ComputeStage.Compute) {
                lEntryPoints.set(ComputeStage.Compute, lShaderFunction);
            }
            if ((lShaderFunction.tag & ComputeStage.Vertex) === ComputeStage.Vertex) {
                lEntryPoints.set(ComputeStage.Vertex, lShaderFunction);
            }
            if ((lShaderFunction.tag & ComputeStage.Fragment) === ComputeStage.Fragment) {
                lEntryPoints.set(ComputeStage.Fragment, lShaderFunction);
            }
        }

        return lEntryPoints;
    }

    /**
     * Search for all functions hat uses the global name.
     * @param pName - variable or function name.
     * @param pScannedNames - All already scanned names. Prevents recursion.
     */
    private searchEntryPointsOf(pName: string, pScannedNames: Set<string>): Array<ShaderFunction<TGpuTypes>> {
        // Add current searched name to already scanned names.
        pScannedNames.add(pName);

        const lUsedFunctionList: Array<ShaderFunction<TGpuTypes>> = new Array<ShaderFunction<TGpuTypes>>();

        // Search all global names of all functions.
        for (const lShaderFunction of this.mShaderFunctions.values()) {
            for (const lGlobal of lShaderFunction.usedGlobals) {
                // Prevent endless recursion.
                if (pScannedNames.has(lGlobal)) {
                    continue;
                }

                // Further down the rabbithole. Search for 
                if (this.mShaderFunctions.has(lGlobal)) {
                    // Add found function to used function list.
                    lUsedFunctionList.push(this.mShaderFunctions.get(lGlobal)!);

                    // Recursive search for all functions that use this function.
                    lUsedFunctionList.push(...this.searchEntryPointsOf(lGlobal, pScannedNames));
                }
            }
        }

        return [...new Set<ShaderFunction<TGpuTypes>>(lUsedFunctionList)];
    }

    /**
     * Read all function definitions.
     * @param pSourceCode - Source code of shader.
     */
    protected abstract fetchFunctionDefinitions(pSourceCode: string): Array<ShaderFunctionDefintion<TGpuTypes>>;

    /**
     * Read all global shader values.
     * @param pSourceCode - Source code of shader.
     */
    protected abstract fetchStructDefinitions(pSourceCode: string): Array<ShaderStructDefinition<TGpuTypes>>;

    /**
     * Read all global shader values.
     * @param pSourceCode - Source code of shader.
     */
    protected abstract fetchValueDefinitions(pSourceCode: string): Array<ShaderValueDefinition<TGpuTypes>>;

    /**
     * Convert function definition.
     * @param pDefinition - Function definition.
     */
    protected abstract functionFromDefinition(pDefinition: ShaderFunctionDefintion<TGpuTypes>): ShaderFunction<TGpuTypes>;

    /**
     * Setup all shader types.
     * @param pAddType - Add shader type callback.
     */
    protected abstract setupShaderTypes(pAddType: (pType: ShaderTypeDefinition) => void): void;

    /**
     * Create memory layout from value definition.
     * @param pValueDefinition - value definition.
     */
    protected abstract valueFromDefinition(pValueDefinition: ShaderValueDefinition<TGpuTypes>): ShaderValue<TGpuTypes>;
}

/*
 * Definitions.
 */

export type ShaderValueDefinition<TGpuTypes extends GpuTypes> = {
    name: string;
    type: ShaderType<TGpuTypes>;
    typeGenerics: Array<string>;
    attachments: Record<string, string>;
};

export type ShaderFunctionDefintion<TGpuTypes extends GpuTypes> = {
    attachments: Record<string, string>;
    name: string;
    returnType: ShaderValueDefinition<TGpuTypes>;
    parameter: Array<ShaderValueDefinition<TGpuTypes>>;
    body: string;
};

export type ShaderStructDefinition<TGpuTypes extends GpuTypes> = {
    name: string,
    properies: Array<ShaderValueDefinition<TGpuTypes>>;
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
 * Values.
 */

export type ShaderValue<TGpuTypes extends GpuTypes> = {
    name: string,
    value: TGpuTypes['memoryLayout'];
    group: number | null;
};

export type ShaderFunction<TGpuTypes extends GpuTypes> = {
    tag: ComputeStage;
    usedGlobals: Array<string>;
    name: string;
    parameter: Array<TGpuTypes['memoryLayout']>;
    return: TGpuTypes['memoryLayout'] | null;
};

export type ShaderStruct<TGpuTypes extends GpuTypes> = {
    name: string;
    properties: Array<ShaderValue<TGpuTypes>>;
};

/*
 * Types.
 */

export type ShaderType<TGpuTypes extends GpuTypes> = {
    type: 'buildIn';
    typeName: string;
    size: number;
    align: number;
} | {
    type: 'struct';
    struct: ShaderStruct<TGpuTypes>;
};

type ShaderTypeAlias = {
    type: string;
    generics: Array<string>;
};