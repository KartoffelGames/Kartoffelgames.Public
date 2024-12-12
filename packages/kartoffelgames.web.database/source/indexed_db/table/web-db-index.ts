import { Exception } from '@kartoffelgames/core';
import { TableLayout, TableType } from './table-layout';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';

/**
 * AtScript.
 * Add index to table type.
 * Indices with the same names are grouped.
 */
export function WebDbIndex(pName: string, pUnique: boolean) {
    return function (pTarget: object, pPropertyKey: string): void {
        // Usually Class Prototype. Globaly.
        const lPrototype: object = pTarget;
        const lTableType: TableType = <any>lPrototype.constructor;

        // Decorator can not be used on static propertys.
        if (typeof pTarget === 'function') {
            throw new Exception('Identity property can not be a static property.', WebDbIndex);
        }

        const lTableLayout: TableLayout = new TableLayout();

        // Type must be string or number.
        const lPropertyType: InjectionConstructor | null = Metadata.get(lTableType).getProperty(pPropertyKey).type;
        if (lPropertyType === null) {
            throw new Exception('Index property must have a type', WebDbIndex);
        }

        // Index is a array.
        const lIsArray: boolean = lPropertyType === Array;

        // Add table type index to layout.
        lTableLayout.setTableIndex(lTableType, pPropertyKey, pName, lIsArray, pUnique);
    };
}
