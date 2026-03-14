import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import { GameComponentItem } from '../core/component/game-component-item.ts';
import { Shader } from './shader.ts';
import type { Texture } from './texture.ts';

/**
 * Component item that holds material properties for rendering.
 * Combines a shader with named bindings for the shader's User group.
 */
@FileSystem.fileClass('f5a1c3e7-9b2d-4f8a-ae6c-d1f3b5e7a9c2', FileSystemReferenceType.Instanced)
export class Material extends GameComponentItem {
    /**
     * System instance with default values (default PBR shader + empty bindings).
     * This instance is immutable and cannot be modified.
     */
    public static readonly SYSTEM_INSTANCE: Material = (() => {
        const lInstance: Material = new Material();
        lInstance.markAsSystem();
        return lInstance;
    })();

    private mBindings: Map<string, MaterialBindingValue>;
    private mShader: Shader;

    /**
     * PGSL shader used for rendering. Empty shader code uses the default PBR shader.
     */
    @FileSystem.fileProperty()
    public get shader(): Shader {
        return this.mShader;
    } set shader(pValue: Shader) {
        this.systemgate();

        this.mShader.unlinkParent(this);
        this.mShader = pValue;
        this.mShader.linkParent(this);
        this.update();
    }

    /**
     * Iterator over binding names set on this material.
     * Only used for serialization, as the shader's User group defines the available bindings and their types.
     */
    @FileSystem.fileProperty()
    protected get userValues(): Map<string, MaterialBindingValue> {
        return this.mBindings;
    } protected set userValues(pValue: Map<string, MaterialBindingValue>) {
        this.systemgate();

        // Clear and reapply specified user values.
        this.mBindings = pValue;

        this.update();
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Material');

        this.mBindings = new Map<string, MaterialBindingValue>();

        this.mShader = Shader.SYSTEM_INSTANCE;
        this.mShader.linkParent(this);
    }

    /**
     * Get a binding value by name.
     *
     * @param pName - The PGSL binding name.
     *
     * @returns The binding value, or undefined if not set.
     */
    public getBinding(pName: string): MaterialBindingValue | undefined {
        return this.mBindings.get(pName);
    }

    /**
     * Set a binding value by name.
     * The name must match a binding name in the shader's User group.
     *
     * @param pName - The PGSL binding name.
     * @param pValue - The binding value.
     */
    public setBinding(pName: string, pValue: MaterialBindingValue): void {
        this.systemgate();

        this.mBindings.set(pName, pValue);
        this.update(pName);
    }
}

/**
 * Supported value types for material bindings.
 * Each value maps to a shader User group binding by name.
 */
export type MaterialBindingValue = ArrayBuffer | Texture;
