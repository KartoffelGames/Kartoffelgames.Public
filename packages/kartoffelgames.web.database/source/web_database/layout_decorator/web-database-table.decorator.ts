import { type ClassDecorator } from '@kartoffelgames/core';
import { Metadata } from "@kartoffelgames/core-dependency-injection";
import { TableType, WebDatabaseTableLayout } from "../web-database-table-layout.ts";

/**
 * Decorator for defining a web database table.
 * 
 * @template T - The table class type.
 * @param pTableName - The name of the table.
 * @param pExtension - Optional extension for defining compound indices.
 * 
 * @remarks
 * This decorator sets up the table layout, including its name and indices, and stores the configuration in metadata.
 * Use the `with` property in the extension to define compound indices, specifying property names and uniqueness.
 * 
 * @example
 * ```typescript
 * @WebDatabaseTableDecorator('users', {
 *   with: [
 *     { properties: ['firstName', 'lastName'], unique: true }
 *   ]
 * })
 * class User {
 *   public firstName!: string;
 *   public lastName!: string;
 * }
 * ```
 */
export const WebDatabaseTableDecorator = <T extends TableType>(pTableName: string, pExtension?: WebDatabaseTableDecoratorExtension<T>): ClassDecorator<T, void> => {
    return function (pTableClass: T, pContext: ClassDecoratorContext): void {
        // Read metadata from metadata...
        const lConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

        // Try to read table layout from metadata.
        let lTableLayout: WebDatabaseTableLayout | null = lConstructorMetadata.getMetadata(WebDatabaseTableLayout.METADATA_KEY);
        if (!lTableLayout) {
            lTableLayout = new WebDatabaseTableLayout();
        }

        // Set table name.
        lTableLayout.setTableName(pTableClass, pTableName);

        // Apply table index extensions.
        if (pExtension) {
            // Iterate over the extensions and add them to the table layout.
            for (const lCompoundIndex of pExtension.with) {
                // Check if all properties are strings.
                if (!lCompoundIndex.properties.every(pProperty => typeof pProperty === 'string')) {
                    throw new Error('All property names of a compound index must be strings.');
                }

                // Add properties to the table layout.
                lTableLayout.setTableIndex(lCompoundIndex.properties as Array<string>, lCompoundIndex.unique ?? false, false);
            }
        }

        // Set the table layout to the metadata.
        lConstructorMetadata.setMetadata(WebDatabaseTableLayout.METADATA_KEY, lTableLayout);
    };
};

export type WebDatabaseTableDecoratorExtension<T extends TableType> = {
    with: Array<{
        properties: [WebDatabaseTableDecoratorTableProperties<T>, WebDatabaseTableDecoratorTableProperties<T>, ...WebDatabaseTableDecoratorTableProperties<T>[]];
        unique?: boolean;
    }>;
};

type WebDatabaseTableDecoratorTableProperties<T extends TableType> = keyof InstanceType<T>;