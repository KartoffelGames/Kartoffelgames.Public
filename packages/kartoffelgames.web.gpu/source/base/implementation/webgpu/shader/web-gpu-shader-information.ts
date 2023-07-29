import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core.data';
import { MemoryLayout } from '../../../base/memory_layout/memory-layout';
import { ShaderFunction, ShaderFunctionDefintion, ShaderInformation, ShaderStructDefinition, ShaderTypeDefinition, ShaderValue, ShaderValueDefinition } from '../../../base/shader/shader-information';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BufferBindType } from '../../../constant/buffer-bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryCopyType } from '../../../constant/memory-copy-type.enum';
import { SamplerType } from '../../../constant/sampler-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { WebGpuArrayBufferMemoryLayout } from '../memory_layout/buffer/web-gpu-array-buffer-memory-layout';
import { WebGpuStructBufferMemoryLayout } from '../memory_layout/buffer/web-gpu-struct-buffer-memory-layout';
import { WebGpuSamplerMemoryLayout } from '../memory_layout/web-gpu-sampler-memory-layout';
import { WebGpuDevice, WebGpuTypes } from '../web-gpu-device';
import { WgslAccessMode } from './wgsl_enum/wgsl-access-mode.enum';
import { WgslBindingType } from './wgsl_enum/wgsl-binding-type.enum';
import { WgslShaderStage } from './wgsl_enum/wgsl-shader-stage.enum';
import { WgslType } from './wgsl_enum/wgsl-type.enum';


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
        let lTag: ComputeStage = <ComputeStage>0;
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
        throw new Error('Method not implemented.');
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
                // var<addressSpace [,accessMode]>
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
            case WgslType.TextureCubeArray:
            case WgslType.TextureDepthCubeArray: {
                lDimension = TextureDimension.CubeArray;
                break;
            }
            default: {
                throw new Exception(`Texture type "${pParameter.type}" not supported for any texture dimension.`, null);
            }
        }

    }
}

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