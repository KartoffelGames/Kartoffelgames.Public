import type { PotatnoEditorConfiguration } from '../project/potatno-editor-configuration.ts';
import type { PotatnoCodeFile } from '../document/potatno-code-file.ts';
import { PotatnoCodeGenerator } from './potatno-code-generator.ts';
import type { PotatnoFunction } from '../project/potatno-function.ts';

/**
 * Generates the final output string with embedded metadata.
 */
export class PotatnoSerializer {
    private readonly mConfig: PotatnoEditorConfiguration;

    /**
     * Constructor.
     *
     * @param pConfig - The editor configuration used to initialize the code generator.
     */
    public constructor(pConfig: PotatnoEditorConfiguration) {
        this.mConfig = pConfig;
    }

    /**
     * Serialize a code file to a code string with metadata.
     *
     * @param pFile - The code file containing all functions to serialize.
     *
     * @returns The serialized code string containing all functions with metadata markers.
     */
    public serialize(pFile: PotatnoCodeFile): string {
        const lGenerator: PotatnoCodeGenerator = new PotatnoCodeGenerator(this.mConfig);
        return lGenerator.generateProjectCode(pFile.functions);
    }

    /**
     * Serialize a single function to a code string.
     *
     * @param pFunction - The function to serialize.
     *
     * @returns The serialized code string for the function with metadata markers.
     */
    public serializeFunction(pFunction: PotatnoFunction): string {
        const lGenerator: PotatnoCodeGenerator = new PotatnoCodeGenerator(this.mConfig);
        return lGenerator.generateFunctionCode(pFunction);
    }
}
