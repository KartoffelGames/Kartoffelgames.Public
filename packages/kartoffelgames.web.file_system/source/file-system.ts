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
     * Delete a file or directory from the file system by path.
     * When deleting a directory, all descendants are deleted recursively.
     *
     * @param pPath - Path to the item. Case-insensitive.
     *
     * @returns `true` when the item existed and was deleted, `false` when nothing exists at the path.
     */
    public async delete(pPath: string): Promise<boolean> {
        const lNormalizedPath: string = pPath.toLowerCase();

        // Cannot delete root.
        if (lNormalizedPath === '') {
            return false;
        }

        // Resolve the parent directory.
        const lResolved = await this.resolveParent(lNormalizedPath);
        if (lResolved === null) {
            return false;
        }

        const { parentReference, targetName, parentItem } = lResolved;

        // Check the target exists in parent's children.
        if (parentItem.type !== FileSystemFileType.Directory) {
            return false;
        }

        const lTargetReference: string | undefined = parentItem.children[targetName];
        if (lTargetReference === undefined) {
            return false;
        }

        // Recursively delete if directory, or just delete if file.
        await this.deleteRecursive(parentReference, lTargetReference);

        // Update parent cache: remove the child from children mapping.
        delete parentItem.children[targetName];

        // Clean singleton cache for this path and all sub-paths.
        const lPrefix: string = lNormalizedPath + '/';
        for (const lCachedPath of this.mSingletonCache.keys()) {
            if (lCachedPath === lNormalizedPath || lCachedPath.startsWith(lPrefix)) {
                this.mSingletonCache.delete(lCachedPath);
            }
        }

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
        const lNormalizedPath: string = pPath.toLowerCase();

        // Empty path is root (always exists as a directory).
        if (lNormalizedPath === '') {
            if (pFileType === FileSystemFileType.File) {
                return false;
            }
            if (pConstructor !== undefined) {
                return false;
            }
            return true;
        }

        // Resolve the item.
        const lResolved = await this.resolvePath(lNormalizedPath);
        if (lResolved === null) {
            return false;
        }

        const { cacheItem } = lResolved;

        // Check file type constraint.
        if (pFileType !== undefined && cacheItem.type !== pFileType) {
            return false;
        }

        // Directory + constructor constraint always fails.
        if (cacheItem.type === FileSystemFileType.Directory && pConstructor !== undefined) {
            return false;
        }

        // Check constructor constraint for files.
        if (pConstructor !== undefined && cacheItem.type === FileSystemFileType.File) {
            try {
                const lClassType: IVoidParameterConstructor<object> = Serializer.classOfIdentifier(cacheItem.classIdentifier);
                if (lClassType !== pConstructor) {
                    return false;
                }
            } catch {
                return false;
            }
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
        const lCachedReference: WeakRef<object> | undefined = this.mSingletonCache.get(lNormalizedPath);
        if (lCachedReference) {
            const lCachedInstance: object | undefined = lCachedReference.deref();
            if (lCachedInstance) {
                return lCachedInstance as T;
            }

            // WeakRef expired, remove stale entry.
            this.mSingletonCache.delete(lNormalizedPath);
        }

        // Navigate to find the file entry.
        const lResolved = await this.resolvePath(lNormalizedPath);
        if (lResolved === null || lResolved.cacheItem.type !== FileSystemFileType.File) {
            throw new Exception(`File not found: ${pPath}`, this);
        }

        // Read the blob from storage.
        const lBlob: Blob = await this.readFile(lResolved.reference);

        // Deserialize the blob.
        const lSerializer: BlobSerializer = new BlobSerializer();
        await lSerializer.load(lBlob);

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
        const lNormalizedPath: string = pPath.toLowerCase();

        // Resolve the target directory.
        let lDirectoryReference: string;
        let lDirectoryCacheItem: FileSystemCacheItem;

        if (lNormalizedPath === '') {
            lDirectoryReference = this.mRootReference;
            lDirectoryCacheItem = this.mDirectoryCache.get(this.mRootReference)!;
        } else {
            const lResolved = await this.resolvePath(lNormalizedPath);
            if (lResolved === null || lResolved.cacheItem.type !== FileSystemFileType.Directory) {
                return [];
            }
            lDirectoryReference = lResolved.reference;
            lDirectoryCacheItem = lResolved.cacheItem;
        }

        // Ensure children are loaded.
        await this.ensureLoaded(lDirectoryReference);

        // After ensureLoaded, children must be populated.
        if (lDirectoryCacheItem.type !== FileSystemFileType.Directory) {
            return [];
        }

        // Build result list.
        const lPrefix: string = lNormalizedPath === '' ? '' : `${lNormalizedPath}/`;
        const lResult: Array<FileSystemItem> = [];

        for (const [lName, lChildReference] of Object.entries(lDirectoryCacheItem.children)) {
            const lChildItem: FileSystemCacheItem | undefined = this.mDirectoryCache.get(lChildReference);
            if (!lChildItem) {
                continue;
            }

            const lFullPath: string = lPrefix + lName;

            if (lChildItem.type === FileSystemFileType.File) {
                // Resolve classIdentifier to constructor.
                let lClassType: IVoidParameterConstructor<object> | null = null;
                try {
                    lClassType = Serializer.classOfIdentifier(lChildItem.classIdentifier);
                } catch {
                    // UUID not registered, classType stays null.
                }

                lResult.push({
                    classType: lClassType,
                    name: lName,
                    path: lFullPath,
                    type: FileSystemFileType.File,
                });
            } else {
                lResult.push({
                    classType: null,
                    name: lName,
                    path: lFullPath,
                    type: FileSystemFileType.Directory,
                });
            }
        }

        return lResult;
    }

    /**
     * Serialize a single object and store it as a file in the file system.
     * Creates intermediate directories along the path if they do not exist.
     *
     * @param pPath - Full path for the file. Case-insensitive.
     * @param pObject - The serializable object to store.
     */
    public async writeFile(pPath: string, pObject: object): Promise<void> {
        const lNormalizedPath: string = pPath.toLowerCase();

        // Split path into directory segments and file name.
        const lSegments: Array<string> = lNormalizedPath.split('/');
        const lFileName: string = lSegments.pop()!;

        // Serialize the object into a blob.
        const lSerializer: BlobSerializer = new BlobSerializer();
        lSerializer.store('', pObject);
        const lBlob: Blob = await lSerializer.save();

        // Get the class constructor and identifier.
        const lClassIdentifier: string = FileSystem.identifierOfClass(pObject.constructor as IVoidParameterConstructor<object>);

        // Traverse and create intermediate directories.
        let lCurrentReference: string = this.mRootReference;
        for (const lSegment of lSegments) {
            await this.ensureLoaded(lCurrentReference);

            const lCurrentItem: FileSystemCacheItem = this.mDirectoryCache.get(lCurrentReference)!;
            if (lCurrentItem.type !== FileSystemFileType.Directory) {
                throw new Exception(`Path segment is not a directory: ${lSegment}`, this);
            }

            const lChildReference: string | undefined = lCurrentItem.children[lSegment];
            if (lChildReference === undefined) {
                // Create missing directory.
                const lNewDirRef: string = await this.storeDirectory(lCurrentReference, lSegment);
                lCurrentItem.children[lSegment] = lNewDirRef;
                this.mDirectoryCache.set(lNewDirRef, {
                    type: FileSystemFileType.Directory,
                    name: lSegment,
                    reference: lNewDirRef,
                    children: {}
                });
                lCurrentReference = lNewDirRef;
            } else {
                lCurrentReference = lChildReference;
            }
        }

        // Ensure the final parent directory is loaded.
        await this.ensureLoaded(lCurrentReference);

        const lParentItem: FileSystemCacheItem = this.mDirectoryCache.get(lCurrentReference)!;
        if (lParentItem.type !== FileSystemFileType.Directory) {
            throw new Exception(`Parent path is not a directory`, this);
        }

        // Delete existing file at this path if it exists.
        const lExistingFileRef: string | undefined = lParentItem.children[lFileName];
        if (lExistingFileRef !== undefined) {
            const lExistingItem: FileSystemCacheItem | undefined = this.mDirectoryCache.get(lExistingFileRef);
            if (lExistingItem && lExistingItem.type === FileSystemFileType.File) {
                await this.deleteReference(lCurrentReference, lExistingFileRef);
                this.mDirectoryCache.delete(lExistingFileRef);
                delete lParentItem.children[lFileName];

                // Remove from singleton cache.
                this.mSingletonCache.delete(lNormalizedPath);
            }
        }

        // Store the new file blob.
        const lFileReference: string = await this.storeFile(lCurrentReference, lFileName, lClassIdentifier, lBlob);

        // Update cache.
        this.mDirectoryCache.set(lFileReference, {
            type: FileSystemFileType.File,
            name: lFileName,
            reference: lFileReference,
            classIdentifier: lClassIdentifier
        });
        lParentItem.children[lFileName] = lFileReference;
    }

    /**
     * Create a directory at the given path.
     * Creates intermediate directories along the path if they do not exist.
     *
     * @param pPath - Full path for the directory. Case-insensitive.
     */
    public async createDirectory(pPath: string): Promise<void> {
        const lNormalizedPath: string = pPath.toLowerCase();
        const lPathSegments: Array<string> = lNormalizedPath.split('/');

        // Traverse and create all segments.
        let lCurrentReference: string = this.mRootReference;
        for (const lSegment of lPathSegments) {
            await this.ensureLoaded(lCurrentReference);

            const lCurrentItem: FileSystemCacheItem = this.mDirectoryCache.get(lCurrentReference)!;
            if (lCurrentItem.type !== FileSystemFileType.Directory) {
                throw new Exception(`Path segment is not a directory: ${lSegment}`, this);
            }

            const lChildReference: string | undefined = lCurrentItem.children[lSegment];
            if (lChildReference === undefined) {
                // Create missing directory.
                const lNewDirRef: string = await this.storeDirectory(lCurrentReference, lSegment);
                lCurrentItem.children[lSegment] = lNewDirRef;
                this.mDirectoryCache.set(lNewDirRef, {
                    type: FileSystemFileType.Directory,
                    name: lSegment,
                    reference: lNewDirRef,
                    children: {}
                });
                lCurrentReference = lNewDirRef;
            } else {
                lCurrentReference = lChildReference;
            }
        }
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
     * Recursively delete an item and all its descendants from both native storage and cache.
     * Deletes children depth-first before deleting the item itself.
     *
     * @param pParentReference - The reference of the parent directory.
     * @param pName - The name of the item within its parent.
     * @param pReference - The reference of the item to delete.
     */
    private async deleteRecursive(pParentReference: string, pReference: string): Promise<void> {
        const lCacheItem: FileSystemCacheItem | undefined = this.mDirectoryCache.get(pReference);

        // If it's a directory, recursively delete all children first.
        if (lCacheItem && lCacheItem.type === FileSystemFileType.Directory) {
            await this.ensureLoaded(pReference);

            if (lCacheItem.children !== null) {
                // Iterate over a copy of entries since we're modifying during iteration.
                const lChildren: Array<[string, string]> = Object.entries(lCacheItem.children);
                for (const [lChildName, lChildReference] of lChildren) {
                    await this.deleteRecursive(pReference, lChildReference);
                }
            }
        }

        // Delete the item from native storage.
        await this.deleteReference(pParentReference, pReference);

        // Remove from cache.
        this.mDirectoryCache.delete(pReference);
    }

    /**
     * Ensure a directory's children are loaded into the cache.
     * If the directory's children are `null` (not yet loaded), calls {@link readDirectoryItems}
     * to populate the cache.
     *
     * @param pReference - The reference of the directory to load.
     */
    private async ensureLoaded(pReference: string): Promise<void> {
        const lCacheItem: FileSystemCacheItem | undefined = this.mDirectoryCache.get(pReference);
        if (!lCacheItem || lCacheItem.type !== FileSystemFileType.Directory || lCacheItem.children !== null) {
            return;
        }

        // Load children from backend.
        const lEntries: Array<FileSystemDirectoryEntry> = await this.readDirectoryItems(pReference);

        // Populate cache and build children mapping.
        const lChildren: { [name: string]: string; } = {};
        for (const lEntry of lEntries) {
            if (lEntry.type === FileSystemFileType.File) {
                this.mDirectoryCache.set(lEntry.reference, {
                    type: FileSystemFileType.File,
                    name: lEntry.name,
                    reference: lEntry.reference,
                    classIdentifier: lEntry.classIdentifier!,
                });
            } else {
                this.mDirectoryCache.set(lEntry.reference, {
                    type: FileSystemFileType.Directory,
                    name: lEntry.name,
                    reference: lEntry.reference,
                    children: {},
                    childrenLoaded: false
                });
            }

            lChildren[lEntry.name] = lEntry.reference;
        }

        lCacheItem.children = lChildren;
    }

    /**
     * Resolve a normalized path to its cache entry and reference.
     *
     * @param pPath - The normalized (lowercase) path. Empty string returns root.
     *
     * @returns the reference and cache item, or `null` if not found.
     */
    private async resolvePath(pPath: string): Promise<{ reference: string; cacheItem: FileSystemCacheItem; } | null> {
        if (pPath === '') {
            return { reference: this.mRootReference, cacheItem: this.mDirectoryCache.get(this.mRootReference)! };
        }

        const lSegments: Array<string> = pPath.split('/');
        let lCurrentReference: string = this.mRootReference;

        for (const lSegment of lSegments) {
            await this.ensureLoaded(lCurrentReference);

            const lCurrentItem: FileSystemCacheItem | undefined = this.mDirectoryCache.get(lCurrentReference);
            if (!lCurrentItem || lCurrentItem.type !== FileSystemFileType.Directory) {
                return null;
            }

            const lChildReference: string | undefined = lCurrentItem.children[lSegment];
            if (lChildReference === undefined) {
                return null;
            }

            lCurrentReference = lChildReference;
        }

        const lFinalItem: FileSystemCacheItem | undefined = this.mDirectoryCache.get(lCurrentReference);
        if (!lFinalItem) {
            return null;
        }

        return { reference: lCurrentReference, cacheItem: lFinalItem };
    }

    /**
     * Resolve a normalized path to its parent directory, returning the parent reference and the target name.
     *
     * @param pPath - The normalized (lowercase) path. Must not be empty.
     *
     * @returns the parent reference, target name, and parent cache item, or `null` if parent not found.
     */
    private async resolveParent(pPath: string): Promise<{ parentReference: string; targetName: string; parentItem: FileSystemCacheItem; } | null> {
        const lSegments: Array<string> = pPath.split('/');
        const lTargetName: string = lSegments.pop()!;
        const lParentPath: string = lSegments.join('/');

        const lParentResolved = await this.resolvePath(lParentPath);
        if (lParentResolved === null || lParentResolved.cacheItem.type !== FileSystemFileType.Directory) {
            return null;
        }

        // Ensure parent's children are loaded.
        await this.ensureLoaded(lParentResolved.reference);

        return {
            parentReference: lParentResolved.reference,
            targetName: lTargetName,
            parentItem: lParentResolved.cacheItem,
        };
    }

    private async resolveDirectoryPath(pPath: string): Promise<FileSystemCacheItem> {
        const lPathSegments: Array<string> = pPath.split('/').filter(segment => segment.length > 0);

        // Traverse segments, ensuring directories are loaded and exist. Returns the final directory's cache item.
        let lCurrentItem: FileSystemCacheDirectoryItem | undefined = this.mDirectoryCache.get(this.mRootReference) as FileSystemCacheDirectoryItem | undefined;
        while(lPathSegments.length > 0) {
            // Load current directory's children if not loaded.
            if (!lCurrentItem) {
                const lChildItems:Array<FileSystemDirectoryEntry> = await this.readDirectoryItems(lCurrentItem.reference);
                for(const lChildItem of lChildItems) {
                    lCurrentItem.children[lChildItem.name] = lChildItem.reference;
                }
            }


        }
    }
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
 */
export enum FileSystemFileType {
    /**
     * A leaf entry that holds a stored (serialized) object.
     */
    File,

    /**
     * An intermediate path segment that contains child entries.
     */
    Directory
}

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
export type FileSystemCacheDirectoryItem = {
    type: FileSystemFileType.Directory;
    name: string;
    reference: string;
    children: { [name: string]: string; };
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
