import { PgslSamplerTypeName } from '../enum/pgsl-sampler-build-name.enum';
import { PgslTypeName } from '../enum/pgsl-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';

export class PgslSamplerTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslSamplerTypeDefinitionSyntaxTreeStructureData> {
    private readonly mComparision!: boolean;

    /**
     * If sampler is a comparison sampler.
     */
    public get comparison(): boolean {
        return this.mComparision;
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
    public constructor(pData: PgslSamplerTypeDefinitionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        // Create type name
        const lTypeName: PgslTypeName = pData.typeName === PgslSamplerTypeName.SamplerComparison ? PgslTypeName.SamplerComparison : PgslTypeName.Sampler;

        // Create identifier.
        const lIdentifier: string = `ID:SAMPLER->${lTypeName.toUpperCase()}`;

        // Return cached when available.
        if (BasePgslTypeDefinitionSyntaxTree.mTypeCache.has(lIdentifier)) {
            return BasePgslTypeDefinitionSyntaxTree.mTypeCache.get(lIdentifier)! as PgslSamplerTypeDefinitionSyntaxTree;
        }

        // Create.
        super(PgslTypeName.Boolean, lIdentifier, pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set cache.
        BasePgslTypeDefinitionSyntaxTree.mTypeCache.set(lIdentifier, this);

        // Set data.
        this.mComparision = pData.typeName === PgslSamplerTypeName.SamplerComparison;
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
        return false;
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
        return false;
    }

    /**
     * Determinate if declaration is a plain type.
     */
    protected override determinateIsPlain(): boolean {
        return false;
    }

    /**
     * Determinate if is sharable with the host.
     */
    protected override determinateIsShareable(): boolean {
        return false;
    }

    /**
     * Determinate if value is storable in a variable.
     */
    protected override determinateIsStorable(): boolean {
        return false;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing to validate.
    }
}

export type PgslSamplerTypeDefinitionSyntaxTreeStructureData = {
    typeName: PgslSamplerTypeName;
};