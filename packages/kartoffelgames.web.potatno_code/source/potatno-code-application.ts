import { PwbApplication } from '@kartoffelgames/web-potato-web-builder';
import { PotatnoDocument } from './document/potatno-document.ts';
import { PotatnoProject } from './project/potatno-project.ts';
import { PotatnoCodeEditor } from './ui/component/potatno_code_editor/potatno-code-editor.ts';

import applicationCss from './potatno-code-application.css' with { type: 'text' };
import themeCss from './ui/component/potatno-theme.css' with { type: 'text' };

/*
 * TODO: UI
 * - PWB should somehow be able to inject object for dependency injection with a PwbApplication. That whould be very sick.
 */

/**
 * Main entry point for the potatno-code visual editor application.
 * Extends PwbApplication to provide a pre-configured editor component
 * backed by a PotatnoProject (configuration) and a PotatnoCodeFile (document state).
 */
export class PotatnoCodeApplication<TProject extends PotatnoProject> extends PwbApplication {
    private mCodeEditor: PotatnoCodeEditor;
    private readonly mProject: TProject;

    /**
     * Get the current code file (document state).
     */
    public get document(): PotatnoDocument<TProject> {
        return this.mCodeEditor.file as PotatnoDocument<TProject>;
    } set document(pFile: PotatnoDocument<TProject>) {
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
        this.mCodeEditor = this.addContent(PotatnoCodeEditor) as unknown as PotatnoCodeEditor;

        // Pass the project configuration into the editor, then seed it with an empty document.
        this.mCodeEditor.project = pProject;
        this.mCodeEditor.file = new PotatnoDocument(pProject);
    }

    /**
     * Trigger a preview re-evaluation. Previews are updated asynchronously via the node
     * definition's updatePreview callbacks.
     *
     * @returns A promise resolving once the current render pass finishes, so a frame loop can
     * await it and avoid overlapping renders.
     */
    public update(): Promise<void> {
        return this.mCodeEditor.triggerPreviewUpdate();
    }
}
