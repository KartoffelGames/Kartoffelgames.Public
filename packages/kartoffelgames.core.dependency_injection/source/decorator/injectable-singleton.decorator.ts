import { InjectMode } from '../enum/inject-mode.ts';
import { Injection } from '../injection/injection.ts';
import { ReflectInitializer } from '../reflect/reflect-initializer.ts';
import { InjectionConstructor } from '../type.ts';

ReflectInitializer.initialize();

/**
 * AtScript.
 * Mark class to be injectable as an singleton object.
 * 
 * @param pConstructor - Constructor.
 */
export function InjectableSingleton(pConstructor: InjectionConstructor): void {
    Injection.registerInjectable(pConstructor, InjectMode.Singleton);
}