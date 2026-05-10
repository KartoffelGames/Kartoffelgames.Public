import { PwbApplication } from '@kartoffelgames/web-potato-web-builder';
import { PotatnoDocument } from './document/potatno-document.ts';
import { PotatnoProject } from './project/potatno-project.ts';
import { PotatnoCodeEditor } from './ui/component/potatno_code_editor/potatno-code-editor.ts';

import applicationCss from './potatno-code-application.css' with { type: 'text' };
import themeCss from './ui/component/potatno-theme.css' with { type: 'text' };

/*
 * TODO: UI
 * - Limit updates calls. Update available nodes only when function is switched or import is changed.
 * - Limit node update. Nodes can update too. Only update when ??? 
 */

/*
 * TODO: Pre-generate
 * - Color invalid port connections red.
 * - Allow connections to wrong types. The validator should then mark the connection as invalid.
 * - Allow specific port connection modes. Flow ports: Multiple connections to a single port. Data port: One connection to multiple ports.
 * - Render the proxy ports used for connection structure. 
 */

/**
 * Main entry point for the potatno-code visual editor application.
 * Extends PwbApplication to provide a pre-configured editor component
 * backed by a PotatnoProject (configuration) and a PotatnoCodeFile (document state).
 */
export class PotatnoCodeApplication<TProject extends PotatnoProject> extends PwbApplication {
    private mCodeEditor: PotatnoCodeEditor<TProject>;
    private readonly mProject: TProject;

    /**
     * Get the current code file (document state).
     */
    public get document(): PotatnoDocument<TProject> | null {
        return this.mCodeEditor.file;
    } set document(pFile: PotatnoDocument<TProject> | null) {
        this.mCodeEditor.file = pFile;
    }

    /**
     * Get the project configuration.
     */
    public get project(): TProject {
        return this.mProject;
    }

    /**
     * Constructor.
     * Creates a new potatno-code editor application.
     *
     * @param pProject - The project configuration containing node definitions, main functions, and preview callbacks.
     */
    public constructor(pProject: TProject) {
        super();

        this.mProject = pProject;

        // Add the theme CSS as a global style.
        this.addStyle(themeCss);
        this.addStyle(applicationCss);

        // Add the editor component and store the element reference.
        this.mCodeEditor = this.addContent(PotatnoCodeEditor) as unknown as PotatnoCodeEditor<TProject>;

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
