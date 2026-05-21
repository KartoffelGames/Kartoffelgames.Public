import { PotatnoDocument } from "../../document/potatno-document.ts";
import { PotatnoProject } from "../../project/potatno-project.ts";
import { PotatnoCodeGeneratorFunctionResult } from "./potatno-code-generator-function-result.ts";

/**
 * Document code generation result for a entry point.
 */
export class PotatnoCodeGeneratorDocumentResult<TProject extends PotatnoProject> {
    private readonly mDocument: PotatnoDocument<TProject>;
    private readonly mDependencies: Array<PotatnoCodeGeneratorFunctionResult<TProject>>;
    private readonly mEntryPoint: PotatnoCodeGeneratorFunctionResult<TProject>;

    /**
     * Calls the underlying project definitions code generator to convert the function graphs into a single string.
     */
    public get code(): string {
        return this.mDocument.project.codeGenerator(this);
    }

    /**
     * Get the entry points dependency functions.
     */
    public get dependencies(): ReadonlyArray<PotatnoCodeGeneratorFunctionResult<TProject>> {
        return this.mDependencies;
    }

    /**
     * Get the documents results main entry point.
     * That entry point can differ for different generations and is not allways the documents main entry point function.
     */
    public get entryPoint(): PotatnoCodeGeneratorFunctionResult<TProject> {
        return this.mEntryPoint;
    }

    /**
     * Constructor.
     * 
     * @param pDocument - Document of the generation.
     * @param pEntryPointResult - The main entry point for the document generation. 
     * @param pDependencies - Code generation of the dependency functions ordered by appearence. 
     */
    public constructor(pDocument: PotatnoDocument<TProject>, pEntryPointResult: PotatnoCodeGeneratorFunctionResult<TProject>, pDependencies: Array<PotatnoCodeGeneratorFunctionResult<TProject>>) {
        this.mDocument = pDocument;
        this.mEntryPoint = pEntryPointResult;
        this.mDependencies = pDependencies;
    }
}