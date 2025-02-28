import { Dictionary, Exception } from '@kartoffelgames/core';
import { ConstructorMetadata } from "../metadata/constructor-metadata.ts";
import { Metadata } from '../metadata/metadata.ts';
import { InjectionConstructor } from '../type.ts';

/**
 * Injection configuration and creator.
 * Handes global injection configuration for replaced injections and creates new instances from injectable classes.
 * 
 * @public 
 */
export class Injection {
    private static readonly mInjectionConstructorIdentificationMetadataKey: symbol = Symbol('InjectionConstructorIdentification');

    private static readonly mInjectMode: Dictionary<InjectionIdentification, InjectMode> = new Dictionary<InjectionIdentification, InjectMode>();
    private static readonly mInjectableConstructor: Dictionary<InjectionIdentification, InjectionConstructor> = new Dictionary<InjectionIdentification, InjectionConstructor>();
    private static readonly mInjectableReplacement: Dictionary<InjectionIdentification, InjectionConstructor> = new Dictionary<InjectionIdentification, InjectionConstructor>();
    private static readonly mSingletonMapping: Dictionary<InjectionIdentification, object> = new Dictionary<InjectionIdentification, object>();

    private static mCurrentInjectionContext: Dictionary<InjectionIdentification, any> | null = null;

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
    public static createObject<T extends object>(pConstructor: InjectionConstructor<T>, pForceCreate?: boolean): T;
    public static createObject<T extends object>(pConstructor: InjectionConstructor<T>, pLocalInjections?: Dictionary<InjectionConstructor, any>): T;
    public static createObject<T extends object>(pConstructor: InjectionConstructor<T>, pForceCreate?: boolean, pLocalInjections?: Dictionary<InjectionConstructor, any>): T;
    public static createObject<T extends object>(pConstructor: InjectionConstructor<T>, pForceCreateOrLocalInjections?: boolean | Dictionary<InjectionConstructor, any>, pLocalInjections?: Dictionary<InjectionConstructor, any>): T {
        // Decide between local injection or force creation parameter.
        const [lForceCreate, lLocalInjectionConstructors] = (() => {
            if (typeof pForceCreateOrLocalInjections === 'object' && pForceCreateOrLocalInjections !== null) {
                return [false, pForceCreateOrLocalInjections];
            }

            return [!!pForceCreateOrLocalInjections, pLocalInjections ?? new Dictionary<InjectionConstructor, any>()];
        })();

        // Convert local injections from constructor to identification.
        const lLocalInjections: Dictionary<InjectionIdentification, any> = new Dictionary<InjectionIdentification, any>(
            // Convert [constructor, object] pair to an [identification, object] pair.
            lLocalInjectionConstructors.map((pValue, pKey) => [Injection.getInjectionIdentification(pKey), pValue])
        );

        // Save old injection context.
        const lOldInjectionContext: Dictionary<InjectionIdentification, any> | null = Injection.mCurrentInjectionContext;

        // Merge new local injection context with old one.
        const lNewInjectionContext: Dictionary<InjectionIdentification, any> = new Dictionary<InjectionIdentification, any>([
            ...(lOldInjectionContext?.entries() ?? []),
            ...lLocalInjections.entries()
        ]);

        // Set new injection context.
        Injection.mCurrentInjectionContext = lNewInjectionContext;
        try {
            // Find identifier for constructor and check if it is registered.
            const lConstructorIdentification: InjectionIdentification = Injection.getInjectionIdentification(pConstructor);
            if (!Injection.mInjectableConstructor.has(lConstructorIdentification)) {
                throw new Exception(`Constructor "${pConstructor.name}" is not registered for injection and can not be build`, Injection);
            }

            // Get injection mode. Allways defaultsa to instanced, when force created.
            const lInjectionMode: InjectMode = !lForceCreate ? Injection.mInjectMode.get(lConstructorIdentification)! : 'instanced';

            // Return cached singleton object if not forced to create a new one.
            if (!lForceCreate && lInjectionMode === 'singleton' && Injection.mSingletonMapping.has(lConstructorIdentification)) {
                return <T>Injection.mSingletonMapping.get(lConstructorIdentification);
            }

            // Create object. The usage of Injection.use() handles the actual type injection.
            const lCreatedObject: T = <T>new pConstructor();

            // Cache singleton objects but only if not forced to create.
            if (lInjectionMode === 'singleton' && !Injection.mSingletonMapping.has(lConstructorIdentification)) {
                Injection.mSingletonMapping.add(lConstructorIdentification, lCreatedObject);
            }

            // Return created object.
            return lCreatedObject;
        } finally {
            // Reset old injection context.
            Injection.mCurrentInjectionContext = lOldInjectionContext;
        }
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
    public static registerInjectable(pConstructor: InjectionConstructor, pMetaDataObject: DecoratorMetadataObject, pMode: InjectMode): void {
        // Get unique identification for constructor.
        const lConstructorIdentification: InjectionIdentification = Injection.getInjectionIdentification(pConstructor, pMetaDataObject);

        // Map constructor.
        Injection.mInjectableConstructor.add(lConstructorIdentification, pConstructor);
        Injection.mInjectMode.add(lConstructorIdentification, pMode);
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
        // Find original registered original.
        const lOriginalIdentification: InjectionIdentification = Injection.getInjectionIdentification(pOriginalConstructor);
        if (!Injection.mInjectableConstructor.has(lOriginalIdentification)) {
            throw new Exception('Original constructor is not registered.', Injection);
        }

        // Find replacement registered original.
        const lReplacementIdentification: InjectionIdentification = Injection.getInjectionIdentification(pReplacementConstructor);
        if (!Injection.mInjectableConstructor.has(lReplacementIdentification)) {
            throw new Exception('Replacement constructor is not registered.', Injection);
        }

        // Register replacement.
        Injection.mInjectableReplacement.set(lOriginalIdentification, pReplacementConstructor);
    }

    /**
     * Use a type as injection target.
     * 
     * @param pConstructor - Constructor that should be injected.
     * 
     * @returns new instance of {@link pConstructor}. 
     * 
     * @example Adding a new and existing key.
     * ```TypeScript
     * @Injector.Injectable
     * class Foo {}
     * 
     * @Injector.Injectable
     * class Bar { public constructor(pFoo = Injection.use(Foo)) {} }
     * ```
     */
    public static use<T extends object>(pConstructor: InjectionConstructor<T>): T {
        // Restrict usage to an active injection context.
        if (Injection.mCurrentInjectionContext === null) {
            throw new Exception(`Can't create object outside of an injection context.`, Injection);
        }

        // Get unique identification for constructor.
        const lConstructorIdentification: InjectionIdentification = Injection.getInjectionIdentification(pConstructor);

        // If a replacement in the current injection context is found, use it.
        if (Injection.mCurrentInjectionContext.has(lConstructorIdentification)) {
            return Injection.mCurrentInjectionContext.get(lConstructorIdentification);
        }

        // Read injection from replacement context.
        let lConstructor: InjectionConstructor<T> | null = Injection.mInjectableReplacement.get(lConstructorIdentification) as InjectionConstructor<T>;

        // When no constructor was found, try to find it in global context.
        if (!lConstructor) {
            lConstructor = Injection.mInjectableConstructor.get(lConstructorIdentification) as InjectionConstructor<T>;
        }

        // Throw exception when constructor is not registered.
        if (!lConstructor) {
            throw new Exception(`Constructor "${pConstructor.name}" is not registered for injection and can not be build`, Injection);
        }

        // Create object.
        return Injection.createObject<T>(lConstructor);
    }

    /**
     * Get a unique identification for a constructor.
     * When a constructor is replaced by a decorator, all constructors should have the same identification.
     * 
     * @param pConstructor - Constructor.
     * 
     * @returns unique identification for constructor. 
     */
    private static getInjectionIdentification(pConstructor: InjectionConstructor, pMetadata?: DecoratorMetadataObject): InjectionIdentification {
        // Injection target must have an own metadata object.
        if (!pMetadata && !Object.hasOwn(pConstructor, Symbol.metadata)) {
            throw new Exception(`Constructor must have attached decorators to be used for injection.`, Injection);
        }
        
        // Get the prefered metadata object.
        let lDecoratorMetadataObject: DecoratorMetadataObject = pMetadata ?? pConstructor[Symbol.metadata]!;
        
        // Read metadata from constructor.
        const lMetadata: ConstructorMetadata = Metadata.forInternalDecorator(lDecoratorMetadataObject);
        let lIdentification: InjectionIdentification | null = lMetadata.getMetadata(Injection.mInjectionConstructorIdentificationMetadataKey);

        // Create new metadata object and assign it to decorator metadata.
        if (!lIdentification) {
            lIdentification = Symbol(pConstructor.name);
            lMetadata.setMetadata(Injection.mInjectionConstructorIdentificationMetadataKey, lIdentification);
        }

        return lIdentification;
    }
}

type InjectionIdentification = symbol;

export type InjectMode = 'singleton' | 'instanced';