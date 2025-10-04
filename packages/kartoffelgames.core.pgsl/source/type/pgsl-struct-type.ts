import { PgslStructTrace } from "../trace/pgsl-struct-trace.ts";
import { PgslTrace } from "../trace/pgsl-trace.ts";
import { PgslType, PgslTypeProperties } from "./pgsl-type.ts";

/**
 * Struct type definition.
 */
export class PgslStructType extends PgslType {
    private readonly mStructName: string;

    /**
     * Struct name.
     */
    public get structName(): string {
        return this.mStructName;
    }

    /**
     * Constructor.
     * 
     * @param pStructName - name of struct.
     */
    public constructor(pTrace: PgslTrace, pStructName: string) {
        super(pTrace);

        // Set data.
        this.mStructName = pStructName;
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both types describes the same type.
     */
    public override equals(pTarget: PgslType): boolean {
        // Must both be a struct.
        if (!(pTarget instanceof PgslStructType)) {
            return false;
        }

        return this.structName === pTarget.structName;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    public override isExplicitCastableInto(_pTarget: PgslType): boolean {
        // A struct is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    public override isImplicitCastableInto(_pTarget: PgslType): boolean {
        // A struct is never explicit nor implicit castable.
        return false;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pValidationTrace - Validation trace to use.
     */
    protected override onTypePropertyCollection(pTrace: PgslTrace): PgslTypeProperties {
        // Read aliased type.
        const lStruct: PgslStructTrace | undefined = pTrace.getStruct(this.mStructName);

        if (!lStruct) {
            pTrace.pushIncident(`Name '${this.mStructName}' is does not resolve to a struct declaration.`);

            return {
                // Default struct information.
                composite: true,
                indexable: false,
                storable: true,
                scalar: false,
                concrete: true,
                plain: true,

                // Data normaly from struct properties.
                hostShareable: false,
                constructible: false,
                fixedFootprint: false,
            };
        }

        // Check properties for constructable, host sharable, and fixed footprint characteristics
        const [lConstructable, lHostSharable, lFixedFootprint]: [boolean, boolean, boolean] = (() => {
            let lConstructable = true;
            let lHostSharable = true;
            let lFixedFootprint = true;

            // Check all properties except the last one for fixed footprint
            for (const lProperty of lStruct.properties) {
                // Check if property is constructible
                lConstructable &&= lProperty.type.constructible;

                // Check if property is host sharable
                lHostSharable &&= lProperty.type.hostShareable;

                // For fixed footprint: all properties except the last must be fixed
                lFixedFootprint &&= lProperty.type.fixedFootprint;
            }

            return [lConstructable, lHostSharable, lFixedFootprint];
        })();

        return {
            // Default struct information.
            composite: true,
            indexable: false,
            storable: true,
            scalar: false,
            concrete: true,
            plain: true,

            // Only takes affect when all members are sharing the same property.
            hostShareable: lHostSharable,
            constructible: lConstructable,
            fixedFootprint: lFixedFootprint,
        };
    }
}