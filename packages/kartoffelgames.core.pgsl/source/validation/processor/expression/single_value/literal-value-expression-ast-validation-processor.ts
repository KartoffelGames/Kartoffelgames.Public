import { LiteralValueExpressionAst, type LiteralValueExpressionAstData, LiteralValueExpressionAstRepresentationType } from '../../../../abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts';
import { BasePgslTypeKind } from '../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of LiteralValueExpressionAst.
 */
export class LiteralValueExpressionAstValidationProcessor extends PgslValidatorProcessor<LiteralValueExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof LiteralValueExpressionAst {
        return LiteralValueExpressionAst;
    }

    /**
     * Validates the PGSL literal value expression syntax tree.
     * 
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: LiteralValueExpressionAstData): void {
        // Validate that the literal text is a boolean, integer or float literal.
        if (pData.resolveType.isKind(BasePgslTypeKind.Invalid)) {
            this.pushIncident(`No matching Type for literal "${pData.textValue}".`);
        }

        // Literals always have a numeric constant value. It is never negative, as a minus is an unary expression.
        const lValue: number | string | null = pData.constantValue;
        if (typeof lValue !== 'number') {
            return;
        }

        // Validate that the value fits into the type of the literal.
        const lValueFits: boolean = (() => {
            switch (true) {
                // An integer literal with i or u suffix must fit into int or uint.
                case pData.resolveType.isKind(BasePgslTypeKind.SignedInteger): return lValue <= Math.pow(2, 31) - 1;
                case pData.resolveType.isKind(BasePgslTypeKind.UnsignedInteger): return lValue <= Math.pow(2, 32) - 1;

                // An integer literal without suffix must fit into a 64-bit signed integer.
                case pData.resolveType.isKind(BasePgslTypeKind.Integer): return lValue < Math.pow(2, 63);

                // A float literal with f or h suffix must not overflow float or float16.
                case pData.resolveType.isKind(BasePgslTypeKind.Float32): return lValue <= Math.pow(2, 128) - Math.pow(2, 104);
                case pData.resolveType.isKind(BasePgslTypeKind.Float16): return lValue <= Math.pow(2, 16) - Math.pow(2, 5);

                // A float literal without suffix must be finite as a 64-bit float.
                case pData.resolveType.isKind(BasePgslTypeKind.Float): return Number.isFinite(lValue);
            }

            // Boolean literals always fit.
            return true;
        })();
        if (!lValueFits) {
            this.pushIncident(`Literal "${pData.textValue}" does not fit into '${pData.resolveType.meta.typeName}'.`);
            return;
        }

        // Validate that a hexadecimal float literal with f or h suffix is exactly representable in float or float16, as WGSL does not round it.
        const lValueIsExact: boolean = (() => {
            // Only hexadecimal literals must be exact.
            if (pData.representationType !== LiteralValueExpressionAstRepresentationType.Hexadecimal) {
                return true;
            }

            // An exactly representable value does not change when rounded to float.
            if (pData.resolveType.isKind(BasePgslTypeKind.Float32)) {
                return Math.fround(lValue) === lValue;
            }

            // A float16 has eleven significant bits and gets subnormal below an exponent of -14.
            if (pData.resolveType.isKind(BasePgslTypeKind.Float16)) {
                // No idear what that is, just copied it.
                const lExponent: number = Math.max(Math.floor(Math.log2(lValue)), -14);
                return Number.isInteger(lValue * Math.pow(2, 10 - lExponent));
            }

            // Integer literals are always exact.
            return true;
        })();
        if (!lValueIsExact) {
            this.pushIncident(`Hexadecimal literal "${pData.textValue}" is not exactly representable in '${pData.resolveType.meta.typeName}'.`);
        }
    }
}
