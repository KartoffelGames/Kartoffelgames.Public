import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { PgslTypenName } from './pgsl-type-name.enum';

export class PgslType {
    // TODO: Add Struct type.

    /**
     * Setup type definition storage.
     */
    private static readonly mTypeStorage: Dictionary<string, TypeInformation> = (() => {
        const lTypes: Dictionary<string, TypeInformation> = new Dictionary<string, TypeInformation>();

        // Add type to Type storage.
        const lAddType = (pType: PgslTypenName, pGenericCounts?: Array<number>): void => {
            lTypes.set(pType, { type: pType, genericSupport: [...(pGenericCounts ?? [0])] });
        };

        // Add simple types.
        lAddType(PgslTypenName.Boolean);
        lAddType(PgslTypenName.Integer);
        lAddType(PgslTypenName.UnsignedInteger);
        lAddType(PgslTypenName.Float);

        // Vector types.
        lAddType(PgslTypenName.Vector2);
        lAddType(PgslTypenName.Vector3);
        lAddType(PgslTypenName.Vector4);

        // Matrix types.
        lAddType(PgslTypenName.Matrix22);
        lAddType(PgslTypenName.Matrix23);
        lAddType(PgslTypenName.Matrix24);
        lAddType(PgslTypenName.Matrix32);
        lAddType(PgslTypenName.Matrix33);
        lAddType(PgslTypenName.Matrix34);
        lAddType(PgslTypenName.Matrix42);
        lAddType(PgslTypenName.Matrix43);
        lAddType(PgslTypenName.Matrix44);

        // Bundled types.
        lAddType(PgslTypenName.Array, [1, 2]);

        // Specials
        lAddType(PgslTypenName.Atomic, [1]);

        // Image textures.
        lAddType(PgslTypenName.Texture1d, [1]);
        lAddType(PgslTypenName.Texture2d, [1]);
        lAddType(PgslTypenName.Texture2dArray, [1]);
        lAddType(PgslTypenName.Texture3d, [1]);
        lAddType(PgslTypenName.TextureCube, [1]);
        lAddType(PgslTypenName.TextureCubeArray, [1]);
        lAddType(PgslTypenName.TextureMultisampled2d, [1]);

        // External tetures.
        lAddType(PgslTypenName.TextureExternal);

        // Storage textures.
        lAddType(PgslTypenName.TextureStorage1d, [1]);
        lAddType(PgslTypenName.TextureStorage2d, [1]);
        lAddType(PgslTypenName.TextureStorage2dArray, [1]);
        lAddType(PgslTypenName.TextureStorage3d, [1]);

        // Depth Textures.
        lAddType(PgslTypenName.TextureDepth2d);
        lAddType(PgslTypenName.TextureDepth2dArray);
        lAddType(PgslTypenName.TextureDepthCube);
        lAddType(PgslTypenName.TextureDepthCubeArray);
        lAddType(PgslTypenName.TextureDepthMultisampled2d);

        // Sampler
        lAddType(PgslTypenName.Sampler);
        lAddType(PgslTypenName.SamplerComparison);

        // Reference and Pointer Types.
        lAddType(PgslTypenName.Reference, [3]);
        lAddType(PgslTypenName.Pointer, [3]);

        return lTypes;
    })();

    private readonly mGenerics: Array<PgslType>;
    private readonly mTypeName: PgslTypenName;

    /**
     * Generic list.
     */
    public get generics(): Array<PgslType> {
        return [...this.mGenerics];
    }

    /**
     * Type name.
     */
    public get typeName(): PgslTypenName {
        return this.mTypeName;
    }

    /**
     * Constructor.
     */
    public constructor(pTypeName: string, ...pGenerics: Array<PgslType>) {
        // Validate type.
        if (!PgslType.mTypeStorage.get(pTypeName)) {
            throw new Exception(`Invalid "${pTypeName}"`, this);
        }

        // Get type definition.
        const lTypeDefinition: TypeInformation = PgslType.mTypeStorage.get(pTypeName)!;

        // Set type.
        this.mTypeName = lTypeDefinition.type;

        // Validate generics.
        if (!lTypeDefinition.genericSupport.includes(pGenerics.length)) {
            throw new Exception(`Type "${lTypeDefinition.type}" does not support ${pGenerics.length} generics. Valid: (${lTypeDefinition.genericSupport.join(', ')})`, this);
        }

        // Set generics.
        this.mGenerics = pGenerics;
    }

    /**
     * Type equality check.
     * @param pType - Type.
     * @returns 
     */
    public equal(pType: PgslType): boolean {
        if (this.typeName !== pType.typeName) {
            return false;
        }

        if (this.mGenerics.length !== pType.mGenerics.length) {
            return false;
        }

        for (let lGenericIndex: number = 0; lGenericIndex < this.mGenerics.length; lGenericIndex++) {
            const lSourceType: PgslType = this.mGenerics[lGenericIndex];
            const lTargetType: PgslType = pType.mGenerics[lGenericIndex];

            if (!lSourceType.equal(lTargetType)) {
                return false;
            }
        }

        return true;
    }
}

type TypeInformation = {
    type: PgslTypenName;
    genericSupport: Array<number>;
};
