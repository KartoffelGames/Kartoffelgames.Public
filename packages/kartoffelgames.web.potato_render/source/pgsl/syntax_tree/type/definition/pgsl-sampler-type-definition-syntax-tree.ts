import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
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
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslSamplerTypeDefinitionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pData, pData.typeName as unknown as PgslTypeName, pMeta, pBuildIn);
        if (this.loadedFromCache) {
            return this;
        }

        // Set data.
        this.mComparision = pData.typeName === PgslSamplerTypeName.SamplerComparison;
    }

    /**
     * Determinate structures identifier.
     */
    protected determinateIdentifier(this: null, pData: PgslSamplerTypeDefinitionSyntaxTreeStructureData): string {
        return `ID:TYPE-DEF_SAMPLER->${pData.typeName.toUpperCase()}`;
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