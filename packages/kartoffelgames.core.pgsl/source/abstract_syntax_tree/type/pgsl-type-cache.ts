import type { BasePgslType } from './definition/base-pgsl-type.ts';

/**
 * PGSL type cache. Create a single instance for every type variant.
 */
export class PgslTypeCache {
    private readonly mTypes: Map<string, BasePgslType> = new Map<string, BasePgslType>();

    /**
     * Create a pgsl type. If its already used somewhere else, a cached instance is returned.
     *
     * @param pType - Type constructor.
     * @param pParameter - Type construction parameter.
     *
     * @returns a new or a cached type.
     */
    public create<TType extends BasePgslType, TParameter extends Array<unknown>>(pType: PgslTypeCachePgslTypeConstructor<TType, TParameter>, ...pParameter: TParameter): TType {
        // Create types identifier.
        const lIdentifier: string = pType.identifierOf(...pParameter);

        // Use the cached type if the identifier is already registered.
        if (this.mTypes.has(lIdentifier)) {
            return this.mTypes.get(lIdentifier) as TType;
        }

        // Create and cache new type.
        const lType: TType = new pType(...pParameter);
        this.mTypes.set(lIdentifier, lType);

        return lType;
    }
}

/**
 * Type-Constructor mainly used to extract both constructor and identifierOf parameters.
 */
type PgslTypeCachePgslTypeConstructor<TType extends BasePgslType, TParameter extends Array<unknown>> = {
    new(...pParameter: TParameter): TType;
    identifierOf(...pParameter: TParameter): string;
};
