import { BaseGeneratorFactory, BaseObjectMap, NativeGpuObjects } from './base-generator-factory';

export abstract class BaseNativeGenerator<TFactory extends BaseGeneratorFactory<TNativeMap>, TNativeMap extends NativeGpuObjects, TKey extends keyof TNativeMap & keyof BaseObjectMap> {
    private readonly mFactory: TFactory;

    /**
     * Parent factory.
     */
    protected get factory(): TFactory {
        return this.mFactory;
    }

    /**
     * Constructor.
     * @param pGeneratorFactory - Generator factory.
     */
    public constructor(pGeneratorFactory: TFactory) {
        this.mFactory = pGeneratorFactory;
    }

    /**
     * Destroy generated object.
     * @param _pBaseObject - Base gpu object. Hold every data.
     * @param _pNativeObject - Created 
     * @returns 
     */
    public destroy(_pBaseObject: BaseObjectMap[TKey], _pNativeObject: TNativeMap[TKey]): void {
        return;
    }

    /**
     * Generate native gpu object from base.
     * @param pBaseObject - Base gpu object. Hold every data.
     */
    public abstract generate(pBaseObject: BaseObjectMap[TKey]): TNativeMap[TKey];
}

// Generator constructor.
export type GeneratorConstructor<TFactory extends BaseGeneratorFactory<TNativeMap>,
    TNativeMap extends NativeGpuObjects,
    TKey extends keyof TNativeMap & keyof BaseObjectMap> = new (pFactory: TFactory) => BaseNativeGenerator<TFactory, TNativeMap, TKey>; 