import { PgslValueFixedState } from "../../../enum/pgsl-value-fixed-state.ts";
import type { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslFunctionDeclarationSyntaxTree } from '../../declaration/pgsl-function-declaration-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { PgslVoidTypeDefinitionSyntaxTree } from "../../type/pgsl-void-type-definition-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from '../base-pgsl-expression-syntax-tree.ts';

/**
 * PGSL syntax tree of a function call expression with optional template list.
 */
export class PgslFunctionCallExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
    private readonly mName: string;
    private readonly mParameterList: Array<BasePgslExpressionSyntaxTree>;

    /**
     * Function name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Function parameter.
     */
    public get parameter(): Array<BasePgslExpressionSyntaxTree> {
        return this.mParameterList;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pName: string, pParameterList: Array<BasePgslExpressionSyntaxTree>, pMeta: BasePgslSyntaxTreeMeta) {
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
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        return `${this.mName}(${this.mParameterList.map(param => param.transpile()).join(', ')})`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): PgslExpressionSyntaxTreeValidationAttachment {
        const lFunctionDeclaration: BasePgslSyntaxTree = pValidationTrace.getScopedValue(this.mName);

        // Should be a function declaration otherwise it cant be validated further.
        if (!(lFunctionDeclaration instanceof PgslFunctionDeclarationSyntaxTree)) {
            pValidationTrace.pushError(`Function '${this.mName}' is not defined.`, this.meta, this);

            return {
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslVoidTypeDefinitionSyntaxTree({range: [0,0,0,0]})
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