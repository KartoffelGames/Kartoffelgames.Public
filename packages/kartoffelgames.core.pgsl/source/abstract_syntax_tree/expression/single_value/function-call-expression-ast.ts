import type { FunctionCallExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import { PgslInvalidType } from '../../../type/pgsl-invalid-type.ts';
import { PgslType } from "../../../type/pgsl-type.ts";
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration, FunctionDeclarationAstDataParameter } from "../../declaration/function-declaration-ast.ts";
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL syntax tree of a function call expression with optional template list.
 */
export class FunctionCallExpressionAst extends AbstractSyntaxTree<FunctionCallExpressionCst, FunctionCallExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): FunctionCallExpressionAstData {
        const lFunctionDeclaration: FunctionDeclarationAst | undefined = pContext.getFunction(this.cst.functionName);

        // Should be a function declaration otherwise it cant be validated further.
        if (!lFunctionDeclaration) {
            pContext.pushIncident(`Function '${this.cst.functionName}' is not defined.`, this);

            return {
                // Expression data.
                name: this.cst.functionName,
                parameters: new Array<IExpressionAst>(),

                // Expression meta data.
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslInvalidType().process(pContext),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Inherit
            };
        }

        // Build parameter expressions.
        const lParameterList: Array<IExpressionAst> = this.cst.parameterList.map((pParameterCst) => {
            return ExpressionAstBuilder.build(pParameterCst, pContext);
        });

        // Check properties for constructable, host sharable, and fixed footprint characteristics
        const lFixedState: PgslValueFixedState = (() => {
            // Function needs to be fixed to count as constant.
            if (!lFunctionDeclaration.data.isConstant) {
                return PgslValueFixedState.Variable;
            }

            let lFixedState = PgslValueFixedState.Constant;

            // Check all parameter.
            for (const lParameter of lParameterList) {
                // Save the minimum fixed state
                if (lParameter.data.fixedState < lFixedState) {
                    lFixedState = lParameter.data.fixedState;
                }
            }

            return lFixedState;
        })();

        // Find a matching function header.
        const lFunctionHeader: FunctionDeclarationAstDataDeclaration | null = this.matchFunctionHeader(pContext, lFunctionDeclaration, lParameterList);
        if (!lFunctionHeader) {
            pContext.pushIncident(`No matching function header found for function '${this.cst.functionName}'.`, this);
        }

        // Get the return type from the matched function header.
        const lReturnType: PgslType = lFunctionHeader?.returnType?.data.type ?? new PgslInvalidType().process(pContext);

        return {
            // Expression data.
            name: this.cst.functionName,
            parameters: lParameterList,

            // Expression meta data.
            fixedState: lFixedState,
            isStorage: false,
            resolveType: lReturnType,
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        };
    }

    private matchFunctionHeader(pContext: AbstractSyntaxTreeContext, pFunctionDeclaration: FunctionDeclarationAst, pParameterList: Array<IExpressionAst>): FunctionDeclarationAstDataDeclaration | null {
        // Check each function header for a match.
        FUNCTION_HEADER_LOOP: for (const lFunctionHeader of pFunctionDeclaration.data.declarations) {
            // Parameter count needs to match.
            if (lFunctionHeader.parameter.length !== pParameterList.length) {
                continue;
            }

            // Validate function parameter.
            for (let lParameterIndex = 0; lParameterIndex < pParameterList.length; lParameterIndex++) {
                const lParameterExpression: IExpressionAst = pParameterList[lParameterIndex];
                const lFunctionParameterDeclaration: FunctionDeclarationAstDataParameter | undefined = lFunctionHeader.parameter[lParameterIndex];

                // Validate parameter expression.
                if (!lFunctionParameterDeclaration) {
                    pContext.pushIncident(`Parameter ${lParameterIndex} of function '${this.cst.functionName}' is not defined.`, this);
                    continue FUNCTION_HEADER_LOOP;
                }

                // Get function parameter type. When it is null, it meant to be a generic type.
                const lFunctionParameterType: PgslType | null = lFunctionParameterDeclaration.type?.data.type ?? null;
                if(!lFunctionParameterType) {
                    continue FUNCTION_HEADER_LOOP; // TODO: Handle generic types.
                }

                // Check if parameter type matches function declaration.
                if (!lParameterExpression.data.resolveType.isImplicitCastableInto(lFunctionParameterType)) {
                    pContext.pushIncident(`Parameter ${lParameterIndex} of function '${this.cst.functionName}' has invalid type.`, this);
                }
            }

            return lFunctionHeader;
        }

        return null;
    }
}

export type FunctionCallExpressionAstData = {
    name: string;
    parameters: Array<IExpressionAst>;
} & ExpressionAstData;