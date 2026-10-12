import type { FunctionCallExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { FunctionDeclarationAst } from '../../declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst, FunctionOverloadDeclarationAstDataParameter } from '../../declaration/function-overload-declaration-ast.ts';
import { TypeDeclarationAst } from '../../general/type-declaration-ast.ts';
import type { BasePgslType } from '../../type/definition/base-pgsl-type.ts';
import { PgslGenericType } from '../../type/definition/pgsl-generic-type.ts';
import { PgslInvalidType } from '../../type/definition/pgsl-invalid-type.ts';
import { PgslPointerType } from '../../type/definition/pgsl-pointer-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL syntax tree of a function call expression with optional template list.
 */
export class FunctionCallExpressionAst extends AbstractSyntaxTree<FunctionCallExpressionCst, FunctionCallExpressionAstData> implements IExpressionAst {
    /**
     * Get the parameter by its parameter name in the matched overload.
     *
     * @param pParameterName - Parameter name of the matched overload.
     *
     * @returns the parameter expression or null when the matched overload has no parameter with this name.
     */
    public getParameter(pParameterName: string): IExpressionAst | null {
        // Find the parameter position in the matched overload.
        const lParameterIndex: number = this.data.overload?.data.parameter.findIndex((pParameter) => {
            return pParameter.name === pParameterName;
        }) ?? -1;

        // Parameter does not exist.
        if (lParameterIndex === -1) {
            return null;
        }

        return this.data.parameters[lParameterIndex] ?? null;
    }

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

        // Build parameter expressions.
        const lParameterList: Array<IExpressionAst> = pCst.parameterList.map((pParameterCst) => {
            return ExpressionAstBuilder.build(pParameterCst).process(pContext);
        });

        // Build function call generic declarations.
        const lGenericList: Array<TypeDeclarationAst> = pCst.genericList.map((pGenericTypeDeclarationCst) => {
            return new TypeDeclarationAst(pGenericTypeDeclarationCst).process(pContext);
        });

        // Should be a function declaration otherwise it cant be processed further.
        if (!lFunctionDeclaration) {
            return {
                // Expression data.
                name: pCst.functionName,
                parameters: lParameterList,
                generics: {
                    explicit: lGenericList,
                    resolved: new Map<PgslGenericType, BasePgslType>()
                },

                // Function signature.
                declaration: null,
                overload: null,

                // Expression meta data.
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslInvalidType(),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Inherit
            };
        }

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

        // Try to match function header.
        const lMatchedFunctionHeader: FunctionOverloadMatchResult | null = this.matchFunctionHeader(lFunctionDeclaration, lGenericList, lParameterList);

        // Get the return type from the matched function header.
        const lReturnType: BasePgslType = (() => {
            if (!lMatchedFunctionHeader) {
                return new PgslInvalidType();
            }

            const lPossibleGenericResultType: BasePgslType = lMatchedFunctionHeader.overload.data.returnType.data.type;
            if (!lMatchedFunctionHeader.genericTypes.has(lPossibleGenericResultType as PgslGenericType)) { // It is no a generic but so we check if its a generic.
                return lPossibleGenericResultType;
            }

            return lMatchedFunctionHeader.genericTypes.get(lPossibleGenericResultType as PgslGenericType)!;
        })();

        // For any used pointer type, try to assign its expression address space is correct.
        if (lMatchedFunctionHeader) {
            for (let lParameterIndex = 0; lParameterIndex < lMatchedFunctionHeader.overload.data.parameter.length; lParameterIndex++) {
                const lParameterType: BasePgslType = lMatchedFunctionHeader.overload.data.parameter[lParameterIndex].type.data.type;;

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
            generics: {
                explicit: lGenericList,
                resolved: lMatchedFunctionHeader?.genericTypes ?? new Map<PgslGenericType, BasePgslType>()
            },

            // Function signature.
            declaration: lFunctionDeclaration,
            overload: lMatchedFunctionHeader?.overload ?? null,

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
     * @param pFunctionDeclaration - Function declaation of call.
     * @param pGenericList - Generic types used for this call.
     * @param pParameterList - Parameter expressions used for this call.
     *
     * @returns Best matching function header and infered generics or null when no match is found.
     */
    private matchFunctionHeader(pFunctionDeclaration: FunctionDeclarationAst, pGenericList: Array<TypeDeclarationAst>, pParameterList: Array<IExpressionAst>): FunctionOverloadMatchResult | null {
        let lBestOverloadMatch: FunctionOverloadMatchResult | null = null;

        // Check each function header for a match and keep the best one.
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

            // Map and validate static provided generic types.
            const lStaticGenericTypes: Map<PgslGenericType, BasePgslType> = new Map<PgslGenericType, BasePgslType>();
            for (let lGenericIndex = 0; lGenericIndex < pGenericList.length; lGenericIndex++) {
                const lGenericType: PgslGenericType = lFunctionHeader.data.generics[lGenericIndex];
                const lExplicitGenericType: BasePgslType = pGenericList[lGenericIndex].data.type;

                // Skip this overload when the explicit generic can not be used for the generic restriction.
                if (!lGenericType.accepts(lExplicitGenericType)) {
                    continue FUNCTION_HEADER_LOOP;
                }

                lStaticGenericTypes.set(lGenericType, lExplicitGenericType);
            }

            // Collect candidate types for each generic that needs inference.
            const lGenericCandidates: Map<PgslGenericType, Array<BasePgslType>> = new Map<PgslGenericType, Array<BasePgslType>>();

            // Sum of every conversion ranks of every parameter and generic used.
            let lConversionRank: number = 0;

            // Validate each parameter against the function header.
            for (let lParameterIndex = 0; lParameterIndex < pParameterList.length; lParameterIndex++) {
                const lParameterExpression: IExpressionAst = pParameterList[lParameterIndex];
                const lParameterExpressionType: BasePgslType = lParameterExpression.data.resolveType;

                // The parameter count of the header and used parameters is matched so the FunctionHeader.parameter should be never null.
                const lParameterDeclaration: FunctionOverloadDeclarationAstDataParameter = lFunctionHeader.data.parameter[lParameterIndex];
                const lParameterDeclarationType: BasePgslType = lParameterDeclaration.type.data.type;

                // Non-generic parameter: check implicit cast compatibility directly.
                if (!(lParameterDeclarationType instanceof PgslGenericType)) {
                    const lParameterConversionRank: number = lParameterExpressionType.conversionRankTo(lParameterDeclarationType);
                    if (lParameterConversionRank === Number.POSITIVE_INFINITY) {
                        continue FUNCTION_HEADER_LOOP;
                    }

                    lConversionRank += lParameterConversionRank;
                    continue;
                }

                // The parameter is generic try to resolve it.

                // When the generic is static, check against the static.
                if (lStaticGenericTypes.has(lParameterDeclarationType)) {
                    // Get the convertion rank between the resolved static and the current parameter. Skip when it cant be converted.
                    const lParameterConversionRank: number = lParameterExpressionType.conversionRankTo(lStaticGenericTypes.get(lParameterDeclarationType)!);
                    if (lParameterConversionRank === Number.POSITIVE_INFINITY) {
                        continue FUNCTION_HEADER_LOOP;
                    }

                    lConversionRank += lParameterConversionRank;
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

                // Thats a little fucked up.
                // Every generic candidate can be converted into the resolved type, so we count every candidates convertion rank.
                for (const lCandidate of lCandidates) {
                    lConversionRank += lCandidate.conversionRankTo(lResolvedType);
                }
            }

            // Keep the best overload match, the overload with the lowest overall conversion rank.
            if (!lBestOverloadMatch || lConversionRank < lBestOverloadMatch.conversionRank) {
                lBestOverloadMatch = {
                    overload: lFunctionHeader,
                    genericTypes: lStaticGenericTypes,
                    conversionRank: lConversionRank
                };
            }
        }

        return lBestOverloadMatch;
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

type FunctionOverloadMatchResult = {
    overload: FunctionOverloadDeclarationAst;

    /**
     * Mapping from a generic type to a non generic type.
     */
    genericTypes: Map<PgslGenericType, BasePgslType>;

    /**
     * Sum of all canvertion ranks for every parameter and every used generic.
     */
    conversionRank: number;
};

export type FunctionCallExpressionAstData = {
    name: string;
    parameters: Array<IExpressionAst>;
    generics: {
        explicit: Array<TypeDeclarationAst>;
        resolved: Map<PgslGenericType, BasePgslType>;
    };

    // Found function signature.
    declaration: FunctionDeclarationAst | null;
    overload: FunctionOverloadDeclarationAst | null;
} & ExpressionAstData;