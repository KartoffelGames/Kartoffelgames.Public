import { ByteUtil } from "@kartoffelgames/core";
import { ModuleFileBoundingState } from "./module-file-bounding-state.ts";

export class ModuleFile {
    private mFileBuffer: SharedArrayBuffer;
    private mFileBufferBoundState: ModuleFileBoundingState;

    public constructor(pFileBuffer: SharedArrayBuffer) {
        this.mFileBuffer = pFileBuffer;

        this.mFileBufferBoundState = new ModuleFileBoundingState();
    }

    public update() {
        // TODO: Update array buffer slices.
    }

    /**
     * Read the song name from the file buffer.
     * 
     * @param pBuffer - File buffer to read from.
     * @param pBoundingState - Bounding state of the file buffer.
     * 
     * @returns the song name.
     * 
     * @remarks update the bounding state with the song name length.
     */
    private readSongName(pBuffer: ArrayBuffer, pBoundingState: ModuleFileBoundingState): string {
        // Read the first byte of the buffer to determine the length of the song name.
        const lSongNameLength: number = new DataView(pBuffer,
            pBoundingState.name.lengthByte.start,
            pBoundingState.name.lengthByte.length,
        ).getUint8(0);

        // Update the bounding state with the song name length.
        pBoundingState.name.data.length = lSongNameLength;

        // Create a new Uint8Array view of the buffer to read the song name.
        const lSongNameBuffer: Uint8Array = new Uint8Array(pBuffer, 
            pBoundingState.name.data.start,
            pBoundingState.name.data.length,
        );

        // Convert the Uint8Array to a string using TextDecoder.
        return ByteUtil.byteToString(lSongNameBuffer, 0);
    }
}