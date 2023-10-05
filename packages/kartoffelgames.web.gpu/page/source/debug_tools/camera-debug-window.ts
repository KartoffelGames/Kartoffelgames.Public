import { OrthographicProjection } from '../something_better/view_projection/projection/orthographic -projection';
import { PerspectiveProjection } from '../something_better/view_projection/projection/perspective-projection';
import { ViewProjection } from '../something_better/view_projection/view-projection';
import { DebugWindow } from './debug-window';

export class CameraDebugWindow extends DebugWindow {
    private readonly mCamera: ViewProjection;

    /**
     * Constructor.
     * @param pCamera - Camera.
     */
    public constructor(pCamera: ViewProjection) {
        super();

        this.mCamera = pCamera;

        // Add slider inputs.
        // Translate.
        this.addControlNumber('cameraPivotX', 'Translate', 0, 100, (pData) => { this.mCamera.transformation.pivotX = pData; }, () => { return this.mCamera.transformation.pivotX; });
        this.addControlNumber('cameraPivotY', 'Translate', 0, 100, (pData) => { this.mCamera.transformation.pivotY = pData; }, () => { return this.mCamera.transformation.pivotY; });
        this.addControlNumber('cameraPivotZ', 'Translate', 0, 100, (pData) => { this.mCamera.transformation.pivotZ = pData; }, () => { return this.mCamera.transformation.pivotZ; });

        this.addControlNumber('cameraNear', 'Planes', 0, 100, (pData) => { this.mCamera.projection.near = pData; }, () => { return this.mCamera.projection.near; });
        this.addControlNumber('cameraFar', 'Planes', 0, 100, (pData) => { this.mCamera.projection.far = pData; }, () => { return this.mCamera.projection.far; });

        if (this.mCamera.projection instanceof PerspectiveProjection) {
            const lPerspectiveProjection: PerspectiveProjection = this.mCamera.projection;
            this.addControlNumber('cameraAngleOfView', 'Planes', 0, 100, (pData) => { lPerspectiveProjection.angleOfView = pData; }, () => { return lPerspectiveProjection.angleOfView; });
        }

        if (this.mCamera.projection instanceof OrthographicProjection) {
            const lOrthographicProjection: OrthographicProjection = this.mCamera.projection;
            this.addControlNumber('cameraWidth', 'Planes', 0, 100, (pData) => { lOrthographicProjection.width = pData; }, () => { return lOrthographicProjection.width; });
        }
    }
}
