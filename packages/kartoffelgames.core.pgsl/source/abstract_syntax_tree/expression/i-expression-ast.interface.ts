import type { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import type { PgslValueFixedState } from '../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { IType } from '../type/i-type.interface.ts';

/**
 * PGSL base expression.
 */
export interface IExpressionAst extends AbstractSyntaxTree {
    /**
     * Expression data.
     */
    readonly data: ExpressionAstData;
}

export type ExpressionAstData = {
    fixedState: PgslValueFixedState;
    isStorage: boolean;
    resolveType: IType;
    constantValue: number | string | null;
    storageAddressSpace: PgslValueAddressSpace;
};