import { describe, before } from '@std/testing/bdd';
import { PwbConfiguration } from '../../../source/core/configuration/pwb-configuration.ts';
import '../../utility/request-animation-frame-mock-session.ts';

describe('PwbAppComponent', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });
});