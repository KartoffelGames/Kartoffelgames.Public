import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { BasePgslType } from './base-pgsl-type.ts';
import { PgslArrayType } from './pgsl-array-type.ts';
import { PgslBooleanType } from './pgsl-boolean-type.ts';
import { PgslInvalidType } from './pgsl-invalid-type.ts';
import { PgslNumericType } from './pgsl-numeric-type.ts';
import { PgslVectorType } from './pgsl-vector-type.ts';

/**
 * Built-in type definition that represents PGSL built-in types.
 * These are predefined types that map to specific underlying types and are used for shader built-in values like vertex indices, positions, workgroup IDs, etc.
 */
export class PgslBuildInType extends BasePgslType {
    /**
     * Type names for all available built-in types.
     * Maps built-in type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            vertexIndex: 'VertexIndex',
            instanceIndex: 'InstanceIndex',
            position: 'Position',
            frontFacing: 'FrontFacing',
            fragDepth: 'FragDepth',
            sampleIndex: 'SampleIndex',
            sampleMask: 'SampleMask',
            localInvocationId: 'LocalInvocationId',
            localInvocationIndex: 'LocalInvocationIndex',
            globalInvocationId: 'GlobalInvocationId',
            workgroupId: 'WorkgroupId',
            numWorkgroups: 'NumWorkgroups',
            clipDistances: 'ClipDistances',
            primitiveIndex: 'PrimitiveIndex',
        } as const;
    }

    /**
     * Determines the underlying type for a given built-in type.
     * Maps each built-in type to its corresponding PGSL type representation.
     * 
     * @param pBuildInType - The built-in type to map.
     * @param pTemplate - Template expression for parameterized types.
     * 
     * @returns The underlying PGSL type that represents this built-in type.
     */
    private static determinateAliasedType(pBuildInType: PgslBuildInTypeName, pTemplate: IExpressionAst | null): BasePgslType {
        // Big ass switch case.
        switch (pBuildInType) {
            case PgslBuildInType.typeName.position: {
                const lFloatType = new PgslNumericType(PgslNumericType.typeName.float32);
                return new PgslVectorType(4, lFloatType);
            }
            case PgslBuildInType.typeName.localInvocationId: {
                return new PgslNumericType(PgslNumericType.typeName.unsignedInteger);
            }
            case PgslBuildInType.typeName.globalInvocationId: {
                const lUnsignedIntType = new PgslNumericType(PgslNumericType.typeName.unsignedInteger);
                return new PgslVectorType(3, lUnsignedIntType);
            }
            case PgslBuildInType.typeName.workgroupId: {
                const lUnsignedIntType = new PgslNumericType(PgslNumericType.typeName.unsignedInteger);
                return new PgslVectorType(3, lUnsignedIntType);
            }
            case PgslBuildInType.typeName.numWorkgroups: {
                const lUnsignedIntType = new PgslNumericType(PgslNumericType.typeName.unsignedInteger);
                return new PgslVectorType(3, lUnsignedIntType);
            }
            case PgslBuildInType.typeName.vertexIndex: {
                return new PgslNumericType(PgslNumericType.typeName.unsignedInteger);
            }
            case PgslBuildInType.typeName.instanceIndex: {
                return new PgslNumericType(PgslNumericType.typeName.unsignedInteger);
            }
            case PgslBuildInType.typeName.fragDepth: {
                return new PgslNumericType(PgslNumericType.typeName.float32);
            }
            case PgslBuildInType.typeName.sampleIndex: {
                return new PgslNumericType(PgslNumericType.typeName.unsignedInteger);
            }
            case PgslBuildInType.typeName.sampleMask: {
                return new PgslNumericType(PgslNumericType.typeName.unsignedInteger);
            }
            case PgslBuildInType.typeName.localInvocationIndex: {
                return new PgslNumericType(PgslNumericType.typeName.unsignedInteger);
            }
            case PgslBuildInType.typeName.primitiveIndex: {
                return new PgslNumericType(PgslNumericType.typeName.unsignedInteger);
            }
            case PgslBuildInType.typeName.frontFacing: {
                return new PgslBooleanType();
            }
            case PgslBuildInType.typeName.clipDistances: {
                // ClipDistances is an array<f32, N> where N is determined by the template

                // Create a new float number type.
                const lFloatType = new PgslNumericType(PgslNumericType.typeName.float32);

                return new PgslArrayType(lFloatType, pTemplate);
            }
            default: {
                // Unknown built-in type
                return new PgslInvalidType();
            }
        }
    }

    private readonly mUnderlyingType: BasePgslType;

    /**
     * Gets the built-in type variant name.
     * 
     * @returns The built-in type name.
     */
    public get typename(): PgslBuildInTypeName {
        return this.meta.typeName as PgslBuildInTypeName;
    }

    /**
     * Gets the underlying type that this built-in type maps to.
     * 
     * @returns The underlying PGSL type.
     */
    public get underlyingType(): BasePgslType {
        return this.mUnderlyingType;
    }

    /**
     * Constructor for built-in type.
     * 
     * @param pType - The specific built-in type variant.
     * @param pTemplate - Optional template expression for parameterized types.
     */
    public constructor(pType: PgslBuildInTypeName, pTemplate: IExpressionAst | null) {
        // Create the underlying type first.
        const lUnderlyingType: BasePgslType = PgslBuildInType.determinateAliasedType(pType, pTemplate);

        // Copy any kind information from underlying type.
        super(lUnderlyingType.kind, {
            typeName: pType
        });

        // Set data.
        this.mUnderlyingType = lUnderlyingType;
    }

    /**
     * Compare this built-in type with a target type for equality.
     * Built-in types are equal if their underlying types and the typename of the buildin are equal.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same underlying type.
     */
    public equals(pTarget: BasePgslType): pTarget is this {
        // Check if target is also a built-in type with the same variant.
        if (this.typename !== pTarget.meta.typeName) {
            return false;
        }

        // At this point we assume that both share the same class.
        const lTarget: PgslBuildInType = pTarget as PgslBuildInType;

        // Check if the underlying type equals the target type.
        return this.mUnderlyingType.equals(lTarget.underlyingType);
    }

    /**
     * Get this types convertion rank to another type.
     * 
     * @param pTarget - Conversion target type.
     * 
     * @returns the conversation rank from this type to the specified.
     */
    public conversionRankTo(pTarget: BasePgslType): number {
        // Check if aliased type is implicit castable into target type.
        return this.underlyingType.conversionRankTo(pTarget);
    }
}

/**
 * Type representing all available built-in type names.
 */
export type PgslBuildInTypeName = (typeof PgslBuildInType.typeName)[keyof typeof PgslBuildInType.typeName];