import { Exception } from '@kartoffelgames/core';
import { Injector } from '@kartoffelgames/core.dependency-injection';
import { TableLayout, TableType } from './table-layout';

// Needed for type metadata.
Injector.Initialize();

/**
 * AtScript.
 * Add identity to table type.
 */
export function WebDbIdentity(pAutoIncrement: boolean) {
    return function (pTarget: object, pPropertyKey: string): void {
        // Usually Class Prototype. Globaly.
        const lPrototype: object = pTarget;
        const lTableType: TableType = <any>lPrototype.constructor;

        // Decorator can not be used on static propertys.
        if (typeof pTarget === 'function') {
            throw new Exception('Identity property can not be a static property.', WebDbIdentity);
        }

        const lTableLayout: TableLayout = new TableLayout();

        // Add table type identity to layout.
        lTableLayout.setTableIdentity(lTableType, pPropertyKey, pAutoIncrement);
    };
}