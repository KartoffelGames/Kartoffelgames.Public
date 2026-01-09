import type { LiteralValueExpressionCst, NewExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { TypeDeclarationAst } from '../../general/type-declaration-ast.ts';
import type { IType } from '../../type/i-type.interface.ts';
import { PgslArrayType } from '../../type/pgsl-array-type.ts';
import { PgslBooleanType } from '../../type/pgsl-boolean-type.ts';
import { PgslInvalidType } from '../../type/pgsl-invalid-type.ts';
import { PgslMatrixType } from '../../type/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../type/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../type/pgsl-vector-type.ts';
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
                    [{ typeRestrictions: [], count: { min: 1, max: 100 } }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IType>): IType => {
                    // Find the first concrete numeric type and check if all others match.
                    const lConcreteType: IType = pParameterList.find((pParam) => {
                        return pParam.data.concrete;
                    }) ?? pParameterList[0];

                    // Create length expression and trace it.
                    const lConstantLengthExpressionCst: LiteralValueExpressionCst = {
                        type: 'LiteralValueExpression',
                        textValue: pParameterList.length.toString(),
                        range: [0, 0, 0, 0]
                    };
                    const lConstantLengthExpressionAst: LiteralValueExpressionAst = new LiteralValueExpressionAst(lConstantLengthExpressionCst).process(pContext);

                    // Construct fixed array type.
                    return new PgslArrayType(lConcreteType, lConstantLengthExpressionAst).process(pContext);
                }
            };

            // Vector types: Vector2.
            case PgslVectorType.typeName.vector2: return {
                generics: ['numeric', PgslBooleanType.typeName.boolean],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] }],
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector2}<numeric>`] }],

                    // Scalar
                    [{ typeRestrictions: ['numeric', PgslBooleanType.typeName.boolean], count: { min: 2, max: 2 } }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IType>, pGeneric: IType | null) => {
                    // Find inner type by generic or first concrete type.
                    const lElementType: IType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.data.concrete;
                    }) ?? pParameterList[0];

                    return new PgslVectorType(2, lElementType).process(pContext);
                }
            };

            // Vector types: Vector3.
            case PgslVectorType.typeName.vector3: return {
                generics: ['numeric', PgslBooleanType.typeName.boolean],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector3}<${PgslBooleanType.typeName.boolean}>`] }],
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector3}<numeric>`] }],

                    // Scalar
                    [{ typeRestrictions: ['numeric', PgslBooleanType.typeName.boolean], count: { min: 3, max: 3 } }],

                    // Vector2 Scalar
                    [
                        { typeRestrictions: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] },
                        { typeRestrictions: [PgslBooleanType.typeName.boolean] }
                    ],
                    [
                        { typeRestrictions: [`${PgslVectorType.typeName.vector2}<numeric>`] },
                        { typeRestrictions: ['numeric'] }
                    ],
                    [
                        { typeRestrictions: [PgslBooleanType.typeName.boolean] },
                        { typeRestrictions: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] }
                    ],
                    [
                        { typeRestrictions: ['numeric'] },
                        { typeRestrictions: [`${PgslVectorType.typeName.vector2}<numeric>`] }
                    ],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IType>, pGeneric: IType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: IType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.data.concrete;
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return new PgslVectorType(3, lElementType).process(pContext);
                }
            };

            // Vector types: Vector4.
            case PgslVectorType.typeName.vector4: return {
                generics: ['numeric', PgslBooleanType.typeName.boolean],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector4}<${PgslBooleanType.typeName.boolean}>`] }],
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector4}<numeric>`] }],

                    // Scalar
                    [{ typeRestrictions: ['numeric', PgslBooleanType.typeName.boolean], count: { min: 4, max: 4 } }],

                    // Vector2 Scalar Scalar
                    [
                        { typeRestrictions: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] },
                        { typeRestrictions: [PgslBooleanType.typeName.boolean] },
                        { typeRestrictions: [PgslBooleanType.typeName.boolean] }
                    ],
                    [
                        { typeRestrictions: [`${PgslVectorType.typeName.vector2}<numeric>`] },
                        { typeRestrictions: ['numeric'] },
                        { typeRestrictions: ['numeric'] }
                    ],

                    // Scalar Vector2 Scalar
                    [
                        { typeRestrictions: [PgslBooleanType.typeName.boolean] },
                        { typeRestrictions: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] },
                        { typeRestrictions: [PgslBooleanType.typeName.boolean] }
                    ],
                    [
                        { typeRestrictions: ['numeric'] },
                        { typeRestrictions: [`${PgslVectorType.typeName.vector2}<numeric>`] },
                        { typeRestrictions: ['numeric'] }
                    ],

                    // Scalar Scalar Vector2
                    [
                        { typeRestrictions: [PgslBooleanType.typeName.boolean] },
                        { typeRestrictions: [PgslBooleanType.typeName.boolean] },
                        { typeRestrictions: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] },
                    ],
                    [
                        { typeRestrictions: ['numeric'] },
                        { typeRestrictions: ['numeric'] },
                        { typeRestrictions: [`${PgslVectorType.typeName.vector2}<numeric>`] },
                    ],

                    // Vector2 Vector2
                    [
                        { typeRestrictions: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] },
                        { typeRestrictions: [`${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>`] },
                    ],
                    [
                        { typeRestrictions: [`${PgslVectorType.typeName.vector2}<numeric>`] },
                        { typeRestrictions: [`${PgslVectorType.typeName.vector2}<numeric>`] },
                    ],

                    // Vector3 Scalar
                    [
                        { typeRestrictions: [`${PgslVectorType.typeName.vector3}<${PgslBooleanType.typeName.boolean}>`] },
                        { typeRestrictions: [PgslBooleanType.typeName.boolean] }
                    ],
                    [
                        { typeRestrictions: [`${PgslVectorType.typeName.vector3}<numeric>`] },
                        { typeRestrictions: ['numeric'] }
                    ],

                    // Scalar Vector3
                    [
                        { typeRestrictions: [PgslBooleanType.typeName.boolean] },
                        { typeRestrictions: [`${PgslVectorType.typeName.vector3}<${PgslBooleanType.typeName.boolean}>`] }
                    ],
                    [
                        { typeRestrictions: ['numeric'] },
                        { typeRestrictions: [`${PgslVectorType.typeName.vector3}<numeric>`] }
                    ],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IType>, pGeneric: IType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: IType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.data.concrete;
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return new PgslVectorType(4, lElementType).process(pContext);
                }
            };

            // Matrix types.
            case PgslMatrixType.typeName.matrix22: return {
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [`${PgslMatrixType.typeName.matrix22}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestrictions: ['numeric-float'], count: { min: 4, max: 4 } }],

                    // Vectors
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector2}<numeric-float>`], count: { min: 2, max: 2 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IType>, pGeneric: IType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: IType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.data.concrete;
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return new PgslMatrixType(2, 2, lElementType).process(pContext);
                }
            };
            case PgslMatrixType.typeName.matrix23: return {
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [`${PgslMatrixType.typeName.matrix23}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestrictions: ['numeric-float'], count: { min: 6, max: 6 } }],

                    // Vectors
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector3}<numeric-float>`], count: { min: 2, max: 2 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IType>, pGeneric: IType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: IType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.data.concrete;
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return new PgslMatrixType(2, 3, lElementType).process(pContext);
                }
            };
            case PgslMatrixType.typeName.matrix24: return {
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [`${PgslMatrixType.typeName.matrix24}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestrictions: ['numeric-float'], count: { min: 8, max: 8 } }],

                    // Vectors
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector4}<numeric-float>`], count: { min: 2, max: 2 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IType>, pGeneric: IType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: IType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.data.concrete;
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return new PgslMatrixType(2, 4, lElementType).process(pContext);
                }
            };
            case PgslMatrixType.typeName.matrix32: return {
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [`${PgslMatrixType.typeName.matrix32}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestrictions: ['numeric-float'], count: { min: 6, max: 6 } }],

                    // Vectors
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector2}<numeric-float>`], count: { min: 3, max: 3 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IType>, pGeneric: IType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: IType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.data.concrete;
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return new PgslMatrixType(3, 2, lElementType).process(pContext);
                }
            };
            case PgslMatrixType.typeName.matrix33: return {
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [`${PgslMatrixType.typeName.matrix33}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestrictions: ['numeric-float'], count: { min: 9, max: 9 } }],

                    // Vectors
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector3}<numeric-float>`], count: { min: 3, max: 3 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IType>, pGeneric: IType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: IType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.data.concrete;
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return new PgslMatrixType(3, 3, lElementType).process(pContext);
                }
            };
            case PgslMatrixType.typeName.matrix34: return {
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [`${PgslMatrixType.typeName.matrix34}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestrictions: ['numeric-float'], count: { min: 12, max: 12 } }],

                    // Vectors
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector4}<numeric-float>`], count: { min: 3, max: 3 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IType>, pGeneric: IType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: IType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.data.concrete;
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return new PgslMatrixType(3, 4, lElementType).process(pContext);
                }
            };
            case PgslMatrixType.typeName.matrix42: return {
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [`${PgslMatrixType.typeName.matrix42}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestrictions: ['numeric-float'], count: { min: 8, max: 8 } }],

                    // Vectors
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector2}<numeric-float>`], count: { min: 4, max: 4 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IType>, pGeneric: IType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: IType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.data.concrete;
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return new PgslMatrixType(4, 2, lElementType).process(pContext);
                }
            };

            case PgslMatrixType.typeName.matrix43: return {
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [`${PgslMatrixType.typeName.matrix43}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestrictions: ['numeric-float'], count: { min: 12, max: 12 } }],

                    // Vectors
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector3}<numeric-float>`], count: { min: 4, max: 4 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IType>, pGeneric: IType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: IType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.data.concrete;
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return new PgslMatrixType(4, 3, lElementType).process(pContext);
                }
            };
            case PgslMatrixType.typeName.matrix44: return {
                generics: ['numeric-float'],
                parameters: [
                    // Identity
                    [{ typeRestrictions: [`${PgslMatrixType.typeName.matrix44}<numeric-float>`] }],

                    // Scalar
                    [{ typeRestrictions: ['numeric-float'], count: { min: 16, max: 16 } }],

                    // Vectors
                    [{ typeRestrictions: [`${PgslVectorType.typeName.vector4}<numeric-float>`], count: { min: 4, max: 4 } }],
                ],
                returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IType>, pGeneric: IType | null) => {
                    // Find inner type by generic or first concrete type.
                    let lElementType: IType = pGeneric ?? pParameterList.find((pParam) => {
                        return pParam.data.concrete;
                    }) ?? pParameterList[0];

                    // If element type is a vector, extract inner type.
                    if (lElementType instanceof PgslVectorType) {
                        lElementType = lElementType.innerType;
                    }

                    return new PgslMatrixType(4, 4, lElementType).process(pContext);
                }
            };

            // Scalar types.
            case PgslBooleanType.typeName.boolean: return {
                parameters: [
                    [{ typeRestrictions: ['numeric'] }],
                    [{ typeRestrictions: [PgslBooleanType.typeName.boolean] }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext) => {
                    return new PgslBooleanType().process(pContext);
                }
            };
            case PgslNumericType.typeName.float16: return {
                parameters: [
                    [{ typeRestrictions: ['numeric'] }],
                    [{ typeRestrictions: [PgslBooleanType.typeName.boolean] }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext) => {
                    return new PgslNumericType(PgslNumericType.typeName.float16).process(pContext);
                }
            };
            case PgslNumericType.typeName.float32: return {
                parameters: [
                    [{ typeRestrictions: ['numeric'] }],
                    [{ typeRestrictions: [PgslBooleanType.typeName.boolean] }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext) => {
                    return new PgslNumericType(PgslNumericType.typeName.float32).process(pContext);
                }
            };
            case PgslNumericType.typeName.signedInteger: return {
                parameters: [
                    [{ typeRestrictions: ['numeric'] }],
                    [{ typeRestrictions: [PgslBooleanType.typeName.boolean] }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext) => {
                    return new PgslNumericType(PgslNumericType.typeName.signedInteger).process(pContext);
                }
            };
            case PgslNumericType.typeName.unsignedInteger: return {
                parameters: [
                    [{ typeRestrictions: ['numeric'] }],
                    [{ typeRestrictions: [PgslBooleanType.typeName.boolean] }]
                ],
                returnType: (pContext: AbstractSyntaxTreeContext) => {
                    return new PgslNumericType(PgslNumericType.typeName.unsignedInteger).process(pContext);
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
                parameterList: new Array<IExpressionAst>(),

                // Expression meta.
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslInvalidType().process(pContext),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Inherit,
            };
        }

        // Build parameter expression list.
        const lParameterExpressionList: Array<IExpressionAst> = this.cst.parameterList.map((pParameterCst) => {
            return ExpressionAstBuilder.build(pParameterCst, pContext);
        });

        // Map only the parameter types for result type resolution.
        const lParameterTypeList: Array<IType> = lParameterExpressionList.map((pParameterExpression) => {
            return pParameterExpression.data.resolveType;
        });

        // Only once generic is supported.
        if (this.cst.genericList.length > 1) {
            pContext.pushIncident(`Only one generic type is supported in 'new' expressions.`, this);
        }

        // Build first generic type if available.
        const lGenericType: IType | null = (() => {
            if (this.cst.genericList.length > 0) {
                return new TypeDeclarationAst(this.cst.genericList[0]).process(pContext).data.type;
            }

            return null;
        })();

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
                if (!lParameterExpression.data.resolveType.data.constructible) {
                    pContext.pushIncident(`New expression type must be constructible.`, this);
                }

                // Must be fixed.
                if (!lParameterExpression.data.resolveType.data.fixedFootprint) {
                    pContext.pushIncident(`New expression type must be length fixed.`, this);
                }
            }

            // Function is constant, parameters need to be to.
            return lFixedState;
        })();

        // Validate used generic against definition.
        (() => {
            if (!lGenericType || !lCallDefinition.generics || lCallDefinition.generics.length === 0) {
                return;
            }

            // Check each defined generic agains the used one.
            for (const lGenericName of lCallDefinition.generics) {
                if (lGenericType.data.metaTypes.includes(lGenericName)) {
                    return;
                }
            }

            pContext.pushIncident(`Generic type is not valid for constructed type '${this.cst.typeName}'.`, this);
        })();

        // Validate parameter list against definitions and find matching one.
        (() => {
            DEFINTION_CHECK: for (const lParameterDefinitionList of lCallDefinition.parameters) {
                // Save current index of parameter list.
                let lParameterIndex: number = 0;

                // Check parameters parts.
                for (const lParameterDefinition of lParameterDefinitionList) {
                    const lValidParameterTypeList: Array<string> = lParameterDefinition.typeRestrictions;
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
                        const lActualType: IType = lParameterTypeList[lParameterIndex];

                        // Check type restrictions.
                        const lTypeMatched: boolean = (() => {
                            // No restrictions means always match.
                            if (lValidParameterTypeList.length === 0) {
                                return true;
                            }

                            // Check each defined generic agains the used one.
                            for (const lValidParameterType of lValidParameterTypeList) {
                                if (lActualType.data.metaTypes.includes(lValidParameterType)) {
                                    return true;
                                }
                            }

                            return false;
                        })();

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

                // Definition matched.
                return;
            }

            // No matching definition found.
            pContext.pushIncident(`No matching constructor found for type '${this.cst.typeName}' with ${this.cst.parameterList.length} parameter(s).`, this);
        })();

        // Resolve result type.
        const lResultType: IType = lCallDefinition.returnType(pContext, lParameterTypeList, lGenericType);

        return {
            // Expression data.
            parameterList: lParameterExpressionList,

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
    generics?: Array<string>;
    parameters: Array<Array<PgslNewExpressionCallDefinitionParameter>>;
    returnType: (pContext: AbstractSyntaxTreeContext, pParameterTypes: Array<IType>, pGeneric: IType | null) => IType;
};

type PgslNewExpressionCallDefinitionParameter = {
    typeRestrictions: Array<string>;
    count?: { min: number; max: number; };
};

export type NewExpressionAstData = {
    parameterList: Array<IExpressionAst>;
} & ExpressionAstData;