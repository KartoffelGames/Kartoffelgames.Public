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
export class PotatnoProjectTypesDefinition<TValueMap extends PotatnoProjectTypeMapping = PotatnoProjectTypeMapping> {
    private readonly mTypes: Map<string, PotatnoProjectTypeDefinition<TValueMap>>;

    /**
     * Get all registered type names as a readonly array.
     */
    public get typeNames(): Array<PotatnoProjectTypeName<TValueMap>> {
        return Array.from(this.mTypes.keys()) as Array<PotatnoProjectTypeName<TValueMap>>;
    }

    /**
     * Get all registered type definitions as a readonly map keyed by type name.
     */
    public get types(): ReadonlyMap<string, PotatnoProjectTypeDefinition<TValueMap>> {
        return this.mTypes;
    }

    /**
     * Constructor.
     *
     * @param pParameters - Record mapping each type name to its definition.
     */
    public constructor(pParameters: PotatnoProjectTypeDefinitionConfiguration<TValueMap>) {
        this.mTypes = new Map<string, PotatnoProjectTypeDefinition<TValueMap>>();

        // Convert all types
        for (const [lTypeName, lTypeDefinition] of Object.entries(pParameters)) {
            this.mTypes.set(lTypeName, {
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

        return this.mTypes.get(pTypeName)! as PotatnoProjectTypeDefinition<TValueMap>;
    }

    /**
     * Returns true when the given string is a generic type parameter (e.g. `<T>`, `<TValue>`).
     *
     * @param pType - The candidate type identifier to test.
     *
     * @returns `true` when the identifier is in `<...>` form.
     */
    public isGenericType(pType: unknown): pType is PotatnoProjectGenericType {
        // Type must be of type string.
        if (typeof pType !== 'string') {
            return false;
        }

        return /^<[^>]+>$/.test(pType);
    }
}

type PotatnoProjectTypeName<TValueMap extends PotatnoProjectTypeMapping> = Extract<keyof TValueMap, string>;

/**
 * Potatno project valid types.
 * Defined by a type name and a default value of that type.
 */
type PotatnoProjectTypesItem<TValueMap extends PotatnoProjectTypeMapping> = {
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
    inputs: Array<{
        name: string;
        type: 'string' | 'number' | 'boolean';
    }>;

    /**
     * Optional subtype name for composite types (e.g. a vec3 has subtype float for its components).
     */
    subtype?: Record<PotatnoProjectTypeName<TValueMap>, PotatnoProjectTypesItemSubtype>;
};

/**
 * Untyped variant of type items unable to nest.
 */
type PotatnoProjectTypesItemSubtype = Omit<PotatnoProjectTypesItem<Record<string, unknown>>, 'subType'>;

export type PotatnoProjectTypeDefinitionConfiguration<TValueMap extends PotatnoProjectTypeMapping> = {
    [TTypeName in PotatnoProjectTypeName<TValueMap>]: PotatnoProjectTypesItem<TValueMap>;
};

export type PotatnoProjectTypeDefinition<TValueMap extends PotatnoProjectTypeMapping> = {
    name: PotatnoProjectTypeName<TValueMap>;
} & PotatnoProjectTypesItem<TValueMap>;

export type PotatnoProjectGenericType = `<${string}>`;

export type PotatnoProjectTypeMapping<TValueMap extends Record<string, unknown> = Record<string, unknown>> = Record<Extract<keyof TValueMap, string>, unknown>;
export type PotatnoProjectTypeNames<TType extends PotatnoProjectTypesDefinition> = TType['typeNames'][number];
