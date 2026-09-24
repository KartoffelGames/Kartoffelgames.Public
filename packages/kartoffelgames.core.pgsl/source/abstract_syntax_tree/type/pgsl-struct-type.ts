import { StructPropertyDeclarationAst } from "../declaration/struct-property-declaration-ast.ts";
import { BasePgslType, BasePgslTypeKind, type BasePgslTypeMeta } from './base-pgsl-type.ts';

/**
 * Struct type definition.
 * Represents a user-defined struct type that contains multiple named fields.
 * Struct types are composite types that can be used to group related data.
 */
export class PgslStructType extends BasePgslType {
    /**
     * Get a string identification for the type.
     * 
     * @param pStructName - The name of the struct type.
     * 
     * @returns The type identification.
     */
    public static identifierOf(pStructName: string): string {
        return pStructName;
    }

    /**
     * Gets the name of the struct type.
     * 
     * @returns The struct name.
     */
    public get structName(): string {
        return this.meta.typeName;
    }

    /**
     * Constructor for struct type.
     * 
     * @param pStructName - The name of the struct type.
     * @param pProperties - Structs properties.
     * @param pShadowedType - Type that is the actual type of this.
     */
    public constructor(pStructName: string, pProperties: ReadonlyArray<StructPropertyDeclarationAst>, pShadowedType?: BasePgslType) {
        // Everything a struct is.
        let lTypeKind: BasePgslTypeKind = BasePgslTypeKind.Struct | BasePgslTypeKind.Composite | BasePgslTypeKind.Plain | BasePgslTypeKind.Concrete | BasePgslTypeKind.Storable;

        let lPropertiesConstructible: boolean = true;
        let lPropertiesFixedFootprint: boolean = true;
        let lPropertiesHostShareable: boolean = true;

        // Get the least constructable, fixedFootprint, and hostShareable to inherits.
        for (const lPropertyDeclaration of pProperties) {
            const lPropertyType: BasePgslType = lPropertyDeclaration.data.typeDeclaration.data.type;

            lPropertiesConstructible &&= lPropertyType.isKind(BasePgslTypeKind.Constructible);
            lPropertiesFixedFootprint &&= lPropertyType.isKind(BasePgslTypeKind.FixedFootprint);
            lPropertiesHostShareable &&= lPropertyType.isKind(BasePgslTypeKind.HostShareable);
        }

        // Every other capability only applies when all struct properties share it.
        lTypeKind |= lPropertiesConstructible ? BasePgslTypeKind.Constructible : BasePgslTypeKind.None;
        lTypeKind |= lPropertiesFixedFootprint ? BasePgslTypeKind.FixedFootprint : BasePgslTypeKind.None;
        lTypeKind |= lPropertiesHostShareable ? BasePgslTypeKind.HostShareable : BasePgslTypeKind.None;

        // Construct meta.
        const lTypeMeta: BasePgslTypeMeta = {
            typeName: PgslStructType.identifierOf(pStructName)
        };

        super(lTypeKind, lTypeMeta, pShadowedType);
    }

    /**
     * Get this types convertion rank to another type.
     * A struct only converts into the same struct.
     * 
     * @param pTarget - Conversion target type.
     * 
     * @returns Zero for the same struct, infinity for anything else.
     */
    public override conversionRankTo(pTarget: BasePgslType): number {
        if(this.equals(pTarget)){
            return 0;
        }

        return  Number.POSITIVE_INFINITY;
    }

    /**
     * Compare this struct type with a target type for equality.
     * Two struct types are equal if they have the same struct name.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same struct name.
     */
    public override equals(pTarget: BasePgslType): pTarget is this {
        // Must both be a struct.
        if (!this.isSameTypeClass(pTarget)) {
            return false;
        }

        return this.structName === pTarget.structName;
    }
}
