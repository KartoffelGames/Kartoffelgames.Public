import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";
import { PgslSamplerTypeName } from "./enum/pgsl-sampler-build-name.enum.ts";

/**
 * Sampler type definition.
 */
export class PgslSamplerTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
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
     * Transpile current type definition into a string.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        return this.comparison ? "sampler_comparison" : "sampler";
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both share the same comparison type.
     */
    protected override equals(_pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
        return this.mComparision === pTarget.comparison;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    protected override isExplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: this): boolean {
        // A texture is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    protected override isImplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: this): boolean {
        // A texture is never explicit nor implicit castable.
        return false;
    }

    /**
     * Validate data of current structure.
     * 
     * @param _pValidationTrace - Validation trace to use.
     */
    protected override onValidateIntegrity(_pValidationTrace: PgslSyntaxTreeValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment {
        return {
            additional: undefined,
            baseType: PgslBaseTypeName.Sampler,
            composite: false,
            indexable: false,
            storable: false,
            hostShareable: false,
            constructible: false,
            fixedFootprint: true,
        };
    }
}