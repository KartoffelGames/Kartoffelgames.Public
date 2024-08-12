import { Dictionary } from 'packages/kartoffelgames.core/library/source';
import { PgslStatement } from './pgsl-statement';
import { PgslVariableDeclarationStatement } from './pgsl-variable-declaration-statement';

/**
 * Block statement. Handles scoped values.
 */
export class PgslBlockStatement extends PgslStatement {
    private readonly mVariables: Dictionary<string, PgslVariableDeclarationStatement>;

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mVariables = new Dictionary<string, PgslVariableDeclarationStatement>();
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