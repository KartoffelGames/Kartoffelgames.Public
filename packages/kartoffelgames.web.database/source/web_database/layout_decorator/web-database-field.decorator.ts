import { type ClassFieldDecorator, Exception } from '@kartoffelgames/core';
import { Metadata } from '@kartoffelgames/core-dependency-injection';
import { WebDatabaseTableLayout, type WebDatabaseTableType } from '../web-database-table-layout.ts';

/**
 * Decorator for defining a field in a web database table.
 * 
 * @template T - The property type.
 * @param pExtension - Optional extension for configuring the field as an identity or index.
 * 
 * @remarks
 * This decorator registers the property as a field in the table layout. 
 * You can use the `as` property in the extension to mark the field as an identity (primary key) or as an index.
 * For number properties, you can specify auto-increment or manual identity. 
 * For array properties, you can enable multiEntry indices.
 * 
 * @example
 * ```typescript
 * class User {
 *   @WebDatabaseFieldDecorator({ as: { identity: 'auto' } })
 *   public id!: number;
 * 
 *   @WebDatabaseFieldDecorator({ as: { index: { unique: true } } })
 *   public email!: string;
 * 
 *   @WebDatabaseFieldDecorator({ as: { index: { multiEntry: true } } })
 *   public tags!: string[];
 * }
 * ```
 */
export const WebDatabaseFieldDecorator = <T, TTable extends WebDatabaseTableType>(pExtension?: WebDatabaseFieldDecoratorExtension<T>): ClassFieldDecorator<TTable, T> => {
    return function (_pTarget: any, pContext: WebDatabaseFieldDecoratorContext<any, any>): void {
        // Decorator can not be used on static propertys.
        if (pContext.static) {
            throw new Exception('Field property can not be a static property.', WebDatabaseFieldDecorator);
        }

        // Decorator can only be attached to string named properties.
        if (typeof pContext.name !== 'string') {
            throw new Exception('Field name must be a string.', WebDatabaseFieldDecorator);
        }

        // Read metadata from metadata...
        const lConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

        // Try to read table layout from metadata.
        let lTableLayout: WebDatabaseTableLayout<any> | null = lConstructorMetadata.getMetadata(WebDatabaseTableLayout.METADATA_KEY);
        if (!lTableLayout) {
            lTableLayout = new WebDatabaseTableLayout();
        }

        // Add field to the table layout.
        lTableLayout.setTableField(pContext.name);

        // Get index name.
        if (pExtension?.as) {
            // Set identity for the table.
            if ('identity' in pExtension.as && pExtension.as.identity) {
                // Set identity for the table.
                lTableLayout.setTableIdentity(pContext.name, pExtension.as.identity === 'auto');

                // Set identity property as index. Allws unique and single entry.
                lTableLayout.setTableIndex([pContext.name], true, false);
            }

            // Set index properties.
            if ('index' in pExtension.as && pExtension.as.index) {
                // Add table type index to layout.
                lTableLayout.setTableIndex([pContext.name], pExtension.as.index.unique ?? false, pExtension.as.index.multiEntry ?? false);
            }
        }

        // Set the table layout to the metadata.
        lConstructorMetadata.setMetadata(WebDatabaseTableLayout.METADATA_KEY, lTableLayout);
    };
};

type WebDatabaseFieldDecoratorIdentity<T> = (T extends number ? {
    as: {
        identity: 'auto' | 'manual';
    };
} : {
    as: {
        identity: 'manual';
    };
}) & { as: { index?: never; }; };

type WebDatabaseFieldDecoratorIndex<T> = (T extends number ? {
    as: {
        index: {
            unique?: boolean;
            multiEntry?: false;
        };
    };
} : T extends Array<any> ? {
    as: {
        index: {
            unique?: boolean;
            multiEntry?: boolean;
        };
    };
} : {
    as: {
        index: {
            unique?: boolean;
            multiEntry?: false;
        };
    };
}) & { as: { identity?: never; }; };

export type WebDatabaseFieldDecoratorExtension<T> = WebDatabaseFieldDecoratorIdentity<T> | WebDatabaseFieldDecoratorIndex<T>;

type WebDatabaseFieldDecoratorContext<TThis, TValue> = ClassGetterDecoratorContext<TThis, TValue> | ClassSetterDecoratorContext<TThis, TValue> | ClassFieldDecoratorContext<TThis, TValue> | ClassAccessorDecoratorContext<TThis, TValue>;


