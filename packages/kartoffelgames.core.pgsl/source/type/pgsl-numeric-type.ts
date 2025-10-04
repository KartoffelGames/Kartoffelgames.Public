import { PgslTrace } from "../trace/pgsl-trace.ts";
import { PgslType, PgslTypeProperties } from "./pgsl-type.ts";

/**
 * Numeric type definition.
 */
export class PgslNumericType extends PgslType {
    /**
     * Type names.
     */
    public static get typeName() {
        return {
            signedInteger: 'int',
            unsignedInteger: 'uint',
            float16: 'float16',
            float32: 'float',
            abstractFloat: '*AbstractFloat*', // Should never be writen
            abstractInteger: '*AbstractInteger*' // Should never be writen
        } as const;
    }

    private readonly mNumericType: PgslNumericTypeName;

    /**
     * Explicit numeric type.
     */
    public get numericTypeName(): PgslNumericTypeName {
        return this.mNumericType;
    }

    /**
     * Constructor.
     * 
     * @param pTrace - The trace context.
     * @param pReferenceType - References type of pointer.
     */
    public constructor(pTrace: PgslTrace, pNumericType: PgslNumericTypeName) {
        super(pTrace);

        // Set data.
        this.mNumericType = pNumericType;
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both types describes the same type.
     */
    public override equals(pTarget: PgslType): boolean {
        // Must both the same numeric type.
        if (!(pTarget instanceof PgslNumericType)) {
            return false;
        }

        // Must have the same numeric type.
        return this.mNumericType === pTarget.numericTypeName;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    public override isExplicitCastableInto(pTarget: PgslType): boolean {
        // All numberic values are explicit castable into another numeric type.
        return pTarget instanceof PgslNumericType;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    public override isImplicitCastableInto(pTarget: PgslType): boolean {
        // Target type must be a numeric type.
        if (!(pTarget instanceof PgslNumericType)) {
            return false;
        }

        switch (this.mNumericType) {
            // An abstract float is castable into all all types.
            case PgslNumericType.typeName.abstractFloat: {
                return true;
            }
            
            // An abstract int is only castable into all integer types.
            case PgslNumericType.typeName.abstractInteger: {
                // List of all integer types.
                const lIntegerTypes: Array<PgslNumericTypeName> = [
                    PgslNumericType.typeName.abstractInteger,
                    PgslNumericType.typeName.signedInteger,
                    PgslNumericType.typeName.unsignedInteger
                ];

                // To be more readable the target type of checking if it is an integer type, is done in a separate if block.
                if (lIntegerTypes.includes(pTarget.numericTypeName)) {
                    return true;
                }
            }
        }

        // Any other non abstract numeric type is only castable when they are the same type.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for pointer type.
     * 
     * @param _pTrace - Trace context.
     * 
     * @returns type properties for numeric type.
     */
    protected override onTypePropertyCollection(_pTrace: PgslTrace): PgslTypeProperties {
        // A concrete numeric type is any type that is not abstract.
        const lIsConcrete: boolean = this.mNumericType !== PgslNumericType.typeName.abstractFloat && this.mNumericType !== PgslNumericType.typeName.abstractInteger;

        return {
            // Dynamic properties.
            concrete: lIsConcrete,

            storable: true,
            hostShareable: true,
            composite: false,
            constructible: true,
            fixedFootprint: true,
            indexable: false,
            scalar: true,
            plain: true,
        };
    }
}

type PgslNumericTypeName = (typeof PgslNumericType.typeName)[keyof typeof PgslNumericType.typeName];