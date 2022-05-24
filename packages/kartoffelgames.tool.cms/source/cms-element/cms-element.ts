import { PwbExport } from '@kartoffelgames/web.potato-web-builder';
import { CmsStyles } from '../type';

export class CmsElement<TData extends object> {
    private mData: TData;
    private mStyle: CmsStyles;

    /**
     * Get element data.
     */
    @PwbExport
    public get data(): TData {
        return this.mData;
    }

    /**
     * Set element data.
     */
    public set data(pData: TData) {
        this.mData = pData;
    }

    /**
     * Get element style.
     */
    @PwbExport
    public get style(): CmsStyles {
        return this.mStyle;
    }

    /**
     * Set element style.
     */
    public set style(pStyle: CmsStyles) {
        this.mStyle = pStyle;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mData = <TData>{};
        this.mStyle = {};
    }
}