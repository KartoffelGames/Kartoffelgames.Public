import { PwbChild, PwbComponent, PwbExport } from '@kartoffelgames/web.potato-web-builder';
import { CmsStyles } from '../../type';
import { CmsEditFormComponent } from '../cms-edit-form/cms-edit-form-component';
import CssContent from './cms-edit-tools-component.css';
import HtmlContent from './cms-edit-tools-component.html';

@PwbComponent({
    selector: 'edit-tools',
    template: HtmlContent,
    style: CssContent
})
export class CmsEditToolsComponent<TData extends object> {
    /**
     * Element data.
     */
    @PwbExport
    public data: TData;

    /**
     * Element form edit template.
     */
    @PwbExport
    public formTemplate: string;

    /**
     * Elment style definitions.
     */
    @PwbExport
    public styles: CmsStyles;

    @PwbChild('editForm')
    private readonly mFormElement!: CmsEditFormComponent;

    /**
     * Constructor.
     */
    public constructor(){
        this.data = <TData>{};
        this.formTemplate = '';
        this.styles = {};
    }
}