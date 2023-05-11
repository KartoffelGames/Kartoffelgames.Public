import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core.data';
import { BufferType } from '../buffer_type/buffer-type';
import { SimpleBufferType } from '../buffer_type/simple-buffer-type';
import { StructBufferType } from '../buffer_type/struct-buffer-type';
import { BindType } from '../enum/bind-type.enum';
import { ShaderStage } from '../enum/shader-stage.enum';
import { WgslAccessMode } from './enum/wgsl-access-mode.enum';
import { WgslBindingType } from './enum/wgsl-binding-type.enum';
import { WgslShaderStage } from './enum/wgsl-shader-stage.enum';
import { WgslType } from './enum/wgsl-type.enum';
import { WgslTypeAccessMode, WgslTypeAccessModes, WgslTypeAddressSpace, WgslTypeAddressSpaces, WgslTypeDepthTexture, WgslTypeDepthTextures, WgslTypeInformation, WgslTypeMatrices, WgslTypeNumbers, WgslTypeStorageTexture, WgslTypeStorageTextures, WgslTypeTexelFormat, WgslTypeTexture, WgslTypeTextures, WgslTypeVectors } from './wgsl_type_handler/wgsl-type-collection';
import { WgslTypeDictionary } from './wgsl_type_handler/wgsl-type-dictionary';
import { ArrayBufferType } from '../buffer_type/array-buffer-type';

export class ShaderInformation {
    private readonly mSource: string;
    private readonly mBindings: Array<ShaderBindGroup>;
    private readonly mEntryPoints: ShaderEntryPoints;

    /**
     * Binding information.
     */
    public get bindings(): Array<ShaderBindGroup> {
        return this.mBindings;
    }

    /**
     * Shader entry points.
     */
    public get entryPoints(): ShaderEntryPoints {
        return this.mEntryPoints;
    }

    /**
     * Constructor.
     * @param pSource - WGSL Source code.
     */
    public constructor(pSource: string) {
        this.mSource = pSource;

        this.mEntryPoints = this.getEntryPointDefinitions(pSource);
        this.mBindings = this.getBindGroups(pSource);
    }

    private fetchBindingType(pVariable: WgslVariable): BufferType {
        // String to type. Undefined must be an struct type.
        let lType: WgslType | undefined = EnumUtil.enumKeyByValue(WgslType, pVariable.type);
        if (!lType) {
            // TODO: Check if type is enum ??? 
            lType = WgslType.Struct;
        }

        // Try to parse access and bind setings. Set with defaults.
        let lBindingType: WgslBindingType | undefined = WgslBindingType.None;
        let lAccessMode: WgslAccessMode | undefined = WgslAccessMode.None;
        if (pVariable.access) {
            lBindingType = EnumUtil.enumKeyByValue(WgslBindingType, pVariable.access.bindingType);
            if (!lBindingType) {
                throw new Exception(`Bind type "${pVariable.access.bindingType}" does not exist.`, this);
            }
            lAccessMode = EnumUtil.enumKeyByValue(WgslAccessMode, pVariable.access.accessMode);
            if (!lAccessMode) {
                throw new Exception(`Access mode "${pVariable.access.accessMode}" does not exist.`, this);
            }
        }

        switch (lType) {
            case WgslType.Struct: {
                const lStructType: StructBufferType = new StructBufferType(lAccessMode, lBindingType);

                // Get struct body and fetch types.
                const lStructBody: string = this.getStructBody(pVariable.type);
                this.fetchVariableDefinitions(lStructBody).forEach((pPropertyVariable, pIndex) => {
                    const lProperyBufferType: BufferType = this.fetchBindingType(pPropertyVariable);

                    // Add property to struct buffer type.
                    lStructType.addProperty(pPropertyVariable.name, pIndex, lProperyBufferType);
                });

                return lStructType;
            }
            case WgslType.Array: {
                // Validate generic range.
                if (pVariable.generics.length !== 1 && pVariable.generics.length !== 2) {
                    throw new Exception('Array type must have one or two generic types.', this);
                }

                // Fetch first generic by extending generic type to a variable definition and parse recursive.
                const lTypeGeneric: WgslVariable | undefined = this.fetchVariableDefinitions(`PLACEHOLDER: ${pVariable.generics.at(0)!};`).at(0)!;
                const lTypeGenericBufferType: BufferType = this.fetchBindingType(lTypeGeneric);

                // Fetch optional size gerneric.
                let lSizeGeneric: number = -1;
                if (pVariable.generics.at(1)) {
                    if (!isNaN(<any>pVariable.generics.at(1))) {
                        throw new Exception('Array size parameter needs to be a number.', this);
                    }
                    lSizeGeneric = parseInt(pVariable.generics.at(1)!);
                }

                // Create array buffer type.
                return new ArrayBufferType(lTypeGenericBufferType, lSizeGeneric, lAccessMode, lBindingType);
            }
            default: {
                const lGenericList: Array<WgslType> = new Array<WgslType>();
                // TODO: Parse generics.

                return new SimpleBufferType(lType, lGenericList, lAccessMode, lBindingType);
            }
        }
    }

    /**
     * Find all variable definitions and fetch data.
     * @param pSourceSnipped - Source snipped with variables.
     */
    private fetchVariableDefinitions(pSourceSnipped: string): Array<WgslVariable> {
        const lDefinitionRegex: RegExp = /(?<attributes>(?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:var(?:<(?<access>[\w\s,]+)?>)?\s+)?(?:(?<variable>\w+)\s*:\s*)?(?<type>(?<typename>\w+)(?:<(?<generics>.+)>)?)/gm;

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
            let lAccess: { bindingType: string; accessMode: string; } | null = null;
            if (lDefinitionMatch.groups!['access']) {
                // var<addressSpace [,accessMode]>
                const lAccessList: Array<string> = lDefinitionMatch.groups!['access'].split(',').map((pValue: string) => pValue.trim()).filter((pValue: string) => pValue.length);
                lAccess = {
                    bindingType: lAccessList[0],
                    accessMode: lAccessList[1] ?? ''
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
     * Get bind based on binding information.
     * @param pBindGroup - Bind group.
     * @param pBindInformation - Bind information.
     */
    private getBindBasedOnType(pBindInformation: ShaderBindInformation, pShaderState: ShaderStage): ShaderBind {
        // Buffer types.
        // Number, matrix, vector and array types.
        if ([...WgslTypeNumbers, ...WgslTypeMatrices, ...WgslTypeVectors, WgslType.Array, WgslType.Any].includes(pBindInformation.typeDescription.type)) {
            // Validate address space.
            if (!pBindInformation.addressSpace) {
                throw new Exception(`Buffer bind type needs to be set for buffer bindings (${pBindInformation.name}).`, this);
            }

            // Bind 
            return <ShaderBufferBind>{
                bindType: BindType.Buffer,
                index: pBindInformation.bindingIndex,
                name: pBindInformation.name,
                visibility: pShaderState,
                type: pBindInformation.addressSpace,
                hasDynamicOffset: false,
                minBindingSize: 0
            };
        }

        // Bind only external textures.
        if (pBindInformation.typeDescription.type === WgslType.TextureExternal) {
            return <ShaderExternalTextureBind>{
                bindType: BindType.ExternalTexture,
                index: pBindInformation.bindingIndex,
                name: pBindInformation.name,
                visibility: pShaderState
            };
        }

        // Sampler types.
        else if ([WgslType.Sampler, WgslType.SamplerComparison].includes(pBindInformation.typeDescription.type)) {
            // Sampler bind type by sampler or comparison type.
            const lFilterType: GPUSamplerBindingType = (pBindInformation.typeDescription.type === WgslType.Sampler) ? 'filtering' : 'comparison';

            // Exit.
            return <ShaderSamplerBind>{
                bindType: BindType.Sampler,
                index: pBindInformation.bindingIndex,
                name: pBindInformation.name,
                visibility: pShaderState,
                type: lFilterType
            };
        }

        // Storage texture.
        if (WgslTypeStorageTextures.includes(<WgslTypeStorageTexture>pBindInformation.typeDescription.type)) {
            // Storage texture first generics is allways the texel format.
            const lTexelFormat: GPUTextureFormat = <WgslTypeTexelFormat>pBindInformation.typeDescription.generics[0];
            const lTextureAccess: GPUStorageTextureAccess = 'write-only';
            const lTextureDimension: GPUTextureViewDimension = WgslTypeDictionary.texureDimensionFromType(<WgslTypeStorageTexture>pBindInformation.typeDescription.type);

            // Bind.
            return <ShaderStorageTextureBind>{
                bindType: BindType.StorageTexture,
                index: pBindInformation.bindingIndex,
                name: pBindInformation.name,
                visibility: pShaderState,
                access: lTextureAccess,
                format: lTexelFormat,
                viewDimension: lTextureDimension
            };
        }

        // Depth or color texture.
        if ([...WgslTypeTextures, ...WgslTypeDepthTextures].includes(<WgslTypeDepthTexture | WgslTypeTexture>pBindInformation.typeDescription.type)) {
            const lTextureDimension: GPUTextureViewDimension = WgslTypeDictionary.texureDimensionFromType(<WgslTypeDepthTexture | WgslTypeTexture>pBindInformation.typeDescription.type);
            const lMultisampled: boolean = [WgslType.TextureMultisampled2d, WgslType.TextureDepthMultisampled2d].includes(pBindInformation.typeDescription.type);

            // First generic texture is a wgsl type on color textures or nothing on depth textures.
            const lTextureWgslType: WgslType | undefined = (<WgslTypeDescription | undefined>pBindInformation.typeDescription.generics[0])?.type;
            const lTextureSampleType: GPUTextureSampleType = WgslTypeDictionary.textureSampleTypeFromGeneric(pBindInformation.typeDescription.type, lTextureWgslType);

            // Exit.
            return <ShaderTextureBind>{
                bindType: BindType.Texture,
                index: pBindInformation.bindingIndex,
                name: pBindInformation.name,
                visibility: pShaderState,
                sampleType: lTextureSampleType,
                viewDimension: lTextureDimension,
                multisampled: lMultisampled
            };
        }

        throw new Exception(`Not implemented. Upps "${pBindInformation.typeDescription.type}"`, this);
    }

    /**
     * Create bind layout from shader code.
     * @param pSource - Shader source code as string.
     */
    private getBindGroups(pSource: string): Array<ShaderBindGroup> {
        // Regex for binding index, group index, modifier, variable name and type.
        const lBindInformationRegex: RegExp = /^\s*@group\((?<group>\d+)\)\s*@binding\((?<binding>\d+)\)\s+var(?:<(?<addressspace>[\w\s]+)(?:\s*,\s*(?<access>[\w\s]+))?>)?\s*(?<name>\w+)\s*:\s*(?<type>[\w,\s<>]*[\w,<>]).*$/gm;

        const lComputeNameRegex: RegExp = /(@compute(.|\r?\n)*?fn )(?<name>\w*)/gm;
        const lFragmentNameRegex: RegExp = /(@fragment(.|\r?\n)*?fn )(?<name>\w*)/gm;
        const lVertexNameRegex: RegExp = /(@vertex(.|\r?\n)*?fn )(?<name>\w*)/gm;

        // Available shader states based on entry points.
        // Not the best, but better than nothing.
        let lShaderStage: ShaderStage = 0;
        if (lComputeNameRegex.test(pSource)) {
            lShaderStage |= ShaderStage.Compute;
        }
        if (lFragmentNameRegex.test(pSource)) {
            lShaderStage |= ShaderStage.Fragment;
        }
        if (lVertexNameRegex.test(pSource)) {
            lShaderStage |= ShaderStage.Vertex;
        }

        // Get bind information for every group binding.
        const lGroups: Dictionary<number, Array<ShaderBind>> = new Dictionary<number, Array<ShaderBind>>();
        for (const lMatch of pSource.matchAll(lBindInformationRegex)) {
            const lGroupIndex: number = parseInt(lMatch.groups!['group']);

            let lGroupList: Array<ShaderBind> | undefined = lGroups.get(lGroupIndex);
            if (!lGroupList) {
                lGroupList = new Array<ShaderBind>();
                lGroups.set(lGroupIndex, lGroupList);
            }

            const lShaderBindInformation: ShaderBindInformation = {
                bindingIndex: parseInt(lMatch.groups!['binding']),
                addressSpace: <GPUBufferBindingType>lMatch.groups!['addressspace'] ?? null,
                name: lMatch.groups!['name'],
                memoryAccess: <any>lMatch.groups!['access'] ?? 'read',
                typeDescription: this.typeDescriptionByString(lMatch.groups!['type'])
            };

            // Update address space for readonly storage. 
            if (lShaderBindInformation.addressSpace === 'storage' && lShaderBindInformation.memoryAccess === 'read') {
                lShaderBindInformation.addressSpace = 'read-only-storage';
            }

            lGroupList.push(this.getBindBasedOnType(lShaderBindInformation, lShaderStage));
        }

        // Add BindGroupInformation to bind group.
        const lBindGroupList: Array<ShaderBindGroup> = new Array<ShaderBindGroup>();
        for (const [lGroupIndex, lBindList] of lGroups) {
            lBindGroupList.push({ groupIndex: lGroupIndex, binds: lBindList });
        }

        return lBindGroupList;
    }

    /**
     * Get first appearance of every entry point type with its, when possible, vertex variables.
     * @param pSource - Source code.
     */
    private getEntryPointDefinitions(pSource: string): ShaderEntryPoints {
        // Entry point regex. With name, entry point type, parameter and result type.
        const lEntryPoint: RegExp = /@(?<entrytype>vertex|fragment|compute)(?:.|\r?\n)*?fn\s+(?<name>\w*)\s*\((?<parameter>(?:.|\r?\n)*?)\)(?:\s*->\s*(?<result>[^{]+))?\s*{/gm;

        const lEntryPointList: Array<ShaderEntryPointFunction> = new Array<ShaderEntryPointFunction>();


        // Find entry points.
        for (const lEntryPointMatch of pSource.matchAll(lEntryPoint)) {
            let lShaderStage: WgslShaderStage | null = null;
            switch (lEntryPointMatch.groups!['entrytype']) {
                case 'fragment': {
                    lShaderStage = WgslShaderStage.Fragment;
                    break;
                }
                case 'vertex': {
                    lShaderStage = WgslShaderStage.Vertex;
                    break;
                }
                case 'compute': {
                    lShaderStage = WgslShaderStage.Compute;
                    break;
                }
            }

            if (!lShaderStage) {
                throw new Exception(`Shader stage "${lEntryPointMatch.groups!['entrytype']}" not supported.`, this);
            }

            // Shader entry point frame.
            const lShaderEntryPoint: ShaderEntryPointFunction = {
                type: lShaderStage,
                name: lEntryPointMatch.groups!['name'],
                parameter: new Array<ShaderFunctionLocation>(),
                returnValues: []
            };

            // Parse result type.
            if (lEntryPointMatch.groups!['result']) {
                const lResultType: WgslVariableDescription = this.getVariableDescription(lEntryPointMatch.groups!['result']);
                lShaderEntryPoint.returnValues = this.resolveNestedTypes(lResultType, pSource);
            }

            // Parse paramerer.
            if (lEntryPointMatch.groups!['parameter']) {
                const lEntryPointParameter: string = lEntryPointMatch.groups!['parameter'];

                // Generate property informations of every property.
                for (const lParameter of lEntryPointParameter.matchAll(/[^,{}<>]+(<.+>)?/gm)) {
                    const lParameterDescription: WgslVariableDescription = this.getVariableDescription(lParameter[0]);
                    lShaderEntryPoint.parameter.push(...this.resolveNestedTypes(lParameterDescription, pSource));
                }
            }

            // Add found entry point to entry point list.
            lEntryPointList.push(lShaderEntryPoint);
        }

        // Get first entry point of each type.
        return {
            fragment: lEntryPointList.find(pEntryPoint => pEntryPoint.type === WgslShaderStage.Fragment),
            vertex: lEntryPointList.find(pEntryPoint => pEntryPoint.type === WgslShaderStage.Vertex),
            compute: lEntryPointList.find(pEntryPoint => pEntryPoint.type === WgslShaderStage.Compute),
        };
    }

    /**
     * Get full variable definition description.
     * Handles struct, bind and global type definitions with attributes.
     * @param pVariableDefinitionSource - Variable definition source code.
     */
    private getVariableDescription(pVariableDefinitionSource: string): WgslVariableDescription {
        const lVariableRegex: RegExp = /^\s*(?<attributes>(?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:var(?:<(?<access>[\w\s,]+)?>)?\s+)?(?:(?<variable>\w+)\s*:\s*)?(?<type>(?<typename>\w+)(?:<(?<generics>.+)>)?)/gm;

        // Match regex and validate match.
        const lMatch: RegExpMatchArray | null = lVariableRegex.exec(pVariableDefinitionSource);
        if (!lMatch) {
            throw new Exception(`Can't parse variable definition "${pVariableDefinitionSource}"`, this);
        }

        // Parse optional attributes.
        const lWgslAttributeList: Array<WgslAttribute> = new Array<WgslAttribute>();
        if (lMatch.groups!['attributes']) {
            const lAttributeString: string = lMatch.groups!['attributes'];
            const lAttributeRegex: RegExp = /@(?<name>[\w]+)\((?<values>[^)]*)\)/g;

            // Global match loop.
            for (const lAttributeMatch of lAttributeString.matchAll(lAttributeRegex)) {
                // Parse optional parameter list.
                let lParameterList: Array<string> = new Array<string>();
                if (lAttributeMatch.groups!['values']) {
                    // Split parameter, Trim values and filter empty entries.
                    lParameterList = lAttributeMatch.groups!['values'].split(',').map((pValue: string) => pValue.trim()).filter((pValue: string) => pValue.length);
                }

                lWgslAttributeList.push({
                    name: lAttributeMatch.groups!['name'],
                    parameter: lParameterList
                });
            }
        }

        // Parse optional acccess modifier.
        let lAccess: { addressSpace: WgslEnum; accessMode: WgslEnum | null; } | null = null;
        if (lMatch.groups!['access']) {
            const lAccessList: Array<string> = lMatch.groups!['access'].split(',').map((pValue: string) => pValue.trim()).filter((pValue: string) => pValue.length);

            // var<addressSpace [,accessMode]>
            const lAddressSpace: WgslEnum = WgslTypeDictionary.enumByName(lAccessList[0]);
            const lAccessMode: WgslEnum = WgslTypeDictionary.enumByName(lAccessList[1]);

            // Validate address space.
            if (!WgslTypeAddressSpaces.includes(<WgslTypeAddressSpace>lAddressSpace)) {
                throw new Exception(`Invalid address space "${lAccessList[0]}"`, this);
            }

            // Validate optional access mode. Ignore unknown/not set values.
            if (lAccessMode !== WgslEnum.Unknown && !WgslTypeAccessModes.includes(<WgslTypeAccessMode>lAccessMode)) {
                throw new Exception(`Invalid access mode "${lAccessList[1]}"`, this);
            }

            lAccess = {
                addressSpace: lAddressSpace,
                accessMode: (lAccessMode !== WgslEnum.Unknown) ? lAccessMode : null
            };
        }

        // "Parse" variable name.
        const lVariableName: string = lMatch.groups!['variable'] ?? '';

        // Find value type.
        let lValueType: WgslValueType;
        const lTypeName: string = lMatch.groups!['typename'];
        if (WgslTypeDictionary.enumByName(lTypeName) !== WgslEnum.Unknown) {
            lValueType = WgslValueType.Enum;
        } else if (WgslTypeDictionary.typeByName(lTypeName) !== WgslType.Any) {
            lValueType = WgslValueType.Type;
        } else {
            lValueType = WgslValueType.Struct;
        }

        // Parse type information.
        let lType: WgslTypeDescription | WgslEnum | string;
        switch (lValueType) {
            case WgslValueType.Enum: {
                lType = WgslTypeDictionary.enumByName(lTypeName);
                break;
            }
            case WgslValueType.Struct: {
                lType = lTypeName;
                break;
            }
            case WgslValueType.Type: {
                lType = this.typeDescriptionByString(lMatch.groups!['type']);
                break;
            }
        }

        return {
            name: lVariableName,
            type: lType,
            attributes: lWgslAttributeList,
            valueType: lValueType,
            access: lAccess
        };
    }



    /**
     * Resolve nested structs and types.
     * Get all locations.
     * @param pVariable - Variable description.
     * @param pSource - Source.
     * @returns 
     */
    private resolveNestedTypes(pVariable: WgslVariableDescription, pSource: string): Array<ShaderFunctionLocation> {
        // Get shader function parameter from wgsl variable defintion, Excluded Structs.
        const lGenerateShaderFunctionParameter = (pParameterDescription: WgslVariableDescription, pNamePrefix: string = ''): ShaderFunctionLocation => {
            const lLocationAttribute: WgslAttribute | undefined = pParameterDescription.attributes.find(pAttribute => pAttribute.name === 'location');
            const lBuiltinAttribute: WgslAttribute | undefined = pParameterDescription.attributes.find(pAttribute => pAttribute.name === 'builtin');

            // Function parameter frame.
            const lFunctionParameter: ShaderFunctionLocation = {
                name: pNamePrefix + pParameterDescription.name,
                type: <WgslTypeDescription>pParameterDescription.type,
                location: ''
            };

            // Get location from builtin or location attribute.
            if (lLocationAttribute) {
                lFunctionParameter.location = parseInt(lLocationAttribute.parameter[0]);
            } else if (lBuiltinAttribute) {
                lFunctionParameter.location = lBuiltinAttribute.parameter[0];
            } else {
                throw new Exception(`No buffer location for attribute "${pParameterDescription.name}" found.`, this);
            }

            return lFunctionParameter;
        };

        // Resolve nested struct parameter as shader function parameter.
        const lResolveNestedParameter = (pParameterDescription: WgslVariableDescription, pNamePrefix: string = ''): Array<ShaderFunctionLocation> => {
            const lShaderFunctionParameterList: Array<ShaderFunctionLocation> = new Array<ShaderFunctionLocation>();

            const lVariableLocationName: string = pNamePrefix + pParameterDescription.name;

            // Resolve nested structs.
            if (pParameterDescription.valueType === WgslValueType.Struct) {
                // Get struct information.
                const lStruct = this.getStructDescription(pSource, <string>pParameterDescription.type);
                for (const lStuctProperty of lStruct.properties) {
                    if (lStuctProperty.valueType === WgslValueType.Struct) {
                        lShaderFunctionParameterList.push(...lResolveNestedParameter(lStuctProperty, lVariableLocationName));
                    } else {
                        lShaderFunctionParameterList.push(lGenerateShaderFunctionParameter(lStuctProperty, lVariableLocationName));
                    }
                }
            } else {
                lShaderFunctionParameterList.push(lGenerateShaderFunctionParameter(pParameterDescription, lVariableLocationName));
            }

            return lShaderFunctionParameterList;
        };

        return lResolveNestedParameter(pVariable);
    }

    /**
     * Get nested type definition from string.
     * Does validate allowed generic types of all depths.
     * @param pTypeString - Type string with optional nested generics.
     */
    private typeDescriptionByString(pTypeString: string): WgslTypeDescription {
        const lTypeRegex: RegExp = /^(?<typename>\w+)(?:<(?<generics>.+)>)?$/;
        const lGenericRegex: RegExp = /(?<generictype>(?:\w+(?:<.+>)?))[,\s]*/g;

        // Match type information.
        const lMatch: RegExpMatchArray | null = lTypeRegex.exec(pTypeString);
        if (!lMatch) {
            throw new Exception(`Type "${pTypeString}" can't be parsed.`, WgslTypeDictionary);
        }

        // Scrape generic information of the string.
        const lGenericList: Array<WgslTypeDescription | WgslEnum> = new Array<WgslTypeDescription | WgslEnum>();
        if (lMatch.groups!['generics']) {
            const lGenerics: string = lMatch.groups!['generics'];

            // Execute recursion for all found generic types.
            for (const lGenericMatch of lGenerics.matchAll(lGenericRegex)) {
                const lGenericName: string = lGenericMatch.groups!['generictype'];

                // Check if generic is a enum type.
                const lGenericEnum: WgslEnum = WgslTypeDictionary.enumByName(lGenericName);
                if (lGenericEnum !== WgslEnum.Unknown) {
                    lGenericList.push(lGenericEnum);
                    continue;
                }

                // Recursive resolve for wgsl types.
                const lGenericTypeInformation: WgslTypeDescription = this.typeDescriptionByString(lGenericName);
                lGenericList.push(lGenericTypeInformation);

            }
        }

        // Validate type.
        const lType: WgslType = WgslTypeDictionary.typeByName(lMatch.groups!['typename']);
        const lTypeInformation: WgslTypeInformation | undefined = WgslTypeDictionary.typeInformation(lType);
        if (!lTypeInformation) {
            throw new Exception(`Type "${lMatch.groups!['typename']}" has no definition.`, WgslTypeDictionary);
        }

        // Skip generic validation for any types.
        if (lTypeInformation.type !== WgslType.Any) {
            const lMinGenericCount: number = lTypeInformation.genericTypes.filter((pGeneric) => !pGeneric.includes(WgslType.Optional)).length;
            const lMaxGenericCount: number = lTypeInformation.genericTypes.length;

            // Validate generic count.
            if (lGenericList.length < lMinGenericCount || lGenericList.length > lMaxGenericCount) {
                throw new Exception(`Generic count does not match definition "${lTypeInformation.type.toString()}" (Should:[${lMinGenericCount} - ${lMaxGenericCount}], Has:${lGenericList.length})`, WgslTypeDictionary);
            }

            // Validate generics.
            for (let lGenericIndex: number = 0; lGenericIndex < lGenericList.length; lGenericIndex++) {
                // Target generic.
                const lTargetGeneric: WgslTypeDescription | WgslEnum = lGenericList[lGenericIndex];
                const lTargetGenericType: WgslType | WgslEnum = (typeof lTargetGeneric === 'string') ? lTargetGeneric : lTargetGeneric.type;

                // Valid generic types or enums.
                const lValidGenerics: Array<WgslType | WgslEnum> = lTypeInformation.genericTypes[lGenericIndex];

                // Compare valid list with set target generic.
                if (!lValidGenerics.includes(lTargetGenericType) && !lValidGenerics.includes(WgslType.Any)) {
                    throw new Exception(`Generic type to definition missmatch. (Type "${lTypeInformation.type}" generic index ${lGenericIndex})`, WgslTypeDictionary);
                }
            }
        }

        return {
            type: lType,
            generics: lGenericList
        };
    }
}

type WgslStructInformation = {
    name: string,
    properties: Array<WgslVariableDescription>;
};

export type WgslTypeDescription = {
    type: WgslType;
    generics: Array<WgslTypeDescription | WgslEnum>;
};



type WgslAttribute = {
    name: string;
    parameter: Array<string>;
};

type ShaderEntryPoints = {
    fragment?: ShaderEntryPointFunction | undefined;
    vertex?: ShaderEntryPointFunction | undefined;
    compute?: ShaderEntryPointFunction | undefined;
};

type ShaderFunctionLocation = {
    location: number | string;
    type: WgslTypeDescription;
    name: string;
};

type ShaderFunctionResult = {
    location: number | string;
    type: WgslTypeDescription;
};

export type ShaderEntryPointFunction = {
    type: WgslShaderStage;
    name: string,
    parameter: Array<ShaderFunctionLocation>;
    returnValues: Array<ShaderFunctionResult>;
};

type ShaderBindInformation = {
    bindingIndex: number,
    addressSpace: GPUBufferBindingType | null,
    memoryAccess: 'read' | 'write' | 'read_write';
    name: string,
    typeDescription: WgslTypeDescription;
};

interface ShaderBaseBind {
    index: number;
    name: string;
    bindType: BindType;
    visibility: ShaderStage;
}

interface ShaderBufferBind extends ShaderBaseBind, Required<GPUBufferBindingLayout> {
    bindType: BindType.Buffer;
}

interface ShaderSamplerBind extends ShaderBaseBind, Required<GPUSamplerBindingLayout> {
    bindType: BindType.Sampler;
}

interface ShaderTextureBind extends ShaderBaseBind, Required<GPUTextureBindingLayout> {
    bindType: BindType.Texture;
}

interface ShaderStorageTextureBind extends ShaderBaseBind, Required<GPUStorageTextureBindingLayout> {
    bindType: BindType.StorageTexture;
}

interface ShaderExternalTextureBind extends ShaderBaseBind, Required<GPUExternalTextureBindingLayout> {
    bindType: BindType.ExternalTexture;
}

export type ShaderBind = ShaderBufferBind | ShaderSamplerBind | ShaderTextureBind | ShaderStorageTextureBind | ShaderExternalTextureBind;

export type ShaderBindGroup = {
    groupIndex: number;
    binds: Array<ShaderBind>;
};











type WgslEntryPoint = {
    type: WgslShaderStage,
    function: WgslFunction;
};

type WgslBind = {
    visibility: WgslShaderStage;
    variable: WgslVariable;
    index: number;
    bindingType: WgslBindingType;
};

type WgslBindGroup = {
    group: number;
    binds: Array<WgslBind>;
};

type WgslFunction = {
    name: string;
    parameter: Array<WgslVariable>;
    return: WgslVariable;
};

type WgslVariable = {
    name: string;
    type: string;
    generics: Array<string>;
    attributes: Array<string>;
    access: { bindingType: string; accessMode: string; } | null;
};