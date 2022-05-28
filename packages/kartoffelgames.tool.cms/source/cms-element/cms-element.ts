import { PwbExport } from '@kartoffelgames/web.potato-web-builder';
import { CmsElementData, CmsStyles } from '../type';

export class CmsElement<TData extends object> {
    @PwbExport
    public elementData: CmsElementData<TData>;

    /**
     * Get element data.
     */
    protected get data(): TData {
        return this.elementData.data;
    }

    /**
     * Get element style.
     */
    protected get style(): CmsStyles {
        return this.elementData.style;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.elementData = <CmsElementData<TData>>{};
    }
}