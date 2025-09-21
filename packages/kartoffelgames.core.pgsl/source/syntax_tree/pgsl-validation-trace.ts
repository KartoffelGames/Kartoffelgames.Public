import { Dictionary, Exception } from '@kartoffelgames/core';
import type { BasePgslSyntaxTree, SyntaxTreeMeta } from './base-pgsl-syntax-tree.ts';

/**
 * Trace for pgsl syntax tree validation.
 * Scopes are created mostly by block statements.
 * 
 * @template TValidationAttachment - Current restricted type of attachable data to the validation trace.
 */
export class PgslValidationTrace {
    private readonly mScopeList: Array<PgslSyntaxTreeValidationTraceScope>;
    private readonly mErrorList: Array<PgslParserError>;
    private readonly mAttachment: WeakMap<BasePgslSyntaxTree, object>;

    /**
     * Get the list of errors.
     * 
     * @returns List of errors.
     */
    public get errors(): ReadonlyArray<PgslParserError> {
        return this.mErrorList;
    }

    /**
     * Get the current scope.
     */
    public get scope(): PgslSyntaxTreeValidationTraceScope {
        if (this.mScopeList.length === 0) {
            throw new Exception(`No scope available.`, this);
        }

        return this.mScopeList.at(-1)!;
    }

    /**
     * Create a scope object.
     */
    public constructor() {
        // Initialize scope list, error list and attachment map.
        this.mScopeList = new Array<PgslSyntaxTreeValidationTraceScope>();
        this.mErrorList = new Array<PgslParserError>();
        this.mAttachment = new WeakMap<BasePgslSyntaxTree, object>();
    }

    /**
     * Get the attachment for a specific syntax tree.
     * 
     * @param pTarget - Target syntax tree.
     * 
     * @returns Attachment for the target syntax tree.
     */
    public getAttachment<TTarget extends BasePgslSyntaxTree>(pTarget: TTarget): PgslSyntaxTreeValidationAttachment<TTarget> {
        // Check if attachment exists and throw  if not.
        if (!this.mAttachment.has(pTarget)) {
            throw new Exception(`No attachment found for target syntax tree`, pTarget);
        }

        return this.mAttachment.get(pTarget)! as PgslSyntaxTreeValidationAttachment<TTarget>;
    }

    /**
     * Attach a value to the current syntax tree.
     * 
     * @param pTarget - Target syntax tree.
     * @param pValue - Value to attach.
     */
    public attachValue<TTarget extends BasePgslSyntaxTree>(pTarget: TTarget, pValue: PgslSyntaxTreeValidationAttachment<TTarget>): void {
        if (typeof pValue === 'undefined') {
            throw new Exception(`Cannot attach undefined value to syntax tree`, pTarget);
        }

        // Attach value to current syntax tree.
        this.mAttachment.set(pTarget, pValue);
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
            const lScopeValues: PgslSyntaxTreeValidationTraceScope = this.mScopeList[lIndex];

            // Check if value is defined in current scope and return it.
            if (lScopeValues.values.has(pValueName)) {
                return lScopeValues.values.get(pValueName)!;
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
        if (lCurrentScope.values.has(pValueName)) {
            throw new Exception(`Scoped value "${pValueName}" already defined for current scope.`, this);
        }

        // Push value to current scope.
        lCurrentScope.values.set(pValueName, pValue);
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
     * @param pScopeTree - Scope tree to create.
     * @param pScopeAction - Action to execute in scope.
     */
    public newScope(pScopeTree: BasePgslSyntaxTree, pScopeAction: () => void): void {
        // Read last scopes.
        const lLastScopes: Array<BasePgslSyntaxTree> = new Array<BasePgslSyntaxTree>();
        if (this.mScopeList.length > 0) {
            lLastScopes.push(...this.mScopeList.at(-1)!.scopes);
        }

        // Push new scope tree to last scopes.
        lLastScopes.push(pScopeTree);

        // Create new scope.
        const lScope: PgslSyntaxTreeValidationTraceScope = new PgslSyntaxTreeValidationTraceScope(lLastScopes);

        // Add scope to list.
        this.mScopeList.push(lScope);

        // Execute scope action.
        try {
            pScopeAction();
        } finally {
            // Remove scope from list.
            this.mScopeList.pop();
        }
    }
}

class PgslSyntaxTreeValidationTraceScope {
    private readonly mScopes: Array<BasePgslSyntaxTree>;
    private readonly mValues: Dictionary<string, BasePgslSyntaxTree>;

    /**
     * Get the scope.
     */
    public get scopes(): Array<BasePgslSyntaxTree> {
        return this.mScopes;
    }

    /**
     * Get the values of the scope.
     * 
     * @returns Values of the scope.
     */
    public get values(): Dictionary<string, BasePgslSyntaxTree> {
        return this.mValues;
    }

    /**
     * Constructor.
     * 
     * @param pScope - Scope.
     */
    public constructor(pScopes: Array<BasePgslSyntaxTree>) {
        this.mScopes = pScopes;
        this.mValues = new Dictionary<string, BasePgslSyntaxTree>();
    }

    /**
     * Check if the scope has a specific scope type.
     * 
     * @param pScopeType - Scope type to check for.
     * 
     * @returns True if the scope has the specified scope type, false otherwise.
     */
    public hasScope<T extends BasePgslSyntaxTree>(pScopeType: new (...args: any[]) => T): boolean {
        return this.mScopes.some(scope => scope instanceof pScopeType);
    }

    /**
     * Check if the direct scope has a specific scope type.
     * 
     * @param pScopeType - Scope type to check for.
     * 
     * @returns True if the scope has the specified scope type, false otherwise.
     */
    public hasDirectScope<T extends BasePgslSyntaxTree>(pScopeType: new (...args: any[]) => T): boolean {
        return this.mScopes[0] instanceof pScopeType;
    }

    public getScopeOf<T extends BasePgslSyntaxTree>(pScopeType: new (...args: any[]) => T): T {
        // Find scope tree of type.
        const lScopeTree = this.mScopes.find(scope => scope instanceof pScopeType) as T | undefined;
        if (!lScopeTree) {
            throw new Exception(`Scope of type ${pScopeType.name} not found.`, this);
        }

        return lScopeTree;
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

type PgslSyntaxTreeValidationAttachment<T> = T extends BasePgslSyntaxTree<infer TAttachment> ? TAttachment : never;