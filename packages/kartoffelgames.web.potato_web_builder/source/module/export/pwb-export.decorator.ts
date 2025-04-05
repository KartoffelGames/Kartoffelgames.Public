import { Exception } from '@kartoffelgames/core';
import { Metadata } from '@kartoffelgames/core-dependency-injection';
import { ExportExtension } from './export-extension.ts';
import { ConstructorMetadata } from "../../../../kartoffelgames.core.dependency_injection/source/metadata/constructor-metadata.ts";

/**
 * AtScript.
 * Export value to component element.
 */
export function PwbExport(_: any, pContext: ClassMemberDecoratorContext): void {
    // Metadata is not allowed for statics.
    if (pContext.static) {
        throw new Exception('Event target is not for a static property.', PwbExport);
    }

    // Read class metadata from decorator metadata object.
    const lClassMetadata: ConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

    // Get property list from constructor metadata.
    const lExportedPropertyList: Array<string | symbol> = lClassMetadata.getMetadata(ExportExtension.METADATA_EXPORTED_PROPERTIES) ?? new Array<string | symbol>();
    lExportedPropertyList.push(pContext.name);

    // Set metadata.
    lClassMetadata.setMetadata(ExportExtension.METADATA_EXPORTED_PROPERTIES, lExportedPropertyList);
}