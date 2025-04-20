export class ModuleFile {
    private mFileBuffer: ArrayBuffer | SharedArrayBuffer;

    public constructor(pFileBuffer: ArrayBuffer | SharedArrayBuffer) {
        this.mFileBuffer = pFileBuffer;
        
    }

    public update() {
        // TODO: Update array buffer slices.
    }
}