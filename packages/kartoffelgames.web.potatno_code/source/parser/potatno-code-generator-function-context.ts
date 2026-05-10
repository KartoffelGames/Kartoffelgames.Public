import { PotatnoDocumentFunction } from "../document/potatno-document-function.ts";
import { PotatnoProject } from "../project/potatno-project.ts";

/**
 * The object passed to functionCodeGenerator callbacks.
 * Represents a complete function with its inputs, outputs, and body code.
 */
export class PotatnoCodeGeneratorFunctionContext<TProject extends PotatnoProject> {
    private readonly mBodyCode: string;
    private readonly mFunction: PotatnoDocumentFunction<TProject>;
    private readonly mFunctionName: string;

    /**
     * The generated body code of the function.
     */
    public get bodyCode(): string {
        return this.mBodyCode;
    }

    /**
     * The name of the function, as defined in the document function.
     */
    public get functionName(): string {
        return this.mFunctionName;
    }

    /**
     * The imports required by the function, as defined in the document function.
     */
    public get imports(): ReadonlyArray<string> {
        return this.mFunction.imports;
    }

    public readonly inputs: Array<{ name: string; type: string; valueId: string }>;
    
    public readonly outputs: Array<{ name: string; type: string; valueId: string }>;

    /**
     * Create a new empty code function instance.
     */
    public constructor(pFunctionName: string, pBodyCode: string, pFunction: PotatnoDocumentFunction<TProject>) {
        this.mBodyCode = pBodyCode;
        this.mFunction = pFunction;
        this.mFunctionName = pFunctionName;
        
        this.inputs = new Array<{ name: string; type: string; valueId: string }>();
        this.outputs = new Array<{ name: string; type: string; valueId: string }>();
    }
}
