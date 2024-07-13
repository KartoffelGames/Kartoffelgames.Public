import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration';
import '../../utility/chai-helper';
import '../../utility/request-animation-frame-mock-session';

describe('PwbAppComponent', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });
});