import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { PgslBaseTypeName } from '../enum/pgsl-base-type-name.enum';
import { PgslSamplerTypeName } from '../enum/pgsl-sampler-build-name.enum';
import { BasePgslTypeDefinitionSyntaxTree, PgslTypeDefinitionAttributes } from './base-pgsl-type-definition-syntax-tree';

/**
 * Sampler type definition.
 */
export class PgslSamplerTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<null> {
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
    public constructor(pSamplerType: PgslSamplerTypeName, pMeta: BasePgslSyntaxTreeMeta) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pMeta);

        // Set data.
        this.mComparision = pSamplerType === PgslSamplerTypeName.SamplerComparison;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    protected override isExplicitCastable(_pTarget: this): boolean {
        // Never castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    protected override isImplicitCastable(_pTarget: this): boolean {
        // Never castable.
        return false;
    }

    /**
     * Setup syntax tree.
     * 
     * @returns setup data.
     */
    protected override onSetup(): PgslTypeDefinitionAttributes<null> {
        return {
            aliased: false,
            baseType: PgslBaseTypeName.Sampler,
            data: null,
            typeAttributes: {
                composite: false,
                constructable: false,
                fixed: true,
                indexable: false,
                plain: false,
                hostSharable: false,
                storable: false
            }
        };
    }
}