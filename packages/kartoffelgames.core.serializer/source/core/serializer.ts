import { Exception, type IVoidParameterConstructor } from '@kartoffelgames/core';
import { Metadata } from '@kartoffelgames/core-dependency-injection';
import type { ConstructorMetadata, InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { type PropertySerializationConfig, SerializerMetadata } from './serializer-metadata.ts';

/**
 * Static class providing decorators and registry for serializable classes.
 * Decoupled from any specific serialization format.
 */
export class Serializer {
    private static readonly mMetadataKey: symbol = Symbol('SerializerMetadata');
    private static readonly mRegistry: Map<string, IVoidParameterConstructor<object>> = new Map<string, IVoidParameterConstructor<object>>();

    /**
     * Resolve a constructor by its registered UUID.
     *
     * @param pUuid - The UUID to look up.
     *
     * @returns the registered constructor.
     *
     * @throws Exception if the UUID is not registered.
     */
    public static classOfUuid(pUuid: string): IVoidParameterConstructor<object> {
        if (!Serializer.mRegistry.has(pUuid)) {
            throw new Exception(`Serializer type "${pUuid}" is not registered. Ensure @Serializer.class() is applied and the class is imported before deserialization.`, Serializer);
        }

        return Serializer.mRegistry.get(pUuid)!;
    }

    /**
     * Get serializer metadata for a constructor.
     *
     * @param pConstructor - The constructor to look up.
     *
     * @returns the serializer metadata, or null if the class is not registered.
     */
    public static metadataOf(pConstructor: IVoidParameterConstructor<object>): SerializerMetadata | null {
        return Metadata.get(pConstructor).getMetadata<SerializerMetadata>(Serializer.mMetadataKey);
    }

    /**
     * Property decorator. Marks a property for inclusion in serialization.
     * Works on fields, getters, setters, and accessors.
     *
     * @param pConfig - Optional property serialization configuration.
     *
     * @returns property decorator function.
     */
    public static property<TThis extends object>(pConfig?: PropertySerializationConfig): (_pTarget: any, pContext: SerializerPropertyDecoratorContext<TThis>) => void {
        return (_pTarget: any, pContext: SerializerPropertyDecoratorContext<TThis>): void => {
            // Validate non-static.
            if (pContext.static) {
                throw new Exception('@Serializer.property() is not supported for static members.', _pTarget);
            }

            // Validate string property name.
            if (typeof pContext.name !== 'string') {
                throw new Exception('@Serializer.property() requires a string property name.', _pTarget);
            }

            // Get or create metadata for this class.
            const lConstructorMetadata: ConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

            // Get or create metadata for this class.
            let lSerializerMetadata: SerializerMetadata | null = lConstructorMetadata.getMetadata<SerializerMetadata>(Serializer.mMetadataKey);
            if (lSerializerMetadata === null) {
                lSerializerMetadata = new SerializerMetadata();
                lConstructorMetadata.setMetadata(Serializer.mMetadataKey, lSerializerMetadata);
            }

            // Register property with config.
            lSerializerMetadata.addProperty(pContext.name, pConfig ?? {});
        };
    }

    /**
     * Class decorator. Marks a class as serializable and registers it by UUID.
     *
     * @param pUuid - Unique identifier string for this class type.
     *
     * @returns class decorator function.
     */
    public static serializeableClass<TThis extends object>(pUuid: string): (_pTarget: InjectionConstructor<TThis>, pContext: ClassDecoratorContext<InjectionConstructor<TThis>>) => void {
        return (_pTarget: InjectionConstructor<TThis>, pContext: ClassDecoratorContext<InjectionConstructor<TThis>>): void => {
            // Get or create metadata for this class.
            const lConstructorMetadata: ConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

            // Read existing metadata, primarily to check for duplicates, but later to merge properties from the entire inheritance chain.
            let lExistingMetadata: SerializerMetadata | null = lConstructorMetadata.getMetadata<SerializerMetadata>(Serializer.mMetadataKey);
            if(!lExistingMetadata) {
                lExistingMetadata = new SerializerMetadata();
                lConstructorMetadata.setMetadata(Serializer.mMetadataKey, lExistingMetadata);
            }

            // Check for duplicates.
            if (Serializer.mRegistry.has(pUuid)) {
                throw new Exception(`Serializer UUID "${pUuid}" is already registered.`, _pTarget);
            }

            // Check if uuid is already set on metadata, which would indicate multiple class decorators on the same class, which is not supported.
            if (lExistingMetadata.uuid !== null) {
                throw new Exception(`Multiple @Serializer.class() decorators on the same class are not supported.`, _pTarget);
            }

            // Set UUID on merged metadata and register constructor by UUID.
            lExistingMetadata.uuid = pUuid;

            // Merge properties from the entire inheritance chain (parent to child order).
            // Parent classes are always defined before children, so their metadata is already finalized.
            for (const lMetadata of lConstructorMetadata.getInheritedMetadata<SerializerMetadata>(Serializer.mMetadataKey)) {
                // Merge all parent properties into existing metadata.
                for (const lPropertyName of lMetadata.propertyNames) {
                     // Child class property overrides parent class property, so skip if already defined on child.
                    if(lExistingMetadata.hasProperty(lPropertyName)) { 
                        continue;
                    }
                    
                    lExistingMetadata.addProperty(lPropertyName, lMetadata.getPropertyConfig(lPropertyName));
                }
            }

            Serializer.mRegistry.set(pUuid, _pTarget as IVoidParameterConstructor<object>);
        };
    }
}

/**
 * Union of all decorator contexts that @Serializer.property() supports.
 */
type SerializerPropertyDecoratorContext<TThis extends object> =
    | ClassFieldDecoratorContext<TThis>
    | ClassGetterDecoratorContext<TThis>
    | ClassSetterDecoratorContext<TThis>
    | ClassAccessorDecoratorContext<TThis>;
