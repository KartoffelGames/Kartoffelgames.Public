import { Exception } from '@kartoffelgames/core.data';
import { ShaderFunction, ShaderFunctionDefintion, ShaderInformation, ShaderStructDefinition, ShaderType, ShaderTypeDefinition, ShaderValue, ShaderValueDefinition } from '../../../base/shader/shader-information';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BufferBindType } from '../../../constant/buffer-bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { SamplerType } from '../../../constant/sampler-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { WebGpuArrayBufferMemoryLayout } from '../memory_layout/buffer/web-gpu-array-buffer-memory-layout';
import { WebGpuLinearBufferMemoryLayout } from '../memory_layout/buffer/web-gpu-linear-buffer-memory-layout';
import { WebGpuStructBufferMemoryLayout } from '../memory_layout/buffer/web-gpu-struct-buffer-memory-layout';
import { WebGpuSamplerMemoryLayout } from '../memory_layout/web-gpu-sampler-memory-layout';
import { WebGpuTextureMemoryLayout } from '../memory_layout/web-gpu-texture-memory-layout';
import { WebGpuDevice, WebGpuTypes } from '../web-gpu-device';
import { WgslBufferArrayTypes, WgslBufferLinearTypes, WgslSamplerTypes, WgslTextureTypes, WgslType } from './wgsl_enum/wgsl-type.enum';


export class WebGpuShaderInformation extends ShaderInformation<WebGpuTypes> {
    /**
     * Constructor.
     * @param pDevice - Gpu device reference.
     * @param pSource - Source code.
     */
    public constructor(pDevice: WebGpuDevice, pSource: string) {
        super(pDevice, pSource);
    }

    /**
     * Fetch al function definitions.
     * @param pSourceCode - Source code.
     */
    protected override fetchFunctionDefinitions(pSourceCode: string): Array<ShaderFunctionDefintion<WebGpuTypes>> {
        const lFunctionRegex: RegExp = /(?<attributes>(?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:\s)*?fn\s+(?<name>\w*)\s*\((?<parameter>(?:.|\r?\n)*?)\)(?:\s*->\s*(?<result>[^{]+))?\s*{/gm;

        const lFunctionList: Array<ShaderFunctionDefintion<WebGpuTypes>> = new Array<ShaderFunctionDefintion<WebGpuTypes>>();
        for (const lFunctionMatch of pSourceCode.matchAll(lFunctionRegex)) {
            const lFunctionName: string = lFunctionMatch.groups!['name'];
            const lFunctionResult: string = lFunctionMatch.groups!['result'];
            const lFunctionAttributes: string | null = lFunctionMatch.groups!['attributes'];
            const lFunctionParameter: string = lFunctionMatch.groups!['parameter'];

            // Fetch attributes.
            const lAttachments: Record<string, string> = {};
            if (lFunctionAttributes) {
                // Split string of multiple attributes.
                for (const lAttributeMatch of lFunctionAttributes.matchAll(/@(?<name>[\w])+\((?<value>[^)]*)\)/g)) {
                    const lAttributeName: string = lAttributeMatch.groups!['name'];
                    const lAttributeValue: string = lAttributeMatch.groups!['value'];

                    // Add each attribute as value attachment.
                    lAttachments[lAttributeName] = lAttributeValue;
                }
            }

            // Cut source code after function head match. Head includes first bracket.
            const lFunctionBodyStart: string = pSourceCode.slice(lFunctionMatch.index! + lFunctionMatch[0].length);


            const lBracketRegex: RegExp = /(?:".*?"|'.*?'|\/\*.*?\*\/|\/\/.*?$)|(?<bracket>{|})/gms;

            // Read function body. Match opening and closing brackets. Count layers and find exit bracket. 
            let lBracketLayer: number = 1;
            let lClosingBracketIndex: number = -1;
            let lBracketMatch: RegExpExecArray | null;
            while ((lBracketMatch = lBracketRegex.exec(lFunctionBodyStart)) !== null) {
                if (lBracketMatch.groups?.['bracket']) {
                    const lBracket: string = lBracketMatch.groups['bracket'];

                    // Count closing and opening layers.
                    if (lBracket === '{') {
                        lBracketLayer++;
                    } else {
                        lBracketLayer--;

                        // Exit search on exiting last layer.
                        if (lBracketLayer === 0) {
                            lClosingBracketIndex = lBracketMatch.index;
                            break;
                        }
                    }
                }
            }

            // Validate found closing bracket.
            if (lClosingBracketIndex < 0) {
                throw new Exception(`Error closing function "${lFunctionName}"`, this);
            }

            // Cut string on opening and exit braket.
            const lFunctionBody: string = lFunctionBodyStart.slice(0, lClosingBracketIndex);

            // Fetch Parameter.
            const lParameterVariableList: Array<ShaderValueDefinition<WebGpuTypes>> = this.fetchVariableDefinitions(lFunctionParameter);

            // Fetch result type.
            const lReturnTypes: ShaderValueDefinition<WebGpuTypes> = this.fetchVariableDefinitions(lFunctionResult).at(0)!;

            lFunctionList.push({
                name: lFunctionName,
                returnType: lReturnTypes,
                parameter: lParameterVariableList,
                attachments: lAttachments,
                body: lFunctionBody
            });
        }

        return lFunctionList;
    }

    /**
     * Fetch all struct definitions of shader.
     * @param pSourceCode - Shader source code.
     */
    protected override fetchStructDefinitions(pSourceCode: string): Array<ShaderStructDefinition<WebGpuTypes>> {
        const lStuctRegex: RegExp = /^\s*struct\s+(?<name>\w+)\s*{(?<typeinfo>[^}]*)}$/smg;

        // Fetch all found structs.
        const lStructDefinitionList: Array<ShaderStructDefinition<WebGpuTypes>> = new Array<ShaderStructDefinition<WebGpuTypes>>();
        for (const lStructMatch of pSourceCode.matchAll(lStuctRegex)) {
            const lStructName: string = lStructMatch.groups!['name'];
            const lStructBody: string = lStructMatch.groups!['typeinfo'];

            lStructDefinitionList.push({
                name: lStructName,
                properies: this.fetchVariableDefinitions(lStructBody)
            });
        }

        return lStructDefinitionList;
    }

    /**
     * Fetch all global bindings.
     * @param pSourceCode - Source code.
     */
    protected override fetchValueDefinitions(pSourceCode: string): Array<ShaderValueDefinition<WebGpuTypes>> {
        // Get only lines with group attributes.
        const lAllGroupLines: string = [...pSourceCode.matchAll(/^.*@group.*$/gm)].reduce((pCurrent, pLine) => {
            return pCurrent + pLine[0];
        }, '');

        return this.fetchVariableDefinitions(lAllGroupLines);
    }

    /**
     * Convert definition into function.
     * @param pDefinition - Function definitions.
     */
    protected override functionFromDefinition(pDefinition: ShaderFunctionDefintion<WebGpuTypes>): ShaderFunction<WebGpuTypes> {
        // Create memory layouts
        const lParameter: Array<WebGpuTypes['memoryLayout']> = pDefinition.parameter.map((pParameterDefintion) => { return this.valueFromDefinition(pParameterDefintion).value; });
        const lReturnType: WebGpuTypes['memoryLayout'] = this.valueFromDefinition(pDefinition.returnType).value;

        // Read tags from attachments.
        let lTag: ComputeStage = ComputeStage.None;
        if (pDefinition.attachments['vertex']) {
            lTag |= ComputeStage.Vertex;
        }
        if (pDefinition.attachments['fragment']) {
            lTag |= ComputeStage.Fragment;
        }
        if (pDefinition.attachments['compute']) {
            lTag |= ComputeStage.Compute;
        }

        // "Calculate" used globals by using deep mathematic learning block chain algorithms.
        const lUsedGlobals: Array<string> = new Array<string>();
        for (const lGoblaValue of this.fetchValueDefinitions(this.source)) {
            if (pDefinition.body.includes(lGoblaValue.name)) {
                lUsedGlobals.push(lGoblaValue.name);
            }
        }

        return {
            name: pDefinition.name,
            tag: lTag,
            parameter: lParameter,
            return: lReturnType,
            usedGlobals: lUsedGlobals
        };
    }

    /**
     * Setup shader types.
     * @param pAddType - Add type callback.
     */
    protected override setupShaderTypes(pAddType: (pType: ShaderTypeDefinition) => void): void {
        // Scalar types.
        pAddType({ name: WgslType.Boolean, variants: [{ size: 1, align: 1 }] });

        pAddType({ name: WgslType.Integer32, variants: [{ size: 4, align: 4 }] });
        pAddType({ name: WgslType.UnsignedInteger32, variants: [{ size: 4, align: 4 }] });
        pAddType({ name: WgslType.Float32, variants: [{ size: 4, align: 4 }] });
        pAddType({ name: WgslType.Float16, variants: [{ size: 2, align: 2 }] });

        // Vector types.
        pAddType({
            name: WgslType.Vector2, variants: [
                { size: 8, align: 8, generic: [WgslType.Integer32] },
                { size: 8, align: 8, generic: [WgslType.UnsignedInteger32] },
                { size: 8, align: 8, generic: [WgslType.Float32] },
                { size: 4, align: 4, generic: [WgslType.Float16] }
            ]
        });
        pAddType({
            name: WgslType.Vector3, variants: [
                { size: 12, align: 16, generic: [WgslType.Integer32] },
                { size: 12, align: 16, generic: [WgslType.UnsignedInteger32] },
                { size: 12, align: 16, generic: [WgslType.Float32] },
                { size: 6, align: 8, generic: [WgslType.Float16] }
            ]
        });
        pAddType({
            name: WgslType.Vector4, variants: [
                { size: 16, align: 16, generic: [WgslType.Integer32] },
                { size: 16, align: 16, generic: [WgslType.UnsignedInteger32] },
                { size: 16, align: 16, generic: [WgslType.Float32] },
                { size: 8, align: 8, generic: [WgslType.Float16] }
            ]
        });

        // Matrix types. // TODO: Type alias.
        pAddType({
            name: WgslType.Matrix22, variants: [
                { size: 16, align: 8, generic: [WgslType.Integer32] },
                { size: 16, align: 8, generic: [WgslType.UnsignedInteger32] },
                { size: 16, align: 8, aliases: ['mat2x2f'], generic: [WgslType.Float32] },
                { size: 8, align: 4, aliases: ['mat2x2h'], generic: [WgslType.Float16] }
            ]
        });
        pAddType({
            name: WgslType.Matrix23, variants: [
                { size: 32, align: 16, generic: [WgslType.Integer32] },
                { size: 32, align: 16, generic: [WgslType.UnsignedInteger32] },
                { size: 32, align: 16, aliases: ['mat2x3f'], generic: [WgslType.Float32] },
                { size: 16, align: 8, aliases: ['mat2x3h'], generic: [WgslType.Float16] }
            ]
        });
        pAddType({
            name: WgslType.Matrix24, variants: [
                { size: 32, align: 16, generic: [WgslType.Integer32] },
                { size: 32, align: 16, generic: [WgslType.UnsignedInteger32] },
                { size: 32, align: 16, aliases: ['mat2x4f'], generic: [WgslType.Float32] },
                { size: 16, align: 8, aliases: ['mat2x4h'], generic: [WgslType.Float16] }
            ]
        });
        pAddType({
            name: WgslType.Matrix32, variants: [
                { size: 24, align: 8, generic: [WgslType.Integer32] },
                { size: 24, align: 8, generic: [WgslType.UnsignedInteger32] },
                { size: 24, align: 8, aliases: ['mat3x2f'], generic: [WgslType.Float32] },
                { size: 12, align: 4, aliases: ['mat3x2h'], generic: [WgslType.Float16] }
            ]
        });
        pAddType({
            name: WgslType.Matrix33, variants: [
                { size: 48, align: 16, generic: [WgslType.Integer32] },
                { size: 48, align: 16, generic: [WgslType.UnsignedInteger32] },
                { size: 48, align: 16, aliases: ['mat3x3f'], generic: [WgslType.Float32] },
                { size: 24, align: 8, aliases: ['mat3x3h'], generic: [WgslType.Float16] }
            ]
        });
        pAddType({
            name: WgslType.Matrix34, variants: [
                { size: 48, align: 16, generic: [WgslType.Integer32] },
                { size: 48, align: 16, generic: [WgslType.UnsignedInteger32] },
                { size: 48, align: 16, aliases: ['mat3x4f'], generic: [WgslType.Float32] },
                { size: 24, align: 8, aliases: ['mat3x4h'], generic: [WgslType.Float16] }
            ]
        });
        pAddType({
            name: WgslType.Matrix42, variants: [
                { size: 32, align: 8, generic: [WgslType.Integer32] },
                { size: 32, align: 8, generic: [WgslType.UnsignedInteger32] },
                { size: 32, align: 8, aliases: ['mat4x2f'], generic: [WgslType.Float32] },
                { size: 16, align: 4, aliases: ['mat4x2h'], generic: [WgslType.Float16] }
            ]
        });
        pAddType({
            name: WgslType.Matrix43, variants: [
                { size: 64, align: 16, generic: [WgslType.Integer32] },
                { size: 64, align: 16, generic: [WgslType.UnsignedInteger32] },
                { size: 64, align: 16, aliases: ['mat4x3f'], generic: [WgslType.Float32] },
                { size: 32, align: 8, aliases: ['mat4x3h'], generic: [WgslType.Float16] }
            ]
        });
        pAddType({
            name: WgslType.Matrix44, variants: [
                { size: 64, align: 16, generic: [WgslType.Integer32] },
                { size: 64, align: 16, generic: [WgslType.UnsignedInteger32] },
                { size: 64, align: 16, aliases: ['mat4x4f'], generic: [WgslType.Float32] },
                { size: 32, align: 8, aliases: ['mat4x4h'], generic: [WgslType.Float16] }
            ]
        });

        // Bundled types.
        pAddType({
            name: WgslType.Array, variants: [
                { size: -1, align: -1, generic: ['*'] },
                { size: -1, align: -1, generic: ['*', '*'] }
            ]
        });

        // Specials
        pAddType({
            name: WgslType.Atomic, variants: [
                { size: 4, align: 4, generic: [WgslType.Integer32] },
                { size: 4, align: 4, generic: [WgslType.UnsignedInteger32] }
            ]
        });

        // Image textures.
        pAddType({ name: WgslType.Texture1d, variants: [{ size: -1, align: -1, generic: ['*'] }] });
        pAddType({ name: WgslType.Texture2d, variants: [{ size: -1, align: -1, generic: ['*'] }] });
        pAddType({ name: WgslType.Texture2dArray, variants: [{ size: -1, align: -1, generic: ['*'] }] });
        pAddType({ name: WgslType.Texture3d, variants: [{ size: -1, align: -1, generic: ['*'] }] });
        pAddType({ name: WgslType.TextureCube, variants: [{ size: -1, align: -1, generic: ['*'] }] });
        pAddType({ name: WgslType.TextureCubeArray, variants: [{ size: -1, align: -1, generic: ['*'] }] });
        pAddType({ name: WgslType.TextureMultisampled2d, variants: [{ size: -1, align: -1, generic: ['*'] }] });

        // External tetures.
        pAddType({ name: WgslType.TextureExternal, variants: [{ size: -1, align: -1, generic: [] }] });

        // Storage textures.
        pAddType({ name: WgslType.TextureStorage1d, variants: [{ size: -1, align: -1, generic: ['*', '*'] }] });
        pAddType({ name: WgslType.TextureStorage2d, variants: [{ size: -1, align: -1, generic: ['*', '*'] }] });
        pAddType({ name: WgslType.TextureStorage2dArray, variants: [{ size: -1, align: -1, generic: ['*', '*'] }] });
        pAddType({ name: WgslType.TextureStorage3d, variants: [{ size: -1, align: -1, generic: ['*', '*'] }] });

        // Depth Textures.
        pAddType({ name: WgslType.TextureDepth2d, variants: [{ size: -1, align: -1, generic: [] }] });
        pAddType({ name: WgslType.TextureDepth2dArray, variants: [{ size: -1, align: -1, generic: [] }] });
        pAddType({ name: WgslType.TextureDepthCube, variants: [{ size: -1, align: -1, generic: [] }] });
        pAddType({ name: WgslType.TextureDepthCubeArray, variants: [{ size: -1, align: -1, generic: [] }] });
        pAddType({ name: WgslType.TextureDepthMultisampled2d, variants: [{ size: -1, align: -1, generic: [] }] });

        // Sampler
        pAddType({ name: WgslType.Sampler, variants: [{ size: -1, align: -1, generic: [] }] });
        pAddType({ name: WgslType.SamplerComparison, variants: [{ size: -1, align: -1, generic: [] }] });

        // Reference and Pointer Types.
        pAddType({ name: WgslType.Reference, variants: [{ size: -1, align: -1, generic: ['*', '*', '*'] }] });
        pAddType({ name: WgslType.Pointer, variants: [{ size: -1, align: -1, generic: ['*', '*', '*'] }] });
    }


    protected override valueFromDefinition(pValueDefinition: ShaderValueDefinition<WebGpuTypes>): ShaderValue<WebGpuTypes> {
        const lDefinitionType: ShaderType<WebGpuTypes> = this.typeFor(pValueDefinition.name, pValueDefinition.typeGenerics);

        /*
         * Read generic settings.
         */

        // BufferBindType
        // Parameter is only an layout type that can happend when specifed as function return type of parameter.
        let lBufferBindType: BufferBindType = BufferBindType.Undefined;
        if (pValueDefinition.attachments['bindingType']) {
            const lBindingTypeEnum: 'uniform' | 'storage' = <'uniform' | 'storage'>pValueDefinition.attachments['bindingType'];
            switch (lBindingTypeEnum) {
                case 'uniform': {
                    lBufferBindType = BufferBindType.Uniform;
                    break;
                }
                case 'storage': {
                    lBufferBindType = BufferBindType.Storage;
                    break;
                }
            }
        }

        // Variable name.
        const lVariableName: string = pValueDefinition.name;

        // AccessMode
        let lAccessMode: AccessMode = AccessMode.None;
        if (pValueDefinition.attachments['accessMode']) {
            const lAccessEnum: 'read' | 'write' | 'read_write' = <'read' | 'write' | 'read_write'>pValueDefinition.attachments['accessMode'];
            switch (lAccessEnum) {
                case 'read': {
                    lAccessMode = AccessMode.Read;
                    break;
                }
                case 'write': {
                    lAccessMode = AccessMode.Write;
                    break;
                }
                case 'read_write': {
                    lAccessMode = AccessMode.Read | AccessMode.Write;
                    break;
                }
            }
        }

        // Visiblility.
        const lVisibility: ComputeStage = this.visibilityOf(lVariableName);

        // Group Index.
        const lGroupIndex: number | null = pValueDefinition.attachments['group'] ? parseInt(pValueDefinition.attachments['group']) : null;

        // Binding Index.
        const lBindingIndex: number | null = pValueDefinition.attachments['binding'] ? parseInt(pValueDefinition.attachments['binding']) : null;

        // Parameter Index.
        const lParameterIndex: number | null = pValueDefinition.attachments['location'] ? parseInt(pValueDefinition.attachments['location']) : null;

        /*
         * Convert different  
         */

        // Struct.
        if (lDefinitionType.type === 'struct') {
            const lStructMemoryLayout: WebGpuStructBufferMemoryLayout = new WebGpuStructBufferMemoryLayout(this.device, {
                structName: lDefinitionType.struct.name,
                bindType: lBufferBindType,
                access: lAccessMode,
                memoryIndex: (lBindingIndex === null && lParameterIndex === null) ? null : {
                    binding: lBindingIndex,
                    parameter: lParameterIndex,
                },
                name: lVariableName,
                visibility: lVisibility
            });

            for (let lPropertyIndex: number = 0; lPropertyIndex < lDefinitionType.struct.properties.length; lPropertyIndex++) {
                const lProperty: ShaderValue<WebGpuTypes> = lDefinitionType.struct.properties[lPropertyIndex];
                lStructMemoryLayout.addProperty(lPropertyIndex, <WebGpuTypes['bufferMemoryLayout']>lProperty.value);
            }

            return {
                group: lGroupIndex,
                value: lStructMemoryLayout
            };
        }

        // Sampler
        if (WgslSamplerTypes.includes(<any>lDefinitionType.typeName)) {
            const lSamplerType: SamplerType = (lDefinitionType.typeName === WgslType.Sampler) ? SamplerType.Filter : SamplerType.Comparison;

            const lSamplerMemoryLayout: WebGpuSamplerMemoryLayout = new WebGpuSamplerMemoryLayout(this.device, {
                samplerType: lSamplerType,
                access: lAccessMode,
                memoryIndex: (lBindingIndex === null && lParameterIndex === null) ? null : {
                    binding: lBindingIndex,
                    parameter: lParameterIndex,
                },
                name: lVariableName,
                visibility: lVisibility
            });

            return {
                group: lGroupIndex,
                value: lSamplerMemoryLayout
            };
        }

        // Array buffer.
        if (WgslBufferArrayTypes.includes(<any>lDefinitionType.typeName)) {
            let lArraySize: number = -1;
            if (pValueDefinition.typeGenerics.length === 2) {
                const lArraySizeGeneric: string = pValueDefinition.typeGenerics[1];
                lArraySize = parseInt(lArraySizeGeneric);

                // Validate size generic.
                if (isNaN(lArraySize)) {
                    throw new Exception(`Wrong size generic "${lArraySizeGeneric}" on array type.`, this);
                }
            }

            // Read inner type from generic.
            const lInnerTypeDefinition: ShaderValueDefinition<WebGpuTypes> = this.fetchVariableDefinitions(pValueDefinition.typeGenerics[0])[0];
            const lInnerType: ShaderValue<WebGpuTypes> = this.valueFromDefinition(lInnerTypeDefinition);

            const lArrayMemoryLayout: WebGpuArrayBufferMemoryLayout = new WebGpuArrayBufferMemoryLayout(this.device, {
                arraySize: lArraySize,
                innerType: <WebGpuTypes['bufferMemoryLayout']>lInnerType.value,
                bindType: lBufferBindType,
                access: lAccessMode,
                memoryIndex: (lBindingIndex === null && lParameterIndex === null) ? null : {
                    binding: lBindingIndex,
                    parameter: lParameterIndex,
                },
                name: lVariableName,
                visibility: lVisibility
            });

            return {
                group: lGroupIndex,
                value: lArrayMemoryLayout
            };
        }

        // Linear buffer.
        if (WgslBufferLinearTypes.includes(<any>lDefinitionType.typeName)) {
            const lLinearBufferLayout = new WebGpuLinearBufferMemoryLayout(this.device, {
                size: lDefinitionType.size,
                alignment: lDefinitionType.align,
                bindType: lBufferBindType,
                access: lAccessMode,
                memoryIndex: (lBindingIndex === null && lParameterIndex === null) ? null : {
                    binding: lBindingIndex,
                    parameter: lParameterIndex,
                },
                name: lVariableName,
                visibility: lVisibility
            });

            return {
                group: lGroupIndex,
                value: lLinearBufferLayout
            };
        }

        // Textures.
        if (WgslTextureTypes.includes(<any>lDefinitionType.typeName)) {
            const lTextureLayout = new WebGpuTextureMemoryLayout(this.device, {
                dimension: this.textureDimensionFromType(<WgslTextureTypes><any>lDefinitionType.typeName),
                format,
                usage,
                bindType,
                multisampleLevel,
                access: lAccessMode,
                memoryIndex: (lBindingIndex === null && lParameterIndex === null) ? null : {
                    binding: lBindingIndex,
                    parameter: lParameterIndex,
                },
                name: lVariableName,
                visibility: lVisibility
            });

            return {
                group: lGroupIndex,
                value: lTextureLayout
            };
        }

        // Unsupported behaviour.
        throw new Exception(`Shader value "${pValueDefinition.name}" has an unsupported type.`, this);
    }

    /**
     * Find all variable definitions and fetch data.
     * @param pSourceSnipped - Source snipped with variables.
     */
    private fetchVariableDefinitions(pSourceSnipped: string): Array<ShaderValueDefinition<WebGpuTypes>> {
        const lDefinitionRegex: RegExp = /(?<attributes>(?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:var(?:<(?<access>[\w\s,]+)?>)?\s+)?(?:(?<variable>\w+)\s*:\s*)?(?<type>(?<typename>\w+)(?:<(?<generics>[<>\w\s,]+)>)?)/gm;

        const lVariableList: Array<ShaderValueDefinition<WebGpuTypes>> = new Array<ShaderValueDefinition<WebGpuTypes>>();
        for (const lDefinitionMatch of pSourceSnipped.matchAll(lDefinitionRegex)) {
            const lVariableTypeName: string = lDefinitionMatch.groups!['typename'];
            const lVariableName: string = lDefinitionMatch.groups!['variable'] ?? '';
            const lVariableAttributes: string | null = lDefinitionMatch.groups!['attributes'];
            const lVariableAccess: string | null = lDefinitionMatch.groups!['access'];
            const lVariableGenerics: string | null = lDefinitionMatch.groups!['generics'];

            const lAttachments: Record<string, string> = {};

            // Fetch attributes.
            if (lVariableAttributes) {
                // Split string of multiple attributes.
                for (const lAttributeMatch of lVariableAttributes.matchAll(/@(?<name>[\w])+\((?<value>[^)]*)\)/g)) {
                    const lAttributeName: string = lAttributeMatch.groups!['name'];
                    const lAttributeValue: string = lAttributeMatch.groups!['value'];

                    // Add each attribute as value attachment.
                    lAttachments[lAttributeName] = lAttributeValue;
                }
            }

            // Parse optional acccess modifier.
            if (lVariableAccess) {
                // var<bindType|addressSpace [,accessMode]> => var<storage, read>
                const lAccessList: Array<string> = lVariableAccess.split(',').map((pValue: string) => pValue.trim()).filter((pValue: string) => pValue.length);

                // Add bind type attachment.
                lAttachments['bindingType'] = lAccessList[0];

                // Add optional accessMode attachment.
                if (lAccessList[1]) {
                    lAttachments['accessMode'] = lAccessList[1];
                }
            }

            // Split generic types.
            const lGenericList: Array<string> = new Array<string>();
            if (lVariableGenerics) {
                for (const lGenericMatch of lVariableGenerics.matchAll(/(?<generictype>(?:\w+(?:<.+>)?))[,\s]*/g)) {
                    lGenericList.push(lGenericMatch.groups!['generictype']);
                }
            }

            lVariableList.push({
                name: lVariableName,
                type: this.typeFor(lVariableTypeName, lGenericList),
                typeGenerics: lGenericList,
                attachments: lAttachments,
            });
        }

        return lVariableList;
    }

    /**
     * Read texture dimension from texture type.
     * @param pTextureType - Texture type.
     */
    private textureDimensionFromType(pTextureType: WgslTextureTypes): TextureDimension {
        // Map every texture type for view dimension.
        switch (pTextureType) {
            case WgslType.Texture1d:
            case WgslType.TextureStorage1d: {
                return TextureDimension.OneDimension;
            }
            case WgslType.TextureDepth2d:
            case WgslType.Texture2d:
            case WgslType.TextureStorage2d:
            case WgslType.TextureDepthMultisampled2d:
            case WgslType.TextureMultisampled2d: {
                return TextureDimension.TwoDimension;
            }
            case WgslType.TextureDepth2dArray:
            case WgslType.Texture2dArray:
            case WgslType.TextureStorage2dArray: {
                return TextureDimension.TwoDimensionArray;
            }
            case WgslType.Texture3d:
            case WgslType.TextureStorage3d: {
                return TextureDimension.ThreeDimension;
            }
            case WgslType.TextureCube:
            case WgslType.TextureDepthCube: {
                return TextureDimension.Cube;
            }
            case WgslType.TextureCubeArray:
            case WgslType.TextureDepthCubeArray: {
                return TextureDimension.CubeArray;
            }
            default: {
                throw new Exception(`Texture type "${pTextureType}" not supported for any texture dimension.`, null);
            }
        }
    }
}