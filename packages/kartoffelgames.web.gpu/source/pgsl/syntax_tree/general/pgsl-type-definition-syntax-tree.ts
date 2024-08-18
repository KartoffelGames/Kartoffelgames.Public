import { Dictionary, Exception } from '@kartoffelgames/core';
import { PgslBuildInTypeName } from '../../enum/pgsl-type-name.enum';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../base-pgsl-syntax-tree';
import { PgslExpressionSyntaxTreeStructureData } from '../expression/pgsl-expression-syntax-tree-factory';
import { PgslTemplateListSyntaxTree, PgslTemplateListSyntaxTreeStructureData } from './pgsl-template-list-syntax-tree';

/**
 * General PGSL syntax tree of a type definition.
 */
export class PgslTypeDefinitionSyntaxTree extends BasePgslSyntaxTree<PgslTypeDefinitionSyntaxTreeStructureData['meta']['type'], PgslTypeDefinitionSyntaxTreeStructureData['data']> {
    /**
     * Define types.
     */
    private static readonly mBuildInTypes: Dictionary<PgslBuildInTypeName, TypeDefinitionInformation> = (() => {
        const lTypes: Dictionary<PgslBuildInTypeName, TypeDefinitionInformation> = new Dictionary<PgslBuildInTypeName, TypeDefinitionInformation>();

        // Add type to Type storage.
        const lAddType = (pType: PgslBuildInTypeName, pTemplate?: TypeDefinitionInformation['template']): void => {
            lTypes.set(pType, { template: pTemplate ?? [] });
        };

        // Add simple types.
        lAddType(PgslBuildInTypeName.Boolean);
        lAddType(PgslBuildInTypeName.Integer);
        lAddType(PgslBuildInTypeName.UnsignedInteger);
        lAddType(PgslBuildInTypeName.Float);

        // Vector types.
        lAddType(PgslBuildInTypeName.Vector2);
        lAddType(PgslBuildInTypeName.Vector3);
        lAddType(PgslBuildInTypeName.Vector4);

        // Matrix types.
        lAddType(PgslBuildInTypeName.Matrix22);
        lAddType(PgslBuildInTypeName.Matrix23);
        lAddType(PgslBuildInTypeName.Matrix24);
        lAddType(PgslBuildInTypeName.Matrix32);
        lAddType(PgslBuildInTypeName.Matrix33);
        lAddType(PgslBuildInTypeName.Matrix34);
        lAddType(PgslBuildInTypeName.Matrix42);
        lAddType(PgslBuildInTypeName.Matrix43);
        lAddType(PgslBuildInTypeName.Matrix44);

        // Bundled types.
        lAddType(PgslBuildInTypeName.Array, [
            ['Type'], ['Type', 'Expression']
        ]);

        // Image textures.
        lAddType(PgslBuildInTypeName.Texture1d, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.Texture2d, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.Texture2dArray, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.Texture3d, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureCube, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureCubeArray, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureMultisampled2d, [
            ['Type']
        ]);

        // External tetures.
        lAddType(PgslBuildInTypeName.TextureExternal);

        // Storage textures.
        lAddType(PgslBuildInTypeName.TextureStorage1d, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureStorage2d, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureStorage2dArray, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureStorage3d, [
            ['Type']
        ]);

        // Depth Textures.
        lAddType(PgslBuildInTypeName.TextureDepth2d);
        lAddType(PgslBuildInTypeName.TextureDepth2dArray);
        lAddType(PgslBuildInTypeName.TextureDepthCube);
        lAddType(PgslBuildInTypeName.TextureDepthCubeArray);
        lAddType(PgslBuildInTypeName.TextureDepthMultisampled2d);

        // Sampler
        lAddType(PgslBuildInTypeName.Sampler);
        lAddType(PgslBuildInTypeName.SamplerComparison);

        return lTypes;
    })();

    private mName: string;
    private mTemplateList: PgslTemplateListSyntaxTree | null;

    /**
     * Name of type.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Template of type.
     */
    public get template(): PgslTemplateListSyntaxTree | null {
        return this.mTemplateList;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('General-TypeDefinition');

        this.mName = 'float';
        this.mTemplateList = null;
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslTypeDefinitionSyntaxTreeStructureData['data']): void {
        // Validate type existance.
        (() => {
            // Alias has no template.
            if (!pData.templateList && this.document.resolveAlias(pData.name)) {
                return;
            }

            // Struct has no template.
            if (!pData.templateList && this.document.resolveStruct(pData.name)) {
                return;
            }

            // Validate as build in type.
            const lTypeDefinitionInformation: TypeDefinitionInformation | undefined = PgslTypeDefinitionSyntaxTree.mBuildInTypes.get(pData.name as PgslBuildInTypeName);
            if (lTypeDefinitionInformation) {
                // Type exists and doesn't need a template.
                if (!pData.templateList && lTypeDefinitionInformation.template.length === 0) {
                    return;
                }

                // Validate all templates.
                if (pData.templateList) {
                    for (const lTemplate of lTypeDefinitionInformation.template) {
                        // Parameter length not matched.
                        if (lTemplate.length !== pData.templateList.data.parameterList.length) {
                            continue;
                        }

                        // Match every single template parameter.
                        let lTemplateMatches: boolean = true;
                        for (let lIndex = 0; lIndex < lTemplate.length; lIndex++) {
                            const lExpectedTemplateType: 'Expression' | 'Type' = lTemplate[lIndex];
                            const lActualTemplateParameter: PgslTypeDefinitionSyntaxTreeStructureData | PgslExpressionSyntaxTreeStructureData = pData.templateList.data.parameterList[lIndex];
                            const lActualTemplateType: 'Expression' | 'Type' = (lActualTemplateParameter.meta.type === 'General-TypeDefinition') ? 'Type' : 'Expression';

                            // Need to have same parameter type.
                            if (lExpectedTemplateType !== lActualTemplateType) {
                                lTemplateMatches = false;
                                break;
                            }
                        }

                        // All templates matches.
                        if (lTemplateMatches) {
                            return;
                        }
                    }
                }

                throw new Exception(`Type "${pData.name}" has invalid template parameter.`, this);
            }

            throw new Exception(`Typename "${pData.name}" not defined`, this);
        })();

        // Set type name.
        this.mName = pData.name;

        // Apply template list when available.
        this.mTemplateList = null;
        if (pData.templateList) {
            this.mTemplateList = new PgslTemplateListSyntaxTree().applyDataStructure(pData.templateList, this);
        }
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslTypeDefinitionSyntaxTreeStructureData['data'] {
        // Build data structure with required name.
        const lData: PgslTypeDefinitionSyntaxTreeStructureData['data'] = {
            name: this.mName
        };

        // Retrieve optional template list.
        if (this.mTemplateList) {
            lData.templateList = this.mTemplateList.retrieveDataStructure();
        }

        return lData;
    }
}

export type PgslTypeDefinitionSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'General-TypeDefinition', {
    name: string,
    templateList?: PgslTemplateListSyntaxTreeStructureData;
}>;

type TypeDefinitionInformation = {
    template: Array<Array<'Expression' | 'Type'>>;
};