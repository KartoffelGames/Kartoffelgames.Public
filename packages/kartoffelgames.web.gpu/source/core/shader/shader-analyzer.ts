import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core.data';
import { BindGroupLayout } from '../bind_group/bind-group-layout';
import { BindGroups } from '../bind_group/bind-groups';
import { ShaderStage } from '../enum/shader-stage.enum';
import { Gpu } from '../gpu';
import { WgslTypeDictionary } from './wgsl_type_handler/wgsl-type-dictionary';
import { WgslTypeAccessMode, WgslTypeAccessModes, WgslTypeAddressSpace, WgslTypeAddressSpaces, WgslTypeDepthTexture, WgslTypeDepthTextures, WgslTypeInformation, WgslTypeMatrices, WgslTypeNumbers, WgslTypeStorageTexture, WgslTypeStorageTextures, WgslTypeTexelFormat, WgslTypeTexture, WgslTypeTextures, WgslTypeVectors } from './wgsl_type_handler/wgsl-type-collection';
import { WgslType } from './wgsl_type_handler/wgsl-type.enum';
import { WgslEnum } from './wgsl_type_handler/wgsl-enum.enum';
import { WgslValueType } from './wgsl_type_handler/wgsl-value-type.enum';
import { WgslEntryPoint } from './wgsl_type_handler/wgsl-entry-point.enum';

export class ShaderInformation {
    private static readonly mComputeNameRegex: RegExp = /(@compute(.|\r?\n)*?fn )(?<name>\w*)/gm;
    private static readonly mFragmentNameRegex: RegExp = /(@fragment(.|\r?\n)*?fn )(?<name>\w*)/gm;
    private static readonly mVertexNameRegex: RegExp = /(@vertex(.|\r?\n)*?fn )(?<name>\w*)/gm;

    private readonly mEntryPoints: EntryPoints;
    private readonly m;

    public constructor(pSource: string) {
        // TODO: Find entry points and attributes. 
    }

    private getEntryPointDefinitions(pSource: string): EntryPoints {
        // Entry point regex. With name, entry point type, parameter and result type.
        const lEntryPoint: RegExp = /@(?<entrytype>vertex|fragment|compute)(?:.|\r?\n)*?fn\s+(?<name>\w*)\s*\((?<parameter>(?:.|\r?\n)*?)\)(?:\s*->\s*(?<result>[^{]+))?\s*{/gm;

        const lEntryPointList: Array<ShaderEntryPointFunction> = new Array<ShaderEntryPointFunction>();

        // Find entry points.
        for (const lEntryPointMatch of pSource.matchAll(lEntryPoint)) {
            // Shader entry point frame.
            const lShaderEntryPoint: ShaderEntryPointFunction = {
                type: EnumUtil.enumKeyByValue(WgslEntryPoint, lEntryPointMatch.groups!['entrytype'])!,
                name: lEntryPointMatch.groups!['name'],
                attributes: new Array<ShaderFunctionParameter>(),
                returnValue: null
            };

            // Parse result type.
            if (lEntryPointMatch.groups!['result']) {
                lShaderEntryPoint.returnValue = this.getVariableDescription(lEntryPointMatch.groups!['result']);
            }

            // Parse paramerer.
            if (lEntryPointMatch.groups!['parameter']) {
                const lEntryPointParameter: string = lEntryPointMatch.groups!['parameter'];

                // Generate property informations of every property.
                for (const lProperty of lEntryPointParameter.matchAll(/[^,{}<>]+(<.+>)?/gm)) {
                    const lVariableDescription = this.getVariableDescription(lProperty[0]);
                    lStructInformation.properties[lVariableDescription.name] = lVariableDescription; // TODO: Generate location 
                }
            }
        }

        // Get first entry point of each type.
        return {
            fragment: lEntryPointList.find(pEntryPoint => pEntryPoint.type === WgslEntryPoint.Fragment),
            vertex: lEntryPointList.find(pEntryPoint => pEntryPoint.type === WgslEntryPoint.Vertex),
            compute: lEntryPointList.find(pEntryPoint => pEntryPoint.type === WgslEntryPoint.Compute),
        };
    }

    /**
     * Create bind layout from shader code.
     * @param pSource - Shader source code as string.
     */
    public getBindGroups(pGpu: Gpu, pSource: string): BindGroups { // TODO: Store all BindGroup information without setting BindGroups
        // Regex for binding index, group index, modifier, variable name and type.
        const lBindInformationRegex: RegExp = /^\s*@group\((?<group>\d+)\)\s*@binding\((?<binding>\d+)\)\s+var(?:<(?<addressspace>[\w,\s]+)>)?\s*(?<name>\w+)\s*:\s*(?<type>[\w,\s<>]*[\w,<>]).*$/gm;

        const lBindInformationList: Array<BindGroupInformation> = new Array<BindGroupInformation>();

        // Get bind information for every group binding.
        let lMatch: RegExpExecArray | null;
        for (const lMatch of pSource.matchAll(lBindInformationRegex)) {
            lBindInformationList.push({ // With WgslTypeDescription
                groupIndex: parseInt(lMatch.groups!['group']),
                bindingIndex: parseInt(lMatch.groups!['binding']),
                addressSpace: <GPUBufferBindingType>lMatch.groups!['addressspace'] ?? null,
                variableName: lMatch.groups!['name'],
                typeDefinition: WgslTypeDictionary.typeDesciptionByString(lMatch.groups!['type'])
            });
        }

        // Group bind information by group and bind index.
        const lGroups: Dictionary<number, Array<BindGroupInformation>> = new Dictionary<number, Array<BindGroupInformation>>();
        for (const lBind of lBindInformationList) {
            let lGroupList: Array<BindGroupInformation> | undefined = lGroups.get(lBind.groupIndex);
            if (!lGroupList) {
                lGroupList = new Array<BindGroupInformation>();
                lGroups.set(lBind.groupIndex, lGroupList);
            }

            lGroupList.push(lBind);
        }

        // Available shader states based on entry points.
        // Not the best, but better than nothing.
        let lShaderStage: ShaderStage = 0;
        if (ShaderInformation.mComputeNameRegex.test(pSource)) {
            lShaderStage |= ShaderStage.Compute;
        }
        if (ShaderInformation.mFragmentNameRegex.test(pSource)) {
            lShaderStage |= ShaderStage.Fragment;
        }
        if (ShaderInformation.mVertexNameRegex.test(pSource)) {
            lShaderStage |= ShaderStage.Vertex;
        }

        // Add BindGroupInformation to bind group.
        const lBindGroups: BindGroups = new BindGroups(pGpu);
        for (const [lGroupIndex, lBindList] of lGroups) {
            const lBindGroup: BindGroupLayout = lBindGroups.addGroup(lGroupIndex);
            for (const lBind of lBindList) {
                ShaderInformation.setBindBasedOnType(lBindGroup, lBind, lShaderStage);
            }
        }

        return lBindGroups;
    }

    /**
     * Adds bind to bind group based on binding information.
     * @param pBindGroup - Bind group.
     * @param pBindInformation - Bind information.
     */
    private setBindBasedOnType(pBindGroup: BindGroupLayout, pBindInformation: BindGroupInformation, pShaderState: ShaderStage): void {
        // Buffer types.
        // Number, matrix, vector and array types.
        if ([...WgslTypeNumbers, ...WgslTypeMatrices, ...WgslTypeVectors, WgslType.Array, WgslType.Any].includes(pBindInformation.typeDefinition.type)) {
            // Validate address space.
            if (!pBindInformation.addressSpace) {
                throw new Exception(`Buffer bind type needs to be set for buffer bindings (${pBindInformation.variableName}).`, this);
            }

            // Bind 
            pBindGroup.addBuffer(pBindInformation.variableName, pBindInformation.bindingIndex, pShaderState, pBindInformation.addressSpace);

            // Exit.
            return;
        }

        // Bind only external textures.
        if (pBindInformation.typeDefinition.type === WgslType.TextureExternal) {
            // Bind.
            pBindGroup.addExternalTexture(pBindInformation.variableName, pBindInformation.bindingIndex, pShaderState);

            // Exit.
            return;
        }

        // Sampler types.
        else if ([WgslType.Sampler, WgslType.SamplerComparison].includes(pBindInformation.typeDefinition.type)) {
            // Sampler bind type by sampler or comparison type.
            if (pBindInformation.typeDefinition.type === WgslType.Sampler) {
                pBindGroup.addSampler(pBindInformation.variableName, pBindInformation.bindingIndex, pShaderState, 'filtering');
            } else if (pBindInformation.typeDefinition.type === WgslType.SamplerComparison) {
                pBindGroup.addSampler(pBindInformation.variableName, pBindInformation.bindingIndex, pShaderState, 'comparison');
            }

            // Exit.
            return;
        }

        // Storage texture.
        if (WgslTypeStorageTextures.includes(<WgslTypeStorageTexture>pBindInformation.typeDefinition.type)) {
            // Storage texture first generics is allways the texel format.
            const lTexelFormat: GPUTextureFormat = <WgslTypeTexelFormat>pBindInformation.typeDefinition.generics[0];
            const lTextureAccess: GPUStorageTextureAccess = 'write-only';
            const lTextureDimension: GPUTextureViewDimension = WgslTypeDictionary.texureDimensionFromType(<WgslTypeStorageTexture>pBindInformation.typeDefinition.type);

            // Bind storage texture.
            pBindGroup.addStorageTexture(pBindInformation.variableName, pBindInformation.bindingIndex, pShaderState, lTexelFormat, lTextureAccess, lTextureDimension);

            // Exit.
            return;
        }

        // Depth or color texture.
        if ([...WgslTypeTextures, ...WgslTypeDepthTextures].includes(<WgslTypeDepthTexture | WgslTypeTexture>pBindInformation.typeDefinition.type)) {
            const lTextureDimension: GPUTextureViewDimension = WgslTypeDictionary.texureDimensionFromType(<WgslTypeDepthTexture | WgslTypeTexture>pBindInformation.typeDefinition.type);
            const lTextureSampleType: GPUTextureSampleType = WgslTypeDictionary.textureSampleTypeFromGeneric(pBindInformation.typeDefinition);

            if ([WgslType.TextureMultisampled2d, WgslType.TextureDepthMultisampled2d].includes(pBindInformation.typeDefinition.type)) {
                pBindGroup.addTexture(pBindInformation.variableName, pBindInformation.bindingIndex, pShaderState, lTextureSampleType, lTextureDimension, true);
            } else {
                pBindGroup.addTexture(pBindInformation.variableName, pBindInformation.bindingIndex, pShaderState, lTextureSampleType, lTextureDimension, false);
            }

            // Exit.
            return;
        }

        throw new Exception(`Not implemented. Upps "${pBindInformation.typeDefinition.type}"`, this);
    }

    /**
     * Get struct information of struct name.
     * @param pSource - Source.
     * @param pStructName - Struct name.
     */
    private getStructDescription(pSource: string, pStructName: string): StructInformation {
        const lStuctRegex: RegExp = /^\s*struct\s+(?<name>\w+)\s*{(?<typeinfo>[^}]*)}$/smg;

        let lStructBody: string | null = null;

        // Find struct name and body.
        for (const lStructMatch of pSource.matchAll(lStuctRegex)) {
            if (lStructMatch.groups!['name'] === pStructName) {
                lStructBody = lStructMatch.groups!['typeinfo'];
                break;
            }
        }

        // Validate found struct body.
        if (!lStructBody) {
            throw new Exception(`Struct "${pStructName}" not found.`, this);
        }

        // Struct information frame.
        const lStructInformation: StructInformation = {
            name: pStructName,
            properties: {}
        };

        // Generate property informations of every property.
        for (const lProperty of lStructBody.matchAll(/[^,{}<>]+(<.+>)?/gm)) {
            const lVariableDescription = this.getVariableDescription(lProperty[0]);
            lStructInformation.properties[lVariableDescription.name!] = lVariableDescription;
        }

        return lStructInformation;
    }

    /**
     * Get full variable definition description.
     * Handles struct, bind and global type definitions with attributes.
     * @param pVariableDefinitionSource - Variable definition source code.
     */
    private getVariableDescription(pVariableDefinitionSource: string): WgslVariableDescription {
        const lVariableRegex: RegExp = /^\s*(?<attributes>(?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:var(?:<(?<access>[\w\s,]+)?>)?\s+)?(?:(?<variable>\w+)\s*:\s*)?(?<type>(?<typename>\w+)(?:<(?<generics>.+)>)?)/gm;

        // Match regex and validate match.
        const lMatch: RegExpMatchArray | null = pVariableDefinitionSource.match(lVariableRegex);
        if (!lMatch) {
            throw new Exception(`Can't parse variable definition "${pVariableDefinitionSource}"`, this);
        }

        // Parse optional attributes.
        const lWgslAttributeList: Array<WgslAttribute> = new Array<WgslAttribute>();
        if (lMatch.groups?.['attributes']) {
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

        // Parse optional cccess modifier.
        let lAccess: { addressSpace: WgslEnum; accessMode: WgslEnum | null; } | null = null;
        if (lMatch.groups?.['access']) {
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
        const lVariableName: string | null = lMatch.groups!['variable'] ?? null;

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
     * Get nested type definition from string.
     * Does validate allowed generic types of all depths.
     * @param pTypeString - Type string with optional nested generics.
     */
    private typeDescriptionByString(pTypeString: string): WgslTypeDescription {
        const lTypeRegex: RegExp = /^(?<typename>\w+)(?:<(?<generics>.+)>)?$/;
        const lGenericRegex: RegExp = /(?<generictype>(?:\w+(?:<.+>)?))[,\s]*/g;

        // Match type information.
        const lMatch: RegExpMatchArray | null = pTypeString.match(lTypeRegex);
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
            // Validate generic count.
            if (lTypeInformation.genericTypes.length !== lGenericList.length) {
                throw new Exception(`Generic count does not match definition (${lTypeInformation.genericTypes.length} => ${lGenericList.length})`, WgslTypeDictionary);
            }

            // Validate generics.
            for (let lGenericIndex: number = 0; lGenericIndex < lTypeInformation.genericTypes.length; lGenericIndex++) {
                // Target generic.
                const lTargetGeneric: WgslTypeDescription | WgslEnum = lGenericList[lGenericIndex];
                const lTargetGenericType: WgslType | WgslEnum = (typeof lTargetGeneric === 'string') ? lTargetGeneric : lTargetGeneric.type;

                // Valid generic types or enums.
                const lValidGenerics: Array<WgslType | WgslEnum> = lTypeInformation.genericTypes[lGenericIndex];

                // Compare valid list with set target generic.
                if (!lValidGenerics.includes(lTargetGenericType)) {
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

type StructInformation = {
    name: string,
    properties: { [VariableName: string]: WgslVariableDescription; };
};

type WgslVariableDescription = {
    name: string | null,
    type: WgslTypeDescription | WgslEnum | string;
    attributes: Array<WgslAttribute>;
    valueType: WgslValueType;
    access: { addressSpace: WgslEnum; accessMode: WgslEnum | null; } | null;
};

type WgslAttribute = {
    name: string;
    parameter: Array<string>;
};

type WgslTypeDescription = {
    type: WgslType;
    generics: Array<WgslTypeDescription | WgslEnum>;
};








type BindGroupInformation = {
    groupIndex: number;
    bindingIndex: number;
    addressSpace: GPUBufferBindingType | null;
    variableName: string;
    typeDefinition: WgslTypeDescription;
};

export type ShaderEntryPointFunction = {
    type: WgslEntryPoint;
    name: string,
    attributes: Array<ShaderFunctionParameter>;
    returnValue: WgslVariableDescription | null;
};

type ShaderFunctionParameter = {
    location: number | string;
    type: WgslTypeDescription;
};

type EntryPoints = {
    fragment?: ShaderEntryPointFunction | undefined;
    vertex?: ShaderEntryPointFunction | undefined;
    compute?: ShaderEntryPointFunction | undefined;
};