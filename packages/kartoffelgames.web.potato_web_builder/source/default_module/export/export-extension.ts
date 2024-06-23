import { List } from '@kartoffelgames/core.data';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';
import { Component, IComponentOnAttributeChange } from '../../core/component/component';
import { PwbExtensionModule } from '../../core/extension/pwb-extension-module.decorator';
import { ComponentConstructorReference } from '../../core/injection-reference/component/component-constructor-reference';
import { ComponentReference } from '../../core/injection-reference/component/component-reference';
import { AccessMode } from '../../enum/access-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

@PwbExtensionModule({
    access: AccessMode.Read,
    trigger: UpdateTrigger.Default,
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
    public constructor(pComponentProcessorConstructor: ComponentConstructorReference, pComponent: ComponentReference) {
        this.mComponent = pComponent;

        // All exported properties of target and parent classes.
        const lExportedPropertyList: List<string> = new List<string>();

        let lClass: InjectionConstructor = <InjectionConstructor>pComponentProcessorConstructor;
        do {
            // Find all exported properties of current class layer and add all to merged property list.
            const lPropertyList: Array<string> | null = Metadata.get(lClass).getMetadata(ExportExtension.METADATA_EXPORTED_PROPERTIES);
            if (lPropertyList) {
                lExportedPropertyList.push(...lPropertyList);
            }

            // Get next inherited parent class. Exit when no parent was found.
            // eslint-disable-next-line no-cond-assign
        } while (lClass = Object.getPrototypeOf(lClass));

        // Connect exported properties with distinct list.
        this.connectExportedProperties(lExportedPropertyList.distinct());
    }

    /**
     * Connect exported properties to html element attributes with the same name.
     * @param pExportedProperties - Exported user object properties.
     */
    private connectExportedProperties(pExportedProperties: Array<string>): void {
        this.exportPropertyAsAttribute(pExportedProperties);
        this.patchHtmlAttributes(pExportedProperties);
    }

    /**
     * Export exported properties so that exported user class properties can be accessed from html element.
     */
    private exportPropertyAsAttribute(pExportedProperties: Array<string>): void {
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

                // Call OnAttributeChange.
                this.mComponent.call<IComponentOnAttributeChange, 'onAttributeChange'>('onAttributeChange', false, lExportProperty);
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
    private patchHtmlAttributes(pExportedProperties: Array<string | symbol>): void {
        // Get original functions.
        const lOriginalSetAttribute: (pQualifiedName: string, pValue: string) => void = this.mComponent.element.setAttribute;
        const lOriginalGetAttribute: (pQualifiedName: string) => string | null = this.mComponent.element.getAttribute;

        // Patch set attribute
        this.mComponent.element.setAttribute = (pQualifiedName: string, pValue: string) => {
            // Check if attribute is an exported value and set value to user class object.
            if (pExportedProperties.includes(pQualifiedName)) {
                Reflect.set(this.mComponent.element, pQualifiedName, pValue);
            }

            lOriginalSetAttribute.call(this.mComponent.element, pQualifiedName, pValue);
        };

        // Patch get attribute
        this.mComponent.element.getAttribute = (pQualifiedName: string): string | null => {
            // Check if attribute is an exported value and return value of user class object.
            if (pExportedProperties.includes(pQualifiedName)) {
                return Reflect.get(this.mComponent.element, pQualifiedName);
            }

            return lOriginalGetAttribute.call(this.mComponent.element, pQualifiedName);
        };
    }
}