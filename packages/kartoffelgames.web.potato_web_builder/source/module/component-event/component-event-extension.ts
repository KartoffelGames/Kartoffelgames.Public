import { Injection, Metadata } from '@kartoffelgames/core-dependency-injection';
import { Component, type ComponentProcessorConstructor } from '../../core/component/component.ts';
import { Processor } from '../../core/core_entity/processor.ts';
import { AccessMode } from '../../core/enum/access-mode.enum.ts';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum.ts';
import { PwbExtensionModule } from '../../core/extension/pwb-extension-module.decorator.ts';
import { ComponentEventEmitter } from './component-event-emitter.ts';

@PwbExtensionModule({
    access: AccessMode.Read,
    trigger: UpdateTrigger.Any,
    targetRestrictions: [Component]
})
export class ComponentEventExtension extends Processor{
    public static readonly METADATA_USER_EVENT_PROPERIES: string = 'pwb:user_event_properties';

    /**
     * Constructor.
     * Override each event emmiter property with a new pre defined event emmiter.
     * 
     * @param pComponentProcessorConstructor - Component processor constructor.
     * @param pComponent - Component processor.
     */
    public constructor(pComponent = Injection.use(Component)) {
        super();
        
        // Find all event properties of current class layer and add all to merged property list.
        const lEventPropertyMapList: Array<Array<[string, string, ComponentProcessorConstructor]>> = Metadata.get(pComponent.processorConstructor).getInheritedMetadata(ComponentEventExtension.METADATA_USER_EVENT_PROPERIES);
        for (const lEventPropertyList of lEventPropertyMapList) {
            for (const [lEventName, lPropertyKey, lConstructor] of lEventPropertyList) {
                // Validate event emitter property type. // TODO: Check type.
                // if (Metadata.get(lConstructor).getProperty(lPropertyKey).type !== ComponentEventEmitter) {
                //     throw new Exception(`Event emitter property must be of type ${ComponentEventEmitter.name}`, this);
                // }

                // Create component event emitter.
                const lEventEmitter: ComponentEventEmitter<any> = new ComponentEventEmitter(lEventName, pComponent.element);

                // Override property with created component event emmiter getter.
                Object.defineProperty(pComponent.processor, lPropertyKey, {
                    get: () => {
                        return lEventEmitter;
                    }
                });
            }
        }
    }
}