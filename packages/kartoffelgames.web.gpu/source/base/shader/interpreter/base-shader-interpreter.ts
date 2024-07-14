import { Dictionary, Exception } from '@kartoffelgames/core';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseMemoryLayout } from '../../memory_layout/base-memory-layout';
import { BufferPrimitiveFormat } from '../../../constant/buffer-primitive-format';

export abstract class BaseShaderInterpreter {
    private readonly mBindings: Dictionary<number, Array<BaseMemoryLayout>>;
    private readonly mDevice: GpuDevice;
    private readonly mEntryPoints: Dictionary<ComputeStage, Array<ShaderFunction>>;
    private readonly mShaderFunctions: Dictionary<string, ShaderFunction>;
    private readonly mShaderStructDefinitions: Dictionary<string, ShaderStructDefinition>;
    private readonly mShaderTypeAliases: Dictionary<string, ShaderTypeAlias>;
    private readonly mShaderTypes: Dictionary<string, ShaderTypeDefinition>;
    private readonly mShaderValue: Dictionary<string, ShaderValue>;
    private readonly mSourceCode: string;

    /**
     * Shader bindings. Grouped by group.
     */
    public get bindings(): Map<number, Array<BaseMemoryLayout>> {
        return this.mBindings;
    }

    /**
     * Shader entry points.
     */
    public get entryPoints(): Map<ComputeStage, Array<ShaderFunction>> {
        return this.mEntryPoints;
    }

    /**
     * Shader source code.
     */
    public get source(): string {
        return this.mSourceCode;
    }

    /**
     * Gpu device.
     */
    protected get device(): GpuDevice {
        return this.mDevice;
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pSourceCode - Shader source code.
     */
    public constructor(pDevice: GpuDevice, pSourceCode: string) {
        this.mDevice = pDevice;
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
        const lShaderFunctionDefinitionList: Array<ShaderFunctionDefinition> = this.fetchFunctionDefinitions(pSourceCode);
        const lShaderValueDefinitionList: Array<ShaderValueDefinition> = this.fetchValueDefinitions(pSourceCode);
        const lShaderStructDefinitionList: Array<ShaderStructDefinition> = this.fetchStructDefinitions(pSourceCode);

        // Map shader structs.
        this.mShaderStructDefinitions = new Dictionary<string, ShaderStructDefinition>();
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
     * Get shader function.
     * @param pName - Function name.
     */
    public getFunction(pName: string): ShaderFunction | null {
        return this.mShaderFunctions.get(pName) ?? null;
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
    protected typeFor(pTypeName: string, pGenericNames: Array<string> = []): ShaderType {
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
                    align: lVariant.align,
                    primitiveFormat: lVariant.format ?? BufferPrimitiveFormat.Unsupported
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
            const lStructDefinition: ShaderStructDefinition = this.mShaderStructDefinitions.get(pTypeName)!;
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
            lComputeStage |= lShaderFunction.entryPoints;
        }

        return lComputeStage;
    }

    /**
     * Get all functions.
     * @param pSourceCode - Source code of shader.
     */
    private convertFunctions(pFunctionDefinitions: Array<ShaderFunctionDefinition>): Dictionary<string, ShaderFunction> {
        const lShaderFunctions: Dictionary<string, ShaderFunction> = new Dictionary<string, ShaderFunction>();
        for (const lDefnition of pFunctionDefinitions) {
            const lShaderFunction: ShaderFunction = this.functionFromDefinition(lDefnition);
            lShaderFunctions.set(lShaderFunction.name, lShaderFunction);
        }

        return lShaderFunctions;
    }

    /**
     * Get all global values.
     * @param pSourceCode - Source code of shader.
     */
    private convertValues(pValueDefinitions: Array<ShaderValueDefinition>): Dictionary<string, ShaderValue> {
        const lShaderValues: Dictionary<string, ShaderValue> = new Dictionary<string, ShaderValue>();
        for (const lDefnition of pValueDefinitions) {
            const lShaderValue: ShaderValue = this.valueFromDefinition(lDefnition);
            lShaderValues.set(lShaderValue.value.name, lShaderValue);
        }

        return lShaderValues;
    }

    /**
     * Fetch shader binds.
     * @param pSourceCode - Shader source code.
     */
    private readBindings(): Dictionary<number, Array<BaseMemoryLayout>> {
        const lBindings: Dictionary<number, Array<BaseMemoryLayout>> = new Dictionary<number, Array<BaseMemoryLayout>>();

        for (const lShaderValue of this.mShaderValue.values()) {
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
     * Read entry points from crawled shader functions.
     */
    private readEntryPoints(): Dictionary<ComputeStage, Array<ShaderFunction>> {
        const lEntryPoints: Dictionary<ComputeStage, Array<ShaderFunction>> = new Dictionary<ComputeStage, Array<ShaderFunction>>();

        // Map shader function to entry point by function tags.
        for (const lShaderFunction of this.mShaderFunctions.values()) {
            if ((lShaderFunction.entryPoints & ComputeStage.Compute) === ComputeStage.Compute) {
                // Init shader stage container.
                if (!lEntryPoints.has(ComputeStage.Compute)) {
                    lEntryPoints.set(ComputeStage.Compute, new Array<ShaderFunction>());
                }

                lEntryPoints.get(ComputeStage.Compute)!.push(lShaderFunction);
            }

            if ((lShaderFunction.entryPoints & ComputeStage.Vertex) === ComputeStage.Vertex) {
                // Init shader stage container.
                if (!lEntryPoints.has(ComputeStage.Vertex)) {
                    lEntryPoints.set(ComputeStage.Vertex, new Array<ShaderFunction>());
                }

                lEntryPoints.get(ComputeStage.Vertex)!.push(lShaderFunction);
            }

            if ((lShaderFunction.entryPoints & ComputeStage.Fragment) === ComputeStage.Fragment) {
                // Init shader stage container.
                if (!lEntryPoints.has(ComputeStage.Fragment)) {
                    lEntryPoints.set(ComputeStage.Fragment, new Array<ShaderFunction>());
                }

                lEntryPoints.get(ComputeStage.Fragment)!.push(lShaderFunction);
            }
        }

        return lEntryPoints;
    }

    /**
     * Search for all functions hat uses the global name.
     * @param pName - variable or function name.
     * @param pScannedNames - All already scanned names. Prevents recursion.
     */
    private searchEntryPointsOf(pName: string, pScannedNames: Set<string>): Array<ShaderFunction> {
        // Add current searched name to already scanned names.
        pScannedNames.add(pName);

        const lUsedFunctionList: Array<ShaderFunction> = new Array<ShaderFunction>();

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

        return [...new Set<ShaderFunction>(lUsedFunctionList)];
    }

    /**
     * Read all function definitions.
     * @param pSourceCode - Source code of shader.
     */
    protected abstract fetchFunctionDefinitions(pSourceCode: string): Array<ShaderFunctionDefinition>;

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
    protected abstract functionFromDefinition(pDefinition: ShaderFunctionDefinition): ShaderFunction;

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

export type ShaderFunctionDefinition = {
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
        format?: BufferPrimitiveFormat;
    }>;
};

/*
 * Values.
 */

export type ShaderValue = {
    value: BaseMemoryLayout;
    group: number | null;
};

export type ShaderFunction = {
    entryPoints: ComputeStage;
    usedGlobals: Array<string>;
    name: string;
    parameter: Array<BaseMemoryLayout>;
    return: BaseMemoryLayout | null;
    attachments: Record<string, Array<string>>;
};

export type ShaderStruct = {
    name: string;
    properties: Array<ShaderValue>;
};

/*
 * Types.
 */

export type ShaderType = {
    type: 'buildIn';
    typeName: string;
    size: number;
    align: number;
    primitiveFormat: BufferPrimitiveFormat;
} | {
    type: 'struct';
    struct: ShaderStruct;
};

type ShaderTypeAlias = {
    type: string;
    generics: Array<string>;
};