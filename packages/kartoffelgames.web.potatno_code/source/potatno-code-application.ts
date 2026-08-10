import { Exception } from '@kartoffelgames/core';
import { PwbApplication } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocument } from './document/potatno-document.ts';
import applicationCss from './potatno-code-application.css' with { type: 'text' };
import type { PotatnoProjectTypesDefinition } from './project/potatno-project-types-definition.ts';
import type { PotatnoProject } from './project/potatno-project.ts';
import { PotatnoDeserializer } from './serialization/potatno-deserializer.ts';
import type { PotatnoCodeFileSerializationResult } from './serialization/potatno-serialization.type.ts';
import { PotatnoSerializer } from './serialization/potatno-serializer.ts';
import themeCss from './ui/component/potatno-theme.css' with { type: 'text' };
import { PotatnoCodeEditorComponent } from './ui/component/potatno_code_editor/potatno-code-editor-component.ts';
import { PotatnoUiManager } from './ui/manager/potatno-ui-manager.ts';

// TODO: Button as a dedicated component. Allow for [selectable] and a (select) as well as [selected]. Size adjustable.

// TODO: Make a node "invisible" (Dont move the occupying area) for pathfinding on drag start (so the path does not move while dragging.).
//       Then when the node gets dropped on a node (exact location, with visuals that it is currently hovered) connect the first port from input and output to it.
//       Maybe make it partly opaque while dragging? Node needs a drag start and drag end event for that.

// TODO: Add real generics to types. With nested generic constrains.
//       { type: "number", generics?: null }
//       { type: "vector", generics?: [{ type: "number", generic?: null }] } // Nested?

// TODO: Add those generics to nodes too.
//       A node output should be able to react to a input type to a generic. 

// TODO: Simular to functions. Allow dynamic node properties that the user can set.
//       Maybe add another moveable popup that allows for edits. 
//       (Movement and position constrained to graph. Does not close on focus lost.)
//       Opens on special button on node. (Just like the open function button)
//       Switches content when another node is seleced.
//       A node can set which types are supported for properties.
//       The node definition can react to those settings.

/**
 * Main entry point for the potatno-code visual editor application.
 * Extends PwbApplication to provide a pre-configured editor component
 * backed by a PotatnoProject (configuration) and a PotatnoCodeFile (document state).
 */
export class PotatnoCodeApplication<TProjectTypes extends PotatnoProjectTypesDefinition> extends PwbApplication {
    private readonly mCodeEditor: PotatnoCodeEditorComponent;
    private readonly mProject: PotatnoProject<TProjectTypes>;

    /**
     * Get the current code file (document state).
     */
    public get document(): PotatnoDocument<TProjectTypes> {
        return this.mCodeEditor.document! as unknown as PotatnoDocument<TProjectTypes>;
    } set document(pDocument: PotatnoDocument<TProjectTypes>) {
        this.mCodeEditor.document = pDocument as unknown as PotatnoDocument<PotatnoProjectTypesDefinition>;
    }

    /**
     * Get the project configuration.
     */
    public get project(): PotatnoProject<TProjectTypes> {
        return this.mProject;
    }

    /**
     * Constructor.
     * Creates a new potatno-code editor application.
     *
     * @param pProject - The project configuration containing node definitions, main functions, and preview callbacks.
     */
    public constructor(pProject: PotatnoProject<TProjectTypes>) {
        super();

        this.mProject = pProject;

        // Add the theme CSS as a global style.
        this.addStyle(themeCss);
        this.addStyle(applicationCss);

        // Create and add ui manager to the applications injections.
        this.setInjection(PotatnoUiManager, new PotatnoUiManager(pProject as unknown as PotatnoProject<PotatnoProjectTypesDefinition>));

        // Add the editor component and store the element reference.
        this.mCodeEditor = this.addContent(PotatnoCodeEditorComponent) as unknown as PotatnoCodeEditorComponent;
    }

    /**
     * Load a new document from a string.
     * 
     * @param pDocumentString - Serialized document.
     */
    public load(pDocumentString: string): void {
        // Try to deserialize document string.
        const lParseResult: PotatnoCodeFileSerializationResult = JSON.parse(pDocumentString);

        // Weak check for keys.
        if (!Array.isArray(lParseResult.functions)) {
            throw new Exception('Could not load document. Document has a wrong format.', this);
        }

        // Deseserialize document and store it.
        const lDocument: PotatnoDocument<TProjectTypes> = new PotatnoDeserializer(this.mProject).deserialize(lParseResult);
        this.document = lDocument;
    }

    /**
     * Save current document as string.
     * 
     * @returns the current document state as string.
     */
    public save(): string {
        // Serialize and stringify document.
        const lSerializationResult: PotatnoCodeFileSerializationResult = new PotatnoSerializer<TProjectTypes>().serialize(this.document);
        return JSON.stringify(lSerializationResult);
    }

    /**
     * Trigger a preview re-evaluation. Previews are updated asynchronously via the node
     * definition's updatePreview callbacks.
     *
     * @returns A promise resolving once the current render pass finishes, so a frame loop can
     * await it and avoid overlapping renders.
     */
    public update(): void {
        this.mCodeEditor.triggerPreviewUpdate();
    }
}
