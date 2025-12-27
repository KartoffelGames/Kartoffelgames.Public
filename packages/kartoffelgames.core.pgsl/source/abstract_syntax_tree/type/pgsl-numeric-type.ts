import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { PgslType, type PgslTypeProperties } from './pgsl-type.ts';

/**
 * Numeric type definition.
 * Represents all numeric types in PGSL including integers, floats, and abstract numeric types.
 * Handles type casting rules between different numeric types.
 */
export class PgslNumericType extends PgslType {
    /**
     * Type names for all available numeric types.
     * Maps numeric type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            signedInteger: 'int',
            unsignedInteger: 'uint',
            float16: 'float16',
            float32: 'float',
            abstractFloat: '*AbstractFloat*', // Should never be written
            abstractInteger: '*AbstractInteger*' // Should never be written
        } as const;
    }

    private readonly mNumericType: PgslNumericTypeName;

    /**
     * Gets the specific numeric type variant.
     * 
     * @returns The numeric type name.
     */
    public get numericTypeName(): PgslNumericTypeName {
        return this.mNumericType;
    }

    /**
     * Constructor for numeric type.
     * 
     * @param pNumericType - The specific numeric type variant.
     */
    public constructor(pNumericType: PgslNumericTypeName) {
        super();

        // Set data.
        this.mNumericType = pNumericType;
    }

    /**
     * Compare this numeric type with a target type for equality.
     * Two numeric types are equal if they have the same numeric type variant.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same numeric type.
     */
    public override equals(pTarget: PgslType): boolean {
        // Must both be the same numeric type.
        if (!(pTarget instanceof PgslNumericType)) {
            return false;
        }

        // Must have the same numeric type.
        return this.mNumericType === pTarget.numericTypeName;
    }

    /**
     * Check if this numeric type is explicitly castable into the target type.
     * All numeric types can be explicitly cast to any other numeric type.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns True if target is a numeric type, false otherwise.
     */
    public override isExplicitCastableInto(pTarget: PgslType): boolean {
        // All numeric values are explicit castable into another numeric type.
        return pTarget instanceof PgslNumericType;
    }

    /**
     * Check if this numeric type is implicitly castable into the target type.
     * Implements PGSL's implicit casting rules for numeric types.
     * Abstract types have special casting rules.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns True when implicit casting is allowed, false otherwise.
     */
    public override isImplicitCastableInto(pTarget: PgslType): boolean {
        // Target type must be a numeric type.
        if (!(pTarget instanceof PgslNumericType)) {
            return false;
        }

        switch (this.mNumericType) {
            // An abstract integer is castable into all numeric types.
            case PgslNumericType.typeName.abstractInteger: {
                return true;
            }
            
            // An abstract float is only castable into float types.
            case PgslNumericType.typeName.abstractFloat: {
                // List of all integer types.
                const lIntegerTypes: Array<PgslNumericTypeName> = [
                    PgslNumericType.typeName.abstractFloat,
                    PgslNumericType.typeName.float32,
                    PgslNumericType.typeName.float16
                ];

                // Check if target type is an integer type.
                if (lIntegerTypes.includes(pTarget.numericTypeName)) {
                    return true;
                }
            }
        }

        // Any other non-abstract numeric type is only castable when they are the same type.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for numeric types.
     * Numeric types are scalar, storable, and mostly host-shareable.
     * Abstract types are not concrete.
     * 
     * @param _pContext - Context (unused for numeric types).
     * 
     * @returns Type properties for numeric types.
     */
    protected override onProcess(_pContext: AbstractSyntaxTreeContext): PgslTypeProperties {
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

/**
 * Type representing all available numeric type names.
 * Derived from the static typeName getter for type safety.
 */
export type PgslNumericTypeName = (typeof PgslNumericType.typeName)[keyof typeof PgslNumericType.typeName];