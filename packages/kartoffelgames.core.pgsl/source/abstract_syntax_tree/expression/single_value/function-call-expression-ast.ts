import type { FunctionCallExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { FunctionDeclarationAst } from '../../declaration/function-declaration-ast.ts';
import { FunctionOverloadDeclarationAst, FunctionOverloadDeclarationAstDataParameter } from "../../declaration/function-overload-declaration-ast.ts";
import { TypeDeclarationAst } from '../../general/type-declaration-ast.ts';
import { BasePgslType, BasePgslTypeKind } from "../../type/definition/base-pgsl-type.ts";
import { PgslGenericType } from "../../type/definition/pgsl-generic-type.ts";
import { PgslInvalidType } from '../../type/definition/pgsl-invalid-type.ts';
import { PgslPointerType } from '../../type/definition/pgsl-pointer-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL syntax tree of a function call expression with optional template list.
 */
export class FunctionCallExpressionAst extends AbstractSyntaxTree<FunctionCallExpressionCst, FunctionCallExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: FunctionCallExpressionCst): FunctionCallExpressionAstData {
        const lFunctionDeclaration: FunctionDeclarationAst | undefined = pContext.getFunction(pCst.functionName);

        // Register function name as used symbol.
        pContext.registerSymbolUsage(pCst.functionName);

        // Should be a function declaration otherwise it cant be validated further.
        if (!lFunctionDeclaration) {
            pContext.pushIncident(`Function '${pCst.functionName}' is not defined.`, this);

            return {
                // Expression data.
                name: pCst.functionName,
                parameters: new Array<IExpressionAst>(),
                generics: new Array<TypeDeclarationAst>(),
                functionDeclaration: null as unknown as FunctionDeclarationAst,

                // Expression meta data.
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslInvalidType(),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Inherit
            };
        }

        // Build parameter expressions.
        const lParameterList: Array<IExpressionAst> = pCst.parameterList.map((pParameterCst) => {
            return ExpressionAstBuilder.build(pParameterCst).process(pContext);
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

        // Build function call generic declarations.
        const lGenericList: Array<TypeDeclarationAst> = pCst.genericList.map((pGenericTypeDeclarationCst) => {
            return new TypeDeclarationAst(pGenericTypeDeclarationCst).process(pContext);
        });


        // Try to match function header.
        const lMatchedFunctionHeader: FunctionHeaderMatchResult | null = this.matchFunctionHeader(pContext, pCst, lFunctionDeclaration, lGenericList, lParameterList);
        if (!lMatchedFunctionHeader) {
            pContext.pushIncident(`No matching function header found for function '${pCst.functionName}'.`, this);
        }

        // Get the return type from the matched function header.
        const lReturnType: BasePgslType = (() => {
            if (!lMatchedFunctionHeader) {
                return new PgslInvalidType();
            }

            const lPossibleGenericResultType: BasePgslType = lMatchedFunctionHeader.header.data.returnType.data.type;
            if (!lMatchedFunctionHeader.genericTypes.has(lPossibleGenericResultType)) {
                return lPossibleGenericResultType;
            }

            return lMatchedFunctionHeader.genericTypes.get(lPossibleGenericResultType)!;
        })();

        // For any used pointer type, try to assign its expression address space is correct.
        if (lMatchedFunctionHeader) {
            for (let lParameterIndex = 0; lParameterIndex < lMatchedFunctionHeader.header.data.parameter.length; lParameterIndex++) {
                const lParameterType: BasePgslType = lMatchedFunctionHeader.header.data.parameter[lParameterIndex].type.data.type;;

                // Assign address space to pointer types.
                if (lParameterType instanceof PgslPointerType) {
                    const lParameterExpressionAddressSpace: PgslValueAddressSpace = lParameterList[lParameterIndex].data.storageAddressSpace;
                    lParameterType.assignAddressSpace(lParameterExpressionAddressSpace, pContext);
                }
            }
        }

        return {
            // Expression data.
            name: pCst.functionName,
            parameters: lParameterList,
            generics: lGenericList,
            functionDeclaration: lFunctionDeclaration,

            // Expression meta data.
            fixedState: lFixedState,
            isStorage: false,
            resolveType: lReturnType,
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        };
    }

    /**
     * Match function declaration headers against provided generics and parameters.
     *
     * @param pContext - Process context.
     * @param pCst - Cst data.
     * @param pFunctionDeclaration - Function declaation of call.
     * @param pGenericList - Generic types used for this call.
     * @param pParameterList - Parameter expressions used for this call.
     *
     * @returns Matched function header and infered generics or null when no match is found.
     */
    private matchFunctionHeader(pContext: AbstractSyntaxTreeContext, pCst: FunctionCallExpressionCst, pFunctionDeclaration: FunctionDeclarationAst, pGenericList: Array<TypeDeclarationAst>, pParameterList: Array<IExpressionAst>): FunctionHeaderMatchResult | null {
        // Check each function header for a match.
        FUNCTION_HEADER_LOOP: for (const lFunctionHeader of pFunctionDeclaration.data.declarations) {
            // Parameter count needs to match.
            if (lFunctionHeader.data.parameter.length !== pParameterList.length) {
                continue;
            }

            // When any generic is provided, the generics cant be inferred so their count needs to match.
            if (pGenericList.length > 0 && lFunctionHeader.data.generics.length !== pGenericList.length) {
                continue;
            }

            // Build generic restrictions map from header definition.
            const lGenericRestrictions: Map<string, PgslGenericType> = new Map<string, PgslGenericType>();
            for (const lGeneric of lFunctionHeader.data.generics) {
                lGenericRestrictions.set(lGeneric.name, lGeneric);
            }

            // Map static provided generic types.
            const lStaticGenericTypes: Map<PgslGenericType, BasePgslType> = new Map<PgslGenericType, BasePgslType>();
            for (let lGenericIndex = 0; lGenericIndex < pGenericList.length; lGenericIndex++) {
                lStaticGenericTypes.set(lFunctionHeader.data.generics[lGenericIndex], pGenericList[lGenericIndex].data.type);
            }

            // Collect candidate types for each generic that needs inference.
            const lGenericCandidates: Map<PgslGenericType, Array<BasePgslType>> = new Map<PgslGenericType, Array<BasePgslType>>();

            // Validate each parameter against the function header.
            for (let lParameterIndex = 0; lParameterIndex < pParameterList.length; lParameterIndex++) {
                const lParameterExpression: IExpressionAst = pParameterList[lParameterIndex];
                const lParameterExpressionType: BasePgslType = lParameterExpression.data.resolveType;

                const lParameterDeclaration: FunctionOverloadDeclarationAstDataParameter | undefined = lFunctionHeader.data.parameter[lParameterIndex];
                const lParameterDeclarationType: BasePgslType = lParameterDeclaration.type.data.type;

                // Validate parameter declaration exists.
                if (!lParameterDeclaration) {
                    pContext.pushIncident(`Parameter ${lParameterIndex} of function '${pCst.functionName}' is not defined.`, this);
                    continue FUNCTION_HEADER_LOOP;
                }

                // Non-generic parameter: check implicit cast compatibility directly.
                if (!(lParameterDeclarationType instanceof PgslGenericType)) {
                    if (lParameterExpressionType.conversionRankTo(lParameterDeclarationType) === Number.POSITIVE_INFINITY) {
                        continue FUNCTION_HEADER_LOOP;
                    }
                    continue;
                }

                // When the generic is static, check against the static.
                if (lStaticGenericTypes.has(lParameterDeclarationType)) {
                    const lStaticGenericType: BasePgslType = lStaticGenericTypes.get(lParameterDeclarationType)!;
                    if (lParameterExpressionType.conversionRankTo(lStaticGenericType) === Number.POSITIVE_INFINITY) {
                        continue FUNCTION_HEADER_LOOP;
                    }
                    continue;
                }

                // Validate parameter type satisfies the generic restrictions.
                if (!lParameterDeclarationType.accepts(lParameterExpressionType)) {
                    continue FUNCTION_HEADER_LOOP;
                }

                // Collect candidate type for generic inference.
                if (!lGenericCandidates.has(lParameterDeclarationType)) {
                    lGenericCandidates.set(lParameterDeclarationType, []);
                }
                lGenericCandidates.get(lParameterDeclarationType)!.push(lParameterExpressionType);
            }

            // Resolve inferred generic types from collected candidates.
            for (const [lGenericType, lCandidates] of lGenericCandidates) {
                const lResolvedType: BasePgslType | null = this.resolveStrictestType(lCandidates);
                if (!lResolvedType) {
                    continue FUNCTION_HEADER_LOOP;
                }

                lStaticGenericTypes.set(lGenericType, lResolvedType);
            }

            return {
                header: lFunctionHeader,
                genericTypes: lStaticGenericTypes
            };
        }

        return null;
    }

    /**
     * Find the strictest type among candidates.
     * The strictest type is the one that all other candidates can be implicitly cast into.
     *
     * @param pCandidates - List of candidate types to compare.
     *
     * @returns The strictest type or null if no single type satisfies all candidates.
     */
    private resolveStrictestType(pCandidates: Array<BasePgslType>): BasePgslType | null {
        // Check all candidates against each other and return the first type that all other types can be implicitly cast into.
        for (const lCandidate of pCandidates) {
            // Check if all other candidates can be implicitly cast into the current candidate.
            if (pCandidates.every((pOther) => { return pOther.conversionRankTo(lCandidate) !== Number.POSITIVE_INFINITY; })) {
                return lCandidate;
            }
        }

        return null;
    }
}

type FunctionHeaderMatchResult = {
    header: FunctionOverloadDeclarationAst;

    /**
     * Mapping from a generic type to a non generic type.
     */
    genericTypes: Map<BasePgslType, BasePgslType>;
};

export type FunctionCallExpressionAstData = {
    name: string;
    parameters: Array<IExpressionAst>;
    generics: Array<TypeDeclarationAst>;
    functionDeclaration: FunctionDeclarationAst;
} & ExpressionAstData;