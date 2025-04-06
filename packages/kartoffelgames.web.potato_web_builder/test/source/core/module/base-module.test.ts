import { expect } from '@kartoffelgames/core-test';
import { before, describe, it } from '@std/testing/bdd';
import { PwbConfiguration } from '../../../../source/core/configuration/pwb-configuration.ts';
import { ModuleTargetNode } from '../../../../source/core/module/injection_reference/module-target-node.ts';
import { ModuleTemplate } from '../../../../source/core/module/injection_reference/module-template.ts';
import '../../../utility/request-animation-frame-mock-session.ts';

// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';

// Setup global scope.
(() => {
    const lMockDom: JSDOM = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');

    PwbConfiguration.configuration.scope.window = lMockDom.window as unknown as typeof globalThis;
    PwbConfiguration.configuration.scope.document = lMockDom.window.document;
})();

describe('Custom Module', () => {
    before(() => {
        PwbConfiguration.configuration.updating.frameTime = Number.MAX_SAFE_INTEGER;
        PwbConfiguration.configuration.error.print = false;
    });

    it('-- Try to construct ModuleTargetNode', async () => {
        // Process. Create error function.
        const lErrorFunction = () => {
            new ModuleTargetNode();
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('Reference should not be instanced.');
    });

    it('-- Try to construct ModuleTempate', async () => {
        // Process. Create error function.
        const lErrorFunction = () => {
            new ModuleTemplate();
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('Reference should not be instanced.');
    });
});