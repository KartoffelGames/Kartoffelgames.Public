import type { InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { CoreEntityProcessorProxy } from './core-entity-processor-proxy.ts';


/**
 * AtScript. PWB global resource.
 * Enables tracking of global static resources.
 */
export function PwbGlobalResource() {
    return <TFunction extends InjectionConstructor>(pProcessorConstructor: TFunction, _pContext: ClassDecoratorContext): TFunction => {
        const lStaticProxy: TFunction = new CoreEntityProcessorProxy(pProcessorConstructor).proxy;

        // Export static class to global scope.
        (<any>globalThis)[pProcessorConstructor.name] = lStaticProxy;

        // Proxy statics.
        return lStaticProxy;
    };
}
