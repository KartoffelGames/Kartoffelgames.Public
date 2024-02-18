import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { PgslTypenName } from './pgsl-type-name.enum';
import { PgslStructMap } from '../struct/pgsl-struct-map';

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

        // Struct.
        lAddType(PgslTypenName.Struct);

        return lTypes;
    })();

    private readonly mGenerics: Array<PgslType>;
    private readonly mRawTypeName: string;
    private readonly mStructMap: PgslStructMap;

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
        if (PgslType.mTypeStorage.has(this.mRawTypeName)) {
            return <PgslTypenName>this.mRawTypeName;
        }

        return PgslTypenName.Struct;
    }

    /**
     * Constructor.
     */
    public constructor(pTypeName: string, pStructMap: PgslStructMap, ...pGenerics: Array<PgslType>) {
        // Validate type.
        if (!PgslType.mTypeStorage.get(pTypeName) && !pStructMap.has(pTypeName)) {
            throw new Exception(`Invalid "${pTypeName}"`, this);
        }

        // Get type definition.
        const lTypeDefinition: TypeInformation = PgslType.mTypeStorage.get(pTypeName) ?? PgslType.mTypeStorage.get(PgslTypenName.Struct)!;

        // Set type and struct map.
        this.mRawTypeName = lTypeDefinition.type;
        this.mStructMap = pStructMap;

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
        // Same type name.
        if (this.typeName !== pType.typeName) {
            return false;
        }

        // Same generic count.
        if (this.mGenerics.length !== pType.mGenerics.length) {
            return false;
        }

        // Same generics.
        for (let lGenericIndex: number = 0; lGenericIndex < this.mGenerics.length; lGenericIndex++) {
            const lSourceType: PgslType = this.mGenerics[lGenericIndex];
            const lTargetType: PgslType = pType.mGenerics[lGenericIndex];

            if (!lSourceType.equal(lTargetType)) {
                return false;
            }
        }

        // Extra validation for structs.
        if (this.typeName === PgslTypenName.Struct) {
            // Validate same struct reference.
            if (this.mStructMap.get(this.mRawTypeName) !== this.mStructMap.get(pType.mRawTypeName)) {
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
