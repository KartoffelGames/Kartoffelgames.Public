import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { PgslExpression } from '../expression/pgsl-expression.ts';
import { PgslFunctionCallExpression } from '../expression/single_value/pgsl-function-call-expression.ts';
import { PgslFileMetaInformation } from "../pgsl-build-result.ts";
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslStatement } from './base-pgsl-statement.ts';

/**
 * PGSL syntax tree of a function call statement with optional template list.
 */
export class PgslFunctionCallStatement extends BasePgslStatement {
    private readonly mFunctionExpression: PgslFunctionCallExpression;

    /**
     * Function expression of statement.
     */
    public get functionExpression(): PgslFunctionCallExpression {
        return this.mFunctionExpression;
    }

    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     * @param pName - Function name.
     * @param pParameterList - Function parameters.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pName: string, pParameterList: Array<PgslExpression>) {
        super(pMeta);

        // Create and validate expression instead.
        this.mFunctionExpression = new PgslFunctionCallExpression(pName, pParameterList, pMeta);

        // Add function expression as child.
        this.appendChild(this.mFunctionExpression);
    }

    /**
     * Transpiles the statement to a string representation.
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
        return this.mFunctionExpression.transpile(pTrace) + ';';
    }

    /**
     * Validate data of current structure.
     * 
     * @param pValidationTrace - Validation trace.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): void {
        this.mFunctionExpression.validate(pValidationTrace);
    }
}