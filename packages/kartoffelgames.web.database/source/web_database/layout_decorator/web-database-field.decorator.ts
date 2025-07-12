import { ClassFieldDecorator, Exception } from '@kartoffelgames/core';
import { Metadata } from "@kartoffelgames/core-dependency-injection";
import { WebDatabaseTableLayout } from "../web-database-table-layout.ts";

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
export const WebDatabaseFieldDecorator = <T>(pExtension?: WebDatabaseFieldDecoratorExtension<T>): ClassFieldDecorator<any, T> => {
    return function (_pTarget: any, pContext: WebDatabaseFieldDecoratorContext<any, any>): void {
        // Decorator can not be used on static propertys.
        if (pContext.static) {
            throw new Exception('Index property can not be a static property.', WebDatabaseFieldDecorator);
        }

        // Decorator can only be attached to string named properties.
        if (typeof pContext.name !== 'string') {
            throw new Exception('Index name must be a string.', WebDatabaseFieldDecorator);
        }

        // Read metadata from metadata...
        const lConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

        // Try to read table layout from metadata.
        let lTableLayout: WebDatabaseTableLayout | null = lConstructorMetadata.getMetadata(WebDatabaseTableLayout.METADATA_KEY);
        if (!lTableLayout) {
            lTableLayout = new WebDatabaseTableLayout();
        }

        // Add field to the table layout.
        lTableLayout.setTableField(pContext.name);

        // Get index name.
        if (pExtension) {
            // Set identity for the table.
            if (pExtension.as.identity) {
                // Set identity for the table.
                lTableLayout.setTableIdentity(pContext.name, pExtension.as.identity === 'auto');
            }

            // Set index properties.
            if (pExtension.as.index) {
                // Add table type index to layout.
                lTableLayout.setTableIndex([pContext.name], pExtension.as.index.unique ?? false, pExtension.as.index.multiEntry ?? false);
            }
        }

        // Set the table layout to the metadata.
        lConstructorMetadata.setMetadata(WebDatabaseTableLayout.METADATA_KEY, lTableLayout);
    };
};

export type WebDatabaseFieldDecoratorExtension<T> = T extends number ? {
    as: {
        identity?: 'auto' | 'manual';
        index?: {
            unique?: boolean;
            multiEntry?: false;
        };
    };
} : T extends Array<any> ? {
    as: {
        identity?: 'manual';
        index?: {
            unique?: boolean;
            multiEntry?: boolean;
        };
    };
} : {
    as: {
        identity?: 'manual';
        index?: {
            unique?: boolean;
            multiEntry?: false;
        };
    };
};

type WebDatabaseFieldDecoratorContext<TThis, TValue> = ClassGetterDecoratorContext<TThis, TValue> | ClassSetterDecoratorContext<TThis, TValue> | ClassFieldDecoratorContext<TThis, TValue> | ClassAccessorDecoratorContext<TThis, TValue>;


