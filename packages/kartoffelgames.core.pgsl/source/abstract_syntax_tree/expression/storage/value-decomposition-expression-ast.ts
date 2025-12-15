import { Exception } from '@kartoffelgames/core';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import { PgslEnumType } from '../../../type/pgsl-enum-type.ts';
import { PgslInvalidType } from '../../../type/pgsl-invalid-type.ts';
import { PgslStructType } from '../../../type/pgsl-struct-type.ts';
import type { PgslType } from '../../../type/pgsl-type.ts';
import { PgslVectorType } from '../../../type/pgsl-vector-type.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { StructPropertyDeclarationAst } from '../../declaration/struct-property-declaration-ast.ts';
import { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';
import type { ValueDecompositionExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';

/**
 * PGSL structure holding a single value of a decomposited composite value.
 */
export class ValueDecompositionExpressionAst extends AbstractSyntaxTree<ValueDecompositionExpressionCst, ValueDecompositionExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected override process(pContext: AbstractSyntaxTreeContext): ValueDecompositionExpressionAstData {
        // Build value expression.
        const lValue: IExpressionAst = ExpressionAstBuilder.build(this.cst.value, pContext);

        const lPropertyName: string = this.cst.property;

        // Read attachment from resolve type.
        const lExpressionType: PgslType = lValue.data.resolveType;

        // Must be compositeable.
        if (!lExpressionType.composite) {
            pContext.pushIncident(`Type must be a compositeable type.`, this);
        }

        // Resolve property type.
        const lPropertyInformation = ((): ({ type: PgslType, fixedState: PgslValueFixedState, constValue: null | string | number, addressSpace: PgslValueAddressSpace; isStorage: boolean; } | null) => {
            switch (true) {
                case lExpressionType instanceof PgslStructType: {
                    // Read struct definition.
                    const lStructDeclaration = pContext.getStruct(lExpressionType.structName);
                    if (!lStructDeclaration) {
                        pContext.pushIncident(`Struct type for "${lExpressionType.structName}" not found.`, this);
                        return null;
                    }

                    // Find property by name in its struct.
                    const lProperty: StructPropertyDeclarationAst | undefined = lStructDeclaration.data.properties.find((pProperty) => { return pProperty.data.name === lPropertyName; });
                    if (!lProperty) {
                        pContext.pushIncident(`Struct has no defined property "${lPropertyName}"`, this);
                        return null;
                    }

                    return {
                        type: lProperty.data.typeDeclaration.data.type,
                        fixedState: PgslValueFixedState.Variable,
                        constValue: null,
                        addressSpace: lValue.data.storageAddressSpace,
                        isStorage: true
                    };
                }

                case lExpressionType instanceof PgslEnumType: {
                    const lEnumDeclaration = pContext.getEnum(lExpressionType.enumName);
                    if (!lEnumDeclaration) {
                        pContext.pushIncident(`Enum type for "${lExpressionType.enumName}" not found.`, this);
                        return null;
                    }

                    // Read enum value by property name.
                    const lEnumValue: IExpressionAst | undefined = lEnumDeclaration.data.values.get(lPropertyName);
                    if (!lEnumValue) {
                        pContext.pushIncident(`Enum "${lEnumDeclaration.data.name}" does not contain a value for property "${lPropertyName}".`, this);
                        return null;
                    }

                    return {
                        type: lEnumValue.data.resolveType,
                        fixedState: lEnumValue.data.fixedState,
                        constValue: lEnumValue.data.constantValue,
                        addressSpace: lEnumValue.data.storageAddressSpace,
                        isStorage: false
                    };
                }

                case lExpressionType instanceof PgslVectorType: {
                    // Validate swizzle name.
                    if (!/[rgba]{1,4}|[xyzw]{1,4}/.test(lPropertyName)) {
                        pContext.pushIncident(`Swizzle name "${lPropertyName}" can't be used to access vector.`, this);
                    }

                    // When swizzle is only one long return the inner type.
                    if (lPropertyName.length === 1) {
                        return {
                            type: lExpressionType.innerType,
                            fixedState: PgslValueFixedState.Variable,
                            constValue: null,
                            addressSpace: lValue.data.storageAddressSpace,
                            isStorage: false
                        };
                    }

                    // Build vectorN type from vector type.
                    const lVectorType: PgslVectorType = new PgslVectorType(
                        pContext,
                        lPropertyName.length,
                        lExpressionType.innerType
                    );

                    return {
                        type: lVectorType,
                        fixedState: PgslValueFixedState.Variable,
                        constValue: null,
                        addressSpace: lValue.data.storageAddressSpace,
                        isStorage: false
                    };
                }
            }

            // No valid type found.
            pContext.pushIncident(`Value is not a composite type property "${lPropertyName}".`, this);

            return null;
        })();

        // When property information could not be resolved, return invalid type.
        if (lPropertyInformation === null) {
            return {
                // Expression data.
                value: lValue,
                property: lPropertyName,

                // Expression meta data.
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslInvalidType(pContext),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Function
            };
        }

        return {
            // Expression data.
            value: lValue,
            property: lPropertyName,

            // Expression meta data.
            fixedState: lPropertyInformation.fixedState,
            isStorage: lPropertyInformation.isStorage,
            resolveType: lPropertyInformation.type,
            constantValue: lPropertyInformation.constValue,
            storageAddressSpace: lPropertyInformation.addressSpace
        };
    }
}

export type ValueDecompositionExpressionAstData = {
    property: string;
    value: IExpressionAst;
} & ExpressionAstData;
