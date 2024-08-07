import { InjectionConstructor } from '../type';
import { BaseMetadata } from './base-metadata';

/**
 * Property metadata.
 */
export class PropertyMetadata extends BaseMetadata{
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
     * 
     * @param pConstructor - Constructor where all metadata should be attached.
     * @param pPropertyKey - Key of property where all metadata should be attached.
     */
    public constructor(pConstructor: InjectionConstructor, pPropertyKey: string | symbol) {
        super(pConstructor, pPropertyKey);
    }
}