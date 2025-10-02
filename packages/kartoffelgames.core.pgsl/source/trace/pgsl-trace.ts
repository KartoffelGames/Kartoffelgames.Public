import { Stack } from "@kartoffelgames/core";
import { BasePgslSyntaxTree } from "../syntax_tree/base-pgsl-syntax-tree.ts";
import { PgslAliasTrace } from "./pgsl-alias-trace.ts";
import { PgslEnumTrace } from "./pgsl-enum-trace.ts";
import { PgslExpressionTrace } from "./pgsl-expression-trace.ts";
import { PgslFunctionTrace } from "./pgsl-function-trace.ts";
import { PgslStructTrace } from "./pgsl-struct-trace.ts";
import { PgslTraceScope, type PgslSyntaxTreeTraceScopeType } from "./pgsl-trace-scope.ts";

/**
 * Main trace class for PGSL syntax tree analysis and transpilation.
 * Coordinates all tracing activities including scoping, type resolution, and code generation context.
 */
export class PgslTrace {
    private mSealed: boolean;
    private readonly mAliases: Map<string, PgslAliasTrace>;
    private readonly mEnums: Map<string, PgslEnumTrace>;
    private readonly mStructs: Map<string, PgslStructTrace>;
    private readonly mFunctions: Map<string, PgslFunctionTrace>;
    private readonly mExpressions: Map<string, PgslExpressionTrace>;
    private readonly mTreeScopes: Map<BasePgslSyntaxTree, PgslTraceScope>;
    private readonly mScopeList: Stack<PgslTraceScope>;

    /**
     * Gets whether this trace has been sealed.
     * 
     * @returns True if sealed, false otherwise.
     */
    public get isSealed(): boolean {
        return this.mSealed;
    }

    /**
     * Gets the current scope if one exists.
     * 
     * @returns The current scope or undefined if no scope is active.
     */
    public get currentScope(): PgslTraceScope | undefined {
        return this.mScopeList.top;
    }

    /**
     * Creates a new syntax tree trace.
     */
    public constructor() {
        this.mSealed = false;
        this.mAliases = new Map<string, PgslAliasTrace>();
        this.mEnums = new Map<string, PgslEnumTrace>();
        this.mStructs = new Map<string, PgslStructTrace>();
        this.mTreeScopes = new Map<BasePgslSyntaxTree, PgslTraceScope>();
        this.mScopeList = new Stack<PgslTraceScope>();
        this.mFunctions = new Map<string, PgslFunctionTrace>();
        this.mExpressions = new Map<string, PgslExpressionTrace>();
    }

    /**
     * Seal the trace to prevent further modifications.
     * Once sealed, no new scopes can be created and no new trace information can be added.
     */
    public seal(): void {
        this.mSealed = true;
    }

    /**
     * Gets the trace scope for a specific syntax tree.
     * 
     * @param pTree - Syntax tree to get scope for.
     * 
     * @returns The trace scope for the specified tree.
     * 
     * @throws Error if the tree is not traced.
     */
    public scopeOf<T extends BasePgslSyntaxTree>(pTree: T): PgslTraceScope {
        if(!this.mTreeScopes.has(pTree)) {
            throw new Error('Tree is not traced.');
        }

        return this.mTreeScopes.get(pTree)!;
    }

    /**
     * Execute action in a new scope.
     * Creates a new scope, executes the provided action within that scope,
     * and then automatically removes the scope when the action completes.
     * 
     * @param pType - Type of scope to create.
     * @param pScopeAction - Action to execute within the new scope.
     * 
     * @throws Error if the trace is sealed.
     */
    public newScope(pType: PgslSyntaxTreeTraceScopeType, pScopeAction: () => void): void {
        this.assertNotSealed();

        // Create scope and push to stack.
        this.mScopeList.push(new PgslTraceScope(this, pType, this.mScopeList.top ?? null));

        try {
            pScopeAction();
        } finally {
            this.mScopeList.pop();
        }
    }

    /**
     * Gets an alias trace by name.
     * 
     * @param pName - The name of the alias.
     * 
     * @returns The alias trace if found, undefined otherwise.
     */
    public getAlias(pName: string): PgslAliasTrace | undefined {
        return this.mAliases.get(pName);
    }

    /**
     * Sets an alias trace.
     * 
     * @param pName - The name of the alias.
     * @param pTrace - The alias trace information.
     * 
     * @throws Error if the trace is sealed.
     */
    public setAlias(pName: string, pTrace: PgslAliasTrace): void {
        this.assertNotSealed();
        this.mAliases.set(pName, pTrace);
    }

    /**
     * Gets an enum trace by name.
     * 
     * @param pName - The name of the enum.
     * 
     * @returns The enum trace if found, undefined otherwise.
     */
    public getEnum(pName: string): PgslEnumTrace | undefined {
        return this.mEnums.get(pName);
    }

    /**
     * Sets an enum trace.
     * 
     * @param pName - The name of the enum.
     * @param pTrace - The enum trace information.
     * 
     * @throws Error if the trace is sealed.
     */
    public setEnum(pName: string, pTrace: PgslEnumTrace): void {
        this.assertNotSealed();
        this.mEnums.set(pName, pTrace);
    }

    /**
     * Gets a struct trace by name.
     * 
     * @param pName - The name of the struct.
     * 
     * @returns The struct trace if found, undefined otherwise.
     */
    public getStruct(pName: string): PgslStructTrace | undefined {
        return this.mStructs.get(pName);
    }

    /**
     * Sets a struct trace.
     * 
     * @param pName - The name of the struct.
     * @param pTrace - The struct trace information.
     * 
     * @throws Error if the trace is sealed.
     */
    public setStruct(pName: string, pTrace: PgslStructTrace): void {
        this.assertNotSealed();
        this.mStructs.set(pName, pTrace);
    }

    /**
     * Gets a function trace by name.
     * 
     * @param pName - The name of the function.
     * 
     * @returns The function trace if found, undefined otherwise.
     */
    public getFunction(pName: string): PgslFunctionTrace | undefined {
        return this.mFunctions.get(pName);
    }

    /**
     * Sets a function trace.
     * 
     * @param pName - The name of the function.
     * @param pTrace - The function trace information.
     * 
     * @throws Error if the trace is sealed.
     */
    public setFunction(pName: string, pTrace: PgslFunctionTrace): void {
        this.assertNotSealed();
        this.mFunctions.set(pName, pTrace);
    }

    /**
     * Assert that the trace is not sealed.
     * 
     * @throws Error if the trace is sealed.
     */
    private assertNotSealed(): void {
        if (this.mSealed) {
            throw new Error('Trace is sealed.');
        }
    }
}