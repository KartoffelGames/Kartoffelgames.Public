import { Exception } from '@kartoffelgames/core';
import { Metadata } from '@kartoffelgames/core-dependency-injection';
import type { ComponentProcessorConstructor } from '../../core/component/component.ts';
import { ExportExtension } from './export-extension.ts';

/**
 * AtScript.
 * Export value to component element.
 */
export function PwbExport(pTarget: object, pPropertyKey: string): void {
    // Usually Class Prototype. Globaly.
    const lPrototype: object = pTarget;
    const lUserClassConstructor: ComponentProcessorConstructor = <any>lPrototype.constructor;

    // Check if real decorator on static property.
    if (typeof pTarget === 'function') {
        throw new Exception('Event target is not for a static property.', PwbExport);
    }

    // Get property list from constructor metadata.
    const lExportedPropertyList: Array<string> = Metadata.get(lUserClassConstructor).getMetadata(ExportExtension.METADATA_EXPORTED_PROPERTIES) ?? new Array<string>();
    lExportedPropertyList.push(pPropertyKey);

    // Set metadata.
    Metadata.get(lUserClassConstructor).setMetadata(ExportExtension.METADATA_EXPORTED_PROPERTIES, lExportedPropertyList);
}
