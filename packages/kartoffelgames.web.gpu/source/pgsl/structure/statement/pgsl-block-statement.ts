import { Dictionary } from '@kartoffelgames/core';
import { BasePgslStructure } from '../../base-pgsl-structure';
import { PgslStatement } from './pgsl-statement';
import { PgslVariableDeclarationStatement } from './pgsl-variable-declaration-statement';

/**
 * Block statement. Handles scoped values.
 */
export class PgslBlockStatement extends PgslStatement {
    private readonly mStatementList: Array<PgslStatement>;
    private readonly mVariables: Dictionary<string, PgslVariableDeclarationStatement>;

    /**
     * Next valid scope.
     * The only valid scope of null is the document.
     */
    public get scope(): PgslBlockStatement | null {
        let lStructure: BasePgslStructure | null = this;
        while ((lStructure = lStructure.parent) !== null) {
            if (lStructure instanceof PgslBlockStatement) {
                return lStructure;
            }
        }

        return null;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mStatementList = new Array<PgslStatement>();
        this.mVariables = new Dictionary<string, PgslVariableDeclarationStatement>();
    }

    /**
     * Add statement to block in order. 
     * 
     * @param pStatement - Statement.
     */
    public addStatement(pStatement: PgslStatement): void {
        this.mStatementList.push(pStatement);
    }

    /**
     * Validate existance of variable by returning its reference.
     * 
     * @param pVariableName - Variable name. case sensitive.
     * 
     * @returns the reference of the variable expression or null when not found.
     */
    public validVariable(pVariableName: string): PgslVariableDeclarationStatement | null {
        // Variable found in current block.
        if (this.mVariables.has(pVariableName)) {
            return this.mVariables.get(pVariableName)!;
        }

        // Try to find in parent. When parent scope exists.
        if (this.scope) {
            return this.scope.validVariable(pVariableName);
        }

        // Or is it in module scope.
        return this.document.validVariable(pVariableName);
    }
}