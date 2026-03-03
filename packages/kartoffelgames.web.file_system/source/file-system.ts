import type { IVoidParameterConstructor } from '@kartoffelgames/core';
import type { ConstructorMetadata, InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { Metadata } from '@kartoffelgames/core-dependency-injection';
import { Serializer } from '@kartoffelgames/core-serializer';

/**
 * Shared file system decorator class.
 * Provides decorator wrappers around {@link Serializer} decorators for file system serialization:
 * - {@link FileSystem.fileClass} wraps {@link Serializer.serializeableClass}
 * - {@link FileSystem.fileProperty} wraps {@link Serializer.property}
 */
export class FileSystem {
    private static readonly mMetadataKey: symbol = Symbol('FileSystemMetadata');
    private static readonly mReferenceTypeCache: Map<IVoidParameterConstructor<object>, FileSystemReferenceType> = new Map();

    /**
     * Class decorator. Marks a class as a file system serializable class.
     * Wraps {@link Serializer.serializeableClass} and additionally stores the {@link FileSystemReferenceType}.
     *
     * @param pUuid - Unique identifier string for this class type.
     * @param pReferenceType - How instances of this class are cached when read.
     *
     * @returns class decorator function.
     */
    public static fileClass<TThis extends object>(pUuid: string, pReferenceType: FileSystemReferenceType): (_pTarget: InjectionConstructor<TThis>, pContext: ClassDecoratorContext<InjectionConstructor<TThis>>) => void {
        return (_pTarget: InjectionConstructor<TThis>, pContext: ClassDecoratorContext<InjectionConstructor<TThis>>): void => {
            // Store the reference type in metadata.
            const lConstructorMetadata: ConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);
            lConstructorMetadata.setMetadata(FileSystem.mMetadataKey, pReferenceType);

            // Delegate to the serializer class decorator.
            Serializer.serializeableClass<TThis>(pUuid)(_pTarget, pContext);
        };
    }

    /**
     * Property decorator. Marks a property for inclusion in file system serialization.
     * Wraps {@link Serializer.property}.
     *
     * @param pConfig - Optional property configuration.
     *
     * @returns property decorator function.
     */
    public static fileProperty<TThis extends object>(pConfig?: FileSystemPropertyConfig): (_pTarget: any, pContext: FilePropertyDecoratorContext<TThis>) => void {
        return Serializer.property<TThis>(pConfig);
    }

    /**
     * Get the {@link FileSystemReferenceType} for a constructor.
     * The result is cached statically so that metadata is only read once per constructor.
     *
     * @param pConstructor - The constructor to look up.
     *
     * @returns the reference type, or {@link FileSystemReferenceType.Instanced} if none is set.
     */
    public static referenceTypeOf(pConstructor: IVoidParameterConstructor<object>): FileSystemReferenceType {
        // Check static cache first.
        const lCached: FileSystemReferenceType | undefined = FileSystem.mReferenceTypeCache.get(pConstructor);
        if (lCached !== undefined) {
            return lCached;
        }

        // Read from metadata.
        const lConstructorMetadata: ConstructorMetadata = Metadata.get(pConstructor);
        const lReferenceType: FileSystemReferenceType | null = lConstructorMetadata.getMetadata<FileSystemReferenceType>(FileSystem.mMetadataKey);
        const lResult: FileSystemReferenceType = lReferenceType ?? FileSystemReferenceType.Instanced;

        // Cache the result.
        FileSystem.mReferenceTypeCache.set(pConstructor, lResult);

        return lResult;
    }
}

/**
 * Configuration for a file property.
 */
export type FileSystemPropertyConfig = {
    /**
     * Optional alias used as the key in the binary data instead of the property name.
     */
    alias?: string;
};

/**
 * Determines how the file system caches deserialized instances.
 */
export enum FileSystemReferenceType {
    /**
     * Each read creates a new instance from the serialized data.
     */
    Instanced,

    /**
     * The first read caches the instance (as a WeakRef) by path.
     * Subsequent reads for the same path return the cached instance
     * as long as the reference is still alive.
     */
    Singleton
}

/**
 * Union of all decorator contexts that @FileSystem.fileProperty() supports.
 */
type FilePropertyDecoratorContext<TThis extends object> =
    | ClassFieldDecoratorContext<TThis>
    | ClassGetterDecoratorContext<TThis>
    | ClassSetterDecoratorContext<TThis>
    | ClassAccessorDecoratorContext<TThis>;
