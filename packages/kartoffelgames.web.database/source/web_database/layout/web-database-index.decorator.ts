import { Exception } from '@kartoffelgames/core';
import { WebDatabaseTableLayout, TableType } from './web-database-table-layout.ts';

/**
 * AtScript.
 * Add index to table type.
 * Indices with the same names are grouped.
 */
export function WebDatabaseIndex(pUnique: boolean = false, pName?: string) {
    return function (pTarget: object, pPropertyKey: string): void {
        // Usually Class Prototype. Globaly.
        const lPrototype: object = pTarget;
        const lTableType: TableType = <any>lPrototype.constructor;

        // Decorator can not be used on static propertys.
        if (typeof pTarget === 'function') {
            throw new Exception('Identity property can not be a static property.', WebDatabaseIndex);
        }

        const lTableLayout: WebDatabaseTableLayout = new WebDatabaseTableLayout();

        // Default the index name to the property key.
        const lIndexName: string = pName ?? pPropertyKey;

        // Add table type index to layout.
        lTableLayout.setTableIndex(lTableType, pPropertyKey, lIndexName, pUnique);
    };
}
