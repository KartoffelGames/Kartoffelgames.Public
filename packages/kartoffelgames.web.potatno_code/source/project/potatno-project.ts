import type { PotatnoCodeGeneratorDocumentResult } from '../parser/result/potatno-code-generator-document-result.ts';
import { PotatnoPreview } from '../preview/potatno-preview.ts';
import { FlowConjunctionNodeDefinition } from './node_definition/potatno-flow-conjunction-node-definition.ts';
import type { PotatnoNodeDefinition } from './node_definition/potatno-node-definition.ts';
import type { PotatnoStaticNodeDefinition } from './node_definition/potatno-static-node-definition.ts';
import { ValueConjunctionNodeDefinition } from './node_definition/potatno-value-conjunction-node-definition.ts';
import type { PotatnoFunctionDefinition } from './potatno-function-definition.ts';
import type { PotatnoImportDefinition } from './potatno-import-definition.ts';
import type { PotatnoProjectTypesDefinition } from './potatno-project-types-definition.ts';

/**
 * Project-level configuration for a PotatnoCode editor instance.
 * Contains all registered node types, main function definitions, imports,
 * and callback configurations. Does not hold document state.
 */
export class PotatnoProject<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private readonly mCodeGenerator: PotatnoProjectCodeGenerator<TProjectTypes>;
    private readonly mEntryPoint: PotatnoFunctionDefinition<TProjectTypes>;
    private readonly mImports: Array<PotatnoImportDefinition<TProjectTypes>>;
    private readonly mNodeDefinitions: Map<string, PotatnoNodeDefinition<TProjectTypes>>;
    private readonly mPreview: PotatnoPreview<TProjectTypes>;
    private readonly mTypes: TProjectTypes;
    private readonly mUserFunctions: Map<string, PotatnoFunctionDefinition<TProjectTypes>>;
    private mValidateNamePattern: PotatnoProjectNamePatternValidator;

    /**
     * Get the registered entry point definition.
     * The main entry point to start the code generation from.
     */
    public get entryPoint(): PotatnoFunctionDefinition<TProjectTypes> {
        return this.mEntryPoint;
    }

    /**
     * Code generator callback that produces the code string from a typed context.
     */
    public get generator(): PotatnoProjectCodeGenerator<TProjectTypes> {
        return this.mCodeGenerator;
    }

    /**
     * Get the list of registered import definitions.
     */
    public get imports(): ReadonlyArray<PotatnoImportDefinition<TProjectTypes>> {
        return this.mImports;
    }

    /**
     * Pattern validator for all names.
     */
    public get namePattern(): PotatnoProjectNamePatternValidator {
        return this.mValidateNamePattern;
    } set namePattern(pPatternValidator: PotatnoProjectNamePatternValidator) {
        this.mValidateNamePattern = pPatternValidator;
    }

    /**
     * Get the map of registered node definitions keyed by node definitions id.
     */
    public get nodeDefinitions(): ReadonlyArray<PotatnoNodeDefinition<TProjectTypes>> {
        return Array.from(this.mNodeDefinitions.values());
    }

    /**
     * Get the project's preview registry.
     */
    public get preview(): PotatnoPreview<TProjectTypes> {
        return this.mPreview;
    }

    /**
     * Get the project type configuration, containing the valid type identifiers and their default values.
     */
    public get types(): TProjectTypes {
        return this.mTypes;
    }

    /**
     * Get the map of registered user function definitions.
     */
    public get userFunctions(): ReadonlyMap<string, PotatnoFunctionDefinition<TProjectTypes>> {
        return this.mUserFunctions;
    }

    /**
     * Create a new editor configuration with default values.
     *
     * @param pTypes - Project type configuration.
     * @param pEntryFunction - Registered entry point function definition.
     * @param pParameter - Configuration providing code generator and optional preview registry.
     */
    public constructor(pTypes: TProjectTypes, pEntryFunction: PotatnoFunctionDefinition<TProjectTypes>, pParameter: PotatnoProjectConstructorParameter<TProjectTypes>) {
        // Init parameter.
        this.mTypes = pTypes;
        this.mCodeGenerator = pParameter.generator;
        this.mPreview = new PotatnoPreview<TProjectTypes>();

        // Initialize empty arrays and maps for project definitions.
        this.mNodeDefinitions = new Map<string, PotatnoStaticNodeDefinition<TProjectTypes>>();
        this.mImports = new Array<PotatnoImportDefinition<TProjectTypes>>();
        this.mUserFunctions = new Map<string, PotatnoFunctionDefinition<TProjectTypes>>();

        // Add endpoint function definition.
        this.mEntryPoint = pEntryFunction;

        // Define a default, allow all pattern validator.
        this.mValidateNamePattern = () => {
            return null;
        };

        // Built-in conjunction pass-through nodes are always available in every project.
        this.addNodeDefinition(new FlowConjunctionNodeDefinition());
        this.addNodeDefinition(new ValueConjunctionNodeDefinition());
    }

    /**
     * Register an import definition.
     *
     * @param pDefinition - The import definition to register. Must have a unique label and contain valid node definitions.
     */
    public addImport(pDefinition: PotatnoImportDefinition<TProjectTypes>): void {
        this.mImports.push(pDefinition);
    }

    /**
     * Register a node type definition.
     *
     * @param pDefinition - The node definition to register. Must have a unique id and use valid type identifiers for its ports.
     */
    public addNodeDefinition(pDefinition: PotatnoStaticNodeDefinition<TProjectTypes>): void {
        this.mNodeDefinitions.set(pDefinition.id, pDefinition);
    }

    /**
     * Get a function definition by its id. Checks both the entry point and user functions.
     *
     * @param pId - The function definition id to look up.
     */
    public getFunction(pId: string): PotatnoFunctionDefinition<TProjectTypes> | undefined {
        if (this.mEntryPoint.id === pId) {
            return this.mEntryPoint;
        }

        return this.mUserFunctions.get(pId);
    }

    /**
     * Register or replace a dynamic function definition.
     *
     * @param pDefinition - The dynamic function definition to register.
     */
    public setDynamicFunction(pDefinition: PotatnoFunctionDefinition<TProjectTypes>): void {
        this.mUserFunctions.set(pDefinition.id, pDefinition);
    }
}

type PotatnoProjectConstructorParameter<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    generator: PotatnoProjectCodeGenerator<TProjectTypes>;
};

/**
 * Function signature for a projects code generator callback.
 */
export type PotatnoProjectCodeGenerator<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    /**
     * Code generator that combines the documents main function and their dependencies into a single string.
     */
    readonly code: (pContext: PotatnoCodeGeneratorDocumentResult<TProjectTypes>) => string;

    /**
     * Generators for generating value related string.
     */
    readonly values: {
        /**
         * Generate a value id, mostly known as variable name, that the code generator can use to reference values.
         * 
         * @param pValueIndex - The current value index.
         * 
         * @returns a value id that can be used to reference values in code. 
         */
        readonly valueId: (pValueIndex: number) => string;

        /**
         * Function callback for a hook generation.
         * A hook should be appendable at any time in the generated code without affecting the execution.
         * 
         * @param pValueId - Generated value id.
         *  
         * @returns a hook string that can be inserted into the code. 
         */
        readonly hook: (pValueId: string) => string;
    };
};

/**
 * Pattern validator for names. Return a empty string on success or the error message.
 */
type PotatnoProjectNamePatternValidator = (pName: string) => string | null;