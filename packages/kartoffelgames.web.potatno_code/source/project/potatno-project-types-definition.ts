import { PotatnoProject } from "./potatno-project.ts";

/**
 * Registry of valid project-level types together with their default values, conversion rules and
 * editor input metadata.
 *
 * The second generic captures the JS value shape of each registered type (extracted from the
 * `default.value` field at the call site). This lets type-aware consumers — most notably the
 * preview type adapters — recover the original JS type for a given type name without runtime
 * lookups. It defaults to a loose `Record<TTypeName, unknown>` so existing usages annotated only
 * with `<'number' | 'string'>` keep compiling.
 *
 * @typeParam TTypeName - Union of registered type names.
 * @typeParam TValueMap - Map of type name to its representative JS value shape.
 */
export class PotatnoProjectTypesDefinition<TTypeName extends string, TValueMap extends Record<TTypeName, unknown> = Record<TTypeName, unknown>> {
    /**
     * Create a new PotatnoProjectTypesDefinition from the given type configurations.
     *
     * The full configuration shape is captured as a generic so per-type `default.value` types
     * (e.g. `value: 0` => `number`) propagate into the returned definition for downstream type
     * adapter inference.
     *
     * @param pParameters - Record mapping each type name to its definition.
     *
     * @returns The new project types definition with the inferred type-name union and value map.
     */
    public static new<TConfig extends PotatnoProjectTypeDefinitionConfiguration<string>>(pParameters: TConfig): PotatnoProjectTypesDefinition<keyof TConfig & string, PotatnoProjectTypesValueMap<TConfig>> {
        return new PotatnoProjectTypesDefinition(pParameters) as PotatnoProjectTypesDefinition<keyof TConfig & string, PotatnoProjectTypesValueMap<TConfig>>;
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
    public getDefaultValue<TName extends TTypeName>(pTypeName: TName): TValueMap[TName] {
        return this.getType(pTypeName).default.value as TValueMap[TName];
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
     *
     * @param pType - The candidate type identifier to test.
     *
     * @returns `true` when the identifier is in `<...>` form.
     */
    public isGenericType(pType: string): pType is PotatnoProjectGenericType {
        return /^<[^>]+>$/.test(pType);
    }
}

type PotatnoProjectTypeDefinitionConfiguration<TTypeName extends string> = Record<TTypeName, PotatnoProjectTypesItem<TTypeName, unknown>>;

/**
 * Potatno project valid types.
 * Defined by a type name and a default value of that type.
 */
type PotatnoProjectTypesItem<TTypeName extends string, TRepresentativeValue> = {
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
        value: TRepresentativeValue;
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
    subtype?: PotatnoProjectTypeDefinitionConfiguration<TTypeName>;
};

/** A single editor input element for a project type. */
type PotatnoProjectTypeInputElement = {
    name: string;
    type: 'string' | 'number' | 'boolean';
};

export type PotatnoProjectTypeDefinition<TTypeName extends string> = {
    name: TTypeName;
} & PotatnoProjectTypesItem<TTypeName, unknown>;

export type PotatnoProjectGenericType = `<${string}>`;

export type PotatnoProjectType<TProject extends PotatnoProject> = TProject['types']['typeNames'][number];

/**
 * Extract the JS value shape of a registered project type by name.
 *
 * Walks back through the second generic captured at `PotatnoProjectTypesDefinition.new` time. Falls
 * back to `unknown` if the definition was constructed without per-type value information (e.g.
 * type-only annotation such as `PotatnoProjectTypesDefinition<'number'>`).
 *
 * @typeParam TTypes - The project types definition the type belongs to.
 * @typeParam TTypeName - The type name whose representative JS value type to extract.
 */
export type PotatnoProjectTypeValue<TTypes extends PotatnoProjectTypesDefinition<string, Record<string, unknown>>, TTypeName extends string> =
    TTypes extends PotatnoProjectTypesDefinition<string, infer TValueMap>
    ? TTypeName extends keyof TValueMap
    ? TValueMap[TTypeName]
    : unknown
    : unknown;

/**
 * Map every type id in a literal configuration to its representative JS value type.
 */
type PotatnoProjectTypesValueMap<TConfig extends PotatnoProjectTypeDefinitionConfiguration<string>> = {
    [K in keyof TConfig & string]: TConfig[K] extends { default: { value: infer TValue } } ? TValue : unknown;
};
