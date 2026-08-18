import { ClassMemberDecorator, Exception } from '@kartoffelgames/core';
import type { ConstructorMetadata } from '@kartoffelgames/core-dependency-injection';
import { Metadata } from '@kartoffelgames/core-dependency-injection';
import { ExportExtension, ExportExtensionAttribute } from './export-extension.ts';

/**
 * AtScript.
 * Export value to component element.
 * 
 * @param pAttributeName - Attriute name that gets used on html components.
 */
export function PwbExport(pAttributeName?: string) {
    return (_pTarget: any, pContext: ClassMemberDecoratorContext): void => {
        // Metadata is not allowed for statics.
        if (pContext.static) {
            throw new Exception('Event target is not for a static property.', PwbExport);
        }

        // Read class metadata from decorator metadata object.
        const lClassMetadata: ConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

        // Get property list from constructor metadata.
        const lExportedPropertyList: Array<ExportExtensionAttribute> = lClassMetadata.getMetadata(ExportExtension.METADATA_EXPORTED_PROPERTIES) ?? new Array<ExportExtensionAttribute>();
        lExportedPropertyList.push({
            propertyName: pContext.name as string,
            attributeName: pAttributeName ?? pContext.name as string
        });

        // Set metadata.
        lClassMetadata.setMetadata(ExportExtension.METADATA_EXPORTED_PROPERTIES, lExportedPropertyList);
    };
}