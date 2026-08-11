import { List } from '@kartoffelgames/core';
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
        const lExportedPropertyList: List<string> = new List<string>();

        let lClass: InjectionConstructor = pComponent.processorConstructor;
        do {
            // Find all exported properties of current class layer and add all to merged property list.
            const lPropertyList: Array<string> | null = Metadata.get(lClass).getMetadata(ExportExtension.METADATA_EXPORTED_PROPERTIES);
            if (lPropertyList) {
                lExportedPropertyList.push(...lPropertyList);
            }

            // Get next inherited parent class. Exit when no parent was found.

        } while (lClass = Object.getPrototypeOf(lClass));

        const lDistinctExportedPropertys: Set<string> = new Set<string>(lExportedPropertyList);

        // Connect exported properties with distinct list.
        if (lDistinctExportedPropertys.size > 0) {
            this.connectExportedProperties(lDistinctExportedPropertys);
        }
    }

    /**
     * Connect exported properties to html element attributes with the same name.
     * @param pExportedProperties - Exported user object properties.
     */
    private connectExportedProperties(pExportedProperties: Set<string>): void {
        this.exportPropertyAsAttribute(pExportedProperties);
        this.patchHtmlAttributes(pExportedProperties);
    }

    /**
     * Export exported properties so that exported user class properties can be accessed from html element.
     */
    private exportPropertyAsAttribute(pExportedProperties: Set<string>): void {
        // Each exported property.
        for (const lExportProperty of pExportedProperties) {
            // Get property descriptor. HTMLElement has no descriptors -,-
            const lDescriptor: PropertyDescriptor = {}; //Object.getOwnPropertyDescriptor(this.mHtmlElement, lExportProperty);

            lDescriptor.enumerable = true;
            lDescriptor.configurable = true;
            delete lDescriptor.value;
            delete lDescriptor.writable;

            // Setter and getter of this property. Execute changes inside component interaction zone.
            lDescriptor.set = (pValue: any) => {
                Reflect.set(this.mComponent.processor, lExportProperty, pValue);
            };
            lDescriptor.get = () => {
                let lValue: any = Reflect.get(this.mComponent.processor, lExportProperty);

                // Bind "this" context to the exported function.
                if (typeof lValue === 'function') {
                    lValue = (<(...pArgs: Array<any>) => any>lValue).bind(this.mComponent.processor);
                }

                return lValue;
            };

            Object.defineProperty(this.mComponent.element, lExportProperty, lDescriptor);
        }
    }

    /**
     * Patch setAttribute and getAttribute to set and get exported values.
     */
    private patchHtmlAttributes(pExportedAttributes: Set<string>): void {
        const lElement: HTMLElement = this.mComponent.element;
        const lOriginalGetAttribute: (pQualifiedName: string) => string | null = lElement.getAttribute;
        const lOriginalSetAttribute: (pQualifiedName: string, pValue: string) => void = lElement.setAttribute;

        // Reflect an attribute value into the processor and notify the component about the change.
        const lApplyAttribute = (pAttributeName: string, pOldValue: string | null, pNewValue: string | null): boolean => {
            // Set value in processor and signal it to the component.
            Reflect.set(lElement, pAttributeName, pNewValue);
            this.mComponent.attributeChanged(pAttributeName, pOldValue, pNewValue);

            return true;
        };

        // Save values set directly by "setAttribute" so they are not retriggered by the observer.
        const lAppliedAttributes: Map<string, string> = new Map<string, string>();

        // Init mutation observer, observing attribute changes made outside of the patched setAttribute.
        const lMutationObserver: MutationObserver = new MutationObserver((pMutationList) => {
            for (const lMutation of pMutationList) {
                const lAttributeName: string = lMutation.attributeName!;

                // Read current value.
                const lAttributeValue: string | null = lOriginalGetAttribute.call(lElement, lAttributeName);

                // Skip mutations when the value is already set as a applied value.
                if (lAppliedAttributes.get(lAttributeName) === lAttributeValue) {
                    continue;
                }

                lApplyAttribute(lAttributeName, lMutation.oldValue, lAttributeValue);
            }
        });
        lMutationObserver.observe(lElement, { attributeFilter: [...pExportedAttributes], attributeOldValue: true });

        // Set initial state of already present attributes synchronously.
        for (const lAttributeName of pExportedAttributes) {
            if (lElement.hasAttribute(lAttributeName)) {
                const lCurrentAttributeValue: string = lOriginalGetAttribute.call(lElement, lAttributeName)!;

                // Reflect current attribute value into the processor.
                lApplyAttribute(lAttributeName, lCurrentAttributeValue, lCurrentAttributeValue);
            }
        }

        // path set attribute. So syncron set values are also applied synchron.
        lElement.setAttribute = (pQualifiedName: string, pValue: string): void => {
            // Read old value before the actual attribute change.
            const lOldValue: string | null = lOriginalGetAttribute.call(lElement, pQualifiedName);

            // First of all set the value as attribute.
            lOriginalSetAttribute.call(lElement, pQualifiedName, pValue);

            // Non exported attributes skip reflection calls.
            if (!pExportedAttributes.has(pQualifiedName)) {
                return;
            }

            // Mark the upcoming mutation record so the observer does not apply it a second time.
            lAppliedAttributes.set(pQualifiedName, pValue.toString());

            // Set the real attribute and reflect its value into the processor synchronously.
            lOriginalSetAttribute.call(lElement, pQualifiedName, pValue);
            lApplyAttribute(pQualifiedName, lOldValue, pValue);
        };

        // Patch get attribute
        lElement.getAttribute = (pQualifiedName: string): string | null => {
            // Check if attribute is an exported value and return value of user class object.
            if (pExportedAttributes.has(pQualifiedName)) {
                return Reflect.get(lElement, pQualifiedName);
            }

            return lOriginalGetAttribute.call(lElement, pQualifiedName);
        };
    }
}