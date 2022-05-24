import { PwbComponent, PwbExport } from '@kartoffelgames/web.potato-web-builder';
import CssContent from './cms-edit-form-component.css';
import HtmlContent from './cms-edit-form-component.html';

@PwbComponent({
    selector: 'cms-edit-form',
    template: HtmlContent,
    style: CssContent
})
export class CmsEditFormComponent {
    /**
     * Element form edit template.
     */
    @PwbExport
    public formTemplate: string;

    private mShow: boolean;

    /**
     * Constructor.
     */
    public constructor() {
        this.formTemplate = '';
        this.mShow = false;
    }

    /**
     * Show dialog.
     */
    @PwbExport
    public show(): void{
        this.mShow = true;
    }
}