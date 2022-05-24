import { PwbApp } from '@kartoffelgames/web.potato-web-builder';
import { CmsElement } from './cms-element/cms-element';
import { CmsElements } from './cms-element/cms-elements';
import { CmsEditorComponent } from './component/cms-editor/cms-editor-component';
import { CmsElementConstructor } from './type';

export class CmsApp extends PwbApp {
    /**
     * Constructor.
     * @param pAppName -  Cms app name.
     */
    constructor(pAppName: string) {
        super(pAppName);
        this.addContent(CmsEditorComponent);
    }

    /**
     * Add element to element selector.
     * @param pMenuGroup - Menu group name.
     * @param pText - Element text description.
     * @param pElement - CMS-Element
     * @param pPreset - Element preset data.
     */
    public addMenuItem<T extends object>(pMenuGroup: string, pText: string, pElement: CmsElementConstructor, pPreset?: T): void {
        CmsElements.addMenuItem(pMenuGroup, pText, pElement, pPreset);
    }
}

// TODO: Specify column count.
// TODO: Handle data load.