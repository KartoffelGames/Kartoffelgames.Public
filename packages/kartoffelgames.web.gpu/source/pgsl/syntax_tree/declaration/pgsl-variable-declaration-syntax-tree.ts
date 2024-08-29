import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum';
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';
import { IPgslVariableDeclarationSyntaxTree } from '../interface/i-pgsl-variable-declaration-syntax-tree.interface';
import { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslTypeDeclarationSyntaxTree } from '../type/pgsl-type-declaration-syntax-tree';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslVariableDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<PgslVariableDeclarationSyntaxTreeStructureData> implements IPgslVariableDeclarationSyntaxTree {
    private mAddressSpace: PgslValueAddressSpace | null;
    private readonly mDeclarationType: PgslDeclarationType;
    private readonly mExpression: BasePgslExpressionSyntaxTree | null;
    private mIsConstant: boolean | null;
    private mIsCreationFixed: boolean | null;
    private readonly mName: string;
    private readonly mTypeDeclaration: PgslTypeDeclarationSyntaxTree;

    /**
     * If declaration is a constant expression.
     */
    public get addressSpace(): PgslValueAddressSpace {
        this.ensureValidity();

        // Init value.
        if (this.mAddressSpace === null) {
            this.mAddressSpace = this.determinateAddressSpace();
        }

        return this.mAddressSpace;
    }

    /**
     * Variable declaration type.
     */
    public get declarationType(): PgslDeclarationType {
        return this.mDeclarationType;
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
        this.ensureValidity();

        // Init value.
        if (this.mIsConstant === null) {
            this.mIsConstant = this.determinateIsConstant();
        }

        return this.mIsConstant;
    }

    /**
     * If declaration is a constant expression.
     */
    public get isCreationFixed(): boolean {
        this.ensureValidity();

        // Init value.
        if (this.mIsCreationFixed === null) {
            this.mIsCreationFixed = this.determinateIsCreationFixed();
        }

        return this.mIsCreationFixed;
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
        this.ensureValidity();

        return this.mTypeDeclaration.type;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslVariableDeclarationSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number, pBuildIn: boolean = false) {
        super(pData, pData.attributes, pStartColumn, pStartLine, pEndColumn, pEndLine, pBuildIn);

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
        if (!lDeclarationTypeList.includes(pData.declarationType as PgslDeclarationType)) {
            throw new Exception(`Declaration type "${pData.declarationType}" can not be used for module scope variable declarations.`, this);
        }

        // Set data.
        this.mTypeDeclaration = pData.type;
        this.mName = pData.name;
        this.mDeclarationType = EnumUtil.cast(PgslDeclarationType, pData.declarationType)!;
        this.mExpression = pData.expression ?? null;

        // Set empty data.
        this.mIsConstant = null;
        this.mIsCreationFixed = null;
        this.mAddressSpace = null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Const declaration types.
        const lConstDeclarationTypeList: Array<PgslDeclarationType> = [
            PgslDeclarationType.Const,
            PgslDeclarationType.Param,
        ];

        // Validate const type needs to be constructible.
        if (lConstDeclarationTypeList.includes(this.mDeclarationType) && !this.mTypeDeclaration.type.isConstructable) {
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

    /**
     * Determinate address space of declaration.
     */
    private determinateAddressSpace(): PgslValueAddressSpace {
        // Create mapping of declaration type to address space.
        const lAddressSpaceMapping: Dictionary<PgslDeclarationType, PgslValueAddressSpace> = new Dictionary<PgslDeclarationType, PgslValueAddressSpace>();
        lAddressSpaceMapping.set(PgslDeclarationType.Storage, PgslValueAddressSpace.Storage);
        lAddressSpaceMapping.set(PgslDeclarationType.Uniform, PgslValueAddressSpace.Uniform);
        lAddressSpaceMapping.set(PgslDeclarationType.Workgroup, PgslValueAddressSpace.Workgroup);
        lAddressSpaceMapping.set(PgslDeclarationType.Private, PgslValueAddressSpace.Private);

        // Read mapping of declaration type, default to none address space for unsupported declarations.
        return lAddressSpaceMapping.getOrDefault(this.mDeclarationType, PgslValueAddressSpace.None);
    }

    /**
     * Determinate if declaration is a constant.
     */
    private determinateIsConstant(): boolean {
        // Is a constant on constant declarations declaration
        return this.mDeclarationType === PgslDeclarationType.Const;
    }

    /**
     * Determinate if declaration is a creation fixed constant.
     */
    private determinateIsCreationFixed(): boolean {
        // Constant values are also creation fixed
        if (this.isConstant) {
            return true;
        }

        // Is a creation fixed on param declarations declaration
        return this.mDeclarationType === PgslDeclarationType.Param;
    }
}

export type PgslVariableDeclarationSyntaxTreeStructureData = {
    attributes: PgslAttributeListSyntaxTree;
    declarationType: string;
    name: string;
    type: PgslTypeDeclarationSyntaxTree;
    expression?: BasePgslExpressionSyntaxTree;
};