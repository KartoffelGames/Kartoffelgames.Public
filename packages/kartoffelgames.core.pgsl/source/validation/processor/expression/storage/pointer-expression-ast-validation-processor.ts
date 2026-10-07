import { PointerExpressionAst, type PointerExpressionAstData } from '../../../../abstract_syntax_tree/expression/storage/pointer-expression-ast.ts';
import { BasePgslTypeKind } from '../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of PointerExpressionAst.
 */
export class PointerExpressionAstValidationProcessor extends PgslValidatorProcessor<PointerExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PointerExpressionAst {
        return PointerExpressionAst;
    }

    /**
     * Validates the PGSL pointer expression syntax tree.
     * 
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: PointerExpressionAstData): void {
        // Validate pointers inner expression.
        this.validateAst(pData.expression);

        // Value needs to be a pointer.
        if (!pData.expression.data.resolveType.isKind(BasePgslTypeKind.Pointer)) {
            this.pushIncident('Pointer of expression needs to be a pointer type.', pData.expression);
        }
    }
}
