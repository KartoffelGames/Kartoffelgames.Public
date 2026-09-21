import type { TypeCst } from '../../concrete_syntax_tree/general.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { BaseType, TypeProperties } from './base-type.ts';

/**
 * Boolean type definition.
 * Represents a boolean value that can be either true or false.
 */
export class PgslBooleanType extends AbstractSyntaxTree<TypeCst, TypeProperties> implements BaseType {
    /**
     * Type names for boolean types.
     * Maps boolean type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            boolean: 'bool'
        } as const;
    }

    private readonly mShadowedType: BaseType;

    /**
     * The type that is being shadowed.
     * If it does not shadow another type, it is itself.
     */
    public get shadowedType(): BaseType {
        return this.mShadowedType;
    }

    /**
     * Constructor for boolean type.
     * 
     * @param pShadowedType - Type that is the actual type of this.
     */
    public constructor(pShadowedType?: BaseType) {
        super({ type: 'Type', range: [0, 0, 0, 0] });

        this.mShadowedType = pShadowedType ?? this;
    }

    /**
     * Check if type is equal to target type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns true when both types describes the same type.
     */
    public equals(pTarget: BaseType): boolean {
        // Boolean type is only equal to other boolean types.
        return pTarget instanceof PgslBooleanType;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns true when type is implicit castable into target type.
     */
    public isCastableInto(pTarget: BaseType): boolean {
        // A boolean is never explicit nor implicit castable.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for boolean type.
     * 
     * @param _pContext - Context.
     * 
     * @returns Type properties for boolean type.
     */
    protected override onProcess(_pContext: AbstractSyntaxTreeContext): TypeProperties {
        return {
            metaTypes: [PgslBooleanType.typeName.boolean],
            storable: true,
            hostShareable: false,
            composite: false,
            constructible: true,
            fixedFootprint: true,
            indexable: false,
            concrete: true,
            scalar: true,
            plain: true
        };
    }
}