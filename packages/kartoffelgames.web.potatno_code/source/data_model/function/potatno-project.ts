import { PotatnoEditorConfiguration } from '../configuration/potatno-editor-configuration.ts';
import type { PotatnoMainFunctionDefinition } from '../configuration/potatno-main-function-definition.ts';
import { NodeCategory } from '../enum/node-category.enum.ts';
import { PotatnoFunction } from './potatno-function.ts';

/**
 * Top-level model holding all functions and the editor configuration.
 */
export class PotatnoProject {
    public readonly configuration: PotatnoEditorConfiguration;

    private mActiveFunctionId: string;
    private readonly mFunctions: Map<string, PotatnoFunction>;

    public get activeFunction(): PotatnoFunction | undefined {
        return this.mFunctions.get(this.mActiveFunctionId);
    }

    public get activeFunctionId(): string {
        return this.mActiveFunctionId;
    }

    public get functions(): ReadonlyMap<string, PotatnoFunction> {
        return this.mFunctions;
    }

    public constructor() {
        this.configuration = new PotatnoEditorConfiguration();
        this.mFunctions = new Map<string, PotatnoFunction>();
        this.mActiveFunctionId = '';
    }

    /**
     * Initialize main functions from configuration.
     */
    public initializeMainFunctions(): void {
        for (const lMainDef of this.configuration.mainFunctions) {
            const lFunc: PotatnoFunction = this.addFunction(lMainDef.name, lMainDef.label, true);

            // Create fixed input nodes for the function's inputs.
            for (const lInput of lMainDef.inputs) {
                const lInputNodeDef = {
                    name: lInput.name,
                    category: NodeCategory.Input,
                    inputs: [],
                    outputs: [{ name: lInput.name, type: lInput.type }],
                    codeGenerator: () => '' // Input nodes don't generate code directly.
                };
                lFunc.graph.addNode(lInputNodeDef, { x: 2, y: 2 + lMainDef.inputs.indexOf(lInput) * 3 }, true);
            }

            // Create fixed output nodes for the function's outputs.
            for (const lOutput of lMainDef.outputs) {
                const lOutputNodeDef = {
                    name: lOutput.name,
                    category: NodeCategory.Output,
                    inputs: [{ name: lOutput.name, type: lOutput.type }],
                    outputs: [],
                    codeGenerator: () => '' // Output nodes don't generate code directly.
                };
                lFunc.graph.addNode(lOutputNodeDef, { x: 30, y: 2 + lMainDef.outputs.indexOf(lOutput) * 3 }, true);
            }

            // Set the first function as active.
            if (!this.mActiveFunctionId) {
                this.mActiveFunctionId = lFunc.id;
            }
        }
    }

    /**
     * Add a new function to the project.
     */
    public addFunction(pName: string, pLabel: string, pSystem: boolean = false): PotatnoFunction {
        const lId: string = crypto.randomUUID();
        const lFunc: PotatnoFunction = new PotatnoFunction(lId, pName, pLabel, pSystem);
        this.mFunctions.set(lId, lFunc);

        if (!this.mActiveFunctionId) {
            this.mActiveFunctionId = lId;
        }

        return lFunc;
    }

    /**
     * Remove a function from the project. System functions can't be removed.
     */
    public removeFunction(pFunctionId: string): boolean {
        const lFunc: PotatnoFunction | undefined = this.mFunctions.get(pFunctionId);
        if (!lFunc || lFunc.system) {
            return false;
        }

        this.mFunctions.delete(pFunctionId);

        // Switch active function if the removed one was active.
        if (this.mActiveFunctionId === pFunctionId) {
            const lFirst: string | undefined = this.mFunctions.keys().next().value;
            this.mActiveFunctionId = lFirst ?? '';
        }

        return true;
    }

    /**
     * Set the active function by ID.
     */
    public setActiveFunction(pFunctionId: string): boolean {
        if (this.mFunctions.has(pFunctionId)) {
            this.mActiveFunctionId = pFunctionId;
            return true;
        }
        return false;
    }

    /**
     * Get a function by ID.
     */
    public getFunction(pFunctionId: string): PotatnoFunction | undefined {
        return this.mFunctions.get(pFunctionId);
    }
}
