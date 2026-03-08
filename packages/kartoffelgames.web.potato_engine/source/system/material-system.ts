import { Exception } from '@kartoffelgames/core';
import { PgslParser, type PgslParserResult, type PgslParserResultBinding, PgslParserResultFragmentEntryPoint, PgslParserResultMatrixType, PgslParserResultNumericType, PgslParserResultSamplerType, PgslParserResultTextureType, type PgslParserResultType, PgslParserResultVectorType, PgslParserResultVertexEntryPoint, WgslTranspiler } from '@kartoffelgames/core-pgsl';
import { type BindGroup, BindGroupLayout, BufferItemFormat, BufferItemMultiplier, ComputeStage, type GpuTextureView, PrimitiveCullMode, type RenderTargetsLayout, SamplerType, Shader as GpuShader, StorageBindingType, TextureFormat, type TextureViewDimension, type VertexFragmentPipeline, VertexParameterStepMode, GpuTexture } from '@kartoffelgames/web-gpu';
import { Color } from '../component_item/color.ts';
import { Material, type MaterialBindingValue } from '../component_item/material.ts';
import { Texture } from '../component_item/texture.ts';
import type { GameEnvironment } from '../core/environment/game-environment.ts';
import { GameSystem, type GameSystemConstructor, type GameSystemUpdateStateChanges } from '../core/game-system.ts';
import { GpuSystem } from './gpu-system.ts';
import { TextureSystem } from './texture-system.ts';

// PGSL shader sources.
import DEFAULT_PBR_SHADER from '../shader/default-pbr-shader.pgsl';
import FORWARD_ENTRY_POINTS from '../shader/forward-entry-points.pgsl';
import FORWARD_IMPORT from '../shader/forward-import.pgsl';
import OBJECT_GROUP_FORWARD from '../shader/object-group-forward.pgsl';
import SHARED_TYPES from '../shader/shared-types.pgsl';
import WORLD_GROUP_FORWARD from '../shader/world-group-forward.pgsl';
import { Shader } from '../component_item/shader.ts';

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
    private readonly mCompiledMaterials: WeakMap<Material, MaterialSystemMaterial>;
    private mDefaultMaterial: MaterialSystemMaterial | null;
    private mGpuSystem: GpuSystem | null;
    private readonly mParser: PgslParser;
    private readonly mRenderModes: Map<ShaderRenderMode, RenderModeConfig>;
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

        // Create parser (imports registered in onCreate when GPU is available).
        this.mParser = new PgslParser();

        // Render mode registry.
        this.mRenderModes = new Map<ShaderRenderMode, RenderModeConfig>();

        // Null dependencies and deferred initialization.
        this.mDefaultMaterial = null;
        this.mGpuSystem = null;
        this.mTextureSystem = null;
    }

    /**
     * Get the BindGroupLayout for a specific group in a render mode.
     * Used by consumers to create their own BindGroups.
     *
     * @param pMode - The render mode.
     * @param pGroupName - The group name (e.g. "World", "Object").
     *
     * @returns The pre-created BindGroupLayout for the group.
     */
    public getGroupLayout(pMode: ShaderRenderMode, pGroupName: string): BindGroupLayout {
        this.lockGate();

        const lConfig: RenderModeConfig | undefined = this.mRenderModes.get(pMode);
        if (!lConfig) {
            throw new Exception(`Render mode "${pMode}" is not registered.`, this);
        }

        const lGroup: RenderModeGroupLayout | undefined = lConfig.groupLayouts.get(pGroupName);
        if (!lGroup) {
            throw new Exception(`Group "${pGroupName}" not found in render mode "${pMode}".`, this);
        }

        return lGroup.layout;
    }

    /**
     * Get the bind group index for a specific group in a render mode.
     *
     * @param pMode - The render mode.
     * @param pGroupName - The group name (e.g. "World", "Object").
     *
     * @returns The bind group index.
     */
    public getGroupIndex(pMode: ShaderRenderMode, pGroupName: string): number {
        this.lockGate();

        const lConfig: RenderModeConfig | undefined = this.mRenderModes.get(pMode);
        if (!lConfig) {
            throw new Exception(`Render mode "${pMode}" is not registered.`, this);
        }

        const lGroup: RenderModeGroupLayout | undefined = lConfig.groupLayouts.get(pGroupName);
        if (!lGroup) {
            throw new Exception(`Group "${pGroupName}" not found in render mode "${pMode}".`, this);
        }

        return lGroup.index;
    }

    /**
     * Get the RenderTargetsLayout for a render mode.
     * Used by consumers to create their own RenderTargets.
     *
     * @param pMode - The render mode.
     *
     * @returns The RenderTargetsLayout for the mode.
     */
    public getRenderTargetsLayout(pMode: ShaderRenderMode): RenderTargetsLayout {
        this.lockGate();

        const lConfig: RenderModeConfig | undefined = this.mRenderModes.get(pMode);
        if (!lConfig) {
            throw new Exception(`Render mode "${pMode}" is not registered.`, this);
        }

        return lConfig.renderTargetsLayout;
    }

    /**
     * Load a material for a given render technique.
     *
     * Compiles the material's PGSL shader code with the mode-specific imports and entry points,
     * creates a complete pipeline using pre-created global BindGroupLayouts, and returns
     * the MaterialSystemMaterial with pipeline and User bind group.
     *
     * @param pMaterial - The material component item.
     * @param pTechnique - The render technique to compile the shader for.
     *
     * @returns The loaded material data with pipeline and user binding.
     */
    public async loadMaterial(pMaterial: Material, pTechnique: ShaderRenderMode): Promise<MaterialSystemMaterial> {
        this.lockGate();

        // Get mode configuration.
        const lModeConfig: RenderModeConfig | undefined = this.mRenderModes.get(pTechnique);
        if (!lModeConfig) {
            throw new Exception(`Render mode "${pTechnique}" is not registered.`, this);
        }

        // Check for existing compiled material with matching technique.
        const lExisting: MaterialSystemMaterial | undefined = this.mCompiledMaterials.get(pMaterial);
        if (lExisting && lExisting.pipelines.has(pTechnique)) {
            return lExisting;
        }

        // Validate shader code.
        const lShaderCode: string = pMaterial.shader.shaderCode;
        if (!lShaderCode) {
            throw new Exception('Material shader code is empty.', this);
        }

        // Compile shader code with mode-specific imports.
        const lPgsl: string = `
            #IMPORT "${lModeConfig.functionalImport}";
            ${lShaderCode}
            #IMPORT "${lModeConfig.entryPointImport}";
        `;

        const lParserResult: PgslParserResult = this.mParser.transpile(lPgsl, new WgslTranspiler());
        if (lParserResult.incidents.length > 0) {
            throw new Exception(`Shader compilation produced ${lParserResult.incidents.length} incident(s)`, this);
        }

        // Create GpuShader using pre-created layouts for global groups.
        const lGpuShader: GpuShader = this.createGpuShader(lParserResult, lModeConfig);

        // Create render module and pipeline.
        const lRenderModule = lGpuShader.createRenderModule(lModeConfig.vertexEntryPoint, lModeConfig.fragmentEntryPoint);
        const lPipeline: VertexFragmentPipeline = lRenderModule.create(lModeConfig.renderTargetsLayout);
        lPipeline.primitiveCullMode = PrimitiveCullMode.Front;

        // Create User bind group if the shader defines one.
        let lUserBindGroup: BindGroup | null = null;
        let lUserGroupIndex: number = -1;

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
            await this.fillUserBindGroup(lUserBindGroup, lUserBindings, pMaterial);
        }

        // Build or update MaterialSystemMaterial.
        let lMaterialEntry: MaterialSystemMaterial | undefined = lExisting;
        if (!lMaterialEntry) {
            lMaterialEntry = {
                pipelines: new Map<ShaderRenderMode, VertexFragmentPipeline>(),
                userBinding: {
                    group: lUserBindGroup!,
                    index: lUserGroupIndex
                }
            };
            this.mCompiledMaterials.set(pMaterial, lMaterialEntry);
        }

        lMaterialEntry.pipelines.set(pTechnique, lPipeline);
        return lMaterialEntry;
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

        // Register all shader imports with the parser.
        this.mParser.addImport('SharedTypes', SHARED_TYPES);
        this.mParser.addImport('WorldGroupForward', WORLD_GROUP_FORWARD);
        this.mParser.addImport('ObjectGroupForward', OBJECT_GROUP_FORWARD);
        this.mParser.addImport('Forward', FORWARD_IMPORT);
        this.mParser.addImport('ForwardEntryPoints', FORWARD_ENTRY_POINTS);

        // Register Forward render mode with the default PBR shader.
        this.registerForwardMode(DEFAULT_PBR_SHADER);

        // Compile default material from Forward mode's default shader.
        const lForwardConfig: RenderModeConfig = this.mRenderModes.get(ShaderRenderMode.Forward)!;

        const lDefaultShader: Shader = new Shader();
        lDefaultShader.label = 'Default Shader';
        lDefaultShader.shaderCode = lForwardConfig.defaultShaderCode;

        const lDefaultMaterial: Material = new Material();
        lDefaultMaterial.shader = lDefaultShader;
        lDefaultMaterial.label = 'Default Material';

        // Set default material bindings.
        lDefaultMaterial.setBinding('baseColorFactor', new Float32Array([1, 1, 1, 1]).buffer);
        lDefaultMaterial.setBinding('metallicFactor', new Float32Array([0.0]).buffer);
        lDefaultMaterial.setBinding('roughnessFactor', new Float32Array([0.5]).buffer);

        // Load default material and cache it for future use.
        this.mDefaultMaterial = await this.loadMaterial(lDefaultMaterial, ShaderRenderMode.Forward);
    }

    /**
     * Register the Forward render mode.
     *
     * Transpiles declaration-only shaders for World and Object groups to create standalone BindGroupLayouts.
     * Compiles the provided default user shader to extract the fragment entry point and derive a RenderTargetsLayout.
     *
     * @param pDefaultShaderCode - The default user shader code for this render mode (e.g. default PBR shader).
     */
    private registerForwardMode(pDefaultShaderCode: string): void {
        // Create group layouts by transpiling declaration-only shaders.
        const lGroupLayouts: Map<string, RenderModeGroupLayout> = new Map();

        // World group layout from declaration shader.
        const lWorldResult: PgslParserResult = this.mParser.transpile('#IMPORT "WorldGroupForward";', new WgslTranspiler());
        if (lWorldResult.incidents.length > 0) {
            throw new Exception('Failed to transpile World group declaration shader.', this);
        }
        const lWorldBindings: Array<PgslParserResultBinding> = lWorldResult.bindings.filter((pB) => pB.bindGroupName === 'World');
        if (lWorldBindings.length > 0) {
            lGroupLayouts.set('World', {
                index: lWorldBindings[0].bindGroupIndex,
                layout: this.createBindGroupLayoutFromBindings('World', lWorldBindings)
            });
        }

        // Object group layout from declaration shader.
        const lObjectResult: PgslParserResult = this.mParser.transpile('#IMPORT "ObjectGroupForward";', new WgslTranspiler());
        if (lObjectResult.incidents.length > 0) {
            throw new Exception('Failed to transpile Object group declaration shader.', this);
        }
        const lObjectBindings: Array<PgslParserResultBinding> = lObjectResult.bindings.filter((pB) => pB.bindGroupName === 'Object');
        if (lObjectBindings.length > 0) {
            lGroupLayouts.set('Object', {
                index: lObjectBindings[0].bindGroupIndex,
                layout: this.createBindGroupLayoutFromBindings('Object', lObjectBindings)
            });
        }

        // Create RenderTargetsLayout by compiling a full Forward shader to extract fragment entry.
        const lTemplateCode: string = `
            #IMPORT "Forward";
            ${pDefaultShaderCode}
            #IMPORT "ForwardEntryPoints";
        `;
        const lTemplateResult: PgslParserResult = this.mParser.transpile(lTemplateCode, new WgslTranspiler());
        if (lTemplateResult.incidents.length > 0) {
            throw new Exception('Failed to transpile Forward template shader for render targets layout.', this);
        }

        const lFragmentEntry: PgslParserResultFragmentEntryPoint = lTemplateResult.entryPoints.fragment.values().next()!.value!;
        const lRenderTargetsLayout: RenderTargetsLayout = this.createRenderTargetsLayoutFromEntryPoint(lFragmentEntry);

        // Store the Forward mode configuration.
        this.mRenderModes.set(ShaderRenderMode.Forward, {
            defaultShaderCode: pDefaultShaderCode,
            functionalImport: 'Forward',
            entryPointImport: 'ForwardEntryPoints',
            vertexEntryPoint: 'vertex_main',
            fragmentEntryPoint: 'fragment_main',
            groupLayouts: lGroupLayouts,
            renderTargetsLayout: lRenderTargetsLayout
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
    private createBindGroupLayoutFromBindings(pGroupName: string, pBindings: Array<PgslParserResultBinding>): BindGroupLayout {
        const lLayout: BindGroupLayout = new BindGroupLayout(this.mGpuSystem!.gpu, pGroupName);

        return lLayout.setup((pSetup) => {
            for (const lBinding of pBindings) {
                // Map storage access mode to StorageBindingType.
                const lStorageType: StorageBindingType = (() => {
                    if (lBinding.bindingType !== 'storage') {
                        return StorageBindingType.None;
                    }

                    switch (lBinding.accessMode) {
                        case 'read': return StorageBindingType.Read;
                        case 'write': return StorageBindingType.Write;
                        case 'read-write': return StorageBindingType.ReadWrite;
                    }
                })();

                const lVisibility = ComputeStage.Vertex | ComputeStage.Fragment;
                const lEntry = pSetup.binding(lBinding.bindLocationIndex, lBinding.bindLocationName, lVisibility, lStorageType);

                // Handle texture bindings.
                if (lBinding.type instanceof PgslParserResultTextureType) {
                    const lDimension: TextureViewDimension = lBinding.type.dimension as TextureViewDimension;
                    const lFormat: TextureFormat = lBinding.type.textureFormat as TextureFormat;
                    lEntry.asTexture(lDimension, lFormat);
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
     * Create a RenderTargetsLayout from a fragment entry point's render targets.
     * Adds Depth24plus depth-stencil to all modes.
     *
     * @param pFragmentEntry - The fragment entry point from a parser result.
     *
     * @returns A configured RenderTargetsLayout.
     */
    private createRenderTargetsLayoutFromEntryPoint(pFragmentEntry: PgslParserResultFragmentEntryPoint): RenderTargetsLayout {
        const lLayout: RenderTargetsLayout = this.mGpuSystem!.gpu.renderTargetsLayout(true);

        return lLayout.setup((pSetup) => {
            // Add color targets from fragment entry render targets.
            for (const lTarget of pFragmentEntry.renderTargets) {
                const lFormat: TextureFormat = this.mapTypeToTextureFormat(lTarget.type);
                pSetup.addColor(lTarget.name, lTarget.location, lFormat, false, { r: 0, g: 0, b: 0, a: 1 });
            }

            // Hardcoded Depth24plus for all render modes.
            pSetup.addDepthStencil(TextureFormat.Depth24plus, false, 1);
        });
    }

    /**
     * Map a PGSL parser result type to a TextureFormat for render target color attachments.
     *
     * @param pType - The PGSL type of the render target.
     *
     * @returns The corresponding TextureFormat.
     */
    private mapTypeToTextureFormat(pType: PgslParserResultType): TextureFormat {
        if (pType instanceof PgslParserResultVectorType) {
            const lElementType: PgslParserResultType = pType.elementType;

            if (lElementType instanceof PgslParserResultNumericType) {
                switch (lElementType.numberType) {
                    case 'float': {
                        switch (pType.dimension) {
                            case 4: return TextureFormat.Bgra8unorm;
                            case 2: return TextureFormat.Rg16float;
                            default: throw new Exception(`Unsupported float vector dimension ${pType.dimension} for render target format.`, this);
                        }
                    }
                    case 'float16': {
                        switch (pType.dimension) {
                            case 4: return TextureFormat.Rgba16float;
                            case 2: return TextureFormat.Rg16float;
                            default: throw new Exception(`Unsupported float16 vector dimension ${pType.dimension} for render target format.`, this);
                        }
                    }
                    case 'unsigned-integer': {
                        switch (pType.dimension) {
                            case 4: return TextureFormat.Rgba32uint;
                            case 2: return TextureFormat.Rg32uint;
                            default: throw new Exception(`Unsupported uint vector dimension ${pType.dimension} for render target format.`, this);
                        }
                    }
                    case 'integer': {
                        switch (pType.dimension) {
                            case 4: return TextureFormat.Rgba32sint;
                            case 2: return TextureFormat.Rg32sint;
                            default: throw new Exception(`Unsupported int vector dimension ${pType.dimension} for render target format.`, this);
                        }
                    }
                }
            }
        }

        if (pType instanceof PgslParserResultNumericType) {
            switch (pType.numberType) {
                case 'float': return TextureFormat.R32float;
                case 'unsigned-integer': return TextureFormat.R32uint;
                case 'integer': return TextureFormat.R32sint;
                case 'float16': return TextureFormat.R16float;
            }
        }

        throw new Exception(`Unsupported type for render target format mapping: ${pType.type}`, this);
    }

    /**
     * Creates a GPU shader from the PGSL parser result.
     * Uses pre-created BindGroupLayouts for global groups (World, Object) and creates the User group inline.
     *
     * @param pParserResult - The PGSL parser result of the shader.
     * @param pModeConfig - The render mode configuration with pre-created layouts.
     *
     * @returns A configured GpuShader.
     */
    private createGpuShader(pParserResult: PgslParserResult, pModeConfig: RenderModeConfig): GpuShader {
        // Create GPU shader from transpiled WGSL.
        const lGpuShader: GpuShader = new GpuShader(this.mGpuSystem!.gpu, pParserResult.source, pParserResult.sourceMap);

        // Setup and return the configured GPU shader.
        return lGpuShader.setup((pShaderSetup) => {
            // Vertex entry point: Read first vertex entry point and create one buffer per attribute.
            const lVertexEntry: PgslParserResultVertexEntryPoint = pParserResult.entryPoints.vertex.values().next()!.value!;
            pShaderSetup.vertexEntryPoint(lVertexEntry.name, (pVertexSetup) => {
                for (const lParam of lVertexEntry.parameters) {
                    const lVertexParameterType: MaterialSystemEntryPointType = this.convertEntryPointType(lParam.type);
                    pVertexSetup.buffer(lParam.name, VertexParameterStepMode.Index).withParameter(lParam.name, lParam.location, lVertexParameterType.format, lVertexParameterType.multiplier);
                }
            });

            // Fragment entry point: Read first fragment entry point and add render targets.
            const lFragmentEntry: PgslParserResultFragmentEntryPoint = pParserResult.entryPoints.fragment.values().next()!.value!;
            pShaderSetup.fragmentEntryPoint(lFragmentEntry.name, (pFragmentSetup) => {
                for (const lTarget of lFragmentEntry.renderTargets) {
                    const lFragmentResultType: MaterialSystemEntryPointType = this.convertEntryPointType(lTarget.type);
                    pFragmentSetup.addRenderTarget(lTarget.name, lTarget.location, lFragmentResultType.format, lFragmentResultType.multiplier);
                }
            });

            // Group bindings by group index.
            const lBindGroups = new Map<number, { name: string; bindings: Array<PgslParserResultBinding>; }>();
            for (const lBinding of pParserResult.bindings) {
                if (!lBindGroups.has(lBinding.bindGroupIndex)) {
                    lBindGroups.set(lBinding.bindGroupIndex, { name: lBinding.bindGroupName, bindings: [] });
                }
                lBindGroups.get(lBinding.bindGroupIndex)!.bindings.push(lBinding);
            }

            // Set bind groups — use pre-created layouts for global groups, create User group inline.
            for (const [lIndex, lGroup] of lBindGroups) {
                const lPreCreated: RenderModeGroupLayout | undefined = pModeConfig.groupLayouts.get(lGroup.name);

                if (lPreCreated) {
                    // Use pre-created BindGroupLayout for World/Object.
                    pShaderSetup.group(lIndex, lPreCreated.layout);
                } else {
                    // Create group inline (User group or any unregistered group).
                    pShaderSetup.group(lIndex, lGroup.name, (pBindGroupSetup) => {
                        for (const lBinding of lGroup.bindings) {
                            // Map storage access mode to StorageBindingType.
                            const lStorageType: StorageBindingType = (() => {
                                if (lBinding.bindingType !== 'storage') {
                                    return StorageBindingType.None;
                                }

                                switch (lBinding.accessMode) {
                                    case 'read': return StorageBindingType.Read;
                                    case 'write': return StorageBindingType.Write;
                                    case 'read-write': return StorageBindingType.ReadWrite;
                                }
                            })();

                            const lVisibility = ComputeStage.Vertex | ComputeStage.Fragment;
                            const lEntry = pBindGroupSetup.binding(lBinding.bindLocationIndex, lBinding.bindLocationName, lVisibility, lStorageType);

                            // Handle texture bindings.
                            if (lBinding.type instanceof PgslParserResultTextureType) {
                                const lDimension: TextureViewDimension = lBinding.type.dimension as TextureViewDimension;
                                const lFormat: TextureFormat = lBinding.type.textureFormat as TextureFormat;
                                lEntry.asTexture(lDimension, lFormat);
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
            }
        });
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
}

type MaterialSystemEntryPointType = {
    format: BufferItemFormat;
    multiplier: BufferItemMultiplier;
};

/**
 * Pre-created BindGroupLayout and its index for a render mode group.
 */
type RenderModeGroupLayout = {
    index: number;
    layout: BindGroupLayout;
};

/**
 * Configuration for a registered render mode.
 */
type RenderModeConfig = {
    /** Default user shader code for this render mode (used for default material and template compilation). */
    defaultShaderCode: string;
    /** Parser import name for the functional shader (e.g., "Forward"). */
    functionalImport: string;
    /** Parser import name for the entry points shader (e.g., "ForwardEntryPoints"). */
    entryPointImport: string;
    /** Vertex entry point function name (e.g., "vertex_main"). */
    vertexEntryPoint: string;
    /** Fragment entry point function name (e.g., "fragment_main"). */
    fragmentEntryPoint: string;
    /** Pre-created BindGroupLayouts for non-User groups, keyed by group name. */
    groupLayouts: Map<string, RenderModeGroupLayout>;
    /** RenderTargetsLayout for this mode (derived from fragment entry render targets + Depth24plus). */
    renderTargetsLayout: RenderTargetsLayout;
};

/**
 * Public return type for loaded materials.
 */
export type MaterialSystemMaterial = {
    readonly pipelines: Map<ShaderRenderMode, VertexFragmentPipeline>;
    readonly userBinding: {
        readonly group: BindGroup;
        readonly index: number;
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
