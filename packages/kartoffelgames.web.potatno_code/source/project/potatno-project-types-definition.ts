export class PotatnoProjectTypesDefinition<TTypeName extends PotatnoProjectType> {
    private readonly mTypes: Map<TTypeName, PotatnoProjectTypeDefinition<TTypeName>>;

    /**
     * Get all registered type definitions as a readonly map keyed by type name.
     */
    public get types(): ReadonlyMap<TTypeName, PotatnoProjectTypeDefinition<TTypeName>> {
        return this.mTypes;
    }

    public constructor(pParameters: PotatnoProjectTypeDefinitionConfiguration<TTypeName>) {
        this.mTypes = new Map<TTypeName, PotatnoProjectTypeDefinition<TTypeName>>();

        // Convert all types
        for (const [lTypeName, lTypeDefinition] of Object.entries(pParameters as PotatnoProjectTypeDefinitionConfiguration<string>)) {
            this.mTypes.set(lTypeName as TTypeName, {
                name: lTypeName as TTypeName,
                ...lTypeDefinition
            });
        }
    }

    public getType(pTypeName: TTypeName): PotatnoProjectTypeDefinition<TTypeName> {
        if (!this.mTypes.has(pTypeName)) {
            throw new Error(`Type "${pTypeName}" is not defined in the project types definition.`);
        }

        return this.mTypes.get(pTypeName)!;
    }
}

type PotatnoProjectTypeDefinitionConfiguration<TTypeName extends PotatnoProjectType> = Record<TTypeName, PotatnoProjectTypesItem<TTypeName>>;

/**
 * Potatno project valid types.
 * Defined by a type name and a default value of that type.
 */
type PotatnoProjectTypesItem<TTypeName extends PotatnoProjectType> = {
    /**
     * A default value for this type.
     * The string represents the default string values for the types inputs.
     */
    defaultValue: Array<string>;

    /** 
     * Converts raw string input values to the type's code-ready string representation.
     */
    convert: (pValues: Array<string>) => string;

    /** 
     * One or more input element definitions so the editor can generate input fields for this type.
     */
    inputs: ReadonlyArray<PotatnoProjectTypeInputElement>;

    /** 
     * Optional subtype name for composite types (e.g. a vec3 has subtype float for its components).
     */
    subtype?: PotatnoProjectTypeDefinitionConfiguration<TTypeName>;
};

/** A single editor input element for a project type. */
type PotatnoProjectTypeInputElement = {
    name: string;
    type: 'string' | 'number' | 'boolean';
};

export type PotatnoProjectTypeDefinition<TTypeName extends PotatnoProjectType> = {
    name: TTypeName;
} & PotatnoProjectTypesItem<TTypeName>;

/**
 * The union type for all project type names.
 */
export type PotatnoProjectType = string;
