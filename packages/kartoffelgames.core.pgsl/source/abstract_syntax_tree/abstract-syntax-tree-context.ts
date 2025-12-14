import { Exception } from "@kartoffelgames/core";
import type { AbstractSyntaxTree } from './abstract-syntax-tree.ts';
import type { FunctionDeclarationAst } from './declaration/pgsl-function-declaration.ts';
import type { DocumentAst } from './document-ast.ts';
import { IValueStoreAst } from "./i-value-store-ast.interface.ts";
import type { PgslDoWhileStatement } from './statement/branch/pgsl-do-while-statement.ts';
import type { PgslForStatement } from './statement/branch/pgsl-for-statement.ts';
import type { PgslSwitchStatement } from './statement/branch/pgsl-switch-statement.ts';
import type { PgslWhileStatement } from './statement/branch/pgsl-while-statement.ts';
import { AliasDeclarationAst } from "./declaration/alias-declaration-ast.ts";
import { StructDeclarationAst } from "./declaration/struct-declaration-ast.ts";
import { EnumDeclarationAst } from "./declaration/enum-declaration-ast.ts";

/**
 * Represents a syntax tree context for building abstract syntax trees.
 * Manages variable visibility, scope hierarchy, and value tracking within a specific scope context.
 */
export class AbstractSyntaxTreeContext {
    private readonly mAliases: Map<string, AliasDeclarationAst>;
    private readonly mEnums: Map<string, EnumDeclarationAst>;
    private readonly mFunctions: Map<string, FunctionDeclarationAst>;
    private readonly mStructs: Map<string, StructDeclarationAst>;
    private mScope: AbstractSyntaxTreeScope | null;
    private mDocument: DocumentAst | null;
    private readonly mIncidents: Array<AbstractSyntaxTreeIncident>;

    /**
     * Gets the document associated with this context.
     *
     * @returns The document AST node.
     *
     * @throws {Error} When no document is set for this context.
     */
    public get document(): DocumentAst {
        if (!this.mDocument) {
            throw new Exception(`No document is set for this context.`, this);
        }

        return this.mDocument;
    }

    /**
     * Gets the list of incidents that have been recorded in this context.
     *
     * @returns A readonly array of context incidents.
     */
    public get incidents(): ReadonlyArray<AbstractSyntaxTreeIncident> {
        return this.mIncidents;
    }

    /**
     * Pushes an incident to the context for later analysis or reporting.
     *
     * @param pMessage - The message describing the incident.
     * @param pSyntaxTree - Optional syntax tree node associated with the incident.
     *
     * @throws {Error} When the context is sealed.
     */
    public pushIncident(pMessage: string, pSyntaxTree?: AbstractSyntaxTree): void {
        this.mIncidents.push(new AbstractSyntaxTreeIncident(pMessage, pSyntaxTree));
    }

    /**
     * Creates a new syntax tree context scope.
     */
    public constructor() {
        this.mScope = null;
        this.mDocument = null;
        this.mIncidents = new Array<AbstractSyntaxTreeIncident>();

        // Initialize declaration maps.
        this.mAliases = new Map<string, AliasDeclarationAst>();
        this.mEnums = new Map<string, EnumDeclarationAst>();
        this.mFunctions = new Map<string, FunctionDeclarationAst>();
        this.mStructs = new Map<string, StructDeclarationAst>();
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
     */
    public pushScope<T = void>(pType: AbstractSyntaxTreeContextScopeType, pScopeAction: () => T, pOwner: AbstractSyntaxTree): T {
        // Save the current scope.
        const lLastScope: AbstractSyntaxTreeScope | null = this.mScope;

        // Replace current level with new scope.
        this.mScope = {
            type: pType,
            parent: lLastScope,
            values: new Map<string, IValueStoreAst>(),
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
     * Returns the value store if found, otherwise null.
     * 
     * @param pName 
     */
    public getValue(pName: string): IValueStoreAst | null {
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
     * Gets an alias by name.
     *
     * @param pName - The name of the alias.
     *
     * @returns The alias if found, undefined otherwise.
     */
    public getAlias(pName: string): AliasDeclarationAst | undefined {
        return this.mAliases.get(pName);
    }

    /**
     * Gets an enum by name.
     *
     * @param pName - The name of the enum.
     *
     * @returns The enum if found, undefined otherwise.
     */
    public getEnum(pName: string): EnumDeclarationAst | undefined {
        return this.mEnums.get(pName);
    }

    /**
     * Gets a function by name.
     *
     * @param pName - The name of the function.
     *
     * @returns The function if found, undefined otherwise.
     */
    public getFunction(pName: string): FunctionDeclarationAst | undefined {
        return this.mFunctions.get(pName);
    }

    /**
     * Gets a struct by name.
     *
     * @param pName - The name of the struct.
     *
     * @returns The struct if found, undefined otherwise.
     */
    public getStruct(pName: string): StructDeclarationAst | undefined {
        return this.mStructs.get(pName);
    }

    /**
     * Sets a value in this scope.
     * 
     * @param pName - The name of the value.
     * @param pValue - The value to store.
     * 
     * @throws Error if the value already exists in this scope.
     */
    public addValue(pValue: IValueStoreAst): void {
        // Ensure there is an active scope.
        if (!this.mScope) {
            throw new Exception(`Cannot add value '${pValue.data.name}' because there is no active scope.`, this);
        }

        // Throw if value already exists in this scope.
        if (this.mScope.values.has(pValue.data.name)) {
            throw new Error(`Value '${pValue.data.name}' already exists in current scope.`);
        }

        this.mScope.values.set(pValue.data.name, pValue);
    }

    /**
     * Checks if the current scope or any parent scope is of the specified type.
     * 
     * @param pScopeType - Scope type to check for.
     * 
     * @returns True if the scope type matches, false otherwise.
     */
    public hasScope<T extends AbstractSyntaxTreeContextScopeType>(pScopeType: T): PgslSyntaxTreeTraceScopeScopeOwner<T> | null {
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

    /**
     * Sets an alias to the current scope.
     *
     * @param pAst - The alias information.
     */
    public registerAlias(pAst: AliasDeclarationAst): void {
        this.mAliases.set(pAst.data.aliasName, pAst);
    }

    /**
     * Sets an enum to the current scope.
     *
     * @param pAst - The enum information.
     */
    public registerEnum(pAst: EnumDeclarationAst): void {
        this.mEnums.set(pAst.data.name, pAst);
    }

    /**
     * Sets a function to the current scope.
     *
     * @param pAst - The function information.
     */
    public registerFunction(pAst: FunctionDeclarationAst): void {
        this.mFunctions.set(pAst.name, pAst);
    }

    /**
     * Sets a struct to the current scope.
     *
     * @param pAst - The struct information.
     */
    public registerStruct(pAst: StructDeclarationAst): void {
        this.mStructs.set(pAst.name, pAst);
    }
}

type AbstractSyntaxTreeScope = {
    type: AbstractSyntaxTreeContextScopeType;
    parent: AbstractSyntaxTreeScope | null;
    values: Map<string, IValueStoreAst>;
    owner: AbstractSyntaxTree;
};

export type PgslSyntaxTreeTraceScopeScopeOwner<T extends AbstractSyntaxTreeContextScopeType> =
    T extends 'function' ? FunctionDeclarationAst :
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
export type AbstractSyntaxTreeContextScopeType = 'global' | 'function' | 'loop' | 'switch' | 'inherit';

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
