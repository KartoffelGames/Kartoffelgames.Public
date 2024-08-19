import { Dictionary, Exception } from '@kartoffelgames/core';
import { PgslBuildInTypeName } from '../../enum/pgsl-type-name.enum';
import { BasePgslSyntaxTree, PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslTemplateListSyntaxTree } from './pgsl-template-list-syntax-tree';

/**
 * General PGSL syntax tree of a type definition.
 */
export class PgslTypeDefinitionSyntaxTree extends BasePgslSyntaxTree<PgslTypeDefinitionSyntaxTreeStructureData> {
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

    private readonly mName: string;
    private readonly mTemplateList: PgslTemplateListSyntaxTree | null;

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
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslTypeDefinitionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mName = pData.name;
        this.mTemplateList = pData.templateList ?? null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidate(): void {
        // Alias has no template.
        if (!this.mTemplateList && this.document.resolveAlias(this.mName)) {
            return;
        }

        // Struct has no template.
        if (!this.mTemplateList && this.document.resolveStruct(this.mName)) {
            return;
        }

        // Validate as build in type.
        const lTypeDefinitionInformation: TypeDefinitionInformation | undefined = PgslTypeDefinitionSyntaxTree.mBuildInTypes.get(this.mName as PgslBuildInTypeName);
        if (lTypeDefinitionInformation) {
            // Type exists and doesn't need a template.
            if (!this.mTemplateList && lTypeDefinitionInformation.template.length === 0) {
                return;
            }

            // Validate all templates.
            if (this.mTemplateList) {
                for (const lTemplate of lTypeDefinitionInformation.template) {
                    // Parameter length not matched.
                    if (lTemplate.length !== this.mTemplateList.items.length) {
                        continue;
                    }

                    // Match every single template parameter.
                    let lTemplateMatches: boolean = true;
                    for (let lIndex = 0; lIndex < lTemplate.length; lIndex++) {
                        const lExpectedTemplateType: 'Expression' | 'Type' = lTemplate[lIndex];

                        const lActualTemplateParameter: PgslTypeDefinitionSyntaxTree | BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> = this.mTemplateList.items[lIndex];
                        const lActualTemplateType: 'Expression' | 'Type' = (lActualTemplateParameter instanceof PgslTypeDefinitionSyntaxTree) ? 'Type' : 'Expression';

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

            throw new Exception(`Type "${this.mName}" has invalid template parameter.`, this);
        }

        throw new Exception(`Typename "${this.mName}" not defined`, this);
    }

}

type PgslTypeDefinitionSyntaxTreeStructureData = {
    name: string,
    templateList?: PgslTemplateListSyntaxTree;
};

type TypeDefinitionInformation = {
    template: Array<Array<'Expression' | 'Type'>>;
};