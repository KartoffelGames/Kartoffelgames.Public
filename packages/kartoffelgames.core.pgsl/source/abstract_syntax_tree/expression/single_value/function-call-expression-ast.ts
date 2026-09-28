import type { FunctionCallExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataParameter } from '../../declaration/function-declaration-ast.ts';
import { FunctionOverloadDeclarationAst } from "../../declaration/function-overload-declaration-ast.ts";
import { TypeDeclarationAst } from '../../general/type-declaration-ast.ts';
import { BasePgslType } from "../../type/definition/base-pgsl-type.ts";
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
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): FunctionCallExpressionAstData {
        const lFunctionDeclaration: FunctionDeclarationAst | undefined = pContext.getFunction(this.cst.functionName);

        // Register function name as used symbol.
        pContext.registerSymbolUsage(this.cst.functionName);

        // Should be a function declaration otherwise it cant be validated further.
        if (!lFunctionDeclaration) {
            pContext.pushIncident(`Function '${this.cst.functionName}' is not defined.`, this);

            return {
                // Expression data.
                name: this.cst.functionName,
                parameters: new Array<IExpressionAst>(),
                generics: new Array<BasePgslType>(),
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
        const lParameterList: Array<IExpressionAst> = this.cst.parameterList.map((pParameterCst) => {
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

        // Convert function call generic parameters.
        const lGenericParameterList: Array<BasePgslType> = this.cst.genericList.map((pGenericTypeDeclarationCst) => {
            return new TypeDeclarationAst(pGenericTypeDeclarationCst).process(pContext).data.type;
        });

        // Try to match function header.
        const lMatchedFunctionHeader: FunctionHeaderMatchResult | null = this.matchFunctionHeader(pContext, lFunctionDeclaration, lGenericParameterList, lParameterList);
        if (!lMatchedFunctionHeader) {
            pContext.pushIncident(`No matching function header found for function '${this.cst.functionName}'.`, this);
        }

        // Get the return type from the matched function header.
        const lReturnType: BasePgslType = (() => {
            if (!lMatchedFunctionHeader) {
                return new PgslInvalidType();
            }

            // When return type is not generic, return its type.
            if (typeof lMatchedFunctionHeader.header.data.returnType !== 'string') {
                return lMatchedFunctionHeader.header.data.returnType.data.type;
            }

            const lGenericIndex: string = lMatchedFunctionHeader.header.data.returnType;

            // When return type is generic, return the infered type.
            const lInferedReturnType: BasePgslType | null = lMatchedFunctionHeader.genericTypes.get(lGenericIndex) ?? null;
            if (!lInferedReturnType) {
                pContext.pushIncident(`Function return type ${lGenericIndex} of function '${this.cst.functionName}' can not be inferred.`, this);
                return new PgslInvalidType();
            }

            return lInferedReturnType;
        })();

        // For any used pointer type, try to assign its expression address space is correct.
        if (lMatchedFunctionHeader) {
            for (let lParameterIndex = 0; lParameterIndex < lMatchedFunctionHeader.header.data.parameter.length; lParameterIndex++) {
                const lParameterType: BasePgslType = (() => {
                    // When parameter type is not generic return its type declaration.
                    const lParameterTypeDeclaration: string | TypeDeclarationAst = lMatchedFunctionHeader.header.data.parameter[lParameterIndex].type;
                    if (typeof lParameterTypeDeclaration !== 'string') {
                        return lParameterTypeDeclaration.data.type;
                    }

                    // When parameter type is generic, return the infered type declaration.
                    const lGenericName: string = lParameterTypeDeclaration;
                    return lMatchedFunctionHeader.genericTypes.get(lGenericName)!;
                })();

                // Assign address space to pointer types.
                if (lParameterType instanceof PgslPointerType) {
                    const lParameterExpressionAddressSpace: PgslValueAddressSpace = lParameterList[lParameterIndex].data.storageAddressSpace;
                    lParameterType.assignAddressSpace(lParameterExpressionAddressSpace, pContext);
                }
            }
        }

        // Build ordered generic type list.
        const lGenericList: Array<BasePgslType> = new Array<BasePgslType>();
        if (lMatchedFunctionHeader) {
            for (const lGeneric of lMatchedFunctionHeader.header.data.generics) {
                // When generic type is not infered, assign invalid type.
                if (!lMatchedFunctionHeader.genericTypes.has(lGeneric.name)) {
                    lGenericList.push(new PgslInvalidType());
                    continue;
                }

                lGenericList.push(lMatchedFunctionHeader.genericTypes.get(lGeneric.name)!);
            }
        }

        return {
            // Expression data.
            name: this.cst.functionName,
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
     * @param pFunctionDeclaration - Function declaation of call.
     * @param pGenericList - Generic types used for this call.
     * @param pParameterList - Parameter expressions used for this call.
     *
     * @returns Matched function header and infered generics or null when no match is found.
     */
    private matchFunctionHeader(pContext: AbstractSyntaxTreeContext, pFunctionDeclaration: FunctionDeclarationAst, pGenericList: Array<BasePgslType>, pParameterList: Array<IExpressionAst>): FunctionHeaderMatchResult | null {
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
            const lGenericRestrictions: Map<string, Array<string> | null> = new Map<string, Array<string> | null>();
            for (const lGeneric of lFunctionHeader.data.generics) {
                lGenericRestrictions.set(lGeneric.name, lGeneric.restrictions);
            }

            // Map static provided generic types.
            const lStaticGenericTypes: Map<string, BasePgslType> = new Map<string, BasePgslType>();
            for (let lGenericIndex = 0; lGenericIndex < pGenericList.length; lGenericIndex++) {
                lStaticGenericTypes.set(lFunctionHeader.data.generics[lGenericIndex].name, pGenericList[lGenericIndex]);
            }

            // Collect candidate types for each generic that needs inference.
            const lGenericCandidates: Map<string, Array<BasePgslType>> = new Map<string, Array<BasePgslType>>();

            // Validate each parameter against the function header.
            for (let lParameterIndex = 0; lParameterIndex < pParameterList.length; lParameterIndex++) {
                const lParameterExpression: IExpressionAst = pParameterList[lParameterIndex];
                const lParameterDeclaration: FunctionDeclarationAstDataParameter | undefined = lFunctionHeader.data.parameter[lParameterIndex];
                const lParameterType: BasePgslType = lParameterExpression.data.resolveType;

                // Validate parameter declaration exists.
                if (!lParameterDeclaration) {
                    pContext.pushIncident(`Parameter ${lParameterIndex} of function '${this.cst.functionName}' is not defined.`, this);
                    continue FUNCTION_HEADER_LOOP;
                }

                // Non-generic parameter: check implicit cast compatibility directly.
                if (typeof lParameterDeclaration.type !== 'string') {
                    if (lParameterType.conversionRankTo(lParameterDeclaration.type.data.type) === Number.POSITIVE_INFINITY) {
                        continue FUNCTION_HEADER_LOOP;
                    }
                    continue;
                }

                const lGenericName: string = lParameterDeclaration.type;

                // Explicit generic provided: validate parameter is implicitly castable into the provided type.
                if (lStaticGenericTypes.has(lGenericName)) {
                    if (lParameterType.conversionRankTo(lStaticGenericTypes.get(lGenericName)!) === Number.POSITIVE_INFINITY) {
                        continue FUNCTION_HEADER_LOOP;
                    }

                    continue;
                }

                // Validate generic name exists in header definition.
                if (!lGenericRestrictions.has(lGenericName)) {
                    pContext.pushIncident(`Generic name ${lGenericName} of function '${this.cst.functionName}' is out of bounds.`, this);
                    continue FUNCTION_HEADER_LOOP;
                }

                // Validate parameter type satisfies the generic restrictions.
                const lRestrictions: Array<string> | null = lGenericRestrictions.get(lGenericName)!;
                if (lRestrictions !== null) {
                    const lSatisfiesRestriction: boolean = lRestrictions.some((pRestriction) => {
                        return lParameterType.data.metaTypes.includes(pRestriction);
                    });

                    if (!lSatisfiesRestriction) {
                        continue FUNCTION_HEADER_LOOP;
                    }
                }

                // Collect candidate type for generic inference.
                if (!lGenericCandidates.has(lGenericName)) {
                    lGenericCandidates.set(lGenericName, []);
                }
                lGenericCandidates.get(lGenericName)!.push(lParameterType);
            }

            // Resolve inferred generic types from collected candidates.
            for (const [lGenericName, lCandidates] of lGenericCandidates) {
                const lResolvedType: BasePgslType | null = this.resolveStrictestType(lCandidates);
                if (!lResolvedType) {
                    continue FUNCTION_HEADER_LOOP;
                }

                lStaticGenericTypes.set(lGenericName, lResolvedType);
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
    genericTypes: Map<string, BasePgslType>;
};

export type FunctionCallExpressionAstData = {
    name: string;
    parameters: Array<IExpressionAst>;
    generics: Array<BasePgslType>;
    functionDeclaration: FunctionDeclarationAst;
} & ExpressionAstData;