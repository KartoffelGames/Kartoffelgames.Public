import { Exception, type IVoidParameterConstructor } from '@kartoffelgames/core';
import type { ConstructorMetadata, InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { Metadata } from '@kartoffelgames/core-dependency-injection';
import { BlobSerializer, Serializer } from '@kartoffelgames/core-serializer';

/**
 * Abstract base class for file system implementations.
 * Provides shared logic for serialization, caching, and path resolution.
 * Subclasses implement raw storage I/O via protected abstract methods.
 *
 * Also provides static decorator methods for marking classes and properties as file-system-serializable.
 */
export abstract class FileSystem {
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
     * Get the identifier for a constructor that was registered with {@link FileSystem.fileClass}.
     *
     * @param pConstructor - The constructor to look up.
     *
     * @returns the identifier string.
     */
    public static identifierOfClass(pConstructor: IVoidParameterConstructor<object>): string {
        return Serializer.identifierOfClass(pConstructor);
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
        if (lCached) {
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

    private readonly mDirectoryCache: Map<string, FileSystemCacheItem>;
    private readonly mRootReference: string;
    private readonly mSingletonCache: Map<string, WeakRef<object>>;

    /**
     * Constructor.
     *
     * @param pRootDirectoryReference - The reference identifying the root directory in the backend.
     */
    public constructor(pRootDirectoryReference: string) {
        this.mRootReference = pRootDirectoryReference;
        this.mSingletonCache = new Map();

        // Initialize empty cache
        this.mDirectoryCache = new Map();
    }

    /**
     * Create a directory at the given path.
     * Creates intermediate directories along the path if they do not exist.
     *
     * @param pPath - Full path for the directory. Case-insensitive.
     */
    public async createDirectory(pPath: string): Promise<void> {
        await this.resolveDirectoryPath(pPath, true);
    }

    /**
     * Delete a file or directory from the file system by path.
     * When deleting a directory, all descendants are deleted recursively.
     *
     * @param pPath - Path to the item. Case-insensitive.
     *
     * @returns `true` when the item existed and was deleted, `false` when nothing exists at the path.
     */
    public async delete(pPath: string): Promise<boolean> {
        const lNormalizedPath: string = pPath.toLowerCase();

        // Find last segment to separate directory path from target name.
        const lLastIndexOfSeperator = lNormalizedPath.lastIndexOf('/');
        const lDirectoryPath = lNormalizedPath.substring(0, lLastIndexOfSeperator);
        const lTargetName = lNormalizedPath.substring(lLastIndexOfSeperator + 1);

        // Read parent directory.
        const lParentDirectory: FileSystemCacheDirectoryItem | null = await this.resolveDirectoryPath(lDirectoryPath, false);
        if (!lParentDirectory) {
            return false;
        }

        // Read target entry from parent directory's children mapping.
        const lTargetEntry: FileSystemCacheDirectoryItemEntry | null = lParentDirectory.children[lTargetName];
        if (!lTargetEntry) {
            return false;
        }

        // Recursive delete function that traverses the directory tree and deletes items from the backend and cache.
        const lDeleteRecursive = async (pParentDirectory: FileSystemCacheDirectoryItem, pDeleteTarget: FileSystemCacheDirectoryItemEntry): Promise<void> => {
            // Delete internal item of delete target when target is a directory.
            if (pDeleteTarget.type === FileSystemFileType.Directory) {
                // Read directory item to get its children mapping.
                const lDirectoryItem: FileSystemCacheDirectoryItem = await this.readCacheDirectoryEntry(pDeleteTarget.reference);

                // Delete all children recursively. That can be done in parallel since every delete only deletes its own branch.
                // The parent directory changes are deleted anyway.
                const lAsyncDeletions: Array<Promise<void>> = new Array<Promise<void>>();
                for (const lChildEntry of Object.values(lDirectoryItem.children)) {
                    lAsyncDeletions.push(lDeleteRecursive(lDirectoryItem, lChildEntry));
                }

                await Promise.all(lAsyncDeletions);
            }

            // Remove delete target from parent directory's children mapping.
            delete pParentDirectory.children[pDeleteTarget.name.toLowerCase()];

            // Remove delete target from cache.
            this.mDirectoryCache.delete(pDeleteTarget.reference);

            // Delete the item from native storage. The parent reference is needed to update the native children mapping of the parent directory.
            await this.deleteReference(pParentDirectory.reference, pDeleteTarget.reference);
        };

        // Delete the target entry and all its descendants recursively.
        await lDeleteRecursive(lParentDirectory, lTargetEntry);

        return true;
    }

    /**
     * Check whether a given path exists in the file system, with optional type and class constraints.
     *
     * @param pPath - Path to check. Case-insensitive.
     * @param pFileType - Optional constraint for the type of the item.
     * @param pConstructor - Optional constraint for the class constructor of a file item. Always returns false for directories when specified.
     *
     * @returns `true` when a matching item exists at the path.
     */
    public async has(pPath: string, pFileType?: FileSystemFileType, pConstructor?: IVoidParameterConstructor<object>): Promise<boolean> {
        // Fast skip if file type is directory and a constructor is specified.
        if (pFileType === FileSystemFileType.Directory && pConstructor) {
            return false;
        }

        const lNormalizedPath: string = pPath.toLowerCase();

        // Find last segment to separate directory path from target name.
        const lLastIndexOfSeperator = lNormalizedPath.lastIndexOf('/');
        const lDirectoryPath = lNormalizedPath.substring(0, lLastIndexOfSeperator);
        const lTargetName = lNormalizedPath.substring(lLastIndexOfSeperator + 1);

        // Read and resolve target
        const lParentDirectory: FileSystemCacheDirectoryItem | null = await this.resolveDirectoryPath(lDirectoryPath, false);
        if (!lParentDirectory) {
            return false;
        }

        // Read target entry from parent directory's children mapping.
        const lTargetEntry: FileSystemCacheDirectoryItemEntry | null = lParentDirectory.children[lTargetName];
        if (!lTargetEntry) {
            return false;
        }

        // Validate file type constraint if specified.
        if (pFileType && lTargetEntry.type !== pFileType) {
            return false;
        }

        // Validate constructor constraint if specified and this is a file.
        if (pConstructor && lTargetEntry.classConstructor !== pConstructor) {
            return false;
        }

        return true;
    }

    /**
     * Read a serialized object from the file system by path.
     *
     * For classes decorated with {@link FileSystemReferenceType.Singleton}, the deserialized
     * instance is cached per path (as a {@link WeakRef}). Subsequent reads return the cached
     * instance as long as the reference is still alive.
     *
     * @param pPath - Path to the stored object. Case-insensitive.
     *
     * @returns the deserialized object.
     *
     * @throws Exception if no file entry exists at the given path.
     */
    public async read<T extends object>(pPath: string): Promise<T> {
        const lNormalizedPath: string = pPath.toLowerCase();

        // Check singleton cache before deserializing.
        if (this.mSingletonCache.has(lNormalizedPath)) {
            // Read the cached instance from the WeakRef and when it's still alive, return it.
            const lCachedInstance: object | undefined = this.mSingletonCache.get(lNormalizedPath)!.deref();
            if (lCachedInstance) {
                return lCachedInstance as T;
            }

            // WeakRef expired, remove stale entry.
            this.mSingletonCache.delete(lNormalizedPath);
        }

        // Find last segment to separate directory path from target name.
        const lLastIndexOfSeperator = lNormalizedPath.lastIndexOf('/');
        const lDirectoryPath = lNormalizedPath.substring(0, lLastIndexOfSeperator);
        const lTargetName = lNormalizedPath.substring(lLastIndexOfSeperator + 1);

        // Read and resolve target
        const lParentDirectory: FileSystemCacheDirectoryItem | null = await this.resolveDirectoryPath(lDirectoryPath, false);
        if (!lParentDirectory) {
            throw new Exception(`File not found: ${pPath}`, this);
        }

        // Read target entry from parent directory's children mapping.
        const lTargetEntry: FileSystemCacheDirectoryItemEntry | null = lParentDirectory.children[lTargetName];
        if (!lTargetEntry || lTargetEntry.type !== FileSystemFileType.File) {
            throw new Exception(`File not found: ${pPath}`, this);
        }

        // Read the blob from storage.
        const lBlob: Blob = await this.readFile(lTargetEntry.reference);

        // Deserialize the blob.
        const lSerializer: BlobSerializer = await new BlobSerializer().load(lBlob);

        // Deserialize the object from the blob.
        const lInstance: T = await lSerializer.read<T>('');

        // Cache singleton instances.
        const lReferenceType: FileSystemReferenceType = FileSystem.referenceTypeOf(lInstance.constructor as IVoidParameterConstructor<object>);
        if (lReferenceType === FileSystemReferenceType.Singleton) {
            this.mSingletonCache.set(lNormalizedPath, new WeakRef(lInstance));
        }

        return lInstance;
    }

    /**
     * List the immediate children of the given path as a directory listing.
     *
     * @param pPath - Parent path to list children of. Case-insensitive.
     *                An empty string lists root-level items.
     *
     * @returns array of immediate child items, or an empty array when no children exist.
     */
    public async readDirectory(pPath: string): Promise<Array<FileSystemItem>> {
        // Read parent directory.
        const lParentDirectory: FileSystemCacheDirectoryItem | null = await this.resolveDirectoryPath(pPath, false);
        if (!lParentDirectory) {
            return new Array<FileSystemItem>();
        }

        // Convert parent directory's children mapping to result list.
        const lFileSystemItems: Array<FileSystemItem> = new Array<FileSystemItem>();
        for (const lChildEntry of Object.values(lParentDirectory.children)) {
            // Build the full path for the child entry by combining the parent path and the child name.
            const lChildPath: string = pPath.length > 0 ? `${pPath}/${lChildEntry.name}` : lChildEntry.name;

            if (lChildEntry.type === FileSystemFileType.File) {
                lFileSystemItems.push({
                    classType: lChildEntry.classConstructor,
                    name: lChildEntry.name,
                    path: lChildPath,
                    type: FileSystemFileType.File,
                });
            } else {
                lFileSystemItems.push({
                    classType: null,
                    name: lChildEntry.name,
                    path: lChildPath,
                    type: FileSystemFileType.Directory,
                });
            }
        }

        return lFileSystemItems;
    }

    /**
     * Serialize a single object and store it as a file in the file system.
     * Creates intermediate directories along the path if they do not exist.
     *
     * @param pPath - Full path for the file. Case-insensitive.
     * @param pObject - The serializable object to store.
     */
    public async writeFile(pPath: string, pObject: object): Promise<void> {
        // Find last segment to separate directory path from target name.
        const lLastIndexOfSeperator = pPath.lastIndexOf('/');
        const lDirectoryPath = pPath.substring(0, lLastIndexOfSeperator);
        const lTargetName = pPath.substring(lLastIndexOfSeperator + 1);

        // Read parent directory.
        const lParentDirectory: FileSystemCacheDirectoryItem = await this.resolveDirectoryPath(lDirectoryPath, true);

        // Serialize the object into a blob.
        const lSerializer: BlobSerializer = new BlobSerializer().store('', pObject);

        // Get the class constructor and identifier.
        const lClassConstructor: IVoidParameterConstructor<object> = pObject.constructor as IVoidParameterConstructor<object>;
        const lClassIdentifier: string = FileSystem.identifierOfClass(lClassConstructor);

        // Store the new file blob.
        const lFileReference: string = await this.storeFile(lParentDirectory.reference, lTargetName, lClassIdentifier, await lSerializer.save());

        // Delete existing singleton cache entry.
        const lNormalizedPath: string = pPath.toLowerCase();
        this.mSingletonCache.delete(lNormalizedPath);

        // Update cache.
        this.mDirectoryCache.set(lFileReference, {
            type: FileSystemFileType.File,
            name: lTargetName,
            reference: lFileReference,
            classIdentifier: lClassIdentifier
        });

        lParentDirectory.children[lTargetName.toLowerCase()] = {
            name: lTargetName,
            type: FileSystemFileType.File,
            reference: lFileReference,
            classConstructor: lClassConstructor
        };
    }

    /**
     * Read a directory entry by reference, loading it from the backend if not already cached.
     * 
     * @param pReference - The reference of the directory to read.
     * 
     * @returns the directory's cache item.
     */
    private async readCacheDirectoryEntry(pReference: string): Promise<FileSystemCacheDirectoryItem> {
        // Check if directory is already in cache.
        if (!this.mDirectoryCache.has(pReference)) {
            // Load root directory and convert to cache item with children mapping.
            const lRootChildren: { [name: string]: FileSystemCacheDirectoryItemEntry; } = {};
            for (const lChildEntry of await this.readDirectoryItems(pReference)) {
                lRootChildren[lChildEntry.name.toLowerCase()] = {
                    name: lChildEntry.name,
                    type: lChildEntry.type,
                    reference: lChildEntry.reference,
                    classConstructor: lChildEntry.classIdentifier ? Serializer.classOfIdentifier(lChildEntry.classIdentifier) : null
                };
            }

            // Save root directory in cache.
            this.mDirectoryCache.set(pReference, {
                type: FileSystemFileType.Directory,
                name: '',
                reference: pReference,
                children: lRootChildren
            } satisfies FileSystemCacheDirectoryItem);
        }

        // Read from cache after loading.
        return this.mDirectoryCache.get(pReference)! as FileSystemCacheDirectoryItem;
    }

    /**
     * Resolve a normalized path to its final directory cache item, creating intermediate directories if needed.
     * 
     * @param pPath - The normalized (lowercase) path. Empty string returns root.
     * 
     * @returns the final directory's cache item.
     */
    private async resolveDirectoryPath(pPath: string, pCreate: true): Promise<FileSystemCacheDirectoryItem>;
    private async resolveDirectoryPath(pPath: string, pCreate: false): Promise<FileSystemCacheDirectoryItem | null>;
    private async resolveDirectoryPath(pPath: string, pCreate: boolean): Promise<FileSystemCacheDirectoryItem | null> {
        const lPathSegments: Array<string> = pPath.toLowerCase().split('/').filter(pSegment => pSegment.length > 0);

        // Read the first directory entry (root) from cache or backend. This also ensures the root directory is loaded in the cache.
        let lCurrentItem: FileSystemCacheDirectoryItem = await this.readCacheDirectoryEntry(this.mRootReference);

        // Traverse segments, ensuring directories are loaded and exist. Returns the final directory's cache item.
        while (lPathSegments.length > 0) {
            // Read next segment and their reference from the current directory's children mapping.
            const lNextSegment: string = lPathSegments.shift()!;

            // Create child directory if it doesn't exist.
            let lChildReference: FileSystemCacheDirectoryItemEntry | undefined = lCurrentItem.children[lNextSegment];
            if (lChildReference && lChildReference.type !== FileSystemFileType.Directory) {
                // A non-directory entry exists at this segment, cannot resolve.
                throw new Exception(`Path is not a directory: ${pPath}`, this);
            }

            // When the reference does not exist, eighter return null when pCreate is false or create the directory and continue.
            if (!lChildReference && !pCreate) {
                return null;
            } else if (!lChildReference) {
                // Create the new directory in the backend and get its reference.
                const lNewDirectoryReference: string = await this.storeDirectory(lCurrentItem.reference, lNextSegment);

                // Create new cache entry for the child directory with empty children mapping.
                lChildReference = {
                    name: lNextSegment,
                    type: FileSystemFileType.Directory,
                    reference: lNewDirectoryReference,
                    classConstructor: null
                };

                // Update current directory's children mapping and cache the new directory.
                lCurrentItem.children[lNextSegment] = lChildReference;
            }

            // Read the child directory's cache entry.
            lCurrentItem = await this.readCacheDirectoryEntry(lChildReference.reference);
        }

        return lCurrentItem;
    }

    /**
     * Delete a single item from the storage backend. Also updates the parent directory's native children mapping.
     *
     * @param pParentReference - The reference of the parent directory.
     * @param pName - The name of the item within the parent directory.
     * @param pReference - The reference of the item to delete.
     *
     * @returns `true` when the item existed and was deleted.
     */
    protected abstract deleteReference(pParentReference: string, pReference: string): Promise<boolean>;

    /**
     * Read the immediate children of a directory from the storage backend.
     *
     * @param pReference - The reference of the directory to list.
     *
     * @returns array of directory entries, or an empty array when the directory is empty or not found.
     */
    protected abstract readDirectoryItems(pReference: string): Promise<Array<FileSystemDirectoryEntry>>;

    /**
     * Read a file blob from the storage backend.
     *
     * @param pFileReference - The reference of the file to read.
     *
     * @returns the blob content of the file.
     */
    protected abstract readFile(pFileReference: string): Promise<Blob>;

    /**
     * Create a directory in the storage backend. Also updates the parent directory's native children mapping.
     *
     * @param pParentReference - The reference of the parent directory.
     * @param pDirectoryName - The name of the new directory.
     *
     * @returns the generated reference string for the new directory.
     */
    protected abstract storeDirectory(pParentReference: string, pDirectoryName: string): Promise<string>;

    /**
     * Store a file blob in the storage backend. Also updates the parent directory's native children mapping.
     *
     * @param pParentReference - The reference of the parent directory.
     * @param pFileName - The name of the file within the parent directory.
     * @param pFileClassIdentifier - The class identifier of the stored object.
     * @param pFile - The blob content to store.
     *
     * @returns the generated reference string for the stored file.
     */
    protected abstract storeFile(pParentReference: string, pFileName: string, pFileClassIdentifier: string, pFile: Blob): Promise<string>;
}

/**
 * Union of all decorator contexts that @FileSystem.fileProperty() supports.
 */
type FilePropertyDecoratorContext<TThis extends object> =
    | ClassFieldDecoratorContext<TThis>
    | ClassGetterDecoratorContext<TThis>
    | ClassSetterDecoratorContext<TThis>
    | ClassAccessorDecoratorContext<TThis>;


/**
 * Determines the type of a file system entry.
 * Avoid 0 to allow falsy checks for logic.
 */
export enum FileSystemFileType {
    /**
     * A leaf entry that holds a stored (serialized) object.
     */
    File = 1,

    /**
     * An intermediate path segment that contains child entries.
     */
    Directory = 2
}

/**
 * Determines how the file system caches deserialized instances.
 * Avoid 0 to allow falsy checks for logic.
 */
export enum FileSystemReferenceType {
    /**
     * Each read creates a new instance from the serialized data.
     */
    Instanced = 1,

    /**
     * The first read caches the instance (as a WeakRef) by path.
     * Subsequent reads for the same path return the cached instance
     * as long as the reference is still alive.
     */
    Singleton = 2
}

/**
 * Describes a single entry returned by the abstract {@link FileSystem.readDirectoryItems}.
 * Contains raw backend information including the storage reference and class identifier.
 */
export type FileSystemDirectoryEntry = {
    /**
     * The direct segment name of the entry.
     */
    name: string;

    /**
     * Whether this entry is a file or a directory.
     */
    type: FileSystemFileType;

    /**
     * The storage-unique reference for this entry.
     */
    reference: string;

    /**
     * The class identifier (UUID) of the stored object. `null` for directories.
     */
    classIdentifier: string | null;
};

/**
 * Describes a single entry returned by the public {@link FileSystem.readDirectory}.
 * Contains resolved information including the class constructor.
 */
export type FileSystemItem = {
    /**
     * The class constructor of the stored object.
     * Only available for {@link FileSystemFileType.File} items; `null` for directories.
     */
    classType: IVoidParameterConstructor<object> | null;

    /**
     * The direct segment name (e.g. `'b'` when the full path is `'a/b'`).
     */
    name: string;

    /**
     * The full (absolute) path of the item.
     */
    path: string;

    /**
     * Whether this entry is a file or a directory.
     */
    type: FileSystemFileType;
};

/**
 * Internal cache entry stored in the base class's reference-to-item map.
 * Discriminated union on the `type` field.
 */
export type FileSystemCacheFileItem = {
    type: FileSystemFileType.File;
    name: string;
    reference: string;
    classIdentifier: string;
};
export type FileSystemCacheDirectoryItemEntry = {
    name: string;
    type: FileSystemFileType;
    reference: string;
    classConstructor: IVoidParameterConstructor<object> | null;
};
export type FileSystemCacheDirectoryItem = {
    type: FileSystemFileType.Directory;
    name: string;
    reference: string;
    children: {
        [name: string]: FileSystemCacheDirectoryItemEntry;
    };
};
export type FileSystemCacheItem = FileSystemCacheFileItem | FileSystemCacheDirectoryItem;

/**
 * Configuration for a file property.
 */
export type FileSystemPropertyConfig = {
    /**
     * Optional alias used as the key in the binary data instead of the property name.
     */
    alias?: string;
};
