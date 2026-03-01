import { FileSystem, FileSystemReferenceType } from "@kartoffelgames/web-file-system";
import { GameComponentItem } from "../core/component/game-component-item.ts";

@FileSystem.fileClass('84045c8b-8626-4452-877b-2bcba2a7fe37', FileSystemReferenceType.Singleton)
export class Shader extends GameComponentItem {
    /**
     * System instance with default values (empty shader code = default PBR).
     * This instance is immutable and cannot be modified.
     */
    public static readonly SYSTEM_INSTANCE: Shader = (() => {
        const lInstance: Shader = new Shader();
        lInstance.markAsSystem();
        return lInstance;
    })();

    private mShaderCode: string;

    /**
     * Shader code as a string.
     */
    @FileSystem.fileProperty()
    public get shaderCode(): string {
        return this.mShaderCode;
    } set shaderCode(pValue: string) {
        this.systemgate();

        this.mShaderCode = pValue;
        this.update();
    }

    /**
     * Constructor of the shader component item.
     */
    public constructor() {
        super("Shader");

        this.mShaderCode = "";
    }
}