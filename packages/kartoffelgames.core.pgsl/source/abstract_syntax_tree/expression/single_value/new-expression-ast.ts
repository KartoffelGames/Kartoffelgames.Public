import { LiteralValueExpressionCst, NewExpressionCst } from "../../../concrete_syntax_tree/expression.type.ts";
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import { PgslArrayType } from "../../../type/pgsl-array-type.ts";
import { PgslBooleanType } from "../../../type/pgsl-boolean-type.ts";
import { PgslInvalidType } from "../../../type/pgsl-invalid-type.ts";
import { PgslMatrixType } from "../../../type/pgsl-matrix-type.ts";
import { PgslNumericType } from "../../../type/pgsl-numeric-type.ts";
import { PgslType, PgslTypeConstructor } from '../../../type/pgsl-type.ts';
import { PgslVectorType } from "../../../type/pgsl-vector-type.ts";
import { AbstractSyntaxTreeContext } from "../../abstract-syntax-tree-context.ts";
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from "../expression-ast-builder.ts";
import { ExpressionAstData, IExpressionAst } from "../i-expression-ast.interface.ts";
import { LiteralValueExpressionAst } from "./literal-value-expression-ast.ts";

/**
 * PGSL syntax tree of a new call expression with optional template list.
 */
export class NewExpressionAst extends AbstractSyntaxTree<NewExpressionCst, NewExpressionAstData> implements IExpressionAst {
    private static callDefinition(pTypeName: string): Array<PgslNewExpressionCallDefinition> | null {
        switch (pTypeName) {
            // Array types.
            case PgslArrayType.typeName.array: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 1, max: 100 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>): PgslType => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = lConcreteTypeExpression.data.returnType;

                        // Create length expression and trace it.
                        const lConstantLengthExpressionCst: LiteralValueExpressionCst = {
                            type: 'LiteralValueExpression',
                            textValue: pParameterList.length.toString(),
                            range: lConcreteTypeExpression.cst.range
                        };
                        const lConstantLengthExpressionAst: LiteralValueExpressionAst = new LiteralValueExpressionAst(lConstantLengthExpressionCst, pContext);

                        // Construct fixed array type.
                        return new PgslArrayType(pContext, lElementType, lConstantLengthExpressionAst);
                    }
                }
            ];

            // Vector types.
            case PgslVectorType.typeName.vector2: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 2, max: 2 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = lConcreteTypeExpression.data.returnType;

                        return new PgslVectorType(pContext, 2, lElementType);
                    }
                }
            ];
            case PgslVectorType.typeName.vector3: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 3, max: 3 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = lConcreteTypeExpression.data.returnType;

                        return new PgslVectorType(pContext, 3, lElementType);
                    }
                },
                {
                    parameterTypes: [PgslVectorType, PgslNumericType],
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pParameterList[0].data.returnType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lElementType.dimension !== 2) {
                            throw new Error(`Invalid vector type: ${lElementType.dimension}. Expected: 2.`);
                        }

                        return new PgslVectorType(pContext, 3, lElementType.innerType);
                    }
                },
                {
                    parameterTypes: [PgslNumericType, PgslVectorType],
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pParameterList[1].data.returnType as PgslVectorType;

                        return new PgslVectorType(pContext, 3, lElementType.innerType);
                    }
                }
            ];
            case PgslVectorType.typeName.vector4: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 4, max: 4 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = lConcreteTypeExpression.data.returnType;

                        return new PgslVectorType(pContext, 4, lElementType);
                    }
                },

                // Parameters with vector2. 
                {
                    parameterTypes: [PgslVectorType, PgslNumericType, PgslNumericType],
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pParameterList[0].data.returnType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lElementType.dimension !== 2) {
                            throw new Error(`Invalid vector type: ${lElementType.dimension}. Expected: 2.`);
                        }

                        return new PgslVectorType(pContext, 4, lElementType.innerType);
                    }
                },
                {
                    parameterTypes: [PgslNumericType, PgslVectorType, PgslNumericType],
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pParameterList[1].data.returnType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lElementType.dimension !== 2) {
                            throw new Error(`Invalid vector type: ${lElementType.dimension}. Expected: 2.`);
                        }

                        return new PgslVectorType(pContext, 4, lElementType.innerType);
                    }
                },
                {
                    parameterTypes: [PgslNumericType, PgslNumericType, PgslVectorType],
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pParameterList[2].data.returnType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lElementType.dimension !== 2) {
                            throw new Error(`Invalid vector type: ${lElementType.dimension}. Expected: 2.`);
                        }

                        return new PgslVectorType(pContext, 4, lElementType.innerType);
                    }
                },
                {
                    parameterTypes: [PgslVectorType, PgslVectorType],
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = lConcreteTypeExpression.data.returnType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lElementType.dimension !== 2) {
                            throw new Error(`Invalid vector type: ${lElementType.dimension}. Expected: 2.`);
                        }

                        return new PgslVectorType(pContext, 4, lElementType.innerType);
                    }
                },

                // Parameters with vector3.
                {
                    parameterTypes: [PgslVectorType, PgslNumericType],
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pParameterList[0].data.returnType as PgslVectorType;

                        // Vector type must be of dimension 3.
                        if (lElementType.dimension !== 3) {
                            throw new Error(`Invalid vector type: ${lElementType.dimension}. Expected: 3.`);
                        }

                        return new PgslVectorType(pContext, 4, lElementType.innerType);
                    }
                },
                {
                    parameterTypes: [PgslNumericType, PgslVectorType],
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pParameterList[1].data.returnType as PgslVectorType;

                        // Vector type must be of dimension 3.
                        if (lElementType.dimension !== 3) {
                            throw new Error(`Invalid vector type: ${lElementType.dimension}. Expected: 3.`);
                        }

                        return new PgslVectorType(pContext, 4, lElementType.innerType);
                    }
                },
            ];

            // Matrix types.
            case PgslMatrixType.typeName.matrix22: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 4, max: 4 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = lConcreteTypeExpression.data.returnType;

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix22, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 2, max: 2 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = lConcreteTypeExpression.data.returnType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lVectorType.dimension !== 2) {
                            pContext.pushIncident(`Matrix22 construction from vectors requires vectors of dimension 2.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix22, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix23: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 6, max: 6 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = lConcreteTypeExpression.data.returnType;

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix23, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 2, max: 2 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = lConcreteTypeExpression.data.returnType as PgslVectorType;

                        // Vector type must be of dimension 3.
                        if (lVectorType.dimension !== 3) {
                            pContext.pushIncident(`Matrix23 construction from vectors requires vectors of dimension 3.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix23, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix24: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 8, max: 8 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = lConcreteTypeExpression.data.returnType;

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix24, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 2, max: 2 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = lConcreteTypeExpression.data.returnType as PgslVectorType;

                        // Vector type must be of dimension 4.
                        if (lVectorType.dimension !== 4) {
                            pContext.pushIncident(`Matrix24 construction from vectors requires vectors of dimension 4.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix24, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix32: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 6, max: 6 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = lConcreteTypeExpression.data.returnType;

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix32, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 3, max: 3 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = lConcreteTypeExpression.data.returnType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lVectorType.dimension !== 2) {
                            pContext.pushIncident(`Matrix32 construction from vectors requires vectors of dimension 2.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix32, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix33: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 9, max: 9 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = lConcreteTypeExpression.data.returnType;

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix33, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 3, max: 3 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = lConcreteTypeExpression.data.returnType as PgslVectorType;

                        // Vector type must be of dimension 3.
                        if (lVectorType.dimension !== 3) {
                            pContext.pushIncident(`Matrix33 construction from vectors requires vectors of dimension 3.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix33, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix34: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 12, max: 12 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = lConcreteTypeExpression.data.returnType;

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix34, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 3, max: 3 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = lConcreteTypeExpression.data.returnType as PgslVectorType;

                        // Vector type must be of dimension 4.
                        if (lVectorType.dimension !== 4) {
                            pContext.pushIncident(`Matrix34 construction from vectors requires vectors of dimension 4.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix34, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix42: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 8, max: 8 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = lConcreteTypeExpression.data.returnType;

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix42, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 4, max: 4 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = lConcreteTypeExpression.data.returnType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lVectorType.dimension !== 2) {
                            pContext.pushIncident(`Matrix42 construction from vectors requires vectors of dimension 2.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix42, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix43: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 12, max: 12 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = lConcreteTypeExpression.data.returnType;

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix43, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 4, max: 4 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = lConcreteTypeExpression.data.returnType as PgslVectorType;

                        // Vector type must be of dimension 3.
                        if (lVectorType.dimension !== 3) {
                            pContext.pushIncident(`Matrix43 construction from vectors requires vectors of dimension 3.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix43, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix44: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 16, max: 16 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = lConcreteTypeExpression.data.returnType;

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix44, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 4, max: 4 },
                    returnType: (pContext: AbstractSyntaxTreeContext, pParameterList: Array<IExpressionAst>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: IExpressionAst = pParameterList.find((pParam) => {
                            return pParam.data.returnType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = lConcreteTypeExpression.data.returnType as PgslVectorType;

                        // Vector type must be of dimension 4.
                        if (lVectorType.dimension !== 4) {
                            pContext.pushIncident(`Matrix44 construction from vectors requires vectors of dimension 4.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pContext, PgslMatrixType.typeName.matrix44, lVectorType.innerType);
                    }
                }
            ];

            // Scalar types.
            case PgslBooleanType.typeName.boolean: return [
                {
                    parameterTypes: [PgslBooleanType],
                    returnType: (pContext: AbstractSyntaxTreeContext, _pParameterList: Array<IExpressionAst>) => new PgslBooleanType(pContext)
                },
                {
                    parameterTypes: [PgslNumericType],
                    returnType: (pContext: AbstractSyntaxTreeContext, _pParameterList: Array<IExpressionAst>) => new PgslBooleanType(pContext)
                }
            ];
            case PgslNumericType.typeName.float16: return [
                {
                    parameterTypes: [PgslBooleanType],
                    returnType: (pContext: AbstractSyntaxTreeContext, _pParameterList: Array<IExpressionAst>) => new PgslNumericType(pContext, PgslNumericType.typeName.float16)
                },
                {
                    parameterTypes: [PgslNumericType],
                    returnType: (pContext: AbstractSyntaxTreeContext, _pParameterList: Array<IExpressionAst>) => new PgslNumericType(pContext, PgslNumericType.typeName.float16)
                }
            ];
            case PgslNumericType.typeName.float32: return [
                {
                    parameterTypes: [PgslBooleanType],
                    returnType: (pContext: AbstractSyntaxTreeContext, _pParameterList: Array<IExpressionAst>) => new PgslNumericType(pContext, PgslNumericType.typeName.float32)
                },
                {
                    parameterTypes: [PgslNumericType],
                    returnType: (pContext: AbstractSyntaxTreeContext, _pParameterList: Array<IExpressionAst>) => new PgslNumericType(pContext, PgslNumericType.typeName.float32)
                }
            ];
            case PgslNumericType.typeName.signedInteger: return [
                {
                    parameterTypes: [PgslBooleanType],
                    returnType: (pContext: AbstractSyntaxTreeContext, _pParameterList: Array<IExpressionAst>) => new PgslNumericType(pContext, PgslNumericType.typeName.signedInteger)
                },
                {
                    parameterTypes: [PgslNumericType],
                    returnType: (pContext: AbstractSyntaxTreeContext, _pParameterList: Array<IExpressionAst>) => new PgslNumericType(pContext, PgslNumericType.typeName.signedInteger)
                }
            ];
            case PgslNumericType.typeName.unsignedInteger: return [
                {
                    parameterTypes: [PgslBooleanType],
                    returnType: (pContext: AbstractSyntaxTreeContext, _pParameterList: Array<IExpressionAst>) => new PgslNumericType(pContext, PgslNumericType.typeName.unsignedInteger)
                },
                {
                    parameterTypes: [PgslNumericType],
                    returnType: (pContext: AbstractSyntaxTreeContext, _pParameterList: Array<IExpressionAst>) => new PgslNumericType(pContext, PgslNumericType.typeName.unsignedInteger)
                }
            ];
        }

        return null;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pContext - Build context.
     */
    protected override process(pContext: AbstractSyntaxTreeContext): NewExpressionAstData {
        // Read call definitions.
        const lCallDefinitions: Array<PgslNewExpressionCallDefinition> | null = NewExpressionAst.callDefinition(this.cst.typeName);
        if (!lCallDefinitions) {
            pContext.pushIncident(`Type '${this.cst.typeName}' cannot be constructed with 'new'.`, this);
            return {
                // Expression data.
                typeName: this.cst.typeName,
                parameterList: new Array<IExpressionAst>(),

                // Expression meta.
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                returnType: new PgslInvalidType(pContext),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Inherit,
            };
        }

        // Build parameter expression list.
        const lParameterExpressionList: Array<IExpressionAst> = this.cst.parameterList.map((pParameterCst) => {
            return ExpressionAstBuilder.build(pParameterCst, pContext);
        });

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
                if (!lParameterExpression.data.returnType.constructible) {
                    pContext.pushIncident(`New expression type must be constructible.`, this);
                }

                // Must be fixed.
                if (!lParameterExpression.data.returnType.fixedFootprint) {
                    pContext.pushIncident(`New expression type must be length fixed.`, this);
                }
            }

            // Function is constant, parameters need to be to.
            return lFixedState;
        })();

        // Find matching call definition.
        const lTypeCallDefinition: PgslNewExpressionCallDefinition | null = (() => {
            DEFINTION_CHECK: for (const lDefinition of lCallDefinitions) {
                // Check fixed parameter.
                if ('parameterTypes' in lDefinition) {
                    if (lDefinition.parameterTypes.length !== lParameterExpressionList.length) {
                        continue;
                    }

                    // Check parameter types. Any type must match exactly.
                    for (let lParameterIndex = 0; lParameterIndex < lDefinition.parameterTypes.length; lParameterIndex++) {
                        const lExpectedTypeConstructor: PgslTypeConstructor = lDefinition.parameterTypes[lParameterIndex];
                        const lActualType: PgslType = lParameterExpressionList[lParameterIndex].data.returnType;

                        // Check type constructor and skip definition on mismatch.
                        if (!(lActualType instanceof lExpectedTypeConstructor)) {
                            continue DEFINTION_CHECK;
                        }
                    }

                    return lDefinition;
                }

                // Check dynamic parameter.
                if ('range' in lDefinition) {
                    if (lParameterExpressionList.length < lDefinition.range.min || lParameterExpressionList.length > lDefinition.range.max) {
                        continue;
                    }

                    // Iterate expected type constructors and expressions inside, because all types must be the same.
                    const lExpectedTypeConstructors: Array<PgslTypeConstructor> = lDefinition.allowedTypes;
                    const lTypeMatched: boolean = (() => {
                        EXPECTED_TYPE_CHECK: for (const lExpectedTypeConstructor of lExpectedTypeConstructors) {
                            // Check parameter types. Any type must be in allowed types.
                            for (const lParameterExpression of lParameterExpressionList) {
                                if (!(lParameterExpression.data.returnType instanceof lExpectedTypeConstructor)) {
                                    continue EXPECTED_TYPE_CHECK;
                                }
                            }

                            return true;
                        }

                        return false;
                    })();

                    // Skip definition on mismatch.
                    if (!lTypeMatched) {
                        continue DEFINTION_CHECK;
                    }

                    return lDefinition;
                }
            }

            return null;
        })();

        const lResultType: PgslType | null = lTypeCallDefinition ? lTypeCallDefinition.returnType(pContext, lParameterExpressionList) : null;

        // No matching definition found.
        if (!lResultType) {
            pContext.pushIncident(`No matching constructor found for type '${this.cst.typeName}' with ${this.cst.parameterList.length} parameter(s).`, this);

            return {
                // Expression data.
                typeName: this.cst.typeName,
                parameterList: lParameterExpressionList,

                // Expression meta.
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                returnType: new PgslInvalidType(pContext),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Inherit,
            };
        }

        return {
            // Expression data.
            typeName: this.cst.typeName,
            parameterList: lParameterExpressionList,

            // Expression meta.
            fixedState: lFixedState,
            isStorage: false,
            returnType: lResultType,
            constantValue: null, // TODO: Maybe on simple convertions for f32, i32, etc.
            storageAddressSpace: PgslValueAddressSpace.Inherit,
        };
    }
}

type PgslNewExpressionCallDefinition = PgslNewExpressionFixedCallDefinition | PgslNewExpressionDynamicCallDefinition;

type PgslNewExpressionFixedCallDefinition = {
    parameterTypes: Array<PgslTypeConstructor>;
    returnType: (pContext: AbstractSyntaxTreeContext, pParameter: Array<IExpressionAst>) => PgslType | null;
};

type PgslNewExpressionDynamicCallDefinition = {
    allowedTypes: Array<PgslTypeConstructor>;
    range: { min: number; max: number; };
    returnType: (pContext: AbstractSyntaxTreeContext, pParameter: Array<IExpressionAst>) => PgslType | null;
};

export type NewExpressionAstData = {
    typeName: string;
    parameterList: Array<IExpressionAst>;
} & ExpressionAstData;