import type { PotatnoEditorConfiguration } from '../configuration/potatno-editor-configuration.ts';
import { PotatnoCodeGenerator } from '../code_generation/potatno-code-generator.ts';
import type { PotatnoFunction } from '../function/potatno-function.ts';
import type { PotatnoProject } from '../function/potatno-project.ts';

/**
 * Generates the final output string with embedded metadata.
 */
export class PotatnoSerializer {
    private readonly mConfig: PotatnoEditorConfiguration;

    public constructor(pConfig: PotatnoEditorConfiguration) {
        this.mConfig = pConfig;
    }

    /**
     * Serialize a full project to a code string with metadata.
     */
    public serialize(pProject: PotatnoProject): string {
        const lGenerator: PotatnoCodeGenerator = new PotatnoCodeGenerator(this.mConfig);
        return lGenerator.generateProjectCode(pProject.functions);
    }

    /**
     * Serialize a single function to a code string.
     */
    public serializeFunction(pFunction: PotatnoFunction): string {
        const lGenerator: PotatnoCodeGenerator = new PotatnoCodeGenerator(this.mConfig);
        return lGenerator.generateFunctionCode(pFunction);
    }
}
