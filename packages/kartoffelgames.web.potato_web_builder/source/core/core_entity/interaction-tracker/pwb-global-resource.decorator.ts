import { CoreEntityProcessorProxy } from './core-entity-processor-proxy.ts';


/**
 * AtScript. PWB global resource.
 * Enables tracking of global static resources.
 */
export function PwbGlobalResource(): ClassDecorator {
    return <TFunction extends Function>(pProcessorConstructor: TFunction): TFunction => {

        const lStaticProxy: TFunction = new CoreEntityProcessorProxy(pProcessorConstructor).proxy;

        // Export static class to global scope.
        (<any>globalThis)[pProcessorConstructor.name] = lStaticProxy;

        // Proxy statics.
        return lStaticProxy;
    };
}
