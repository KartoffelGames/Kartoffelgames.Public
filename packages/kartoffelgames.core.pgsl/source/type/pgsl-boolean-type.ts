import { PgslTrace } from "../trace/pgsl-trace.ts";
import { PgslType, PgslTypeProperties } from "./pgsl-type.ts";

/**
 * Boolean type definition.
 * Represents a boolean value that can be either true or false.
 */
export class PgslBooleanType extends PgslType {
    /**
     * Type names for boolean types.
     * Maps boolean type names to their string representations.
     */
    public static get typeName() {
        return {
            boolean: 'bool'
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
        // Boolean type is only equal to other boolean types.
        return pTarget instanceof PgslBooleanType;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     * 
     * @returns true when type is explicit castable into target type.
     */
    public override isExplicitCastableInto(_pTarget: PgslType): boolean {
        // A boolean is never explicit nor implicit castable.
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
        // A boolean is never explicit nor implicit castable.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for boolean type.
     * 
     * @param _pTrace - Trace context.
     * 
     * @returns Type properties for boolean type.
     */
    protected override onTypePropertyCollection(_pTrace: PgslTrace): PgslTypeProperties {
        return {
            storable: true,
            hostShareable: false,
            composite: false,
            constructible: true,
            fixedFootprint: true,
            indexable: false,
            concrete: true,
            scalar: true,
            plain: true
        };
    }
}