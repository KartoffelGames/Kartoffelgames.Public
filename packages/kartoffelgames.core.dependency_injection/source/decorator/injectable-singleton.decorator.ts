import { Injection } from '../injection/injection.ts';
import { InjectionConstructor } from '../type.ts';

/**
 * AtScript.
 * Mark class to be injectable as an singleton object.
 * 
 * @param pOriginalClass - Constructor.
 * @param pContext -  Decorator context.
 */
export function InjectableSingleton(pOriginalClass: InjectionConstructor, pContext: ClassDecoratorContext): void {
    // Additional validation for class context.
    if (pContext.kind !== 'class') {
        throw new Error(`@InjectableSingleton can only be used on classes.`);
    }

    Injection.registerInjectable(pOriginalClass, 'singleton');
}

// pConstructor: 