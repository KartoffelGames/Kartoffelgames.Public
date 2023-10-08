import { Exception } from '@kartoffelgames/core.data';
import { BaseMemoryLayout } from '../base/memory_layout/base-memory-layout';
import { ArrayBufferMemoryLayout } from '../base/memory_layout/buffer/array-buffer-memory-layout';
import { BaseBufferMemoryLayout } from '../base/memory_layout/buffer/base-buffer-memory-layout';
import { LinearBufferMemoryLayout } from '../base/memory_layout/buffer/linear-buffer-memory-layout';
import { StructBufferMemoryLayout } from '../base/memory_layout/buffer/struct-buffer-memory-layout';
import { SamplerMemoryLayout } from '../base/memory_layout/sampler-memory-layout';
import { TextureMemoryLayout } from '../base/memory_layout/texture-memory-layout';
import { BaseShaderInterpreter, ShaderFunctionDefinition, ShaderValueDefinition, ShaderStructDefinition, ShaderFunction, ShaderTypeDefinition, ShaderValue, ShaderType } from '../base/shader/interpreter/base-shader-interpreter';
import { AccessMode } from '../constant/access-mode.enum';
import { BufferBindType } from '../constant/buffer-bind-type.enum';
import { BufferPrimitiveFormat } from '../constant/buffer-primitive-format';
import { ComputeStage } from '../constant/compute-stage.enum';
import { SamplerType } from '../constant/sampler-type.enum';
import { TextureBindType } from '../constant/texture-bind-type.enum';
import { TextureDimension } from '../constant/texture-dimension.enum';
import { TextureFormat } from '../constant/texture-format.enum';
import { WgslType, WgslSamplerTypes, WgslBufferArrayTypes, WgslBufferLinearTypes, WgslTextureTypes } from './wgsl_enum/wgsl-type.enum';


export class WebGpuShaderInterpreter extends BaseShaderInterpreter {
    /**
     * Fetch al function definitions.
     * @param pSourceCode - Source code.
     */
    protected override fetchFunctionDefinitions(pSourceCode: string): Array<ShaderFunctionDefinition> {
        const lFunctionRegex: RegExp = /(?<attributes>(?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:\s)*?fn\s+(?<name>\w*)\s*\((?<parameter>(?:.|\r?\n)*?)\)(?:\s*->\s*(?<result>[^{]+))?\s*{/gm;

        const lFunctionList: Array<ShaderFunctionDefinition> = new Array<ShaderFunctionDefinition>();
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
            const lParameterVariableList: Array<ShaderValueDefinition> = this.fetchVariableDefinitions(lFunctionParameter);

            // Fetch result type.
            const lReturnTypes: ShaderValueDefinition = this.fetchVariableDefinitions(lFunctionResult).at(0)!;

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
    protected override fetchStructDefinitions(pSourceCode: string): Array<ShaderStructDefinition> {
        const lStuctRegex: RegExp = /^\s*struct\s+(?<name>\w+)\s*{(?<typeinfo>[^}]*)}$/smg;

        // Fetch all found structs.
        const lStructDefinitionList: Array<ShaderStructDefinition> = new Array<ShaderStructDefinition>();
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
    protected override fetchValueDefinitions(pSourceCode: string): Array<ShaderValueDefinition> {
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
    protected override functionFromDefinition(pDefinition: ShaderFunctionDefinition): ShaderFunction {
        // Create memory layouts
        const lParameter: Array<BaseMemoryLayout> = pDefinition.parameter.map((pParameterDefintion) => { return this.valueFromDefinition(pParameterDefintion).value; });
        const lReturnType: BaseMemoryLayout = this.valueFromDefinition(pDefinition.returnType).value;

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
        for (const lGlobalValue of this.fetchValueDefinitions(this.source)) {
            if (pDefinition.body.includes(lGlobalValue.name)) {
                lUsedGlobals.push(lGlobalValue.name);
            }
        }

        const lAttachmentValueRexgex: RegExp = /".*?"|'.*?'|[^,"']+/g;

        // Save all attachments.
        const lAttachment: Record<string, Array<string>> = {};
        for (const lAttachmentName in pDefinition.attachments) {
            const lAttachmentValues: string = pDefinition.attachments[lAttachmentName];

            // Split values by comma. Filter every empty value.
            lAttachment[lAttachmentName] = [...lAttachmentValues.matchAll(lAttachmentValueRexgex)]
                .map((pMatch: RegExpMatchArray) => { return pMatch[0].trim(); })
                .filter((pValue: string) => { return pValue !== ''; });
        }

        return {
            name: pDefinition.name,
            entryPoints: lTag,
            parameter: lParameter,
            return: lReturnType,
            usedGlobals: lUsedGlobals,
            attachments: lAttachment
        };
    }

    /**
     * Setup shader types.
     * @param pAddType - Add type callback.
     */
    protected override setupShaderTypes(pAddType: (pType: ShaderTypeDefinition) => void): void {
        // Scalar types.
        pAddType({ name: WgslType.Boolean, variants: [{ size: 1, align: 1 }] });

        pAddType({ name: WgslType.Integer32, variants: [{ size: 4, align: 4, format: BufferPrimitiveFormat.Int }] });
        pAddType({ name: WgslType.UnsignedInteger32, variants: [{ size: 4, align: 4, format: BufferPrimitiveFormat.Uint }] });
        pAddType({ name: WgslType.Float32, variants: [{ size: 4, align: 4, format: BufferPrimitiveFormat.Float }] });
        pAddType({ name: WgslType.Float16, variants: [{ size: 2, align: 2 }] });

        // Vector types.
        pAddType({
            name: WgslType.Vector2, variants: [
                { size: 8, align: 8, generic: [WgslType.Integer32], format: BufferPrimitiveFormat.Vec2Int },
                { size: 8, align: 8, generic: [WgslType.UnsignedInteger32], format: BufferPrimitiveFormat.Vec2Uint },
                { size: 8, align: 8, generic: [WgslType.Float32], format: BufferPrimitiveFormat.Vec2Float },
                { size: 4, align: 4, generic: [WgslType.Float16] }
            ]
        });
        pAddType({
            name: WgslType.Vector3, variants: [
                { size: 12, align: 16, generic: [WgslType.Integer32], format: BufferPrimitiveFormat.Vec3Int },
                { size: 12, align: 16, generic: [WgslType.UnsignedInteger32], format: BufferPrimitiveFormat.Vec3Uint },
                { size: 12, align: 16, generic: [WgslType.Float32], format: BufferPrimitiveFormat.Vec3Float },
                { size: 6, align: 8, generic: [WgslType.Float16] }
            ]
        });
        pAddType({
            name: WgslType.Vector4, variants: [
                { size: 16, align: 16, generic: [WgslType.Integer32], format: BufferPrimitiveFormat.Vec4Int },
                { size: 16, align: 16, generic: [WgslType.UnsignedInteger32], format: BufferPrimitiveFormat.Vec4Uint },
                { size: 16, align: 16, generic: [WgslType.Float32], format: BufferPrimitiveFormat.Vec4Float },
                { size: 8, align: 8, generic: [WgslType.Float16] }
            ]
        });

        // Matrix types.
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

    /**
     * Create shader value from definition.
     * @param pValueDefinition - Shader value definition.
     */
    protected override valueFromDefinition(pValueDefinition: ShaderValueDefinition): ShaderValue {
        const lDefinitionType: ShaderType = this.typeFor(pValueDefinition.name, pValueDefinition.typeGenerics);

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

        // Binding Index.
        const lBindingIndex: number | null = pValueDefinition.attachments['binding'] ? parseInt(pValueDefinition.attachments['binding']) : null;
        const lParameterIndex: number | null = pValueDefinition.attachments['location'] ? parseInt(pValueDefinition.attachments['location']) : null;

        const lCreationParameter: ShaderValueCreationParameter = {
            valueDefinition: pValueDefinition,
            typeDefinition: lDefinitionType,
            accessMode: lAccessMode,
            bufferBindType: lBufferBindType,
            groupIndex: pValueDefinition.attachments['group'] ? parseInt(pValueDefinition.attachments['group']) : null,
            memoryIndex: {
                binding: lBindingIndex,
                location: lParameterIndex,
            },
            visibility: this.visibilityOf(pValueDefinition.name)
        };

        /*
         * Convert different memory layouts.
         */

        // Struct.
        if (lDefinitionType.type === 'struct') {
            return this.createStructBufferLayout(lCreationParameter);
        }

        // Sampler
        if (WgslSamplerTypes.includes(<any>lDefinitionType.typeName)) {
            return this.createSamplerLayout(lCreationParameter);
        }

        // Array buffer.
        if (WgslBufferArrayTypes.includes(<any>lDefinitionType.typeName)) {
            return this.createArrayBufferLayout(lCreationParameter);
        }

        // Linear buffer.
        if (WgslBufferLinearTypes.includes(<any>lDefinitionType.typeName)) {
            return this.createLinearBufferLayout(lCreationParameter);
        }

        // Textures.
        if (WgslTextureTypes.includes(<any>lDefinitionType.typeName)) {
            return this.createTextureLayout(lCreationParameter);
        }

        // Unsupported behaviour.
        throw new Exception(`Shader value "${pValueDefinition.name}" has an unsupported type.`, this);
    }

    /**
     * Create array buffer layout shader value.
     * @param pParameter - Creation parameter.
     */
    private createArrayBufferLayout(pParameter: ShaderValueCreationParameter): ShaderValue {
        let lArraySize: number = -1;
        if (pParameter.valueDefinition.typeGenerics.length === 2) {
            const lArraySizeGeneric: string = pParameter.valueDefinition.typeGenerics[1];
            lArraySize = parseInt(lArraySizeGeneric);

            // Validate size generic.
            if (isNaN(lArraySize)) {
                throw new Exception(`Wrong size generic "${lArraySizeGeneric}" on array type.`, this);
            }
        }

        // Read inner type from generic.
        const lInnerTypeDefinition: ShaderValueDefinition = this.fetchVariableDefinitions(pParameter.valueDefinition.typeGenerics[0])[0];
        const lInnerType: ShaderValue = this.valueFromDefinition(lInnerTypeDefinition);

        const lArrayMemoryLayout: ArrayBufferMemoryLayout = new ArrayBufferMemoryLayout(this.device, {
            arraySize: lArraySize,
            innerType: <BaseBufferMemoryLayout>lInnerType.value,
            bindType: pParameter.bufferBindType,
            access: pParameter.accessMode,
            bindingIndex: pParameter.memoryIndex.binding,
            name: pParameter.valueDefinition.name,
            visibility: pParameter.visibility
        });

        return {
            group: pParameter.groupIndex,
            value: lArrayMemoryLayout
        };
    }

    /**
     * Create linear buffer layout shader value.
     * @param pParameter - Creation parameter.
     */
    private createLinearBufferLayout(pParameter: ShaderValueCreationParameter): ShaderValue {
        if (pParameter.typeDefinition.type !== 'buildIn') {
            throw new Exception('Type not supported.', this);
        }

        const lLinearBufferLayout = new LinearBufferMemoryLayout(this.device, {
            size: pParameter.typeDefinition.size,
            alignment: pParameter.typeDefinition.align,
            bindType: pParameter.bufferBindType,
            access: pParameter.accessMode,
            bindingIndex: pParameter.memoryIndex.binding,
            locationIndex: pParameter.memoryIndex.location,
            name: pParameter.valueDefinition.name,
            visibility: pParameter.visibility,
            primitiveFormat: pParameter.typeDefinition.primitiveFormat ?? BufferPrimitiveFormat.Unsupported
        });

        return {
            group: pParameter.groupIndex,
            value: lLinearBufferLayout
        };
    }

    /**
     * Create sampler layout shader value.
     * @param pParameter - Creation parameter.
     */
    private createSamplerLayout(pParameter: ShaderValueCreationParameter): ShaderValue {
        if (pParameter.typeDefinition.type !== 'buildIn') {
            throw new Exception('Type not supported.', this);
        }

        const lSamplerType: SamplerType = (pParameter.typeDefinition.typeName === WgslType.Sampler) ? SamplerType.Filter : SamplerType.Comparison;

        const lSamplerMemoryLayout: SamplerMemoryLayout = new SamplerMemoryLayout(this.device, {
            samplerType: lSamplerType,
            access: pParameter.accessMode,
            bindingIndex: pParameter.memoryIndex.binding,
            name: pParameter.valueDefinition.name,
            visibility: pParameter.visibility
        });

        return {
            group: pParameter.groupIndex,
            value: lSamplerMemoryLayout
        };
    }

    /**
     * Create struct buffer layout shader value.
     * @param pParameter - Creation parameter.
     */
    private createStructBufferLayout(pParameter: ShaderValueCreationParameter): ShaderValue {
        if (pParameter.typeDefinition.type !== 'struct') {
            throw new Exception('Type not supported.', this);
        }

        const lStructMemoryLayout: StructBufferMemoryLayout = new StructBufferMemoryLayout(this.device, {
            structName: pParameter.typeDefinition.struct.name,
            bindType: pParameter.bufferBindType,
            access: pParameter.accessMode,
            bindingIndex: pParameter.memoryIndex.binding,
            name: pParameter.valueDefinition.name,
            visibility: pParameter.visibility
        });

        // Add all properties.
        for (let lPropertyIndex: number = 0; lPropertyIndex < pParameter.typeDefinition.struct.properties.length; lPropertyIndex++) {
            const lProperty: ShaderValue = pParameter.typeDefinition.struct.properties[lPropertyIndex];
            lStructMemoryLayout.addProperty(lPropertyIndex, <BaseBufferMemoryLayout>lProperty.value);
        }

        return {
            group: pParameter.groupIndex,
            value: lStructMemoryLayout
        };
    }

    /**
     * Create struct buffer layout shader value.
     * @param pParameter - Creation parameter.
     */
    private createTextureLayout(pParameter: ShaderValueCreationParameter): ShaderValue {
        if (pParameter.typeDefinition.type !== 'buildIn') {
            throw new Exception('Type not supported.', this);
        }

        const lTextureWgslType: WgslTextureTypes = <any>pParameter.typeDefinition.typeName;

        // Uses multisamples or not.
        const lUsesMultisample: boolean = (lTextureWgslType === WgslType.TextureMultisampled2d || lTextureWgslType === WgslType.TextureDepthMultisampled2d);

        const lTextureLayout = new TextureMemoryLayout(this.device, {
            dimension: this.textureDimensionFromType(lTextureWgslType),
            format: this.textureDefaultFormatFromType(lTextureWgslType),
            bindType: this.textureBindTypeFromType(lTextureWgslType),
            multisampled: lUsesMultisample,
            access: pParameter.accessMode,
            bindingIndex: pParameter.memoryIndex.binding,
            name: pParameter.valueDefinition.name,
            visibility: pParameter.visibility
        });

        return {
            group: pParameter.groupIndex,
            value: lTextureLayout
        };
    }

    /**
     * Find all variable definitions and fetch data.
     * @param pSourceSnipped - Source snipped with variables.
     */
    private fetchVariableDefinitions(pSourceSnipped: string): Array<ShaderValueDefinition> {
        const lDefinitionRegex: RegExp = /(?<attributes>(?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:var(?:<(?<access>[\w\s,]+)?>)?\s+)?(?:(?<variable>\w+)\s*:\s*)?(?<type>(?<typename>\w+)(?:<(?<generics>[<>\w\s,]+)>)?)/gm;

        const lVariableList: Array<ShaderValueDefinition> = new Array<ShaderValueDefinition>();
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
     * Read texture bind type from texture wgsl type. 
     * @param pTextureType - Texture wgsl type.
     * @returns 
     */
    private textureBindTypeFromType(pTextureType: WgslTextureTypes): TextureBindType {
        // Map every texture type for bind type.
        switch (pTextureType) {
            case WgslType.TextureExternal: {
                return TextureBindType.External;
            }

            case WgslType.TextureStorage1d:
            case WgslType.TextureStorage2d:
            case WgslType.TextureStorage2dArray:
            case WgslType.TextureStorage3d: {
                return TextureBindType.Storage;
            }

            case WgslType.Texture1d:
            case WgslType.TextureDepth2d:
            case WgslType.Texture2d:
            case WgslType.TextureDepthMultisampled2d:
            case WgslType.TextureMultisampled2d:
            case WgslType.TextureDepth2dArray:
            case WgslType.Texture2dArray:
            case WgslType.Texture3d:
            case WgslType.TextureCube:
            case WgslType.TextureDepthCube:
            case WgslType.TextureCubeArray:
            case WgslType.TextureDepthCubeArray: {
                return TextureBindType.Images;
            }

            default: {
                throw new Exception(`Texture type "${pTextureType}" not supported for any texture bind type.`, null);
            }
        }
    }

    /**
     * Work in process texture format from texture type.
     * @param pTextureType - Texture type.
     */
    private textureDefaultFormatFromType(pTextureType: WgslTextureTypes): TextureFormat {
        // Map every texture type for view dimension.
        switch (pTextureType) {
            case WgslType.Texture1d:
            case WgslType.TextureStorage1d:
            case WgslType.Texture2d:
            case WgslType.TextureStorage2d:
            case WgslType.TextureMultisampled2d:
            case WgslType.TextureExternal:
            case WgslType.Texture2dArray:
            case WgslType.TextureStorage2dArray:
            case WgslType.Texture3d:
            case WgslType.TextureStorage3d:
            case WgslType.TextureCube:
            case WgslType.TextureCubeArray: {
                return TextureFormat.BlueRedGreenAlpha;
            }

            case WgslType.TextureDepth2dArray:
            case WgslType.TextureDepthCubeArray:
            case WgslType.TextureDepthCube:
            case WgslType.TextureDepthMultisampled2d:
            case WgslType.TextureDepth2d: {
                return TextureFormat.DepthStencil;
            }

            default: {
                throw new Exception(`Texture type "${pTextureType}" not supported for any texture dimension.`, null);
            }
        }
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
            case WgslType.TextureMultisampled2d:
            case WgslType.TextureExternal: {
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

type ShaderValueCreationParameter = {
    typeDefinition: ShaderType;
    valueDefinition: ShaderValueDefinition;
    bufferBindType: BufferBindType;
    accessMode: AccessMode;
    visibility: ComputeStage;
    groupIndex: number | null;
    memoryIndex: {
        binding: number | null;
        location: number | null;
    };
};