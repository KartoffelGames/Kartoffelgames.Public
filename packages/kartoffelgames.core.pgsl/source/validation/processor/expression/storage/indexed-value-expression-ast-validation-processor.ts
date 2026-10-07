import { IndexedValueExpressionAst, type IndexedValueExpressionAstData } from '../../../../abstract_syntax_tree/expression/storage/indexed-value-expression-ast.ts';
import { BasePgslTypeKind } from '../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of IndexedValueExpressionAst.
 */
export class IndexedValueExpressionAstValidationProcessor extends PgslValidatorProcessor<IndexedValueExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof IndexedValueExpressionAst {
        return IndexedValueExpressionAst;
    }

    /**
     * Validates the PGSL indexed value expression syntax tree.
     * 
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: IndexedValueExpressionAstData): void {
        // Validate the value and index expression.
        this.validateAst(pData.value);
        this.validateAst(pData.index);

        // Value needs to be indexable.
        if (!pData.value.data.resolveType.isKind(BasePgslTypeKind.Indexable)) {
            this.pushIncident('Value of index expression needs to be a indexable composite value.', pData.value);
        }

        // Value needs to be a integer value.
        if (!pData.index.data.resolveType.isKind(BasePgslTypeKind.Integer)) {
            this.pushIncident('Index needs to be a integer value.', pData.index);
        }

        // When the index is a constant value we can validate that too.
        if (typeof pData.index.data.constantValue === 'number') {
            // Index cannot be negative constant.
            if (pData.index.data.constantValue < 0) {
                this.pushIncident('Index needs to be a non negative integer value.', pData.index);
            }

            // Index must be inside bounds.
            if (pData.fixedLength !== -1 && pData.index.data.constantValue >= pData.fixedLength) {
                this.pushIncident('Index out of bounds.', pData.index);
            }
        }
    }
}
