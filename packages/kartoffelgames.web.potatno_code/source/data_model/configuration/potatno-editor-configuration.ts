import type { PotatnoCodeFunction } from '../code_generation/potatno-code-function.ts';
import type { PotatnoGlobalValueDefinition } from './potatno-global-value-definition.ts';
import type { PotatnoMainFunctionDefinition } from './potatno-main-function-definition.ts';
import type { PotatnoNodeDefinition } from './potatno-node-definition.ts';

/**
 * Full editor configuration holding all registered node types, functions, and callbacks.
 */
export class PotatnoEditorConfiguration {
    private mCommentToken: string;
    private mFunctionCodeGenerator: ((func: PotatnoCodeFunction) => string) | null;
    private readonly mGlobalValues: Array<PotatnoGlobalValueDefinition>;
    private readonly mMainFunctions: Array<PotatnoMainFunctionDefinition>;
    private readonly mNodeDefinitions: Map<string, PotatnoNodeDefinition>;
    private mPreviewCallback: ((code: string) => DocumentFragment) | null;

    public get commentToken(): string {
        return this.mCommentToken;
    }

    public get functionCodeGenerator(): ((func: PotatnoCodeFunction) => string) | null {
        return this.mFunctionCodeGenerator;
    }

    public get globalValues(): ReadonlyArray<PotatnoGlobalValueDefinition> {
        return this.mGlobalValues;
    }

    public get mainFunctions(): ReadonlyArray<PotatnoMainFunctionDefinition> {
        return this.mMainFunctions;
    }

    public get nodeDefinitions(): ReadonlyMap<string, PotatnoNodeDefinition> {
        return this.mNodeDefinitions;
    }

    public get previewCallback(): ((code: string) => DocumentFragment) | null {
        return this.mPreviewCallback;
    }

    public constructor() {
        this.mCommentToken = '//';
        this.mNodeDefinitions = new Map<string, PotatnoNodeDefinition>();
        this.mMainFunctions = new Array<PotatnoMainFunctionDefinition>();
        this.mGlobalValues = new Array<PotatnoGlobalValueDefinition>();
        this.mPreviewCallback = null;
        this.mFunctionCodeGenerator = null;
    }

    public addGlobalValue(pDefinition: PotatnoGlobalValueDefinition): void {
        this.mGlobalValues.push(pDefinition);
    }

    public addMainFunction(pDefinition: PotatnoMainFunctionDefinition): void {
        this.mMainFunctions.push(pDefinition);
    }

    public addNodeDefinition(pDefinition: PotatnoNodeDefinition): void {
        this.mNodeDefinitions.set(pDefinition.name, pDefinition);
    }

    public setCommentToken(pToken: string): void {
        this.mCommentToken = pToken;
    }

    public setFunctionCodeGenerator(pGenerator: (func: PotatnoCodeFunction) => string): void {
        this.mFunctionCodeGenerator = pGenerator;
    }

    public setPreviewCallback(pCallback: (code: string) => DocumentFragment): void {
        this.mPreviewCallback = pCallback;
    }
}
