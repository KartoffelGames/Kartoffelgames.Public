
import { TypeCst } from "../../concrete_syntax_tree/general.type.ts";
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from "../abstract-syntax-tree.ts";
import { IType, type TypeProperties } from './i-type.interface.ts';

/**
 * Vector type definition.
 * Represents a vector type with a specific dimension and inner type.
 */
export class PgslVectorType extends AbstractSyntaxTree<TypeCst, TypeProperties> implements IType {
    /**
     * Type names for vector types.
     * Maps vector type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            vector2: 'Vector2',
            vector3: 'Vector3',
            vector4: 'Vector4'
        } as const;
    }

    /**
     * Get the type name for a given vector dimension.
     * 
     * @param pDimension - Vector dimension.
     * 
     * @returns Type name for the given vector dimension. 
     */
    public static typeNameFromDimension(pDimension: number): string {
        switch (pDimension) {
            case 2: return PgslVectorType.typeName.vector2;
            case 3: return PgslVectorType.typeName.vector3;
            case 4: return PgslVectorType.typeName.vector4;
            default: return 'Vector';
        }
    }

    private readonly mInnerType: IType;
    private readonly mVectorDimension: number;

    /**
     * Gets the dimension (number of components) of the vector.
     * 
     * @returns The vector dimension (2, 3, or 4).
     */
    public get dimension(): number {
        return this.mVectorDimension;
    }

    /**
     * Gets the inner element type of the vector.
     * 
     * @returns The type of elements stored in the vector.
     */
    public get innerType(): IType {
        return this.mInnerType;
    }

    /**
     * Constructor for vector type.
     * 
     * @param pContext - The context for validation and error reporting.
     * @param pVectorDimension - The vector dimension (2, 3, or 4).
     * @param pInnerType - The inner element type of the vector.
     */
    public constructor(pVectorDimension: number, pInnerType: IType) {
        super({ type: 'Type', range: [0, 0, 0, 0] });

        // Set data.
        this.mInnerType = pInnerType;
        this.mVectorDimension = pVectorDimension;
    }

    /**
     * Compare this vector type with a target type for equality.
     * Two vector types are equal if they have the same dimension and inner type.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same dimension and inner type.
     */
    public equals(pTarget: IType): boolean {
        // Must both be a vector.
        if (!(pTarget instanceof PgslVectorType)) {
            return false;
        }

        // Inner type must be equal.
        if (!this.mInnerType.equals(pTarget.mInnerType)) {
            return false;
        }

        // Vector dimensions must be equal.
        return this.mVectorDimension === pTarget.mVectorDimension;
    }

    /**
     * Check if this vector type is explicitly castable into the target type.
     * Vector types can be explicitly cast if they have the same dimension and compatible inner types.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns True when explicit casting is allowed, false otherwise.
     */
    public isExplicitCastableInto(pTarget: IType): boolean {
        // Must both be a vector.
        if (!(pTarget instanceof PgslVectorType)) {
            return false;
        }

        // If vector dimensions are not equal, it is not castable.
        if (this.mVectorDimension !== pTarget.mVectorDimension) {
            return false;
        }

        // It is when inner types are explicit castable.
        return this.mInnerType.isExplicitCastableInto(pTarget.mInnerType);
    }

    /**
     * Check if this vector type is implicitly castable into the target type.
     * Vector types can be implicitly cast if they have the same dimension and compatible inner types.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns True when implicit casting is allowed, false otherwise.
     */
    public isImplicitCastableInto(pTarget: IType): boolean {
        // Must both be a vector.
        if (!(pTarget instanceof PgslVectorType)) {
            return false;
        }

        // If vector dimensions are not equal, it is not castable.
        if (this.mVectorDimension !== pTarget.mVectorDimension) {
            return false;
        }

        // It is when inner types are implicit castable.
        return this.mInnerType.isImplicitCastableInto(pTarget.mInnerType);
    }

    /**
     * Collect type properties for vector types.
     * Validates that the inner type is scalar and copies relevant properties.
     * 
     * @param pContext - Context for validation and error reporting.
     * 
     * @returns Type properties for vector types.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): TypeProperties {
        // Validate vector dimension.
        if (this.mVectorDimension < 2 || this.mVectorDimension > 4) {
            pContext.pushIncident('Invalid vector dimension. Must be 2, 3, or 4.');
        }

        // Must be scalar.
        if (!this.mInnerType.data.scalar) {
            pContext.pushIncident('Vector type must have a scalar inner type');
        }

        // Build meta types.
        const lMetaTypeList: Array<string> = new Array<string>();
        for (const metaType of this.mInnerType.data.metaTypes) {
            lMetaTypeList.push(`Vector<${metaType}>`);
            lMetaTypeList.push(`Vector${this.mVectorDimension}<${metaType}>`);
        }

        // Add meta type for all vectors.
        lMetaTypeList.push(`Vector${this.mVectorDimension}`);
        lMetaTypeList.push('Vector');

        return {
            // Meta information.
            metaTypes: lMetaTypeList,

            // Always accessible as composite (swizzle) or index.
            composite: true,
            indexable: true,

            // Copy of inner type properties.
            scalar: this.mInnerType.data.scalar,
            plain: this.mInnerType.data.plain,
            concrete: this.mInnerType.data.concrete,
            storable: this.mInnerType.data.storable,
            hostShareable: this.mInnerType.data.hostShareable,
            constructible: this.mInnerType.data.constructible,
            fixedFootprint: this.mInnerType.data.fixedFootprint
        };
    }
};