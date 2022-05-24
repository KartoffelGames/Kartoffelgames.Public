import { CmsElement } from './cms-element/cms-element';

export type CmsStyles = { [style: string]: string; };

export type CmsElementData = {
    element: string,
    data: object,
    style: CmsStyles;
};

export type CmsElementConstructor = new (...pParameter: Array<any>) => CmsElement<any>;