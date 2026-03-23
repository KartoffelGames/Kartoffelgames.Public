import { PwbApplication, PwbApplicationConfiguration } from '@kartoffelgames/web-potato-web-builder';
import { PotatnoProject } from './project/potatno-project.ts';
import { PotatnoCodeFile } from './document/potatno-code-file.ts';
import { PotatnoCodeEditor } from './ui/component/potatno-code-editor.ts';
import themeCss from './ui/component/potatno-theme.css';

/**
 * Main entry point for the potatno-code visual editor application.
 * Extends PwbApplication to provide a pre-configured editor component
 * backed by a PotatnoProject (configuration) and a PotatnoCodeFile (document state).
 */
export class PotatnoCodeApplication extends PwbApplication {
    private mEditorElement: HTMLElement | null;
    private mFile: PotatnoCodeFile | null;
    private readonly mProject: PotatnoProject;

    /**
     * Get the current code file (document state).
     */
    public get file(): PotatnoCodeFile | null {
        return this.mFile;
    }

    /**
     * Set the code file (document state) and push it into the editor component.
     */
    public set file(pFile: PotatnoCodeFile | null) {
        this.mFile = pFile;

        if (this.mEditorElement) {
            (this.mEditorElement as any).file = pFile;
        }
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
        this.mFile = null;
        this.mEditorElement = null;

        // Add the theme CSS as a global style.
        this.addStyle(themeCss);
        this.addStyle(':host { display: block; width: 100%; height: 100%; } potatno-code-editor { display: block; width: 100%; height: 100%; }');

        // Add the editor component and store the element reference.
        this.mEditorElement = this.addContent(PotatnoCodeEditor);

        // Pass the project configuration into the editor.
        (this.mEditorElement as any).project = pProject;
    }
}
