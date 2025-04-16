import type { InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import type { ClassDecorator } from '../../../../../kartoffelgames.core/source/index.ts';
import { CoreEntityProcessorProxy } from './core-entity-processor-proxy.ts';

/**
 * AtScript. PWB global resource.
 * Enables tracking of global static resources.
 */
export function PwbGlobalResource<TFunction extends InjectionConstructor>(): ClassDecorator<TFunction, TFunction> {
    return (pProcessorConstructor: TFunction, _pContext: ClassDecoratorContext): TFunction => {
        const lStaticProxy: TFunction = new CoreEntityProcessorProxy(pProcessorConstructor).proxy;

        // Export static class to global scope.
        (<any>globalThis)[pProcessorConstructor.name] = lStaticProxy;

        // Proxy statics.
        return lStaticProxy;
    };
}
