import { Injection, type InjectionConstructor, Metadata } from '@kartoffelgames/core-dependency-injection';
import { Component } from '../../core/component/component.ts';
import { AccessMode } from '../../core/enum/access-mode.enum.ts';
import { PwbExtensionModule } from '../../core/extension/pwb-extension-module.decorator.ts';

@PwbExtensionModule({
    access: AccessMode.ReadWrite,
    targetRestrictions: [Component]
})
export class ExportExtension {
    public static readonly METADATA_EXPORTED_PROPERTIES: string = 'pwb:exported_properties';

    private readonly mComponent: Component;

    /**
     * Constructor.
     * @param pTargetElementReference - Component html element reference.
     * @param pComponentManagerReference - Component manager reference.
     */
    public constructor(pComponent = Injection.use(Component)) {
        this.mComponent = pComponent;

        // All exported properties of target and parent classes.
        const lExportedProperties: Map<string, string> = new Map<string, string>();

        let lClass: InjectionConstructor = pComponent.processorConstructor;
        do {
            // Find all exported properties of current class layer and add all to merged property list.
            const lPropertyList: Array<ExportExtensionAttribute> | null = Metadata.get(lClass).getMetadata(ExportExtension.METADATA_EXPORTED_PROPERTIES);
            if (lPropertyList) {
                for (const lExportedProperty of lPropertyList) {
                    lExportedProperties.set(lExportedProperty.attributeName, lExportedProperty.propertyName);
                }
            }

            // Get next inherited parent class. Exit when no parent was found.
        } while (lClass = Object.getPrototypeOf(lClass));

        // Connect exported properties with distinct list.
        if (lExportedProperties.size > 0) {
            this.connectExportedProperties(lExportedProperties);
        }
    }

    /**
     * Connect exported properties to html element attributes with the same name.
     * @param pExportedProperties - Exported user object properties.
     */
    private connectExportedProperties(pExportedProperties: Map<string, string>): void {
        const lAttributeAccessor: ExportExtensionOriginals = this.patchHtmlAttributes(pExportedProperties);
        this.exportPropertyAsAttribute(pExportedProperties, lAttributeAccessor);
    }

    /**
     * Export exported properties so that exported user class properties can be accessed from html element.
     * 
     * @param pExportedProperties - Exported properties.
     * @param pAttributeAccessor - Original attribute accessor.
     */
    private exportPropertyAsAttribute(pExportedProperties: Map<string, string>, pAttributeAccessor: ExportExtensionOriginals): void {
        // Each exported property.
        for (const [lExportAttributeName, lExportedPropertyName] of pExportedProperties) {
            // Get property descriptor. HTMLElement has no descriptors -,-
            const lDescriptor: PropertyDescriptor = {}; //Object.getOwnPropertyDescriptor(this.mHtmlElement, lExportProperty);

            lDescriptor.enumerable = true;
            lDescriptor.configurable = true;
            delete lDescriptor.value;
            delete lDescriptor.writable;

            // Setter and getter of this property. Execute changes inside component interaction zone.
            lDescriptor.set = (pValue: any) => {
                Reflect.set(this.mComponent.processor, lExportedPropertyName, pValue);

                // Also update the attribute with the original attribute function.
                pAttributeAccessor.setAttribute(lExportAttributeName, pValue);
            };
            lDescriptor.get = () => {
                let lValue: any = Reflect.get(this.mComponent.processor, lExportedPropertyName);

                // Bind "this" context to the exported function.
                if (typeof lValue === 'function') {
                    lValue = (<(...pArgs: Array<any>) => any>lValue).bind(this.mComponent.processor);
                }

                return lValue;
            };

            Object.defineProperty(this.mComponent.element, lExportedPropertyName, lDescriptor);
        }
    }

    /**
     * Patch setAttribute and getAttribute to set and get exported values.
     * 
     * @param pExportedProperties - Exported properties.
     */
    private patchHtmlAttributes(pExportedProperties: Map<string, string>): ExportExtensionOriginals {
        const lElement: HTMLElement = this.mComponent.element;

        // Attributes mutated by our own setAttribute calls. The observer skips their records and resets this set
        // after each run, so only external changes are reflected back into the processor.
        const lSelfMutatedAttributes: Set<string> = new Set<string>();

        // Save original attribute accessors.
        const lAttributeAccessor: ExportExtensionOriginals = (() => {
            const lOriginalGetAttribute: (pQualifiedName: string) => string | null = lElement.getAttribute;
            const lOriginalSetAttribute: (pQualifiedName: string, pValue: string) => void = lElement.setAttribute;

            return {
                getAttribute: (pQualifiedName: string): string | null => {
                    return lOriginalGetAttribute.call(lElement, pQualifiedName);
                },
                setAttribute: (pQualifiedName: string, pValue: unknown): void => {
                    // Read the value before the change so we can tell if a mutation record will actually be queued.
                    const lOldValue: string | null = lOriginalGetAttribute.call(lElement, pQualifiedName);
                    const lNewValue: string = pValue?.toString() ?? '';

                    lOriginalSetAttribute.call(lElement, pQualifiedName, lNewValue);

                    // Non exported attributes skip reflection calls.
                    if (!pExportedProperties.has(pQualifiedName)) {
                        return;
                    }

                    // The observer does not trigger when the actual value does not change.
                    if (lOldValue !== lNewValue) {
                        lSelfMutatedAttributes.add(pQualifiedName);
                    }
                }
            };
        })();

        // Reflect an attribute value into the processor and notify the component about the change.
        const lApplyAttribute = (pAttributeName: string, pOldValue: string | null, pNewValue: string | null): boolean => {
            // Resolve the processor property the attribute is exported from.
            const lPropertyName: string = pExportedProperties.get(pAttributeName)!;

            // Set value in processor and signal it to the component.
            Reflect.set(this.mComponent.processor, lPropertyName, pNewValue);
            this.mComponent.attributeChanged(pAttributeName, pOldValue, pNewValue);

            return true;
        };

        // Init mutation observer, observing attribute changes made outside of the patched setAttribute.
        const lMutationObserver: MutationObserver = new MutationObserver((pMutationList) => {
            for (const lMutation of pMutationList) {
                const lAttributeName: string = lMutation.attributeName!;

                // Skip records caused by our own setAttribute calls, so they are not reset back.
                if (lSelfMutatedAttributes.has(lAttributeName)) {
                    continue;
                }

                // External change. Reflect the current attribute value into the processor.
                lApplyAttribute(lAttributeName, lMutation.oldValue, lAttributeAccessor.getAttribute(lAttributeName));
            }

            // Reset self mutation markers after all attributes are processed.
            lSelfMutatedAttributes.clear();
        });
        lMutationObserver.observe(lElement, { attributeFilter: [...pExportedProperties.keys()], attributeOldValue: true });

        // Set initial state of exported properties synchronously.
        for (const lAttributeName of pExportedProperties.keys()) {
            if (lElement.hasAttribute(lAttributeName)) {
                const lCurrentAttributeValue: string = lAttributeAccessor.getAttribute(lAttributeName)!;

                // Reflect current attribute value into the processor.
                lApplyAttribute(lAttributeName, lCurrentAttributeValue, lCurrentAttributeValue);
            }
        }

        // Patch set attribute. So syncron set values are also applied synchron.
        lElement.setAttribute = (pQualifiedName: string, pValue: string): void => {
            // Read old value before the actual attribute change.
            const lOldValue: string | null = lAttributeAccessor.getAttribute(pQualifiedName);

            // First of all set the value as attribute.
            lAttributeAccessor.setAttribute(pQualifiedName, pValue);

            // Non exported attributes skip reflection calls.
            if (!pExportedProperties.has(pQualifiedName)) {
                return;
            }

            lApplyAttribute(pQualifiedName, lOldValue, pValue);
        };

        // Patch get attribute
        lElement.getAttribute = (pQualifiedName: string): string | null => {
            // Check if attribute is an exported value and return value of user class object.
            if (pExportedProperties.has(pQualifiedName)) {
                return Reflect.get(lElement, pExportedProperties.get(pQualifiedName)!);
            }

            return lAttributeAccessor.getAttribute(pQualifiedName);
        };

        return lAttributeAccessor;
    }
}

type ExportExtensionOriginals = {
    getAttribute: (pQualifiedName: string) => string | null;
    setAttribute: (pQualifiedName: string, pValue: unknown) => void;
};

export type ExportExtensionAttribute = {
    attributeName: string;
    propertyName: string;
};
