import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Metadata } from '@kartoffelgames/core.dependency-injection';
import { ComponentManager } from '@kartoffelgames/web.potato-web-builder/library/source/component/component-manager';
import { CmsElementConstructor } from '../type';

export class CmsElements {
    public static readonly mElements: Dictionary<CmsElementConstructor, string> = new Dictionary<CmsElementConstructor, string>();
    public static readonly mMenuElements: Dictionary<string, Array<MenuItem>> = new Dictionary<string, Array<MenuItem>>();

    /**
     * Add element as cms element.
     * @param pElementClass - element constructor.
     */
    public static addElement(pElementClass: CmsElementConstructor): void {
        const lElementSelector: string = Metadata.get(pElementClass).getMetadata(ComponentManager.METADATA_SELECTOR);
        CmsElements.mElements.add(pElementClass, lElementSelector);
    }

    /**
     * Add element to menu.
     * @param pMenuGroup - Menu group name.
     * @param pText - Element text description.
     * @param pElement - CMS-Element
     * @param pPreset - Element preset data.
     */
    public static addMenuItem<T extends object>(pMenuGroup: string, pText: string, pElement: CmsElementConstructor, pPreset?: T): void {
        let lMenuItemList: Array<MenuItem> | undefined = CmsElements.mMenuElements.get(pMenuGroup);
        if (!lMenuItemList) {
            lMenuItemList = new Array<MenuItem>();
            CmsElements.mMenuElements.set(pMenuGroup, lMenuItemList);
        }

        // Find element selector.
        const lElementSelector: string | undefined = CmsElements.mElements.get(pElement);
        if (!lElementSelector) {
            throw new Exception('Element is not a cmd element.', CmsElements);
        }

        // Add menu item description.
        lMenuItemList.push({
            description: {
                text: pText
            },
            element: lElementSelector,
            presetData: pPreset
        });
    }

    /**
     * Get menu items of group.
     * @param pMenuGroup - Menu group.
     */
    public static getMenuItems(pMenuGroup: string): Array<MenuItem> {
        return CmsElements.mMenuElements.get(pMenuGroup) ?? new Array<MenuItem>();
    }
}

export type MenuItem = {
    description: {
        text: string;
        icon?: any | undefined; // TODO:
    };
    element: string;
    presetData?: object | undefined;
};