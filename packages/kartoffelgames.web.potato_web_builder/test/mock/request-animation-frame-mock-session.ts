class RequestAnimationFrameMockSession {
    private mCurrentList: Map<number, FrameRequestCallback> = new Map<number, FrameRequestCallback>();
    private mCurrentTimer: number | null = null;

    cancelAnimationFrame(pIdentifier: number) {
        this.mCurrentList.delete(pIdentifier);
    }

    requestAnimationFrame(pCallback: FrameRequestCallback): number {
        const lIdentifier: number = Math.random();

        // Add animation frame.
        this.mCurrentList.set(lIdentifier, pCallback);

        // Create new "frame" timer when not already set. 
        if (this.mCurrentTimer === null) {
            this.mCurrentTimer = <any>globalThis.setTimeout(() => {
                // Save current "frame"-Handler and create a new list for the next "frame".
                const lActiveList = this.mCurrentList;
                this.mCurrentList = new Map<number, FrameRequestCallback>();

                // Setup new timer.
                this.mCurrentTimer = null;

                const lCurrentTime: number = Date.now();

                for (const lFunction of lActiveList.values()) {
                    lFunction(lCurrentTime);
                }
            }, 1);
        }

        return lIdentifier;
    }
}

export const RequestAnimationFrameMock = new RequestAnimationFrameMockSession();

globalThis.requestAnimationFrame = RequestAnimationFrameMock.requestAnimationFrame.bind(RequestAnimationFrameMock);
globalThis.cancelAnimationFrame = RequestAnimationFrameMock.cancelAnimationFrame.bind(RequestAnimationFrameMock);