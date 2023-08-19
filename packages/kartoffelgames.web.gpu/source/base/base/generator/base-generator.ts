import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuObject } from '../gpu/gpu-object';
import { BaseShaderInterpreter } from '../shader/interpreter/base-shader-interpreter';

export abstract class BaseGenerator {
    private readonly mDestructors: Dictionary<GpuObjectConstructor, DestructorFunction<GpuObject, object>>;
    private readonly mGenerators: Dictionary<GpuObjectConstructor, GeneratorFunction<GpuObject, object>>;
    private readonly mObjectCache: WeakMap<GpuObject, object>;
    private readonly mShaderInterpreter: BaseShaderInterpreter;

    /**
     * Shader interpreter.
     */
    public get shaderInterpreter(): BaseShaderInterpreter {
        return this.mShaderInterpreter;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mObjectCache = new WeakMap<GpuObject, object>();
        this.mDestructors = new Dictionary<GpuObjectConstructor, DestructorFunction<GpuObject, object>>();
        this.mGenerators = new Dictionary<GpuObjectConstructor, GeneratorFunction<GpuObject, object>>();

        // Create interpreter.
        this.mShaderInterpreter = this.createShaderInterpreter();
    }

    /**
     * Generate native.
     * @param pBaseObject - Base gpu object.
     */
    public generate<TObject extends GpuObject, TNative extends object>(pBaseObject: TObject): ReturnType<GeneratorFunction<TObject, TNative>> {
        // Get and validate generator function.
        const lGenerator: GeneratorFunction<TObject, TNative> | undefined = <GeneratorFunction<TObject, TNative> | undefined>this.mGenerators.get(<GpuObjectConstructor>pBaseObject.constructor);
        if (!lGenerator) {
            throw new Exception(`No generator for type "${pBaseObject.constructor.name}" defined`, this);
        }

        // Use cached objects if they are still valid.
        if (this.mObjectCache.has(pBaseObject)) {
            return <TNative>this.mObjectCache.get(pBaseObject);
        }

        // Generate and cache new object.
        const lNativeObject: TNative = lGenerator(pBaseObject);
        this.mObjectCache.set(pBaseObject, lNativeObject);

        return lNativeObject;
    }

    /**
     * Invalidate object.
     * @param pBaseObject 
     */
    public invalidate<TObject extends GpuObject>(pBaseObject: TObject): void {
        // Deconstruct native object.
        if (this.mObjectCache.has(pBaseObject)) {
            const lNative = this.mObjectCache.get(pBaseObject)!;

            // Get and validate destructor function.
            const lDestructor: DestructorFunction<TObject, object> | undefined = <GeneratorFunction<TObject, object> | undefined>this.mDestructors.get(<GpuObjectConstructor>pBaseObject.constructor);
            if (!lDestructor) {
                throw new Exception(`No destructor for type "${pBaseObject.constructor.name}" defined`, this);
            }

            // Destructor.
            lDestructor(pBaseObject, lNative);

            // Delete cached value.
            this.mObjectCache.delete(pBaseObject);
        }
    }

    /**
     * Register an generatpr for this type.
     * @param pObjectConstructor - Base gpu object type.
     * @param pGeneratorFunction - Generator for this type.
     */
    protected registerDestructor<TObject extends GpuObject, TNative extends object>(pObjectConstructor: GpuObjectConstructor<TObject>, pDestructorFunction: DestructorFunction<TObject, TNative>): void {
        this.mDestructors.set(pObjectConstructor, <any>pDestructorFunction);
    }

    /**
     * Register an generatpr for this type.
     * @param pObjectConstructor - Base gpu object type.
     * @param pGeneratorFunction - Generator for this type.
     */
    protected registerGenerator<TObject extends GpuObject, TNative extends object>(pObjectConstructor: GpuObjectConstructor<TObject>, pGeneratorFunction: GeneratorFunction<TObject, TNative>): void {
        this.mGenerators.set(pObjectConstructor, <any>pGeneratorFunction);
    }

    /**
     * Init gpu device.
     */
    public abstract init(): Promise<this>;

    /**
     * Create generator for interpreting shaders.
     */
    protected abstract createShaderInterpreter(): BaseShaderInterpreter;
}


// eslint-disable-next-line @typescript-eslint/ban-types
type GpuObjectConstructor<TObject extends GpuObject = GpuObject> = Function & {
    prototype: TObject;
    new: (...pArgs: any) => TObject;
};

type GeneratorFunction<TObject extends GpuObject, TNative extends object> = (pBaseObject: TObject) => TNative;
type DestructorFunction<TObject extends GpuObject, TNative extends object> = (pBaseObject: TObject, pNativeObject: TNative) => void;
