import { InjectMode } from '../enum/inject-mode.ts';
import { ReflectInitializer } from '../reflect/reflect-initializer.ts';
import { InjectionConstructor } from '../type.ts';
import { Injection } from '../injection/injection.ts';

ReflectInitializer.initialize();

/**
 * AtScript.
 * Mark class to be injectable as an instanced object.
 * 
 * @param pConstructor - Constructor.
 */
export function Injectable(pConstructor: InjectionConstructor): void {
    Injection.registerInjectable(pConstructor, InjectMode.Instanced);
}