import { Exception } from '@kartoffelgames/core';
import { Metadata } from "@kartoffelgames/core-dependency-injection";
import { WebDatabaseTableLayout, type TableType } from './web-database-table-layout.ts';

/**
 * AtScript.
 * 
 * Add identity to table type.
 * Auto incremented identity is only supported for number types.
 */
export function WebDatabaseIdentity<TAutoIncrement extends true | false>(pAutoIncrement: TAutoIncrement) {
    return (_pTarget: ClassAccessorDecoratorTarget<any, TAutoIncrement extends true ? number : any>, pContext: ClassAccessorDecoratorContext): void => {
        // Decorator can not be used on static propertys.
        if (pContext.static) {
            throw new Exception('Identity property can not be a static property.', WebDatabaseIdentity);
        }

        // Decorator can only be attached to string named properties.
        if (typeof pContext.name !== 'string') {
            throw new Exception('Identity name must be a string.', WebDatabaseIdentity);
        }

        // Read metadata from metadata...
        const lConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

        // Try to read table layout from metadata.
        let lTableLayout: WebDatabaseTableLayout | null = lConstructorMetadata.getMetadata(WebDatabaseTableLayout.METADATA_KEY);
        if (!lTableLayout) {
            lTableLayout = new WebDatabaseTableLayout();
        }

        // Add table type index to layout.
        lTableLayout.setTableIdentity(pContext.name, pAutoIncrement);

        // Set the table layout to the metadata.
        lConstructorMetadata.setMetadata(WebDatabaseTableLayout.METADATA_KEY, lTableLayout);
    };
}
