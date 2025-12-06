import { Stack } from '@kartoffelgames/core';
import type { BasePgslSyntaxTree } from '../abstract_syntax_tree/base-pgsl-syntax-tree.ts';
import type { PgslStructPropertyDeclaration } from '../abstract_syntax_tree/declaration/pgsl-struct-property-declaration.ts';
import type { PgslExpression } from '../abstract_syntax_tree/expression/pgsl-expression.ts';
import type { PgslAliasTrace } from './pgsl-alias-trace.ts';
import type { PgslEnumTrace } from './pgsl-enum-trace.ts';
import type { PgslExpressionTrace } from './pgsl-expression-trace.ts';
import type { PgslFunctionTrace } from './pgsl-function-trace.ts';
import type { PgslStructPropertyTrace } from './pgsl-struct-property-trace.ts';
import type { PgslStructTrace } from './pgsl-struct-trace.ts';
import { type PgslSyntaxTreeTraceScopeScopeOwner, PgslTraceScope, type PgslSyntaxTreeTraceScopeType } from './pgsl-trace-scope.ts';
import type { PgslValueTrace } from './pgsl-value-trace.ts';

/**
 * Main trace class for PGSL syntax tree analysis and transpilation.
 * Coordinates all tracing activities including scoping, type resolution, and code generation context.
 */
export class PgslTrace {
    private readonly mAliases: Map<string, PgslAliasTrace>;
    private readonly mBindingNameResolutions: PgslTraceBindingNameResolutions;
    private readonly mEnums: Map<string, PgslEnumTrace>;
    private readonly mExpressions: Map<PgslExpression, PgslExpressionTrace>;
    private readonly mFunctions: Map<string, PgslFunctionTrace>;
    private readonly mIncidents: Array<PgslTraceIncident>;
    private readonly mLocationNameResolutions: PgslTraceLocationNameResolutions;
    private readonly mScopeList: Stack<PgslTraceScope>;
    private readonly mStructProperties: Map<PgslStructPropertyDeclaration, PgslStructPropertyTrace>;
    private readonly mStructs: Map<string, PgslStructTrace>;
    private readonly mTreeScopes: Map<BasePgslSyntaxTree, PgslTraceScope>;
    private readonly mVariableDeclarations: Map<string, PgslValueTrace>;

    /**
     * Gets the current scope if one exists.
     *
     * @returns The current scope or undefined if no scope is active.
     *
     * @throws {Error} When no scope is active.
     */
    public get currentScope(): PgslTraceScope {
        if (this.mScopeList.size === 0) {
            throw new Error('No active scope.');
        }

        return this.mScopeList.top!;
    }

    /**
     * Gets the list of incidents that have been recorded in this trace.
     *
     * @returns A readonly array of trace incidents.
     */
    public get incidents(): ReadonlyArray<PgslTraceIncident> {
        return this.mIncidents;
    }

    /**
     * Gets the list of module-level variable declarations.
     *
     * @returns A readonly array of variable declarations.
     */
    public get valueDeclarations(): ReadonlyArray<PgslValueTrace> {
        return Array.from(this.mVariableDeclarations.values());
    }

    /**
     * Creates a new syntax tree trace.
     */
    public constructor() {
        this.mAliases = new Map<string, PgslAliasTrace>();
        this.mBindingNameResolutions = {
            groupResolution: new Map<string, { index: number; locations: Map<string, number>; }>()
        };
        this.mEnums = new Map<string, PgslEnumTrace>();
        this.mExpressions = new Map<PgslExpression, PgslExpressionTrace>();
        this.mFunctions = new Map<string, PgslFunctionTrace>();
        this.mIncidents = new Array<PgslTraceIncident>();
        this.mLocationNameResolutions = new Map<string, Map<string, number>>();
        this.mScopeList = new Stack<PgslTraceScope>();
        this.mStructProperties = new Map<PgslStructPropertyDeclaration, PgslStructPropertyTrace>();
        this.mStructs = new Map<string, PgslStructTrace>();
        this.mTreeScopes = new Map<BasePgslSyntaxTree, PgslTraceScope>();
        this.mVariableDeclarations = new Map<string, PgslValueTrace>();
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
     * Gets the expression trace for a specific expression.
     *
     * @param pExpression - The expression to get the trace for.
     *
     * @returns The expression trace if found, undefined otherwise.
     *
     * @throws {Error} When expression is not traced.
     */
    public getExpression(pExpression: PgslExpression): PgslExpressionTrace {
        if (!this.mExpressions.has(pExpression)) {
            throw new Error('Expression is not traced.');
        }

        return this.mExpressions.get(pExpression)!;
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
     * Gets a module-level variable declaration.
     *
     * @param pName - The name of the variable.
     *
     * @returns The value trace if found, undefined otherwise.
     */
    public getModuleValue(pName: string): PgslValueTrace | undefined {
        return this.mVariableDeclarations.get(pName);
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
     * Gets a struct property trace by its declaration.
     *
     * @param pProperty - The struct property declaration.
     *
     * @returns The struct property trace.
     *
     * @throws {Error} When struct property is not traced.
     */
    public getStructProperty(pProperty: PgslStructPropertyDeclaration): PgslStructPropertyTrace {
        if (!this.mStructProperties.has(pProperty)) {
            throw new Error('Struct property is not traced.');
        }

        return this.mStructProperties.get(pProperty)!;
    }

    /**
     * Execute action in a new scope.
     * Creates a new scope, executes the provided action within that scope,
     * and then automatically removes the scope when the action completes.
     *
     * @typeParam T - Type of scope to create.
     *
     * @param pType - Type of scope to create.
     * @param pScopeAction - Action to execute within the new scope.
     * @param pOwner - The owner of the scope.
     *
     * @throws {Error} When the trace is sealed.
     */
    public newScope<T extends PgslSyntaxTreeTraceScopeType>(pType: T, pScopeAction: () => void, pOwner: PgslSyntaxTreeTraceScopeScopeOwner<T>): void {
        // Create scope and push to stack.
        this.mScopeList.push(new PgslTraceScope(pType, pOwner, this.mScopeList.top ?? null));

        try {
            pScopeAction();
        } finally {
            // Remove scope from stack.
            this.mScopeList.pop();
        }
    }

    /**
     * Pushes an incident to the trace for later analysis or reporting.
     *
     * @param pMessage - The message describing the incident.
     * @param pSyntaxTree - Optional syntax tree node associated with the incident.
     *
     * @throws {Error} When the trace is sealed.
     */
    public pushIncident(pMessage: string, pSyntaxTree?: BasePgslSyntaxTree): void {
        this.mIncidents.push(new PgslTraceIncident(pMessage, pSyntaxTree));
    }

    /**
     * Sets an alias trace.
     *
     * @param pTrace - The alias trace information.
     *
     * @throws {Error} When the trace is sealed.
     */
    public registerAlias(pTrace: PgslAliasTrace): void {
        this.mAliases.set(pTrace.aliasName, pTrace);
    }

    /**
     * Sets an enum trace.
     *
     * @param pTrace - The enum trace information.
     *
     * @throws {Error} When the trace is sealed.
     */
    public registerEnum(pTrace: PgslEnumTrace): void {
        this.mEnums.set(pTrace.name, pTrace);
    }

    /**
     * Sets the expression trace for a specific expression.
     *
     * @param pExpression - The expression to set the trace for.
     * @param pTrace - The expression trace information.
     */
    public registerExpression(pExpression: PgslExpression, pTrace: PgslExpressionTrace): void {
        this.mExpressions.set(pExpression, pTrace);
    }

    /**
     * Sets a function trace.
     *
     * @param pTrace - The function trace information.
     *
     * @throws {Error} When the trace is sealed.
     */
    public registerFunction(pTrace: PgslFunctionTrace): void {
        this.mFunctions.set(pTrace.name, pTrace);
    }

    /**
     * Registers a module-level variable declaration.
     *
     * @param pValue - The value of the variable.
     */
    public registerModuleValue(pValue: PgslValueTrace): void {
        // Create resolved bindings if value is a resource.
        if (pValue.bindingInformation) {
            const lBinding: PgslTraceBinding = this.resolveBinding(pValue.bindingInformation.bindGroupName, pValue.bindingInformation.bindLocationName);
            pValue.resolveBindingIndices(lBinding.bindGroupIndex, lBinding.bindingIndex);
        }

        // Register value in module declarations.
        this.mVariableDeclarations.set(pValue.name, pValue);

        // Register value also registered in current scope.
        this.currentScope.addValue(pValue.name, pValue);
    }

    /**
     * Sets a struct trace.
     *
     * @param pTrace - The struct trace information.
     *
     * @throws {Error} When the trace is sealed.
     */
    public registerStruct(pTrace: PgslStructTrace): void {
        this.mStructs.set(pTrace.name, pTrace);
    }

    /**
     * Sets a struct property trace.
     *
     * @param pProperty - The struct property declaration.
     * @param pTrace - The struct property trace information.
     *
     * @throws {Error} When the trace is sealed.
     */
    public registerStructProperty(pProperty: PgslStructPropertyDeclaration, pTrace: PgslStructPropertyTrace): void {
        // Resolve location name to a location index.
        if (pTrace.meta.locationName) {
            const lLocationIndex: number = this.resolveLocation(pProperty.struct.name, pTrace.meta.locationName);
            pTrace.resolveLocationIndex(lLocationIndex);
        }

        this.mStructProperties.set(pProperty, pTrace);
    }

    /**
     * Gets the trace scope for a specific syntax tree.
     *
     * @typeParam T - The type of syntax tree.
     *
     * @param pTree - Syntax tree to get scope for.
     *
     * @returns The trace scope for the specified tree.
     *
     * @throws {Error} When the tree is not traced.
     */
    public scopeOf<T extends BasePgslSyntaxTree>(pTree: T): PgslTraceScope {
        if (!this.mTreeScopes.has(pTree)) {
            throw new Error('Tree is not traced.');
        }

        return this.mTreeScopes.get(pTree)!;
    }

    /**
     * Resolves the binding for a given bind group and binding name.
     *
     * @param pBindGroupName - The name of the bind group.
     * @param pBindingName - The name of the binding.
     *
     * @returns The resolved binding information.
     */
    private resolveBinding(pBindGroupName: string, pBindingName: string): PgslTraceBinding {
        let lBindGroupIndex: number = -1;

        // Check if bind group exists and create if needed.
        if (!this.mBindingNameResolutions.groupResolution.has(pBindGroupName)) {
            // Use the current size as new bind group index.
            lBindGroupIndex = this.mBindingNameResolutions.groupResolution.size;

            // Create new entry for the bind group.
            this.mBindingNameResolutions.groupResolution.set(pBindGroupName, {
                index: lBindGroupIndex,
                locations: new Map<string, number>(),
            });
        } else {
            // Read Bind group index of bind group name.
            lBindGroupIndex = this.mBindingNameResolutions.groupResolution.get(pBindGroupName)!.index;
        }

        // Read the binding names map of the current bind group.
        const lBindGroupLocations: Map<string, number> = this.mBindingNameResolutions.groupResolution.get(pBindGroupName)!.locations;

        // Check if bindgroup binding exists and create if needed.
        if (!lBindGroupLocations.has(pBindingName)) {
            // Read the current bind group binding index of the current bind group and increment them by one.
            const lNextBindGroupBindingIndex: number = lBindGroupLocations.size;

            // Save the increment.
            lBindGroupLocations.set(pBindingName, lNextBindGroupBindingIndex);
        }

        // Return the binding location.
        return {
            bindGroupIndex: lBindGroupIndex,
            bindingIndex: lBindGroupLocations.get(pBindingName)!,
        };
    }

    /**
     * Resolves a location index for a given struct and location name.
     * If the location name does not exist for the struct, it will be created.
     *
     * @param pStructName - The name of the struct.
     * @param pLocationName - The name of the location.
     *
     * @returns The resolved location index.
     */
    private resolveLocation(pStructName: string, pLocationName: string): number {
        // Initialize location map for struct if not existing.
        if (!this.mLocationNameResolutions.has(pStructName)) {
            this.mLocationNameResolutions.set(pStructName, new Map<string, number>());
        }

        // Create location if it doesn't exist.
        const lStructLocations: Map<string, number> | undefined = this.mLocationNameResolutions.get(pStructName)!;
        if (!lStructLocations.has(pLocationName)) {
            lStructLocations.set(pLocationName, lStructLocations.size);
        }

        // Return the location index.
        return lStructLocations.get(pLocationName)!;
    }
}

/**
 * Represents an incident that occurred during PGSL syntax tree tracing.
 * Contains information about issues found during analysis or processing.
 */
export class PgslTraceIncident {
    private readonly mMessage: string;
    private readonly mSyntaxTree: BasePgslSyntaxTree | undefined;

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
    public get syntaxTree(): BasePgslSyntaxTree | undefined {
        return this.mSyntaxTree;
    }

    /**
     * Creates a new trace incident.
     *
     * @param pMessage - The message describing the incident.
     * @param pSyntaxTree - Optional syntax tree node associated with the incident.
     */
    public constructor(pMessage: string, pSyntaxTree?: BasePgslSyntaxTree) {
        this.mMessage = pMessage;
        this.mSyntaxTree = pSyntaxTree;
    }
}

/**
 * Represents binding information for transpilation.
 */
export type PgslTraceBinding = {
    /**
     * The bind group index.
     */
    bindGroupIndex: number;

    /**
     * The binding index within the bind group.
     */
    bindingIndex: number;
};

/**
 * Keeps track of bind groups and bindings during transpilation.
 */
type PgslTraceBindingNameResolutions = {
    /**
     * Bind group resolution mapping.
     */
    groupResolution: Map<string, {
        /**
         * The index of the bind group.
         */
        index: number;
        /**
         * Map of location names to their indices within the bind group.
         */
        locations: Map<string, number>;
    }>;
};

/**
 * Maps struct names to their location name resolution mappings.
 */
type PgslTraceLocationNameResolutions = Map<string, Map<string, number>>;