import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, SyntaxTreeMeta } from "./base-pgsl-syntax-tree.ts";

/**
 * Scope for pgsl syntax tree.
 * Scopes are created mostly by block statements.
 */
export class PgslSyntaxTreeScope {
    private readonly mScopeList: Array<Dictionary<string, BasePgslSyntaxTree>>;
    private readonly mErrorList: Array<PgslParserError>;

    /**
     * Get the list of errors.
     * 
     * @returns List of errors.
     */
    public get errors(): ReadonlyArray<PgslParserError> {
        return this.mErrorList;
    }

    /**
     * Create a scope object.
     */
    public constructor() {
        this.mScopeList = new Array<Dictionary<string, BasePgslSyntaxTree>>();
        this.mErrorList = new Array<PgslParserError>();
    }

    /**
     * Read variable declaration by name.
     * 
     * @param pVariableName - Variable name.
     * 
     * @returns the declaration of the scoped variable.
     * 
     * @throws {@link Exception}
     * When the variable does not exits. 
     */
    public getScopedValue(pValueName: string): BasePgslSyntaxTree {
        // Check if any scope is defined.
        if (this.mScopeList.length === 0) {
            throw new Exception(`No scope defined for value "${pValueName}".`, this);
        }

        // Iterate scoped list in reverse order to find the first declaration.
        for (let lIndex = this.mScopeList.length - 1; lIndex >= 0; lIndex--) {
            // Get scope values.
            const lScopeValues: Dictionary<string, BasePgslSyntaxTree> = this.mScopeList[lIndex];

            // Check if value is defined in current scope and return it.
            if (lScopeValues.has(pValueName)) {
                return lScopeValues.get(pValueName)!;
            }
        }

        // No declaration found.
        throw new Exception(`Value with the name "${pValueName}" not defined in current scope.`, this);
    }

    /**
     * Push a value to next available scope.
     * 
     * @param pValueName - Value name.
     * @param pValue - Value of scoped name. 
     */
    public pushScopedValue(pValueName: string, pValue: BasePgslSyntaxTree): void {
        // Check if any scope is defined.
        if (this.mScopeList.length === 0) {
            throw new Exception(`No scope defined for value "${pValueName}".`, this);
        }

        // Get current scope.
        const lCurrentScope = this.mScopeList[this.mScopeList.length - 1];

        // Check if value is already defined in current scope.
        if (lCurrentScope.has(pValueName)) {
            throw new Exception(`Scoped value "${pValueName}" already defined for current scope.`, this);
        }

        // Push value to current scope.
        lCurrentScope.set(pValueName, pValue);
    }

    /**
     * Push an error to the error list.
     * 
     * @param pMessage - Error message.
     * @param pMeta - Meta information of the error.
     * @param pTarget - Target syntax tree of the error.
     */
    public pushError(pMessage: string, pMeta: SyntaxTreeMeta, pTarget: BasePgslSyntaxTree): void {
        // Add error to list.
        this.mErrorList.push(new PgslParserError(pMessage, pMeta, pTarget));
    }

    /**
     * Execute action in a new scope.
     * 
     * @param pScopeAction - Action to execute in scope.
     */
    public valueScope(pScopeAction: () => void): void {
        // Create new scope.
        const lScope: Dictionary<string, BasePgslSyntaxTree> = new Dictionary<string, BasePgslSyntaxTree>();

        // Add scope to list.
        this.mScopeList.push(lScope);

        // Execute scope action.
        pScopeAction();

        // Remove scope from list.
        this.mScopeList.pop();
    }
}

/**
 * Parser error for pgsl syntax tree.
 */
export class PgslParserError extends Exception<BasePgslSyntaxTree> {
    private readonly mMeta: SyntaxTreeMeta;

    /**
     * Get the meta information of the error.
     * 
     * @returns Meta information of the error.
     */
    public get meta(): SyntaxTreeMeta {
        return this.mMeta;
    }

    /**
     * Create a new parser error.
     * 
     * @param pMessage - Error message.
     * @param pMeta - Meta information of the error.
     * @param pTarget - Target syntax tree of the error.
     */
    public constructor(pMessage: string, pMeta: SyntaxTreeMeta, pTarget: BasePgslSyntaxTree) {
        // Create message with position information.
        let lMessage: string = `Transpile file validation failed: ${pMessage}`;
        lMessage += `[${pMeta.position.start.line}:${pMeta.position.start.column}-${pMeta.position.end.line}:${pMeta.position.end.column}]`;

        // Call base constructor.
        super(lMessage, pTarget);

        // Save meta information.
        this.mMeta = pMeta;
    }
}