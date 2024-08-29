import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree } from '../base-pgsl-syntax-tree';
import { PgslAliasDeclarationSyntaxTree } from '../declaration/pgsl-alias-declaration-syntax-tree';
import { PgslEnumDeclarationSyntaxTree } from '../declaration/pgsl-enum-declaration-syntax-tree';
import { PgslStructDeclarationSyntaxTree } from '../declaration/pgsl-struct-declaration-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from './definition/base-pgsl-type-definition-syntax-tree';
import { PgslBuildInTypeDefinitionSyntaxTree } from './definition/pgsl-build-in-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from './definition/pgsl-numeric-type-definition-syntax-tree';
import { PgslStringTypeDefinitionSyntaxTree } from './definition/pgsl-string-type-definition-syntax-tree';
import { PgslStructTypeDefinitionSyntaxTree } from './definition/pgsl-struct-type-definition-syntax-tree';
import { PgslBuildInTypeName } from './enum/pgsl-build-in-type-name.enum';
import { PgslNumericTypeName } from './enum/pgsl-numeric-type-name.enum';
import { PgslTypeName } from './enum/pgsl-type-name.enum';
import { PgslBooleanTypeDefinitionSyntaxTree } from './definition/pgsl-boolean-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from './definition/pgsl-vector-type-definition-syntax-tree';
import { PgslVectorTypeName } from './enum/pgsl-vector-type-name.enum';
import { PgslMatrixTypeDefinitionSyntaxTree } from './definition/pgsl-matrix-type-definition-syntax-tree';
import { PgslMatrixTypeName } from './enum/pgsl-matrix-type-name.enum';
import { PgslSamplerTypeName } from './enum/pgsl-sampler-build-name.enum';
import { PgslSamplerTypeDefinitionSyntaxTree } from './definition/pgsl-sampler-type-definition-syntax-tree';
import { PgslPointerTypeDefinitionSyntaxTree } from './definition/pgsl-pointer-type-definition-syntax-tree';

/**
 * General PGSL syntax tree of a type definition.
 */
export class PgslTypeDeclarationSyntaxTree extends BasePgslSyntaxTree<PgslTypeDefinitionSyntaxTreeStructureData> {
    /**
     * Define types.
     */
    private static readonly mBuildInTypes: Dictionary<PgslBuildInTypeName, TypeDefinitionInformation> = (() => {  // TODO: Move it into a seperate Type handler.
        const lTypes: Dictionary<PgslBuildInTypeName, TypeDefinitionInformation> = new Dictionary<PgslBuildInTypeName, TypeDefinitionInformation>();

        // Add type to Type storage.
        const lAddType = (pType: PgslBuildInTypeName, pValueType: PgslValueType, pTemplate?: TypeDefinitionInformation['template']): void => {
            lTypes.set(pType, { type: pType, valueType: pValueType, template: pTemplate ?? [] });
        };

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

        return lTypes;
    })();

    private readonly mRawName: string;
    private readonly mRawTemplateList: PgslTypeTemplateList | null;
    private mType: BasePgslTypeDefinitionSyntaxTree | null;
    private mPointer: boolean;

    /**
     * Type definition type.
     */
    public get type(): BasePgslTypeDefinitionSyntaxTree {
        this.ensureValidity();

        // Value not set.
        if (!this.mType) {
            throw new Exception(`Type of definition not set.`, this);
        }

        return this.mType;
    }

    /**
     * Type declaration is a pointer .
     */
    public get pointer(): boolean {
        return this.mPointer;
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

        // Set data buffer data.
        this.mRawName = pData.name;
        this.mRawTemplateList = pData.templateList ?? null;

        // Set data.
        this.mPointer = pData.pointer;
        this.mType = null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Try to parse to struct type.
        this.mType = this.resolveStruct(this.mRawName, this.mRawTemplateList);
        if (this.mType) {
            return;
        }

        // Try to parse alias type.
        this.mType = this.resolveAlias(this.mRawName, this.mRawTemplateList);
        if (this.mType) {
            return;
        }

        // Try to parse enum type.
        this.mType = this.resolveEnum(this.mRawName, this.mRawTemplateList);
        if (this.mType) {
            return;
        }

        // Try to parse build in type.
        this.mType = this.resolveBuildIn(this.mRawName, this.mRawTemplateList);
        if (this.mType) {
            return;
        }

        // Try to parse numeric type.
        this.mType = this.resolveNumeric(this.mRawName, this.mRawTemplateList);
        if (this.mType) {
            return;
        }

        // Try to parse boolean type.
        this.mType = this.resolveBoolean(this.mRawName, this.mRawTemplateList);
        if (this.mType) {
            return;
        }

        // Try to parse string type.
        this.mType = this.resolveString(this.mRawName, this.mRawTemplateList);
        if (this.mType) {
            return;
        }

        // Try to parse string type.
        this.mType = this.resolveVector(this.mRawName, this.mRawTemplateList);
        if (this.mType) {
            return;
        }

        // Try to parse matrix type.
        this.mType = this.resolveMatrix(this.mRawName, this.mRawTemplateList);
        if (this.mType) {
            return;
        }

        // Try to parse sampler type.
        this.mType = this.resolveSampler(this.mRawName, this.mRawTemplateList);
        if (this.mType) {
            return;
        }

        // Try to parse pointer type.
        this.mType = this.resolvePointer(this.mRawName, this.mRawTemplateList);
        if (this.mType) {
            return;
        }

        // resolveArray => Nothing
        // resolveTexture => PgslTextureTypeName

        throw new Exception(`Typename "${this.mRawName}" not defined`, this);
    }

    /**
     * Try to resolve raw type as alias type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveAlias(pRawName: string, pRawTemplate: PgslTypeTemplateList | null): BasePgslTypeDefinitionSyntaxTree | null {
        // Resolve alias
        const lAlias: PgslAliasDeclarationSyntaxTree | null = this.document.resolveAlias(pRawName);
        if (lAlias) {
            if (pRawTemplate) {
                throw new Exception(`Alias can't have templates values.`, this);
            }

            return lAlias.type;
        }

        return null;
    }

    /**
     * Try to resolve raw type as boolean type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveBoolean(pRawName: string, pRawTemplate: PgslTypeTemplateList | null): BasePgslTypeDefinitionSyntaxTree | null {
        // Resolve boolean type.
        if (pRawName !== PgslTypeName.Boolean) {
            return null;
        }

        // Boolean should not have any templates.
        if (pRawTemplate) {
            throw new Exception(`Boolean can't have templates values.`, this);
        }

        return new PgslBooleanTypeDefinitionSyntaxTree({}, 0, 0, 0, 0).setParent(this).validateIntegrity();
    }

    /**
     * Try to resolve raw type as build in value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveBuildIn(pRawName: string, pRawTemplate: PgslTypeTemplateList | null): BasePgslTypeDefinitionSyntaxTree | null {
        // Try to resolve type name.
        const lTypeName: PgslBuildInTypeName | undefined = EnumUtil.cast(PgslBuildInTypeName, pRawName);
        if (!lTypeName) {
            return null;
        }

        // BuildInType parameter.
        const lParameter: ConstructorParameters<typeof PgslBuildInTypeDefinitionSyntaxTree>[0] = {
            type: lTypeName
        };

        // When a template is present, try to add it.
        if (pRawTemplate && pRawTemplate.length > 0) {
            lParameter.template = pRawTemplate[0];
        }

        // Build BuildInType definition.
        return new PgslBuildInTypeDefinitionSyntaxTree(lParameter, 0, 0, 0, 0).setParent(this).validateIntegrity();
    }

    /**
     * Try to resolve raw type as enum type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveEnum(pRawName: string, pRawTemplate: PgslTypeTemplateList | null): BasePgslTypeDefinitionSyntaxTree | null {
        // Resolve enum
        const lEnum: PgslEnumDeclarationSyntaxTree | null = this.document.resolveEnum(pRawName);
        if (!lEnum) {
            return null;
        }

        // Enums should not have any templates.
        if (pRawTemplate) {
            throw new Exception(`Enum can't have templates values.`, this);
        }

        return lEnum.type;
    }

    /**
     * Try to resolve raw type as matrix value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveMatrix(pRawName: string, pRawTemplate: PgslTypeTemplateList | null): BasePgslTypeDefinitionSyntaxTree | null {
        // Try to resolve type name.
        const lTypeName: PgslMatrixTypeName | undefined = EnumUtil.cast(PgslMatrixTypeName, pRawName);
        if (!lTypeName) {
            return null;
        }

        // Validate matrix type.
        if (!pRawTemplate || pRawTemplate.length !== 1) {
            throw new Exception(`Matrix types need a single template type.`, this);
        }

        // Validate template parameter.
        const lMatrixInnerTypeTemplate: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree = pRawTemplate[0];
        if (!(lMatrixInnerTypeTemplate instanceof PgslTypeDeclarationSyntaxTree)) {
            throw new Exception(`Matrix template parameter needs to be a type definition.`, this);
        }

        // Build matrix definition.
        return new PgslMatrixTypeDefinitionSyntaxTree({
            typeName: lTypeName,
            innerType: lMatrixInnerTypeTemplate.type
        }, 0, 0, 0, 0).setParent(this).validateIntegrity();
    }

    /**
     * Try to resolve raw type as numeric value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveNumeric(pRawName: string, pRawTemplate: PgslTypeTemplateList | null): BasePgslTypeDefinitionSyntaxTree | null {
        // Try to resolve type name.
        const lTypeName: PgslNumericTypeName | undefined = EnumUtil.cast(PgslNumericTypeName, pRawName);
        if (!lTypeName) {
            return null;
        }

        // Numerics should not have any templates.
        if (pRawTemplate) {
            throw new Exception(`Numeric can't have templates values.`, this);
        }

        // Build numeric definition.
        return new PgslNumericTypeDefinitionSyntaxTree({
            typeName: lTypeName
        }, 0, 0, 0, 0).setParent(this).validateIntegrity();
    }

    /**
     * Try to resolve raw type as pointer value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolvePointer(pRawName: string, pRawTemplate: PgslTypeTemplateList | null): BasePgslTypeDefinitionSyntaxTree | null {
        // Try to resolve type name.
        if (!this.mPointer) {
            return null;
        }

        // TODO: Parse type again.
        const lTypeDeclaration: PgslTypeDeclarationSyntaxTree = new PgslTypeDeclarationSyntaxTree({
            name: this.mRawName,
            templateList: this.mRawTemplateList
        }, this.meta);

        // Build pointer type definition.
        return new PgslPointerTypeDefinitionSyntaxTree({
            referencedType: 
        }, 0, 0, 0, 0).setParent(this).validateIntegrity();
    }

    /**
     * Try to resolve raw type as sampler value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveSampler(pRawName: string, pRawTemplate: PgslTypeTemplateList | null): BasePgslTypeDefinitionSyntaxTree | null {
        // Try to resolve type name.
        const lTypeName: PgslSamplerTypeName | undefined = EnumUtil.cast(PgslSamplerTypeName, pRawName);
        if (!lTypeName) {
            return null;
        }

        // Sampler should not have any templates.
        if (pRawTemplate) {
            throw new Exception(`Numeric can't have templates values.`, this);
        }

        // Build numeric definition.
        return new PgslSamplerTypeDefinitionSyntaxTree({
            typeName: lTypeName
        }, 0, 0, 0, 0).setParent(this).validateIntegrity();
    }

    /**
     * Try to resolve raw type as string type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveString(pRawName: string, pRawTemplate: PgslTypeTemplateList | null): BasePgslTypeDefinitionSyntaxTree | null {
        // Resolve string type.
        if (pRawName !== PgslTypeName.String) {
            return null;
        }

        // String should not have any templates.
        if (pRawTemplate) {
            throw new Exception(`String can't have templates values.`, this);
        }

        return new PgslStringTypeDefinitionSyntaxTree({}, 0, 0, 0, 0).setParent(this).validateIntegrity();
    }

    /**
     * Try to resolve raw type as struct type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveStruct(pRawName: string, pRawTemplate: PgslTypeTemplateList | null): PgslStructTypeDefinitionSyntaxTree | null {
        // Resolve struct
        const lStruct: PgslStructDeclarationSyntaxTree | null = this.document.resolveStruct(pRawName);
        if (!lStruct) {
            return null;
        }

        // Structs should not have any templates.
        if (pRawTemplate) {
            throw new Exception(`Structs can't have templates values.`, this);
        }

        // Create new struct type definition.
        return new PgslStructTypeDefinitionSyntaxTree({
            struct: lStruct
        }, 0, 0, 0, 0).setParent(this).validateIntegrity();
    }

    /**
     * Try to resolve raw type as vector value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveVector(pRawName: string, pRawTemplate: PgslTypeTemplateList | null): BasePgslTypeDefinitionSyntaxTree | null {
        // Try to resolve type name.
        const lTypeName: PgslVectorTypeName | undefined = EnumUtil.cast(PgslVectorTypeName, pRawName);
        if (!lTypeName) {
            return null;
        }

        // Validate vector type.
        if (!pRawTemplate || pRawTemplate.length !== 1) {
            throw new Exception(`Vector types need a single template type.`, this);
        }

        // Validate template parameter.
        const lVectorInnerTypeTemplate: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree = pRawTemplate[0];
        if (!(lVectorInnerTypeTemplate instanceof PgslTypeDeclarationSyntaxTree)) {
            throw new Exception(`Vector template parameter needs to be a type definition.`, this);
        }

        // Build vector definition.
        return new PgslVectorTypeDefinitionSyntaxTree({
            typeName: lTypeName,
            innerType: lVectorInnerTypeTemplate.type
        }, 0, 0, 0, 0).setParent(this).validateIntegrity();
    }
}

type PgslTypeTemplateList = Array<PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree>;

type PgslTypeDefinitionSyntaxTreeStructureData = {
    pointer: boolean;
    name: string;
    templateList?: PgslTypeTemplateList;
};