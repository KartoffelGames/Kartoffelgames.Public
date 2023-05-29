import { EnumUtil, Exception } from '@kartoffelgames/core.data';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { BufferLayoutLocation, IBufferLayout } from '../../../interface/buffer/i-buffer-layout.interface';
import { WgslType } from '../../shader/wgsl_enum/wgsl-type.enum';
import { BufferLayout } from './buffer-layout';

export class SimpleBufferLayout extends BufferLayout implements IBufferLayout {
    private static readonly mTypeRestrictions: Record<WgslType, Array<WgslTypeSetting>> = (() => {
        const lTypes: Record<WgslType, Array<WgslTypeSetting>> = <any>{};

        // Scalar types.
        lTypes[WgslType.Boolean] = [{ size: 1, align: 1 }];
        lTypes[WgslType.Integer32] = [{ size: 4, align: 4 }];
        lTypes[WgslType.UnsignedInteger32] = [{ size: 4, align: 4 }];
        lTypes[WgslType.Float32] = [{ size: 4, align: 4 }];
        lTypes[WgslType.Float16] = [{ size: 2, align: 2 }];

        // Vector types.
        lTypes[WgslType.Vector2] = [
            { size: 8, align: 8, generic: [WgslType.Integer32] },
            { size: 8, align: 8, generic: [WgslType.UnsignedInteger32] },
            { size: 8, align: 8, generic: [WgslType.Float32] },
            { size: 4, align: 4, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Vector3] = [
            { size: 12, align: 16, generic: [WgslType.Integer32] },
            { size: 12, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 12, align: 16, generic: [WgslType.Float32] },
            { size: 6, align: 8, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Vector4] = [
            { size: 16, align: 16, generic: [WgslType.Integer32] },
            { size: 16, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 16, align: 16, generic: [WgslType.Float32] },
            { size: 8, align: 8, generic: [WgslType.Float16] }
        ];

        // Matrix types.
        lTypes[WgslType.Matrix22] = [
            { size: 16, align: 8, generic: [WgslType.Integer32] },
            { size: 16, align: 8, generic: [WgslType.UnsignedInteger32] },
            { size: 16, align: 8, generic: [WgslType.Float32] },
            { size: 8, align: 4, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix23] = [
            { size: 32, align: 16, generic: [WgslType.Integer32] },
            { size: 32, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 32, align: 16, generic: [WgslType.Float32] },
            { size: 16, align: 8, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix24] = [
            { size: 32, align: 16, generic: [WgslType.Integer32] },
            { size: 32, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 32, align: 16, generic: [WgslType.Float32] },
            { size: 16, align: 8, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix32] = [
            { size: 24, align: 8, generic: [WgslType.Integer32] },
            { size: 24, align: 8, generic: [WgslType.UnsignedInteger32] },
            { size: 24, align: 8, generic: [WgslType.Float32] },
            { size: 12, align: 4, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix33] = [
            { size: 48, align: 16, generic: [WgslType.Integer32] },
            { size: 48, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 48, align: 16, generic: [WgslType.Float32] },
            { size: 24, align: 8, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix34] = [
            { size: 48, align: 16, generic: [WgslType.Integer32] },
            { size: 48, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 48, align: 16, generic: [WgslType.Float32] },
            { size: 24, align: 8, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix42] = [
            { size: 32, align: 8, generic: [WgslType.Integer32] },
            { size: 32, align: 8, generic: [WgslType.UnsignedInteger32] },
            { size: 32, align: 8, generic: [WgslType.Float32] },
            { size: 16, align: 4, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix43] = [
            { size: 64, align: 16, generic: [WgslType.Integer32] },
            { size: 64, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 64, align: 16, generic: [WgslType.Float32] },
            { size: 32, align: 8, generic: [WgslType.Float16] }
        ];
        lTypes[WgslType.Matrix44] = [
            { size: 64, align: 16, generic: [WgslType.Integer32] },
            { size: 64, align: 16, generic: [WgslType.UnsignedInteger32] },
            { size: 64, align: 16, generic: [WgslType.Float32] },
            { size: 32, align: 8, generic: [WgslType.Float16] }
        ];

        lTypes[WgslType.Array] = [
            { size: -1, align: -1, generic: [WgslType.Any] },
            { size: -1, align: -1, generic: [WgslType.Any, WgslType.UnsignedInteger32] }
        ];
        lTypes[WgslType.Struct] = [{ size: -1, align: -1 }];

        lTypes[WgslType.Atomic] = [
            { size: 4, align: 4, generic: [WgslType.Integer32] },
            { size: 4, align: 4, generic: [WgslType.UnsignedInteger32] }
        ];
        // Type alias.
        // TODO:

        // None buffer types.
        //-------------------

        //Special.
        lTypes[WgslType.Pointer] = [{ size: -1, align: 0, generic: [WgslType.Enum, WgslType.Any, WgslType.Enum] }];
        lTypes[WgslType.Reference] = [{ size: -1, align: 0, generic: [WgslType.Enum, WgslType.Any, WgslType.Enum] }];

        // Textures.
        lTypes[WgslType.Texture1d] = [
            { size: -1, align: 0, generic: [WgslType.Integer32] },
            { size: -1, align: 0, generic: [WgslType.UnsignedInteger32] },
            { size: -1, align: 0, generic: [WgslType.Float32] }
        ];
        lTypes[WgslType.Texture2d] = [
            { size: -1, align: 0, generic: [WgslType.Integer32] },
            { size: -1, align: 0, generic: [WgslType.UnsignedInteger32] },
            { size: -1, align: 0, generic: [WgslType.Float32] }
        ];
        lTypes[WgslType.Texture2dArray] = [
            { size: -1, align: 0, generic: [WgslType.Integer32] },
            { size: -1, align: 0, generic: [WgslType.UnsignedInteger32] },
            { size: -1, align: 0, generic: [WgslType.Float32] }
        ];
        lTypes[WgslType.Texture3d] = [
            { size: -1, align: 0, generic: [WgslType.Integer32] },
            { size: -1, align: 0, generic: [WgslType.UnsignedInteger32] },
            { size: -1, align: 0, generic: [WgslType.Float32] }
        ];
        lTypes[WgslType.TextureCube] = [
            { size: -1, align: 0, generic: [WgslType.Integer32] },
            { size: -1, align: 0, generic: [WgslType.UnsignedInteger32] },
            { size: -1, align: 0, generic: [WgslType.Float32] }
        ];
        lTypes[WgslType.TextureCubeArray] = [
            { size: -1, align: 0, generic: [WgslType.Integer32] },
            { size: -1, align: 0, generic: [WgslType.UnsignedInteger32] },
            { size: -1, align: 0, generic: [WgslType.Float32] }
        ];
        lTypes[WgslType.TextureMultisampled2d] = [
            { size: -1, align: 0, generic: [WgslType.Integer32] },
            { size: -1, align: 0, generic: [WgslType.UnsignedInteger32] },
            { size: -1, align: 0, generic: [WgslType.Float32] }
        ];
        lTypes[WgslType.TextureExternal] = [{ size: -1, align: 0 }];

        // Depth texture.
        lTypes[WgslType.TextureDepth2d] = [{ size: -1, align: 0 }];
        lTypes[WgslType.TextureDepth2dArray] = [{ size: -1, align: 0 }];
        lTypes[WgslType.TextureDepthCube] = [{ size: -1, align: 0 }];
        lTypes[WgslType.TextureDepthCubeArray] = [{ size: -1, align: 0 }];
        lTypes[WgslType.TextureDepthMultisampled2d] = [{ size: -1, align: 0 }];

        // Storage textures.
        lTypes[WgslType.TextureStorage1d] = [{ size: -1, align: 0, generic: [WgslType.Enum, WgslType.Enum] }];
        lTypes[WgslType.TextureStorage2d] = [{ size: -1, align: 0, generic: [WgslType.Enum, WgslType.Enum] }];
        lTypes[WgslType.TextureStorage2dArray] = [{ size: -1, align: 0, generic: [WgslType.Enum, WgslType.Enum] }];
        lTypes[WgslType.TextureStorage3d] = [{ size: -1, align: 0, generic: [WgslType.Enum, WgslType.Enum] }];

        // Sampler.
        lTypes[WgslType.Sampler] = [{ size: -1, align: 0 }];
        lTypes[WgslType.SamplerComparison] = [{ size: -1, align: 0 }];

        return lTypes;
    })();

    private readonly mAlignment: number;
    private readonly mGenericList: Array<WgslType>;
    private readonly mGenericRawList: Array<WgslType | string>;
    private readonly mSize: number;
    private readonly mType: WgslType;

    /**
     * Alignment of type.
     */
    public get alignment(): number {
        return this.mAlignment;
    }

    /**
     * Type generics.
     */
    public get generics(): Array<WgslType> {
        return this.mGenericList;
    }

    /**
     * Type generics.
     */
    public get genericsRaw(): Array<string> {
        return this.mGenericRawList;
    }

    /**
     * Type size in byte.
     */
    public get size(): number {
        return this.mSize;
    }

    /**
     * Wgsl type.
     */
    public get type(): WgslType {
        return this.mType;
    }

    /**
     * Constructor.
     * @param pType - Simple type. Scalar, Atomic, Vector and Matrix types.
     * @param pGenerics - Generics of type.
     */
    public constructor(pName: string, pType: WgslType, pGenerics?: Array<WgslType | string>, pParent?: BufferLayout, pAccessMode?: AccessMode, pBindType?: BindType, pLocation: number | null = null) {
        super(pName, pParent, pAccessMode, pBindType, pLocation);

        // Static properties.
        this.mType = pType;
        this.mGenericRawList = pGenerics ?? [];

        // Filter enum of generic list.
        this.mGenericList = this.mGenericRawList.map(pGeneric => {
            if (!EnumUtil.enumKeyByValue(WgslType, pGeneric)) {
                return WgslType.Enum;
            }

            return <WgslType>pGeneric;
        });

        // Get type restrictions.
        const lRestrictionList: Array<WgslTypeSetting> | undefined = SimpleBufferLayout.mTypeRestrictions[pType];
        if (!lRestrictionList) {
            throw new Exception(`Type ${pType} not supported.`, this);
        }

        // Find corresponding restrictions. // TODO: Check for enum or struct or any types.
        const lRestriction: WgslTypeSetting | undefined = lRestrictionList.find((pRestriction) => {
            // Restriction has no generics.
            if (!pRestriction.generic && this.mGenericRawList.length > 0) {
                return false;
            }

            // No Generic restriction.
            if (!pRestriction.generic && this.mGenericRawList.length === 0) {
                return true;
            }

            // Validate each restriction.
            for (let lGenericIndex: number = 0; lGenericIndex < pRestriction.generic!.length; lGenericIndex++) {
                const lRestriction: WgslType = pRestriction.generic![lGenericIndex];
                if (lRestriction === WgslType.Any) {
                    continue;
                }

                const lRawGeneric: string = this.mGenericRawList[lGenericIndex];
                if (lRestriction === WgslType.Enum && lRawGeneric) {
                    continue;
                }

                if (lRestriction !== lRawGeneric) {
                    return false;
                }
            }
            return true;
        });
        if (!lRestriction) {
            throw new Exception(`No type (${pType}) restriction for generics [${pGenerics}] found.`, this);
        }

        this.mAlignment = lRestriction.align;
        this.mSize = lRestriction.size;
    }

    /**
     * Get location of path.
     * @param pPathName - Path name. Divided by dots.
     */
    public override locationOf(pPathName: Array<string>): BufferLayoutLocation {
        // Only validate name.
        if (pPathName.length !== 0) {
            throw new Exception(`Simple buffer layout has no properties.`, this);
        }

        return { size: this.size, offset: 0 };
    }
}



type WgslTypeSetting = { size: number, align: number, generic?: Array<WgslType>; };