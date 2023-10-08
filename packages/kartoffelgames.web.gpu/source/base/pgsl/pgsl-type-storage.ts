import { Dictionary } from '@kartoffelgames/core.data';
import { PgslType } from './pgsl-type.enum';

export class PgslTypeStorage {
    private static mInstance: PgslTypeStorage | null = null;

    private readonly mTypeStorage!: Dictionary<string, PgslTypeInformation>;

    /**
     * Constructor.
     */
    public constructor() {
        // Load cached instance.
        if (PgslTypeStorage.mInstance !== null) {
            return PgslTypeStorage.mInstance;
        }

        this.mTypeStorage = new Dictionary<string, PgslTypeInformation>();

        // Add simple types.
        this.addType(PgslType.Boolean);
        this.addType(PgslType.Integer);
        this.addType(PgslType.UnsignedInteger);
        this.addType(PgslType.Float);

        // Vector types.
        this.addType(PgslType.Vector2);
        this.addType(PgslType.Vector3);
        this.addType(PgslType.Vector4);

        // Matrix types.
        this.addType(PgslType.Matrix22);
        this.addType(PgslType.Matrix23);
        this.addType(PgslType.Matrix24);
        this.addType(PgslType.Matrix32);
        this.addType(PgslType.Matrix33);
        this.addType(PgslType.Matrix34);
        this.addType(PgslType.Matrix42);
        this.addType(PgslType.Matrix43);
        this.addType(PgslType.Matrix44);

        // Bundled types.
        this.addType(PgslType.Array, [1, 2]);

        // Specials
        this.addType(PgslType.Atomic, [1]);

        // Image textures.
        this.addType(PgslType.Texture1d, [1]);
        this.addType(PgslType.Texture2d, [1]);
        this.addType(PgslType.Texture2dArray, [1]);
        this.addType(PgslType.Texture3d, [1]);
        this.addType(PgslType.TextureCube, [1]);
        this.addType(PgslType.TextureCubeArray, [1]);
        this.addType(PgslType.TextureMultisampled2d, [1]);

        // External tetures.
        this.addType(PgslType.TextureExternal);

        // Storage textures.
        this.addType(PgslType.TextureStorage1d, [1]);
        this.addType(PgslType.TextureStorage2d, [1]);
        this.addType(PgslType.TextureStorage2dArray, [1]);
        this.addType(PgslType.TextureStorage3d, [1]);

        // Depth Textures.
        this.addType(PgslType.TextureDepth2d);
        this.addType(PgslType.TextureDepth2dArray);
        this.addType(PgslType.TextureDepthCube);
        this.addType(PgslType.TextureDepthCubeArray);
        this.addType(PgslType.TextureDepthMultisampled2d);

        // Sampler
        this.addType(PgslType.Sampler);
        this.addType(PgslType.SamplerComparison);

        // Reference and Pointer Types.
        this.addType(PgslType.Reference, [3]);
        this.addType(PgslType.Pointer, [3]);


        // Buffer storage.
        PgslTypeStorage.mInstance = this;
    }

    /**
     * Get type information of type.
     * @param pTypeName - Type name.
     */
    public typeOf(pTypeName: string): PgslTypeInformation | null {
        return this.mTypeStorage.get(pTypeName) ?? null;
    }

    /**
     * Add type to storage.
     * @param pType - Type.
     * @param pGenericCounts - Supported generic counts. 
     */
    private addType(pType: PgslType, pGenericCounts?: Array<number>): void {
        this.mTypeStorage.set(pType, { type: pType, genericSupport: [...(pGenericCounts ?? [0])] });
    }
}

export type PgslTypeInformation = {
    type: PgslType;
    genericSupport: Array<number>;
};
