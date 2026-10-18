import { NewExpressionAst, type NewExpressionAstCallDefinitionParameter, type NewExpressionAstData } from '../../../../abstract_syntax_tree/expression/single_value/new-expression-ast.ts';
import type { IExpressionAst } from '../../../../abstract_syntax_tree/expression/i-expression-ast.interface.ts';
import { type BasePgslType, BasePgslTypeKind } from '../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslArrayType } from '../../../../abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslMatrixType } from '../../../../abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslVectorType } from '../../../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';
import { PgslNumericType } from "../../../../abstract_syntax_tree/type/definition/pgsl-numeric-type.ts";

/**
 * Validation processor of NewExpressionAst.
 */
export class NewExpressionAstValidationProcessor extends PgslValidatorProcessor<NewExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof NewExpressionAst {
        return NewExpressionAst;
    }

    /**
     * Validates the PGSL new expression syntax tree.
     *
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: NewExpressionAstData): void {
        // Validate each argument expression.
        for (const lParameter of pData.parameterList) {
            this.validateAst(lParameter);
        }

        // Validate the type declaration of each written generic.
        for (const lGeneric of pData.genericList) {
            this.validateAst(lGeneric);
        }

        // Validate that the type name can be constructed with new.
        if (!pData.callDefinition) {
            this.pushIncident(`Type '${pData.typeName}' cannot be constructed with 'new'.`);
            return;
        }

        // Validate that at most one generic is written.
        if (pData.genericList.length > 1) {
            this.pushIncident(`Only one generic type is supported in 'new' expressions.`);
        }

        // Validate that a generic is only written for a type whose constructor takes one.
        if (pData.genericList.length > 0 && !pData.callDefinition.generics) {
            this.pushIncident(`Type '${pData.typeName}' can not be constructed with a generic type.`);
        }

        // Validate that the written generic is one of the component types the constructed type allows.
        if (pData.genericList.length > 0 && pData.callDefinition.generics) {
            const lGenericType: BasePgslType = pData.genericList[0].data.type;
            const lGenericMatched: boolean = pData.callDefinition.generics.some((pGeneric: BasePgslType) => {
                return pGeneric.accepts(lGenericType);
            });
            if (!lGenericMatched) {
                this.pushIncident(`Generic type is not valid for constructed type '${pData.typeName}'.`);
            }
        }

        // Validate that a construction without parameters has a generic, because its type can not be inferred.
        if (pData.parameterList.length === 0 && pData.genericList.length === 0 && pData.callDefinition.generics) {
            this.pushIncident(`Type '${pData.typeName}' needs a generic type when constructed without parameters.`);
        }

        // Validate that each argument type is constructible and has a fixed footprint.
        for (const lParameter of pData.parameterList) {
            // Must be constructable.
            if (!lParameter.data.resolveType.isKind(BasePgslTypeKind.Constructible)) {
                this.pushIncident(`Parameter of type '${lParameter.data.resolveType.meta.typeName}' must be constructible.`, lParameter);
            }

            // Must be fixed.
            if (!lParameter.data.resolveType.isKind(BasePgslTypeKind.FixedFootprint)) {
                this.pushIncident(`Parameter of type '${lParameter.data.resolveType.meta.typeName}' must have a fixed length.`, lParameter);
            }
        }

        // Validate that a constructor of the type matches the argument count and types.
        if (!this.hasMatchingConstructor(pData.callDefinition.parameters, pData.parameterList)) {
            this.pushIncident(`No matching constructor found for type '${pData.typeName}' with ${pData.parameterList.length} parameter(s).`);
        }

        // Validate that every parameter can be converted to the inner item type.
        if (pData.parameterList.length > 1) {
            // Array items should not be unwrapped as they are used as a whole.
            const lUnwrap: boolean = !(pData.returnType instanceof PgslArrayType);

            // Unwrap inner type.
            const lUnwrapType = (pType: BasePgslType): BasePgslType => {
                // Skip unwrapping if its disabled (only arrays i think)
                if (!lUnwrap) {
                    return pType;
                }

                if (pType instanceof PgslVectorType || pType instanceof PgslMatrixType) {
                    return pType.componentType;
                }

                return pType;
            };

            // Check every parameter that it can be converted into the result item.
            for (const lParameter of pData.parameterList) {
                const lUnwrappedParameterType: BasePgslType = lUnwrapType(lParameter.data.resolveType);

                if (lUnwrappedParameterType.conversionRankTo(pData.returnTypeItem) === Number.POSITIVE_INFINITY) {
                    this.pushIncident(`Parameter of type '${lUnwrappedParameterType.meta.typeName}' can not be converted into '${pData.returnTypeItem.meta.typeName}'.`, lParameter);
                }
            }
        }

        // Validate that a constant abstract argument lies within the range of the item type.
        for (const lParameter of pData.parameterList) {
            const lParameterType: BasePgslType = lParameter.data.resolveType;
            const lConstantValue: number | string | null = lParameter.data.constantValue;

            // Only constant abstract numbers are converted when the shader is created.
            if (typeof lConstantValue !== 'number' || !lParameterType.isKind(BasePgslTypeKind.Abstract)) {
                continue;
            }

            // Parameters must be numberic to be checkled.
            if (!(pData.returnTypeItem instanceof PgslNumericType)) {
                continue;
            }

            // Check the value against the range of the item type.
            if (!pData.returnTypeItem.constantFits(lParameterType, lConstantValue)) {
                this.pushIncident(`Value ${lConstantValue} does not fit into '${pData.returnTypeItem.meta.typeName}'.`, lParameter);
            }
        }
    }

    /**
     * Check if any constructor definition matches the parameter list.
     *
     * @param pConstructorList - Parameter definitions of every constructor.
     * @param pParameterList - Parameter expressions of the new expression.
     *
     * @returns true when at least one constructor matches.
     */
    private hasMatchingConstructor(pConstructorList: Array<Array<NewExpressionAstCallDefinitionParameter>>, pParameterList: Array<IExpressionAst>): boolean {
        DEFINTION_CHECK: for (const lParameterDefinitionList of pConstructorList) {
            // Save current index of parameter list.
            let lParameterIndex: number = 0;

            // Check parameters parts.
            for (const lParameterDefinition of lParameterDefinitionList) {
                const lValidParameterTypeList: Array<BasePgslType> = lParameterDefinition.typeRestrictions;
                const lParameterCountMin: number = lParameterDefinition.count?.min ?? 1;
                const lParameterCountMax: number = lParameterDefinition.count?.max ?? 1;

                // Calculate iteration stop index based on max and current index.
                const lParameterMinIndex: number = lParameterIndex + lParameterCountMin - 1;
                const lParameterMaxIndex: number = lParameterIndex + lParameterCountMax - 1;

                // Iterate expected parameters until max count or end of parameter list is reached.
                for (; lParameterIndex < pParameterList.length; lParameterIndex++) {
                    // Break if max count reached.
                    if (lParameterIndex > lParameterMaxIndex) {
                        break;
                    }

                    // Get actual parameter type.
                    const lActualType: BasePgslType = pParameterList[lParameterIndex].data.resolveType;

                    // Check type restrictions. No restrictions means always match.
                    const lTypeMatched: boolean = lValidParameterTypeList.length === 0 || lValidParameterTypeList.some((pValidParameterType: BasePgslType) => {
                        return pValidParameterType.accepts(lActualType);
                    });

                    // Skip this definition on mismatch.
                    if (!lTypeMatched) {
                        break;
                    }
                }

                // Check if min count was reached and continue with next definition on failure.
                if (lParameterIndex <= lParameterMinIndex) {
                    continue DEFINTION_CHECK;
                }
            }

            // Every parameter must be used by the definition.
            if (lParameterIndex < pParameterList.length) {
                continue;
            }

            // Definition matched.
            return true;
        }

        // No matching definition found.
        return false;
    }
}
