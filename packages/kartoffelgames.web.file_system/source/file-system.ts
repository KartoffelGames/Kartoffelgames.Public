import { Exception, type IVoidParameterConstructor } from '@kartoffelgames/core';
import type { ConstructorMetadata, InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { Metadata } from '@kartoffelgames/core-dependency-injection';
import { BlobSerializer, Serializer } from '@kartoffelgames/core-serializer';

/**
 * Abstract base class for file system implementations.
 * Provides shared logic for serialization, directory tree management, and singleton caching.
 * Subclasses implement the raw blob I/O and optional tree persistence.
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

    private mDirectoryTree: FileSystemDirectory | null;
    private readonly mSingletonCache: Map<string, WeakRef<object>>;

    /**
     * Constructor.
     */
    public constructor() {
        this.mDirectoryTree = null;
        this.mSingletonCache = new Map();
    }

    /**
     * Delete a single file from the file system by path.
     *
     * @param pPath - Path to the file. Case-insensitive.
     *
     * @returns `true` when the file existed and was deleted, `false` when no file exists at the path.
     */
    public async delete(pPath: string): Promise<boolean> {
        const lNormalizedPath: string = pPath.toLowerCase();
        const lSegments: Array<string> = lNormalizedPath.split('/');
        const lFileName: string = lSegments.pop()!;

        // Navigate to the parent directory.
        const lParentDir: FileSystemDirectory | null = await this.getSubdirectory(lSegments.join('/'));
        if (lParentDir === null) {
            return false;
        }

        // Find the file entry.
        const lEntry: FileSystemDirectoryEntry | undefined = lParentDir.files[lFileName];
        if (!lEntry?.file) {
            return false;
        }

        // Delete the blob.
        await this.deleteFile(lEntry.file.reference);

        // Update or remove the entry.
        if (lEntry.children && Object.keys(lEntry.children.files).length > 0) {
            // Entry has children, just clear the file data but keep the directory.
            lEntry.file = null;
            lEntry.type = FileSystemFileType.Directory;
        } else {
            // No children, remove the entry entirely.
            delete lParentDir.files[lFileName];

            // Walk up and remove empty parent directories.
            for (let lDepth: number = lSegments.length - 1; lDepth >= 0; lDepth--) {
                const lAncestorDir: FileSystemDirectory | null = await this.getSubdirectory(lSegments.slice(0, lDepth).join('/'));
                if (!lAncestorDir) {
                    break;
                }

                const lAncestorEntry: FileSystemDirectoryEntry | undefined = lAncestorDir.files[lSegments[lDepth]];
                if (!lAncestorEntry) {
                    break;
                }

                const lHasFile: boolean = lAncestorEntry.file !== null;
                const lHasChildren: boolean = !!lAncestorEntry.children && Object.keys(lAncestorEntry.children.files).length > 0;

                if (!lHasFile && !lHasChildren) {
                    delete lAncestorDir.files[lSegments[lDepth]];
                } else {
                    break;
                }
            }
        }

        // Remove from singleton cache.
        this.mSingletonCache.delete(lNormalizedPath);

        // Notify subclass of tree change.
        await this.onDirectoryTreeChanged();

        return true;
    }

    /**
     * Delete a directory and all its contents from the file system.
     *
     * @param pPath - Path to the directory. Case-insensitive.
     *
     * @returns `true` when the directory existed and was deleted, `false` when no directory exists at the path.
     */
    public async deleteDirectory(pPath: string): Promise<boolean> {
        const lNormalizedPath: string = pPath.toLowerCase();
        const lSegments: Array<string> = lNormalizedPath.split('/');
        const lDirName: string = lSegments.pop()!;

        // Navigate to the parent directory.
        const lParentDir: FileSystemDirectory | null = await this.getSubdirectory(lSegments.join('/'));
        if (lParentDir === null) {
            return false;
        }

        // Find the directory entry.
        const lEntry: FileSystemDirectoryEntry | undefined = lParentDir.files[lDirName];
        if (!lEntry) {
            return false;
        }

        // Collect all file references recursively and delete all blobs.
        const lRefs: Array<string> = this.collectFileReferences(lEntry);
        for (const lRef of lRefs) {
            await this.deleteFile(lRef);
        }

        // Remove all singleton caches under this path.
        const lPrefix: string = lNormalizedPath + '/';
        for (const lCachedPath of this.mSingletonCache.keys()) {
            if (lCachedPath === lNormalizedPath || lCachedPath.startsWith(lPrefix)) {
                this.mSingletonCache.delete(lCachedPath);
            }
        }

        // Remove the directory entry.
        delete lParentDir.files[lDirName];

        // Walk up and remove empty parent directories.
        for (let lDepth: number = lSegments.length - 1; lDepth >= 0; lDepth--) {
            const lAncestorDir: FileSystemDirectory | null = await this.getSubdirectory(lSegments.slice(0, lDepth).join('/'));
            if (!lAncestorDir) {
                break;
            }

            const lAncestorEntry: FileSystemDirectoryEntry | undefined = lAncestorDir.files[lSegments[lDepth]];
            if (!lAncestorEntry) {
                break;
            }

            const lHasFile: boolean = lAncestorEntry.file !== null;
            const lHasChildren: boolean = !!lAncestorEntry.children && Object.keys(lAncestorEntry.children.files).length > 0;

            if (!lHasFile && !lHasChildren) {
                delete lAncestorDir.files[lSegments[lDepth]];
            } else {
                break;
            }
        }

        // Notify subclass of tree change.
        await this.onDirectoryTreeChanged();

        return true;
    }

    /**
     * Check whether a given path exists in the file system.
     *
     * @param pPath - Path to check. Case-insensitive.
     *
     * @returns `true` when a matching file or directory exists at the path.
     */
    public async has(pPath: string): Promise<boolean> {
        const lNormalizedPath: string = pPath.toLowerCase();

        // Empty path is the root, always exists.
        if (lNormalizedPath === '') {
            return true;
        }

        const lSegments: Array<string> = lNormalizedPath.split('/');
        const lName: string = lSegments.pop()!;

        const lParentDir: FileSystemDirectory | null = await this.getSubdirectory(lSegments.join('/'));
        if (lParentDir === null) {
            return false;
        }

        return lName in lParentDir.files;
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

        // Navigate tree to find the file entry.
        const lSegments: Array<string> = lNormalizedPath.split('/');
        const lName: string = lSegments.pop()!;

        const lParentDir: FileSystemDirectory | null = await this.getSubdirectory(lSegments.join('/'));
        const lEntry: FileSystemDirectoryEntry | undefined = lParentDir?.files[lName];
        if (!lEntry?.file) {
            throw new Exception(`File not found: ${pPath}`, this);
        }

        // Read the blob from storage.
        const lBlob: Blob = await this.readFile(lEntry.file.reference);

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

        // Find the directory to list.
        let lDirectory: FileSystemDirectory | null;
        if (lNormalizedPath === '') {
            lDirectory = await this.getSubdirectory('');
        } else {
            const lSegments: Array<string> = lNormalizedPath.split('/');
            const lName: string = lSegments.pop()!;

            const lParentDir: FileSystemDirectory | null = await this.getSubdirectory(lSegments.join('/'));
            const lEntry: FileSystemDirectoryEntry | undefined = lParentDir?.files[lName];
            if (!lEntry?.children) {
                return [];
            }
            lDirectory = lEntry.children;
        }

        if (!lDirectory) {
            return [];
        }

        // Build the result list.
        const lPrefix: string = lNormalizedPath === '' ? '' : `${lNormalizedPath}/`;
        const lResult: Array<FileSystemItem> = [];

        for (const [lName, lEntry] of Object.entries(lDirectory.files)) {
            const lFullPath: string = lPrefix + lName;
            const lHasChildren: boolean = !!lEntry.children && Object.keys(lEntry.children.files).length > 0;

            if (lHasChildren) {
                // Directory (or both file and directory → directory wins).
                lResult.push({
                    classType: null,
                    name: lName,
                    path: lFullPath,
                    type: FileSystemFileType.Directory,
                });
            } else if (lEntry.file) {
                // Pure file.
                let lClassType: IVoidParameterConstructor<object> | null = null;
                try {
                    lClassType = Serializer.classOfIdentifier(lEntry.file.class);
                } catch {
                    // UUID not registered, classType stays null.
                }

                lResult.push({
                    classType: lClassType,
                    name: lName,
                    path: lFullPath,
                    type: FileSystemFileType.File,
                });
            }
        }

        return lResult;
    }

    /**
     * Serialize a single object and store it in the file system.
     *
     * @param pPath - Full path for the file. Case-insensitive.
     * @param pObject - The serializable object to store.
     */
    public async store(pPath: string, pObject: object): Promise<void> {
        const lNormalizedPath: string = pPath.toLowerCase();

        // Serialize the object into a blob.
        const lSerializer: BlobSerializer = new BlobSerializer();
        lSerializer.store('', pObject);
        const lBlob: Blob = await lSerializer.save();

        // Get the class UUID.
        const lConstructor: IVoidParameterConstructor<object> = pObject.constructor as IVoidParameterConstructor<object>;
        const lUuid: string = FileSystem.identifierOfClass(lConstructor);

        // Navigate/create intermediate directories and set the file entry.
        const lSegments: Array<string> = lNormalizedPath.split('/');
        const lFileName: string = lSegments.pop()!;
        let lCurrentDir: FileSystemDirectory = (await this.getSubdirectory(''))!;

        for (const lSegment of lSegments) {
            let lEntry: FileSystemDirectoryEntry | undefined = lCurrentDir.files[lSegment];
            if (!lEntry) {
                // Create intermediate directory.
                lEntry = { type: FileSystemFileType.Directory, file: null, children: { files: {} } };
                lCurrentDir.files[lSegment] = lEntry;
            } else if (!lEntry.children) {
                // Convert file entry to also be a directory (preserving file data).
                lEntry.type = FileSystemFileType.Directory;
                lEntry.children = { files: {} };
            }

            lCurrentDir = lEntry.children!;
        }

        // Delete old blob before storing the new one to avoid reference conflicts.
        const lExistingEntry: FileSystemDirectoryEntry | undefined = lCurrentDir.files[lFileName];
        if (lExistingEntry?.file) {
            await this.deleteFile(lExistingEntry.file.reference);
        }

        // Store the blob file — implementation returns reference.
        const lReference: string = await this.storeFile(lNormalizedPath, lBlob, lUuid);

        // Set or update the file entry.
        if (lExistingEntry) {
            lExistingEntry.file = { reference: lReference, class: lUuid };

            // Update type: if entry has children, it's a Directory.
            if (!lExistingEntry.children || Object.keys(lExistingEntry.children.files).length === 0) {
                lExistingEntry.type = FileSystemFileType.File;
            }
        } else {
            lCurrentDir.files[lFileName] = {
                type: FileSystemFileType.File,
                file: { reference: lReference, class: lUuid }
            };
        }
    }

    /**
     * Delete a file from the storage backend.
     *
     * @param pRef - The reference (as returned by {@link storeFile}) to the file.
     *
     * @returns `true` when the file existed and was deleted.
     */
    protected abstract deleteFile(pRef: string): Promise<boolean>;

    /**
     * Load the full directory tree from the storage backend.
     * Called once lazily on the first public method invocation.
     *
     * @returns the stored directory tree, or an empty tree if none exists.
     */
    protected abstract readDirectoryTree(): Promise<FileSystemDirectory>;

    /**
     * Read a file blob from the storage backend.
     *
     * @param pRef - The reference (as returned by {@link storeFile}) to the file.
     *
     * @returns the blob content of the file.
     */
    protected abstract readFile(pRef: string): Promise<Blob>;

    /**
     * Store a file blob in the storage backend.
     *
     * @param pPath - The user-facing path (can be used to derive the reference).
     * @param pFile - The blob content to store.
     *
     * @returns the generated reference string for the stored file.
     */
    protected abstract storeFile(pPath: string, pFileClass: IVoidParameterConstructor<object>, pFile: Blob): Promise<string>;

    /**
     * Read access to the in-memory directory tree.
     * Available for subclasses that need to persist tree changes.
     */
    protected get directoryTree(): FileSystemDirectory {
        return this.mDirectoryTree!;
    }

    /**
     * Recursively collect all file references from an entry and its descendants.
     */
    private collectFileReferences(pEntry: FileSystemDirectoryEntry): Array<string> {
        const lRefs: Array<string> = [];

        if (pEntry.file) {
            lRefs.push(pEntry.file.reference);
        }

        if (pEntry.children) {
            for (const lChildEntry of Object.values(pEntry.children.files)) {
                lRefs.push(...this.collectFileReferences(lChildEntry));
            }
        }

        return lRefs;
    }

    /**
     * Get a subdirectory at the given path.
     * Handles lazy initialization of the directory tree.
     *
     * @param pPath - The normalized (lowercase) path. Empty string returns root.
     *
     * @returns the directory at the path, or `null` if not found.
     */
    private async getSubdirectory(pPath: string): Promise<FileSystemDirectory | null> {
        // Lazy init.
        if (this.mDirectoryTree === null) {
            this.mDirectoryTree = await this.readDirectoryTree();
        }

        // Empty path returns root.
        if (pPath === '') {
            return this.mDirectoryTree;
        }

        // Navigate through segments.
        const lSegments: Array<string> = pPath.split('/');
        let lCurrentDir: FileSystemDirectory = this.mDirectoryTree;

        for (const lSegment of lSegments) {
            const lEntry: FileSystemDirectoryEntry | undefined = lCurrentDir.files[lSegment];
            if (!lEntry?.children) {
                return null;
            }
            lCurrentDir = lEntry.children;
        }

        return lCurrentDir;
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
 * A recursive directory tree node.
 * Stores file entries and subdirectories.
 */
export type FileSystemDirectory = {
    files: {
        [FileName: string]: FileSystemDirectoryEntry;
    };
};

/**
 * Information about a stored file entry, including its reference and class UUID.
 */
export type FileSystemFile = {
    reference: string;
    classIdentifier: string;
};

/**
 * A single entry in the directory tree.
 * Can be a file, a directory, or both (when a file path also serves as a directory prefix).
 */
export type FileSystemDirectoryEntry = {
    type: FileSystemFileType.File;
    data: FileSystemFile;
} | {
    type: FileSystemFileType.Directory;
    data: FileSystemDirectory;
};

/**
 * Describes a single entry returned by {@link FileSystem.readDirectory}.
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
 * Configuration for a file property.
 */
export type FileSystemPropertyConfig = {
    /**
     * Optional alias used as the key in the binary data instead of the property name.
     */
    alias?: string;
};
