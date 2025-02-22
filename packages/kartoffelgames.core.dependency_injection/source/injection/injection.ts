import { Dictionary, Exception } from '@kartoffelgames/core';
import { InjectionConstructor } from '../type.ts';
import { Metadata } from '../metadata/metadata.ts';

/**
 * Injection configuration and creator.
 * Handes global injection configuration for replaced injections and creates new instances from injectable classes.
 * 
 * @public 
 */
export class Injection {
    private static readonly mInjectionConstructorIdentificationMetadataKey: symbol = Symbol('InjectionConstructorIdentification');

    private static readonly mInjectMode: Dictionary<InjectionIdentification, InjectMode> = new Dictionary<InjectionConstructor, InjectMode>();
    private static readonly mInjectableConstructor: Dictionary<InjectionIdentification, InjectionConstructor> = new Dictionary<InjectionConstructor, InjectionConstructor>();
    private static readonly mInjectableReplacement: Dictionary<InjectionIdentification, InjectionConstructor> = new Dictionary<InjectionConstructor, InjectionConstructor>();
    private static readonly mSingletonMapping: Dictionary<InjectionIdentification, object> = new Dictionary<InjectionConstructor, object>();

    /**
     * Create object and auto inject parameter. Replaces parameter set by {@link replaceInjectable}.
     * 
     * @remarks
     * Instancing configuration is set on {@link Injector.Injectable} or {@link Injector.InjectableSingleton} decorators.
     * 
     * @param pConstructor - Constructor that should be created.
     * @param pLocalInjections - [Optional] Type objects pairs that replaces parameter with given type.
     *                           Does not inject those types any further into create object of parameters.
     * @param pForceCreate - [Optional] Force create new objects. Ignores the singleton injection restriction and creates a new object.
     *                       Has no effect on none singleton injections.
     * 
     * @throws {@link Exception}
     * When either the {@link pConstructor} is not injectable or any of its parameter fails to construct.
     * Construction of parameters fail when they are not registered or an error occurred on construction. 
     * 
     * @example Adding a new and existing key.
     * ```TypeScript
     * @Injector.Injectable
     * class Foo {}
     * 
     * @Injector.InjectableSingleton
     * class Bar {}
     * 
     * const instance = Injection.createObject(Foo);
     * const singleton = Injection.createObject(Bar);
     * ```
     * 
     * @returns a singleton or new instance of {@link pConstructor} based on it set injection configuration.
     */
    public static createObject<T extends object>(pConstructor: InjectionConstructor, pForceCreate?: boolean): T;
    public static createObject<T extends object>(pConstructor: InjectionConstructor, pLocalInjections?: Dictionary<InjectionConstructor, any>): T;
    public static createObject<T extends object>(pConstructor: InjectionConstructor, pForceCreate?: boolean, pLocalInjections?: Dictionary<InjectionConstructor, any>): T;
    public static createObject<T extends object>(pConstructor: InjectionConstructor, pForceCreateOrLocalInjections?: boolean | Dictionary<InjectionConstructor, any>, pLocalInjections?: Dictionary<InjectionConstructor, any>): T {
        // Decide between local injection or force creation parameter.
        const [lForceCreate, lLocalInjections] = (() => {
            if (typeof pForceCreateOrLocalInjections === 'object' && pForceCreateOrLocalInjections !== null) {
                return [false, pForceCreateOrLocalInjections];
            }

            return [!!pForceCreateOrLocalInjections, pLocalInjections ?? new Dictionary<InjectionConstructor, any>()];
        })();
        
        // Find constructor in decoration replacement history that was used for registering. Only root can be registered.
        const lRegisteredConstructor: InjectionConstructor = DecorationRootHistory.getOriginalOf(pConstructor);
        if (!Injection.mInjectableConstructor.has(lRegisteredConstructor)) {
            throw new Exception(`Constructor "${pConstructor.name}" is not registered for injection and can not be build`, Injection);
        }

        // Get injection mode. Allways defaultsa to instanced, when force created.
        const lInjectionMode: InjectMode = !lForceCreate ? Injection.mInjectMode.get(lRegisteredConstructor)! : InjectMode.Instanced;
        
        // Return cached singleton object if not forced to create a new one.
        if (!lForceCreate && lInjectionMode === InjectMode.Singleton && Injection.mSingletonMapping.has(lRegisteredConstructor)) {
            return <T>Injection.mSingletonMapping.get(lRegisteredConstructor);
        }

        // Get constructor parameter type information and default to empty parameter list.
        let lParameterTypeList: Array<InjectionConstructor> | null = Metadata.get(pConstructor).parameterTypes;
        if (lParameterTypeList === null) {
            lParameterTypeList = new Array<InjectionConstructor>();
        }

        // Create parameter.
        const lConstructorParameter: Array<object> = new Array<object>();
        for (const lParameterType of lParameterTypeList) {
            let lParameterObject: object;

            // Check if parameter can be replaced with an local injection
            if (lInjectionMode !== InjectMode.Singleton && lLocalInjections.has(lParameterType)) {
                lParameterObject = lLocalInjections.get(lParameterType);
            } else {
                // Read original parameter type used as replacement key.
                const lOriginalParameterType: InjectionConstructor = DecorationRootHistory.getOriginalOf(lParameterType);
                if (!Injection.mInjectableConstructor.has(lOriginalParameterType)) {
                    throw new Exception(`Parameter "${lParameterType.name}" of ${pConstructor.name} is not registered to be injectable.`, Injection);
                }

                // Try to find global replacement.
                let lParameterConstructor: InjectionConstructor;
                if (Injection.mInjectableReplacement.has(lOriginalParameterType)) {
                    lParameterConstructor = <InjectionConstructor>Injection.mInjectableReplacement.get(lOriginalParameterType);
                } else {
                    lParameterConstructor = lParameterType;
                }

                // Proxy exception.
                try {
                    // Get injectable parameter.
                    lParameterObject = Injection.createObject(lParameterConstructor, lLocalInjections);
                } catch (pException) {
                    // Error is always an Exception.
                    const lException: Exception<any> = <Exception<any>>pException;
                    throw new Exception(`Parameter "${lParameterType.name}" of ${pConstructor.name} is not injectable.\n` + lException.message, Injection);
                }
            }

            // Add parameter to construction parameter list.
            lConstructorParameter.push(lParameterObject);
        }

        // Create object.
        const lCreatedObject: T = <T>new pConstructor(...lConstructorParameter);

        // Cache singleton objects but only if not forced to create.
        if (lInjectionMode === InjectMode.Singleton && !Injection.mSingletonMapping.has(lRegisteredConstructor)) {
            Injection.mSingletonMapping.add(lRegisteredConstructor, lCreatedObject);
        }

        return lCreatedObject;
    }

    /**
     * Register an constructor for injection.
     * 
     * @remarks
     * Any constructor can be registred but only constructors that have a attached decorator of any kind are able to be injected.
     * 
     * @param pConstructor - Constructor that can be injected.
     * @param pMode - Mode of injection.
     */
    public static registerInjectable(pConstructor: InjectionConstructor, pMode: InjectMode): void {
        // Find root constructor of decorated constructor to habe registered constructor allways available top down.
        const lBaseConstructor: InjectionConstructor = DecorationRootHistory.getOriginalOf(pConstructor);

        // Map constructor.
        Injection.mInjectableConstructor.add(lBaseConstructor, pConstructor);
        Injection.mInjectMode.add(lBaseConstructor, pMode);
    }

    /**
     * Replaces an constructor so instead of the original, the replacement gets injected.
     * Both constructors must be registered with {@link registerInjectable}.
     * 
     * @param pOriginalConstructor - Original constructor that should be replaced.
     * @param pReplacementConstructor - Replacement constructor that gets injected instead of original constructor.
     * 
     * @throws {@link Exception}
     * When a constructor is not registed with {@link registerInjectable}.
     */
    public static replaceInjectable(pOriginalConstructor: InjectionConstructor, pReplacementConstructor: InjectionConstructor): void {
        // Find original registered original. Only root can be registerd.
        const lRegisteredOriginal: InjectionConstructor = DecorationRootHistory.getOriginalOf(pOriginalConstructor);
        if (!Injection.mInjectableConstructor.has(lRegisteredOriginal)) {
            throw new Exception('Original constructor is not registered.', Injection);
        }

        // Find replacement registered original. Only root can be registered.
        const lRegisteredReplacement: InjectionConstructor = DecorationRootHistory.getOriginalOf(pReplacementConstructor);
        if (!Injection.mInjectableConstructor.has(lRegisteredReplacement)) {
            throw new Exception('Replacement constructor is not registered.', Injection);
        }

        // Register replacement.
        Injection.mInjectableReplacement.set(lRegisteredOriginal, pReplacementConstructor);
    }

    private static readInjectionIdentification(pConstructor: InjectionConstructor): InjectionIdentification {
        // Read metadata from constructor.
        const lMetadata: ConstructorMetadata = Metadata.get(pConstructor);
        let lIdentification: InjectionIdentification | undefined = lMetadata.getMetadata(Injection.mInjectionConstructorIdentificationMetadataKey);

        // Create new metadata object and assign it to decorator metadata.
        if (!lIdentification) {
            lIdentification = Symbol(pConstructor.name);
            lMetadata.setMetadata(Injection.mInjectionConstructorIdentificationMetadataKey, lIdentification);
        }

        return lIdentification;
    }
}

export type InjectMode = 'singleton' | 'instanced';