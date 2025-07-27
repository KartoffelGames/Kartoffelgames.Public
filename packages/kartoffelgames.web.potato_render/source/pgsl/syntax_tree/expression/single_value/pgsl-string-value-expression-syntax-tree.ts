import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslStringTypeDefinitionSyntaxTree } from '../../type/definition/pgsl-string-type-definition-syntax-tree.ts';
import { BasePgslExpressionSyntaxTree, type PgslExpressionSyntaxTreeSetupData } from '../base-pgsl-expression-syntax-tree.ts';

/**
 * PGSL syntax tree for a single string value of boolean, float, integer or uinteger.
 */
export class PgslStringValueExpressionSyntaxTree extends BasePgslExpressionSyntaxTree {
    private readonly mValue: string;

    /**
     * Value of literal.
     */
    public get value(): string {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pTextValue - Text value.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pTextValue: string, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mValue = pTextValue.substring(1, pTextValue.length - 1);
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data.
     */
    protected override onSetup(): PgslExpressionSyntaxTreeSetupData {
        // Create type declaration.
        const lTypeDeclaration: PgslStringTypeDefinitionSyntaxTree = new PgslStringTypeDefinitionSyntaxTree({
            range: [
                this.meta.position.start.line,
                this.meta.position.start.column,
                this.meta.position.end.line,
                this.meta.position.end.column,
            ]
        });

        return {
            expression: {
                isFixed: true,
                isStorage: false,
                resolveType: lTypeDeclaration,
                isConstant: true
            },
            data: null
        };
    }
}

export type PgslStringValueExpressionSyntaxTreeStructureData = {

};