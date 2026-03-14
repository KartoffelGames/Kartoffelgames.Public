import { Exception } from '@kartoffelgames/core';
import { PgslParser, type PgslParserResult, type PgslParserResultBinding, type PgslParserResultFragmentEntryPoint, PgslParserResultMatrixType, PgslParserResultNumberTypeType, PgslParserResultNumericType, PgslParserResultSamplerType, PgslParserResultTextureType, type PgslParserResultType, PgslParserResultVectorType, type PgslParserResultVertexEntryPoint, WgslTranspiler } from '@kartoffelgames/core-pgsl';
import { type BindGroup, BindGroupBindLayout, BindGroupLayout, BindGroupLayoutMemoryLayoutSetup, BufferItemFormat, BufferItemMultiplier, ComputeStage, Shader as GpuShader, type GpuTexture, type GpuTextureView, PrimitiveCullMode, PrimitiveFrontFace, PrimitiveTopology, RenderTargetsLayout, SamplerType, ShaderRenderModule, StorageBindingType, TextureAspect, TextureFormat, TextureFormatCapability, TextureSampleType, type VertexFragmentPipeline, VertexParameterLayout, VertexParameterStepMode } from '@kartoffelgames/web-gpu';
import { Color } from '../component_item/color.ts';
import { Material, type MaterialBindingValue } from '../component_item/material.ts';
import { Texture } from '../component_item/texture.ts';
import type { GameEnvironment } from '../core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor } from '../core/game-system.ts';
import { GpuSystem } from './gpu-system.ts';
import { TextureSystem } from './texture-system.ts';

// PGSL shader sources.
import CORE_PARAMETER_SHADER from '../shader/core/core-parameter.pgsl';
import CORE_TEMPLATE_SHADER from '../shader/core/core-template.pgsl';

/**
 * Material system that manages PGSL shader compilation, per-render-mode bind group layouts,
 * render target layouts, and complete pipeline creation.
 *
 * For each registered render mode (e.g. Forward), the system:
 * - Transpiles declaration-only shaders to create standalone BindGroupLayouts for global groups (World, Object).
 * - Creates a RenderTargetsLayout from the mode's fragment entry point render targets + Depth24plus.
 * - Compiles user materials by wrapping their PGSL code with mode-specific imports and entry points.
 * - Returns a complete VertexFragmentPipeline per material per mode, using the pre-created global layouts.
 *
 * User PGSL code only needs to define bindings in the "User" group and implement
 * `vertex(VertexInput): VertexOutput` and `fragment(FragmentInput): PbrOutput` functions.
 *
 * Consumers (e.g. ShitSystem) obtain BindGroupLayouts and RenderTargetsLayout from this system
 * to create their own BindGroups (filled with data) and RenderTargets (with canvas assignment).
 */
export class MaterialSystem extends GameSystem {
    private static readonly WORLD_GROUP_NAME: string = 'World';
    private static readonly OBJECT_GROUP_NAME: string = 'Object';
    private static readonly USER_GROUP_NAME: string = 'User';

    private readonly mCompiledMaterials: WeakMap<Material, MaterialSystemCompiledMaterial>;
    private mGpuSystem: GpuSystem | null;
    private readonly mParser: PgslParser;
    private readonly mRenderModes: Map<string, MaterialSystemRenderMode>;
    private mTextureSystem: TextureSystem | null;
    private mVertexParameterLayout: VertexParameterLayout | null;

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
        this.mCompiledMaterials = new WeakMap<Material, MaterialSystemCompiledMaterial>();

        // Create parser and register core imports.
        this.mParser = new PgslParser();
        this.mParser.addImport('Core-Parameter', CORE_PARAMETER_SHADER);
        this.mParser.addImport('Core-Template', CORE_TEMPLATE_SHADER);

        // Render mode registry.
        this.mRenderModes = new Map<string, MaterialSystemRenderMode>();

        // Null dependencies and deferred initialization.
        this.mGpuSystem = null;
        this.mTextureSystem = null;
        this.mVertexParameterLayout = null;
    }

    /**
     * Map a PgslParserResultType to GPU buffer format and multiplier.
     *
     * @param pType - The PGSL parser result type to convert.
     *
     * @returns The corresponding MaterialSystemEntryPointType with buffer format and multiplier.
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
            const lInnerType: MaterialSystemEntryPointType = this.convertEntryPointType(pType.elementType);

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

    /**
     * Initialize the material system.
     * Registers PGSL imports, sets up the Forward render mode, and compiles the default PBR shader.
     */
    protected override async onCreate(): Promise<void> {
        // Get dependencies.
        this.mGpuSystem = this.environment.getSystem(GpuSystem);
        this.mTextureSystem = this.environment.getSystem(TextureSystem);
    }

    /**
     * Create a User bind group for a material based on the User bindings in the shader and the material's binding values.
     * 
     * For each binding in the User group:
     * - Buffer bindings: Matches material binding value by name and writes Color/number/ArrayBuffer.
     * - Texture bindings: Gets GpuTexture from TextureSystem and creates a view.
     * - Sampler bindings: Auto-creates a TextureSampler.
     * 
     * @param pMaterial - The material to create the User bind group for.
     * @param pParserResult - The PGSL parser result of the material's shader, containing the User bindings.
     * 
     * @returns The created User bind group and its layout, or null if no User bindings are defined in the shader.
     */
    private async createUserBindings(pMaterial: Material, pParserResult: PgslParserResult): Promise<MaterialSystemCompiledMaterialUserBinding | null> {
        // Find all bindings for the User group and group them by bind group index.
        const lUserBindingLayout: MaterialSystemGroupLayout | null = (() => {
            // Try to find user bindings in the reference shader result. If not found, throw an error since User group is required for the core template.
            const lUserBindings: Array<PgslParserResultBinding> = pParserResult.bindings.filter((pB) => pB.bindGroupName === MaterialSystem.USER_GROUP_NAME);
            if (lUserBindings.length === 0) {
                return null;
            }

            return {
                index: lUserBindings[0].bindGroupIndex,
                layout: this.createBindGroupLayout(MaterialSystem.USER_GROUP_NAME, lUserBindings)
            };
        })();

        // If no User bindings, return null to indicate no user bind group is needed for this material.
        if (!lUserBindingLayout) {
            return null;
        }

        // Create and fill a bind group for the User bindings.
        const lBindGroup: BindGroup = await (async () => {
            const lUserBindGroup: BindGroup = lUserBindingLayout.layout.create();

            // Fill each bindings by name.
            for (const lBindingName of lUserBindingLayout.layout.orderedBindingNames) {
                // Read definition and value for this binding.
                const lBindingLayout: Readonly<BindGroupBindLayout> = lUserBindingLayout.layout.getBind(lBindingName);
                const lBindingValue: MaterialBindingValue | undefined = pMaterial.getBinding(lBindingName);

                switch (lBindingLayout.resource.type) {
                    case "sampler": {
                        lUserBindGroup.data(lBindingName).createSampler();
                        break;
                    }

                    case "texture": {
                        if (!(lBindingValue instanceof Texture)) {
                            throw new Exception(`Expected a Texture material binding value for texture binding "${lBindingName}", but got ${typeof lBindingValue}.`, this);
                        }

                        const lGpuTexture: GpuTexture = await this.mTextureSystem!.getGpuTexture(lBindingValue);

                        // Map parser result dimension string to TextureViewDimension.
                        const lTextureView: GpuTextureView = lGpuTexture.useAs(lBindingLayout.resource.dimension);
                        lUserBindGroup.data(lBindingName).set(lTextureView);
                        break;
                    }

                    case 'buffer': {
                        // Handle buffer bindings.
                        if (lBindingValue instanceof Color) {
                            // Color -> write as Float32Array [r, g, b, a].
                            lUserBindGroup.data(lBindingName).createBuffer().write(new Float32Array(lBindingValue.data).buffer);
                        } else if (typeof lBindingValue === 'number') {
                            // Number -> write as single Float32.
                            lUserBindGroup.data(lBindingName).createBuffer().write(new Float32Array([lBindingValue]).buffer);
                        } else if (lBindingValue instanceof ArrayBuffer) {
                            // ArrayBuffer -> write raw data.
                            lUserBindGroup.data(lBindingName).createBufferWithRawData(lBindingValue);
                        } else {
                            // No matching material value.
                            throw new Exception(`No material binding value found for buffer binding "${lBindingName}".`, this);
                        }
                        break;
                    }
                }
            }

            return lUserBindGroup;
        })();

        return {
            group: lBindGroup,
            layout: lUserBindingLayout,
        };
    }

    /**
     * Create a RenderTargetsLayout from a fragment entry point's render targets.
     * Adds Depth24plus depth-stencil to all modes.
     *
     * @param pFragmentEntry - The fragment entry point from a parser result.
     *
     * @returns A configured RenderTargetsLayout.
     */
    private createRenderTargetsLayoutFromEntryPoint(pFragmentEntry: PgslParserResultFragmentEntryPoint): RenderTargetsLayout {
        return new RenderTargetsLayout(this.mGpuSystem!.gpu, true).setup((pSetup) => {
            // Add color targets from fragment entry render targets.
            for (const lTarget of pFragmentEntry.renderTargets) {
                const lTargetDeclaredType: PgslParserResultType = lTarget.type;

                // Read numeric type and dimension from the target's declared type.
                const lTextureSampleType: TextureSampleType = (() => {
                    const lNumericType: PgslParserResultNumberTypeType = (() => {
                        // Handle numeric types directly.
                        if (lTargetDeclaredType instanceof PgslParserResultNumericType) {
                            return lTargetDeclaredType.numberType;
                        }

                        return (<PgslParserResultNumericType>(<PgslParserResultVectorType>lTargetDeclaredType).elementType).numberType;
                    })();

                    switch (lNumericType) {
                        case 'unsigned-integer': return TextureSampleType.UnsignedInteger;
                        case 'integer': return TextureSampleType.SignedInteger;
                        case 'float': return TextureSampleType.Float;
                        case 'float16': return TextureSampleType.Float;
                    }
                })();

                const lAspectCount: number = lTargetDeclaredType instanceof PgslParserResultVectorType ? lTargetDeclaredType.dimension : 1;

                // Read textures format capabilities.
                const lTextureFormat: TextureFormat = (() => {
                    // Try to read format from shader meta values.
                    if (lTarget.metaValues.has('format')) {
                        return lTarget.metaValues.get('format')! as TextureFormat;
                    }

                    const lTextureAspects: Array<TextureAspect> = [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha];

                    // When no user format is provided, find a suitable format based on the target's declared type and device capabilities.
                    const lTextureFormat: TextureFormat | null = this.mGpuSystem!.gpu.textureCapabilities.filterFormatFor({
                        sampleType: lTextureSampleType,
                        dimension: '2d',

                        // Use the dimension to determine how many aspects are needed (e.g. 2 for rg, 4 for rgba).
                        aspects: lTextureAspects.slice(0, lAspectCount),

                        // For now that can be empty. Setting it as empty still ensures that the format supports render attachments.
                        renderAttachment: {}
                    });

                    if (!lTextureFormat) {
                        throw new Exception(`No supported texture format found for render target "${lTarget.name}" with sample type "${lTextureSampleType}" and dimension "${lAspectCount}".`, this);
                    }

                    return lTextureFormat;
                })();

                // Read texture capabilities for the selected format.
                const lTextureFormatCapability: TextureFormatCapability = this.mGpuSystem!.gpu.textureCapabilities.capabilityOf(lTextureFormat);

                // Validate that the selected format supports render attachments, otherwise it cannot be used as a render target.
                if (lTextureFormatCapability.aspects.size !== lAspectCount) {
                    throw new Exception(`Selected texture format "${lTextureFormat}" does not support the required number of aspects (${lAspectCount}) for render target "${lTarget.name}".`, this);
                }
                if (!lTextureFormatCapability.renderAttachment) {
                    throw new Exception(`Selected texture format "${lTextureFormat}" does not support render attachments for render target "${lTarget.name}".`, this);
                }
                if (!lTextureFormatCapability.sampleTypes.has(lTextureSampleType)) {
                    throw new Exception(`Selected texture format "${lTextureFormat}" does not support the required sample type "${lTextureSampleType}" for render target "${lTarget.name}".`, this);
                }
                if (!lTextureFormatCapability.dimensions.has('2d')) {
                    throw new Exception(`Selected texture format "${lTextureFormat}" does not support 2D textures required for render target "${lTarget.name}".`, this);
                }

                pSetup.addColor(lTarget.name, lTarget.location, lTextureFormatCapability.format, true, { r: 0, g: 0, b: 0, a: 1 });
            }

            // Hardcoded Depth24plus for all render modes.
            pSetup.addDepthStencil('depth24plus', false, 1);
        });
    }

    /**
     * Load a material for a given render technique.
     *
     * Compiles the material's PGSL shader code with the mode-specific imports and entry points,
     * creates a complete pipeline using pre-created global BindGroupLayouts, and returns
     * the MaterialSystemMaterial with pipeline and User bind group.
     *
     * @param pMode - The render mode to compile the shader for.
     * @param pMaterial - The material component item.
     *
     * @returns The loaded material data with pipeline and user binding.
     */
    public async loadMaterial(pMode: string, pMaterial: Material): Promise<MaterialSystemMaterial> {
        this.lockGate();

        // Get mode configuration.
        const lModeConfig: MaterialSystemRenderMode | undefined = this.mRenderModes.get(pMode);
        if (!lModeConfig) {
            throw new Exception(`Render mode "${pMode}" is not registered.`, this);
        }

        // Check for existing compiled material with matching mode.
        let lMaterialCompilation: MaterialSystemCompiledMaterial | undefined = this.mCompiledMaterials.get(pMaterial);
        if (lMaterialCompilation && lMaterialCompilation.pipelines.has(pMode)) {
            return {
                pipeline: lMaterialCompilation.pipelines.get(pMode)!,

                // Based if user bindings exist, return the user binding info or null.
                userBinding: !lMaterialCompilation.userBinding ? null : {
                    group: lMaterialCompilation.userBinding.group,
                    index: lMaterialCompilation.userBinding.layout.index
                }
            };
        }

        // Validate shader code.
        const lShaderCode: string = pMaterial.shader.shaderCode;
        if (!lShaderCode) {
            throw new Exception('Material shader code is empty.', this);
        }

        // Compile shader code with mode-specific imports.
        const lPgsl: string = `${lModeConfig.prefixShader}\n${lShaderCode}\n${lModeConfig.suffixShader}`;

        // Transpile PGSL to WGSL and check for incidents.
        const lParserResult: PgslParserResult = this.mParser.transpile(lPgsl, new WgslTranspiler());
        if (lParserResult.incidents.length > 0) {
            throw new Exception(`Shader compilation produced ${lParserResult.incidents.length} incident(s)`, this);
        }

        // When no mode of this material has been compiled yet, create user bindings.
        if (!lMaterialCompilation) {
            // Create new material compilation object with a new user binding.
            lMaterialCompilation = {
                pipelines: new Map<string, VertexFragmentPipeline>(),
                userBinding: await this.createUserBindings(pMaterial, lParserResult)
            };

            // Cache the new material compilation for future reuse across modes.
            this.mCompiledMaterials.set(pMaterial, lMaterialCompilation);
        }

        // Create pipeline with compiled shader and pre-created global layouts.
        const lPipeline: VertexFragmentPipeline = this.createPipeline(lParserResult, lModeConfig, lMaterialCompilation.userBinding);
        lMaterialCompilation.pipelines.set(pMode, lPipeline);

        // Return only the pipeline when no user binding is set.
        if (!lMaterialCompilation.userBinding) {
            return {
                pipeline: lPipeline,
                userBinding: null
            };
        }

        return {
            pipeline: lPipeline,
            userBinding: {
                group: lMaterialCompilation.userBinding.group,
                index: lMaterialCompilation.userBinding.layout.index
            }
        };
    }

    /**
     * Create a VertexFragmentPipeline from a PGSL parser result, using pre-created global BindGroupLayouts and an optional User group layout.
     * 
     * @param pParserResult - Shader parsing results.
     * @param pModeConfig - Config of the material render mode.
     * @param pUserBindings - User bindings of the material.
     * 
     * @returns a complete and setup verex fragment pipeline for the shader.
     */
    private createPipeline(pParserResult: PgslParserResult, pModeConfig: any, pUserBindings: MaterialSystemCompiledMaterialUserBinding | null): VertexFragmentPipeline {
        // Create GpuShader using pre-created layouts for global groups.
        const lGpuShader: GpuShader = this.createGpuShader(pParserResult, pModeConfig, pUserBindings?.layout ?? null);

        // Create render module. The compiled shader ALWAYS has a vertex and fragment entry point due to the core template imports, so we can directly access them here.
        const lRenderModule: ShaderRenderModule = lGpuShader.createRenderModule(lGpuShader.vertexEntryPoints[0], lGpuShader.fragmentEntryPoints[0]);

        // Create render pipeline and set pipeline states from shader meta values if provided.
        const lPipeline: VertexFragmentPipeline = lRenderModule.create();
        lPipeline.primitiveCullMode = (() => {
            // Try to read cull mode from shader meta values.
            if (pParserResult.metaValues.has('CullMode')) {
                const lCullModeValue: string = pParserResult.metaValues.get('CullMode')!;
                switch (lCullModeValue) {
                    case 'none': return PrimitiveCullMode.None;
                    case 'front': return PrimitiveCullMode.Front;
                    case 'back': return PrimitiveCullMode.Back;
                    default: throw new Exception(`Invalid CullMode value "${lCullModeValue}" in shader meta values.`, this);
                }
            }

            // Default to back culling.
            return PrimitiveCullMode.Back;
        })();
        lPipeline.primitiveFrontFace = (() => {
            // Try to read front face from shader meta values.
            if (pParserResult.metaValues.has('FrontFace')) {
                const lFrontFaceValue: string = pParserResult.metaValues.get('FrontFace')!;
                switch (lFrontFaceValue) {
                    case 'clockwise': return PrimitiveFrontFace.ClockWise;
                    case 'counterclockwise': return PrimitiveFrontFace.CounterClockWise;
                    default: throw new Exception(`Invalid FrontFace value "${lFrontFaceValue}" in shader meta values.`, this);
                }
            }

            // Default to counter-clockwise as front face.
            return PrimitiveFrontFace.CounterClockWise;
        })();
        lPipeline.primitiveTopology = (() => {
            // Try to read topology from shader meta values.
            if (pParserResult.metaValues.has('Topology')) {
                const lTopologyValue: string = pParserResult.metaValues.get('Topology')!;
                switch (lTopologyValue) {
                    case 'point-list': return PrimitiveTopology.PointList;
                    case 'line-list': return PrimitiveTopology.LineList;
                    case 'line-strip': return PrimitiveTopology.LineStrip;
                    case 'triangle-list': return PrimitiveTopology.TriangleList;
                    case 'triangle-strip': return PrimitiveTopology.TriangleStrip;
                    default: throw new Exception(`Invalid Topology value "${lTopologyValue}" in shader meta values.`, this);
                }
            }

            // Default to triangle list topology.
            return PrimitiveTopology.TriangleList;
        })();

        return lPipeline;
    }

    /**
     * Get or create a shared VertexParameterLayout based on the parameters of the vertex entry point.
     * 
     * @param pVertexEntry - The vertex entry point parser result.
     * 
     * @returns The shared VertexParameterLayout.
     */
    private getVerticesLayout(pVertexEntry: PgslParserResultVertexEntryPoint): VertexParameterLayout {
        // Return cached layout if already created. All materials share the same vertex layout based on the vertex entry point parameters, so we can reuse it across materials and modes.
        if (this.mVertexParameterLayout) {
            return this.mVertexParameterLayout;
        }

        // Vertex entry point: Reuse shared layout or create on first use.
        this.mVertexParameterLayout = new VertexParameterLayout(this.mGpuSystem!.gpu).setup((pSetup) => {
            for (const lEntryPointParameter of pVertexEntry.parameters) {
                // Convert entry point parameter type to buffer format and multiplier.
                const lParameterType: MaterialSystemEntryPointType = this.convertEntryPointType(lEntryPointParameter.type);

                // Set buffer layout based on parameter type.
                pSetup.buffer(lEntryPointParameter.name, VertexParameterStepMode.Vertex).withParameter(lEntryPointParameter.name, lEntryPointParameter.location, lParameterType.format, lParameterType.multiplier);
            }
        });

        return this.mVertexParameterLayout;
    }

    /**
     * Creates a GPU shader from the PGSL parser result.
     * Uses pre-created BindGroupLayouts for global groups (World, Object) and creates the User group inline.
     *
     * @param pParserResult - The PGSL parser result of the shader.
     * @param pModeConfig - The render mode configuration with pre-created layouts.
     * @param pUserGroupLayout - The optional pre-created User group layout, if there are any User bindings in the shader.
     *
     * @returns A configured GpuShader.
     */
    private createGpuShader(pParserResult: PgslParserResult, pModeConfig: MaterialSystemRenderMode, pUserGroupLayout: MaterialSystemGroupLayout | null): GpuShader {
        // Create GPU shader from transpiled WGSL and setup GPU shader.
        return new GpuShader(this.mGpuSystem!.gpu, pParserResult.source, pParserResult.sourceMap).setup((pShaderSetup) => {
            // Vertex entry point: Reuse shared layout or create on first use.
            const lVertexEntry: PgslParserResultVertexEntryPoint | undefined = pParserResult.entryPoints.vertex.values().next()!.value;
            if (!lVertexEntry) {
                throw new Exception('Vertex entry point not found in shader.', this);
            }

            // Reuse shared vertex layout.
            pShaderSetup.vertexEntryPoint(lVertexEntry.name, this.getVerticesLayout(lVertexEntry));

            // Fragment entry point: Read first fragment entry point and add render targets.
            const lFragmentEntry: PgslParserResultFragmentEntryPoint | undefined = pParserResult.entryPoints.fragment.values().next()!.value;
            if (!lFragmentEntry) {
                throw new Exception('Fragment entry point not found in shader.', this);
            }

            pShaderSetup.fragmentEntryPoint(lFragmentEntry.name, pModeConfig.renderTargetsLayout);

            // Set world and object group layouts from mode config.
            pShaderSetup.group(pModeConfig.bindingGroupLayouts.world.index, pModeConfig.bindingGroupLayouts.world.layout);
            pShaderSetup.group(pModeConfig.bindingGroupLayouts.object.index, pModeConfig.bindingGroupLayouts.object.layout);

            // Add User group layout if there are any User bindings.
            if (pUserGroupLayout) {
                pShaderSetup.group(pUserGroupLayout.index, pUserGroupLayout.layout);
            }
        });
    }

    /**
     * Create a standalone BindGroupLayout from a set of parser result bindings.
     *
     * @param pGroupName - The name of the bind group.
     * @param pBindings - The bindings for this group from a parser result.
     *
     * @returns A configured BindGroupLayout.
     */
    private createBindGroupLayout(pGroupName: string, pBindings: Array<PgslParserResultBinding>): BindGroupLayout {
        return new BindGroupLayout(this.mGpuSystem!.gpu, pGroupName).setup((pSetup) => {
            for (const lBinding of pBindings) {
                // Map storage access mode to StorageBindingType.
                const lStorageType: StorageBindingType = (() => {
                    // Only a storage binding can have a storage binding type.
                    if (lBinding.bindingType !== 'storage') {
                        return StorageBindingType.None;
                    }

                    switch (lBinding.accessMode) {
                        case 'read': return StorageBindingType.Read;
                        case 'write': return StorageBindingType.Write;
                        case 'read-write': return StorageBindingType.ReadWrite;
                    }
                })();

                const lComputeStageVisibility = ComputeStage.Vertex | ComputeStage.Fragment;
                const lEntry: BindGroupLayoutMemoryLayoutSetup = pSetup.binding(lBinding.bindLocationIndex, lBinding.bindLocationName, lComputeStageVisibility, lStorageType);

                // Handle texture bindings.
                if (lBinding.type instanceof PgslParserResultTextureType) {
                    lEntry.asTexture(lBinding.type.dimension, lBinding.type.textureFormat);
                    continue;
                }

                // Handle sampler bindings.
                if (lBinding.type instanceof PgslParserResultSamplerType) {
                    lEntry.asSampler(lBinding.type.isComparison ? SamplerType.Comparison : SamplerType.Filter);
                    continue;
                }

                // Handle buffer bindings.
                lEntry.asBuffer(lBinding.type.byteSize, lBinding.type.variableByteSize);
            }
        });
    }

    /**
     * Set a global shader import that can be used in any material shader.
     * 
     * @param pImportName - The name of the import to register. This name is used in the shader with `#IMPORT "ImportName"`.
     * @param pShaderCode - The PGSL shader code to register as an import. This code can contain bindings and functions that will be available in any shader that imports it.
     */
    public setGlobalImport(pImportName: string, pShaderCode: string): void {
        // Restrict dublicate imports.
        if (this.mParser.hasImport(pImportName)) {
            throw new Exception(`Import with name "${pImportName}" already exists.`, this);
        }

        // Update the global import in the parser.
        this.mParser.addImport(pImportName, pShaderCode);
    }

    /**
     * Register a new render mode.
     * Allows adding custom render modes with their own shader imports, entry points, and render target configurations.
     * 
     * @param pMode - The name of the render mode to register (e.g., "Forward", "Deferred").
     * @param pConfiguration - Mode configuration object.
     * 
     * @returns The pre-created BindGroupLayouts and RenderTargetsLayout for the registered mode to be used in material loading and pipeline creation.
     */
    public registerRenderMode(pMode: string, pConfiguration: MaterialSystemRenderModeConfiguration): MaterialSystemRenderModeRegisterResult {
        // Register render mode shaders.
        this.mParser.addImport(`${pMode}__entry-point`, pConfiguration.entryPointImport);
        for (let lFunctionalImportIndex: number = 0; lFunctionalImportIndex < pConfiguration.functionalImports.length; lFunctionalImportIndex++) {
            this.mParser.addImport(`${pMode}__functional-${lFunctionalImportIndex}`, pConfiguration.functionalImports[lFunctionalImportIndex]);
        }
        for (let lTypeImportIndex: number = 0; lTypeImportIndex < pConfiguration.typeImports.length; lTypeImportIndex++) {
            this.mParser.addImport(`${pMode}__type-${lTypeImportIndex}`, pConfiguration.typeImports[lTypeImportIndex]);
        }

        // Build the prefix and suffix shader code for this mode based on the provided imports.
        let lPrefixShader: string = '#IMPORT "Core-Parameter";\n';
        lPrefixShader += pConfiguration.typeImports.map((_pImport, pIndex) => {
            return `#IMPORT "${pMode}__type-${pIndex}";`;
        }).join('\n');
        lPrefixShader += '\n';
        lPrefixShader += pConfiguration.functionalImports.map((_pImport, pIndex) => {
            return `#IMPORT "${pMode}__functional-${pIndex}";`;
        }).join('\n');

        // Suffix shader only contains the entry point imports.
        const lSuffixShader: string = `#IMPORT "${pMode}__entry-point";`;

        // Create reference shader with the empty core template
        const lReferenceShaderResult: PgslParserResult = this.mParser.transpile(`${lPrefixShader}\n#IMPORT "Core-Template";\n${lSuffixShader}`, new WgslTranspiler());

        // Check for incidents before extracting layouts to avoid partial registration if the default shader has issues.
        if (lReferenceShaderResult.incidents.length > 0) {
            throw new Exception('Failed to transpile reference shader.', this);
        }

        // World group layout from declaration shader.
        const lWorldBindingLayout: MaterialSystemGroupLayout = (() => {
            // Try to find world bindings in the reference shader result. If not found, throw an error since World group is required for the core template.
            const lWorldBindings: Array<PgslParserResultBinding> = lReferenceShaderResult.bindings.filter((pB) => pB.bindGroupName === MaterialSystem.WORLD_GROUP_NAME);
            if (lWorldBindings.length === 0) {
                throw new Exception(`World group bindings not found in reference shader for render mode "${pMode}".`, this);
            }

            return {
                index: lWorldBindings[0].bindGroupIndex,
                layout: this.createBindGroupLayout(MaterialSystem.WORLD_GROUP_NAME, lWorldBindings)
            };
        })();

        // Object group layout from declaration shader.
        const lObjectBindingLayout: MaterialSystemGroupLayout = (() => {
            // Try to find object bindings in the reference shader result. If not found, throw an error since Object group is required for the core template.
            const lObjectBindings: Array<PgslParserResultBinding> = lReferenceShaderResult.bindings.filter((pB) => pB.bindGroupName === MaterialSystem.OBJECT_GROUP_NAME);
            if (lObjectBindings.length === 0) {
                throw new Exception(`Object group bindings not found in reference shader for render mode "${pMode}".`, this);
            }

            return {
                index: lObjectBindings[0].bindGroupIndex,
                layout: this.createBindGroupLayout(MaterialSystem.OBJECT_GROUP_NAME, lObjectBindings)
            };
        })();

        // Create RenderTargetsLayout by compiling a full Forward shader to extract fragment entry.
        const lFragmentEntry: PgslParserResultFragmentEntryPoint = lReferenceShaderResult.entryPoints.fragment.values().next()!.value!;
        const lRenderTargetsLayout: RenderTargetsLayout = this.createRenderTargetsLayoutFromEntryPoint(lFragmentEntry);

        // Store the Forward mode configuration.
        this.mRenderModes.set(pMode, {
            prefixShader: lPrefixShader,
            suffixShader: lSuffixShader,
            bindingGroupLayouts: {
                world: lWorldBindingLayout,
                object: lObjectBindingLayout
            },
            renderTargetsLayout: lRenderTargetsLayout
        });

        // Return the pre-created bind group layouts for this mode to be used in material loading and shader creation.
        return {
            bindGroupLayouts: {
                world: lWorldBindingLayout,
                object: lObjectBindingLayout
            },
            renderTargetsLayout: lRenderTargetsLayout
        };
    }
}

/**
 * Configuration for a registered render mode.
 */
export type MaterialSystemRenderModeConfiguration = {
    /** 
     * Vertex entry point function name (e.g., "vertex_main").
     */
    entryPointImport: string;

    /** 
     * Parser import name for the functional shader (e.g., "Forward"). 
     */
    functionalImports: Array<string>;

    /**
     * General shaderd type imports used by the modes shaders.
     */
    typeImports: Array<string>;

};

type MaterialSystemEntryPointType = {
    format: BufferItemFormat;
    multiplier: BufferItemMultiplier;
};

/**
 * Pre-created BindGroupLayout and its index for a render mode group.
 */
type MaterialSystemGroupLayout = {
    index: number;
    layout: BindGroupLayout;
};

/**
 * Configuration for a registered render mode.
 */
type MaterialSystemRenderMode = {
    /**
     * Shader code imported before the user defined shader.
     */
    prefixShader: string;

    /**
     * Shader code imported after the user defined shader.
     */
    suffixShader: string;

    /** 
     * Parser import name for the entry points shader (e.g., "ForwardEntryPoints").
     */
    bindingGroupLayouts: {
        world: MaterialSystemGroupLayout;
        object: MaterialSystemGroupLayout;
    };

    /**
     * RenderTargetsLayout for this mode (derived from fragment entry render targets + Depth24plus).
     */
    renderTargetsLayout: RenderTargetsLayout;
};

export type MaterialSystemRenderModeRegisterResult = {
    bindGroupLayouts: {
        world: MaterialSystemGroupLayout;
        object: MaterialSystemGroupLayout;
    };
    renderTargetsLayout: RenderTargetsLayout;
};

/**
 * Cache for loaded materials.
 */
type MaterialSystemCompiledMaterial = {
    // Pipelines for this material, keyed by render technique (ShaderRenderMode).
    pipelines: Map<string, VertexFragmentPipeline>;

    // The extracted user binding group initialized with the materials data.
    userBinding: MaterialSystemCompiledMaterialUserBinding | null;
};

type MaterialSystemCompiledMaterialUserBinding = {
    group: BindGroup;
    layout: MaterialSystemGroupLayout;
};

/**
 * Public return type for loaded materials.
 */
export type MaterialSystemMaterial = {
    // Pipelines for this material, keyed by render technique (ShaderRenderMode).
    readonly pipeline: VertexFragmentPipeline;

    // The extracted user binding group initialized with the materials data.
    readonly userBinding: {
        readonly group: BindGroup;
        readonly index: number;
    } | null;
};