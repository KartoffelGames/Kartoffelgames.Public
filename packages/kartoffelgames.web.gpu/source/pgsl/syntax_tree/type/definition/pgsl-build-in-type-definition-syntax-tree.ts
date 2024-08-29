import { Exception } from '@kartoffelgames/core';
import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslBuildInTypeName } from '../enum/pgsl-build-in-type-name.enum';
import { PgslNumericTypeName } from '../enum/pgsl-numeric-type-name.enum';
import { PgslTypeDeclarationSyntaxTree } from '../pgsl-type-declaration-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from './pgsl-numeric-type-definition-syntax-tree';

export class PgslBuildInTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslBuildInTypeDefinitionSyntaxTreeStructureData> {
    private mRealType: BasePgslTypeDefinitionSyntaxTree | null;
    private readonly mTemplate: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree | null;
    private readonly mTypeName: PgslBuildInTypeName;

    /**
     * Get real type of build in.
     */
    public get realType(): BasePgslTypeDefinitionSyntaxTree {
        this.ensureValidity();

        // Init value.
        if (this.mRealType === null) {
            this.mRealType = this.determinateRealType();
        }

        return this.mRealType;
    }

    /**
     * Typename of numerice type.
     */
    public get typeName(): PgslBuildInTypeName {
        return this.mTypeName;
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
    public constructor(pData: PgslBuildInTypeDefinitionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mTypeName = pData.type;
        this.mTemplate = pData.template ?? null;
        this.mRealType = null;
    }

    /**
     * Determinate if declaration is a composite type.
     */
    protected override determinateIsComposite(): boolean {
        return false;
    }

    /**
     * Determinate if declaration is a constructable.
     */
    protected override determinateIsConstructable(): boolean {
        return true;
    }

    /**
     * Determinate if declaration has a fixed byte length.
     */
    protected override determinateIsFixed(): boolean {
        return true;
    }

    /**
     * Determinate if composite value with properties that can be access by index.
     */
    protected override determinateIsIndexable(): boolean {
        // TODO: Dependent on indexable.
        return false;
    }

    /**
     * Determinate if declaration is a plain type.
     */
    protected override determinateIsPlain(): boolean {
        return true;
    }

    /**
     * Determinate if is sharable with the host.
     */
    protected override determinateIsShareable(): boolean {
        // Build ins are never sharable.
        return false;
    }

    /**
     * Determinate if value is storable in a variable.
     */
    protected override determinateIsStorable(): boolean {
        return true;
    }

    /**
     * On equal check of type definitions.
     * 
     * @param pTarget - Target type definition.
     */
    protected override onEqual(pTarget: this): boolean {
        return this.mTypeName === pTarget.typeName;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Only clip distance needs validation.
        if (this.mTypeName === PgslBuildInTypeName.ClipDistances) {
            // Must have a template.
            if (!this.mTemplate) {
                throw new Exception(`Clip distance buildin must have a template value.`, this);
            }

            // Template must be a expression.
            if (!(this.mTemplate instanceof BasePgslExpressionSyntaxTree)) {
                throw new Exception(`Clip distance buildin template value musst be a value expression.`, this);
            }

            // Template needs to be a constant.
            if (!this.mTemplate.isConstant) {
                throw new Exception(`Clip distance buildin template value musst be a constant.`, this);
            }

            // Template needs to be a number expression.
            if (!(this.mTemplate.resolveType instanceof PgslNumericTypeDefinitionSyntaxTree)) {
                throw new Exception(`Clip distance buildin template value musst be a unssigned integer.`, this);
            }

            // Template needs to be a unsigned integer.
            if (this.mTemplate.resolveType.typeName !== PgslNumericTypeName.UnsignedInteger) {
                throw new Exception(`Clip distance buildin template value musst be a unssigned integer.`, this);
            }
        }
    }

    /**
     * Determinate if declaration is a composite type.
     */
    private determinateRealType(): BasePgslTypeDefinitionSyntaxTree {
        // Big ass switch case.
        switch (this.mTypeName) {
            case PgslBuildInTypeName.Position: {
                break;
            }
            case PgslBuildInTypeName.LocalInvocationId: {
                break;
            }
            case PgslBuildInTypeName.GlobalInvocationId: {
                break;
            }
            case PgslBuildInTypeName.WorkgroupId: {
                break;
            }
            case PgslBuildInTypeName.NumWorkgroups: {
                break;
            }
            case PgslBuildInTypeName.VertexIndex: {
                break;
            }
            case PgslBuildInTypeName.InstanceIndex: {
                break;
            }
            case PgslBuildInTypeName.FragDepth: {
                break;
            }
            case PgslBuildInTypeName.SampleIndex: {
                break;
            }
            case PgslBuildInTypeName.SampleMask: {
                break;
            }
            case PgslBuildInTypeName.LocalInvocationIndex: {
                break;
            }
            case PgslBuildInTypeName.FrontFacing: {
                break;
            }
            case PgslBuildInTypeName.ClipDistances: {
                break;
            }
        }

        throw new Exception('Unsupported buildin type name.', this);
    }
}

export type PgslBuildInTypeDefinitionSyntaxTreeStructureData = {
    type: PgslBuildInTypeName;
    template?: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree;
};