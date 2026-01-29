import type { TypeCst } from '../../concrete_syntax_tree/general.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { IType, TypeProperties } from './i-type.interface.ts';

/**
 * Void type definition.
 * Represents the absence of a value, typically used as function return type.
 */
export class PgslVoidType extends AbstractSyntaxTree<TypeCst, TypeProperties> implements IType {
    /**
     * Type names for void types.
     * Maps void type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            void: 'void'
        } as const;
    }

    private readonly mShadowedType: IType;

    /**
     * The type that is being shadowed.
     * If it does not shadow another type, it is itself.
     */
    public get shadowedType(): IType {
        return this.mShadowedType;
    } 

    /**
     * Constructor for void type.
     * 
     * @param pShadowedType - Type that is the actual type of this.
     */
    public constructor(pShadowedType?: IType) {
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
    public equals(pTarget: IType): boolean {
        // Void type is only equal to other void types.
        return pTarget instanceof PgslVoidType;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     * 
     * @returns true when type is explicit castable into target type.
     */
    public isExplicitCastableInto(_pTarget: IType): boolean {
        // A void is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns true when type is implicit castable into target type.
     */
    public isImplicitCastableInto(pTarget: IType): boolean {
        // A void is never explicit nor implicit castable.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for void type.
     * 
     * @param _pContext - Context.
     * 
     * @returns Type properties for void type.
     */
    protected override onProcess(_pContext: AbstractSyntaxTreeContext): TypeProperties {
        return {
            metaTypes: [PgslVoidType.typeName.void],
            storable: false,
            hostShareable: false,
            composite: false,
            constructible: false,
            fixedFootprint: false,
            indexable: false,
            concrete: false,
            scalar: false,
            plain: false
        };
    }
}