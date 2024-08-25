import { Dictionary, Exception } from '@kartoffelgames/core';
import { PgslBuildInTypeName } from '../../enum/pgsl-build-in-type-name.enum';
import { PgslValueType } from '../../enum/pgsl-value-type.enum';
import { BasePgslSyntaxTree, PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { PgslAliasDeclarationSyntaxTree } from '../declarations/pgsl-alias-declaration-syntax-tree';
import { PgslEnumDeclarationSyntaxTree } from '../declarations/pgsl-enum-declaration-syntax-tree';
import { PgslStructDeclarationSyntaxTree } from '../declarations/pgsl-struct-declaration-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslTemplateListSyntaxTree } from './pgsl-template-list-syntax-tree';

/**
 * General PGSL syntax tree of a type definition.
 */
export class PgslTypeDeclarationSyntaxTree extends BasePgslSyntaxTree<PgslTypeDefinitionSyntaxTreeStructureData> {
    /**
     * Define types.
     */
    private static readonly mBuildInTypes: Dictionary<PgslBuildInTypeName, TypeDefinitionInformation> = (() => {
        const lTypes: Dictionary<PgslBuildInTypeName, TypeDefinitionInformation> = new Dictionary<PgslBuildInTypeName, TypeDefinitionInformation>();

        // Add type to Type storage.
        const lAddType = (pType: PgslBuildInTypeName, pValueType: PgslValueType, pTemplate?: TypeDefinitionInformation['template']): void => {
            lTypes.set(pType, { type: pType, valueType: pValueType, template: pTemplate ?? [] });
        };

        // Add simple types.
        lAddType(PgslBuildInTypeName.Boolean, PgslValueType.Boolean);
        lAddType(PgslBuildInTypeName.Integer, PgslValueType.Numeric);
        lAddType(PgslBuildInTypeName.UnsignedInteger, PgslValueType.Numeric);
        lAddType(PgslBuildInTypeName.Float, PgslValueType.Numeric);

        // Vector types.
        lAddType(PgslBuildInTypeName.Vector2, PgslValueType.Vector);
        lAddType(PgslBuildInTypeName.Vector3, PgslValueType.Vector);
        lAddType(PgslBuildInTypeName.Vector4, PgslValueType.Vector);

        // Matrix types.
        lAddType(PgslBuildInTypeName.Matrix22, PgslValueType.Matrix);
        lAddType(PgslBuildInTypeName.Matrix23, PgslValueType.Matrix);
        lAddType(PgslBuildInTypeName.Matrix24, PgslValueType.Matrix);
        lAddType(PgslBuildInTypeName.Matrix32, PgslValueType.Matrix);
        lAddType(PgslBuildInTypeName.Matrix33, PgslValueType.Matrix);
        lAddType(PgslBuildInTypeName.Matrix34, PgslValueType.Matrix);
        lAddType(PgslBuildInTypeName.Matrix42, PgslValueType.Matrix);
        lAddType(PgslBuildInTypeName.Matrix43, PgslValueType.Matrix);
        lAddType(PgslBuildInTypeName.Matrix44, PgslValueType.Matrix);

        // Buildin types.
        lAddType(PgslBuildInTypeName.Position, PgslValueType.Vector);
        lAddType(PgslBuildInTypeName.LocalInvocationId, PgslValueType.Vector);
        lAddType(PgslBuildInTypeName.GlobalInvocationId, PgslValueType.Vector);
        lAddType(PgslBuildInTypeName.WorkgroupId, PgslValueType.Vector);
        lAddType(PgslBuildInTypeName.NumWorkgroups, PgslValueType.Vector);
        lAddType(PgslBuildInTypeName.VertexIndex, PgslValueType.Numeric);
        lAddType(PgslBuildInTypeName.InstanceIndex, PgslValueType.Numeric);
        lAddType(PgslBuildInTypeName.FragDepth, PgslValueType.Numeric);
        lAddType(PgslBuildInTypeName.SampleIndex, PgslValueType.Numeric);
        lAddType(PgslBuildInTypeName.SampleMask, PgslValueType.Numeric);
        lAddType(PgslBuildInTypeName.LocalInvocationIndex, PgslValueType.Numeric);
        lAddType(PgslBuildInTypeName.FrontFacing, PgslValueType.Boolean);
        lAddType(PgslBuildInTypeName.ClipDistances, PgslValueType.Array, [
            ['Expression']
        ]);


        // Bundled types.
        lAddType(PgslBuildInTypeName.Array, PgslValueType.Array, [
            ['Type'], ['Type', 'Expression']
        ]);

        // Image textures.
        lAddType(PgslBuildInTypeName.Texture1d, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.Texture2d, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.Texture2dArray, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.Texture3d, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureCube, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureCubeArray, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureMultisampled2d, PgslValueType.Texture, [
            ['Type']
        ]);

        // External tetures.
        lAddType(PgslBuildInTypeName.TextureExternal, PgslValueType.Texture,);

        // Storage textures.
        lAddType(PgslBuildInTypeName.TextureStorage1d, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureStorage2d, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureStorage2dArray, PgslValueType.Texture, [
            ['Type']
        ]);
        lAddType(PgslBuildInTypeName.TextureStorage3d, PgslValueType.Texture, [
            ['Type']
        ]);

        // Depth Textures.
        lAddType(PgslBuildInTypeName.TextureDepth2d, PgslValueType.Texture,);
        lAddType(PgslBuildInTypeName.TextureDepth2dArray, PgslValueType.Texture,);
        lAddType(PgslBuildInTypeName.TextureDepthCube, PgslValueType.Texture,);
        lAddType(PgslBuildInTypeName.TextureDepthCubeArray, PgslValueType.Texture,);
        lAddType(PgslBuildInTypeName.TextureDepthMultisampled2d, PgslValueType.Texture,);

        // Sampler
        lAddType(PgslBuildInTypeName.Sampler, PgslValueType.Texture,);
        lAddType(PgslBuildInTypeName.SamplerComparison, PgslValueType.Texture,);

        return lTypes;
    })();

    private mIsConstructible: boolean | null;
    private mIsFixedLength: boolean | null;
    private readonly mRawName: string;
    private readonly mRawTemplateList: PgslTemplateListSyntaxTree | null;
    private mTemplate: PgslTemplateListSyntaxTree | null;
    private mType: PgslBuildInTypeName | PgslStructDeclarationSyntaxTree | null;
    private mValueType: PgslValueType | null;

    /**
     * Type is a constructible type.
     */
    public get isConstructible(): boolean {
        this.ensureValidity();

        // Determine if type is a construtable type.
        if (this.mIsConstructible === null) {
            this.mIsConstructible = this.determineConstructible();
        }

        return this.mIsConstructible;
    }

    /**
     * Type has a fixed byte length.
     */
    public get isFixedLength(): boolean {
        this.ensureValidity();

        // Determine if type is a construtable type.
        if (this.mIsFixedLength === null) {
            this.mIsFixedLength = this.determineFixedLength();
        }

        return this.mIsFixedLength;
    }

    /**
     * Template of type.
     */
    public get template(): PgslTemplateListSyntaxTree | null {
        this.ensureValidity();

        return this.mTemplate;
    }

    /**
     * Type definition type.
     */
    public get type(): PgslBuildInTypeName | PgslStructDeclarationSyntaxTree {
        this.ensureValidity();

        // Value not set.
        if (!this.mType) {
            throw new Exception(`Type of definition not set.`, this);
        }

        return this.mType;
    }

    /**
     * Type of value.
     */
    public get valueType(): PgslValueType {
        this.ensureValidity();

        // Value not set.
        if (!this.mValueType) {
            throw new Exception(`Value type of definition not set.`, this);
        }

        return this.mValueType;
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
        this.mRawName = pData.name;
        this.mRawTemplateList = pData.templateList ?? null;

        this.mTemplate = null;
        this.mType = null;
        this.mValueType = null;

        this.mIsConstructible = null;
        this.mIsFixedLength = null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Try to resolve as alias, struct or build in value..
        if (!this.resolveAlias(this.mRawName, this.mRawTemplateList)
            && !this.resolveEnum(this.mRawName, this.mRawTemplateList)
            && !this.resolveStruct(this.mRawName, this.mRawTemplateList)
            && !this.resolveBuildIn(this.mRawName, this.mRawTemplateList)) {
            throw new Exception(`Typename "${this.mRawName}" not defined`, this);
        }
    }

    /**
     * Check type to be constructible.
     * 
     * @returns if the type is constructible.
     */
    private determineConstructible(): boolean {
        const lConstructibleValueType: Array<PgslValueType> = [PgslValueType.Boolean, PgslValueType.Array, PgslValueType.Matrix, PgslValueType.Numeric, PgslValueType.Vector];

        // Must be a constructible type
        if (!lConstructibleValueType.includes(this.mValueType!)) {
            return false;
        }

        // Inner types of Arrays musst be a constructible type to and have a fixed blueprint.
        if (this.mValueType! === PgslValueType.Array) {
            // Must have a fixed footprint so must have a second length template parameter.
            if (this.mTemplate!.items.length !== 2) {
                return false;
            }

            // The inner type musst be constructible to.
            const lArrayInnerType: PgslTypeDeclarationSyntaxTree = this.mTemplate!.items[0] as PgslTypeDeclarationSyntaxTree;
            if (!lConstructibleValueType.includes(lArrayInnerType.valueType)) {
                return false;
            }
        }

        return true;
    }

    private determineFixedLength(): boolean {
        return false; // TODO:
    }

    /**
     * Try to resolve raw type as alias type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveAlias(pRawName: string, pRawTemplate: PgslTemplateListSyntaxTree | null): boolean {
        // Resolve alias
        const lAlias: PgslAliasDeclarationSyntaxTree | null = this.document.resolveAlias(pRawName);
        if (lAlias) {
            if (pRawTemplate) {
                throw new Exception(`Alias can't have templates values.`, this);
            }

            this.mTemplate = lAlias.type.template;
            this.mType = lAlias.type.type;
            this.mValueType = lAlias.type.valueType;

            return true;
        }

        return false;
    }

    /**
     * Try to resolve raw type as build in value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveBuildIn(pRawName: string, pRawTemplate: PgslTemplateListSyntaxTree | null): boolean {
        const lResolver = (): [PgslBuildInTypeName, PgslValueType, PgslTemplateListSyntaxTree | null] | null => {
            // Validate as build in type.
            const lTypeDefinitionInformation: TypeDefinitionInformation | undefined = PgslTypeDeclarationSyntaxTree.mBuildInTypes.get(pRawName as PgslBuildInTypeName);
            if (lTypeDefinitionInformation) {
                // Type exists and doesn't need a template.
                if (!pRawTemplate && lTypeDefinitionInformation.template.length === 0) {
                    return [lTypeDefinitionInformation.type, lTypeDefinitionInformation.valueType, pRawTemplate];
                }

                // Validate all templates.
                if (!pRawTemplate) {
                    throw new Exception(`Type "${pRawName}" needs template variables.`, this);
                }

                for (const lTemplate of lTypeDefinitionInformation.template) {
                    // Parameter length not matched.
                    if (lTemplate.length !== pRawTemplate.items.length) {
                        continue;
                    }

                    // Match every single template parameter.
                    let lTemplateMatches: boolean = true;
                    for (let lIndex = 0; lIndex < lTemplate.length; lIndex++) {
                        const lExpectedTemplateType: 'Expression' | 'Type' = lTemplate[lIndex];

                        const lActualTemplateParameter: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> = pRawTemplate.items[lIndex];
                        const lActualTemplateType: 'Expression' | 'Type' = (lActualTemplateParameter instanceof PgslTypeDeclarationSyntaxTree) ? 'Type' : 'Expression';

                        // Need to have same parameter type.
                        if (lExpectedTemplateType !== lActualTemplateType) {
                            lTemplateMatches = false;
                            break;
                        }
                    }

                    // All templates matches.
                    if (lTemplateMatches) {
                        return [lTypeDefinitionInformation.type, lTypeDefinitionInformation.valueType, pRawTemplate];
                    }
                }

                throw new Exception(`Type "${pRawName}" has invalid template parameter.`, this);
            }

            return null;
        };

        // Try to resolve type.
        const lResolvedType: [PgslBuildInTypeName, PgslValueType, PgslTemplateListSyntaxTree | null] | null = lResolver();
        if (!lResolvedType) {
            return false;
        }

        // Set type and template when resolved.
        [this.mType, this.mValueType, this.mTemplate] = lResolvedType;

        return true;
    }

    /**
     * Try to resolve raw type as enum type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveEnum(pRawName: string, pRawTemplate: PgslTemplateListSyntaxTree | null): boolean {
        // Resolve enum
        const lEnum: PgslEnumDeclarationSyntaxTree | null = this.document.resolveEnum(pRawName);
        if (lEnum) {
            if (pRawTemplate) {
                throw new Exception(`Enum can't have templates values.`, this);
            }

            // Enum types are converted into unsiged integer.
            this.mTemplate = null;
            this.mType = PgslBuildInTypeName.UnsignedInteger;
            this.mValueType = PgslValueType.Numeric;

            return true;
        }

        return false;
    }

    /**
     * Try to resolve raw type as struct type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveStruct(pRawName: string, pRawTemplate: PgslTemplateListSyntaxTree | null): boolean {
        // Resolve struct
        const lStruct: PgslStructDeclarationSyntaxTree | null = this.document.resolveStruct(pRawName);
        if (lStruct) {
            if (pRawTemplate) {
                throw new Exception(`Structs can't have templates values.`, this);
            }

            this.mTemplate = null;
            this.mType = lStruct;
            this.mValueType = PgslValueType.Struct;

            return true;
        }

        return false;
    }
}

type PgslTypeDefinitionSyntaxTreeStructureData = {
    name: string,
    templateList?: PgslTemplateListSyntaxTree;
};

type TypeDefinitionInformation = {
    type: PgslBuildInTypeName;
    template: Array<Array<'Expression' | 'Type'>>;
    valueType: PgslValueType;
};