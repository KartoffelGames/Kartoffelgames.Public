import { Dictionary, Exception } from '@kartoffelgames/core';
import { PgslFunction } from '../very_old_structure/pgsl-function';
import { PgslStruct } from '../very_old_structure/struct/pgsl-struct';
import { BasePgslSyntaxTree } from './base-pgsl-syntax-tree';
import { PgslAliasDeclarationSyntaxTree } from './declarations/pgsl-alias-declaration-syntax-tree';
import { PgslEnumDeclarationSyntaxTree } from './declarations/pgsl-enum-declaration-syntax-tree';
import { PgslVariableDeclarationStatementSyntaxTree } from './statement/pgsl-variable-declaration-statement-syntax-tree';

export class PgslModuleSyntaxTree extends BasePgslSyntaxTree<PgslModuleSyntaxTreeStructureData> {
    // Values
    private readonly mAlias: Dictionary<string, PgslAliasDeclarationSyntaxTree>;
    private readonly mEnums: Dictionary<string, PgslEnumDeclarationSyntaxTree>;

    private readonly mFunctions: Dictionary<string, PgslFunction>;
    private readonly mGlobals: Dictionary<string, PgslVariableDeclarationStatementSyntaxTree>;
    private readonly mStructs: Dictionary<string, PgslStruct>;

    /**
     * This document.
     */
    public override get document(): PgslModuleSyntaxTree {
        return this;
    }

    // TODO: There was something with const. (Setable on Pipline creation).
    // TODO: Fast access bindings.

    // TODO: Predefine type aliases.
    // TODO: Predefine enums.

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslModuleSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        this.mAlias = new Dictionary<string, PgslAliasDeclarationSyntaxTree>();
        this.mEnums = new Dictionary<string, PgslEnumDeclarationSyntaxTree>();

        this.mGlobals = new Dictionary<string, PgslVariableDeclarationStatementSyntaxTree>();
        this.mStructs = new Dictionary<string, PgslStruct>();
        this.mFunctions = new Dictionary<string, PgslFunction>();

        // Add buildin enums.
        this.mEnums.set('AccessMode', new PgslEnumDeclarationSyntaxTree({
            name: 'AccessMode',
            items: [
                { name: 'Read', value: 'read' },
                { name: 'Write', value: 'write' },
                { name: 'ReadWrite', value: 'read_write' }
            ]
        }, 0, 0, 0, 0, true));

        this.mEnums.set('TexelFormat', new PgslEnumDeclarationSyntaxTree({
            name: 'TexelFormat',
            items: [
                { name: 'Rgba8unorm', value: 'rgba8unorm' },
                { name: 'Rgba8snorm', value: 'rgba8snorm' },
                { name: 'Rgba8uint', value: 'rgba8uint' },
                { name: 'Rgba8sint', value: 'rgba8sint' },
                { name: 'Rgba16uint', value: 'rgba16uint' },
                { name: 'Rgba16sint', value: 'rgba16sint' },
                { name: 'Rgba16float', value: 'rgba16float' },
                { name: 'R32uint', value: 'r32uint' },
                { name: 'R32sint', value: 'r32sint' },
                { name: 'R32float', value: 'r32float' },
                { name: 'Rg32uint', value: 'rg32uint' },
                { name: 'Rg32sint', value: 'rg32sint' },
                { name: 'Rg32float', value: 'rg32float' },
                { name: 'Rgba32uint', value: 'rgba32uint' },
                { name: 'Rgba32sint', value: 'rgba32sint' },
                { name: 'Rgba32float', value: 'rgba32float' },
                { name: 'Bgra8unorm', value: 'bgra8unorm' }
            ]
        }, 0, 0, 0, 0, true));

        this.mEnums.set('BuildIn', new PgslEnumDeclarationSyntaxTree({
            name: 'BuildIn',
            items: [
                { name: 'VertexIndex', value: 'vertex_index' },
                { name: 'InstanceIndex', value: 'instance_index' },
                { name: 'Position', value: 'position' },
                { name: 'FrontFacing', value: 'front_facing' },
                { name: 'FragDepth', value: 'frag_depth' },
                { name: 'SampleIndex', value: 'sample_index' },
                { name: 'SampleMask', value: 'sample_mask' },
                { name: 'LocalInvocationId', value: 'local_invocation_id' },
                { name: 'LocalInvocationIndex', value: 'local_invocation_index' },
                { name: 'GlobalInvocationId', value: 'global_invocation_id' },
                { name: 'WorkgroupId', value: 'workgroup_id' },
                { name: 'NumWorkgroups', value: 'num_workgroups' }
            ]
        }, 0, 0, 0, 0, true));

        this.mEnums.set('InterpolationSampling', new PgslEnumDeclarationSyntaxTree({
            name: 'InterpolationSampling',
            items: [
                { name: 'Center', value: 'center' },
                { name: 'Centroid', value: 'centroid' },
                { name: 'Sample', value: 'sample' },
                { name: 'First', value: 'first' },
                { name: 'Either', value: 'either' }
            ]
        }, 0, 0, 0, 0, true));

        this.mEnums.set('InterpolationType', new PgslEnumDeclarationSyntaxTree({
            name: 'InterpolationType',
            items: [
                { name: 'Perspective', value: 'perspective' },
                { name: 'Linear', value: 'linear' },
                { name: 'Flat', value: 'flat' },
            ]
        }, 0, 0, 0, 0, true));

        // Apply alias data.
        for (const lAlias of pData.alias) {
            if (this.mAlias.has(lAlias.name)) {
                throw new Exception(`Alias "${lAlias.name}" is already defined.`, this);
            }

            // Apply alias.
            this.mAlias.set(lAlias.name, lAlias);
        }

        // Apply enum data.
        for (const lEnum of pData.enum) {
            // Enum data does not merge.
            if (this.mEnums.has(lEnum.name)) {
                throw new Exception(`Enum "${lEnum.name}" is already defined.`, this);
            }

            // Apply new enum.
            this.mEnums.set(lEnum.name, lEnum);
        }

        // TODO: Other globals
    }

    /**
     * Resolve alias name to its declaration.
     * 
     * @param pName - Alias name.
     * 
     * @returns alias declaration  
     */
    public resolveAlias(pName: string): PgslAliasDeclarationSyntaxTree | null {
        return this.mAlias.get(pName) ?? null;
    }

    /**
     * Resolve enum name to its declaration.
     * 
     * @param pName - Enum name.
     * 
     * @returns enum declaration  
     */
    public resolveEnum(pName: string): PgslEnumDeclarationSyntaxTree | null {
        return this.mEnums.get(pName) ?? null;
    }

    /**
     * Resolve struct name to its declaration.
     * 
     * @param pName - Struct name.
     * 
     * @returns struct declaration  
     */
    public resolveStruct(pName: string): PgslStruct | null {
        return this.mStructs.get(pName) ?? null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidate(): void {
        // TODO: Validate function parameter and template.
    }
}

type PgslModuleSyntaxTreeStructureData = {
    alias: Array<PgslAliasDeclarationSyntaxTree>;
    enum: Array<PgslEnumDeclarationSyntaxTree>;
};