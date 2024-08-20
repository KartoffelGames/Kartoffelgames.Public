import { PgslSyntaxTreeInitData } from '../../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';

/**
 * Base single value expression syntax tree.
 */
export abstract class BasePgslSingleValueExpressionSyntaxTree<TData extends PgslSyntaxTreeInitData = PgslSyntaxTreeInitData> extends BasePgslExpressionSyntaxTree<TData> {

}