import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { CoreEntityProcessorProxy } from './core-entity-processor-proxy';


/**
 * AtScript. PWB global resource.
 * Enables tracking of global static resources.
 */
export function PwbGlobalResource(): any {
    return (pProcessorConstructor: InjectionConstructor) => {

        const lStaticProxy: InjectionConstructor = new CoreEntityProcessorProxy(pProcessorConstructor).proxy;

        // Export static class to global scope.
        (<any>globalThis)[pProcessorConstructor.name] = lStaticProxy;

        // Proxy statics.
        return lStaticProxy;
    };
}