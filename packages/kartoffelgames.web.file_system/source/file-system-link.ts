import { Serializer } from '@kartoffelgames/core-serializer';
import type { FileSystem } from './file-system.ts';

/**
 * A serializable link to a file system entry that can be resolved lazily.
 * Can be created via static factory methods from a path or a direct instance.
 * When deserialized, the link stores only the path and must be resolved via {@link resolve}.
 */
@Serializer.serializeableClass('0c9cd88d-55f9-46ac-b4a4-a16769cb7aeb')
export class FileSystemLink<T extends object> {
    /**
     * Create a link from a direct object instance.
     *
     * @param pInstance - The object instance.
     *
     * @returns a new FileSystemLink wrapping the instance.
     */
    public static fromInstance<T extends object>(pInstance: T): FileSystemLink<T> {
        const lLink: FileSystemLink<T> = new FileSystemLink<T>();
        lLink.mInstance = pInstance;

        return lLink;
    }

    /**
     * Create a link from a read path.
     *
     * @param pPath - The read path to resolve against a file system.
     *
     * @returns a new FileSystemLink storing the path.
     */
    public static fromPath<T extends object>(pPath: string): FileSystemLink<T> {
        const lLink: FileSystemLink<T> = new FileSystemLink<T>();
        lLink.mPath = pPath;

        return lLink;
    }

    private mInstance: T | null;
    private mPath: string;

    /**
     * Get the stored path.
     */
    @Serializer.property()
    public get path(): string {
        return this.mPath;
    } set path(pValue: string) {
        this.mPath = pValue;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mPath = '';
        this.mInstance = null;
    }

    /**
     * Resolve the link to its target object.
     * If created with a path, reads from the file system on first call and caches the result.
     * If created with a direct instance, returns it immediately.
     *
     * @param pFileSystem - The file system to resolve the path against.
     *
     * @returns the resolved object.
     */
    public async resolve(pFileSystem: FileSystem): Promise<T> {
        if (this.mInstance === null) {
            this.mInstance = await pFileSystem.read<T>(this.mPath);
        }

        return this.mInstance;
    }
}
