import type { TypeCst } from '../../concrete_syntax_tree/general.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { BaseType, TypeProperties } from './i-type.interface.ts';

/**
 * Invalid type definition.
 * Represents an invalid or erroneous type that cannot be used in normal operations.
 * This type is used as a fallback when type resolution fails or encounters errors.
 */
export class PgslInvalidType extends AbstractSyntaxTree<TypeCst, TypeProperties> implements BaseType {
    private readonly mShadowedType: BaseType;

    /**
     * The type that is being shadowed.
     * If it does not shadow another type, it is itself.
     */
    public get shadowedType(): BaseType {
        return this.mShadowedType;
    }

    /**
     * Constructor for invalid type.
     * 
     * @param pShadowedType - Type that is the actual type of this.
     */
    public constructor(pShadowedType?: BaseType) {
        super({ type: 'Type', range: [0, 0, 0, 0] });

        this.mShadowedType = pShadowedType ?? this;
    }

    /**
     * Check if this invalid type is equal to the target type.
     * Invalid types are never equal to any type, including other invalid types.
     * 
     * @param _pTarget - Target type to compare against.
     * 
     * @returns Always false - invalid types are never equal.
     */
    public equals(_pTarget: BaseType): boolean {
        return false;
    }

    /**
     * Check if this invalid type is implicitly castable into the target type.
     * Invalid types are never castable to any type.
     * 
     * @param _pTarget - Target type to check castability to.
     * 
     * @returns Always false - invalid types cannot be cast.
     */
    public isCastableInto(_pTarget: BaseType): boolean {
        return false;
    }

    /**
     * Collect type properties for invalid types.
     * Invalid types have no useful properties and are marked as unusable.
     * 
     * @param _pContext - Context (unused for invalid types).
     * 
     * @returns Type properties indicating the type is completely unusable.
     */
    protected override onProcess(_pContext: AbstractSyntaxTreeContext): TypeProperties {
        return {
            metaTypes: [], // Invalid types have no meta types.
            storable: false,
            hostShareable: false,
            composite: false,
            constructible: false,
            fixedFootprint: false,
            indexable: false,
            concrete: false,
            scalar: false,
            plain: false
        };
    }
}