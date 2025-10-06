import { PgslStructTrace } from "../trace/pgsl-struct-trace.ts";
import { PgslTrace } from "../trace/pgsl-trace.ts";
import { PgslType, PgslTypeProperties } from "./pgsl-type.ts";

/**
 * Struct type definition.
 * Represents a user-defined struct type that contains multiple named fields.
 * Struct types are composite types that can be used to group related data.
 */
export class PgslStructType extends PgslType {
    private readonly mStructName: string;

    /**
     * Gets the name of the struct type.
     * 
     * @returns The struct name.
     */
    public get structName(): string {
        return this.mStructName;
    }

    /**
     * Constructor for struct type.
     * 
     * @param pTrace - The trace context for validation and error reporting.
     * @param pStructName - The name of the struct type.
     */
    public constructor(pTrace: PgslTrace, pStructName: string) {
        super(pTrace);

        // Set data.
        this.mStructName = pStructName;
    }

    /**
     * Compare this struct type with a target type for equality.
     * Two struct types are equal if they have the same struct name.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same struct name.
     */
    public override equals(pTarget: PgslType): boolean {
        // Must both be a struct.
        if (!(pTarget instanceof PgslStructType)) {
            return false;
        }

        return this.structName === pTarget.structName;
    }

    /**
     * Check if this struct type is explicitly castable into the target type.
     * Struct types are never castable to other types.
     * 
     * @param _pTarget - Target type to check castability to.
     * 
     * @returns Always false - structs cannot be cast.
     */
    public override isExplicitCastableInto(_pTarget: PgslType): boolean {
        // A struct is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if this struct type is implicitly castable into the target type.
     * Struct types are never castable to other types.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns Always false - structs cannot be cast.
     */
    public override isImplicitCastableInto(pTarget: PgslType): boolean {
        // A struct is never explicit nor implicit castable.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for struct types.
     * Validates that the struct exists and aggregates properties from all struct fields.
     * 
     * @param pTrace - Trace context for validation and error reporting.
     * 
     * @returns Type properties aggregated from struct fields.
     */
    protected override onTypePropertyCollection(pTrace: PgslTrace): PgslTypeProperties {
        // Read struct trace information.
        const lStruct: PgslStructTrace | undefined = pTrace.getStruct(this.mStructName);

        if (!lStruct) {
            pTrace.pushIncident(`Name '${this.mStructName}' does not resolve to a struct declaration.`);

            return {
                // Default struct information.
                composite: true,
                indexable: false,
                storable: true,
                scalar: false,
                concrete: true,
                plain: true,

                // Data normally from struct properties.
                hostShareable: false,
                constructible: false,
                fixedFootprint: false,
            };
        }

        // Check properties for constructible, host shareable, and fixed footprint characteristics
        const [lConstructible, lHostShareable, lFixedFootprint]: [boolean, boolean, boolean] = (() => {
            let lConstructible = true;
            let lHostShareable = true;
            let lFixedFootprint = true;

            // Check all properties for their characteristics
            for (const lProperty of lStruct.properties) {
                // Check if property is constructible
                lConstructible &&= lProperty.type.constructible;

                // Check if property is host shareable
                lHostShareable &&= lProperty.type.hostShareable;

                // For fixed footprint: all properties must be fixed
                lFixedFootprint &&= lProperty.type.fixedFootprint;
            }

            return [lConstructible, lHostShareable, lFixedFootprint];
        })();

        return {
            // Default struct information.
            composite: true,
            indexable: false,
            storable: true,
            scalar: false,
            concrete: true,
            plain: true,

            // Only takes effect when all members share the same property.
            hostShareable: lHostShareable,
            constructible: lConstructible,
            fixedFootprint: lFixedFootprint,
        };
    }
}