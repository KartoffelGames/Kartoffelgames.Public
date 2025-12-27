import type { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import type { PgslValueFixedState } from '../../enum/pgsl-value-fixed-state.ts';
import type { PgslType } from '../type/pgsl-type.ts';
import type { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';

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
    resolveType: PgslType;
    constantValue: number | string | null;
    storageAddressSpace: PgslValueAddressSpace;
};