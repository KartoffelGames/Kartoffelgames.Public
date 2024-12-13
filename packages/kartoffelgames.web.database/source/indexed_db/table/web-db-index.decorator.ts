import { Exception } from '@kartoffelgames/core';
import { TableLayout, TableType } from './table-layout';

/**
 * AtScript.
 * Add index to table type.
 * Indices with the same names are grouped.
 */
export function WebDbIndex(pUnique: boolean = false, pName?: string) {
    return function (pTarget: object, pPropertyKey: string): void {
        // Usually Class Prototype. Globaly.
        const lPrototype: object = pTarget;
        const lTableType: TableType = <any>lPrototype.constructor;

        // Decorator can not be used on static propertys.
        if (typeof pTarget === 'function') {
            throw new Exception('Identity property can not be a static property.', WebDbIndex);
        }

        const lTableLayout: TableLayout = new TableLayout();

        // Default the index name to the property key.
        const lIndexName: string = pName ?? pPropertyKey;

        // Add table type index to layout.
        lTableLayout.setTableIndex(lTableType, pPropertyKey, lIndexName, pUnique);
    };
}
