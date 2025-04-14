import { Exception } from '@kartoffelgames/core';
import { Metadata } from "@kartoffelgames/core-dependency-injection";
import { WebDatabaseTableLayout } from './web-database-table-layout.ts';

/**
 * AtScript.
 * 
 * Add multi index to table type.
 */
export function WebDatabaseMultiIndex(pUnique: boolean = false, pName?: string) {
    return <TType extends Array<any>>(_pTarget: ClassAccessorDecoratorTarget<any, TType>, pContext: ClassAccessorDecoratorContext): void => {
        // Decorator can not be used on static propertys.
        if (pContext.static) {
            throw new Exception('Index property can not be a static property.', WebDatabaseMultiIndex);
        }

        // Decorator can only be attached to string named properties.
        if (typeof pContext.name !== 'string') {
            throw new Exception('Index name must be a string.', WebDatabaseMultiIndex);
        }

        // Default the index name to the property key.
        const lIndexName: string = pName ?? pContext.name;

        // Read metadata from metadata...
        const lConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

        // Try to read table layout from metadata.
        let lTableLayout: WebDatabaseTableLayout | null = lConstructorMetadata.getMetadata(WebDatabaseTableLayout.METADATA_KEY);
        if (!lTableLayout) {
            lTableLayout = new WebDatabaseTableLayout();
        }

        // Add table type index to layout.
        lTableLayout.setTableIndex(pContext.name, lIndexName, pUnique, true);

        // Set the table layout to the metadata.
        lConstructorMetadata.setMetadata(WebDatabaseTableLayout.METADATA_KEY, lTableLayout);
    };
}
