import { Exception } from '@kartoffelgames/core';
import { PgslParser, type PgslParserResult, PgslParserResultArrayType, type PgslParserResultBinding, PgslParserResultMatrixType, PgslParserResultNumericType, PgslParserResultSamplerType, PgslParserResultStructType, PgslParserResultTextureType, type PgslParserResultType, PgslParserResultVectorType, WgslTranspiler } from '@kartoffelgames/core-pgsl';
import { type BindGroup, type BindGroupLayout, BufferItemFormat, BufferItemMultiplier, ComputeStage, type GpuTextureView, SamplerType, Shader as GpuShader, type ShaderRenderModule, StorageBindingType, type TextureFormat, type TextureViewDimension, VertexFragmentPipeline, VertexParameterStepMode } from '@kartoffelgames/web-gpu';
import { Color } from '../component_item/color.ts';
import { Material, MaterialBindingValue } from '../component_item/material.ts';
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
import { Shader } from "../component_item/shader.ts";

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

        // Empty shader code means use default PBR with per-material User bind group.
        if (!pMaterial.shader.shaderCode) {
            // Check cache for existing per-material bind group.
            const lExisting: CompiledMaterialEntry | undefined = this.mCompiledMaterials.get(pMaterial);
            if (lExisting) {
                return {
                    shader: lExisting.gpuShader,
                    userBindGroup: lExisting.userBindGroup,
                    userGroupIndex: lExisting.userGroupIndex
                };
            }

            // Create per-material User bind group with material-specific binding values.
            let lUserBindGroup: BindGroup | null = null;
            if (this.mDefaultUserBindings.length > 0) {
                const lUserLayout: BindGroupLayout = this.mDefaultRenderModule!.layout.getGroupLayout('User');
                lUserBindGroup = lUserLayout.create();
                this.fillUserBindGroup(lUserBindGroup, this.mDefaultUserBindings, pMaterial, this.mDefaultBindingDefaults);
            }

            // Cache compiled entry.
            const lEntry: CompiledMaterialEntry = {
                gpuShader: this.mDefaultShader!,
                sourceCode: '',
                userBindGroup: lUserBindGroup,
                userGroupIndex: this.mDefaultUserGroupIndex
            };
            this.mCompiledMaterials.set(pMaterial, lEntry);

            return {
                shader: this.mDefaultShader!,
                userBindGroup: lUserBindGroup,
                userGroupIndex: this.mDefaultUserGroupIndex
            };
        }

        // Check for existing compiled material with matching source code.
        const lExisting: CompiledMaterialEntry | undefined = this.mCompiledMaterials.get(pMaterial);
        if (lExisting && lExisting.sourceCode === pMaterial.shader.shaderCode) {
            return {
                shader: lExisting.gpuShader,
                userBindGroup: lExisting.userBindGroup,
                userGroupIndex: lExisting.userGroupIndex
            };
        }

        this.compileForwardMaterial(pMaterial);

        // Return default material while compilation is pending.
        return this.mDefaultMaterial!;
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
        const lDefaultShader: Shader =  new Shader();
        lDefaultShader.label = 'Default Shader';
        lDefaultShader.shaderCode = DEFAULT_PBR_SHADER;

        const lDefaultMaterial: Material = new Material();
        lDefaultMaterial.shader = lDefaultShader;
        lDefaultMaterial.label = 'Default Material';

        // Set default materials bindings.
        lDefaultMaterial.setBinding('baseColorFactor', new Float32Array([1, 1, 1, 1]).buffer);
        lDefaultMaterial.setBinding('metallicFactor', new Float32Array([0.0]).buffer);
        lDefaultMaterial.setBinding('roughnessFactor', new Float32Array([0.5]).buffer);

        this.mDefaultMaterial = await this.loadMaterial(lDefaultMaterial, ShaderRenderMode.Forward);
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
            // eslint-disable-next-line no-console
            throw new Exception('Material shader code is empty. Using default material.', this);
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
            this.setupShader(lParserResult);

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
    private fillUserBindGroup(pBindGroup: BindGroup, pBindings: Array<PgslParserResultBinding>, pMaterial: Material, pDefaults?: Map<string, ArrayBuffer>): void {
        for (const lBinding of pBindings) {
            const lBindName: string = lBinding.bindLocationName;
            const lBindType: PgslParserResultType = lBinding.type;
            const lMaterialValue: MaterialBindingValue | undefined = pMaterial.getBinding(lBindName);

            // Handle texture bindings.
            if (lBindType instanceof PgslParserResultTextureType) {
                if (lMaterialValue instanceof Texture) {
                    const lGpuTexture = this.mTextureSystem!.getGpuTexture(lMaterialValue);
  
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
     * Configure a GPU shader's pipeline layout from PgslParserResult metadata.
     * Sets up vertex entry point parameters, fragment render targets, and bind groups.
     *
     * Handles buffer, texture, and sampler binding types.
     */
    private setupShader(pParserResult: PgslParserResult): GpuShader {
        // Create GPU shader from transpiled WGSL.
        const lGpuShader: GpuShader = new GpuShader(this.mGpuSystem!.gpu, pParserResult.source, pParserResult.sourceMap);

        return lGpuShader.setup((pShaderSetup) => {
            // Vertex entry point: create one buffer per attribute.
            const lVertexEntry = pParserResult.entryPoints.vertex.get('vertex_main')!;
            pShaderSetup.vertexEntryPoint('vertex_main', (pVertexSetup) => {
                for (const lParam of lVertexEntry.parameters) {
                    const lMapped = MaterialSystem.mapResultType(lParam.type);
                    pVertexSetup.buffer(lParam.name, VertexParameterStepMode.Index)
                        .withParameter(lParam.name, lParam.location, lMapped.format, lMapped.multiplier);
                }
            });

            // Fragment entry point: add render targets.
            const lFragmentEntry = pParserResult.entryPoints.fragment.get('fragment_main')!;
            const lFragmentSetup = pShaderSetup.fragmentEntryPoint('fragment_main');
            for (const lTarget of lFragmentEntry.renderTargets) {
                const lMapped = MaterialSystem.mapResultType(lTarget.type);
                lFragmentSetup.addRenderTarget(lTarget.name, lTarget.location, lMapped.format, lMapped.multiplier);
            }

            // Bind groups: group bindings by group index.
            const lBindGroups = new Map<number, { name: string; bindings: Array<PgslParserResultBinding>; }>();
            for (const lBinding of pParserResult.bindings) {
                let lGroup = lBindGroups.get(lBinding.bindGroupIndex);
                if (!lGroup) {
                    lGroup = { name: lBinding.bindGroupName, bindings: [] };
                    lBindGroups.set(lBinding.bindGroupIndex, lGroup);
                }
                lGroup.bindings.push(lBinding);
            }

            for (const [lIndex, lGroup] of lBindGroups) {
                pShaderSetup.group(lIndex, lGroup.name, (pBindGroupSetup) => {
                    for (const lBinding of lGroup.bindings) {
                        const lStorageType = lBinding.bindingType === 'storage' ? StorageBindingType.Read : undefined;
                        const lVisibility = ComputeStage.Vertex | ComputeStage.Fragment;

                        // Handle texture bindings.
                        if (lBinding.type instanceof PgslParserResultTextureType) {
                            const lDimension: TextureViewDimension = lBinding.type.dimension as TextureViewDimension;
                            const lFormat: TextureFormat = lBinding.type.textureFormat as TextureFormat;
                            pBindGroupSetup
                                .binding(lBinding.bindLocationIndex, lBinding.bindLocationName, lVisibility, lStorageType)
                                .asTexture(lDimension, lFormat);
                            continue;
                        }

                        // Handle sampler bindings.
                        if (lBinding.type instanceof PgslParserResultSamplerType) {
                            const lSamplerType: SamplerType = lBinding.type.isComparison ? SamplerType.Comparison : SamplerType.Filter;
                            pBindGroupSetup
                                .binding(lBinding.bindLocationIndex, lBinding.bindLocationName, lVisibility, lStorageType)
                                .asSampler(lSamplerType);
                            continue;
                        }

                        // Handle buffer bindings.
                        const lBufferSetup = pBindGroupSetup
                            .binding(lBinding.bindLocationIndex, lBinding.bindLocationName, lVisibility, lStorageType)
                            .asBuffer();

                        // Configure buffer memory layout based on binding type.
                        MaterialSystem.configureBufferType(lBufferSetup, lBinding.type);
                    }
                });
            }
        });
    }

    /**
     * Configure buffer memory layout from a PgslParserResultType.
     * Handles arrays, structs, and primitive types recursively.
     */
    // deno-lint-ignore no-explicit-any
    private static configureBufferType(pSetup: any, pType: PgslParserResultType): void {
        if (pType instanceof PgslParserResultArrayType) {
            const lArraySetup = pSetup.withArray();
            const lElementType = pType.elementType;

            if (lElementType instanceof PgslParserResultStructType) {
                lArraySetup.withStruct((pStructSetup: any) => { // deno-lint-ignore no-explicit-any
                    MaterialSystem.configureStructProperties(pStructSetup, lElementType);
                });
            } else {
                const lMapped = MaterialSystem.mapResultType(lElementType);
                lArraySetup.withPrimitive(lMapped.format, lMapped.multiplier);
            }
        } else if (pType instanceof PgslParserResultStructType) {
            pSetup.withStruct((pStructSetup: any) => { // deno-lint-ignore no-explicit-any
                MaterialSystem.configureStructProperties(pStructSetup, pType);
            });
        } else {
            const lMapped = MaterialSystem.mapResultType(pType);
            pSetup.withPrimitive(lMapped.format, lMapped.multiplier);
        }
    }

    /**
     * Configure struct properties on a struct buffer memory layout setup.
     */
    // deno-lint-ignore no-explicit-any
    private static configureStructProperties(pStructSetup: any, pStructType: PgslParserResultStructType): void {
        for (const lProp of pStructType.properties) {
            const lPropSetup = pStructSetup.property(lProp.name);

            if (lProp.type instanceof PgslParserResultArrayType) {
                const lArrayPropSetup = lPropSetup.asArray();
                const lMapped = MaterialSystem.mapResultType(lProp.type.elementType);
                lArrayPropSetup.asPrimitive(lMapped.format, lMapped.multiplier);
            } else if (lProp.type instanceof PgslParserResultStructType) {
                lPropSetup.asStruct((pInnerStructSetup: any) => { // deno-lint-ignore no-explicit-any
                    MaterialSystem.configureStructProperties(pInnerStructSetup, lProp.type as PgslParserResultStructType);
                });
            } else {
                const lMapped = MaterialSystem.mapResultType(lProp.type);
                lPropSetup.asPrimitive(lMapped.format, lMapped.multiplier);
            }
        }
    }

    /**
     * Map a PgslParserResultType to GPU buffer format and multiplier.
     */
    public static mapResultType(pType: PgslParserResultType): { format: BufferItemFormat; multiplier: BufferItemMultiplier; } {
        if (pType instanceof PgslParserResultVectorType) {
            const lNumType = pType.elementType as PgslParserResultNumericType;
            const lFormat = lNumType.numberType === 'float' ? BufferItemFormat.Float32
                : lNumType.numberType === 'unsigned-integer' ? BufferItemFormat.Uint32
                    : BufferItemFormat.Sint32;
            switch (pType.dimension) {
                case 2: return { format: lFormat, multiplier: BufferItemMultiplier.Vector2 };
                case 3: return { format: lFormat, multiplier: BufferItemMultiplier.Vector3 };
                case 4: return { format: lFormat, multiplier: BufferItemMultiplier.Vector4 };
            }
        }

        if (pType instanceof PgslParserResultMatrixType) {
            const lKey = `${pType.rows}${pType.columns}`;
            const lMatrixMap: Record<string, BufferItemMultiplier> = {
                '22': BufferItemMultiplier.Matrix22, 
                '23': BufferItemMultiplier.Matrix23, 
                '24': BufferItemMultiplier.Matrix24,
                '32': BufferItemMultiplier.Matrix32, 
                '33': BufferItemMultiplier.Matrix33, 
                '34': BufferItemMultiplier.Matrix34,
                '42': BufferItemMultiplier.Matrix42, 
                '43': BufferItemMultiplier.Matrix43, 
                '44': BufferItemMultiplier.Matrix44,
            };
            const lMultiplier = lMatrixMap[lKey];
            if (lMultiplier) {
                return { format: BufferItemFormat.Float32, multiplier: lMultiplier };
            }
            throw new Error(`Unsupported matrix dimensions: ${pType.rows}x${pType.columns}`);
        }

        if (pType instanceof PgslParserResultNumericType) {
            const lFormat = pType.numberType === 'float' ? BufferItemFormat.Float32
                : pType.numberType === 'unsigned-integer' ? BufferItemFormat.Uint32
                    : BufferItemFormat.Sint32;
            return { format: lFormat, multiplier: BufferItemMultiplier.Single };
        }

        throw new Error(`Unsupported type for buffer mapping: ${pType.type}`);
    }
}

/**
 * Public return type for loaded materials.
 */
export type MaterialSystemMaterial = {
    readonly renderMode: ShaderRenderMode;
    readonly pipeline: VertexFragmentPipeline;
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
