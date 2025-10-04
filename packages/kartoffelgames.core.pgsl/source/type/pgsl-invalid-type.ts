import { PgslTrace } from "../trace/pgsl-trace.ts";
import { PgslType, PgslTypeProperties } from "./pgsl-type.ts";

/**
 * Invalid type definition.
 * Represents an invalid or erroneous type that cannot be used in normal operations.
 */
export class PgslInvalidType extends PgslType {
    /**
     * Check if type is equal to target type.
     * 
     * @param _pTarget - Target type.
     * 
     * @returns always false.
     */
    public override equals(_pTarget: PgslType): boolean {
        return false;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     * 
     * @returns always false.
     */
    public override isExplicitCastableInto(_pTarget: PgslType): boolean {
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pTarget - Target type.
     * 
     * @returns always false.
     */
    public override isImplicitCastableInto(_pTarget: PgslType): boolean {
        return false;
    }

    /**
     * Collect type properties for invalid type.
     * 
     * @param _pTrace - Trace context.
     * 
     * @returns Type properties for invalid type.
     */
    protected override onTypePropertyCollection(_pTrace: PgslTrace): PgslTypeProperties {
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