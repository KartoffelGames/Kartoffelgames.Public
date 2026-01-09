import type { TypeCst } from '../../concrete_syntax_tree/general.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { IType, TypeProperties } from './i-type.interface.ts';

/**
 * String type definition.
 * Represents a string value used for text data.
 */
export class PgslStringType extends AbstractSyntaxTree<TypeCst, TypeProperties> implements IType {
    /**
     * Type names for string types.
     * Maps string type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            string: 'string'
        } as const;
    }

    /**
     * Constructor for string type.
     */
    public constructor() {
        super({ type: 'Type', range: [0, 0, 0, 0] });
    }

    /**
     * Check if type is equal to target type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns true when both types describes the same type.
     */
    public equals(pTarget: IType): boolean {
        // String type is only equal to other string types.
        return pTarget instanceof PgslStringType;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     * 
     * @returns true when type is explicit castable into target type.
     */
    public isExplicitCastableInto(_pTarget: IType): boolean {
        // A string is never explicit nor implicit castable.
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
        // A string is never explicit nor implicit castable.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for string type.
     * 
     * @param _pContext - Context.
     * 
     * @returns Type properties for string type.
     */
    protected override onProcess(_pContext: AbstractSyntaxTreeContext): TypeProperties {
        return {
            metaTypes: [PgslStringType.typeName.string],
            storable: false,
            hostShareable: false,
            composite: false,
            constructible: false,
            fixedFootprint: false,
            indexable: false,
            concrete: true,
            scalar: false,
            plain: false
        };
    }
}