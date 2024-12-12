import { Exception } from '@kartoffelgames/core';
import { TableLayout, TableType } from './table-layout';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';

/**
 * AtScript.
 * Export value to component element.
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

        // Type must be string or number.
        const lPropertyType: InjectionConstructor | null = Metadata.get(lTableType).getProperty(pPropertyKey).type;
        if (lPropertyType === null || lPropertyType !== String && lPropertyType !== Number) {
            throw new Exception('Identity property must be a number or string type', WebDbIdentity);
        }

        // Auto incrementing identity must be a number.
        if (pAutoIncrement && lPropertyType !== Number) {
            throw new Exception('Identity property with auto increment must be a number type', WebDbIdentity);
        }

        // Add table type identity to layout.
        lTableLayout.setTableIdentity(lTableType, pPropertyKey, pAutoIncrement);
    };
}
