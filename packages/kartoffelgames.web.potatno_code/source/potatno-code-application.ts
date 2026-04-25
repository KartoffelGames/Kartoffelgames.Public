import { PwbApplication } from '@kartoffelgames/web-potato-web-builder';
import { PotatnoDocument } from './document/potatno-document.ts';
import { PotatnoProject } from './project/potatno-project.ts';
import { PotatnoCodeEditor } from './ui/component/potatno_code_editor/potatno-code-editor.ts';

import applicationCss from './potatno-code-application.css' with { type: 'text' };
import themeCss from './ui/component/potatno-theme.css' with { type: 'text' };

/**
 * Main entry point for the potatno-code visual editor application.
 * Extends PwbApplication to provide a pre-configured editor component
 * backed by a PotatnoProject (configuration) and a PotatnoCodeFile (document state).
 */
export class PotatnoCodeApplication extends PwbApplication {
    private mCodeEditor: PotatnoCodeEditor;
    private readonly mProject: PotatnoProject<any>;

    /**
     * Get the current code file (document state).
     */
    public get file(): PotatnoDocument | null {
        return this.mCodeEditor.file;
    } set file(pFile: PotatnoDocument | null) {
        this.mCodeEditor.file = pFile;
    }

    /**
     * Get the project configuration.
     */
    public get project(): PotatnoProject<any> {
        return this.mProject;
    }

    /**
     * Constructor.
     * Creates a new potatno-code editor application.
     *
     * @param pProject - The project configuration containing node definitions, main functions, and preview callbacks.
     */
    public constructor(pProject: PotatnoProject<any>) {
        super();

        this.mProject = pProject;

        // Add the theme CSS as a global style.
        this.addStyle(themeCss);
        this.addStyle(applicationCss);

        // Add the editor component and store the element reference.
        this.mCodeEditor = this.addContent(PotatnoCodeEditor);

        // Pass the project configuration into the editor.
        this.mCodeEditor.project = pProject;
    }

    /**
     * Trigger a preview re-evaluation. Previews are updated asynchronously
     * via the node definition's updatePreview callbacks.
     */
    public update(): void {
        this.mCodeEditor.triggerPreviewUpdate();
    }
}
