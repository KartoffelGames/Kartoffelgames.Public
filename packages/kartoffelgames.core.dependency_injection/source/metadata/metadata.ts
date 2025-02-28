import { Dictionary } from "../../../kartoffelgames.core/source/index.ts";
import { InjectionConstructor, InjectionInstance } from '../type.ts';
import { ConstructorMetadata } from './constructor-metadata.ts';

/**
 * Static.
 * Metadata storage.
 * 
 * @public
 */
export class Metadata {
    private static mMetadataMapping: Dictionary<DecoratorMetadataObject, ConstructorMetadata> = new Dictionary<DecoratorMetadataObject, ConstructorMetadata>();

    /**
     * AtScript.
     * Add metadata to class, method, accessor or property
     * 
     * @param pMetadataKey - Key of metadata.
     * @param pMetadataValue - Value of metadata.
     */
    public static add<TThis extends object, TValue = any>(pMetadataKey: string, pMetadataValue: TValue) {
        return (_pOriginalTarget: any, pContext: AllClassDecoratorContext<InjectionConstructor<TThis>>): void => {
            // Get metadata object for constructor.
            const lConstructorMetadata: ConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

            // Set for any kind.
            switch (pContext.kind) {
                case 'class':
                    lConstructorMetadata.setMetadata(pMetadataKey, pMetadataValue);
                    return;
                case 'accessor':
                case 'method':
                case 'field':
                case 'getter':
                case "setter":
                    // Metadata is not allowed for statics.
                    if (pContext.static) {
                        throw new Error(`@AddMetadata not supported for statics.`);
                    }

                    lConstructorMetadata.getProperty(pContext.name).setMetadata(pMetadataKey, pMetadataValue);
                    return;
                default:
                    // Fallback. Maybe more things will show up.
                    throw new Error(`@AddMetadata not supported for ${(<DecoratorContext>pContext).kind}.`);
            }
        };
    }

    /**
     * Initialize metadata.
     * 
     * @param pMetadataObject - Metadata object.
     */
    public static forInternalDecorator(pMetadataObject: DecoratorMetadataObject): ConstructorMetadata {
        return Metadata.mapMetadata(pMetadataObject);
    }

    /**
     * AtScript.
     * Init metadata to class, method, accessor or property
     * 
     * @param _pOriginalTarget - Unused. original decorator target.
     * @param pContext - Decorator context
     */
    public static init() {
        return (_pOriginalTarget: any, pContext: ClassDecoratorContext): void => {
            const lConstructorMetadata: ConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);
        };
    }

    /**
     * Get metadata of constructor.
     * 
     * @param pTarget - Constructor or decorator metadata object.
     * 
     * @returns constructor metadata object of constructor.
     * 
     * @example Adding a new and existing key.
     * ```TypeScript
     * @Injector.Metadata('key', 'value')
     * class Foo {
     *     @Injector.Metadata('key', 'value')
     *     public prop: number;
     * }
     * 
     * const constructorMeta = Metadata.get(Foo).getMetadata('key');
     * const propertyMeta = Metadata.get(Foo).getProperty('prop').getMetadata('key');
     * ```
     */
    public static get(pTarget: InjectionConstructor): ConstructorMetadata {
        // Check if constructor has a decorator metadata.
        if (!Object.hasOwn(pTarget, Symbol.metadata)) {
            Metadata.polyfillMissingMetadata(pTarget);
        }

        // Read metadata object for constructor.
        const lDecoratorMetadataObject: DecoratorMetadataObject = pTarget[Symbol.metadata]!;

        // Get or create constructor metadata instance.
        return Metadata.mapMetadata(lDecoratorMetadataObject);
    }

    /**
     * Maps a given decorator metadata object to a constructor metadata object.
     * If the metadata object is already mapped, the existing constructor metadata is returned.
     * Otherwise, a new constructor metadata object is created, mapped, and returned.
     *
     * @param pMetadataObject - The decorator metadata object to be mapped.
     * @returns The corresponding constructor metadata object.
     */
    private static mapMetadata(pMetadataObject: DecoratorMetadataObject): ConstructorMetadata {
        // Check if metadata object is already mapped.
        if (Metadata.mMetadataMapping.has(pMetadataObject)) {
            return Metadata.mMetadataMapping.get(pMetadataObject)!;
        }

        // Create new constructor metadata object from decorator metadata.
        const lConstructorMetadata: ConstructorMetadata = new ConstructorMetadata(pMetadataObject);

        // Map metadata object to constructor metadata.
        Metadata.mMetadataMapping.set(pMetadataObject, lConstructorMetadata);

        return lConstructorMetadata;
    }

    /**
     * Ensures that all constructors in the inheritance chain have a metadata object.
     * If a constructor does not have a metadata object, it creates one and sets its prototype
     * to the metadata object of its parent constructor.
     *
     * @param pConstructor - The constructor to start the inheritance chain from.
     */
    private static polyfillMissingMetadata(pConstructor: InjectionConstructor): void {
        const lInheritanceChain: Array<InjectionConstructor> = new Array<InjectionConstructor>();

        // Read all constructors in inheritance chain.
        let lCurrentConstructor: InjectionConstructor = pConstructor;
        do {
            // Unessary check. But just to be sure.
            if (lCurrentConstructor === null) {
                continue;
            }

            // Save constructor in inheritance chain.
            lInheritanceChain.push(lCurrentConstructor);

            // Read next metadata object.
            lCurrentConstructor = Object.getPrototypeOf(lCurrentConstructor);
        } while (lCurrentConstructor !== null);

        // Move inheritance chain backwards and chain metadata objects with prototypes.
        for (let lIndex = lInheritanceChain.length - 1; lIndex >= 0; lIndex--) {
            const lConstructor = lInheritanceChain[lIndex];

            // When not metadata object is set, create one.
            if (!Object.hasOwn(lConstructor, Symbol.metadata)) {
                // When constructor has a parent set it as prototype.
                let lPrototype: object | null = null;
                if (lIndex < lInheritanceChain.length - 2) {
                    const lParentConstructor: InjectionConstructor = lInheritanceChain[lIndex + 1];

                    // It must have an own metadata.
                    lPrototype = lParentConstructor[Symbol.metadata];
                }

                // Create new metadata object with the potential parent metadata as prototype.
                lConstructor[Symbol.metadata] = Object.create(lPrototype, {});
            }
        }
    }
}



type AllClassDecoratorContext<TThis extends InjectionConstructor = InjectionConstructor> =
    | ClassDecoratorContext<TThis>
    | ClassMethodDecoratorContext<InjectionInstance<TThis>>
    | ClassGetterDecoratorContext<InjectionInstance<TThis>>
    | ClassSetterDecoratorContext<InjectionInstance<TThis>>
    | ClassFieldDecoratorContext<InjectionInstance<TThis>>
    | ClassAccessorDecoratorContext<InjectionInstance<TThis>>;

