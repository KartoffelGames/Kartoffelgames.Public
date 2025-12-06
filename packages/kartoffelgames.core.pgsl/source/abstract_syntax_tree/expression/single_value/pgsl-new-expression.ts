import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import { PgslExpressionTrace } from '../../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import { PgslArrayType } from "../../../type/pgsl-array-type.ts";
import { PgslBooleanType } from "../../../type/pgsl-boolean-type.ts";
import { PgslInvalidType } from "../../../type/pgsl-invalid-type.ts";
import { PgslMatrixType } from "../../../type/pgsl-matrix-type.ts";
import { PgslNumericType } from "../../../type/pgsl-numeric-type.ts";
import { PgslType, PgslTypeConstructor } from '../../../type/pgsl-type.ts';
import { PgslVectorType } from "../../../type/pgsl-vector-type.ts";
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslExpression } from '../pgsl-expression.ts';
import { PgslLiteralValueExpression } from "./pgsl-literal-value-expression.ts";

/**
 * PGSL syntax tree of a new call expression with optional template list.
 */
export class PgslNewCallExpression extends PgslExpression {
    private static callDefinition(pTypeName: string): Array<PgslNewExpressionCallDefinition> | null {
        switch (pTypeName) {
            // Array types.
            case PgslArrayType.typeName.array: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 1, max: 100 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>): PgslType => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = pTrace.getExpression(lConcreteTypeExpression).resolveType;

                        // Create length expression and trace it.
                        const lConstantLengthExpression: PgslLiteralValueExpression = new PgslLiteralValueExpression(pParameterList.length.toString());
                        lConstantLengthExpression.trace(pTrace);

                        // Construct fixed array type.
                        return new PgslArrayType(pTrace, lElementType, lConstantLengthExpression);
                    }
                }
            ];

            // Vector types.
            case PgslVectorType.typeName.vector2: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 2, max: 2 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = pTrace.getExpression(lConcreteTypeExpression).resolveType;

                        return new PgslVectorType(pTrace, 2, lElementType);
                    }
                }
            ];
            case PgslVectorType.typeName.vector3: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 3, max: 3 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = pTrace.getExpression(lConcreteTypeExpression).resolveType;

                        return new PgslVectorType(pTrace, 3, lElementType);
                    }
                },
                {
                    parameterTypes: [PgslVectorType, PgslNumericType],
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pTrace.getExpression(pParameterList[0]).resolveType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lElementType.dimension !== 2) {
                            throw new Error(`Invalid vector type: ${lElementType.dimension}. Expected: 2.`);
                        }

                        return new PgslVectorType(pTrace, 3, lElementType.innerType);
                    }
                },
                {
                    parameterTypes: [PgslNumericType, PgslVectorType],
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pTrace.getExpression(pParameterList[1]).resolveType as PgslVectorType;

                        return new PgslVectorType(pTrace, 3, lElementType.innerType);
                    }
                }
            ];
            case PgslVectorType.typeName.vector4: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 4, max: 4 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = pTrace.getExpression(lConcreteTypeExpression).resolveType;

                        return new PgslVectorType(pTrace, 4, lElementType);
                    }
                },

                // Parameters with vector2. 
                {
                    parameterTypes: [PgslVectorType, PgslNumericType, PgslNumericType],
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pTrace.getExpression(pParameterList[0]).resolveType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lElementType.dimension !== 2) {
                            throw new Error(`Invalid vector type: ${lElementType.dimension}. Expected: 2.`);
                        }

                        return new PgslVectorType(pTrace, 4, lElementType.innerType);
                    }
                },
                {
                    parameterTypes: [PgslNumericType, PgslVectorType, PgslNumericType],
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pTrace.getExpression(pParameterList[1]).resolveType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lElementType.dimension !== 2) {
                            throw new Error(`Invalid vector type: ${lElementType.dimension}. Expected: 2.`);
                        }

                        return new PgslVectorType(pTrace, 4, lElementType.innerType);
                    }
                },
                {
                    parameterTypes: [PgslNumericType, PgslNumericType, PgslVectorType],
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pTrace.getExpression(pParameterList[2]).resolveType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lElementType.dimension !== 2) {
                            throw new Error(`Invalid vector type: ${lElementType.dimension}. Expected: 2.`);
                        }

                        return new PgslVectorType(pTrace, 4, lElementType.innerType);
                    }
                },
                {
                    parameterTypes: [PgslVectorType, PgslVectorType],
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pTrace.getExpression(lConcreteTypeExpression).resolveType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lElementType.dimension !== 2) {
                            throw new Error(`Invalid vector type: ${lElementType.dimension}. Expected: 2.`);
                        }

                        return new PgslVectorType(pTrace, 4, lElementType.innerType);
                    }
                },

                // Parameters with vector3.
                {
                    parameterTypes: [PgslVectorType, PgslNumericType],
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pTrace.getExpression(pParameterList[0]).resolveType as PgslVectorType;

                        // Vector type must be of dimension 3.
                        if (lElementType.dimension !== 3) {
                            throw new Error(`Invalid vector type: ${lElementType.dimension}. Expected: 3.`);
                        }

                        return new PgslVectorType(pTrace, 4, lElementType.innerType);
                    }
                },
                {
                    parameterTypes: [PgslNumericType, PgslVectorType],
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Get element type vector parameter.
                        const lElementType: PgslVectorType = pTrace.getExpression(pParameterList[1]).resolveType as PgslVectorType;

                        // Vector type must be of dimension 3.
                        if (lElementType.dimension !== 3) {
                            throw new Error(`Invalid vector type: ${lElementType.dimension}. Expected: 3.`);
                        }

                        return new PgslVectorType(pTrace, 4, lElementType.innerType);
                    }
                },
            ];

            // Matrix types.
            case PgslMatrixType.typeName.matrix22: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 4, max: 4 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = pTrace.getExpression(lConcreteTypeExpression).resolveType;

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix22, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 2, max: 2 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = pTrace.getExpression(lConcreteTypeExpression).resolveType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lVectorType.dimension !== 2) {
                            pTrace.pushIncident(`Matrix22 construction from vectors requires vectors of dimension 2.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix22, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix23: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 6, max: 6 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = pTrace.getExpression(lConcreteTypeExpression).resolveType;

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix23, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 2, max: 2 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = pTrace.getExpression(lConcreteTypeExpression).resolveType as PgslVectorType;

                        // Vector type must be of dimension 3.
                        if (lVectorType.dimension !== 3) {
                            pTrace.pushIncident(`Matrix23 construction from vectors requires vectors of dimension 3.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix23, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix24: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 8, max: 8 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = pTrace.getExpression(lConcreteTypeExpression).resolveType;

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix24, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 2, max: 2 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = pTrace.getExpression(lConcreteTypeExpression).resolveType as PgslVectorType;

                        // Vector type must be of dimension 4.
                        if (lVectorType.dimension !== 4) {
                            pTrace.pushIncident(`Matrix24 construction from vectors requires vectors of dimension 4.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix24, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix32: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 6, max: 6 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = pTrace.getExpression(lConcreteTypeExpression).resolveType;

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix32, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 3, max: 3 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = pTrace.getExpression(lConcreteTypeExpression).resolveType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lVectorType.dimension !== 2) {
                            pTrace.pushIncident(`Matrix32 construction from vectors requires vectors of dimension 2.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix32, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix33: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 9, max: 9 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = pTrace.getExpression(lConcreteTypeExpression).resolveType;

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix33, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 3, max: 3 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = pTrace.getExpression(lConcreteTypeExpression).resolveType as PgslVectorType;

                        // Vector type must be of dimension 3.
                        if (lVectorType.dimension !== 3) {
                            pTrace.pushIncident(`Matrix33 construction from vectors requires vectors of dimension 3.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix33, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix34: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 12, max: 12 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = pTrace.getExpression(lConcreteTypeExpression).resolveType;

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix34, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 3, max: 3 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = pTrace.getExpression(lConcreteTypeExpression).resolveType as PgslVectorType;

                        // Vector type must be of dimension 4.
                        if (lVectorType.dimension !== 4) {
                            pTrace.pushIncident(`Matrix34 construction from vectors requires vectors of dimension 4.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix34, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix42: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 8, max: 8 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = pTrace.getExpression(lConcreteTypeExpression).resolveType;

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix42, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 4, max: 4 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = pTrace.getExpression(lConcreteTypeExpression).resolveType as PgslVectorType;

                        // Vector type must be of dimension 2.
                        if (lVectorType.dimension !== 2) {
                            pTrace.pushIncident(`Matrix42 construction from vectors requires vectors of dimension 2.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix42, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix43: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 12, max: 12 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = pTrace.getExpression(lConcreteTypeExpression).resolveType;

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix43, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 4, max: 4 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = pTrace.getExpression(lConcreteTypeExpression).resolveType as PgslVectorType;

                        // Vector type must be of dimension 3.
                        if (lVectorType.dimension !== 3) {
                            pTrace.pushIncident(`Matrix43 construction from vectors requires vectors of dimension 3.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix43, lVectorType.innerType);
                    }
                }
            ];
            case PgslMatrixType.typeName.matrix44: return [
                {
                    allowedTypes: [PgslNumericType],
                    range: { min: 16, max: 16 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lElementType: PgslType = pTrace.getExpression(lConcreteTypeExpression).resolveType;

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix44, lElementType);
                    }
                },
                {
                    allowedTypes: [PgslVectorType],
                    range: { min: 4, max: 4 },
                    returnType: (pTrace: PgslTrace, pParameterList: Array<PgslExpression>) => {
                        // Find the first concrete numeric type and check if all others match.
                        const lConcreteTypeExpression: PgslExpression = pParameterList.find((pParam) => {
                            return pTrace.getExpression(pParam).resolveType.concrete;
                        }) ?? pParameterList[0];

                        // Get element type from concrete type expression.
                        const lVectorType: PgslVectorType = pTrace.getExpression(lConcreteTypeExpression).resolveType as PgslVectorType;

                        // Vector type must be of dimension 4.
                        if (lVectorType.dimension !== 4) {
                            pTrace.pushIncident(`Matrix44 construction from vectors requires vectors of dimension 4.`, lConcreteTypeExpression);
                        }

                        return new PgslMatrixType(pTrace, PgslMatrixType.typeName.matrix44, lVectorType.innerType);
                    }
                }
            ];

            // Scalar types.
            case PgslBooleanType.typeName.boolean: return [
                {
                    parameterTypes: [PgslBooleanType],
                    returnType: (pTrace: PgslTrace, _pParameterList: Array<PgslExpression>) => new PgslBooleanType(pTrace)
                },
                {
                    parameterTypes: [PgslNumericType],
                    returnType: (pTrace: PgslTrace, _pParameterList: Array<PgslExpression>) => new PgslBooleanType(pTrace)
                }
            ];
            case PgslNumericType.typeName.float16: return [
                {
                    parameterTypes: [PgslBooleanType],
                    returnType: (pTrace: PgslTrace, _pParameterList: Array<PgslExpression>) => new PgslNumericType(pTrace, PgslNumericType.typeName.float16)
                },
                {
                    parameterTypes: [PgslNumericType],
                    returnType: (pTrace: PgslTrace, _pParameterList: Array<PgslExpression>) => new PgslNumericType(pTrace, PgslNumericType.typeName.float16)
                }
            ];
            case PgslNumericType.typeName.float32: return [
                {
                    parameterTypes: [PgslBooleanType],
                    returnType: (pTrace: PgslTrace, _pParameterList: Array<PgslExpression>) => new PgslNumericType(pTrace, PgslNumericType.typeName.float32)
                },
                {
                    parameterTypes: [PgslNumericType],
                    returnType: (pTrace: PgslTrace, _pParameterList: Array<PgslExpression>) => new PgslNumericType(pTrace, PgslNumericType.typeName.float32)
                }
            ];
            case PgslNumericType.typeName.signedInteger: return [
                {
                    parameterTypes: [PgslBooleanType],
                    returnType: (pTrace: PgslTrace, _pParameterList: Array<PgslExpression>) => new PgslNumericType(pTrace, PgslNumericType.typeName.signedInteger)
                },
                {
                    parameterTypes: [PgslNumericType],
                    returnType: (pTrace: PgslTrace, _pParameterList: Array<PgslExpression>) => new PgslNumericType(pTrace, PgslNumericType.typeName.signedInteger)
                }
            ];
            case PgslNumericType.typeName.unsignedInteger: return [
                {
                    parameterTypes: [PgslBooleanType],
                    returnType: (pTrace: PgslTrace, _pParameterList: Array<PgslExpression>) => new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger)
                },
                {
                    parameterTypes: [PgslNumericType],
                    returnType: (pTrace: PgslTrace, _pParameterList: Array<PgslExpression>) => new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger)
                }
            ];
        }

        return null;
    }

    private readonly mParameterList: Array<PgslExpression>;
    private readonly mTypeName: string;

    /**
     * Function parameter.
     */
    public get parameter(): Array<PgslExpression> {
        return this.mParameterList;
    }

    /**
     * Type of new call.
     */
    public get typeName(): string {
        return this.mTypeName;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pTypeName: string, pParameterList: Array<PgslExpression>, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mTypeName = pTypeName;
        this.mParameterList = pParameterList;

        // Add data as child tree.
        this.appendChild(...this.mParameterList);
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace {
        // Read call definitions.
        const lCallDefinitions: Array<PgslNewExpressionCallDefinition> | null = PgslNewCallExpression.callDefinition(this.mTypeName);
        if (!lCallDefinitions) {
            pTrace.pushIncident(`Type '${this.mTypeName}' cannot be constructed with 'new'.`, this);
            return new PgslExpressionTrace({
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslInvalidType(pTrace),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Inherit,
            });
        }

        // Trace parameter expressions.
        for (const lParameter of this.mParameterList) {
            lParameter.trace(pTrace);
        }

        // Find the lowest fixed state of all parameters while validating the expression types
        const lFixedState: PgslValueFixedState = (() => {
            // Create default variables starting with the stiffest state.
            let lFixedState: PgslValueFixedState = PgslValueFixedState.Constant;

            for (const lParameter of this.mParameterList) {
                // Read attachment of parameters.
                const lParameterAttachment: PgslExpressionTrace = pTrace.getExpression(lParameter);

                // Set the lowest fixed state.
                if (lParameterAttachment.fixedState < lFixedState) {
                    lFixedState = lParameterAttachment.fixedState;
                }

                // Must be constructable.
                if (!lParameterAttachment.resolveType.constructible) {
                    pTrace.pushIncident(`New expression type must be constructible.`, this);
                }

                // Must be fixed.
                if (!lParameterAttachment.resolveType.fixedFootprint) {
                    pTrace.pushIncident(`New expression type must be length fixed.`, this);
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
                    if (lDefinition.parameterTypes.length !== this.mParameterList.length) {
                        continue;
                    }

                    // Check parameter types. Any type must match exactly.
                    for (let lParameterIndex = 0; lParameterIndex < lDefinition.parameterTypes.length; lParameterIndex++) {
                        const lExpectedTypeConstructor: PgslTypeConstructor = lDefinition.parameterTypes[lParameterIndex];
                        const lActualType: PgslType = pTrace.getExpression(this.mParameterList[lParameterIndex]).resolveType;

                        // Check type constructor and skip definition on mismatch.
                        if (!(lActualType instanceof lExpectedTypeConstructor)) {
                            continue DEFINTION_CHECK;
                        }
                    }

                    return lDefinition;
                }

                // Check dynamic parameter.
                if ('range' in lDefinition) {
                    if (this.mParameterList.length < lDefinition.range.min || this.mParameterList.length > lDefinition.range.max) {
                        continue;
                    }

                    // Iterate expected type constructors and expressions inside, because all types must be the same.
                    const lExpectedTypeConstructors: Array<PgslTypeConstructor> = lDefinition.allowedTypes;
                    const lTypeMatched: boolean = (() => {
                        EXPECTED_TYPE_CHECK: for (const lExpectedTypeConstructor of lExpectedTypeConstructors) {
                            // Check parameter types. Any type must be in allowed types.
                            for (let lParameterIndex = 0; lParameterIndex < this.mParameterList.length; lParameterIndex++) {
                                const lActualType: PgslType = pTrace.getExpression(this.mParameterList[lParameterIndex]).resolveType;

                                if (!(lActualType instanceof lExpectedTypeConstructor)) {
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

        const lResultType: PgslType | null = lTypeCallDefinition ? lTypeCallDefinition.returnType(pTrace, this.mParameterList) : null;

        // No matching definition found.
        if (!lResultType) {
            pTrace.pushIncident(`No matching constructor found for type '${this.mTypeName}' with ${this.mParameterList.length} parameter(s).`, this);

            return new PgslExpressionTrace({
                fixedState: PgslValueFixedState.Variable,
                isStorage: false,
                resolveType: new PgslInvalidType(pTrace),
                constantValue: null,
                storageAddressSpace: PgslValueAddressSpace.Inherit,
            });
        }

        return new PgslExpressionTrace({
            fixedState: lFixedState,
            isStorage: false,
            resolveType: lResultType,
            constantValue: null, // TODO: Maybe on simple convertions for f32, i32, etc.
            storageAddressSpace: PgslValueAddressSpace.Inherit,
        });
    }
}

type PgslNewExpressionCallDefinition = PgslNewExpressionFixedCallDefinition | PgslNewExpressionDynamicCallDefinition;

type PgslNewExpressionFixedCallDefinition = {
    parameterTypes: Array<PgslTypeConstructor>;
    returnType: (pTrace: PgslTrace, pParameter: Array<PgslExpression>) => PgslType | null;
};

type PgslNewExpressionDynamicCallDefinition = {
    allowedTypes: Array<PgslTypeConstructor>;
    range: { min: number; max: number; };
    returnType: (pTrace: PgslTrace, pParameter: Array<PgslExpression>) => PgslType | null;
};