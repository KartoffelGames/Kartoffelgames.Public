import { PgslAccessModeEnum } from '../../enum/pgsl-access-mode-enum.ts';
import { PgslInterpolateSamplingEnum } from '../../enum/pgsl-interpolate-sampling-enum.ts';
import { PgslInterpolateTypeEnum } from '../../enum/pgsl-interpolate-type-enum.ts';
import { PgslTexelFormatEnum } from '../../enum/pgsl-texel-format-enum.ts';
import { PgslFeatureSetProcessor } from '../../pgsl-feature-set-processor.ts';

/**
 * Core enums of PGSL.
 */
export class PgslCoreEnumFeatureSetProcessor extends PgslFeatureSetProcessor {
    /**
     * Process registration.
     */
    protected override onProcess(): void {
        // Register enums.
        this.registerDeclaration(this.createEnum('AccessMode', PgslAccessModeEnum.VALUES));
        this.registerDeclaration(this.createEnum('InterpolateSampling', PgslInterpolateSamplingEnum.VALUES));
        this.registerDeclaration(this.createEnum('InterpolateType', PgslInterpolateTypeEnum.VALUES));
        this.registerDeclaration(this.createEnum('TexelFormat', PgslTexelFormatEnum.VALUES));
    }
}