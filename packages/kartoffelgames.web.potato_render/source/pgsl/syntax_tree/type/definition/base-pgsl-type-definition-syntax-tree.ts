import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { PgslBaseType } from '../enum/pgsl-base-type.enum';

/**
 * PGSL base type definition.
 */
export abstract class BasePgslTypeDefinitionSyntaxTree<TTypeSetupData = unknown> extends BasePgslSyntaxTree<PgslTypeDefinitionAttributes<TTypeSetupData>> {
    /**
     * Base type of definition.
     */
    public get aliased(): boolean {
        // Must be setup.
        this.ensureSetup();

        return !!this.setupData.aliased;
    }

    /**
     * Base type of definition.
     */
    public get aliasedType(): BasePgslTypeDefinitionSyntaxTree {
        // Must be setup.
        this.ensureSetup();

        // Return alised type when it is aliased.
        if (this.setupData.aliased) {
            return this.setupData.aliased;
        }

        return this;
    }

    /**
     * Base type of definition.
     */
    public get baseType(): PgslBaseType {
        // Must be setup.
        this.ensureSetup();

        return this.setupData.baseType;
    }

    /**
     * If declaration is a composite type.
     */
    public get isComposite(): boolean {
        // Must be setup.
        this.ensureSetup();

        return this.setupData.typeAttributes.composite;
    }

    /**
     * If declaration has a fixed byte length.
     */
    public get isConstructable(): boolean {
        // Must be setup.
        this.ensureSetup();

        return this.setupData.typeAttributes.constructable;
    }

    /**
     * If declaration has a fixed byte length.
     */
    public get isFixed(): boolean {
        // Must be setup.
        this.ensureSetup();

        return this.setupData.typeAttributes.fixed;
    }

    /**
     * If is sharable with the host.
     */
    public get isHostShareable(): boolean {
        // Must be setup.
        this.ensureSetup();

        return this.setupData.typeAttributes.hostSharable;
    }

    /**
     * Composite value with properties that can be access by index.
     */
    public get isIndexable(): boolean {
        // Must be setup.
        this.ensureSetup();

        return this.setupData.typeAttributes.indexable;
    }

    /**
     * If is a plain type.
     */
    public get isPlainType(): boolean {
        // Must be setup.
        this.ensureSetup();

        return this.setupData.typeAttributes.plain;
    }

    /**
     * If value is storable in a variable.
     */
    public get isStorable(): boolean {
        // Must be setup.
        this.ensureSetup();

        return this.setupData.typeAttributes.storable;
    }

    /**
     * Types setup data.
     */
    protected get typeSetupData(): TTypeSetupData {
        // Must be setup.
        this.ensureSetup();

        return this.setupData.data;
    }

    /**
     * Constructor.
     * 
     * @param pBaseType - Base type name of definition.
     * @param pMemoryDefinition - Memory definition of type.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta) {
        // Call super and prevent reasigning empty data to cached structures.
        super(pMeta);
    }

    /**
     * Check if set structure is equal to this structure.
     * 
     * @param pTarget - Target structure.
     * 
     * @returns if both structures are equal.
     */
    public equals(pTarget: BasePgslTypeDefinitionSyntaxTree): pTarget is this {
        // Ensure setups.
        this.ensureSetup();
        pTarget.ensureSetup();

        // Same storable definition.
        if (this.setupData.typeAttributes.storable !== pTarget.setupData.typeAttributes.storable) {
            return false;
        }

        // Same hostSharable definition.
        if (this.setupData.typeAttributes.hostSharable !== pTarget.setupData.typeAttributes.hostSharable) {
            return false;
        }

        // Same plain definition.
        if (this.setupData.typeAttributes.plain !== pTarget.setupData.typeAttributes.plain) {
            return false;
        }

        // Same composite definition.
        if (this.setupData.typeAttributes.composite !== pTarget.setupData.typeAttributes.composite) {
            return false;
        }

        // Same constructable definition.
        if (this.setupData.typeAttributes.constructable !== pTarget.setupData.typeAttributes.constructable) {
            return false;
        }

        // Same fixed definition.
        if (this.setupData.typeAttributes.fixed !== pTarget.setupData.typeAttributes.fixed) {
            return false;
        }

        // Same indexable definition.
        if (this.setupData.typeAttributes.indexable !== pTarget.setupData.typeAttributes.indexable) {
            return false;
        }

        // Same base type.
        return this.setupData.baseType === pTarget.setupData.baseType;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    public explicitCastable(pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Ensure setups.
        this.ensureSetup();
        pTarget.ensureSetup();

        // When they are the same, they are castable.
        if (this.equals(pTarget)) {
            return true;
        }

        // Should at least has the same base type.
        if (this.setupData.baseType !== pTarget.setupData.baseType) {
            return false;
        }

        return this.isExplicitCastable(pTarget as unknown as this);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    public implicitCastable(pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // When they are not explicit castable, they never be able to implicit cast.
        if (!this.explicitCastable(pTarget)) {
            return false;
        }

        // When they are the same, they are castable.
        if (this.equals(pTarget)) {
            return true;
        }

        return this.isImplicitCastable(pTarget as this);
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected abstract isExplicitCastable(pTarget: this): boolean;

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected abstract isImplicitCastable(pTarget: this): boolean;

    /**
     * Required override.
     */
    protected abstract override onSetup(): PgslTypeDefinitionAttributes<TTypeSetupData>;
}

export type PgslTypeDefinitionAttributes<TTypeSetupData> = {
    /**
     * Type is alliased.
     */
    aliased: false | BasePgslTypeDefinitionSyntaxTree;

    /**
     * Own setup data.
     */
    data: TTypeSetupData;

    /**
     * Basic type.
     */
    baseType: PgslBaseType;

    /**
     * Type information.
     */
    typeAttributes: {
        /**
         * Value is storable in a variable.
         */
        storable: boolean;

        /**
         * Sharable with the host
         */
        hostSharable: boolean;

        /**
         * Declaration is a plain type.
         */
        plain: boolean;

        /**
         * Declaration is a composite type.
         */
        composite: boolean;

        /**
         * declaration is a constructable.
         */
        constructable: boolean;

        /**
         * declaration has a fixed byte length.
         */
        fixed: boolean;

        /**
         * composite value with properties that can be access by index
         */
        indexable: boolean;
    };
};