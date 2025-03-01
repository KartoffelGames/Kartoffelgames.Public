import { Exception } from '@kartoffelgames/core';
import { Injector } from '@kartoffelgames/core-dependency-injection';
import { WebDatabaseTableLayout, type TableType } from './web-database-table-layout.ts';

// Needed for type metadata.
Injector.Initialize();

/**
 * AtScript.
 * Add identity to table type.
 */
export function WebDatabaseIdentity(pAutoIncrement: boolean) {
    return function (pTarget: object, pPropertyKey: string): void {
        // Usually Class Prototype. Globaly.
        const lPrototype: object = pTarget;
        const lTableType: TableType = <any>lPrototype.constructor;

        // Decorator can not be used on static propertys.
        if (typeof pTarget === 'function') {
            throw new Exception('Identity property can not be a static property.', WebDatabaseIdentity);
        }

        const lTableLayout: WebDatabaseTableLayout = new WebDatabaseTableLayout();

        // Add table type identity to layout.
        lTableLayout.setTableIdentity(lTableType, pPropertyKey, pAutoIncrement);
    };
}
