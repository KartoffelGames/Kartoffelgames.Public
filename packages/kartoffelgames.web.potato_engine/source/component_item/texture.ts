import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import { GameComponentItem } from '../core/component/game-component-item.ts';


@FileSystem.fileClass('90bbb953-b8b5-4632-b6a6-19be9b03c8c1', FileSystemReferenceType.Singleton)
export class Texture extends GameComponentItem {
    private mImageData: ArrayBuffer;

    /**
     * Image file data as an array buffer.
     */
    @FileSystem.fileProperty()
    public get imageData(): ArrayBuffer {
        return this.mImageData;
    } set imageData(pValue: ArrayBuffer) {
        this.mImageData = pValue;
        this.update();
    }

    /**
     * Constructor of the texture component item.
     */
    public constructor() {
        super('Texture');

        this.mImageData = new ArrayBuffer(0);
    }
}