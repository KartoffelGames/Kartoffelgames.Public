import type { BasePgslSyntaxTree } from '../syntax_tree/base-pgsl-syntax-tree.ts';
import type { PgslFunctionDeclaration } from '../syntax_tree/declaration/pgsl-function-declaration.ts';
import type { PgslDocument } from '../syntax_tree/pgsl-document.ts';
import type { PgslDoWhileStatement } from '../syntax_tree/statement/branch/pgsl-do-while-statement.ts';
import type { PgslForStatement } from '../syntax_tree/statement/branch/pgsl-for-statement.ts';
import type { PgslSwitchStatement } from '../syntax_tree/statement/branch/pgsl-switch-statement.ts';
import type { PgslWhileStatement } from '../syntax_tree/statement/branch/pgsl-while-statement.ts';
import type { PgslValueTrace } from './pgsl-value-trace.ts';

/**
 * Represents a scope within the PGSL syntax tree trace.
 * Manages variable visibility, scope hierarchy, and value tracking within a specific scope context.
 */
export class PgslTraceScope {
    private readonly mType: PgslSyntaxTreeTraceScopeType;
    private readonly mParent: PgslTraceScope | null;
    private readonly mValues: Map<string, PgslValueTrace>;
    private readonly mOwner: BasePgslSyntaxTree;

    /**
     * Gets the type of this scope.
     * 
     * @returns The scope type.
     */
    public get type(): PgslSyntaxTreeTraceScopeType {
        return this.mType;
    }

    /**
     * Gets the parent scope if one exists.
     * 
     * @returns The parent scope or null if this is the root scope.
     */
    public get parent(): PgslTraceScope | null {
        return this.mParent;
    }

    /**
     * Gets the owner syntax tree of this scope.
     * 
     * @returns The owning PGSL syntax tree.
     */
    public get owner(): BasePgslSyntaxTree {
        return this.mOwner;
    }

    /**
     * Creates a new syntax tree trace scope.
     * 
     * @param pTrace - The parent trace instance.
     * @param pType - Type of scope.
     * @param pParent - Parent scope, or null for root scope.
     */
    public constructor(pType: PgslSyntaxTreeTraceScopeType, pOwner: BasePgslSyntaxTree, pParent: PgslTraceScope | null) {
        this.mType = pType;
        this.mParent = pParent;
        this.mValues = new Map<string, PgslValueTrace>();
        this.mOwner = pOwner;
    }

    /**
     * Searches for a value in this scope and parent scopes.
     * Returns the value trace if found, otherwise null.
     * 
     * @param pName 
     */
    public getValue(pName: string): PgslValueTrace | null {
        // Check if value exists in current scope.
        if (this.mValues.has(pName)) {
            return this.mValues.get(pName)!;
        }

        // If no parent scope exists, value cannot be found.
        if(!this.mParent) {
            return null;
        }

        return this.mParent.getValue(pName) ?? null;
    }

    /**
     * Sets a value in this scope.
     * 
     * @param pName - The name of the value.
     * @param pValue - The value trace to store.
     * 
     * @throws Error if the value already exists in this scope.
     */
    public addValue(pName: string, pValue: PgslValueTrace): void {
        if (this.mValues.has(pName)) {
            throw new Error(`Value '${pName}' already exists in current scope.`);
        }

        this.mValues.set(pName, pValue);
    }

    /**
     * Checks if the current scope or any parent scope is of the specified type.
     * 
     * @param pScopeType - Scope type to check for.
     * 
     * @returns True if the scope type matches, false otherwise.
     */
    public hasScope<T extends PgslSyntaxTreeTraceScopeType>(pScopeType: T): PgslSyntaxTreeTraceScopeScopeOwner<T> | null {
        // Return owner if scope type matches.
        if (this.mType === pScopeType) {
            return this.mOwner as PgslSyntaxTreeTraceScopeScopeOwner<T>;
        }

        // Check parent scope if it exists.
        if (this.mParent) {
            return this.mParent.hasScope(pScopeType);
        }

        return null;
    }

}

export type PgslSyntaxTreeTraceScopeScopeOwner<T extends PgslSyntaxTreeTraceScopeType> = 
    T extends 'function' ? PgslFunctionDeclaration :
    T extends 'global' ? PgslDocument:
    T extends 'loop' ? (PgslDoWhileStatement | PgslForStatement | PgslWhileStatement) :
    T extends 'switch' ? PgslSwitchStatement :
    T extends 'inherit' ? BasePgslSyntaxTree : never;

/**
 * Type representing different kinds of scopes in PGSL syntax tree tracing.
 * 
 * - `global`: The global/document scope
 * - `function`: Function body scope
 * - `loop`: Loop body scope (for, while, etc.)
 * - `inherit`: Scope that inherits from parent without creating new variable binding level
 */
export type PgslSyntaxTreeTraceScopeType = 'global' | 'function' | 'loop' | 'switch' | 'inherit';
