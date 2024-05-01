import { Dictionary } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '../type';


export class PropertyMetadata {
    private readonly mCustomMetadata: Dictionary<string, any>;

    /**
     * Get parameter type information.
     */
    public get parameterTypes(): Array<InjectionConstructor> | null {
        return this.getMetadata<Array<InjectionConstructor>>('design:paramtypes');
    }

    /**
     * Get return type information.
     */
    public get returnType(): InjectionConstructor | null {
        return this.getMetadata<InjectionConstructor>('design:returntype');
    }

    /**
     * Get property type information.
     */
    public get type(): InjectionConstructor | null {
        return this.getMetadata<InjectionConstructor>('design:type');
    }

    /**
     * Constructor.
     * Initialize lists.
     */
    public constructor() {
        this.mCustomMetadata = new Dictionary<string, any>();
    }

    /**
     * Get metadata of constructor.
     * @param pMetadataKey - Metadata key.
     */
    public getMetadata<T>(pMetadataKey: string): T {
        return this.mCustomMetadata.get(pMetadataKey) ?? null;
    }

    /**
     * Set metadata of constructor.
     * @param pMetadataKey - Metadata key.
     * @param pMetadataValue - Metadata value.
     */
    public setMetadata<T>(pMetadataKey: string, pMetadataValue: T): void {
        this.mCustomMetadata.set(pMetadataKey, pMetadataValue);
    }
}