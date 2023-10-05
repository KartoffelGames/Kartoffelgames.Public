import { Transform } from '../something_better/transform';
import { DebugWindow } from './debug-window';

export class TransformationDebugWindow extends DebugWindow {
    private readonly mTransformation: Transform;

    /**
     * Constructor.
     * @param pTransform - Transform.
     */
    public constructor(pTransform: Transform) {
        super();

        this.mTransformation = pTransform;

        // Scale handler.
        this.addControlNumber('scaleWidth', 'scale', 0.1, 5, (pData) => { this.mTransformation.setScale(pData, null, null); }, () => { return this.mTransformation.scaleWidth; });
        this.addControlNumber('scaleHeight', 'scale', 0.1, 5, (pData) => { this.mTransformation.setScale(null, pData, null); }, () => { return this.mTransformation.scaleHeight; });
        this.addControlNumber('scaleDepth', 'scale', 0.1, 5, (pData) => { this.mTransformation.setScale(null, null, pData); }, () => { return this.mTransformation.scaleDepth; });

        // Translate.
        this.addControlNumber('translateX', 'translate', 0, 100, (pData) => { this.mTransformation.setTranslation(pData, null, null); }, () => { return this.mTransformation.translationX; });
        this.addControlNumber('translateY', 'translate', 0, 100, (pData) => { this.mTransformation.setTranslation(null, pData, null); }, () => { return this.mTransformation.translationY; });
        this.addControlNumber('translateZ', 'translate', 0, 100, (pData) => { this.mTransformation.setTranslation(null, null, pData); }, () => { return this.mTransformation.translationZ; });

        // Rotate.
        this.addControlNumber('rotatePitch', 'rotate', 0, 360, (pData) => { this.mTransformation.setRotation(pData, null, null); }, () => { return this.mTransformation.rotationPitch; });
        this.addControlNumber('rotateYaw', 'rotate', 0, 360, (pData) => { this.mTransformation.setRotation(null, pData, null); }, () => { return this.mTransformation.rotationYaw; });
        this.addControlNumber('rotateRoll', 'rotate', 0, 360, (pData) => { this.mTransformation.setRotation(null, null, pData); }, () => { return this.mTransformation.rotationRoll; });

        // Translate.
        this.addControlNumber('pivotX', 'pivot', 0, 10, (pData) => { this.mTransformation.pivotX = pData; }, () => { return this.mTransformation.pivotX; });
        this.addControlNumber('pivotY', 'pivot', 0, 10, (pData) => { this.mTransformation.pivotY = pData; }, () => { return this.mTransformation.pivotY; });
        this.addControlNumber('pivotZ', 'pivot', 0, 10, (pData) => { this.mTransformation.pivotZ = pData; }, () => { return this.mTransformation.pivotZ; });
    }
}
