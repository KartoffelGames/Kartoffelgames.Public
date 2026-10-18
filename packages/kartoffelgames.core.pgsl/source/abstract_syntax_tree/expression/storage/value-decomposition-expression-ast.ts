import type { ValueDecompositionExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { EnumDeclarationAst } from "../../declaration/enum-declaration-ast.ts";
import { StructDeclarationAst } from "../../declaration/struct-declaration-ast.ts";
import type { StructPropertyDeclarationAst } from '../../declaration/struct-property-declaration-ast.ts';
import { type BasePgslType } from '../../type/definition/base-pgsl-type.ts';
import { PgslEnumType } from '../../type/definition/pgsl-enum-type.ts';
import { PgslInvalidType } from '../../type/definition/pgsl-invalid-type.ts';
import { PgslStructType } from '../../type/definition/pgsl-struct-type.ts';
import { PgslVectorType } from '../../type/definition/pgsl-vector-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL structure holding a single value of a decomposited composite value.
 */
export class ValueDecompositionExpressionAst extends AbstractSyntaxTree<ValueDecompositionExpressionCst, ValueDecompositionExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: ValueDecompositionExpressionCst): ValueDecompositionExpressionAstData {
        // Build value expression.
        const lPropertyRootExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.value).process(pContext);

        const lPropertyName: string = pCst.property;

        // Read attachment from resolve type.
        const lExpressionType: BasePgslType = lPropertyRootExpression.data.resolveType;

        // Resolve property type.
        const lPropertyInformation = ((): ValueDecompositionExpressionAstPropertyData | null => {
            switch (true) {
                case lExpressionType instanceof PgslStructType: {
                    // Read struct and its declaration.
                    const [lStructDeclaration, lStructProperty] = (() => {
                        // Try to get the struct.
                        const lStruct: StructDeclarationAst | undefined = pContext.getStruct(lExpressionType.structName);
                        if (!lStruct) {
                            return [null, null];
                        }

                        // Find property by name in its struct.
                        const lStructProperty: StructPropertyDeclarationAst | undefined = lStruct.data.properties.find((pProperty) => {
                            return pProperty.data.name === lPropertyName;
                        });

                        return [lStruct, lStructProperty];
                    })();

                    return {
                        type: lStructProperty?.data.typeDeclaration.data.type ?? pContext.types.create(PgslInvalidType),
                        propertyValue: null, // Cant be read.
                        expressionDeclaration: lStructDeclaration,

                        fixedState: lPropertyRootExpression.data.fixedState,
                        constantValue: null,
                        storageAddressSpace: lPropertyRootExpression.data.storageAddressSpace,
                        isStorage: lPropertyRootExpression.data.isStorage
                    };
                }

                case lExpressionType instanceof PgslEnumType: {
                    // Read enum and its declaration.
                    const [lEnumDeclaration, lEnumValue] = (() => {
                        // Try to get the enum.
                        const lEnum: EnumDeclarationAst | undefined = pContext.getEnum(lExpressionType.enumName);
                        if (!lEnum) {
                            return [null, null];
                        }

                        // Read enum value by property name.
                        const lEnumValue: IExpressionAst | undefined = lEnum.data.values.get(lPropertyName);
                        return [lEnum, lEnumValue];
                    })();

                    // Absolutly nothing was right.
                    if (!lEnumDeclaration) {
                        return null;
                    }

                    return {
                        type: lEnumValue?.data.resolveType ?? pContext.types.create(PgslInvalidType),
                        propertyValue: lEnumValue ?? null,
                        expressionDeclaration: lEnumDeclaration,

                        fixedState: lEnumValue?.data.fixedState ?? PgslValueFixedState.Variable,
                        constantValue: lEnumValue?.data.constantValue ?? null,
                        storageAddressSpace: lEnumValue?.data.storageAddressSpace ?? PgslValueAddressSpace.Function,
                        isStorage: false
                    };
                }

                case lExpressionType instanceof PgslVectorType: {
                    // When swizzle is only one long return the inner type.
                    if (lPropertyName.length === 1) {
                        return {
                            type: lExpressionType.componentType,
                            expressionDeclaration: null,
                            propertyValue: null,

                            fixedState: lPropertyRootExpression.data.fixedState,
                            constantValue: null,
                            storageAddressSpace: lPropertyRootExpression.data.storageAddressSpace,
                            isStorage: lPropertyRootExpression.data.isStorage
                        };
                    }

                    // Build vectorN type from vector type.
                    return {
                        type: pContext.types.create(PgslVectorType, lPropertyName.length, lExpressionType.componentType),
                        expressionDeclaration: null,
                        propertyValue: null,

                        fixedState: lPropertyRootExpression.data.fixedState,
                        constantValue: null,
                        storageAddressSpace: lPropertyRootExpression.data.storageAddressSpace,
                        isStorage: false
                    };
                }
            }

            // When property information could not be resolved, return invalid type.
            return null;
        })();

        if (!lPropertyInformation) {
            return {
                // Expression data.
                property: lPropertyName,
                propertyValue: null,
                expressionValue: lPropertyRootExpression,
                expressionDeclaration: null,

                // Expression meta data.
                resolveType: pContext.types.create(PgslInvalidType),
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Function
            };
        }

        return {
            // Expression data.
            property: lPropertyName,
            propertyValue: lPropertyInformation.propertyValue,
            expressionValue: lPropertyRootExpression,
            expressionDeclaration: lPropertyInformation.expressionDeclaration,

            // Expression meta data.
            resolveType: lPropertyInformation.type,
            fixedState: lPropertyInformation.fixedState,
            isStorage: lPropertyInformation.isStorage,
            constantValue: lPropertyInformation.constantValue,
            storageAddressSpace: lPropertyInformation.storageAddressSpace
        };
    }
}

type ValueDecompositionExpressionAstPropertyData = {
    type: BasePgslType;

    propertyValue: IExpressionAst | null;
    expressionDeclaration: EnumDeclarationAst | StructDeclarationAst | null;

    constantValue: null | string | number;
    fixedState: PgslValueFixedState;
    storageAddressSpace: PgslValueAddressSpace;
    isStorage: boolean;
};

export type ValueDecompositionExpressionAstData = {
    property: string;
    propertyValue: IExpressionAst | null;

    expressionDeclaration: EnumDeclarationAst | StructDeclarationAst | null;
    expressionValue: IExpressionAst;
} & ExpressionAstData;
