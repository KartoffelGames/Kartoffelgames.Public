import { Exception } from '@kartoffelgames/core.data';
import { Component } from '../../component_entity/component/component';
import { ComponentProcessor } from '../../component_entity/component/component.interface';
import { LayerValues } from '../../component_entity/component/values/layer-values';
import { ComponentLayerValuesReference } from '../../component_entity/injection-reference/component/component-layer-values-reference';
import { ComponentInformation } from '../../component_entity/component/component-information';

/**
 * AtScript. Id child 
 * @param pIdChildName - Name of id child.
 */
export function PwbChild(pIdChildName: string): any {
    return (pTarget: object, pPropertyKey: string) => {
        // Check if real decorator on static property.
        if (typeof pTarget === 'function') {
            throw new Exception('Event target is not for a static property.', PwbChild);
        }

        // Define getter accessor that returns id child.
        Object.defineProperty(pTarget, pPropertyKey, {
            get(this: ComponentProcessor) {
                // Get component manager and exit if target is not a component.
                const lComponent: Component = ComponentInformation.ofProcessor(this).component;
                
                // Get root value. This should be the child.
                const lLayerValues: LayerValues = lComponent.getProcessorAttribute(ComponentLayerValuesReference)!;
                const lIdChild: any = lLayerValues.data[pIdChildName];

                if (lIdChild instanceof Element) {
                    return lIdChild;
                } else {
                    throw new Exception(`Can't find child "${pIdChildName}".`, this);
                }
            }
        });
    };
}