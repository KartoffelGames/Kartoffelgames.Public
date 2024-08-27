import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslBuildInTypeName } from '../enum/pgsl-build-in-type-name.enum';
import { PgslTypeDeclarationSyntaxTree } from '../pgsl-type-declaration-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';

export class PgslBuildInTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslBuildInTypeDefinitionSyntaxTreeStructureData> {
    private readonly mTemplate: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree | null;
    private readonly mTypeName: PgslBuildInTypeName;
    
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

        // TODO: Base on BuildIn Things
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

        // Set data.
        this.mTypeName = pData.type;
        this.mTemplate = pData.template ?? null;
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
     * Determinate if declaration is a plain type.
     */
    protected override determinateIsPlain(): boolean {
        return true;
    }

    /**
     * Determinate if is sharable with the host.
     */
    protected override determinateIsShareable(): boolean {
        return true;
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
     * @param _pTarget - Target type definition.
     */
    protected override onEqual(pTarget: this): boolean {
        // TODO: Validate expression.

        return this.mTypeName === pTarget.typeName;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing to validate.
    }
}

export type PgslBuildInTypeDefinitionSyntaxTreeStructureData = {
    type: PgslBuildInTypeName;
    template?: PgslTypeDeclarationSyntaxTree | BasePgslExpressionSyntaxTree;
};