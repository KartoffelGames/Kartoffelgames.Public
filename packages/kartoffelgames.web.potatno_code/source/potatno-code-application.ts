import { PwbApplication, PwbApplicationConfiguration } from '@kartoffelgames/web-potato-web-builder';
import { PotatnoCodeFile } from './document/potatno-code-file.ts';
import { PotatnoProject } from './project/potatno-project.ts';
import { PotatnoCodeEditor } from './ui/component/potatno_code_editor/potatno-code-editor.ts';

import applicationCss from './potatno-code-application.css';
import themeCss from './ui/component/potatno-theme.css';

/**
 * Main entry point for the potatno-code visual editor application.
 * Extends PwbApplication to provide a pre-configured editor component
 * backed by a PotatnoProject (configuration) and a PotatnoCodeFile (document state).
 */
export class PotatnoCodeApplication extends PwbApplication {
    private mCodeEditor: PotatnoCodeEditor;
    private readonly mProject: PotatnoProject;

    /**
     * Get the current code file (document state).
     */
    public get file(): PotatnoCodeFile | null {
        return this.mCodeEditor.file;
    } set file(pFile: PotatnoCodeFile | null) {
        this.mCodeEditor.file = pFile;
    }

    /**
     * Get the project configuration.
     */
    public get project(): PotatnoProject {
        return this.mProject;
    }

    /**
     * Constructor.
     * Creates a new potatno-code editor application.
     *
     * @param pProject - The project configuration containing node definitions, main functions, and preview callbacks.
     */
    public constructor(pProject: PotatnoProject) {
        super('potatno-code', new PwbApplicationConfiguration());

        this.mProject = pProject;

        // Add the theme CSS as a global style.
        this.addStyle(themeCss);
        this.addStyle(applicationCss);

        // Add the editor component and store the element reference.
        this.mCodeEditor = this.addContent(PotatnoCodeEditor);

        // Pass the project configuration into the editor.
        this.mCodeEditor.project = pProject;
    }
}
