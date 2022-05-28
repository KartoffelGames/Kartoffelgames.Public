import { CmsElement } from './cms-element/cms-element';

export type CmsStyles = { [style: string]: string; };

export type CmsElementData<TData extends object> = {
    element: string,
    data: TData,
    style: CmsStyles;
};

export type CmsElementConstructor = new (...pParameter: Array<any>) => CmsElement<any>;