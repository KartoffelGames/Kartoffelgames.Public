import { AbstractSyntaxTreeContext } from "../abstract_syntax_tree/abstract-syntax-tree-context.ts";
import { PgslType, type PgslTypeProperties } from './pgsl-type.ts';

/**
 * String type definition.
 * Represents a string value used for text data.
 */
export class PgslStringType extends PgslType {
    /**
     * Type names for string types.
     * Maps string type names to their string representations.
     */
    public static get typeName() {
        return {
            string: 'string'
        } as const;
    }

    /**
     * Constructor. Initializes type.
     * 
     * @param pContext - The context of the type definition.
     */
    public constructor(pContext: AbstractSyntaxTreeContext) {
        super(pContext);
        this.initType(pContext);
    }

    /**
     * Check if type is equal to target type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns true when both types describes the same type.
     */
    public override equals(pTarget: PgslType): boolean {
        // String type is only equal to other string types.
        return pTarget instanceof PgslStringType;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     * 
     * @returns true when type is explicit castable into target type.
     */
    public override isExplicitCastableInto(_pTarget: PgslType): boolean {
        // A string is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns true when type is implicit castable into target type.
     */
    public override isImplicitCastableInto(pTarget: PgslType): boolean {
        // A string is never explicit nor implicit castable.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for string type.
     * 
     * @param _Context - Context.
     * 
     * @returns Type properties for string type.
     */
    protected override process(_Context: AbstractSyntaxTreeContext): PgslTypeProperties {
        return {
            storable: false,
            hostShareable: false,
            composite: false,
            constructible: false,
            fixedFootprint: false,
            indexable: false,
            concrete: true,
            scalar: false,
            plain: false
        };
    }
}