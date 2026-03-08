import { Exception } from '@kartoffelgames/core';
import { PgslParser, type PgslParserResult, PgslParserResultArrayType, type PgslParserResultBinding, PgslParserResultFragmentEntryPoint, PgslParserResultMatrixType, PgslParserResultNumericType, PgslParserResultSamplerType, PgslParserResultStructType, PgslParserResultTextureType, type PgslParserResultType, PgslParserResultVectorType, PgslParserResultVertexEntryPoint, WgslTranspiler } from '@kartoffelgames/core-pgsl';
import { type BindGroup, type BindGroupLayout, BufferItemFormat, BufferItemMultiplier, ComputeStage, type GpuTextureView, SamplerType, Shader as GpuShader, type ShaderRenderModule, StorageBindingType, type TextureFormat, type TextureViewDimension, type VertexFragmentPipeline, VertexParameterStepMode, GpuTexture } from '@kartoffelgames/web-gpu';
import { Color } from '../component_item/color.ts';
import { Material, type MaterialBindingValue } from '../component_item/material.ts';
import { Texture } from '../component_item/texture.ts';
import type { GameEnvironment } from '../core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor, type GameSystemUpdateStateChanges } from '../core/game-system.ts';
import { GpuSystem } from './gpu-system.ts';
import { TextureSystem } from './texture-system.ts';

// PGSL shader sources.
import CORE_IMPORT from '../shader/core-import.pgsl';
import DEFAULT_PBR_SHADER from '../shader/default-pbr-shader.pgsl';
import FORWARD_ENTRY_POINTS from '../shader/forward-entry-points.pgsl';
import FORWARD_IMPORT from '../shader/forward-import.pgsl';
import OBJECT_IMPORT from '../shader/object-import.pgsl';
import { Shader } from '../component_item/shader.ts';

/**
 * Material system that manages PGSL shader compilation and User bind group creation.
 *
 * Holds a single PgslParser with three registered imports:
 * - Core: World bindings and PBR struct definitions
 * - Object: Per-object bindings (transformation indices)
 * - Forward: Lighting calculations and internal vertex/fragment structs
 *
 * Entry point functions (vertex_main, fragment_main) are appended after user code
 * rather than included in the Forward import, because the PGSL parser processes
 * import declarations before main document declarations.
 *
 * User PGSL code only needs to define bindings in the "User" group and implement
 * `vertex(VertexInput): VertexOutput` and `fragment(FragmentInput): PbrOutput` functions.
 *
 * After compilation, the system creates a BindGroupLayout and BindGroup for the
 * shader's "User" group and fills it with data from the Material's bindings map.
 */
export class MaterialSystem extends GameSystem {
    private readonly mCompiledMaterials: WeakMap<Material, MaterialSystemMaterial>;
    private mDefaultMaterial: MaterialSystemMaterial | null;
    private mGpuSystem: GpuSystem | null;
    private readonly mParser: PgslParser;
    private mTextureSystem: TextureSystem | null;

    /**
     * Gets the default loaded material (default PBR shader with fallback User bind group).
     */
    public get defaultMaterial(): MaterialSystemMaterial {
        this.lockGate();
        return this.mDefaultMaterial!;
    }

    /**
     * Gets the system types this system depends on.
     */
    public override get dependentSystemTypes(): Array<GameSystemConstructor<GameSystem>> {
        return [GpuSystem, TextureSystem];
    }

    /**
     * Constructor of the material system.
     *
     * @param pEnvironment - The game environment this system belongs to.
     */
    public constructor(pEnvironment: GameEnvironment) {
        super('Material', pEnvironment);

        // Compiled material tracking.
        this.mCompiledMaterials = new WeakMap<Material, MaterialSystemMaterial>();

        // Create parser and register engine imports.
        this.mParser = new PgslParser();
        this.mParser.addImport('Core', CORE_IMPORT);
        this.mParser.addImport('Object', OBJECT_IMPORT);
        this.mParser.addImport('Forward', FORWARD_IMPORT);
        this.mParser.addImport('ForwardEntryPoints', FORWARD_ENTRY_POINTS);

        // Null dependencies and deferred initialization.
        this.mDefaultMaterial = null;
        this.mGpuSystem = null;

        this.mTextureSystem = null;
    }

    /**
     * Load a material for a given render technique.
     *
     * On first call, triggers shader compilation and returns the default PBR material.
     * On subsequent calls, returns the compiled material if ready and the source code
     * has not changed. If the source code changed, re-compilation is triggered.
     *
     * @param pMaterial - The material component item.
     * @param pTechnique - The render technique to compile the shader for.
     *
     * @returns The loaded material data (default PBR while compiling, compiled when ready).
     */
    public async loadMaterial(pMaterial: Material, pTechnique: ShaderRenderMode): Promise<MaterialSystemMaterial> {
        this.lockGate();

        // Only Forward is supported.
        if (pTechnique !== ShaderRenderMode.Forward) {
            throw new Exception(`Render technique "${pTechnique}" is not yet supported. Only Forward is implemented.`, this);
        }

        // Check for existing compiled material with matching source code.
        const lExisting: MaterialSystemMaterial | undefined = this.mCompiledMaterials.get(pMaterial);
        if (lExisting && lExisting.pipelines.has(pTechnique)) {
            return lExisting;
        }

        // Compile new material and cache it.
        const lShaderCode: PgslParserResult = (() => {
            switch (pTechnique) {
                case ShaderRenderMode.Forward: {
                    return this.createForwardShaderCode(pMaterial);
                }
            }
        })();

    }

    /**
     * Initialize the material system.
     * Creates the PGSL parser with engine imports and compiles the default PBR shader.
     */
    protected override async onCreate(): Promise<void> {
        // Get dependencies.
        this.mGpuSystem = this.environment.getSystem(GpuSystem);
        this.mTextureSystem = this.environment.getSystem(TextureSystem);

        // Compile default PBR shader.
        const lDefaultShader: Shader = new Shader();
        lDefaultShader.label = 'Default Shader';
        lDefaultShader.shaderCode = DEFAULT_PBR_SHADER;

        const lDefaultMaterial: Material = new Material();
        lDefaultMaterial.shader = lDefaultShader;
        lDefaultMaterial.label = 'Default Material';

        // Set default materials bindings.
        lDefaultMaterial.setBinding('baseColorFactor', new Float32Array([1, 1, 1, 1]).buffer);
        lDefaultMaterial.setBinding('metallicFactor', new Float32Array([0.0]).buffer);
        lDefaultMaterial.setBinding('roughnessFactor', new Float32Array([0.5]).buffer);

        // Load default material and cache it for future use.
        this.mDefaultMaterial = await this.loadMaterial(lDefaultMaterial, ShaderRenderMode.Forward);
    }

    private createForwardShaderCode(pMaterial: Material): PgslParserResult {
        const lShaderCode: string = pMaterial.shader.shaderCode;

        // Prepend Forward import and append entry points after user code.
        const lPgslCode: string = `
            #IMPORT "Forward";
            ${lShaderCode}
            #IMPORT "ForwardEntryPoints";
        `;

        const lParserResult: PgslParserResult = this.mParser!.transpile(lPgslCode, new WgslTranspiler());

        // Check for compilation errors.
        if (lParserResult.incidents.length > 0) {
            throw new Exception(`Shader compilation produced ${lParserResult.incidents.length} incident(s)`, this);
        }

        return lParserResult;
    }

    /**
     * Compile a single material's shader from PGSL to WGSL, configure the GPU shader,
     * and create the User bind group if the shader defines one.
     *
     * @param pMaterial - The material to compile.
     *
     * @returns The compiled material entry, or null if compilation failed.
     */
    private compileForwardMaterial(pMaterial: Material): MaterialSystemMaterial {
        const lShaderCode: string = pMaterial.shader.shaderCode;

        // Skip empty shader code.
        if (!lShaderCode) {
            throw new Exception('Material shader code is empty.', this);
        }

        // Prepend Forward import and append entry points after user code.
        const lPgsl: string = `
            #IMPORT "Forward";
            ${lShaderCode}
            #IMPORT "ForwardEntryPoints";
        `;

        try {
            const lParserResult: PgslParserResult = this.mParser!.transpile(lPgsl, new WgslTranspiler());

            // Check for compilation errors.
            if (lParserResult.incidents.length > 0) {
                // eslint-disable-next-line no-console
                console.warn(`[MaterialSystem] Shader compilation produced ${lParserResult.incidents.length} incident(s):`, lParserResult.incidents);
                throw new Exception(`Shader compilation produced ${lParserResult.incidents.length} incident(s)`, this);
            }



            // Configure shader pipeline layout from parser result.
            const lGpuShader = this.createGpuShader(lParserResult);

            // Create render module to access the pipeline layout for bind group creation.
            const lRenderModule: ShaderRenderModule = lGpuShader.createRenderModule('vertex_main', 'fragment_main');

            // Create User bind group if the shader defines one.
            let lUserBindGroup: BindGroup | null = null;
            let lUserGroupIndex: number = -1;

            // Find User group bindings.
            const lUserBindings: Array<PgslParserResultBinding> = [];
            for (const lBinding of lParserResult.bindings) {
                if (lBinding.bindGroupName === 'User') {
                    lUserGroupIndex = lBinding.bindGroupIndex;
                    lUserBindings.push(lBinding);
                }
            }

            if (lUserBindings.length > 0) {
                const lUserLayout: BindGroupLayout = lRenderModule.layout.getGroupLayout('User');
                lUserBindGroup = lUserLayout.create();

                // Fill User bind group data from Material.bindings.
                this.fillUserBindGroup(lUserBindGroup, lUserBindings, pMaterial);
            }

            return {
                gpuShader: lGpuShader,
                sourceCode: lShaderCode,
                userBindGroup: lUserBindGroup,
                userGroupIndex: lUserGroupIndex
            };
        } catch (pError: unknown) {
            // eslint-disable-next-line no-console
            console.error('[MaterialSystem] Shader compilation failed:', pError);
            return this.mDefaultMaterial!;
        }
    }

    /**
     * Fill a User bind group with data from Material.bindings.
     *
     * For each binding in the User group:
     * - Buffer bindings: Matches material binding value by name and writes Color/number/ArrayBuffer.
     * - Texture bindings: Gets GpuTexture from TextureSystem and creates a view.
     * - Sampler bindings: Auto-creates a TextureSampler.
     *
     * @param pBindGroup - The User bind group to fill.
     * @param pBindings - The User group bindings from the parser result.
     * @param pMaterial - The material to read binding values from.
     * @param pDefaults - Optional default values for buffer bindings when no material value is set.
     */
    private async fillUserBindGroup(pBindGroup: BindGroup, pBindings: Array<PgslParserResultBinding>, pMaterial: Material, pDefaults?: Map<string, ArrayBuffer>): Promise<void> {
        for (const lBinding of pBindings) {
            const lBindName: string = lBinding.bindLocationName;
            const lBindType: PgslParserResultType = lBinding.type;
            const lMaterialValue: MaterialBindingValue | undefined = pMaterial.getBinding(lBindName);

            // Handle texture bindings.
            if (lBindType instanceof PgslParserResultTextureType) {
                if (lMaterialValue instanceof Texture) {
                    const lGpuTexture: GpuTexture = await this.mTextureSystem!.getGpuTexture(lMaterialValue);

                    // Map parser result dimension string to TextureViewDimension.
                    const lDimension: TextureViewDimension = lBindType.dimension as TextureViewDimension;
                    const lTextureView: GpuTextureView = lGpuTexture.useAs(lDimension);
                    pBindGroup.data(lBindName).set(lTextureView);

                } else {
                    // No matching material value or wrong type, create white placeholder.
                    pBindGroup.data(lBindName).set(this.mTextureSystem!.defaultTexture);
                }
                continue;
            }

            // Handle sampler bindings (auto-created).
            if (lBindType instanceof PgslParserResultSamplerType) {
                pBindGroup.data(lBindName).createSampler();
                continue;
            }

            // Handle buffer bindings.
            if (lMaterialValue instanceof Color) {
                // Color -> write as Float32Array [r, g, b, a].
                const lBuffer = pBindGroup.data(lBindName).createBuffer();
                lBuffer.write(new Float32Array([lMaterialValue.r, lMaterialValue.g, lMaterialValue.b, lMaterialValue.a]).buffer);
            } else if (typeof lMaterialValue === 'number') {
                // Number -> write as single Float32.
                const lBuffer = pBindGroup.data(lBindName).createBuffer();
                lBuffer.write(new Float32Array([lMaterialValue]).buffer);
            } else if (lMaterialValue instanceof ArrayBuffer) {
                // ArrayBuffer -> write raw data.
                pBindGroup.data(lBindName).createBufferWithRawData(lMaterialValue);
            } else {
                // No matching material value. Use default if available, otherwise zero-initialized.
                const lDefault: ArrayBuffer | undefined = pDefaults?.get(lBindName);
                if (lDefault) {
                    pBindGroup.data(lBindName).createBufferWithRawData(lDefault);
                } else {
                    pBindGroup.data(lBindName).createBuffer();
                }
            }
        }
    }

    /**
     * Creates a GPU shader from the PGSL parser result, configuring the vertex and fragment entry points,
     * and setting up bind groups.
     *
     * Handles buffer, texture, and sampler binding types.
     * 
     * @param pParserResult - The pgsl parser result of the shader.
     */
    private createGpuShader(pParserResult: PgslParserResult): GpuShader {
        // Create GPU shader from transpiled WGSL.
        const lGpuShader: GpuShader = new GpuShader(this.mGpuSystem!.gpu, pParserResult.source, pParserResult.sourceMap);

        // Setup and return the configured GPU shader.
        return lGpuShader.setup((pShaderSetup) => {
            // Vertex entry point: Read first vertex entry point and create one buffer per attribute.
            const lVertexEntry: PgslParserResultVertexEntryPoint = pParserResult.entryPoints.vertex.values().next()!.value!;
            pShaderSetup.vertexEntryPoint(lVertexEntry.name, (pVertexSetup) => {
                // Map each vertex parameter.
                for (const lParam of lVertexEntry.parameters) {
                    const lVertexParameterType: MaterialSystemEntryPointType = this.convertEntryPointType(lParam.type);
                    pVertexSetup.buffer(lParam.name, VertexParameterStepMode.Index).withParameter(lParam.name, lParam.location, lVertexParameterType.format, lVertexParameterType.multiplier);
                }
            });

            // Fragment entry point: Read first fragment entry point and add render targets.
            const lFragmentEntry: PgslParserResultFragmentEntryPoint = pParserResult.entryPoints.fragment.values().next()!.value!;
            pShaderSetup.fragmentEntryPoint(lFragmentEntry.name, (pFragmentSetup) => {
                // Map each render target.
                for (const lTarget of lFragmentEntry.renderTargets) {
                    const lFragmentResultType: MaterialSystemEntryPointType = this.convertEntryPointType(lTarget.type);
                    pFragmentSetup.addRenderTarget(lTarget.name, lTarget.location, lFragmentResultType.format, lFragmentResultType.multiplier);
                }
            });

            // Group bindings by group index.
            const lBindGroups = new Map<number, { name: string; bindings: Array<PgslParserResultBinding>; }>();
            for (const lBinding of pParserResult.bindings) {
                // Create new group entry if it doesn't exist, then add binding to the group.
                if (!lBindGroups.has(lBinding.bindGroupIndex)) {
                    lBindGroups.set(lBinding.bindGroupIndex, { name: lBinding.bindGroupName, bindings: [] });
                }

                lBindGroups.get(lBinding.bindGroupIndex)!.bindings.push(lBinding);
            }

            // TODO: Set world and object bind groups from imports and only create user binding from shader code.

            // Create bind groups.
            for (const [lIndex, lGroup] of lBindGroups) {
                pShaderSetup.group(lIndex, lGroup.name, (pBindGroupSetup) => {
                    for (const lBinding of lGroup.bindings) {
                        // Map storage access mode to StorageBindingType.
                        const lStorageType: StorageBindingType = (() => {
                            // Only storage bindings have access modes.
                            if (lBinding.bindingType !== 'storage') {
                                return StorageBindingType.None;
                            }

                            switch (lBinding.accessMode) {
                                case 'read': return StorageBindingType.Read;
                                case 'write': return StorageBindingType.Write;
                                case 'read-write': return StorageBindingType.ReadWrite;
                            }
                        })();

                        // Default to complete visibility for all stages since PGSL doesn't specify stage-specific bindings.
                        const lVisibility = ComputeStage.Vertex | ComputeStage.Fragment;

                        // Create new binding in the bind group layout.
                        const lBindGroupLayoutEntry = pBindGroupSetup.binding(lBinding.bindLocationIndex, lBinding.bindLocationName, lVisibility, lStorageType);

                        // Handle texture bindings.
                        if (lBinding.type instanceof PgslParserResultTextureType) {
                            const lDimension: TextureViewDimension = lBinding.type.dimension as TextureViewDimension;
                            const lFormat: TextureFormat = lBinding.type.textureFormat as TextureFormat;

                            lBindGroupLayoutEntry.asTexture(lDimension, lFormat);
                            continue;
                        }

                        // Handle sampler bindings.
                        if (lBinding.type instanceof PgslParserResultSamplerType) {
                            lBindGroupLayoutEntry.asSampler(lBinding.type.isComparison ? SamplerType.Comparison : SamplerType.Filter);
                            continue;
                        }

                        // Handle buffer bindings.
                        lBindGroupLayoutEntry.asBuffer(lBinding.type.byteSize, lBinding.type.variableByteSize);
                    }
                });
            }
        });
    }

    /**
     * Map a PgslParserResultType to GPU buffer format and multiplier.
     * 
     * @param pType - The PGSL parser result type to convert.
     * 
     * @returns The corresponding MaterialSystemEntryPointType with buffer format and multiplier.
     * 
     * @throws Error if the type cannot be mapped to a buffer format (e.g. unsupported types).
     */
    public convertEntryPointType(pType: PgslParserResultType): MaterialSystemEntryPointType {
        if (pType instanceof PgslParserResultNumericType) {
            // Map numeric types directly to buffer formats.
            const lFormat: BufferItemFormat = (() => {
                switch (pType.numberType) {
                    case 'unsigned-integer': return BufferItemFormat.Uint32;
                    case 'integer': return BufferItemFormat.Sint32;
                    case 'float': return BufferItemFormat.Float32;
                    case 'float16': return BufferItemFormat.Float16;
                    default:
                        throw new Error(`Unsupported numeric type: ${pType.numberType}`);
                }
            })();

            return { format: lFormat, multiplier: BufferItemMultiplier.Single };
        }

        // Map vector types to their element type format and appropriate multiplier.
        if (pType instanceof PgslParserResultVectorType) {
            // Convert inner numeric type to buffer format.
            const lInnerType: MaterialSystemEntryPointType = this.convertEntryPointType(pType.elementType);

            // Map vector dimension to appropriate multiplier.
            switch (pType.dimension) {
                case 2: return { format: lInnerType.format, multiplier: BufferItemMultiplier.Vector2 };
                case 3: return { format: lInnerType.format, multiplier: BufferItemMultiplier.Vector3 };
                case 4: return { format: lInnerType.format, multiplier: BufferItemMultiplier.Vector4 };
            }
        }

        // Map matrix dimensions to appropriate format and multiplier.
        if (pType instanceof PgslParserResultMatrixType) {
            switch (`${pType.rows}${pType.columns}`) {
                case '22': return { format: BufferItemFormat.Float32, multiplier: BufferItemMultiplier.Matrix22 };
                case '23': return { format: BufferItemFormat.Float32, multiplier: BufferItemMultiplier.Matrix23 };
                case '24': return { format: BufferItemFormat.Float32, multiplier: BufferItemMultiplier.Matrix24 };
                case '32': return { format: BufferItemFormat.Float32, multiplier: BufferItemMultiplier.Matrix32 };
                case '33': return { format: BufferItemFormat.Float32, multiplier: BufferItemMultiplier.Matrix33 };
                case '34': return { format: BufferItemFormat.Float32, multiplier: BufferItemMultiplier.Matrix34 };
                case '42': return { format: BufferItemFormat.Float32, multiplier: BufferItemMultiplier.Matrix42 };
                case '43': return { format: BufferItemFormat.Float32, multiplier: BufferItemMultiplier.Matrix43 };
                case '44': return { format: BufferItemFormat.Float32, multiplier: BufferItemMultiplier.Matrix44 };
                default:
                    throw new Error(`Unsupported matrix dimensions: ${pType.rows}x${pType.columns}`);
            }
        }

        throw new Error(`Unsupported type for buffer mapping: ${pType.type}`);
    }
}

type MaterialSystemEntryPointType = {
    format: BufferItemFormat;
    multiplier: BufferItemMultiplier;
};

/**
 * Public return type for loaded materials.
 */
export type MaterialSystemMaterial = {
    readonly pipelines: Map<ShaderRenderMode, VertexFragmentPipeline>;
    readonly userBinding: {
        group: BindGroup;
        index: number;
    };
};

/**
 * Shader render mode used for shader compilation.
 * Determines which shader imports and entry points are used.
 */
export enum ShaderRenderMode {
    Forward = 'Forward',
    Deferred = 'Deferred',
    Particle = 'Particle'
}
