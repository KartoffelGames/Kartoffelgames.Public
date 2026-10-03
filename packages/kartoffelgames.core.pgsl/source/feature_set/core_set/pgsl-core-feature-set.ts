import { PgslFeatureSet } from '../pgsl-feature-set.ts';
import { PgslCoreEnumFeatureSetProcessor } from "./enum/pgsl-core-enum-feature-set-processor.ts";
import { PgslNumericFunctionFeatureSetProcessor } from './function/pgsl-numeric-function-feature-set-processor.ts';
import { PgslPackingFunctionFeatureSetProcessor } from './function/pgsl-pack-function-feature-set-processor.ts';
import { PgslSynchronisationFunctionFeatureSetProcessor } from './function/pgsl-synchronisation-function-feature-set-processor.ts';
import { PgslTextureFunctionFeatureSetProcessor } from './function/pgsl-texture-function-feature-set-processor.ts';
import { PgslFrexpStructFeatureSetConstructor } from './struct/pgsl-frexp-struct-feature-set-processor.ts';
import { PgslModfStructFeatureSetProcessor } from './struct/pgsl-modf-struct-feature-set-processor.ts';

/**
 * Feature set of all build-in declarations every pgsl document has.
 */
export class PgslCoreFeatureSet extends PgslFeatureSet {
    /**
     * Constructor.
     */
    public constructor() {
        super();

        // Register enums.
        this.registerProcessor(PgslCoreEnumFeatureSetProcessor);

        // Register structs. They are registered before the functions, as frexp and modf are required there.
        this.registerProcessor(PgslModfStructFeatureSetProcessor);
        this.registerProcessor(PgslFrexpStructFeatureSetConstructor);

        // Register numeric functions.
        this.registerProcessor(PgslNumericFunctionFeatureSetProcessor);

        // Register texture functions.
        this.registerProcessor(PgslTextureFunctionFeatureSetProcessor);

        // Register packing functions.
        this.registerProcessor(PgslPackingFunctionFeatureSetProcessor);

        // Register synchronisation functions.
        this.registerProcessor(PgslSynchronisationFunctionFeatureSetProcessor);
    }
}
