import { PotatnoProject } from "./potatno-project.ts";

export class PotatnoProjectTypesDefinition<TTypeName extends string> {
    /**
     * Create a new PotatnoProjectTypesDefinition from the given type configurations.
     *
     * @param pParameters - Record mapping each type name to its definition.
     */
    public static new<TTypeName extends string>(pParameters: PotatnoProjectTypeDefinitionConfiguration<TTypeName>): PotatnoProjectTypesDefinition<TTypeName> {
        return new PotatnoProjectTypesDefinition(pParameters);
    }

    private readonly mTypes: Map<TTypeName, PotatnoProjectTypeDefinition<TTypeName>>;

    /**
     * Get all registered type definitions as a readonly map keyed by type name.
     */
    public get types(): ReadonlyMap<TTypeName, PotatnoProjectTypeDefinition<TTypeName>> {
        return this.mTypes;
    }

    /**
     * Get all registered type names as a readonly array.
     */
    public get typeNames(): ReadonlyArray<TTypeName> {
        return Array.from(this.mTypes.keys());
    }

    /**
     * Constructor.
     *
     * @param pParameters - Record mapping each type name to its definition.
     */
    protected constructor(pParameters: PotatnoProjectTypeDefinitionConfiguration<TTypeName>) {
        this.mTypes = new Map<TTypeName, PotatnoProjectTypeDefinition<TTypeName>>();

        // Convert all types
        for (const [lTypeName, lTypeDefinition] of Object.entries(pParameters as PotatnoProjectTypeDefinitionConfiguration<string>)) {
            this.mTypes.set(lTypeName as TTypeName, {
                name: lTypeName as TTypeName,
                ...lTypeDefinition
            });
        }
    }

    /**
     * Get type definition for the given type name.
     * 
     * @param pTypeName - The name of the type to get the definition for.
     * 
     * @returns The type definition for the given type name. 
     */
    public getType(pTypeName: TTypeName): PotatnoProjectTypeDefinition<TTypeName> {
        if (!this.mTypes.has(pTypeName)) {
            throw new Error(`Type "${pTypeName}" is not defined in the project types definition.`);
        }

        return this.mTypes.get(pTypeName)!;
    }

    /**
     * Returns true when the given string is a generic type parameter (e.g. `<T>`, `<TValue>`).
     */
    public isGenericType(pType: string): pType is PotatnoProjectGenericType {
        return /^<[^>]+>$/.test(pType);
    }
}

type PotatnoProjectTypeDefinitionConfiguration<TTypeName extends string> = Record<TTypeName, PotatnoProjectTypesItem<TTypeName>>;

/**
 * Potatno project valid types.
 * Defined by a type name and a default value of that type.
 */
type PotatnoProjectTypesItem<TTypeName extends string> = {
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

export type PotatnoProjectTypeDefinition<TTypeName extends string> = {
    name: TTypeName;
} & PotatnoProjectTypesItem<TTypeName>;

export type PotatnoProjectGenericType = `<${string}>`;

export type PotatnoProjectType<TProject extends PotatnoProject> = TProject['types']['typeNames'][number];