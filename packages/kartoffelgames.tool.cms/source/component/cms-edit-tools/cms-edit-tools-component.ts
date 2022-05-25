import { PwbChild, PwbComponent, PwbExport } from '@kartoffelgames/web.potato-web-builder';
import { CmsStyles } from '../../type';
import { CmsEditFormComponent } from '../cms-edit-form/cms-edit-form-component';
import CssContent from './cms-edit-tools-component.css';
import HtmlContent from './cms-edit-tools-component.html';

@PwbComponent({
    selector: 'cms-edit-tools',
    template: HtmlContent,
    style: CssContent,
    components: [CmsEditFormComponent]
})
export class CmsEditToolsComponent {
    @PwbChild('editForm')
    private readonly mFormElement!: CmsEditFormComponent;

    /**
     * Open edit form.
     */
    public openForm(): void {
        this.mFormElement.show();
    }
}