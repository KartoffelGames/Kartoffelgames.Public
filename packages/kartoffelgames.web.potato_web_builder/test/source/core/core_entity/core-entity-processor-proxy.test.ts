import { expect } from '@kartoffelgames/core-test';
import { InteractionZone } from '@kartoffelgames/web-interaction-zone';
import { describe, it } from '@std/testing/bdd';
import { type CoreEntityInteractionEvent, CoreEntityProcessorProxy } from '../../../../source/core/core_entity/interaction-tracker/core-entity-processor-proxy.ts';
import { IgnoreInteractionTracking } from '../../../../source/core/core_entity/interaction-tracker/ignore-interaction-tracking.decorator.ts';
import { UpdateTrigger } from '../../../../source/core/enum/update-trigger.enum.ts';
import { PwbConfiguration } from "../../../../source/core/configuration/pwb-configuration.ts";

// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';

// Setup global scope.
(() => {
    const lMockDom: JSDOM = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');

    PwbConfiguration.configuration.scope.window = lMockDom.window as unknown as typeof globalThis;
    PwbConfiguration.configuration.scope.document = lMockDom.window.document;
})();

describe('CoreEntityProcessorProxy', () => {
    it('Property: proxy', () => {
        // Setup.
        const lOriginalObject: object = { a: 1 };
        const lDetectionProxy: CoreEntityProcessorProxy<object> = new CoreEntityProcessorProxy(lOriginalObject);

        // Process.
        const lProxy: object = lDetectionProxy.proxy;

        // Evaluation.
        expect(lProxy).not.toBe(lOriginalObject);
    });

    describe('Functionality: InteractionZone', () => {
        it('-- Same proxy on double initialization', () => {
            // Setup.
            const lOriginalObject: object = {};

            // Process. First Proxy
            const lFirstInteractionZone: CoreEntityProcessorProxy<object> = new CoreEntityProcessorProxy(lOriginalObject);
            const lFirstProxy: object = lFirstInteractionZone.proxy;

            // Process. First Proxy
            const lSecondInteractionZone: CoreEntityProcessorProxy<object> = new CoreEntityProcessorProxy(lFirstProxy);
            const lSecondProxy: object = lSecondInteractionZone.proxy;

            // Evaluation.
            expect(lFirstProxy).toBe(lSecondProxy);
            expect(lFirstInteractionZone).toBe(lSecondInteractionZone);
        });

        describe('-- SET', () => {
            it('-- Default', () => {
                // Setup.
                const lNewValue: number = 22;
                const lOriginalObject: { a: number; } = { a: 1 };
                const lDetectionProxy: CoreEntityProcessorProxy<{ a: number; }> = new CoreEntityProcessorProxy(lOriginalObject);

                // Process.
                lDetectionProxy.proxy.a = lNewValue;

                // Evaluation.
                expect(lOriginalObject.a).toBe(lNewValue);
            });

            it('-- Correct value in layered property set', () => {
                // Setup.
                const lNewValue: number = 22;
                const lOriginalObject: { a: { b: number; }; } = { a: { b: 1 } };
                const lDetectionProxy: CoreEntityProcessorProxy<{ a: { b: number; }; }> = new CoreEntityProcessorProxy(lOriginalObject);

                // Process.
                lDetectionProxy.proxy.a.b = lNewValue;

                // Evaluation.
                expect(lOriginalObject.a.b).toBe(lNewValue);
            });

            it('-- Correct interacted property name in reason ', () => {
                // Setup.
                const lOriginalObject: { a: number; } = { a: 1 };
                const lDetectionProxy: CoreEntityProcessorProxy<{ a: number; }> = new CoreEntityProcessorProxy(lOriginalObject);
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                    if (pChangeReason.data.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lInteractionZone.execute(() => {
                    lDetectionProxy.proxy.a = 22;
                });

                // Evaluation.
                expect(lPropertyChanged).toBeTruthy();
            });

            it('-- Detect interaction in forwarded this context', () => {
                const lOriginalObject = {
                    a: 0,
                    fun: function () {
                        return this;
                    }
                };
                const lDetectionProxy: CoreEntityProcessorProxy<any> = new CoreEntityProcessorProxy(lOriginalObject);
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                    if (pChangeReason.data.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lInteractionZone.execute(() => {
                    lDetectionProxy.proxy.fun().a = 22;
                });

                // Evaluation.
                expect(lPropertyChanged).toBeTruthy();
            });

            it('-- Correct value in forwarded this context.', () => {
                const lNewValue: number = 22;
                const lOriginalObject = {
                    a: 0,
                    fun: function () {
                        return this;
                    }
                };
                const lDetectionProxy: CoreEntityProcessorProxy<any> = new CoreEntityProcessorProxy(lOriginalObject);

                // Process.
                lDetectionProxy.proxy.fun().a = lNewValue;

                // Evaluation.
                expect(lOriginalObject.a).toBe(lNewValue);
            });

            it('-- Detect interaction in nested callbacks with arrow functions', () => {
                const lNewValue: number = 22;
                const lOriginalObject = {
                    a: 0,
                    fun: function () {
                        return () => {
                            return this;
                        };
                    }
                };
                const lDetectionProxy: CoreEntityProcessorProxy<any> = new CoreEntityProcessorProxy(lOriginalObject);
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                    if (pChangeReason.data.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lInteractionZone.execute(() => {
                    lDetectionProxy.proxy.fun()().a = lNewValue;
                });

                // Evaluation.
                expect(lPropertyChanged).toBeTruthy();
                expect(lOriginalObject.a).toBe(lNewValue);
            });
        });

        describe('-- GET', () => {
            it('-- Primitive', () => {
                // Setup.
                const lValue: number = 22;
                const lOriginalObject: { a: number; } = { a: lValue };
                const lDetectionProxy: CoreEntityProcessorProxy<{ a: number; }> = new CoreEntityProcessorProxy(lOriginalObject);

                // Process.
                const lResultValue: number = lDetectionProxy.proxy.a;

                // Evaluation.
                expect(lResultValue).toBe(lValue);
            });

            it('-- Object', () => {
                // Setup.
                const lValue: object = {};
                const lOriginalObject: { a: object; } = { a: lValue };
                const lDetectionProxy: CoreEntityProcessorProxy<{ a: object; }> = new CoreEntityProcessorProxy(lOriginalObject);

                // Process.
                const lResultValue: object = lDetectionProxy.proxy.a;

                // Evaluation.
                expect(lResultValue).not.toBe(lValue);
                expect(lResultValue).not.toBeDeepEqual(lValue);
            });

            it('-- Function', () => {
                // Setup.
                const lValue: () => void = () => { return; };
                const lOriginalObject: { a: () => void; } = { a: lValue };
                const lDetectionProxy: CoreEntityProcessorProxy<{ a: () => void; }> = new CoreEntityProcessorProxy(lOriginalObject);

                // Process.
                const lResultValue: () => void = lDetectionProxy.proxy.a;

                // Evaluation.
                expect(lResultValue).not.toBe(lValue);
                expect(lResultValue.name).toBe(lValue.name);
            });
        });

        describe('-- DELETE', () => {
            it('-- Deletes correct property in original', () => {
                // Setup.
                const lOriginalObject: { a?: number; } = { a: 1 };
                const lDetectionProxy: CoreEntityProcessorProxy<{ a?: number; }> = new CoreEntityProcessorProxy(lOriginalObject);

                // Process.
                delete lDetectionProxy.proxy.a;

                // Evaluation.
                expect(lOriginalObject.a).toBeUndefined();
            });

            it('-- Detect deletion of correct property', () => {
                // Setup.
                const lOriginalObject: { a?: number; } = { a: 1 };
                const lDetectionProxy: CoreEntityProcessorProxy<{ a?: number; }> = new CoreEntityProcessorProxy(lOriginalObject);
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                    if (pChangeReason.data.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lInteractionZone.execute(() => {
                    delete lDetectionProxy.proxy.a;
                });

                // Evaluation.
                expect(lPropertyChanged).toBeTruthy();
            });
        });

        describe('-- APPLY', () => {
            it('-- Correct return type on function', () => {
                // Setup.
                const lValue: number = 22;
                const lDetectionProxy: CoreEntityProcessorProxy<(pValue: number) => number> = new CoreEntityProcessorProxy((pValue: number) => { return pValue; });
                const lProxy: (pValue: number) => number = lDetectionProxy.proxy;

                // Process.
                const lResultValue: number = lProxy(lValue);

                // Evaluation.
                expect(lResultValue).toBe(lValue);
            });

            it('-- Forward syncron errors on call', () => {
                // Setup.
                const lValue: number = 22;
                const lDetectionProxy: CoreEntityProcessorProxy<() => number> = new CoreEntityProcessorProxy(() => { throw lValue; });
                const lProxy: () => number = lDetectionProxy.proxy;

                // Process.
                let lResultValue: number | null = null;
                try {
                    lProxy();
                } catch (pError) {
                    lResultValue = <number>pError;
                }

                // Evaluation.
                expect(lResultValue).toBe(lValue);
            });

            it('-- Correct return type on asyncron functions', async () => {
                // Setup.
                const lValue: number = 22;
                const lDetectionProxy: CoreEntityProcessorProxy<(pValue: number) => Promise<number>> = new CoreEntityProcessorProxy(async (pValue: number) => { return pValue; });
                const lProxy: (pValue: number) => Promise<number> = lDetectionProxy.proxy;

                // Process.
                const lResultValue: number = await lProxy(lValue);

                // Evaluation.
                expect(lResultValue).toBe(lValue);
            });

            it('-- Forward asyncron errors on call', async () => {
                // Setup.
                const lValue: number = 22;
                const lDetectionProxy: CoreEntityProcessorProxy<() => Promise<number>> = new CoreEntityProcessorProxy(async () => { throw lValue; });
                const lProxy: () => Promise<number> = lDetectionProxy.proxy;

                // Process.
                let lResultValue: number | null = null;
                await lProxy().catch((pError) => { lResultValue = pError; });

                // Evaluation.
                expect(lResultValue).toBe(lValue);
            });

            it('-- Not proxy interaction zones', () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('SameName');
                const lChildObject: object = {};
                const lObject = {
                    zone: lInteractionZone,
                    childObject: lChildObject
                };

                // Process.
                const lProxy = new CoreEntityProcessorProxy(lObject).proxy;

                // Evaluation.
                expect(lProxy.zone).toBe(lInteractionZone);
                expect(lProxy.childObject).not.toBe(lChildObject);
            });

            it('-- Detect interaction on native function.', () => {
                // Setup.
                const lProxy: Set<number> = new CoreEntityProcessorProxy(new Set<number>()).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                    if (pChangeReason.data.source === lProxy) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                lInteractionZone.execute(() => {
                    lProxy.add(1);
                });

                // Evaluation.
                expect(lPropertyChanged).toBeFalsy();
            });
        });

        it('-- getOwnPropertyDescriptor', () => {
            // Setup.
            const lValue: number = 22;
            const lOriginalObject: { a: number; } = { a: lValue };
            const lDetectionProxy: CoreEntityProcessorProxy<{ a: number; }> = new CoreEntityProcessorProxy(lOriginalObject);

            // Process.
            const lResultValue: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(lDetectionProxy.proxy, 'a');

            // Evaluation.
            expect(lResultValue?.value).toBe(lValue);
        });

        it('-- Not dispatch interaction to proxy zone when current zone is silent.', async () => {
            // Setup.
            const lProxyZone: InteractionZone = InteractionZone.current.create('CD')
                .addTriggerRestriction(UpdateTrigger, UpdateTrigger.PropertySet);
            const lSilentZone: InteractionZone = InteractionZone.current.create('CD')
                .addTriggerRestriction(UpdateTrigger, UpdateTrigger.None);

            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: CoreEntityProcessorProxy<{ a: number; }> = new CoreEntityProcessorProxy(lOriginalObject);

            // Setup. Add proxy zone as attached by touching the object.
            lProxyZone.execute(() => {
                return lDetectionProxy.proxy.a;
            });

            // Process.
            let lInteractionCounter: number = 0;
            lProxyZone.addInteractionListener(UpdateTrigger, () => {
                lInteractionCounter++;
            });

            lSilentZone.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            expect(lInteractionCounter).toBe(0);
        });
    });

    describe('Functionality: attachZone', () => {
        it('-- Dispatch interaction to attached zone', async () => {
            // Setup.
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: CoreEntityProcessorProxy<{ a: number; }> = new CoreEntityProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            const lListenerPromise: Promise<void> = new Promise<void>((pResolve) => {
                lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                    if (pChangeReason.data.property === 'a') {
                        pResolve();
                    }
                });
            });

            // Setup. Add proxy zone as attached by touching the object.
            lInteractionZone.execute(() => {
                return lDetectionProxy.proxy.a;
            });

            // Process. Trigger changes.
            lDetectionProxy.proxy.a = 22;

            // Evaluation.
            await lListenerPromise;
        });

        it('-- Dispatch interaction to attached and current zone', async () => {
            // Setup.
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: CoreEntityProcessorProxy<{ a: number; }> = new CoreEntityProcessorProxy(lOriginalObject);
            const lAttachedInteractionZone: InteractionZone = InteractionZone.current.create('CDAttach');
            const lCurrentInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            const lAttachedListenerPromise: Promise<void> = new Promise<void>((pResolve) => {
                lAttachedInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                    if (pChangeReason.data.property === 'a') {
                        pResolve();
                    }
                });
            });
            const lCurrentListenerPromise: Promise<void> = new Promise<void>((pResolve) => {
                lCurrentInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                    if (pChangeReason.data.property === 'a') {
                        pResolve();
                    }
                });
            });

            // Process. Add proxy zone as attached by touching the object.
            lAttachedInteractionZone.execute(() => {
                return lDetectionProxy.proxy.a;
            });

            // Trigger changes.
            lCurrentInteractionZone.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            await lAttachedListenerPromise;
            await lCurrentListenerPromise;
        });

        it('-- Dispatch interaction current and attached zone', async () => {
            // Setup.
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: CoreEntityProcessorProxy<{ a: number; }> = new CoreEntityProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(UpdateTrigger, UpdateTrigger.PropertySet);

            // Setup. InteractionZone.
            let lInteractionCounter: number = 0;
            lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                if (pChangeReason.data.property === 'a') {
                    lInteractionCounter++;
                }
            });
            // Process.
            lInteractionZone.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            expect(lInteractionCounter).toBe(2);
        });

        it('-- Not dispatch interaction to attached zone when changes where made in silent zone.', async () => {
            // Setup.
            const lAttachedZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(UpdateTrigger, UpdateTrigger.PropertySet);
            const lSilentZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(UpdateTrigger, UpdateTrigger.None);

            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: CoreEntityProcessorProxy<{ a: number; }> = new CoreEntityProcessorProxy(lOriginalObject);

            // Setup. InteractionZone.
            let lInteractionCounter: number = 0;
            lAttachedZone.addInteractionListener(UpdateTrigger, () => {
                lInteractionCounter++;
            });

            // Process. Add proxy zone as attached by touching the object.
            lAttachedZone.execute(() => {
                return lDetectionProxy.proxy.a;
            });

            lSilentZone.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            expect(lInteractionCounter).toBe(0);
        });
    });

    describe('Functionality: ComponentInteractionType', () => {
        it('-- ComponentInteractionType.PropertySetEnd after property set ', () => {
            // Setup.
            const lEndValue: number = 321;
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: CoreEntityProcessorProxy<{ a: number; }> = new CoreEntityProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD',).addTriggerRestriction(UpdateTrigger, UpdateTrigger.PropertySet);

            // Setup. InteractionZone.
            let lResponseType: UpdateTrigger = UpdateTrigger.None;
            let lPropertyValueOnEvent: number | null = null;
            lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                if (pChangeReason.data.property === 'a') {
                    lResponseType |= pChangeReason.trigger;
                    lPropertyValueOnEvent = lOriginalObject.a;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                lDetectionProxy.proxy.a = lEndValue;
            });

            // Evaluation.
            expect(lResponseType).toBe(UpdateTrigger.PropertySet);
            expect(lPropertyValueOnEvent).toBe(lEndValue);
        });

        it('-- ComponentInteractionType.PropertySet on property set error', () => {
            // Setup.
            const lEndValue: number = 321;
            const lOriginalObject: { a: number; } = new class { set a(_pAny: number) { throw 1; } }();
            const lDetectionProxy: CoreEntityProcessorProxy<{ a: number; }> = new CoreEntityProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(UpdateTrigger, UpdateTrigger.PropertySet);

            // Setup. InteractionZone.
            let lResponseType: UpdateTrigger = UpdateTrigger.None;
            lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                if (pChangeReason.data.property === 'a') {
                    lResponseType |= pChangeReason.trigger;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                try {
                    lDetectionProxy.proxy.a = lEndValue;
                } catch {/* Any */ }
            });

            // Evaluation.
            expect(lResponseType).toBe(UpdateTrigger.PropertySet);
        });

        it('-- ComponentInteractionType.PropertyDeleteEnd after property delete ', () => {
            // Setup.
            const lOriginalObject: { a?: number; } = { a: 1 };
            const lDetectionProxy: CoreEntityProcessorProxy<{ a?: number; }> = new CoreEntityProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(UpdateTrigger, UpdateTrigger.PropertyDelete);

            // Setup. InteractionZone.
            let lResponseType: UpdateTrigger = UpdateTrigger.None;
            let lPropertyValueOnEvent: number | undefined | null = null;
            lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                if (pChangeReason.data.property === 'a') {
                    lResponseType |= pChangeReason.trigger;
                    lPropertyValueOnEvent = lOriginalObject.a;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                delete lDetectionProxy.proxy.a;
            });

            // Evaluation.
            expect(lResponseType).toBe(UpdateTrigger.PropertyDelete);
            expect(lPropertyValueOnEvent).toBeUndefined();
        });

        it('-- ComponentInteractionType.PropertyDelete on property delete error', () => {
            // Setup.
            const lOriginalObject: { a?: number; } = Object.defineProperty({}, 'a', { configurable: false, value: 1 });

            const lDetectionProxy: CoreEntityProcessorProxy<{ a?: number; }> = new CoreEntityProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(UpdateTrigger, UpdateTrigger.PropertyDelete);

            // Setup. InteractionZone.
            let lResponseType: UpdateTrigger = UpdateTrigger.None;
            lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                if (pChangeReason.data.property === 'a') {
                    lResponseType |= pChangeReason.trigger;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                try {
                    delete lDetectionProxy.proxy.a;
                } catch {/* Any */ }
            });

            // Evaluation.
            expect(lResponseType).toBe(UpdateTrigger.PropertyDelete);
        });
    });

    describe('Functionality: Native JS-Objects', () => {
        it('-- Map', () => {
            // Setup.
            const lProxy: Map<string, string> = new CoreEntityProcessorProxy(new Map()).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(UpdateTrigger, UpdateTrigger.UntrackableFunctionCall);

            // Setup. InteractionZone.
            let lResponseType: UpdateTrigger = UpdateTrigger.None;
            lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                if (pChangeReason.data.source === lProxy.set) {
                    lResponseType |= pChangeReason.trigger;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy.set('', '');
            });

            // Evaluation.
            expect(lResponseType).toBe(UpdateTrigger.UntrackableFunctionCall);
        });

        describe('-- Array', () => {
            it('-- Property set', () => {
                // Setup.
                const lProxy: Array<string> = new CoreEntityProcessorProxy(new Array<string>()).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(UpdateTrigger, UpdateTrigger.PropertySet);

                // Setup. InteractionZone.
                let lResponseType: UpdateTrigger = UpdateTrigger.None;
                lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                    if (pChangeReason.data.source === lProxy) {
                        lResponseType |= pChangeReason.trigger;
                    }
                });

                // Process
                lInteractionZone.execute(() => {
                    lProxy[0] = '';
                });

                // Evaluation.
                expect(lResponseType).toBe(UpdateTrigger.PropertySet);
            });

            it('-- Push set', () => {
                // Setup.
                const lProxy: Array<string> = new CoreEntityProcessorProxy(new Array<string>()).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(UpdateTrigger, UpdateTrigger.UntrackableFunctionCall);

                // Setup. InteractionZone.
                let lResponseType: UpdateTrigger = UpdateTrigger.None;
                lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                    if (pChangeReason.data.source === lProxy.push) {
                        lResponseType |= pChangeReason.trigger;
                    }
                });

                // Process
                lInteractionZone.execute(() => {
                    lProxy.push('');
                });

                // Evaluation.
                expect(lResponseType).toBe(UpdateTrigger.UntrackableFunctionCall);
            });
        });

        it('-- Set', () => {
            // Setup.
            const lProxy: Set<string> = new CoreEntityProcessorProxy(new Set<string>()).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(UpdateTrigger, UpdateTrigger.UntrackableFunctionCall);

            // Setup. InteractionZone.
            let lResponseType: UpdateTrigger = UpdateTrigger.None;
            lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                if (pChangeReason.data.source === lProxy.add) {
                    lResponseType |= pChangeReason.trigger;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy.add('');
            });

            // Evaluation.
            expect(lResponseType).toBe(UpdateTrigger.UntrackableFunctionCall);
        });

        it('-- TypedArray', () => {
            // Setup.
            const lProxy: Int8Array = new CoreEntityProcessorProxy(new Int8Array(1)).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(UpdateTrigger, UpdateTrigger.PropertySet);

            // Setup. InteractionZone.
            let lResponseType: UpdateTrigger = UpdateTrigger.None;
            lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                if (pChangeReason.data.source === lProxy) {
                    lResponseType |= pChangeReason.trigger;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy[0] = 200;
            });

            // Evaluation.
            expect(lResponseType).toBe(UpdateTrigger.PropertySet);
        });

        describe('-- EventTarget', () => {
            it('-- Custom events', async () => {
                // Setup.
                const lCustomEventName: string = 'custom-event';
                const lProxy: EventTarget = new CoreEntityProcessorProxy(new EventTarget()).proxy;

                // Setup. InteractionZone.
                const lListenerWaiter = new Promise<void>((pResolve) => {
                    lProxy.addEventListener(lCustomEventName, () => {
                        pResolve();
                    });
                });

                // Process
                lProxy.dispatchEvent(new Event(lCustomEventName));

                // Evaluation.
                await lListenerWaiter;
            });

            it('-- Native events', async () => {
                // Setup.
                const lProxy: HTMLDivElement = new CoreEntityProcessorProxy(document.createElement('div')).proxy;

                // Setup. InteractionZone.
                const lListenerWaiter = new Promise<void>((pResolve) => {
                    lProxy.addEventListener('click', () => {
                        pResolve();
                    });
                });

                // Process
                lProxy.dispatchEvent(new MouseEvent('click'));

                // Evaluation.
                await lListenerWaiter;
            });

            it('-- Custom events - Check without proxy', async () => {
                // Setup.
                const lCustomEventName: string = 'custom-event';
                const lProxy: EventTarget = new EventTarget();

                // Setup. InteractionZone.
                const lListenerWaiter = new Promise<void>((pResolve) => {
                    lProxy.addEventListener(lCustomEventName, () => {
                        pResolve();
                    });
                });

                // Process
                lProxy.dispatchEvent(new Event(lCustomEventName));

                // Evaluation.
                await lListenerWaiter;
            });

            it('-- Native events - Check without proxy', async () => {
                // Setup.
                const lProxy: HTMLDivElement = document.createElement('div');

                // Setup. InteractionZone.
                const lListenerWaiter = new Promise<void>((pResolve) => {
                    lProxy.addEventListener('click', () => {
                        pResolve();
                    });
                });

                // Process
                lProxy.click();

                // Evaluation.
                await lListenerWaiter;
            });
        });
    });

    describe('Functionality: ComponentInteractionEvent.source', () => {
        it('-- Function sync calls', () => {
            // Setup. Trick into detecting native.
            const lFunction: (pValue: string) => string = (pValue: string) => { return '{ [native code]' + pValue; };
            const lProxy: (pValue: string) => string = new CoreEntityProcessorProxy(lFunction).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                lChangedSource = pChangeReason.data.source;
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy('');
            });

            // Evaluation.
            expect(lChangedSource).toBe(lProxy);
        });

        it('-- Set property ', () => {
            // Setup.
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: CoreEntityProcessorProxy<{ a: number; }> = new CoreEntityProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                lChangedSource = pChangeReason.data.source;
            });

            // Process.
            lInteractionZone.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            expect(lChangedSource).toBe(lDetectionProxy.proxy);
        });

        it('-- Delete property', () => {
            // Setup.
            const lOriginalObject: { a?: number; } = { a: 1 };
            const lDetectionProxy: CoreEntityProcessorProxy<{ a?: number; }> = new CoreEntityProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener(UpdateTrigger, (pChangeReason: CoreEntityInteractionEvent) => {
                lChangedSource = pChangeReason.data.source;
            });

            // Process.
            lInteractionZone.execute(() => {
                delete lDetectionProxy.proxy.a;
            });

            // Evaluation.
            expect(lChangedSource).toBe(lDetectionProxy.proxy);
        });
    });

    describe('Functionality: Proxy pollution', () => {
        it('-- Proerty set pollution', () => {
            // Setup.
            const lOriginalObject: { a: object; } = { a: {} };
            const lOriginalInnerObject: object = lOriginalObject.a;
            const lDetectionProxy: { a: object; } = new CoreEntityProcessorProxy(lOriginalObject).proxy;

            // Process.
            const lProxValue: object = lDetectionProxy.a;
            lDetectionProxy.a = lProxValue;

            // Evaluation.
            expect(lProxValue).not.toBe(lOriginalInnerObject);
            expect(lOriginalObject.a).toBe(lOriginalInnerObject);
        });

        it('-- Ignore IgnoreInteractionDetection decorator', () => {
            // Setup. Create Class with ignore decorator.
            @IgnoreInteractionTracking
            class IgnoreClass { }

            // Setup. Create class.
            const lOriginalObject: IgnoreClass = new IgnoreClass();

            // Process. Create proxy.
            const lDetectionProxy: IgnoreClass = new CoreEntityProcessorProxy(lOriginalObject).proxy;

            // Evaluation.
            expect(lDetectionProxy).toBe(lOriginalObject);
        });
    });
});