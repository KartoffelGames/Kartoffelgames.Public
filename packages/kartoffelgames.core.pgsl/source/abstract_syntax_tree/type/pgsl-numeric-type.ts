import type { TypeCst } from '../../concrete_syntax_tree/general.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { IType, TypeProperties } from './i-type.interface.ts';

/**
 * Numeric type definition.
 * Represents all numeric types in PGSL including integers, floats, and abstract numeric types.
 * Handles type casting rules between different numeric types.
 */
export class PgslNumericType extends AbstractSyntaxTree<TypeCst, TypeProperties> implements IType {
    /**
     * Type names for all available numeric types.
     * Maps numeric type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            signedInteger: 'int',
            unsignedInteger: 'uint',
            float16: 'float16',
            float32: 'float',
            abstractFloat: '*AbstractFloat*', // Should never be written
            abstractInteger: '*AbstractInteger*' // Should never be written
        } as const;
    }

    private readonly mNumericType: PgslNumericTypeName;
    private readonly mShadowedType: IType;

    /**
     * Gets the specific numeric type variant.
     * 
     * @returns The numeric type name.
     */
    public get numericTypeName(): PgslNumericTypeName {
        return this.mNumericType;
    }

    /**
     * The type that is being shadowed.
     * If it does not shadow another type, it is itself.
     */
    public get shadowedType(): IType {
        return this.mShadowedType;
    }

    /**
     * Constructor for numeric type.
     * 
     * @param pNumericType - The specific numeric type variant.
     * @param pShadowedType - Type that is the actual type of this.
     */
    public constructor(pNumericType: PgslNumericTypeName, pShadowedType?: IType) {
        super({ type: 'Type', range: [0, 0, 0, 0] });

        // Set data.
        this.mShadowedType = pShadowedType ?? this;
        this.mNumericType = pNumericType;
    }

    /**
     * Compare this numeric type with a target type for equality.
     * Two numeric types are equal if they have the same numeric type variant.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same numeric type.
     */
    public equals(pTarget: IType): boolean {
        // Must both be the same numeric type.
        if (!(pTarget instanceof PgslNumericType)) {
            return false;
        }

        // Must have the same numeric type.
        return this.mNumericType === pTarget.numericTypeName;
    }

    /**
     * Check if this numeric type is explicitly castable into the target type.
     * All numeric types can be explicitly cast to any other numeric type.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns True if target is a numeric type, false otherwise.
     */
    public isExplicitCastableInto(pTarget: IType): boolean {
        // All numeric values are explicit castable into another numeric type.
        return pTarget instanceof PgslNumericType;
    }

    /**
     * Check if this numeric type is implicitly castable into the target type.
     * Implements PGSL's implicit casting rules for numeric types.
     * Abstract types have special casting rules.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns True when implicit casting is allowed, false otherwise.
     */
    public isImplicitCastableInto(pTarget: IType): boolean {
        // Target type must be a numeric type.
        if (!(pTarget instanceof PgslNumericType)) {
            return false;
        }

        switch (this.mNumericType) {
            // An abstract integer is castable into all numeric types.
            case PgslNumericType.typeName.abstractInteger: {
                return true;
            }

            // An abstract float is only castable into float types.
            case PgslNumericType.typeName.abstractFloat: {
                // List of all float types.
                const lFloatTypes: Array<PgslNumericTypeName> = [
                    PgslNumericType.typeName.abstractFloat,
                    PgslNumericType.typeName.float32,
                    PgslNumericType.typeName.float16
                ];

                // Check if target type is a float type.
                if (lFloatTypes.includes(pTarget.numericTypeName)) {
                    return true;
                }
            }
        }

        // Any other non-abstract numeric type is only castable when they are the same type.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for numeric types.
     * Numeric types are scalar, storable, and mostly host-shareable.
     * Abstract types are not concrete.
     * 
     * @param _pContext - Context (unused for numeric types).
     * 
     * @returns Type properties for numeric types.
     */
    protected override onProcess(_pContext: AbstractSyntaxTreeContext): TypeProperties {
        // A concrete numeric type is any type that is not abstract.
        const lIsConcrete: boolean = this.mNumericType !== PgslNumericType.typeName.abstractFloat && this.mNumericType !== PgslNumericType.typeName.abstractInteger;

        // Build meta types.
        const lMetaTypeList: Array<string> = new Array<string>();
        switch (this.mNumericType) {
            case PgslNumericType.typeName.signedInteger: {
                lMetaTypeList.push(PgslNumericType.typeName.signedInteger);
                lMetaTypeList.push('numeric-integer');
                lMetaTypeList.push('numeric');
            }
            case PgslNumericType.typeName.unsignedInteger: {
                lMetaTypeList.push(PgslNumericType.typeName.unsignedInteger);
                lMetaTypeList.push('numeric-integer');
                lMetaTypeList.push('numeric');
            }
            case PgslNumericType.typeName.abstractInteger: {
                lMetaTypeList.push('numeric-integer');
                lMetaTypeList.push('numeric');
            }
            case PgslNumericType.typeName.float32: {
                lMetaTypeList.push(PgslNumericType.typeName.float32);
                lMetaTypeList.push('numeric-float');
                lMetaTypeList.push('numeric');
            }
            case PgslNumericType.typeName.float16: {
                lMetaTypeList.push(PgslNumericType.typeName.float16);
                lMetaTypeList.push('numeric-float');
                lMetaTypeList.push('numeric');
            }
            case PgslNumericType.typeName.abstractFloat: {
                lMetaTypeList.push('numeric-float');
                lMetaTypeList.push('numeric');
            }
        }

        return {
            // Meta information.
            metaTypes: lMetaTypeList,

            // Dynamic properties.
            concrete: lIsConcrete,

            storable: true,
            hostShareable: true,
            composite: false,
            constructible: true,
            fixedFootprint: true,
            indexable: false,
            scalar: true,
            plain: true,
        };
    }
}

/**
 * Type representing all available numeric type names.
 * Derived from the static typeName getter for type safety.
 */
export type PgslNumericTypeName = (typeof PgslNumericType.typeName)[keyof typeof PgslNumericType.typeName];