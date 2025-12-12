import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslFunctionTrace } from '../../../trace/pgsl-function-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import { PgslInvalidType } from '../../../type/pgsl-invalid-type.ts';
import type { BasePgslSyntaxTreeMeta } from '../../abstract-syntax-tree.ts';
import { ExpressionAst } from '../pgsl-expression.ts';

/**
 * PGSL syntax tree of a function call expression with optional template list.
 */
export class PgslFunctionCallExpression extends ExpressionAst {
    private readonly mName: string;
    private readonly mParameterList: Array<ExpressionAst>;

    /**
     * Function name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Function parameter.
     */
    public get parameter(): Array<ExpressionAst> {
        return this.mParameterList;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pName: string, pParameterList: Array<ExpressionAst>, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mName = pName;
        this.mParameterList = pParameterList;

        // Add data as child tree.
        this.appendChild(...this.mParameterList);
    }

    /**
     * Validate data of current structure.
     */
    protected override onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace {
        const lFunctionDeclaration: PgslFunctionTrace | undefined = pTrace.getFunction(this.mName);

        // Should be a function declaration otherwise it cant be validated further.
        if (!lFunctionDeclaration) {
            pTrace.pushIncident(`Function '${this.mName}' is not defined.`, this);

            return new PgslExpressionTrace({
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslInvalidType(pTrace),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Inherit
            });
        }

        // Validate function parameter.
        for (let lParameterIndex = 0; lParameterIndex < this.mParameterList.length; lParameterIndex++) {
            const lParameterExpression: ExpressionAst = this.mParameterList[lParameterIndex];
            const lParameterExpressionTrace: PgslExpressionTrace = pTrace.getExpression(lParameterExpression);
            const lFunctionParameterDeclaration = lFunctionDeclaration.parameters[lParameterIndex];

            // Validate parameter expression.
            if (!lParameterExpressionTrace) {
                pTrace.pushIncident(`Parameter ${lParameterIndex} of function '${this.mName}' is not defined.`, this);
                continue;
            }

            // Check if parameter type matches function declaration.
            if (!lParameterExpressionTrace.resolveType.isImplicitCastableInto(lFunctionParameterDeclaration.type)) {
                pTrace.pushIncident(`Parameter ${lParameterIndex} of function '${this.mName}' has invalid type.`, this);
            }
        }

        // Check properties for constructable, host sharable, and fixed footprint characteristics
        const lFixedState: PgslValueFixedState = (() => {
            // Function needs to be fixed to count as constant.
            if (!lFunctionDeclaration.isConstant) {
                return PgslValueFixedState.Variable;
            }

            let lFixedState = PgslValueFixedState.Constant;

            // Check all parameter.
            for (const lParameter of this.mParameterList) {
                const lParameterExpressionTrace: PgslExpressionTrace = pTrace.getExpression(lParameter);

                // Save the minimum fixed state
                if (lParameterExpressionTrace.fixedState < lFixedState) {
                    lFixedState = lParameterExpressionTrace.fixedState;
                }
            }

            return lFixedState;
        })();

        return new PgslExpressionTrace({
            fixedState: lFixedState,
            isStorage: false,
            resolveType: lFunctionDeclaration.returnType,
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        });
    }
}