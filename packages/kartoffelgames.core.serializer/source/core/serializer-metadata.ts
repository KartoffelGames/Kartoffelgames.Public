/**
 * Accumulates decorator configuration for a single serializable class.
 * Stores the class UUID and property configurations.
 */
export class SerializerMetadata {
    private readonly mProperties: Map<string, PropertySerializationConfig>;
    private mUuid: string | null;

    /**
     * Get all property names registered for serialization.
     */
    public get propertyNames(): Array<string> {
        return new Array(...this.mProperties.keys());
    }

    /**
     * Get the registered UUID for this class.
     *
     * @throws Error if UUID has not been set.
     */
    public get uuid(): string | null {
        return this.mUuid;
    } set uuid(pUuid: string | null) {
        this.mUuid = pUuid;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mUuid = null;
        this.mProperties = new Map<string, PropertySerializationConfig>();
    }

    /**
     * Add a property to the set of serialized properties.
     *
     * @param pPropertyName - The string key of the property.
     * @param pConfig - Configuration for this property.
     */
    public addProperty(pPropertyName: string, pConfig: PropertySerializationConfig): void {
        this.mProperties.set(pPropertyName, pConfig);
    }

    /**
     * Get configuration for a specific property.
     *
     * @param pPropertyName - The property key.
     *
     * @returns the property configuration.
     */
    public getPropertyConfig(pPropertyName: string): PropertySerializationConfig {
        return this.mProperties.get(pPropertyName)!;
    }

    /**
     * Check if a property is registered for serialization.
     * 
     * @param pPropertyName - The property key.
     * 
     * @returns true if the property is registered, false otherwise.
     */
    public hasProperty(pPropertyName: string): boolean {
        return this.mProperties.has(pPropertyName);
    }
}

/**
 * Configuration for a serialized property.
 */
export type PropertySerializationConfig = {
    /**
     * Optional alias used as the key in the binary data instead of the property name.
     * Allows renaming properties in code without breaking serialized data compatibility.
     */
    alias?: string;
};
