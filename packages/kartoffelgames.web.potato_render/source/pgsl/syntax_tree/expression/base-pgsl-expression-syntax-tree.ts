import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree';

/**
 * PGSL base expression.
 */
export abstract class BasePgslExpressionSyntaxTree<TSetupData = unknown> extends BasePgslSyntaxTree<PgslExpressionSyntaxTreeSetupData<TSetupData>> {
    /**
     * If expression is a constant expression.
     */
    public get isConstant(): boolean {
        this.ensureSetup();

        return this.setupData.expression.isConstant;
    }

    /**
     * If expression is a constant expression.
     */
    public get isCreationFixed(): boolean {
        this.ensureSetup();

        return this.setupData.expression.isFixed;
    }

    /**
     * If expression is value storage.
     */
    public get isStorage(): boolean {
        this.ensureSetup();

        return this.setupData.expression.isStorage;
    }

    /**
     * Type the expression will resolve into.
     */
    public get resolveType(): BasePgslTypeDefinitionSyntaxTree {
        this.ensureSetup();

        return this.setupData.expression.resolveType;
    }

    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta, false);
    }

    /**
     * Retrieve data of current structure.
     */
    protected abstract override onSetup(): PgslExpressionSyntaxTreeSetupData<TSetupData>;
}

export type PgslExpressionSyntaxTreeSetupData<TSetupData = unknown> = {
    expression: {
        isConstant: boolean;
        isFixed: boolean;
        isStorage: boolean;
        resolveType: BasePgslTypeDefinitionSyntaxTree;
    };
    data: TSetupData;
};