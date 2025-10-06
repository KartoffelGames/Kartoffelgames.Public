import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslFunctionDeclaration } from '../../declaration/pgsl-function-declaration.ts';
import { PgslFileMetaInformation } from "../../pgsl-build-result.ts";
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { PgslVoidTypeDefinition } from "../../type/pgsl-void-type-definition.ts";
import { PgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from '../pgsl-expression.ts';

/**
 * PGSL syntax tree of a function call expression with optional template list.
 */
export class PgslFunctionCallExpression extends PgslExpression {
    private readonly mName: string;
    private readonly mParameterList: Array<PgslExpression>;

    /**
     * Function name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Function parameter.
     */
    public get parameter(): Array<PgslExpression> {
        return this.mParameterList;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pName: string, pParameterList: Array<PgslExpression>, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mName = pName;
        this.mParameterList = pParameterList;

        // Add data as child tree.
        this.appendChild(...this.mParameterList);
    }

    /**
     * Transpiles the expression to a string representation.
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
        return `${this.mName}(${this.mParameterList.map(param => param.transpile(pTrace)).join(', ')})`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        const lFunctionDeclaration: BasePgslSyntaxTree = pValidationTrace.getScopedValue(this.mName);

        // Should be a function declaration otherwise it cant be validated further.
        if (!(lFunctionDeclaration instanceof PgslFunctionDeclaration)) {
            pValidationTrace.pushError(`Function '${this.mName}' is not defined.`, this.meta, this);

            return {
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslVoidTypeDefinition(BasePgslSyntaxTree.emptyMeta())
            };
        }

        // TODO: Validate function parameter.

        // Check properties for constructable, host sharable, and fixed footprint characteristics
        const lFixedState: PgslValueFixedState = (() => {
            // Function needs to be fixed to count as constant.
            if (!lFunctionDeclaration.isConstant) {
                return PgslValueFixedState.Variable;
            }

            let lFixedState = PgslValueFixedState.Constant;

            // Check all parameter.
            for (const lParameter of this.mParameterList) {
                const lParameterTypeAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(lParameter);

                // Save the minimum fixed state
                if(lParameterTypeAttachment.fixedState < lFixedState) {
                    lFixedState = lParameterTypeAttachment.fixedState;
                }
            }

            return lFixedState;
        })();

        return {
            fixedState: lFixedState,
            isStorage: false,
            resolveType: lFunctionDeclaration.returnType
        };
    }
}