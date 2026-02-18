import { Exception, type IVoidParameterConstructor } from '@kartoffelgames/core';
import { Metadata } from '@kartoffelgames/core-dependency-injection';
import type { InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { PropertyMetaMetadata } from './property-meta-metadata.ts';
import { type PropertyMetaDescriptor, NumberType } from './property-meta-type.ts';

/**
 * Static class providing decorators for annotating class properties with UI meta information.
 * A UI system can read these annotations at runtime to auto-generate editor controls.
 */
export class PropertyMeta {
    private static readonly mMetadataKey: symbol = Symbol('PropertyMetaMetadata');

    /**
     * Property decorator. Marks a property as a boolean toggle.
     *
     * @returns property decorator function.
     */
    public static boolean<TThis extends object>(): (_pTarget: any, pContext: PropertyMetaDecoratorContext<TThis>) => void {
        return PropertyMeta.createDecorator<TThis>({ type: 'boolean' });
    }

    /**
     * Property decorator. Marks a property as a color picker.
     *
     * @returns property decorator function.
     */
    public static color<TThis extends object>(): (_pTarget: any, pContext: PropertyMetaDecoratorContext<TThis>) => void {
        return PropertyMeta.createDecorator<TThis>({ type: 'color' });
    }

    /**
     * Property decorator. Marks a property as an enum dropdown.
     *
     * @param pEnumType - The TypeScript enum object to use for the dropdown values.
     *
     * @returns property decorator function.
     */
    public static enum<TThis extends object>(pEnumType: object): (_pTarget: any, pContext: PropertyMetaDecoratorContext<TThis>) => void {
        return PropertyMeta.createDecorator<TThis>({ type: 'enum', enumType: pEnumType });
    }

    /**
     * Property decorator. Marks a property as a number input.
     *
     * @param pMin - Minimum allowed value.
     * @param pMax - Maximum allowed value.
     * @param pNumberType - Whether the input accepts float or integer values.
     *
     * @returns property decorator function.
     */
    public static number<TThis extends object>(pMin: number, pMax: number, pNumberType: NumberType): (_pTarget: any, pContext: PropertyMetaDecoratorContext<TThis>) => void {
        return PropertyMeta.createDecorator<TThis>({ type: 'number', min: pMin, max: pMax, numberType: pNumberType });
    }

    /**
     * Property decorator. Marks a property as an object reference link.
     *
     * @param pTargetClass - The class type that this property references.
     *
     * @returns property decorator function.
     */
    public static objectLink<TThis extends object>(pTargetClass: object): (_pTarget: any, pContext: PropertyMetaDecoratorContext<TThis>) => void {
        return PropertyMeta.createDecorator<TThis>({ type: 'objectLink', targetClass: pTargetClass });
    }

    /**
     * Get property meta metadata for a constructor.
     *
     * @param pConstructor - The constructor to look up.
     *
     * @returns the property meta metadata, or null if no properties are annotated.
     */
    public static of(pConstructor: IVoidParameterConstructor<object>): PropertyMetaMetadata | null {
        return Metadata.get(pConstructor).getMetadata<PropertyMetaMetadata>(PropertyMeta.mMetadataKey);
    }

    /**
     * Property decorator. Marks a property as a range slider.
     *
     * @param pMin - Minimum slider value.
     * @param pMax - Maximum slider value.
     * @param pNumberType - Whether the slider steps in float or integer increments.
     *
     * @returns property decorator function.
     */
    public static range<TThis extends object>(pMin: number, pMax: number, pNumberType: NumberType): (_pTarget: any, pContext: PropertyMetaDecoratorContext<TThis>) => void {
        return PropertyMeta.createDecorator<TThis>({ type: 'range', min: pMin, max: pMax, numberType: pNumberType });
    }

    /**
     * Property decorator. Marks a property as a text input.
     *
     * @returns property decorator function.
     */
    public static text<TThis extends object>(): (_pTarget: any, pContext: PropertyMetaDecoratorContext<TThis>) => void {
        return PropertyMeta.createDecorator<TThis>({ type: 'text' });
    }

    /**
     * Property decorator. Marks a property as a vector editor with N dimensions.
     *
     * @param pDimensions - Number of vector elements.
     *
     * @returns property decorator function.
     */
    public static vector<TThis extends object>(pDimensions: number): (_pTarget: any, pContext: PropertyMetaDecoratorContext<TThis>) => void {
        return PropertyMeta.createDecorator<TThis>({ type: 'vector', dimensions: pDimensions });
    }

    /**
     * Creates the actual decorator function for a given property meta descriptor.
     *
     * @param pDescriptor - The property meta descriptor to store.
     *
     * @returns property decorator function.
     */
    private static createDecorator<TThis extends object>(pDescriptor: PropertyMetaDescriptor): (_pTarget: any, pContext: PropertyMetaDecoratorContext<TThis>) => void {
        return (_pTarget: any, pContext: PropertyMetaDecoratorContext<TThis>): void => {
            // Validate non-static.
            if (pContext.static) {
                throw new Exception('@PropertyMeta decorators are not supported for static members.', _pTarget);
            }

            // Validate string property name.
            if (typeof pContext.name !== 'string') {
                throw new Exception('@PropertyMeta decorators require a string property name.', _pTarget);
            }

            // Get or create constructor metadata.
            const lConstructorMetadata = Metadata.forInternalDecorator(pContext.metadata);

            // Get or create property meta metadata for this class.
            let lPropertyMetaMetadata: PropertyMetaMetadata | null = lConstructorMetadata.getMetadata<PropertyMetaMetadata>(PropertyMeta.mMetadataKey);
            if (lPropertyMetaMetadata === null) {
                lPropertyMetaMetadata = new PropertyMetaMetadata();
                lConstructorMetadata.setMetadata(PropertyMeta.mMetadataKey, lPropertyMetaMetadata);
            }

            // Register the property descriptor.
            lPropertyMetaMetadata.addProperty(pContext.name, pDescriptor);
        };
    }
}

/**
 * Union of all decorator contexts that @PropertyMeta decorators support.
 */
type PropertyMetaDecoratorContext<TThis extends object> =
    | ClassFieldDecoratorContext<TThis>
    | ClassGetterDecoratorContext<TThis>
    | ClassSetterDecoratorContext<TThis>
    | ClassAccessorDecoratorContext<TThis>;
