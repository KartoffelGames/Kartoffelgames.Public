import { EnumUtil, Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree } from '../base-pgsl-syntax-tree';
import { PgslAliasDeclarationSyntaxTree } from '../declaration/pgsl-alias-declaration-syntax-tree';
import { PgslEnumDeclarationSyntaxTree } from '../declaration/pgsl-enum-declaration-syntax-tree';
import { PgslStructDeclarationSyntaxTree } from '../declaration/pgsl-struct-declaration-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from './definition/base-pgsl-type-definition-syntax-tree';
import { PgslArrayTypeDefinitionSyntaxTree } from './definition/pgsl-array-type-definition-syntax-tree';
import { PgslBooleanTypeDefinitionSyntaxTree } from './definition/pgsl-boolean-type-definition-syntax-tree';
import { PgslBuildInTypeDefinitionSyntaxTree } from './definition/pgsl-build-in-type-definition-syntax-tree';
import { PgslMatrixTypeDefinitionSyntaxTree } from './definition/pgsl-matrix-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from './definition/pgsl-numeric-type-definition-syntax-tree';
import { PgslPointerTypeDefinitionSyntaxTree } from './definition/pgsl-pointer-type-definition-syntax-tree';
import { PgslSamplerTypeDefinitionSyntaxTree } from './definition/pgsl-sampler-type-definition-syntax-tree';
import { PgslStringTypeDefinitionSyntaxTree } from './definition/pgsl-string-type-definition-syntax-tree';
import { PgslStructTypeDefinitionSyntaxTree } from './definition/pgsl-struct-type-definition-syntax-tree';
import { PgslTextureTypeDefinitionSyntaxTree } from './definition/pgsl-texture-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from './definition/pgsl-vector-type-definition-syntax-tree';
import { PgslBuildInTypeName } from './enum/pgsl-build-in-type-name.enum';
import { PgslMatrixTypeName } from './enum/pgsl-matrix-type-name.enum';
import { PgslNumericTypeName } from './enum/pgsl-numeric-type-name.enum';
import { PgslSamplerTypeName } from './enum/pgsl-sampler-build-name.enum';
import { PgslTextureTypeName } from './enum/pgsl-texture-type-name.enum';
import { PgslTypeName } from './enum/pgsl-type-name.enum';
import { PgslVectorTypeName } from './enum/pgsl-vector-type-name.enum';

/**
 * General PGSL syntax tree of a type definition.
 */
export class PgslTypeDeclarationSyntaxTree extends BasePgslSyntaxTree<PgslTypeDefinitionSyntaxTreeStructureData> {
    private readonly mPointer: boolean;
    private readonly mRawName: string;
    private readonly mRawTemplateList: PgslTypeTemplateList | null;
    private mType: BasePgslTypeDefinitionSyntaxTree | null;

    /**
     * Type declaration is a pointer .
     */
    public get pointer(): boolean {
        return this.mPointer;
    }

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

        // Try to parse vector type.
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

        // Try to parse array type.
        this.mType = this.resolveArray(this.mRawName, this.mRawTemplateList);
        if (this.mType) {
            return;
        }

        // Try to parse texture type.
        this.mType = this.resolveTexture(this.mRawName, this.mRawTemplateList);
        if (this.mType) {
            return;
        }

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
     * Try to resolve raw type as array type.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveArray(pRawName: string, pRawTemplate: PgslTypeTemplateList | null): BasePgslTypeDefinitionSyntaxTree | null {
        // Resolve array type.
        if (pRawName !== PgslTypeName.Array) {
            return null;
        }

        // Arrays need at least one type parameter.
        if (!pRawTemplate || pRawTemplate.length < 1) {
            throw new Exception(`Arrays need at least one template parameter`, this);
        }

        // But not more than two parameter.
        if (pRawTemplate.length > 2) {
            throw new Exception(`Arrays supports only two template parameter.`, this);
        }

        // First template needs to be a type.
        const lTypeTemplate: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree = pRawTemplate[0];
        if (!(lTypeTemplate instanceof PgslTypeDeclarationSyntaxTree)) {
            throw new Exception(`First array template parameter must be a type.`, this);
        }

        // BuildInType parameter.
        const lParameter: ConstructorParameters<typeof PgslArrayTypeDefinitionSyntaxTree>[0] = {
            type: lTypeTemplate.type
        };

        // Second length parameter.
        if (pRawTemplate.length > 1) {
            const lLengthParameter: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree = pRawTemplate[1];
            if (!(lLengthParameter instanceof BasePgslExpressionSyntaxTree)) {
                throw new Exception(`Arra length template parameter cant be a type.`, this);
            }

            // Set optional length expression.
            lParameter.lengthExpression = lLengthParameter;
        }

        // Build BuildInType definition.
        return new PgslArrayTypeDefinitionSyntaxTree(lParameter, 0, 0, 0, 0).setParent(this).validateIntegrity();
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

        // Create type declaration parameter.
        const lTypeDeclarationParameter: ConstructorParameters<typeof PgslTypeDeclarationSyntaxTree>[0] = {
            name: pRawName,
            pointer: false
        };

        // Add optional template.
        if (pRawTemplate) {
            lTypeDeclarationParameter.templateList = pRawTemplate;
        }

        // Parse type again but this time without pointer.
        const lTypeDeclaration: PgslTypeDeclarationSyntaxTree = new PgslTypeDeclarationSyntaxTree(lTypeDeclarationParameter,
            this.meta.position.start.column,
            this.meta.position.start.line,
            this.meta.position.end.column,
            this.meta.position.end.line
        ).setParent(this).validateIntegrity();

        // Build pointer type definition.
        return new PgslPointerTypeDefinitionSyntaxTree({
            referencedType: lTypeDeclaration.type
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
     * Try to resolve raw type as texture value.
     * 
     * @param pRawName - Type raw name.
     * @param pRawTemplate - Type template.
     */
    private resolveTexture(pRawName: string, pRawTemplate: PgslTypeTemplateList | null): BasePgslTypeDefinitionSyntaxTree | null {
        // Try to resolve type name.
        const lTypeName: PgslTextureTypeName | undefined = EnumUtil.cast(PgslTextureTypeName, pRawName);
        if (!lTypeName) {
            return null;
        }

        // BuildInType parameter.
        const lParameter: ConstructorParameters<typeof PgslTextureTypeDefinitionSyntaxTree>[0] = {
            typeName: lTypeName
        };

        // When a template is present, try to add it.
        if (pRawTemplate) {
            // Limit template length.
            if (pRawTemplate.length > 2) {
                throw new Exception(`Texture type only supports two parameter.`, this);
            }

            const lTemplateList: Array<BasePgslExpressionSyntaxTree> = new Array<BasePgslExpressionSyntaxTree>();

            // First format parameter.
            if (pRawTemplate.length > 0) {
                const lTypeParameter: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree = pRawTemplate[0];
                if (!(lTypeParameter instanceof BasePgslExpressionSyntaxTree)) {
                    throw new Exception(`Texture type expression needs to be a value expression.`, this);
                }

                lTemplateList.push(lTypeParameter);
            }

            // Second access parameter.
            if (pRawTemplate.length > 1) {
                const lAccessParameter: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree = pRawTemplate[0];
                if (!(lAccessParameter instanceof BasePgslExpressionSyntaxTree)) {
                    throw new Exception(`Texture type expression needs to be a value expression.`, this);
                }

                lTemplateList.push(lAccessParameter);
            }

            // Set template list.
            lParameter.template = lTemplateList;
        }

        // Build texture type definition.
        return new PgslTextureTypeDefinitionSyntaxTree(lParameter, 0, 0, 0, 0).setParent(this).validateIntegrity();
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