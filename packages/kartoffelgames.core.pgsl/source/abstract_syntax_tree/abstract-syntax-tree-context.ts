import { Exception } from "@kartoffelgames/core";
import type { AbstractSyntaxTree } from './abstract-syntax-tree.ts';
import type { PgslFunctionDeclaration } from './declaration/pgsl-function-declaration.ts';
import type { DocumentAst } from './document-ast.ts';
import type { PgslDoWhileStatement } from './statement/branch/pgsl-do-while-statement.ts';
import type { PgslForStatement } from './statement/branch/pgsl-for-statement.ts';
import type { PgslSwitchStatement } from './statement/branch/pgsl-switch-statement.ts';
import type { PgslWhileStatement } from './statement/branch/pgsl-while-statement.ts';
import { IAbstractSyntaxTreeValue } from "./i-abstract-syntax-tree-value.interface.ts";

/**
 * Represents a scope within the PGSL syntax tree trace.
 * Manages variable visibility, scope hierarchy, and value tracking within a specific scope context.
 */
export class AbstractSyntaxTreeContext {
    private mScope: AbstractSyntaxTreeScope | null;
    private mDocument: DocumentAst | null;
    private readonly mIncidents: Array<AbstractSyntaxTreeIncident>;

    /**
     * Gets the list of incidents that have been recorded in this trace.
     *
     * @returns A readonly array of trace incidents.
     */
    public get incidents(): ReadonlyArray<AbstractSyntaxTreeIncident> {
        return this.mIncidents;
    }

    /**
     * Pushes an incident to the trace for later analysis or reporting.
     *
     * @param pMessage - The message describing the incident.
     * @param pSyntaxTree - Optional syntax tree node associated with the incident.
     *
     * @throws {Error} When the trace is sealed.
     */
    public pushIncident(pMessage: string, pSyntaxTree?: AbstractSyntaxTree): void {
        this.mIncidents.push(new AbstractSyntaxTreeIncident(pMessage, pSyntaxTree));
    }

    /**
     * Creates a new syntax tree trace scope.
     * 
     * @param pTrace - The parent trace instance.
     * @param pType - Type of scope.
     * @param pParent - Parent scope, or null for root scope.
     */
    public constructor() {
        this.mScope = null;
        this.mDocument = null;
        this.mIncidents = new Array<AbstractSyntaxTreeIncident>();
    }

    /**
     * Execute action in a new scope.
     * Creates a new scope, executes the provided action within that scope,
     * and then automatically removes the scope when the action completes.
     *
     * @typeParam T - Result type of the scope action.
     *
     * @param pType - Type of scope to create.
     * @param pScopeAction - Action to execute within the new scope.
     * @param pOwner - The owner of the scope.
     * 
     * @returns The result of the scope action.
     * 
     * @throws {Exception} When the document is not set.
     */
    public pushScope<T = void>(pType: PgslSyntaxTreeTraceScopeType, pScopeAction: () => T, pOwner: AbstractSyntaxTree): T {
        if (!this.mDocument) {
            throw new Exception(`Cannot create scope before document is set.`, this);
        }

        // Save the current scope.
        const lLastScope: AbstractSyntaxTreeScope | null = this.mScope;

        // Replace current level with new scope.
        this.mScope = {
            document: this.mDocument,
            type: pType,
            parent: lLastScope,
            values: new Map<string, IAbstractSyntaxTreeValue>(),
            owner: pOwner
        };

        // execute scope action and restore last scope afterwards.
        try {
            return pScopeAction();
        } finally {
            this.mScope = lLastScope;
        }
    }

    /**
     * 
     * @param pDocument 
     */
    public setDocument(pDocument: DocumentAst): void {
        if (this.mDocument) {
            throw new Exception(`Document is already set for this scope.`, this);
        }

        this.mDocument = pDocument;
    }

    /**
     * Searches for a value in this scope and parent scopes.
     * Returns the value trace if found, otherwise null.
     * 
     * @param pName 
     */
    public getValue(pName: string): IAbstractSyntaxTreeValue | null {
        if (!this.mScope) {
            return null;
        }

        // Check if value exists in any scope.
        let lCurrentScope: AbstractSyntaxTreeScope | null = this.mScope;
        do {
            if (lCurrentScope.values.has(pName)) {
                return lCurrentScope.values.get(pName)!;
            }
        } while (lCurrentScope = lCurrentScope.parent); // Thats correct, assignment in condition.

        return null;
    }

    /**
     * Sets a value in this scope.
     * 
     * @param pName - The name of the value.
     * @param pValue - The value trace to store.
     * 
     * @throws Error if the value already exists in this scope.
     */
    public addValue(pName: string, pValue: IAbstractSyntaxTreeValue): void {
        // Ensure there is an active scope.
        if (!this.mScope) {
            throw new Exception(`Cannot add value '${pName}' because there is no active scope.`, this);
        }

        // Throw if value already exists in this scope.
        if (this.mScope.values.has(pName)) {
            throw new Error(`Value '${pName}' already exists in current scope.`);
        }

        this.mScope.values.set(pName, pValue);
    }

    /**
     * Checks if the current scope or any parent scope is of the specified type.
     * 
     * @param pScopeType - Scope type to check for.
     * 
     * @returns True if the scope type matches, false otherwise.
     */
    public hasScope<T extends PgslSyntaxTreeTraceScopeType>(pScopeType: T): PgslSyntaxTreeTraceScopeScopeOwner<T> | null {
        if (!this.mScope) {
            return null;
        }

        // Check if value exists in any scope.
        let lCurrentScope: AbstractSyntaxTreeScope | null = this.mScope;
        do {
            // Return owner if scope type matches.
            if (lCurrentScope.type === pScopeType) {
                return lCurrentScope.owner as PgslSyntaxTreeTraceScopeScopeOwner<T>;
            }
        } while (lCurrentScope = lCurrentScope.parent); // Thats correct, assignment in condition.

        return null;
    }
}

type AbstractSyntaxTreeScope = {
    document: DocumentAst;
    type: PgslSyntaxTreeTraceScopeType;
    parent: AbstractSyntaxTreeScope | null;
    values: Map<string, IAbstractSyntaxTreeValue>;
    owner: AbstractSyntaxTree;
};

export type PgslSyntaxTreeTraceScopeScopeOwner<T extends PgslSyntaxTreeTraceScopeType> =
    T extends 'function' ? PgslFunctionDeclaration :
    T extends 'global' ? DocumentAst :
    T extends 'loop' ? (PgslDoWhileStatement | PgslForStatement | PgslWhileStatement) :
    T extends 'switch' ? PgslSwitchStatement :
    T extends 'inherit' ? AbstractSyntaxTree : never;

/**
 * Type representing different kinds of scopes in PGSL syntax tree tracing.
 * 
 * - `global`: The global/document scope
 * - `function`: Function body scope
 * - `loop`: Loop body scope (for, while, etc.)
 * - `inherit`: Scope that inherits from parent without creating new variable binding level
 */
export type PgslSyntaxTreeTraceScopeType = 'global' | 'function' | 'loop' | 'switch' | 'inherit';

/**
 * Represents an incident that occurred during syntax tree building.
 * Contains information about issues found during analysis or processing.
 */
export class AbstractSyntaxTreeIncident {
    private readonly mMessage: string;
    private readonly mSyntaxTree: AbstractSyntaxTree | undefined;

    /**
     * Gets the message describing the incident.
     *
     * @returns The incident message.
     */
    public get message(): string {
        return this.mMessage;
    }

    /**
     * Gets the syntax tree node associated with the incident, if any.
     *
     * @returns The associated syntax tree node or undefined if none.
     */
    public get syntaxTree(): AbstractSyntaxTree | undefined {
        return this.mSyntaxTree;
    }

    /**
     * Creates a new trace incident.
     *
     * @param pMessage - The message describing the incident.
     * @param pSyntaxTree - Optional syntax tree node associated with the incident.
     */
    public constructor(pMessage: string, pSyntaxTree?: AbstractSyntaxTree) {
        this.mMessage = pMessage;
        this.mSyntaxTree = pSyntaxTree;
    }
}
