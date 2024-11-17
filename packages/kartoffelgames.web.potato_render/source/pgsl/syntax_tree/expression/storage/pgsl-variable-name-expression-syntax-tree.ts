import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { IPgslVariableDeclarationSyntaxTree } from '../../interface/i-pgsl-variable-declaration-syntax-tree.interface';
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeSetupData } from '../base-pgsl-expression-syntax-tree';

/**
 * PGSL structure holding single variable name.
 */
export class PgslVariableNameExpressionSyntaxTree extends BasePgslExpressionSyntaxTree<PgslVariableNameExpressionSyntaxTreeSetupData> {
    private readonly mName: string;

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Get variable definition.
     */
    public get variable(): IPgslVariableDeclarationSyntaxTree {
        this.ensureSetup();

        return this.setupData.data.variable;
    }

    /**
     * Constructor.
     * 
     * @param pName - Variable name.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pName: string, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mName = pName;
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data.
     */
    protected override onSetup(): PgslExpressionSyntaxTreeSetupData<PgslVariableNameExpressionSyntaxTreeSetupData> {
        const lVariableDefinition: IPgslVariableDeclarationSyntaxTree | undefined = this.scopedVariables.get(this.mName);
        if (!lVariableDefinition) {
            throw new Exception(`Variable "${this.mName}" not defined.`, this);
        }

        return {
            expression: {
                isFixed: lVariableDefinition.isCreationFixed,
                isStorage: true,
                resolveType: lVariableDefinition.type,
                isConstant: lVariableDefinition.isConstant
            },
            data: {
                variable: lVariableDefinition
            }
        };
    }
}

type PgslVariableNameExpressionSyntaxTreeSetupData = {
    variable: IPgslVariableDeclarationSyntaxTree;
};