import { GameComponent } from "../core/component/game-component.ts";

/**
 * Component representing a render target in the environment.
 * Render targets can be attached to game entities or used as standalone components for core render targets.
 * They define properties such as size, passthrough behavior, and render type that influence how rendering is performed for the associated game entities.
 */
export class RenderTargetComponent extends GameComponent {
    private mWidth: number;
    private mHeight: number;
    private mPassthrough: boolean;
    private mRenderType: RenderTargetRenderType;

    /**
     * Width of the render target in pixels.
     */
    public get width(): number {
        return this.mWidth;
    } set width(pValue: number) {
        this.mWidth = pValue;
    }

    /**
     * Height of the render target in pixels.
     */
    public get height(): number {
        return this.mHeight;
    } set height(pValue: number) {
        this.mHeight = pValue;

        // Signal parent component of the change.
        this.update();
    }

    /**
     * Whether the render target should passthrough game entities to the next render target in the chain.
     */
    public get passthrough(): boolean {
        return this.mPassthrough;
    } set passthrough(pValue: boolean) {
        this.mPassthrough = pValue;

        // Signal parent component of the change.
        this.update();
    }

    /**
     * Render type of the render target, determining which rendering pipeline it participates in.
     */
    public get renderType(): RenderTargetRenderType {
        return this.mRenderType;
    } set renderType(pValue: RenderTargetRenderType) {
        this.mRenderType = pValue;

        // Signal parent component of the change.
        this.update();
    }

    public constructor() {
        super('Render target');

        // Default values.
        this.mWidth = 512;
        this.mHeight = 512;
        this.mPassthrough = false;
        this.mRenderType = RenderTargetRenderType.Forward;
    }
}

export enum RenderTargetRenderType {
    Forward = 'Forward',
    Deferred = 'Deferred'
}