import { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';
import { PgslBlockStatementSyntaxTree } from '../statement/pgsl-block-statement-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslFunctionDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree {
    private readonly mBlock: PgslBlockStatementSyntaxTree;
    private readonly mConstant: boolean;
    private readonly mName: string;
    private readonly mParameter: Array<PgslFunctionDeclarationParameter>;
    private readonly mReturnType: BasePgslTypeDefinitionSyntaxTree;

    /**
     * Function block.
     */
    public get block(): PgslBlockStatementSyntaxTree {
        return this.mBlock;
    }

    /**
     * Function declaration can be used to create constant expressions.
     */
    public get isConstant(): boolean {
        return this.mConstant;
    }

    /**
     * Function name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Function parameter list.
     */
    public get parameter(): Array<PgslFunctionDeclarationParameter> {
        return [...this.mParameter];
    }

    /**
     * Function return type.
     */
    public get returnType(): BasePgslTypeDefinitionSyntaxTree {
        return this.mReturnType;
    }

    /**
     * Constructor.
     * 
     * @param pParameter - Construction parameter.
     * @param pAttributeList - Declaration attribute list.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pParameter: PgslFunctionDeclarationSyntaxTreeConstructorParameter, pAttributes: PgslAttributeListSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pAttributes, pMeta);

        // Set data.
        this.mConstant = pParameter.constant;
        this.mBlock = pParameter.block;
        this.mName = pParameter.name;
        this.mParameter = pParameter.parameter;
        this.mReturnType = pParameter.returnType;

        // Add function child trees.
        this.appendChild(pParameter.block);
        this.appendChild(pParameter.returnType);

        // Add each parameter type as child tree.
        for (const lParameter of pParameter.parameter) {
            this.appendChild(lParameter.type);
        }
    }
}

type PgslFunctionDeclarationParameter = {
    readonly type: BasePgslTypeDefinitionSyntaxTree;
    readonly name: string;
};

export type PgslFunctionDeclarationSyntaxTreeConstructorParameter = {
    name: string;
    parameter: Array<PgslFunctionDeclarationParameter>;
    returnType: BasePgslTypeDefinitionSyntaxTree;
    block: PgslBlockStatementSyntaxTree;
    constant: boolean;
};