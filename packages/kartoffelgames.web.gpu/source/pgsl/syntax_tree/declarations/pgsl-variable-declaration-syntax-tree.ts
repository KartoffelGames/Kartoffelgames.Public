import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslDeclarationType } from '../../enum/pgsl-declaration-type.enum';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';
import { PgslTypeDeclarationSyntaxTree } from '../type/pgsl-type-declaration-syntax-tree';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslVariableDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<PgslVariableDeclarationSyntaxTreeStructureData> {
    private readonly mDeclarationType: PgslDeclarationType;
    private readonly mExpression: BasePgslExpressionSyntaxTree | null;
    private readonly mName: string;
    private readonly mTypeDeclaration: PgslTypeDeclarationSyntaxTree;

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
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Variable type declaration.
     */
    public get typeDeclaration(): PgslTypeDeclarationSyntaxTree {
        return this.mTypeDeclaration;
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
        this.mExpression = null;

        // Optional expression.
        if (pData.expression) {
            this.mExpression = pData.expression;
        }
    }

    /**
     * Determinate if declaration is a constant.
     */
    protected determinateIsConstant(): boolean {
        // Create list of all constant declaration types.
        const lConstDeclarationTypeList: Array<PgslDeclarationType> = [
            PgslDeclarationType.Const,
            PgslDeclarationType.Param,
        ];

        return lConstDeclarationTypeList.includes(this.mDeclarationType);
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
}

export type PgslVariableDeclarationSyntaxTreeStructureData = {
    attributes: PgslAttributeListSyntaxTree;
    declarationType: string;
    name: string;
    type: PgslTypeDeclarationSyntaxTree;
    expression?: BasePgslExpressionSyntaxTree;
};