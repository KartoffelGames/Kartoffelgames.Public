import { Dictionary } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '../type';
import { Metadata } from './metadata';
import { ConstructorMetadata } from './constructor-metadata';

/**
 * Base metadata information for classes and properties.
 */
export class BaseMetadata {
    private readonly mConstructor: InjectionConstructor;
    private readonly mCustomMetadata: Dictionary<string, any>;
    private readonly mProperty: string | symbol | null;

    /**
     * Constructor where all metadata is attached.
     */
    protected get injectionConstructor(): InjectionConstructor {
        return this.mConstructor;
    }

    /**
     * Constructor.
     * Initialize lists.
     * 
     * @param pConstructor - Constructor where all metadata is attached.
     * @param pPropertyKey - Key of property where all metadata is attached.
     */
    public constructor(pConstructor: InjectionConstructor, pPropertyKey: string | symbol | null) {
        this.mConstructor = pConstructor;
        this.mProperty = pPropertyKey;
        this.mCustomMetadata = new Dictionary<string, any>();
    }

    /**
     * Get metadata of constructor or property from this and any parent inheritance.
     * List is empty if current and inherited items have no metadata.
     * 
     * @param pMetadataKey - Metadata key.
     */
    public getInheritedMetadata<T>(pMetadataKey: string): Array<T> {
        // Try to get parent metadata.
        const lParentClass: InjectionConstructor | undefined = Object.getPrototypeOf(this.mConstructor);

        // Read parent metadata or create new metadata list when no inheritance was found.
        let lMetadataValueList: Array<T>;
        if (lParentClass) {
            let lMetadata: BaseMetadata = Metadata.get(lParentClass);
            if (this.mProperty !== null) {
                lMetadata = (<ConstructorMetadata>lMetadata).getProperty(this.mProperty);
            }

            lMetadataValueList = lMetadata.getInheritedMetadata(pMetadataKey);
        } else {
            lMetadataValueList = new Array<T>();
        }

        // Read current metadata and add it to inherited metadata list.
        const lCurrentMetadata: T | null = this.getMetadata(pMetadataKey);
        if (lCurrentMetadata !== null) {
            lMetadataValueList.push(lCurrentMetadata);
        }

        return lMetadataValueList;
    }

    /**
     * Get metadata of constructor or property.
     * 
     * @param pMetadataKey - Metadata key.
     */
    public getMetadata<T>(pMetadataKey: string): T | null {
        return this.mCustomMetadata.get(pMetadataKey) ?? null;
    }

    /**
     * Set metadata of constructor or property.
     * 
     * @param pMetadataKey - Metadata key.
     * @param pMetadataValue - Metadata value.
     */
    public setMetadata<T>(pMetadataKey: string, pMetadataValue: T): void {
        this.mCustomMetadata.set(pMetadataKey, pMetadataValue);
    }
}