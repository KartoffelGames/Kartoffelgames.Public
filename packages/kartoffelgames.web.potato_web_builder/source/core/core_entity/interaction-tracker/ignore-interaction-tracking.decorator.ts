import { CoreEntityProcessorProxy } from './core-entity-processor-proxy.ts';

/**
 * AtScript. Add class to list of ignored classes of component interaction tracking.
 * 
 * @param pConstructor - Class.
 */
export function IgnoreInteractionTracking(pConstructor: any): void {
    CoreEntityProcessorProxy.ignoreClass(pConstructor);
}

