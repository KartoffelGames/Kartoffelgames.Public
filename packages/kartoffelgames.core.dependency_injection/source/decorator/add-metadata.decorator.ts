import { ReflectInitializer } from '../reflect/reflect-initializer';
import { InjectionConstructor } from '../type';

ReflectInitializer.initialize();

/**
 * AtScript.
 * Add metadata to class, method, accessor or property
 * 
 * @param pMetadataKey - Key of metadata.
 * @param pMetadataValue - Value of metadata.
 */
export function AddMetadata<T>(pMetadataKey: string, pMetadataValue: T) {
    return (pTarget: object | InjectionConstructor, pProperty?: string | symbol): void => {
        (<PropertyDecorator>Reflect.metadata(pMetadataKey, pMetadataValue))(pTarget, pProperty!);
    };
}