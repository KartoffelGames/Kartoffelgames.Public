import type { FunctionCallExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import { PgslInvalidType } from '../../../type/pgsl-invalid-type.ts';
import { PgslType } from "../../../type/pgsl-type.ts";
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration, FunctionDeclarationAstDataParameter } from "../../declaration/function-declaration-ast.ts";
import { TypeDeclarationAst } from "../../general/type-declaration-ast.ts";
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

        // Convert function call generic parameters.
        const lGenericParameterList: Array<PgslType> = this.cst.genericList.map((pGenericTypeDeclarationCst) => {
            return new TypeDeclarationAst(pGenericTypeDeclarationCst).process(pContext).data.type;
        });

        // Find a matching function header.
        const lFunctionHeaderReturnType: PgslType | null = this.matchFunctionHeaderReturnType(pContext, lFunctionDeclaration, lGenericParameterList, lParameterList);
        if (!lFunctionHeaderReturnType) {
            pContext.pushIncident(`No matching function header found for function '${this.cst.functionName}'.`, this);
        }

        // Get the return type from the matched function header.
        const lReturnType: PgslType = lFunctionHeaderReturnType ? lFunctionHeaderReturnType : new PgslInvalidType().process(pContext);

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

    private matchFunctionHeaderReturnType(pContext: AbstractSyntaxTreeContext, pFunctionDeclaration: FunctionDeclarationAst, pGenericList: Array<PgslType>, pParameterList: Array<IExpressionAst>): PgslType | null {
        // Check each function header for a match.
        FUNCTION_HEADER_LOOP: for (const lFunctionHeader of pFunctionDeclaration.data.declarations) {
            // Parameter count needs to match.
            if (lFunctionHeader.parameter.length !== pParameterList.length) {
                continue;
            }

            // When any generic is provided, the generics cant be inferred so their count needs to match.
            if (pGenericList.length > 0 && lFunctionHeader.generics.length !== pGenericList.length) {
                continue;
            }

            // Map of infered generic types and map any known types to them.
            const lInferedGenericTypes: Map<number, PgslType> = new Map<number, PgslType>();
            for (let lGenericIndex = 0; lGenericIndex < pGenericList.length; lGenericIndex++) {
                lInferedGenericTypes.set(lGenericIndex, pGenericList[lGenericIndex]);
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

                // Get valid types for the function parameter.
                const lFunctionParameterDeclarationValidTypes: Array<PgslType> = (() => {
                    // When the parameter is not generic, return its type as the only valid type.
                    if (typeof lFunctionParameterDeclaration.type !== 'number') {
                        return [lFunctionParameterDeclaration.type.data.type];
                    }

                    const lGenericIndex: number = lFunctionParameterDeclaration.type;

                    // When a generic type is provided, use that as the valid type.
                    if (lInferedGenericTypes.has(lGenericIndex)) {
                        return [lInferedGenericTypes.get(lGenericIndex)!];
                    }

                    // Validate generic index bounds.
                    if (lGenericIndex < 0 || lGenericIndex >= lFunctionHeader.generics.length) {
                        pContext.pushIncident(`Generic index ${lGenericIndex} of function '${this.cst.functionName}' is out of bounds.`, this);
                        return [];
                    }

                    // Read valid types from function header definition.
                    return lFunctionHeader.generics[lGenericIndex];;
                })();

                // Get function parameter type. When it is null, it meant to be a generic type.
                const lFunctionParameterType: PgslType = lParameterExpression.data.resolveType;

                // Check if parameter type matches any of the valid types.
                const lMatchesValidType: boolean = (() => {
                    for (const lValidType of lFunctionParameterDeclarationValidTypes) {
                        if (lFunctionParameterType.isImplicitCastableInto(lValidType)) {
                            return true;
                        }
                    }

                    return false;
                })();

                // Parameter type does not match any valid type. Continue to next function header.
                if (!lMatchesValidType) {
                    continue FUNCTION_HEADER_LOOP;
                }

                // Save infered generic type when parameter is generic.
                if (typeof lFunctionParameterDeclaration.type === 'number') {
                    const lGenericIndex: number = lFunctionParameterDeclaration.type;
                    lInferedGenericTypes.set(lGenericIndex, lFunctionParameterType);
                }
            }

            // When return type is not generic, return its type.
            if (typeof lFunctionHeader.returnType !== 'number') {
                return lFunctionHeader.returnType.data.type;
            }

            const lGenericIndex: number = lFunctionHeader.returnType;

            // When return type is generic, return the infered type.
            const lInferedReturnType: PgslType | null = lInferedGenericTypes.get(lGenericIndex) ?? null;
            if (!lInferedReturnType) {
                pContext.pushIncident(`Function return type ${lGenericIndex} of function '${this.cst.functionName}' can not be inferred.`, this);
                return new PgslInvalidType().process(pContext);
            }

            return lInferedReturnType;
        }

        return null;
    }
}

export type FunctionCallExpressionAstData = {
    name: string;
    parameters: Array<IExpressionAst>;
} & ExpressionAstData;