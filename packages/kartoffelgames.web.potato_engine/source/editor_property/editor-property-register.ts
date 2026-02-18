/**
 * Accumulates property meta descriptors for a single class.
 * Stores which properties have UI meta annotations and their descriptors.
 */
export class EditorPropertyRegister {
    private readonly mProperties: Map<string, EditorPropertyDescriptor>;

    /**
     * Get all property names that have a property meta descriptor.
     */
    public get propertyNames(): Array<string> {
        return new Array(...this.mProperties.keys());
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mProperties = new Map<string, EditorPropertyDescriptor>();
    }

    /**
     * Add a property meta descriptor for a property.
     *
     * @param pPropertyName - The string key of the property.
     * @param pDescriptor - The property meta descriptor.
     */
    public addProperty(pPropertyName: string, pDescriptor: EditorPropertyDescriptor): void {
        this.mProperties.set(pPropertyName, pDescriptor);
    }

    /**
     * Get the property meta descriptor for a specific property.
     *
     * @param pPropertyName - The property key.
     *
     * @returns the property meta descriptor.
     */
    public getDescriptor(pPropertyName: string): EditorPropertyDescriptor {
        return this.mProperties.get(pPropertyName)!;
    }
}

/**
 * Numeric step type for range and number property metas.
 */
export enum EditorPropertyNumberType {
    Float = 'Float',
    Integer = 'Integer'
}

/**
 * Discriminated union of all property meta descriptors.
 * Each descriptor defines how a UI system should render the editor control for a property.
 */
export type EditorPropertyDescriptor =
    | EditorPropertyRangeDescriptor
    | EditorPropertyNumberDescriptor
    | EditorPropertyObjectLinkDescriptor
    | EditorPropertyObjectDescriptor
    | EditorPropertyBooleanDescriptor
    | EditorPropertyTextDescriptor
    | EditorPropertyEnumDescriptor;

type EditorPropertyRangeDescriptor = { type: 'range'; min: number; max: number; numberType: EditorPropertyNumberType };
type EditorPropertyNumberDescriptor = { type: 'number'; min: number; max: number; numberType: EditorPropertyNumberType };
type EditorPropertyObjectLinkDescriptor = { type: 'objectLink'; linkedClass: object };
type EditorPropertyBooleanDescriptor = { type: 'boolean' };
type EditorPropertyTextDescriptor = { type: 'text' };
type EditorPropertyEnumDescriptor = { type: 'enum'; enumType: object };
type EditorPropertyObjectDescriptor = { type: 'object', targetClass: object };
