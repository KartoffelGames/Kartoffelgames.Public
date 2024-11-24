import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum';
import { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslVariableDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<PgslVariableDeclarationSyntaxTreeSetupData> {
    private static readonly mDeclarationAddressSpaceMapping: Dictionary<PgslDeclarationType, PgslValueAddressSpace> = (() => {
        // Create mapping of declaration type to address space.
        const lAddressSpaceMapping: Dictionary<PgslDeclarationType, PgslValueAddressSpace> = new Dictionary<PgslDeclarationType, PgslValueAddressSpace>();
        lAddressSpaceMapping.set(PgslDeclarationType.Storage, PgslValueAddressSpace.Storage);
        lAddressSpaceMapping.set(PgslDeclarationType.Uniform, PgslValueAddressSpace.Uniform);
        lAddressSpaceMapping.set(PgslDeclarationType.Workgroup, PgslValueAddressSpace.Workgroup);
        lAddressSpaceMapping.set(PgslDeclarationType.Private, PgslValueAddressSpace.Private);

        return lAddressSpaceMapping;
    })();

    private readonly mDeclarationTypeName: string;
    private readonly mExpression: BasePgslExpressionSyntaxTree | null;
    private readonly mName: string;
    private readonly mTypeDeclaration: BasePgslTypeDefinitionSyntaxTree;

    /**
     * If declaration is a constant expression.
     */
    public get addressSpace(): PgslValueAddressSpace {
        this.ensureSetup();

        return this.setupData.addressSpace;
    }

    /**
     * Variable declaration type.
     */
    public get declarationType(): PgslDeclarationType {
        this.ensureSetup();

        return this.setupData.declarationType;
    }

    /**
     * Value initialization expression.
     */
    public get expression(): BasePgslExpressionSyntaxTree | null {
        return this.mExpression;
    }

    /**
     * If declaration is a constant expression.
     */
    public get isConstant(): boolean {
        this.ensureSetup();

        return this.setupData.isConstant;
    }

    /**
     * If declaration is a constant expression.
     */
    public get isCreationFixed(): boolean {
        this.ensureSetup();

        return this.setupData.isFixed;
    }

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Variable type.
     */
    public get type(): BasePgslTypeDefinitionSyntaxTree {
        return this.mTypeDeclaration;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslVariableDeclarationSyntaxTreeConstructorParameter, pAttributes: PgslAttributeListSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pAttributes, pMeta);

        // Set data.
        this.mTypeDeclaration = pData.type;
        this.mName = pData.name;
        this.mDeclarationTypeName = pData.declarationType;
        this.mExpression = pData.expression ?? null;

        // Append child trees.
        this.appendChild(this.mTypeDeclaration);
        if (this.mExpression) {
            this.appendChild(this.mExpression);
        }
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data.
     */
    protected override onSetup(): PgslVariableDeclarationSyntaxTreeSetupData {
        // Push variable definition to current scope.
        this.pushScopedValue(this.mName, this);

        // Try to parse declaration type.
        const lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, this.mDeclarationTypeName);
        if (!lDeclarationType) {
            throw new Exception(`Can't use "${this.mDeclarationTypeName}" as a declaration type.`, this);
        }

        return {
            addressSpace: PgslVariableDeclarationSyntaxTree.mDeclarationAddressSpaceMapping.getOrDefault(lDeclarationType, PgslValueAddressSpace.None),
            declarationType: lDeclarationType,
            isFixed: lDeclarationType === PgslDeclarationType.Param,
            isConstant: lDeclarationType === PgslDeclarationType.Const
        };
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        this.ensureSetup();

        // Create list of all module variable declarations types.
        const lDeclarationTypeList: Array<PgslDeclarationType> = [
            PgslDeclarationType.Const,
            PgslDeclarationType.Storage,
            PgslDeclarationType.Uniform,
            PgslDeclarationType.Workgroup,
            PgslDeclarationType.Private,
            PgslDeclarationType.Param,
        ];

        // Validate.
        if (!lDeclarationTypeList.includes(this.setupData.declarationType)) {
            throw new Exception(`Declaration type "${this.setupData.declarationType}" can not be used for module scope variable declarations.`, this);
        }

        // Const declaration types.
        const lConstDeclarationTypeList: Array<PgslDeclarationType> = [
            PgslDeclarationType.Const,
            PgslDeclarationType.Param,
        ];

        // Validate const type needs to be constructible.
        if (lConstDeclarationTypeList.includes(this.setupData.declarationType) && !this.mTypeDeclaration.isConstructable) {
            throw new Exception(`Constant variable declarations can only be of a constructible type.`, this);
        }

        // TODO: When const, param, must habe a initializer.
        // TODO: private workgroup dont need a initializer
        // TODO: Storage, Uniform shoulnt have a initializer.

        // TODO: Storage value musst be host sharable.
        // a numeric scalar type
        // a numeric vector type
        // a matrix type
        // an atomic type
        // a fixed-size array type, if it has creation-fixed footprint and its element type is host-shareable
        // a runtime-sized array type, if its element type is host-shareable
        // a structure type, if all its members are host-shareable

        // TODO: Validate if declaration type can store the type.
        // TODO: Validate if declaration type allows any initialization expression.
        // TODO: Validate if expression fits declaration type.
        // TODO: Validate if declaration is const when it is the expression part should be the same.
    }
}

type PgslVariableDeclarationSyntaxTreeSetupData = {
    declarationType: PgslDeclarationType;
    isConstant: boolean;
    isFixed: boolean;
    addressSpace: PgslValueAddressSpace;
};

export type PgslVariableDeclarationSyntaxTreeConstructorParameter = {
    declarationType: string;
    name: string;
    type: BasePgslTypeDefinitionSyntaxTree;
    expression?: BasePgslExpressionSyntaxTree;
};