import type { LiteralValueExpressionCst, NewExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { TypeDeclarationAst } from '../../general/type-declaration-ast.ts';
import { BasePgslTypeKind, type BasePgslType } from '../../type/definition/base-pgsl-type.ts';
import { PgslArrayType } from '../../type/definition/pgsl-array-type.ts';
import { PgslBooleanType } from '../../type/definition/pgsl-boolean-type.ts';
import { PgslGenericType } from "../../type/definition/pgsl-generic-type.ts";
import { PgslInvalidType } from '../../type/definition/pgsl-invalid-type.ts';
import { PgslMatrixType } from '../../type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../type/definition/pgsl-vector-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';
import { LiteralValueExpressionAst } from './literal-value-expression-ast.ts';

/**
 * PGSL syntax tree of a new call expression with optional template list.
 */
export class NewExpressionAst extends AbstractSyntaxTree<NewExpressionCst, NewExpressionAstData> implements IExpressionAst {
    private static callDefinition(pTypeName: string): PgslNewExpressionCallDefinition | null {
        switch (pTypeName) {
            // Array types.
            case PgslArrayType.typeName.array: return {
                parameters: [
                    [{ typeRestriction: [], count: { min: 1, max: 100 } }]
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
                generics: ['numeric', PgslBooleanType.typeName.boolean],
                parameters: [
                    // Identity
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] }],
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector2}<numeric>`] }],

                    // Scalar
                    [{ typeRestriction: ['numeric', PgslBooleanType.typeName.boolean], count: { min: 2, max: 2 } }]
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
                generics: ['numeric', PgslBooleanType.typeName.boolean],
                parameters: [
                    // Identity
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector3}<${PgslBooleanType.typeName.boolean}>`] }],
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector3}<numeric>`] }],

                    // Scalar
                    [{ typeRestriction: ['numeric', PgslBooleanType.typeName.boolean], count: { min: 3, max: 3 } }],

                    // Vector2 Scalar
                    [
                        { typeRestriction: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] },
                        { typeRestriction: [PgslBooleanType.typeName.boolean] }
                    ],
                    [
                        { typeRestriction: [`${PgslVectorType.typeName.vector2}<numeric>`] },
                        { typeRestriction: ['numeric'] }
                    ],
                    [
                        { typeRestriction: [PgslBooleanType.typeName.boolean] },
                        { typeRestriction: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] }
                    ],
                    [
                        { typeRestriction: ['numeric'] },
                        { typeRestriction: [`${PgslVectorType.typeName.vector2}<numeric>`] }
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
                generics: ['numeric', PgslBooleanType.typeName.boolean],
                parameters: [
                    // Identity
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector4}<${PgslBooleanType.typeName.boolean}>`] }],
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector4}<numeric>`] }],

                    // Scalar
                    [{ typeRestriction: ['numeric', PgslBooleanType.typeName.boolean], count: { min: 4, max: 4 } }],

                    // Vector2 Scalar Scalar
                    [
                        { typeRestriction: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] },
                        { typeRestriction: [PgslBooleanType.typeName.boolean] },
                        { typeRestriction: [PgslBooleanType.typeName.boolean] }
                    ],
                    [
                        { typeRestriction: [`${PgslVectorType.typeName.vector2}<numeric>`] },
                        { typeRestriction: ['numeric'] },
                        { typeRestriction: ['numeric'] }
                    ],

                    // Scalar Vector2 Scalar
                    [
                        { typeRestriction: [PgslBooleanType.typeName.boolean] },
                        { typeRestriction: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] },
                        { typeRestriction: [PgslBooleanType.typeName.boolean] }
                    ],
                    [
                        { typeRestriction: ['numeric'] },
                        { typeRestriction: [`${PgslVectorType.typeName.vector2}<numeric>`] },
                        { typeRestriction: ['numeric'] }
                    ],

                    // Scalar Scalar Vector2
                    [
                        { typeRestriction: [PgslBooleanType.typeName.boolean] },
                        { typeRestriction: [PgslBooleanType.typeName.boolean] },
                        { typeRestriction: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] },
                    ],
                    [
                        { typeRestriction: ['numeric'] },
                        { typeRestriction: ['numeric'] },
                        { typeRestriction: [`${PgslVectorType.typeName.vector2}<numeric>`] },
                    ],

                    // Vector2 Vector2
                    [
                        { typeRestriction: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] },
                        { typeRestriction: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] },
                    ],
                    [
                        { typeRestriction: [`${PgslVectorType.typeName.vector2}<numeric>`] },
                        { typeRestriction: [`${PgslVectorType.typeName.vector2}<numeric>`] },
                    ],

                    // Vector3 Scalar
                    [
                        { typeRestriction: [`${PgslVectorType.typeName.vector3}<${PgslBooleanType.typeName.boolean}>`] },
                        { typeRestriction: [PgslBooleanType.typeName.boolean] }
                    ],
                    [
                        { typeRestriction: [`${PgslVectorType.typeName.vector3}<numeric>`] },
                        { typeRestriction: ['numeric'] }
                    ],

                    // Scalar Vector3
                    [
                        { typeRestriction: [PgslBooleanType.typeName.boolean] },
                        { typeRestriction: [`${PgslVectorType.typeName.vector3}<${PgslBooleanType.typeName.boolean}>`] }
                    ],
                    [
                        { typeRestriction: ['numeric'] },
                        { typeRestriction: [`${PgslVectorType.typeName.vector3}<numeric>`] }
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
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestriction: [`${PgslMatrixType.typeName.matrix22}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestriction: ['numeric-float'], count: { min: 4, max: 4 } }],

                    // Vectors
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector2}<numeric-float>`], count: { min: 2, max: 2 } }],
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
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestriction: [`${PgslMatrixType.typeName.matrix23}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestriction: ['numeric-float'], count: { min: 6, max: 6 } }],

                    // Vectors
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector3}<numeric-float>`], count: { min: 2, max: 2 } }],
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
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestriction: [`${PgslMatrixType.typeName.matrix24}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestriction: ['numeric-float'], count: { min: 8, max: 8 } }],

                    // Vectors
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector4}<numeric-float>`], count: { min: 2, max: 2 } }],
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
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestriction: [`${PgslMatrixType.typeName.matrix32}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestriction: ['numeric-float'], count: { min: 6, max: 6 } }],

                    // Vectors
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector2}<numeric-float>`], count: { min: 3, max: 3 } }],
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
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestriction: [`${PgslMatrixType.typeName.matrix33}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestriction: ['numeric-float'], count: { min: 9, max: 9 } }],

                    // Vectors
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector3}<numeric-float>`], count: { min: 3, max: 3 } }],
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
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestriction: [`${PgslMatrixType.typeName.matrix34}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestriction: ['numeric-float'], count: { min: 12, max: 12 } }],

                    // Vectors
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector4}<numeric-float>`], count: { min: 3, max: 3 } }],
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
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestriction: [`${PgslMatrixType.typeName.matrix42}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestriction: ['numeric-float'], count: { min: 8, max: 8 } }],

                    // Vectors
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector2}<numeric-float>`], count: { min: 4, max: 4 } }],
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
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestriction: [`${PgslMatrixType.typeName.matrix43}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestriction: ['numeric-float'], count: { min: 12, max: 12 } }],

                    // Vectors
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector3}<numeric-float>`], count: { min: 4, max: 4 } }],
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
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestriction: [`${PgslMatrixType.typeName.matrix44}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestriction: ['numeric-float'], count: { min: 16, max: 16 } }],

                    // Vectors
                    [{ typeRestriction: [`${PgslVectorType.typeName.vector4}<numeric-float>`], count: { min: 4, max: 4 } }],
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
                    [{ typeRestriction: ['numeric'] }],
                    [{ typeRestriction: [PgslBooleanType.typeName.boolean] }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext) => {
                    return pContext.types.create(PgslBooleanType);
                }
            };
            case PgslNumericType.typeName.float16: return {
                parameters: [
                    [{ typeRestriction: ['numeric'] }],
                    [{ typeRestriction: [PgslBooleanType.typeName.boolean] }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext) => {
                    return pContext.types.create(PgslNumericType, PgslNumericType.typeName.float16);
                }
            };
            case PgslNumericType.typeName.float32: return {
                parameters: [
                    [{ typeRestriction: ['numeric'] }],
                    [{ typeRestriction: [PgslBooleanType.typeName.boolean] }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext) => {
                    return pContext.types.create(PgslNumericType, PgslNumericType.typeName.float32);
                }
            };
            case PgslNumericType.typeName.signedInteger: return {
                parameters: [
                    [{ typeRestriction: ['numeric'] }],
                    [{ typeRestriction: [PgslBooleanType.typeName.boolean] }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext) => {
                    return pContext.types.create(PgslNumericType, PgslNumericType.typeName.signedInteger);
                }
            };
            case PgslNumericType.typeName.unsignedInteger: return {
                parameters: [
                    [{ typeRestriction: ['numeric'] }],
                    [{ typeRestriction: [PgslBooleanType.typeName.boolean] }]
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
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): NewExpressionAstData {
        // Read call definitions.
        const lCallDefinition: PgslNewExpressionCallDefinition | null = NewExpressionAst.callDefinition(this.cst.typeName);
        if (!lCallDefinition) {
            pContext.pushIncident(`Type '${this.cst.typeName}' cannot be constructed with 'new'.`, this);
            return {
                // Expression data.
                typeName: this.cst.typeName,
                parameterList: new Array<IExpressionAst>(),
                generic: null,

                // Expression meta.
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslInvalidType(),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Inherit,
            };
        }

        // Build parameter expression list.
        const lParameterExpressionList: Array<IExpressionAst> = this.cst.parameterList.map((pParameterCst) => {
            return ExpressionAstBuilder.build(pParameterCst).process(pContext);
        });

        // Map only the parameter types for result type resolution.
        const lParameterTypeList: Array<BasePgslType> = lParameterExpressionList.map((pParameterExpression) => {
            return pParameterExpression.data.resolveType;
        });

        // Only once generic is supported.
        if (this.cst.genericList.length > 1) {
            pContext.pushIncident(`Only one generic type is supported in 'new' expressions.`, this);
        }

        // Only types with generics can be constructed with a generic.
        if (this.cst.genericList.length > 0 && !lCallDefinition.generic) {
            pContext.pushIncident(`Type '${this.cst.typeName}' can not be constructed with a generic type.`, this);
        }

        // Build first generic declaration if available.
        const lGenericDeclaration: TypeDeclarationAst | null = (() => {
            if (this.cst.genericList.length > 0) {
                return new TypeDeclarationAst(this.cst.genericList[0]).process(pContext);
            }

            return null;
        })();
        const lGenericType: BasePgslType | null = lGenericDeclaration?.data.type ?? null;

        // Find the lowest fixed state of all parameters while validating the expression types
        const lFixedState: PgslValueFixedState = (() => {
            // Create default variables starting with the stiffest state.
            let lFixedState: PgslValueFixedState = PgslValueFixedState.Constant;

            for (const lParameterExpression of lParameterExpressionList) {
                // Set the lowest fixed state.
                if (lParameterExpression.data.fixedState < lFixedState) {
                    lFixedState = lParameterExpression.data.fixedState;
                }

                // Must be constructable.
                if (!lParameterExpression.data.resolveType.isKind(BasePgslTypeKind.Constructible)) {
                    pContext.pushIncident(`New expression type must be constructible.`, this);
                }

                // Must be fixed.
                if (!lParameterExpression.data.resolveType.isKind(BasePgslTypeKind.FixedFootprint)) {
                    pContext.pushIncident(`New expression type must be length fixed.`, this);
                }
            }

            // Function is constant, parameters need to be to.
            return lFixedState;
        })();

        // Validate used generic against definition.
        (() => {
            if (!lGenericType || !lCallDefinition.generic) {
                return;
            }

            // Check each defined generic agains the used one.
            if (!lCallDefinition.generic.accepts(lGenericType)) {
                pContext.pushIncident(`Generic type is not valid for constructed type '${this.cst.typeName}'.`, this);
            }
        })();

        // Validate parameter list against definitions and find matching one.
        (() => {
            DEFINTION_CHECK: for (const lParameterDefinitionList of lCallDefinition.parameters) {
                // Save current index of parameter list.
                let lParameterIndex: number = 0;

                // Check parameters parts.
                for (const lParameterDefinition of lParameterDefinitionList) {
                    const lValidParameterType: BasePgslType = lParameterDefinition.typeRestriction;
                    const lParameterCountMin: number = lParameterDefinition.count?.min ?? 1;
                    const lParameterCountMax: number = lParameterDefinition.count?.max ?? 1;

                    // Calculate iteration stop index based on max and current index.
                    const lParameterMinIndex: number = lParameterIndex + lParameterCountMin - 1;
                    const lParameterMaxIndex: number = lParameterIndex + lParameterCountMax - 1;

                    // Iterate expected parameters until max count or end of parameter list is reached.
                    for (; lParameterIndex < lParameterTypeList.length; lParameterIndex++) {
                        // Break if max count reached.
                        if (lParameterIndex > lParameterMaxIndex) {
                            break;
                        }

                        // Get actual parameter type.
                        const lActualType: BasePgslType = lParameterTypeList[lParameterIndex];

                        // Skip this definition on mismatch.
                        if (!lActualType.accepts(lValidParameterType)) {
                            break;
                        }
                    }

                    // Check if min count was reached and continue with next definition on failure.
                    if (lParameterIndex <= lParameterMinIndex) {
                        continue DEFINTION_CHECK;
                    }
                }

                // Definition matched.
                return;
            }

            // No matching definition found.
            pContext.pushIncident(`No matching constructor found for type '${this.cst.typeName}' with ${this.cst.parameterList.length} parameter(s).`, this);
        })();

        // Resolve result type.
        const lResultType: BasePgslType = lCallDefinition.returnType(pContext, lParameterTypeList, lGenericType);

        return {
            // Expression data.
            typeName: this.cst.typeName,
            parameterList: lParameterExpressionList,
            generic: lGenericDeclaration,

            // Expression meta.
            fixedState: lFixedState,
            isStorage: false,
            resolveType: lResultType,
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Inherit,
        };
    }
}

type PgslNewExpressionCallDefinition = {
    generic?: PgslGenericType;
    parameters: Array<Array<PgslNewExpressionCallDefinitionParameter>>;
    returnType: (pContext: AbstractSyntaxTreeContext, pParameterTypes: Array<BasePgslType>, pGeneric: BasePgslType | null) => BasePgslType;
};

type PgslNewExpressionCallDefinitionParameter = {
    typeRestriction: Array<string>;
    count?: { min: number; max: number; };
};

export type NewExpressionAstData = {
    typeName: string;
    parameterList: Array<IExpressionAst>;
    generic: TypeDeclarationAst | null;
} & ExpressionAstData;