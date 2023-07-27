import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core.data';
import { MemoryLayout } from '../../../base/memory_layout/memory-layout';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BufferBindType } from '../../../constant/buffer-bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryCopyType } from '../../../constant/memory-copy-type.enum';
import { SamplerType } from '../../../constant/sampler-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { WebGpuArrayBufferMemoryLayout } from '../memory_layout/buffer/web-gpu-array-buffer-memory-layout';
import { WebGpuSamplerMemoryLayout } from '../memory_layout/web-gpu-sampler-memory-layout';
import { WebGpuDevice, WebGpuTypes } from '../web-gpu-device';
import { WgslAccessMode } from './wgsl_enum/wgsl-access-mode.enum';
import { WgslBindingType } from './wgsl_enum/wgsl-binding-type.enum';
import { WgslShaderStage } from './wgsl_enum/wgsl-shader-stage.enum';
import { WgslType } from './wgsl_enum/wgsl-type.enum';
import { ShaderFunction, ShaderInformation } from '../../../base/shader/shader-information';
import { WebGpuStructBufferMemoryLayout } from '../memory_layout/buffer/web-gpu-struct-buffer-memory-layout';


export class WebGpuShaderInformation extends ShaderInformation<WebGpuTypes> {
    private readonly mSource: string;

    /**
     * Constructor.
     * @param pDevice - Gpu device reference.
     * @param pSource - Source code.
     */
    public constructor(pDevice: WebGpuDevice, pSource: string) {
        super(pDevice, pSource);

        this.mSource = pSource;
    }

    /**
     * Fetch bindings.
     * @param pSourceCode - Source code.
     */
    protected override fetchBindings(pSourceCode: string): Array<[number, WebGpuTypes['memoryLayout']]> {
        // Get only lines with group attributes.
        const lAllGroupLines: string = [...pSourceCode.matchAll(/^.*@group.*$/gm)].reduce((pCurrent, pLine) => {
            return pCurrent + pLine[0];
        }, '');

        // Available shader states based on entry points.
        // Not the best, but better than nothing.
        let lShaderStage: WgslShaderStage = 0;
        if (/(@compute(.|\r?\n)*?fn )(?<name>\w*)/gm.test(pSourceCode)) {
            lShaderStage |= WgslShaderStage.Compute;
        }
        if (/(@fragment(.|\r?\n)*?fn )(?<name>\w*)/gm.test(pSourceCode)) {
            lShaderStage |= WgslShaderStage.Fragment;
        }
        if (/(@vertex(.|\r?\n)*?fn )(?<name>\w*)/gm.test(pSourceCode)) {
            lShaderStage |= WgslShaderStage.Vertex;
        }

        // Fetch all group variables.
        const lBindingList: Array<[number, WebGpuTypes['memoryLayout']]> = new Array<[number, WebGpuTypes['memoryLayout']]>();
        for (const lVariable of this.fetchVariableDefinitions(lAllGroupLines)) {
            const lGroupAttribute: string | undefined = lVariable.attributes.find(pAttribute => pAttribute.startsWith('@group'));
            if (!lGroupAttribute) {
                throw new Exception('Bindind variable needs an binding and group attribute.', this);
            }

            // Parse group index.
            const lGroupIndex: number = parseInt(lGroupAttribute.replace(/[^\d]+/g, ''));

            lBindingList.push([lGroupIndex, this.createMemoryLayout(lVariable)]);
        }

        return lBindingList;
    }

    /**
     * Fetch entry points.
     */
    protected override fetchEntryPoints(pSourceCode: string): Array<[ComputeStage, ShaderFunction<WebGpuTypes>]> {
        // Get all functions.
        const lFunctionList: Array<WgslFunction> = this.fetchFunctions(pSourceCode);

        const lEntryPoints: Array<[ComputeStage, ShaderFunction<WebGpuTypes>]> = new Array<[ComputeStage, ShaderFunction<WebGpuTypes>]>();
        for (const lFunction of lFunctionList) {
            // Assemble shaderstage.
            if (lFunction.attributes.find(pAttribute => pAttribute.startsWith('@compute'))) {
                lEntryPoints.push([ComputeStage.Compute, { name: lFunction.name, parameter: lFunction.parameter, return: lFunction.return }]);
            }
            if (lFunction.attributes.find(pAttribute => pAttribute.startsWith('@fragment'))) {
                lEntryPoints.push([ComputeStage.Fragment, { name: lFunction.name, parameter: lFunction.parameter, return: lFunction.return }]);
            }
            if (lFunction.attributes.find(pAttribute => pAttribute.startsWith('@vertex'))) {
                lEntryPoints.push([ComputeStage.Vertex, { name: lFunction.name, parameter: lFunction.parameter, return: lFunction.return }]);
            }
        }

        return lEntryPoints;
    }

    /**
     * Create buffer type from variable definition.
     * @param pVariable - Variable definition.
     */
    private createMemoryLayout(pVariable: WgslVariable): WebGpuTypes['memoryLayout'] {
        // String to type. Undefined must be an struct type.
        const lType: WgslType | null = this.wgslTypeByName(pVariable.type);
        if (lType === WgslType.Enum) {
            throw new Exception('Enum cant be fetched as variable type.', this);
        }

        // Try to parse access and bind setings. Set with defaults.
        let lBindingType: WgslBindingType | undefined = WgslBindingType.None;
        let lAccessMode: WgslAccessMode | undefined = WgslAccessMode.None;
        if (pVariable.access) {
            lBindingType = EnumUtil.enumKeyByValue(WgslBindingType, pVariable.access.bindingType);
            if (!lBindingType) {
                throw new Exception(`Bind type "${pVariable.access.bindingType}" does not exist.`, this);
            }
            if (pVariable.access.accessMode) {
                lAccessMode = EnumUtil.enumKeyByValue(WgslAccessMode, pVariable.access.accessMode);
                if (!lAccessMode) {
                    throw new Exception(`Access mode "${pVariable.access.accessMode}" does not exist.`, this);
                }
            }

            // Set bind type to read only storage if it is in fact a read only storage.
            if (lBindingType === WgslBindingType.Storage && lAccessMode === WgslAccessMode.AccessModeRead) {
                lBindingType = WgslBindingType.ReadonlyStorage;
            }
        }

        // Parse attributes of variable.
        const lAttributes: Dictionary<string, Array<string | number>> = new Dictionary<string, Array<string | number>>();
        for (const lAttribute of pVariable.attributes) {
            const lAttributeMatch: RegExpExecArray | null = /@(?<name>\w+)(\((?<parameter>[^)]*)\))?/g.exec(lAttribute);
            if (!lAttributeMatch) {
                throw new Exception(`Somthing is not right with "${lAttribute}". Dont know what.`, this);
            }

            const lAttributeParameterList: Array<string | number> = new Array<string | number>();
            if (lAttributeMatch.groups!['parameter']) {
                const lParameterPartList: Array<string> = lAttributeMatch.groups!['parameter'].split(',');
                for (const lPart of lParameterPartList) {
                    if (isNaN(<any>lPart)) {
                        lAttributeParameterList.push(lPart);
                    } else {
                        lAttributeParameterList.push(parseInt(lPart));
                    }
                }
            }

            lAttributes.set(lAttributeMatch.groups!['name'], lAttributeParameterList);
        }

        // Try to get location from attributes.
        let lLocationIndex: number | null = null;
        const lLocationValue: number = parseInt(pVariable.attributes.find(pAttribute => pAttribute.startsWith('@location'))?.replace(/[^\d]+/g, '') ?? '');
        const lBindValue: number = parseInt(pVariable.attributes.find(pAttribute => pAttribute.startsWith('@binding'))?.replace(/[^\d]+/g, '') ?? '');
        if (!Number.isNaN(lLocationValue) || !Number.isNaN(lBindValue)) {
            lLocationIndex = lLocationValue || lBindValue;
        }


        let lBufferType: WebGpuTypes['memoryLayout'];
        switch (lType) {
            case WgslType.Struct: {
                const lStructType: WebGpuStructBufferMemoryLayout = new WebGpuStructBufferMemoryLayout(pVariable.name, pVariable.type, lAccessMode, lBindingType, lLocationIndex);

                // Get struct body and fetch types.
                const lStructBody: string = this.getStructBody(pVariable.type);
                this.fetchVariableDefinitions(lStructBody).forEach((pPropertyVariable, pIndex) => {
                    const lProperyBufferType: WebGpuTypes['bufferMemoryLayout'] = this.createMemoryLayout(pPropertyVariable);

                    // Add property to struct buffer type.
                    lStructType.addProperty(pIndex, lProperyBufferType);
                });

                lBufferType = lStructType;
                break;
            }
            case WgslType.Array: {
                // Validate generic range.
                if (pVariable.generics.length !== 1 && pVariable.generics.length !== 2) {
                    throw new Exception('Array type must have one or two generic types.', this);
                }

                // Fetch first generic by extending generic type to a variable definition and parse recursive.
                const lTypeGeneric: WgslVariable | undefined = this.fetchVariableDefinitions(`PLACEHOLDER: ${pVariable.generics.at(0)!};`).at(0)!;
                const lTypeGenericBufferType: BufferLayout = this.createMemoryLayout(lTypeGeneric);

                // Fetch optional size gerneric.
                let lSizeGeneric: number = -1;
                if (pVariable.generics.at(1)) {
                    if (!isNaN(<any>pVariable.generics.at(1))) {
                        throw new Exception('Array size parameter needs to be a number.', this);
                    }
                    lSizeGeneric = parseInt(pVariable.generics.at(1)!);
                }

                // Create array buffer type.
                lBufferType = new WebGpuArrayBufferMemoryLayout(pVariable.name, lTypeGenericBufferType, lSizeGeneric, lAccessMode, lBindingType, lLocationIndex);
                break;
            }
            default: {
                // Map generics to struct like body. Fetch variable definitions and save only type.
                const lPseudoStructBody: string = pVariable.generics.reduce((pCurrent, pGeneric) => {
                    return pCurrent + `PLACEHOLDER: ${pGeneric};`;
                }, '');
                const lPseudoVariableList: Array<WgslVariable> = this.fetchVariableDefinitions(lPseudoStructBody);
                const lGenericList: Array<WgslType> = lPseudoVariableList.map((pVariable) => { return this.wgslTypeByName(pVariable.type); });

                lBufferType = new SimpleBufferLayout(pVariable.name, lType, lGenericList, lAccessMode, lBindingType, lLocationIndex);
                break;
            }
        }

        return lBufferType;
    }

    private createBufferMemoryLayout(pVariable: WgslVariable, pLocation: number | null): BufferMemoryLayout { }

    /**
     * Create sampler memory layout.
     * @param pVariable - Variable definition.
     * @param pLocation - Variable location.
     */
    private createSamplerMemoryLayout(pVariable: WgslVariable, pLocation: number | null): WebGpuSamplerMemoryLayout {
        // Concat visibilites from shader. No good but better than nothing.
        let lVisibility: ComputeStage = <ComputeStage>0;
        for (const lComputeStage of this.entryPoints.keys()) {
            lVisibility |= lComputeStage;
        }

        // Convert sampler type.
        let lSamplerType: SamplerType;
        if (pVariable.type === WgslType.Sampler) {
            lSamplerType = SamplerType.Filter;
        } else { // WgslType.SamplerComparison
            lSamplerType = SamplerType.Comparison;
        }

        return new WebGpuSamplerMemoryLayout({
            access: AccessMode.Read,
            bindType: BufferBindType.Uniform,
            location: pLocation,
            name: pVariable.name,
            memoryType: MemoryCopyType.CopyDestination | MemoryCopyType.CopySource,
            visibility: lVisibility,
            samplerType: lSamplerType
        });
    }
    private createTextureMemoryLayout(pVariable: WgslVariable, pLocation: number | null): TextureMemoryLayout {

    }

    /**
     * Fetch all function declarations of source snipped.
     * @param pSourceSnipped - Source snipped with function declarations.
     */
    private fetchFunctions(pSourceSnipped: string): Array<WgslFunction> {
        const lFunctionRegex: RegExp = /(?<attributes>(?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:\s)*?fn\s+(?<name>\w*)\s*\((?<parameter>(?:.|\r?\n)*?)\)(?:\s*->\s*(?<result>[^{]+))?\s*{/gm;

        const lFunctionList: Array<WgslFunction> = new Array<WgslFunction>();
        for (const lFunctionMatch of pSourceSnipped.matchAll(lFunctionRegex)) {
            // Fetch attributes.
            const lAttributeList: Array<string> = new Array<string>();
            if (lFunctionMatch.groups!['attributes']) {
                // Split string of multiple attributes.
                for (const lAttributeMatch of lFunctionMatch.groups!['attributes'].matchAll(/@[\w]+(\([^)]*\))?/g)) {
                    lAttributeList.push(lAttributeMatch[0]);
                }
            }

            // Fetch Parameter.
            const lParameterVariableList: Array<WgslVariable> = this.fetchVariableDefinitions(lFunctionMatch.groups!['parameter']!);
            const lParameterList: Array<MemoryLayout> = lParameterVariableList.map((pVariable) => { return this.createMemoryLayout(pVariable); });

            // Fetch result type.
            let lResult: MemoryLayout | null = null;
            if (lFunctionMatch.groups!['result']) {
                const lResultVariable: WgslVariable = this.fetchVariableDefinitions(lFunctionMatch.groups!['result']!).at(0)!;
                lResult = this.createMemoryLayout(lResultVariable);
            }

            lFunctionList.push({
                name: lFunctionMatch.groups!['name'],
                return: lResult,
                parameter: lParameterList,
                attributes: lAttributeList
            });
        }

        return lFunctionList;
    }

    /**
     * Find all variable definitions and fetch data.
     * @param pSourceSnipped - Source snipped with variables.
     */
    private fetchVariableDefinitions(pSourceSnipped: string): Array<WgslVariable> {
        const lDefinitionRegex: RegExp = /(?<attributes>(?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:var(?:<(?<access>[\w\s,]+)?>)?\s+)?(?:(?<variable>\w+)\s*:\s*)?(?<type>(?<typename>\w+)(?:<(?<generics>[<>\w\s,]+)>)?)/gm;

        const lVariableList: Array<WgslVariable> = new Array<WgslVariable>();
        for (const lDefinitionMatch of pSourceSnipped.matchAll(lDefinitionRegex)) {
            // Fetch attributes.
            const lAttributes: Array<string> = new Array<string>();
            if (lDefinitionMatch.groups!['attributes']) {
                // Split string of multiple attributes.
                for (const lAttributeMatch of lDefinitionMatch.groups!['attributes'].matchAll(/@[\w]+\([^)]*\)/g)) {
                    lAttributes.push(lAttributeMatch[0]);
                }
            }

            // Parse optional acccess modifier.
            let lAccess: { bindingType: string; accessMode: string | null; } | null = null;
            if (lDefinitionMatch.groups!['access']) {
                // var<addressSpace [,accessMode]>
                const lAccessList: Array<string> = lDefinitionMatch.groups!['access'].split(',').map((pValue: string) => pValue.trim()).filter((pValue: string) => pValue.length);
                lAccess = {
                    bindingType: lAccessList[0],
                    accessMode: lAccessList[1] ?? null
                };
            }

            // Split generic types.
            const lGenericList: Array<string> = new Array<string>();
            if (lDefinitionMatch.groups!['generics']) {
                for (const lGenericMatch of lDefinitionMatch.groups!['generics'].matchAll(/(?<generictype>(?:\w+(?:<.+>)?))[,\s]*/g)) {
                    lGenericList.push(lGenericMatch.groups!['generictype']);
                }
            }

            lVariableList.push({
                name: lDefinitionMatch.groups!['variable'] ?? '',
                type: lDefinitionMatch.groups!['typename'],
                generics: lGenericList,
                attributes: lAttributes,
                access: lAccess
            });
        }

        return lVariableList;
    }

    /**
     * Get struct information of struct name.
     * @param pSource - Source.
     * @param pStructName - Struct name.
     */
    private getStructBody(pStructName: string): string {
        const lStuctRegex: RegExp = /^\s*struct\s+(?<name>\w+)\s*{(?<typeinfo>[^}]*)}$/smg;

        let lStructBody: string | null = null;

        // Find struct name and body.
        for (const lStructMatch of this.mSource.matchAll(lStuctRegex)) {
            if (lStructMatch.groups!['name'] === pStructName) {
                lStructBody = lStructMatch.groups!['typeinfo'];
                break;
            }
        }

        // Validate found struct body.
        if (!lStructBody) {
            throw new Exception(`Struct "${pStructName}" not found.`, this);
        }

        return lStructBody;
    }

    /**
     * Get wgsl type by name without generics.
     * @param pName - Type name.
     */
    private wgslTypeByName(pName: string): WgslType {
        let lType: WgslType | undefined = EnumUtil.enumKeyByValue(WgslType, pName);
        if (!lType) {
            try {
                // Try to find struct. Throws error on missing struct declaration.
                this.getStructBody(pName);

                lType = WgslType.Struct;
            } catch (_ex) {
                // On error (when struct not found). It can only be an enum.
                lType = WgslType.Enum;
            }
        }

        return lType;
    }

    private saveForLaterFunction(): void {
        // Static properties.
        this.mGenericRawList = pParameter.generics ?? [];

        // Filter enum of generic list.
        this.mGenericList = this.mGenericRawList.map(pGeneric => {
            if (!EnumUtil.enumKeyByValue(WgslType, pGeneric)) {
                return WgslType.Enum;
            }

            return <WgslType>pGeneric;
        });

        // Get type restrictions.
        const lRestrictionList: Array<WgslTypeSetting> | undefined = SimpleBufferMemoryLayout.mTypeRestrictions[pParameter.type];
        if (!lRestrictionList) {
            throw new Exception(`Type ${pParameter.type} not supported as buffer memory layout.`, this);
        }

        // Find corresponding restrictions. // TODO: Check for enum or struct or any types.
        const lRestriction: WgslTypeSetting | undefined = lRestrictionList.find((pRestriction) => {
            // Restriction has no generics.
            if (!pRestriction.generic && this.mGenericRawList.length > 0) {
                return false;
            }

            // No Generic restriction.
            if (!pRestriction.generic && this.mGenericRawList.length === 0) {
                return true;
            }

            // Validate each restriction.
            for (let lGenericIndex: number = 0; lGenericIndex < pRestriction.generic!.length; lGenericIndex++) {
                const lRestriction: WgslType = pRestriction.generic![lGenericIndex];
                if (lRestriction === WgslType.Any) {
                    continue;
                }

                const lRawGeneric: string = this.mGenericRawList[lGenericIndex];
                if (lRestriction === WgslType.Enum && lRawGeneric) {
                    continue;
                }

                if (lRestriction !== lRawGeneric) {
                    return false;
                }
            }
            return true;
        });
        if (!lRestriction) {
            throw new Exception(`No type (${pParameter.type}) restriction for generics [${pParameter.generics}] found.`, this);
        }
    }

    private static readonly mTypeRestrictions: Record<WgslType, Array<WgslTypeSetting>> = (() => {
        const lTypes: Record<WgslType, Array<WgslTypeSetting>> = <any>{};

        // Scalar types.
        lTypes[WgslType.Boolean] = [{ size: 1, align: 1 }];
        lTypes[WgslType.Integer32] = [{ size: 4, align: 4 }];
        lTypes[WgslType.UnsignedInteger32] = [{ size: 4, align: 4 }];
        lTypes[WgslType.Float32] = [{ size: 4, align: 4 }];
        lTypes[WgslType.Float16] = [{ size: 2, align: 2 }];

        // Vector types.
        lTypes[WgslType.Vector2] = [
            { size: 8, align: 8, generic: [WgslType.Integer32] },
            { size: 8, align: 8, generic: [WgslType.UnsignedInteger32] },
            { size: 8, align: 8, generic: [WgslType.Float32] },
            { size: 4, align: 4, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Vector3] = [
            { size: 12, align: 16, generic: [WgslType.Integer32] },
            { size: 12, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 12, align: 16, generic: [WgslType.Float32] },
            { size: 6, align: 8, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Vector4] = [
            { size: 16, align: 16, generic: [WgslType.Integer32] },
            { size: 16, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 16, align: 16, generic: [WgslType.Float32] },
            { size: 8, align: 8, generic: [WgslType.Float16] }
        ];

        // Matrix types.
        lTypes[WgslType.Matrix22] = [
            { size: 16, align: 8, generic: [WgslType.Integer32] },
            { size: 16, align: 8, generic: [WgslType.UnsignedInteger32] },
            { size: 16, align: 8, generic: [WgslType.Float32] },
            { size: 8, align: 4, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix23] = [
            { size: 32, align: 16, generic: [WgslType.Integer32] },
            { size: 32, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 32, align: 16, generic: [WgslType.Float32] },
            { size: 16, align: 8, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix24] = [
            { size: 32, align: 16, generic: [WgslType.Integer32] },
            { size: 32, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 32, align: 16, generic: [WgslType.Float32] },
            { size: 16, align: 8, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix32] = [
            { size: 24, align: 8, generic: [WgslType.Integer32] },
            { size: 24, align: 8, generic: [WgslType.UnsignedInteger32] },
            { size: 24, align: 8, generic: [WgslType.Float32] },
            { size: 12, align: 4, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix33] = [
            { size: 48, align: 16, generic: [WgslType.Integer32] },
            { size: 48, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 48, align: 16, generic: [WgslType.Float32] },
            { size: 24, align: 8, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix34] = [
            { size: 48, align: 16, generic: [WgslType.Integer32] },
            { size: 48, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 48, align: 16, generic: [WgslType.Float32] },
            { size: 24, align: 8, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix42] = [
            { size: 32, align: 8, generic: [WgslType.Integer32] },
            { size: 32, align: 8, generic: [WgslType.UnsignedInteger32] },
            { size: 32, align: 8, generic: [WgslType.Float32] },
            { size: 16, align: 4, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix43] = [
            { size: 64, align: 16, generic: [WgslType.Integer32] },
            { size: 64, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 64, align: 16, generic: [WgslType.Float32] },
            { size: 32, align: 8, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix44] = [
            { size: 64, align: 16, generic: [WgslType.Integer32] },
            { size: 64, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 64, align: 16, generic: [WgslType.Float32] },
            { size: 32, align: 8, generic: [WgslType.Float16] }
        ];

        lTypes[WgslType.Array] = [
            { size: -1, align: -1, generic: [WgslType.Any] },
            { size: -1, align: -1, generic: [WgslType.Any, WgslType.UnsignedInteger32] }
        ];
        lTypes[WgslType.Struct] = [{ size: -1, align: -1 }];

        lTypes[WgslType.Atomic] = [
            { size: 4, align: 4, generic: [WgslType.Integer32] },
            { size: 4, align: 4, generic: [WgslType.UnsignedInteger32] }
        ];
        // Type alias.
        // TODO:

        return lTypes;
    })();

    private someMoreForLater(): void {
        // Map every texture type for view dimension.
        let lDimension: TextureDimension;
        switch (pParameter.type) {
            case WgslType.Texture1d:
            case WgslType.TextureStorage1d: {
                lDimension = TextureDimension.OneDimension;
                break;
            }
            case WgslType.TextureDepth2d:
            case WgslType.Texture2d:
            case WgslType.TextureStorage2d:
            case WgslType.TextureDepthMultisampled2d:
            case WgslType.TextureMultisampled2d: {
                lDimension = TextureDimension.TwoDimension;
                break;
            }
            case WgslType.TextureDepth2dArray:
            case WgslType.Texture2dArray:
            case WgslType.TextureStorage2dArray: {
                lDimension = TextureDimension.TwoDimensionArray;
                break;
            }
            case WgslType.Texture3d:
            case WgslType.TextureStorage3d: {
                lDimension = TextureDimension.ThreeDimension;
                break;
            }
            case WgslType.TextureCube:
            case WgslType.TextureDepthCube: {
                lDimension = TextureDimension.Cube;
                break;
            }
            case WgslType.TextureCubeArray: {
                lDimension = TextureDimension.CubeArray;
                break;
            }
            default: {
                throw new Exception(`Texture type "${pParameter.type}" not supported for any texture dimension.`, null);
            }
        }

    }
}

type WgslTypeSetting = { size: number, align: number, generic?: Array<WgslType>; };


export type WgslBind = {
    visibility: WgslShaderStage;
    variable: MemoryLayout;
    index: number;
};

export type WgslBindGroup = {
    group: number;
    binds: Array<WgslBind>;
};

export type WgslFunction = {
    attributes: Array<string>;
    name: string;
    parameter: Array<MemoryLayout>;
    return: MemoryLayout | null;
};

type WgslVariable = {
    name: string;
    type: string;
    generics: Array<string>;
    attributes: Array<string>;
    access: { bindingType: string; accessMode: string | null; } | null;
};