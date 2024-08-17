import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../base-pgsl-syntax-tree';

export abstract class PgslExpressionSyntaxTree<TType extends AvailableExpressionTypes, TData extends object> extends BasePgslSyntaxTree<TType, TData> {


}

type AvailableExpressionTypes = 'Expression-LiteralValue';

export type PgslExpressionyntaxTreeStructureData<TDataType extends AvailableExpressionTypes, TData extends object> = PgslSyntaxTreeDataStructure<TDataType, TData>;