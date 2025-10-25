import { Exception } from "../../../kartoffelgames.core/source/exception/exception.ts";
import { PgslInterpolateSampling } from "../syntax_tree/buildin/pgsl-interpolate-sampling.enum.ts";
import { PgslInterpolateType } from "../syntax_tree/buildin/pgsl-interpolate-type.enum.ts";
import { PgslType } from "../type/pgsl-type.ts";

/**
 * Trace information for PGSL struct property declarations.
 * Tracks property types, metadata, and usage contexts within structs.
 */
export class PgslStructPropertyTrace {
    private readonly mName: string;
    private readonly mType: PgslType;
    private readonly mMeta: PgslStructTracePropertyMeta;

    /**
     * Gets the name of the property.
     * 
     * @returns The property name as declared in source code.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Gets the type of the property.
     * 
     * @returns The PGSL type of the property.
     */
    public get type(): PgslType {
        return this.mType;
    }

    /**
     * Gets the metadata information for the property.
     * 
     * @returns The metadata containing alignment, locations, and other configuration.
     */
    public get meta(): Readonly<PgslStructTracePropertyMeta> {
        return this.mMeta;
    }

    /**
     * Creates a new struct property trace.
     * 
     * @param pConstructorData - The data needed to construct the property trace.
     */
    public constructor(pConstructorData: PgslStructPropertyTraceConstructorParameter) {
        this.mName = pConstructorData.name;
        this.mType = pConstructorData.type;

        // Set up meta.
        this.mMeta = {
            ...pConstructorData.meta,
            locationIndex: -1
        };
    }

    /**
     * Set resolved location index for the property.
     * 
     * @param pIndex - Resolved location index.
     */
    public resolveLocationIndex(pIndex: number): void {
        if (!this.mMeta.locationName) {
            throw new Exception(`Property '${this.mName}' has no location name to resolve.`, this);
        }

        if (this.mMeta.locationIndex !== -1) {
            throw new Exception(`Location index for property '${this.mName}' is already resolved.`, this);
        }

        this.mMeta.locationIndex = pIndex;
    }
}

/**
 * Constructor type for creating PgslStructPropertyTrace instances.
 * Contains all the data needed to initialize a property trace.
 */
export type PgslStructPropertyTraceConstructorParameter = {
    /**
     * The name of the property
     */
    name: string;

    /**
     * The type of the property
     */
    type: PgslType;

    /**
     * Metadata for the property
     */
    meta: {
        /**
         * Memory alignment requirement in bytes
         */
        alignment?: number;

        /**
         * Size of the property in bytes
         */
        size?: number;

        /**
         * Location name for vertex to fragment or texture location data
         */
        locationName?: string;

        /**
         * Interpolation mode for vertex to fragment data
         */
        interpolation?: {
            type: PgslInterpolateType,
            sampling: PgslInterpolateSampling,
        };

        /**
         * Blend source configuration
         */
        blendSrc?: number;
    };
};

/**
 * Metadata information for struct properties.
 */
export type PgslStructTracePropertyMeta = {
    /**
     * Memory alignment requirement in bytes
     */
    alignment?: number;

    /**
     * Size of the property in bytes
     */
    size?: number;

    /**
     * Location name for vertex to fragment or texture location data
     */
    locationName?: string;

    /**
     * Location index for vertex to fragment or texture location data
     */
    locationIndex: number;

    /**
     * Interpolation mode for vertex to fragment data
     */
    interpolation?: {
        readonly type: PgslInterpolateType,
        readonly sampling: PgslInterpolateSampling,
    };

    /**
     * Blend source configuration
     */
    blendSrc?: number;
};