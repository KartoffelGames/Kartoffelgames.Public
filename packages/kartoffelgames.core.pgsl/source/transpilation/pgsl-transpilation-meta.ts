import { StructDeclarationAst } from "../abstract_syntax_tree/declaration/struct-declaration-ast.ts";
import { StructPropertyDeclarationAst } from "../abstract_syntax_tree/declaration/struct-property-declaration-ast.ts";

export class PgslTranspilationMeta {
    private readonly structLocations: Map<StructDeclarationAst, Map<StructPropertyDeclarationAst, number>>;

    /**
     * Creates a new transpilation meta instance.
     */
    public constructor() {
        this.structLocations = new Map<StructDeclarationAst, Map<StructPropertyDeclarationAst, number>>();
    }

    /**
     * Reads the location mapping for a struct.
     * 
     * @param pStruct - Struct declaration.
     * 
     * @returns Mapping of struct properties to their locations. 
     */
    public locationsOf(pStruct: StructDeclarationAst): ReadonlyMap<StructPropertyDeclarationAst, number> {
        const lLocations: Map<StructPropertyDeclarationAst, number> | undefined = this.structLocations.get(pStruct);
        if (!lLocations) {
            return new Map<StructPropertyDeclarationAst, number>();
        }
        return lLocations;
    }

    /**
     * Creates a location mapping for a struct property.
     * If it already exists, the existing location is returned.
     * 
     * @param pStruct - Struct declaration.
     * @param pProperty - Struct property declaration.
     * 
     * @returns Location index.
     */
    public createLocationFor(pStruct: StructDeclarationAst, pProperty: StructPropertyDeclarationAst): number {
        // Get or create location map for struct.
        let lLocations: Map<StructPropertyDeclarationAst, number> | undefined = this.structLocations.get(pStruct);
        if (!lLocations) {
            lLocations = new Map<StructPropertyDeclarationAst, number>();
            this.structLocations.set(pStruct, lLocations);
        }

        // Check if property already has a location, else create a new one.
        let lLocation: number | undefined = lLocations.get(pProperty);
        if(typeof lLocation !== "number") {
            lLocation = lLocations.size;
            lLocations.set(pProperty, lLocation);
        }

        return lLocation;
    }

}