import { PwbComponent, PwbExport } from '@kartoffelgames/web.potato-web-builder';
import { CmsElements, MenuItem } from '../../cms-element/cms-elements';
import { CmsTemplateContenModule } from '../../module/cms-template-content-module';
import { CmsElementData } from '../../type';
import CssContent from './cms-editor-component.css';
import HtmlContent from './cms-editor-component.html';

@PwbComponent({
    selector: 'cms-editor',
    template: HtmlContent,
    style: CssContent,
    modules: [CmsTemplateContenModule]
})
export class CmsEditorComponent {
    @PwbExport
    public contentData: Array<CmsElementData>;

    @PwbExport
    public menuGroup: string;

    /**
     * Get menu items of selected group.
     */
    public get menuItems(): Array<MenuItem> {
        return CmsElements.getMenuItems(this.menuGroup);
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.contentData = new Array<CmsElementData>();
        this.menuGroup = 'Main'; // TODO: TO empty string. Only for debug.
    }

    /**
     * On content drop. Can be element or preset data.
     * @param pEvent - Drag event
     */
    public onContentDrop(pEvent: DragEvent): void {
        const lElementDataJson: string | undefined = pEvent.dataTransfer?.getData('elementData');

        // Check for existing data.
        if (typeof lElementDataJson !== 'undefined' && lElementDataJson !== '') {
            const lElementData: CmsElementData = JSON.parse(lElementDataJson);

            // TODO: Remove element if it was only moved and not created.

            this.contentData.push(lElementData);
        }

        console.log(this.contentData);
    }

    /**
     * On element preset drag.
     * @param pEvent - Drag event.
     */
    public onElementPresetDrag(pEvent: DragEvent): void {
        const lTarget: HTMLElement = <HTMLElement>pEvent.target;

        const lElementPreset: MenuItem = JSON.parse(<string>lTarget.dataset['preset']);

        // Create CmsElementData from target.
        const lElementData: CmsElementData = {
            element: lElementPreset.element,
            data: lElementPreset.presetData ?? {},
            style: {}
        };

        // Set element data as json string into drag event.
        pEvent.dataTransfer?.setData('elementData', JSON.stringify(lElementData));
    }
}