/**
 * Registry of valid project-level types together with their default values, conversion rules and
 * editor input metadata.
 *
 * The generic captures the JS value shape of each registered type (extracted from the
 * `default.value` field at the call site). This lets type-aware consumers — most notably the
 * preview type adapters — recover the original JS type for a given type name without runtime
 * lookups.
 *
 * @typeParam TValueMap - Map of type name to its representative JS value shape.
 * @typeParam TTypeName - Union of registered type names inferred from `TValueMap`.
 */
export class PotatnoProjectTypesDefinition<TValueMap extends PotatnoProjectTypeMapping<TValueMap> = PotatnoProjectTypeMapping> {
    private readonly mTypes: Map<PotatnoProjectTypeName<TValueMap>, PotatnoProjectTypeDefinition<TValueMap>>;

    /**
     * Get all registered type definitions as a readonly map keyed by type name.
     */
    public get types(): ReadonlyMap<PotatnoProjectTypeName<TValueMap>, PotatnoProjectTypeDefinition<TValueMap>> {
        return this.mTypes;
    }

    /**
     * Get all registered type names as a readonly array.
     */
    public get typeNames(): Array<PotatnoProjectTypeName<TValueMap>> {
        return Array.from(this.mTypes.keys());
    }

    /**
     * Constructor.
     *
     * @param pParameters - Record mapping each type name to its definition.
     */
    public constructor(pParameters: PotatnoProjectTypeDefinitionConfiguration<TValueMap>) {
        this.mTypes = new Map<PotatnoProjectTypeName<TValueMap>, PotatnoProjectTypeDefinition<TValueMap>>();

        // Convert all types
        for (const [lTypeName, lTypeDefinition] of Object.entries(pParameters as PotatnoProjectTypeDefinitionConfiguration<Record<string, unknown>>)) {
            this.mTypes.set(lTypeName as PotatnoProjectTypeName<TValueMap>, {
                name: lTypeName as PotatnoProjectTypeName<TValueMap>,
                ...lTypeDefinition
            } as PotatnoProjectTypeDefinition<TValueMap>);
        }
    }

    /**
     * Get the registered representative JS default value for the given type name.
     *
     * Returned type is pulled from the captured value map, so callers like the preview type
     * adapters get the precise JS shape (e.g. `number` for `'number'`) without a manual cast.
     *
     * @typeParam TName - The specific type name being looked up.
     *
     * @param pTypeName - The type name whose `default.value` to retrieve.
     *
     * @returns The default value for that type, typed to the captured value map's entry.
     */
    public getDefaultValue<TName extends PotatnoProjectTypeName<TValueMap>>(pTypeName: TName): TValueMap[TName] {
        return this.getType(pTypeName).default.value as TValueMap[TName];
    }

    /**
     * Get type definition for the given type name.
     *
     * @param pTypeName - The name of the type to get the definition for.
     *
     * @returns The type definition for the given type name.
     */
    public getType(pTypeName: PotatnoProjectTypeName<TValueMap>): PotatnoProjectTypeDefinition<TValueMap> {
        if (!this.mTypes.has(pTypeName)) {
            throw new Error(`Type "${pTypeName}" is not defined in the project types definition.`);
        }

        return this.mTypes.get(pTypeName)!;
    }

    /**
     * Returns true when the given string is a generic type parameter (e.g. `<T>`, `<TValue>`).
     *
     * @param pType - The candidate type identifier to test.
     *
     * @returns `true` when the identifier is in `<...>` form.
     */
    public isGenericType(pType: string): pType is PotatnoProjectGenericType {
        return /^<[^>]+>$/.test(pType);
    }
}

type PotatnoProjectTypeDefinitionConfiguration<TValueMap extends Record<string, unknown>> = {
    [TTypeName in Extract<keyof TValueMap, string>]: PotatnoProjectTypesItem<TValueMap>;
};

/**
 * Potatno project valid types.
 * Defined by a type name and a default value of that type.
 */
type PotatnoProjectTypesItem<TValueMap extends Record<string, unknown>> = {
    /**
     * A default value for this type.
     */
    default: {
        /**
         * Represents the default string values for the types inputs.
         */
        string: Array<string>;

        /**
         * Javascript value representation for defining preview value types.
         */
        value: TValueMap[keyof TValueMap];
    };

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
    subtype?: PotatnoProjectTypeDefinitionConfiguration<TValueMap>;
};

/** A single editor input element for a project type. */
type PotatnoProjectTypeInputElement = {
    name: string;
    type: 'string' | 'number' | 'boolean';
};

export type PotatnoProjectTypeDefinition<TValueMap extends Record<string, unknown>> = {
    name: PotatnoProjectTypeName<TValueMap>;
} & PotatnoProjectTypesItem<TValueMap>;

export type PotatnoProjectGenericType = `<${string}>`;

export type PotatnoProjectTypeMapping<TValueMap extends Record<string, unknown> = Record<string, unknown>> = Record<PotatnoProjectTypeName<TValueMap>, unknown>
export type PotatnoProjectTypeName<TValueMap extends PotatnoProjectTypeMapping<TValueMap>> = Extract<keyof TValueMap, string>;
export type PotatnoProjectTypeNames<TType extends PotatnoProjectTypesDefinition> = TType['typeNames'][number];
