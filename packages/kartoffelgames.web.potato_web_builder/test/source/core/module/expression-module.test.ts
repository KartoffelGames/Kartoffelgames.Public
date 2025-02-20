import { before, describe } from '@std/testing/bdd';
import { PwbConfiguration } from '../../../../source/core/configuration/pwb-configuration.ts';
import '../../../utility/request-animation-frame-mock-session.ts';

describe('Custom Module', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });
});