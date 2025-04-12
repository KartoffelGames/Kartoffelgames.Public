import type { InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { CoreEntityProcessorProxy } from './core-entity-processor-proxy.ts';

/**
 * AtScript. Add class to list of ignored classes of component interaction tracking.
 * 
 * @param pConstructor - Class.
 */
export function IgnoreInteractionTracking() {
    return <TFunction extends InjectionConstructor>(pConstructor: TFunction): void => {
        CoreEntityProcessorProxy.ignoreClass(pConstructor);
    };
}