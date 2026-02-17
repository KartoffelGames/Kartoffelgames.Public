import { Exception } from '@kartoffelgames/core';
import { PgslParser, type PgslParserResult, type PgslParserResultBinding, type PgslParserResultType, WgslTranspiler } from '@kartoffelgames/core-pgsl';
import { BufferItemFormat, BufferItemMultiplier, ComputeStage, type GpuDevice, Shader, StorageBindingType, type TextureFormat, type TextureViewDimension } from '@kartoffelgames/web-gpu';
import type { PgslParserResultSamplerType } from '../../../../kartoffelgames.core.pgsl/source/parser_result/type/pgsl-parser-result-sampler-type.ts';
import type { ShaderSetup } from '../../../../kartoffelgames.web.gpu/source/shader/setup/shader-setup.ts';

// TODO: Allow to load from source-code and to save it as a serializeable object.
// TODO: Allow to load it from the serializeable object.


export class ShaderObject {
    private static readonly mPgslParser: PgslParser = new PgslParser();
    private static readonly mTranspiler: WgslTranspiler = new WgslTranspiler();

    private readonly mMeta: ShaderObjectMeta;
    private readonly mShader: Shader;

    public constructor(pDevice: GpuDevice, pSource: string) {
        const lParserResult: PgslParserResult = ShaderObject.mPgslParser.transpile(pSource, ShaderObject.mTranspiler);

        // Create meta.
        this.mMeta = {
            parameter: new Array<string>(),
            bindings: new Array<ShaderObjectMetaBindingGroup>()
        };

        // Add parameter to meta.
        for (const lParameter of lParserResult.parameters) {
            this.mMeta.parameter.push(lParameter.name);
        }

        // Add bindings to meta.
        this.mMeta.bindings = this.convertBindingGroups(lParserResult.bindings);

        // Save parser result parts.
        this.mShader = new Shader(pDevice, lParserResult.source).setup((pSetup: ShaderSetup) => {
            // Setup parameters.
            for (const lParameter of this.mMeta.parameter) {
                pSetup.parameter(lParameter, ComputeStage.Vertex, ComputeStage.Fragment, ComputeStage.Compute);
            }

            // Setup bindings
            for (const lBindingGroupIndexString in this.mMeta.bindings) {
                const lBindingGroupIndex: number = parseInt(lBindingGroupIndexString);
                if (isNaN(lBindingGroupIndex)) {
                    continue;
                }

                // const lBindingGroup: ShaderObjectMetaBindingGroup = this.mMeta.bindings[lBindingGroupIndex];

                // TODO: Create or read predefined binding group.
                //pSetup.group(lBindingGroupIndex, this.mMeta.bindings[lBindingGroupIndex].name);
            }
        });

        // TODO: It should be a good idea to generate layout for any shit in the parser result without exporting any parser stuff.

        // TODO: Generate a exportable meta from parser result and than call new (Gpu)Shader().Setup() where the meta can be imported.
    }

    private convertBindingGroups(pBindings: ReadonlyArray<PgslParserResultBinding>): ShaderObjectMetaBindingGroups {
        const lBindingGroups: ShaderObjectMetaBindingGroups = {};

        // Add bindings to meta.
        for (const lBindingGroup of pBindings) {
            // Try to find binding group.
            let lMetaBindingGroup: ShaderObjectMetaBindingGroup | undefined = lBindingGroups[lBindingGroup.bindGroupIndex];
            if (!lMetaBindingGroup) {
                lMetaBindingGroup = {
                    name: lBindingGroup.bindGroupName,
                    bindings: new Array<ShaderObjectMetaBinding>()
                };
                lBindingGroups[lBindingGroup.bindGroupIndex] = lMetaBindingGroup;
            }

            // Determine storage type.
            const lStoreageType: StorageBindingType = (() => {
                if (lBindingGroup.bindingType === 'uniform') {
                    return StorageBindingType.None;
                }

                // TODO: Read from readonly / readwrite info from PgslParserResultBinding.
                return StorageBindingType.ReadWrite;
            })();

            // Add binding to group.
            lMetaBindingGroup.bindings.push({
                index: lBindingGroup.bindLocationIndex,
                name: lBindingGroup.bindLocationName,
                type: this.convertBindingType(lBindingGroup.type),
                storageType: lStoreageType
            });
        }

        return lBindingGroups;
    }

    private convertBindingType(pResultType: PgslParserResultType): ShaderObjectMetaType {
        switch (pResultType.type) {
            case 'sampler': {
                const lSamplerType: PgslParserResultSamplerType = pResultType as PgslParserResultSamplerType;
                return {
                    type: 'sampler',
                    comparison: lSamplerType.isComparison
                };
            }
            case 'boolean': {
                return {
                    type: 'primitive',
                    stride: BufferItemMultiplier.Single,
                    itemFormat: BufferItemFormat.Uint8
                };
            }
            case 'texture':
            case 'array':
            case 'struct':
            case 'numeric':
            case 'vector':
            case 'matrix':
        }

        // TODO:
        throw new Exception(`Unsupported binding type conversion for type '${pResultType.type}'.`, this);
    }
}

export type ShaderObjectMeta = {
    parameter: Array<string>;
    bindings: ShaderObjectMetaBindingGroups;
    // entry points.
};

export type ShaderObjectMetaBindingGroups = { [key: number]: ShaderObjectMetaBindingGroup; };

export type ShaderObjectMetaBindingGroup = {
    name: string;
    bindings: Array<ShaderObjectMetaBinding>;
};

export type ShaderObjectMetaBinding = {
    name: string;
    index: number;
    storageType: StorageBindingType;
    type: ShaderObjectMetaType;
};

export type ShaderObjectEntryPoint = {
    name: string;
    computeStage: ComputeStage;
};

/*
 * Binding types. 
 */
type ShaderObjectMetaType = ShaderObjectMetaTypeSampler | ShaderObjectMetaTypeTexture | ShaderObjectMetaTypePrimitive | ShaderObjectMetaTypeArray | ShaderObjectMetaTypeStruct;

type ShaderObjectMetaTypePrimitive = {
    type: 'primitive',
    stride: BufferItemMultiplier;
    itemFormat: BufferItemFormat;
};

type ShaderObjectMetaTypeTexture = {
    type: 'texture';
    comparison: boolean;
    format: TextureFormat;
    dimension: TextureViewDimension;
};

type ShaderObjectMetaTypeSampler = {
    type: 'sampler';
    comparison: boolean;
};

type ShaderObjectMetaTypeArray = {
    type: 'array';
    arrayLength: number | null;
    arrayType: ShaderObjectMetaType;
};

type ShaderObjectMetaTypeStruct = {
    type: 'struct';
    structName: string;
    structMembers: { [propertyName: string]: ShaderObjectMetaTypeStructProperty; };
};

type ShaderObjectMetaTypeStructProperty = {
    name: string;
    type: ShaderObjectMetaType;
    overrideSize: number | null;
    overrideAlignment: number | null;
};