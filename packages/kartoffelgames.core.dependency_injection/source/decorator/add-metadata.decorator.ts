import { Metadata } from "../index.ts";
import { ConstructorMetadata } from "../metadata/constructor-metadata.ts";
import { PropertyMetadata } from "../metadata/property-metadata.ts";
import { InjectionConstructor, InjectionInstance } from "../type.ts";

/**
 * AtScript.
 * Add metadata to class, method, accessor or property
 * 
 * @param pMetadataKey - Key of metadata.
 * @param pMetadataValue - Value of metadata.
 */
export function AddMetadata<TThis extends object, TValue = any>(pMetadataKey: string, pMetadataValue: TValue) {
    return (pOriginalTarget: any, pContext: AllClassDecoratorContext<InjectionConstructor<TThis>>): void => {
        // Set for any kind.
        switch (pContext.kind) {
            case 'class':
                Metadata.get(pOriginalTarget).setMetadata(pMetadataKey, pMetadataValue);
                return;
            case 'accessor':
            case 'method':
            case 'field':
            case 'getter':
            case "setter":
                // Metadata is not allowed for statics.
                if (pContext.static) {
                    throw new Error(`@AddMetadata not supported for statics.`);
                }

                // Set metadata on init.
                pContext.addInitializer(function (this: TThis) {
                    const lConstructorMetadata: ConstructorMetadata = Metadata.get(this.constructor as InjectionConstructor);
                    const lPropertyMetadata: PropertyMetadata = lConstructorMetadata.getProperty(pContext.name);

                    lPropertyMetadata.setMetadata(pMetadataKey, pMetadataValue);
                });
                return;
            default:
                // Fallback. Maybe more things will show up.
                throw new Error(`@AddMetadata not supported for ${(<DecoratorContext>pContext).kind}.`);
        }
    };
}


type AllClassDecoratorContext<TThis extends InjectionConstructor = InjectionConstructor> =
    | ClassDecoratorContext<TThis>
    | ClassMethodDecoratorContext<InjectionInstance<TThis>>
    | ClassGetterDecoratorContext<InjectionInstance<TThis>>
    | ClassSetterDecoratorContext<InjectionInstance<TThis>>
    | ClassFieldDecoratorContext<InjectionInstance<TThis>>
    | ClassAccessorDecoratorContext<InjectionInstance<TThis>>;