import { Exception } from '@kartoffelgames/core.data';
import { DecorationReplacementHistory } from '../decoration-history/decoration-history';
import { Metadata } from '../metadata/metadata';
import { InjectionConstructor } from '../type';

/**
 * Initializes global metadata reflection functionality of typescript.
 * Adds {@link Reflect.metadata} and {@link Reflect.decorate} function to the global {@link Reflect} object.
 * These functions are used by Typescript to inject type information on compile time.
 * 
 * @internal
 */
export class ReflectInitializer {
    private static mExported: boolean = false;

    /**
     * Initializes global defintions for decorate and metadata into the Reflect object.
     */
    public static initialize(): void {
        if (!ReflectInitializer.mExported) {
            ReflectInitializer.mExported = true;

            ReflectInitializer.export('decorate', ReflectInitializer.decorate);
            ReflectInitializer.export('metadata', ReflectInitializer.metadata);
        }
    }

    /**
     * Decorate class, method, parameter or property.
     * 
     * @param pDecoratorList - List of decorators.
     * @param pTarget - Target for decorator.
     * @param pPropertyKey - Key of property on member decorator.
     * @param pDescriptor - Descriptor of member on member decorator.
     */
    private static decorate(pDecoratorList: Array<Decorator>, pTarget: any, pPropertyKey?: string | symbol, pDescriptor?: TypedPropertyDescriptor<any>): any {
        let lDecoratorResult: any;
        if (pPropertyKey && pDescriptor) {
            // Decorate accessor, function. Returns new descriptor.
            lDecoratorResult = ReflectInitializer.decorateMethod(<Array<MethodDecorator>>pDecoratorList, pTarget, pPropertyKey, pDescriptor);
        } else if (pPropertyKey && !pDescriptor) {
            // Decorate property or parameter. Has no return value.
            ReflectInitializer.decorateProperty(<Array<PropertyDecorator | ParameterDecorator>>pDecoratorList, pTarget, pPropertyKey);
            lDecoratorResult = null; // Is ignored.
        } else { // Only target set.
            // Decorate class. Returns replacement class.
            lDecoratorResult = ReflectInitializer.decorateClass(<Array<ClassDecorator>>pDecoratorList, <InjectionConstructor>pTarget);
        }

        return lDecoratorResult;
    }

    /**
     * Decorate class.
     * 
     * @param pDecoratorList - Decorators.
     * @param pConstructor - Target constructor.
     */
    private static decorateClass(pDecoratorList: Array<ClassDecorator>, pConstructor: InjectionConstructor): InjectionConstructor {
        let lCurrentConstrutor: InjectionConstructor = pConstructor;

        // Run all metadata decorator first.
        for (const lDecorator of pDecoratorList) {
            if ((<Decorator>lDecorator).isMetadata) {
                // Metadata decorator doesn't return values.
                lDecorator(pConstructor);
            }
        }

        // For each decorator included metadata decorator.
        for (const lDecorator of pDecoratorList) {
            // If the decorator was a metadata decorator use the original class as target.
            if (!(<Decorator>lDecorator).isMetadata) {
                // Execute decorator.
                const lNewConstructor = lDecorator(pConstructor);

                // Check if decorator does return different class.
                if (!!lNewConstructor && lNewConstructor !== lCurrentConstrutor) {
                    if (typeof lNewConstructor === 'function') {
                        // Add changed construtor to the decoration history.
                        DecorationReplacementHistory.add(lCurrentConstrutor, lNewConstructor);
                        lCurrentConstrutor = lNewConstructor;
                    } else {
                        throw new Exception('Constructor decorator does not return supported value.', lDecorator);
                    }
                }
            }
        }

        return lCurrentConstrutor;
    }

    /**
     * Decorate method or accessor.
     * 
     * @param pDecoratorList - Decorators.
     * @param pTarget - Is on instanced target the prototype and on static the constructor.s
     * @param pPropertyKey - Key of property decorator. 
     * @param pDescriptor - Descriptor of property
     */
    private static decorateMethod(pDecoratorList: Array<MethodDecorator>, pTarget: object, pPropertyKey: string | symbol, pDescriptor: TypedPropertyDescriptor<any> | undefined): PropertyDescriptor | undefined {
        let lCurrentDescriptor: TypedPropertyDescriptor<any> = <TypedPropertyDescriptor<any>>pDescriptor;

        // For each decorator.
        for (const lDecorator of pDecoratorList) {
            // Execute decorator.
            const lDecoratedMember = lDecorator(pTarget, pPropertyKey, lCurrentDescriptor);

            // Check if decorator does return different PropertyDescriptor.
            if (lDecoratedMember) {
                if (typeof lDecoratedMember === 'object') {
                    lCurrentDescriptor = lDecoratedMember;
                } else {
                    throw new Exception('Member decorator does not return supported value.', lDecorator);
                }
            }
        }

        return lCurrentDescriptor;
    }

    /**
     * Decorate property or parameter.
     * 
     * @param pDecoratorList - Decorators.
     * @param pTarget - Is on instanced target the prototype and on static the constructor.s
     * @param pPropertyKey - Key of property decorator. 
     */
    private static decorateProperty(pDecoratorList: Array<PropertyDecorator | ParameterDecorator>, pTarget: object, pPropertyKey: string | symbol): void {
        // For each decorator.
        for (const lDecorator of pDecoratorList) {
            // Execute decorator. Doesn't return any value.
            lDecorator(pTarget, pPropertyKey, <any>undefined); // Index number gets overriden for parameter decorator.
        }
    }

    /**
     * Export property into Reflect object.
     * 
     * @param pKey - Key of property.
     * @param pValue - Value of property.
     */
    private static export<T>(pKey: string, pValue: T) {
        // Find root for accessing Reflect.
        /* istanbul ignore next */
        const lRoot: any = typeof window === 'object' ? window : global;

        // Set target as Reflect of root. (window or global).
        const lTarget: typeof Reflect = lRoot.Reflect;

        Object.defineProperty(lTarget, pKey, { configurable: true, writable: true, value: pValue });
    }

    /**
     * Entry point for Typescripts emitDecoratorMetadata data. 
     * 
     * @param pMetadataKey - Key of metadata.
     * @param pMetadataValue - Value of metadata. Usually only "design:paramtypes" data.
     */
    private static metadata(pMetadataKey: string, pMetadataValue: any): Decorator {
        /*
            Typescript injected metadata. __metadata is called as decorator and calls this metadata function.
            
           __metadata("design:type", Function), // Parameter Value
           __metadata("design:paramtypes", [Number, String]), // Function or Constructor Parameter
           __metadata("design:returntype", void 0) // Function return type.
        */
        const lResultDecorator: Decorator = (pTarget: object, pProperty?: string | symbol): void => {
            // Get constructor from prototype if is an instanced member.
            let lConstructor: InjectionConstructor;
            if (typeof pTarget !== 'function') {
                lConstructor = <InjectionConstructor>(<object>pTarget).constructor;
            } else {
                lConstructor = <InjectionConstructor>pTarget;
            }

            // Set metadata for property or class.
            if (pProperty) {
                Metadata.get(lConstructor).getProperty(pProperty).setMetadata(pMetadataKey, pMetadataValue);
            } else {
                Metadata.get(lConstructor).setMetadata(pMetadataKey, pMetadataValue);
            }
        };

        // Set as metadata constructor and return.
        lResultDecorator.isMetadata = true;
        return lResultDecorator;
    }
}

/**
 * Allround decorator with custom isMetadata property.
 */
type Decorator = (ClassDecorator | PropertyDecorator | MethodDecorator | ParameterDecorator) & { isMetadata: boolean; };


// Global definition for reflect metadata and decorate functions.
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Reflect {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        function decorate(pDecoratorList: Array<Decorator>, pTarget: any, pPropertyKey?: string | symbol, pDescriptor?: TypedPropertyDescriptor<any>): any

        // eslint-disable-next-line @typescript-eslint/naming-convention
        function metadata(pMetadataKey: string, pMetadataValue: any): Decorator;
    }
}