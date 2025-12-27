import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { PgslType, type PgslTypeProperties } from './pgsl-type.ts';

/**
 * Void type definition.
 * Represents the absence of a value, typically used as function return type.
 */
export class PgslVoidType extends PgslType {
    /**
     * Type names for void types.
     * Maps void type names to their string representations.
     */
    public static get typeName() {
        return {
            void: 'void'
        } as const;
    }

    /**
     * Check if type is equal to target type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns true when both types describes the same type.
     */
    public override equals(pTarget: PgslType): boolean {
        // Void type is only equal to other void types.
        return pTarget instanceof PgslVoidType;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     * 
     * @returns true when type is explicit castable into target type.
     */
    public override isExplicitCastableInto(_pTarget: PgslType): boolean {
        // A void is never explicit nor implicit castable.
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
        // A void is never explicit nor implicit castable.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for void type.
     * 
     * @param _pContext - Context.
     * 
     * @returns Type properties for void type.
     */
    protected override onProcess(_pContext: AbstractSyntaxTreeContext): PgslTypeProperties {
        return {
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