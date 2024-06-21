import { Exception } from '@kartoffelgames/core.data';
import { Component, ComponentProcessor } from '../../core/component/component';
import { LayerValues } from '../../core/component/values/layer-values';
import { ComponentLayerValuesReference } from '../../core/injection-reference/component/component-layer-values-reference';
import { ComponentInformation } from '../../core/component/component-information';

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
                const lComponent: Component = (() => {
                    try {
                        return ComponentInformation.ofProcessor(this).component;
                    } catch (_err) {
                        throw new Exception('PwbChild target class it not a component.', this);
                    }
                })();

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