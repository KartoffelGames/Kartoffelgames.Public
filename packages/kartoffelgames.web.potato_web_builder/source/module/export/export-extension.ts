import { List } from '@kartoffelgames/core';
import { type InjectionConstructor, Metadata } from '@kartoffelgames/core-dependency-injection';
import { Component } from '../../core/component/component.ts';
import { Processor } from '../../core/core_entity/processor.ts';
import { AccessMode } from '../../core/enum/access-mode.enum.ts';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum.ts';
import { PwbExtensionModule } from '../../core/extension/pwb-extension-module.decorator.ts';

@PwbExtensionModule({
    access: AccessMode.ReadWrite,
    trigger: UpdateTrigger.Any,
    targetRestrictions: [Component]
})
export class ExportExtension extends Processor {
    public static readonly METADATA_EXPORTED_PROPERTIES: string = 'pwb:exported_properties';

    private readonly mComponent: Component;

    /**
     * Constructor.
     * @param pTargetElementReference - Component html element reference.
     * @param pComponentManagerReference - Component manager reference.
     */
    public constructor(pComponent: Component) {
        super();

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
        const lOriginalGetAttribute: (pQualifiedName: string) => string | null = this.mComponent.element.getAttribute;

        // Init mutation observerm observing attribute changes.
        const lMutationObserver: MutationObserver = new globalThis.MutationObserver((pMutationList) => {
            for (const lMutation of pMutationList) {
                const lAttributeName: string = lMutation.attributeName!;
                const lAttributeValue: string | null = lOriginalGetAttribute.call(this.mComponent.element, lAttributeName);

                // Set value in processor.
                Reflect.set(this.mComponent.element, lAttributeName, lAttributeValue);

                this.mComponent.attributeChanged(lAttributeName, lMutation.oldValue, lAttributeValue);
            }
        });
        lMutationObserver.observe(this.mComponent.element, { attributeFilter: [...pExportedAttributes], attributeOldValue: true });

        // Set initial state of attribute.
        for (const lAttributeName of pExportedAttributes) {
            if (this.mComponent.element.hasAttribute(lAttributeName)) {                
                const lCurrentAttributeValue: string = lOriginalGetAttribute.call(this.mComponent.element, lAttributeName)!;

                // Set again and trigger mutation observer.
                this.mComponent.element.setAttribute(lAttributeName, lCurrentAttributeValue);
            }
        }

        // Patch get attribute
        this.mComponent.element.getAttribute = (pQualifiedName: string): string | null => {
            // Check if attribute is an exported value and return value of user class object.
            if (pExportedAttributes.has(pQualifiedName)) {
                return Reflect.get(this.mComponent.element, pQualifiedName);
            }

            return lOriginalGetAttribute.call(this.mComponent.element, pQualifiedName);
        };
    }
}