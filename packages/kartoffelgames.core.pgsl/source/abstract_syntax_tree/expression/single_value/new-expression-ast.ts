import type { LiteralValueExpressionCst, NewExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { TypeDeclarationAst } from '../../general/type-declaration-ast.ts';
import { BasePgslTypeKind, type BasePgslType } from '../../type/definition/base-pgsl-type.ts';
import { PgslArrayType } from '../../type/definition/pgsl-array-type.ts';
import { PgslBooleanType } from '../../type/definition/pgsl-boolean-type.ts';
import { PgslInvalidType } from '../../type/definition/pgsl-invalid-type.ts';
import { PgslMatrixType, type PgslMatrixTypeName } from '../../type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../type/definition/pgsl-vector-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';
import { LiteralValueExpressionAst } from './literal-value-expression-ast.ts';

/**
 * PGSL syntax tree of a new call expression with optional template list.
 */
export class NewExpressionAst extends AbstractSyntaxTree<NewExpressionCst, NewExpressionAstData> implements IExpressionAst {
    /**
     * Get the constructor definitions of a constructible type.
     * 
     * @param pContext - Build context used to create the restriction types.
     * @param pTypeName - Constructed type name.
     * 
     * @returns the constructor definitions or null when the type can not be constructed.
     */
    private static callDefinition(pContext: AbstractSyntaxTreeContext, pTypeName: string): NewExpressionAstCallDefinition | null {
        // Restriction types.
        const lBooleanType: BasePgslType = pContext.types.create(PgslBooleanType);
        const lFloatTypes: Array<BasePgslType> = [pContext.types.create(PgslNumericType, PgslNumericType.typeName.float32), pContext.types.create(PgslNumericType, PgslNumericType.typeName.float16)];
        const lNumericTypes: Array<BasePgslType> = [...lFloatTypes, pContext.types.create(PgslNumericType, PgslNumericType.typeName.signedInteger), pContext.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger)];

        // Vectors and matrices of each inner type.
        const lVectorsOf = (pDimension: number, pInnerTypes: Array<BasePgslType>): Array<BasePgslType> => {
            return pInnerTypes.map((pInnerType: BasePgslType) => {
                return pContext.types.create(PgslVectorType, pDimension, pInnerType);
            });
        };
        const lMatricesOf = (pMatrixName: PgslMatrixTypeName, pInnerTypes: Array<BasePgslType>): Array<BasePgslType> => {
            const [lColumns, lRows] = PgslMatrixType.dimensionsOf(pMatrixName);
            return pInnerTypes.map((pInnerType: BasePgslType) => {
                return pContext.types.create(PgslMatrixType, lColumns, lRows, pInnerType);
            });
        };

        switch (pTypeName) {
            // Array types.
            case PgslArrayType.typeName.array: return {
                parameters: [
                    [{ typeRestrictions: [], count: { min: 1, max: 100 } }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<BasePgslType>): BasePgslType => {
                    // Find the first concrete numeric type and check if all others match.
                    const lConcreteType: BasePgslType = pParameterList.find((pParam) => {
                        return pParam.isKind(BasePgslTypeKind.Concrete);
                    }) ?? pParameterList[0];

                    // Create length expression and trace it.
                    const lConstantLengthExpressionCst: LiteralValueExpressionCst = {
                        type: 'LiteralValueExpression',
                        textValue: pParameterList.length.toString(),
                        range: [0, 0, 0, 0]
                    };
                    const lConstantLengthExpressionAst: LiteralValueExpressionAst = new LiteralValueExpressionAst(lConstantLengthExpressionCst).process(pContext);

                    // Construct fixed array type.
                    return new PgslArrayType(lConcreteType, lConstantLengthExpressionAst);
                }
            };

            // Vector types: Vector2.
            case PgslVectorType.typeName.vector2: return {
                generics: [...lNumericTypes, lBooleanType],
                parameters: [
                    // Zero value
                    [],

                    // Identity
                    [{ typeRestrictions: [...lVectorsOf(2, [lBooleanType])] }],
                    [{ typeRestrictions: [...lVectorsOf(2, lNumericTypes)] }],

                    // Scalar
                    [{ typeRestrictions: [...lNumericTypes, lBooleanType], count: { min: 2, max: 2 } }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<BasePgslType>, pGeneric: BasePgslType | null) => {
                    // Find inner type by generic or first concrete type.
                    const lElementType: BasePgslType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.isKind(BasePgslTypeKind.Concrete);
                    }) ?? pParameterList[0];

                    return pContext.types.create(PgslVectorType, 2, lElementType);
                }
            };

            // Vector types: Vector3.
            case PgslVectorType.typeName.vector3: return {
                generics: [...lNumericTypes, lBooleanType],
                parameters: [
                    // Zero value
                    [],

                    // Identity
                    [{ typeRestrictions: [...lVectorsOf(3, [lBooleanType])] }],
                    [{ typeRestrictions: [...lVectorsOf(3, lNumericTypes)] }],

                    // Scalar
                    [{ typeRestrictions: [...lNumericTypes, lBooleanType], count: { min: 3, max: 3 } }],

                    // Vector2 Scalar
                    [
                        { typeRestrictions: [...lVectorsOf(2, [lBooleanType])] },
                        { typeRestrictions: [lBooleanType] }
                    ],
                    [
                        { typeRestrictions: [...lVectorsOf(2, lNumericTypes)] },
                        { typeRestrictions: [...lNumericTypes] }
                    ],
                    [
                        { typeRestrictions: [lBooleanType] },
                        { typeRestrictions: [...lVectorsOf(2, [lBooleanType])] }
                    ],
                    [
                        { typeRestrictions: [...lNumericTypes] },
                        { typeRestrictions: [...lVectorsOf(2, lNumericTypes)] }
                    ],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<BasePgslType>, pGeneric: BasePgslType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: BasePgslType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.isKind(BasePgslTypeKind.Concrete);
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return pContext.types.create(PgslVectorType, 3, lElementType);
                }
            };

            // Vector types: Vector4.
            case PgslVectorType.typeName.vector4: return {
                generics: [...lNumericTypes, lBooleanType],
                parameters: [
                    // Zero value
                    [],

                    // Identity
                    [{ typeRestrictions: [...lVectorsOf(4, [lBooleanType])] }],
                    [{ typeRestrictions: [...lVectorsOf(4, lNumericTypes)] }],

                    // Scalar
                    [{ typeRestrictions: [...lNumericTypes, lBooleanType], count: { min: 4, max: 4 } }],

                    // Vector2 Scalar Scalar
                    [
                        { typeRestrictions: [...lVectorsOf(2, [lBooleanType])] },
                        { typeRestrictions: [lBooleanType] },
                        { typeRestrictions: [lBooleanType] }
                    ],
                    [
                        { typeRestrictions: [...lVectorsOf(2, lNumericTypes)] },
                        { typeRestrictions: [...lNumericTypes] },
                        { typeRestrictions: [...lNumericTypes] }
                    ],

                    // Scalar Vector2 Scalar
                    [
                        { typeRestrictions: [lBooleanType] },
                        { typeRestrictions: [...lVectorsOf(2, [lBooleanType])] },
                        { typeRestrictions: [lBooleanType] }
                    ],
                    [
                        { typeRestrictions: [...lNumericTypes] },
                        { typeRestrictions: [...lVectorsOf(2, lNumericTypes)] },
                        { typeRestrictions: [...lNumericTypes] }
                    ],

                    // Scalar Scalar Vector2
                    [
                        { typeRestrictions: [lBooleanType] },
                        { typeRestrictions: [lBooleanType] },
                        { typeRestrictions: [...lVectorsOf(2, [lBooleanType])] },
                    ],
                    [
                        { typeRestrictions: [...lNumericTypes] },
                        { typeRestrictions: [...lNumericTypes] },
                        { typeRestrictions: [...lVectorsOf(2, lNumericTypes)] },
                    ],

                    // Vector2 Vector2
                    [
                        { typeRestrictions: [...lVectorsOf(2, [lBooleanType])] },
                        { typeRestrictions: [...lVectorsOf(2, [lBooleanType])] },
                    ],
                    [
                        { typeRestrictions: [...lVectorsOf(2, lNumericTypes)] },
                        { typeRestrictions: [...lVectorsOf(2, lNumericTypes)] },
                    ],

                    // Vector3 Scalar
                    [
                        { typeRestrictions: [...lVectorsOf(3, [lBooleanType])] },
                        { typeRestrictions: [lBooleanType] }
                    ],
                    [
                        { typeRestrictions: [...lVectorsOf(3, lNumericTypes)] },
                        { typeRestrictions: [...lNumericTypes] }
                    ],

                    // Scalar Vector3
                    [
                        { typeRestrictions: [lBooleanType] },
                        { typeRestrictions: [...lVectorsOf(3, [lBooleanType])] }
                    ],
                    [
                        { typeRestrictions: [...lNumericTypes] },
                        { typeRestrictions: [...lVectorsOf(3, lNumericTypes)] }
                    ],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<BasePgslType>, pGeneric: BasePgslType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: BasePgslType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.isKind(BasePgslTypeKind.Concrete);
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return pContext.types.create(PgslVectorType, 4, lElementType);
                }
            };

            // Matrix types.
            case PgslMatrixType.typeName.matrix22: return {
                generics: [...lFloatTypes],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [...lMatricesOf(PgslMatrixType.typeName.matrix22, lFloatTypes)] }],

                    // Scalar
                    [{ typeRestrictions: [...lFloatTypes], count: { min: 4, max: 4 } }],

                    // Vectors
                    [{ typeRestrictions: [...lVectorsOf(2, lFloatTypes)], count: { min: 2, max: 2 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<BasePgslType>, pGeneric: BasePgslType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: BasePgslType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.isKind(BasePgslTypeKind.Concrete);
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return pContext.types.create(PgslMatrixType, 2, 2, lElementType);
                }
            };
            case PgslMatrixType.typeName.matrix23: return {
                generics: [...lFloatTypes],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [...lMatricesOf(PgslMatrixType.typeName.matrix23, lFloatTypes)] }],

                    // Scalar
                    [{ typeRestrictions: [...lFloatTypes], count: { min: 6, max: 6 } }],

                    // Vectors
                    [{ typeRestrictions: [...lVectorsOf(3, lFloatTypes)], count: { min: 2, max: 2 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<BasePgslType>, pGeneric: BasePgslType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: BasePgslType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.isKind(BasePgslTypeKind.Concrete);
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return pContext.types.create(PgslMatrixType, 2, 3, lElementType);
                }
            };
            case PgslMatrixType.typeName.matrix24: return {
                generics: [...lFloatTypes],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [...lMatricesOf(PgslMatrixType.typeName.matrix24, lFloatTypes)] }],

                    // Scalar
                    [{ typeRestrictions: [...lFloatTypes], count: { min: 8, max: 8 } }],

                    // Vectors
                    [{ typeRestrictions: [...lVectorsOf(4, lFloatTypes)], count: { min: 2, max: 2 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<BasePgslType>, pGeneric: BasePgslType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: BasePgslType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.isKind(BasePgslTypeKind.Concrete);
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return pContext.types.create(PgslMatrixType, 2, 4, lElementType);
                }
            };
            case PgslMatrixType.typeName.matrix32: return {
                generics: [...lFloatTypes],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [...lMatricesOf(PgslMatrixType.typeName.matrix32, lFloatTypes)] }],

                    // Scalar
                    [{ typeRestrictions: [...lFloatTypes], count: { min: 6, max: 6 } }],

                    // Vectors
                    [{ typeRestrictions: [...lVectorsOf(2, lFloatTypes)], count: { min: 3, max: 3 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<BasePgslType>, pGeneric: BasePgslType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: BasePgslType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.isKind(BasePgslTypeKind.Concrete);
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return pContext.types.create(PgslMatrixType, 3, 2, lElementType);
                }
            };
            case PgslMatrixType.typeName.matrix33: return {
                generics: [...lFloatTypes],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [...lMatricesOf(PgslMatrixType.typeName.matrix33, lFloatTypes)] }],

                    // Scalar
                    [{ typeRestrictions: [...lFloatTypes], count: { min: 9, max: 9 } }],

                    // Vectors
                    [{ typeRestrictions: [...lVectorsOf(3, lFloatTypes)], count: { min: 3, max: 3 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<BasePgslType>, pGeneric: BasePgslType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: BasePgslType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.isKind(BasePgslTypeKind.Concrete);
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return pContext.types.create(PgslMatrixType, 3, 3, lElementType);
                }
            };
            case PgslMatrixType.typeName.matrix34: return {
                generics: [...lFloatTypes],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [...lMatricesOf(PgslMatrixType.typeName.matrix34, lFloatTypes)] }],

                    // Scalar
                    [{ typeRestrictions: [...lFloatTypes], count: { min: 12, max: 12 } }],

                    // Vectors
                    [{ typeRestrictions: [...lVectorsOf(4, lFloatTypes)], count: { min: 3, max: 3 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<BasePgslType>, pGeneric: BasePgslType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: BasePgslType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.isKind(BasePgslTypeKind.Concrete);
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return pContext.types.create(PgslMatrixType, 3, 4, lElementType);
                }
            };
            case PgslMatrixType.typeName.matrix42: return {
                generics: [...lFloatTypes],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [...lMatricesOf(PgslMatrixType.typeName.matrix42, lFloatTypes)] }],

                    // Scalar
                    [{ typeRestrictions: [...lFloatTypes], count: { min: 8, max: 8 } }],

                    // Vectors
                    [{ typeRestrictions: [...lVectorsOf(2, lFloatTypes)], count: { min: 4, max: 4 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<BasePgslType>, pGeneric: BasePgslType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: BasePgslType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.isKind(BasePgslTypeKind.Concrete);
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return pContext.types.create(PgslMatrixType, 4, 2, lElementType);
                }
            };

            case PgslMatrixType.typeName.matrix43: return {
                generics: [...lFloatTypes],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [...lMatricesOf(PgslMatrixType.typeName.matrix43, lFloatTypes)] }],

                    // Scalar
                    [{ typeRestrictions: [...lFloatTypes], count: { min: 12, max: 12 } }],

                    // Vectors
                    [{ typeRestrictions: [...lVectorsOf(3, lFloatTypes)], count: { min: 4, max: 4 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<BasePgslType>, pGeneric: BasePgslType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: BasePgslType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.isKind(BasePgslTypeKind.Concrete);
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return pContext.types.create(PgslMatrixType, 4, 3, lElementType);
                }
            };
            case PgslMatrixType.typeName.matrix44: return {
                generics: [...lFloatTypes],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [...lMatricesOf(PgslMatrixType.typeName.matrix44, lFloatTypes)] }],

                    // Scalar
                    [{ typeRestrictions: [...lFloatTypes], count: { min: 16, max: 16 } }],

                    // Vectors
                    [{ typeRestrictions: [...lVectorsOf(4, lFloatTypes)], count: { min: 4, max: 4 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<BasePgslType>, pGeneric: BasePgslType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: BasePgslType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.isKind(BasePgslTypeKind.Concrete);
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return pContext.types.create(PgslMatrixType, 4, 4, lElementType);
                }
            };

            // Scalar types.
            case PgslBooleanType.typeName.boolean: return {
                parameters: [
                    [{ typeRestrictions: [...lNumericTypes] }],
                    [{ typeRestrictions: [lBooleanType] }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext) => {
                    return pContext.types.create(PgslBooleanType);
                }
            };
            case PgslNumericType.typeName.float16: return {
                parameters: [
                    [{ typeRestrictions: [...lNumericTypes] }],
                    [{ typeRestrictions: [lBooleanType] }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext) => {
                    return pContext.types.create(PgslNumericType, PgslNumericType.typeName.float16);
                }
            };
            case PgslNumericType.typeName.float32: return {
                parameters: [
                    [{ typeRestrictions: [...lNumericTypes] }],
                    [{ typeRestrictions: [lBooleanType] }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext) => {
                    return pContext.types.create(PgslNumericType, PgslNumericType.typeName.float32);
                }
            };
            case PgslNumericType.typeName.signedInteger: return {
                parameters: [
                    [{ typeRestrictions: [...lNumericTypes] }],
                    [{ typeRestrictions: [lBooleanType] }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext) => {
                    return pContext.types.create(PgslNumericType, PgslNumericType.typeName.signedInteger);
                }
            };
            case PgslNumericType.typeName.unsignedInteger: return {
                parameters: [
                    [{ typeRestrictions: [...lNumericTypes] }],
                    [{ typeRestrictions: [lBooleanType] }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext) => {
                    return pContext.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger);
                }
            };
        }

        return null;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pContext - Build context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: NewExpressionCst): NewExpressionAstData {
        // Read call definitions.
        const lCallDefinition: NewExpressionAstCallDefinition | null = NewExpressionAst.callDefinition(pContext, pCst.typeName);

        // Build parameter expression list.
        const lParameterExpressionList: Array<IExpressionAst> = pCst.parameterList.map((pParameterCst) => {
            return ExpressionAstBuilder.build(pParameterCst).process(pContext);
        });

        // Map only the parameter types for result type resolution.
        const lParameterTypeList: Array<BasePgslType> = lParameterExpressionList.map((pParameterExpression) => {
            return pParameterExpression.data.resolveType;
        });

        // Build all written generic declarations. Only the first one is used.
        const lGenericDeclarationList: Array<TypeDeclarationAst> = pCst.genericList.map((pGenericCst) => {
            return new TypeDeclarationAst(pGenericCst).process(pContext);
        });

        const lGenericType: BasePgslType | null = lGenericDeclarationList.length > 0 ? lGenericDeclarationList[0].data.type : null;

        // Resolve result type.
        const lResultType: BasePgslType = (() => {
            // A type that can not be constructed resolves to an invalid type.
            if (!lCallDefinition) {
                return pContext.types.create(PgslInvalidType);
            }

            // Without parameters, only a generic can name the constructed type.
            if (lParameterTypeList.length === 0 && !lGenericType) {
                return pContext.types.create(PgslInvalidType);
            }

            return lCallDefinition.returnType(pContext, lParameterTypeList, lGenericType);
        })();

        // Find the lowest fixed state of all parameters.
        const lFixedState: PgslValueFixedState = (() => {
            // Create default variables starting with the stiffest state.
            let lFixedState: PgslValueFixedState = PgslValueFixedState.Constant;

            for (const lParameterExpression of lParameterExpressionList) {
                // Set the lowest fixed state.
                if (lParameterExpression.data.fixedState < lFixedState) {
                    lFixedState = lParameterExpression.data.fixedState;
                }
            }

            // Function is constant, parameters need to be to.
            return lFixedState;
        })();

        return {
            // Expression data.
            typeName: pCst.typeName,
            parameterList: lParameterExpressionList,
            genericList: lGenericDeclarationList,
            callDefinition: lCallDefinition,

            // Expression meta.
            fixedState: lFixedState,
            isStorage: false,
            resolveType: lResultType,
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Inherit,
        };
    }
}

export type NewExpressionAstCallDefinition = {
    generics?: Array<BasePgslType>;
    parameters: Array<Array<NewExpressionAstCallDefinitionParameter>>;
    returnType: (pContext: AbstractSyntaxTreeContext, pParameterTypes: Array<BasePgslType>, pGeneric: BasePgslType | null) => BasePgslType;
};

export type NewExpressionAstCallDefinitionParameter = {
    typeRestrictions: Array<BasePgslType>;
    count?: { min: number; max: number; };
};

export type NewExpressionAstData = {
    typeName: string;
    parameterList: Array<IExpressionAst>;
    genericList: Array<TypeDeclarationAst>;
    callDefinition: NewExpressionAstCallDefinition | null;
} & ExpressionAstData;