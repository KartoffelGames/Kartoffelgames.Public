import { PwbComponent, PwbExport } from '@kartoffelgames/web.potato-web-builder';
import CssContent from './cms-edit-form-component.css';
import HtmlContent from './cms-edit-form-component.html';

@PwbComponent({
    selector: 'cms-edit-form',
    template: HtmlContent,
    style: CssContent
})
export class CmsEditFormComponent {
    public hidden: boolean;

    /**
     * Constructor.
     */
    public constructor() {
        this.hidden = true;
    }

    /**
     * Hide dialog.
     */
    @PwbExport
    public close(): void {
        this.hidden = true;
    }

    /**
    * Show dialog.
    */
    @PwbExport
    public show(): void {
        this.hidden = false;
    }
}