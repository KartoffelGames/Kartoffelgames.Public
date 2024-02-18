import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { PgslTypeName } from './pgsl-type-name.enum';
import { PgslStructMap } from '../struct/pgsl-struct-map';

export class PgslType {
    /**
     * Setup type definition storage.
     */
    private static readonly mTypeStorage: Dictionary<string, TypeInformation> = (() => {
        const lTypes: Dictionary<string, TypeInformation> = new Dictionary<string, TypeInformation>();

        // Add type to Type storage.
        const lAddType = (pType: PgslTypeName, pGenericCounts?: Array<number>): void => {
            lTypes.set(pType, { type: pType, genericSupport: [...(pGenericCounts ?? [0])] });
        };

        // Add simple types.
        lAddType(PgslTypeName.Boolean);
        lAddType(PgslTypeName.Integer);
        lAddType(PgslTypeName.UnsignedInteger);
        lAddType(PgslTypeName.Float);

        // Vector types.
        lAddType(PgslTypeName.Vector2);
        lAddType(PgslTypeName.Vector3);
        lAddType(PgslTypeName.Vector4);

        // Matrix types.
        lAddType(PgslTypeName.Matrix22);
        lAddType(PgslTypeName.Matrix23);
        lAddType(PgslTypeName.Matrix24);
        lAddType(PgslTypeName.Matrix32);
        lAddType(PgslTypeName.Matrix33);
        lAddType(PgslTypeName.Matrix34);
        lAddType(PgslTypeName.Matrix42);
        lAddType(PgslTypeName.Matrix43);
        lAddType(PgslTypeName.Matrix44);

        // Bundled types.
        lAddType(PgslTypeName.Array, [1, 2]);

        // Specials
        lAddType(PgslTypeName.Atomic, [1]);

        // Image textures.
        lAddType(PgslTypeName.Texture1d, [1]);
        lAddType(PgslTypeName.Texture2d, [1]);
        lAddType(PgslTypeName.Texture2dArray, [1]);
        lAddType(PgslTypeName.Texture3d, [1]);
        lAddType(PgslTypeName.TextureCube, [1]);
        lAddType(PgslTypeName.TextureCubeArray, [1]);
        lAddType(PgslTypeName.TextureMultisampled2d, [1]);

        // External tetures.
        lAddType(PgslTypeName.TextureExternal);

        // Storage textures.
        lAddType(PgslTypeName.TextureStorage1d, [1]);
        lAddType(PgslTypeName.TextureStorage2d, [1]);
        lAddType(PgslTypeName.TextureStorage2dArray, [1]);
        lAddType(PgslTypeName.TextureStorage3d, [1]);

        // Depth Textures.
        lAddType(PgslTypeName.TextureDepth2d);
        lAddType(PgslTypeName.TextureDepth2dArray);
        lAddType(PgslTypeName.TextureDepthCube);
        lAddType(PgslTypeName.TextureDepthCubeArray);
        lAddType(PgslTypeName.TextureDepthMultisampled2d);

        // Sampler
        lAddType(PgslTypeName.Sampler);
        lAddType(PgslTypeName.SamplerComparison);

        // Reference and Pointer Types.
        lAddType(PgslTypeName.Reference, [3]);
        lAddType(PgslTypeName.Pointer, [3]);

        // Struct.
        lAddType(PgslTypeName.Struct);

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
     * Type name enum.
     */
    public get typeName(): PgslTypeName {
        if (PgslType.mTypeStorage.has(this.mRawTypeName)) {
            return <PgslTypeName>this.mRawTypeName;
        }

        return PgslTypeName.Struct;
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
        const lTypeDefinition: TypeInformation = PgslType.mTypeStorage.get(pTypeName) ?? PgslType.mTypeStorage.get(PgslTypeName.Struct)!;

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
     * 
     * @returns true for type equality.
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
        if (this.typeName === PgslTypeName.Struct) {
            // Validate same struct reference.
            if (this.mStructMap.get(this.mRawTypeName) !== this.mStructMap.get(pType.mRawTypeName)) {
                return false;
            }
        }

        return true;
    }
}

type TypeInformation = {
    type: PgslTypeName;
    genericSupport: Array<number>;
};
