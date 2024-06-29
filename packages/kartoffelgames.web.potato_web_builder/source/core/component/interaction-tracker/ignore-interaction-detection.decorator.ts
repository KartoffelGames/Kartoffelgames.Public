import { ComponentProcessorProxy } from './component-processor-proxy';

/**
 * AtScript. Add class to list of ignored classes of component interaction tracking.
 * 
 * @param pConstructor - Class.
 */
export function IgnoreInteractionTracking(pConstructor: any): void {
    ComponentProcessorProxy.ignoreClass(pConstructor);
}

