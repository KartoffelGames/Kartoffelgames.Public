import { expect } from 'chai';

import { InteractionReason } from '../../../kartoffelgames.web.interaction_zone/source/zone/interaction-reason';
import { InteractionZone } from '../../../kartoffelgames.web.interaction_zone/source/zone/interaction-zone';
import { IgnoreInteractionDetection } from '../../../source/change_detection/synchron_tracker/ignore-interaction-detection.decorator';
import { InteractionDetectionProxy, InteractionResponseType } from '../../../source/change_detection/synchron_tracker/interaction-detection-proxy';
import '../../../kartoffelgames.web.interaction_zone/test/mock/request-animation-frame-mock-session';

describe('InteractionDetectionProxy', () => {
    it('Property: proxy', () => {
        // Setup.
        const lOriginalObject: object = { a: 1 };
        const lDetectionProxy: InteractionDetectionProxy<object> = new InteractionDetectionProxy(lOriginalObject);

        // Process.
        const lProxy: object = lDetectionProxy.proxy;

        // Evaluation.
        expect(lProxy).to.not.equal(lOriginalObject);
    });

    it('Method: addChangeListener', () => {
        // Setup.
        const lOriginalObject: { a: number; } = { a: 1 };
        const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
        const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

        // Setup. InteractionZone.
        let lInteracted: boolean = false;
        lInteractionZone.addInteractionListener(() => {
            lInteracted = true;
        });

        // Process.
        lInteractionZone.execute(() => {
            lDetectionProxy.proxy.a = 22;
        });

        // Evaluation.
        expect(lInteracted).to.be.true;
    });

    describe('Functionality: InteractionZone', () => {
        it('-- Same proxy on double initialization', () => {
            // Setup.
            const lOriginalObject: object = {};

            // Process. First Proxy
            const lFirstInteractionZone: InteractionDetectionProxy<object> = new InteractionDetectionProxy(lOriginalObject);
            const lFirstProxy: object = lFirstInteractionZone.proxy;

            // Process. First Proxy
            const lSecondInteractionZone: InteractionDetectionProxy<object> = new InteractionDetectionProxy(lFirstProxy);
            const lSecondProxy: object = lSecondInteractionZone.proxy;

            // Evaluation.
            expect(lFirstProxy).to.equal(lSecondProxy);
            expect(lFirstInteractionZone).to.equal(lSecondInteractionZone);
        });

        describe('-- SET', () => {
            it('-- Default', () => {
                // Setup.
                const lNewValue: number = 22;
                const lOriginalObject: { a: number; } = { a: 1 };
                const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                lDetectionProxy.proxy.a = lNewValue;

                // Evaluation.
                expect(lOriginalObject.a).to.equal(lNewValue);
            });

            it('-- Correct value in layered property set', () => {
                // Setup.
                const lNewValue: number = 22;
                const lOriginalObject: { a: { b: number; }; } = { a: { b: 1 } };
                const lDetectionProxy: InteractionDetectionProxy<{ a: { b: number; }; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                lDetectionProxy.proxy.a.b = lNewValue;

                // Evaluation.
                expect(lOriginalObject.a.b).to.equal(lNewValue);
            });

            it('-- Correct interacted property name in reason ', () => {
                // Setup.
                const lOriginalObject: { a: number; } = { a: 1 };
                const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lInteractionZone.execute(() => {
                    lDetectionProxy.proxy.a = 22;
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Detect interaction in forwarded this context', () => {
                const lOriginalObject = {
                    a: 0,
                    fun: function () {
                        return this;
                    }
                };
                const lDetectionProxy: InteractionDetectionProxy<any> = new InteractionDetectionProxy(lOriginalObject);
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lInteractionZone.execute(() => {
                    lDetectionProxy.proxy.fun().a = 22;
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Correct value in forwarded this context.', () => {
                const lNewValue: number = 22;
                const lOriginalObject = {
                    a: 0,
                    fun: function () {
                        return this;
                    }
                };
                const lDetectionProxy: InteractionDetectionProxy<any> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                lDetectionProxy.proxy.fun().a = lNewValue;

                // Evaluation.
                expect(lOriginalObject.a).to.equal(lNewValue);
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
                const lDetectionProxy: InteractionDetectionProxy<any> = new InteractionDetectionProxy(lOriginalObject);
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lInteractionZone.execute(() => {
                    lDetectionProxy.proxy.fun()().a = lNewValue;
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
                expect(lOriginalObject.a).to.equal(lNewValue);
            });
        });

        describe('-- GET', () => {
            it('-- Primitive', () => {
                // Setup.
                const lValue: number = 22;
                const lOriginalObject: { a: number; } = { a: lValue };
                const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                const lResultValue: number = lDetectionProxy.proxy.a;

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Object', () => {
                // Setup.
                const lValue: object = {};
                const lOriginalObject: { a: object; } = { a: lValue };
                const lDetectionProxy: InteractionDetectionProxy<{ a: object; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                const lResultValue: object = lDetectionProxy.proxy.a;

                // Evaluation.
                expect(lResultValue).to.not.equal(lValue);
                expect(lResultValue).to.deep.equal(lValue);
            });

            it('-- Function', () => {
                // Setup.
                const lValue: () => void = () => { return; };
                const lOriginalObject: { a: () => void; } = { a: lValue };
                const lDetectionProxy: InteractionDetectionProxy<{ a: () => void; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                const lResultValue: () => void = lDetectionProxy.proxy.a;

                // Evaluation.
                expect(lResultValue).to.not.equal(lValue);
                expect(lResultValue.name).to.equal(lValue.name);
            });
        });

        describe('-- DELETE', () => {
            it('-- Deletes correct property in original', () => {
                // Setup.
                const lOriginalObject: { a?: number; } = { a: 1 };
                const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                delete lDetectionProxy.proxy.a;

                // Evaluation.
                expect(lOriginalObject.a).to.be.undefined;
            });

            it('-- Detect deletion of correct property', () => {
                // Setup.
                const lOriginalObject: { a?: number; } = { a: 1 };
                const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject);
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lInteractionZone.execute(() => {
                    delete lDetectionProxy.proxy.a;
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });
        });

        describe('-- APPLY', () => {
            it('-- Correct return type on function', () => {
                // Setup.
                const lValue: number = 22;
                const lDetectionProxy: InteractionDetectionProxy<(pValue: number) => number> = new InteractionDetectionProxy((pValue: number) => { return pValue; });
                const lProxy: (pValue: number) => number = lDetectionProxy.proxy;

                // Process.
                const lResultValue: number = lProxy(lValue);

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Detect interaction on function call', () => {
                // Setup.
                const lFunction: (pValue: number) => number = (pValue: number) => { return pValue; };
                const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                lInteractionZone.execute(() => {
                    lProxy(22);
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Detect interaction on bound function call', () => {
                // Setup.
                const lFunction: (pValue: number) => number = (pValue: number) => { return pValue; };
                const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                lInteractionZone.execute(() => {
                    lProxy.bind(null)(22);
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Detect interaction on apply function call', () => {
                // Setup.
                const lFunction: (pValue: number) => number = (pValue: number) => { return pValue; };
                const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                lInteractionZone.execute(() => {
                    lProxy.apply(null, [22]);
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Detect interaction on call function call', () => {
                // Setup.
                const lFunction: (pValue: number) => number = (pValue: number) => { return pValue; };
                const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                lInteractionZone.execute(() => {
                    lProxy.call(null, 22);
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Dont detect interaction on binding function', () => {
                // Setup.
                const lFunction: (pValue: number) => number = (pValue: number) => { return pValue; };
                const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                lInteractionZone.execute(() => {
                    lProxy.bind(null);
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.false;
            });

            it('-- Forward syncron errors on call', () => {
                // Setup.
                const lValue: number = 22;
                const lDetectionProxy: InteractionDetectionProxy<() => number> = new InteractionDetectionProxy(() => { throw lValue; });
                const lProxy: () => number = lDetectionProxy.proxy;

                // Process.
                let lResultValue: number | null = null;
                try {
                    lProxy();
                } catch (pError) {
                    lResultValue = <number>pError;
                }

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Detect interaction even on synchron errors', () => {
                // Setup.
                const lFunction: () => number = () => { throw 22; };
                const lProxy: () => number = new InteractionDetectionProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                try {
                    lInteractionZone.execute(() => {
                        lProxy();
                    });
                } catch (e) {/* Empty */ }

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Correct return type on asyncron functions', async () => {
                // Setup.
                const lValue: number = 22;
                const lDetectionProxy: InteractionDetectionProxy<(pValue: number) => Promise<number>> = new InteractionDetectionProxy(async (pValue: number) => { return pValue; });
                const lProxy: (pValue: number) => Promise<number> = lDetectionProxy.proxy;

                // Process.
                const lResultValue: number = await lProxy(lValue);

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Detect interaction on asyncon calls', async () => {
                // Setup.
                const lFunction: (pValue: number) => Promise<number> = async (pValue: number) => { return pValue; };
                const lProxy: (pValue: number) => Promise<number> = new InteractionDetectionProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                await lInteractionZone.execute(async () => {
                    return lProxy(22);
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Forward asyncron errors on call', async () => {
                // Setup.
                const lValue: number = 22;
                const lDetectionProxy: InteractionDetectionProxy<() => Promise<number>> = new InteractionDetectionProxy(async () => { throw lValue; });
                const lProxy: () => Promise<number> = lDetectionProxy.proxy;

                // Process.
                let lResultValue: number | null = null;
                await lProxy().catch((pError) => { lResultValue = pError; });

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Detect interaction even on asynchron errors', async () => {
                // Setup.
                const lFunction: () => Promise<number> = async () => { throw 22; };
                const lProxy: () => Promise<number> = new InteractionDetectionProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                await lInteractionZone.execute(async () => {
                    return lProxy().catch((_pError) => { /* Empty */ });
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
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
                const lProxy = new InteractionDetectionProxy(lObject).proxy;

                // Evaluation.
                expect(lProxy.zone).to.equal(lInteractionZone);
                expect(lProxy.childObject).to.not.equal(lChildObject);
            });
        });

        it('-- getOwnPropertyDescriptor', () => {
            // Setup.
            const lValue: number = 22;
            const lOriginalObject: { a: number; } = { a: lValue };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);

            // Process.
            const lResultValue: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(lDetectionProxy.proxy, 'a');

            // Evaluation.
            expect(lResultValue?.value).to.equal(lValue);
        });

        it('-- Not dispatch interaction to proxy zone when current zone is silent.', async () => {
            // Setup.
            const lProxyZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredPropertySet });
            const lSilentZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.None });

            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);

            // Setup. Add proxy zone as listener.
            lDetectionProxy.addListenerZone(lProxyZone);

            // Process.
            let lInteractionCounter: number = 0;
            lProxyZone.addInteractionListener(() => {
                lInteractionCounter++;
            });

            lSilentZone.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(0);
        });
    });

    describe('Functionality: attachZone', () => {
        it('-- Dispatch interaction to attached zone', async () => {
            // Setup.
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            const lListenerPromise: Promise<void> = new Promise<void>((pResolve) => {
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.property === 'a') {
                        pResolve();
                    }
                });
            });

            // Process. Attach zone.
            lDetectionProxy.addListenerZone(lInteractionZone);

            // Process. Trigger changes.
            lDetectionProxy.proxy.a = 22;

            // Evaluation.
            await lListenerPromise;
        });

        it('-- Dispatch interaction to attached and current zone', async () => {
            // Setup.
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lAttachedInteractionZone: InteractionZone = InteractionZone.current.create('CDAttach');
            const lCurrentInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            const lAttachedListenerPromise: Promise<void> = new Promise<void>((pResolve) => {
                lAttachedInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.property === 'a') {
                        pResolve();
                    }
                });
            });
            const lCurrentListenerPromise: Promise<void> = new Promise<void>((pResolve) => {
                lCurrentInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.property === 'a') {
                        pResolve();
                    }
                });
            });

            // Process. Attach zone.
            lDetectionProxy.addListenerZone(lAttachedInteractionZone);

            // Trigger changes.
            lCurrentInteractionZone.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            await lAttachedListenerPromise;
            await lCurrentListenerPromise;
        });

        it('-- Dispatch interaction to only once to current and attached zone', async () => {
            // Setup.
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredPropertySet });

            // Setup. InteractionZone.
            let lInteractionCounter: number = 0;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lInteractionCounter++;
                }
            });
            // Process.
            lDetectionProxy.addListenerZone(lInteractionZone);
            lInteractionZone.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Not dispatch interaction to attached zone when changes where made in silent zone.', async () => {
            // Setup.
            const lAttachedZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredPropertySet });
            const lSilentZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.None });

            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);

            // Setup. InteractionZone.
            let lInteractionCounter: number = 0;
            lAttachedZone.addInteractionListener(() => {
                lInteractionCounter++;
            });

            // Process.
            lDetectionProxy.addListenerZone(lAttachedZone);

            lSilentZone.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(0);
        });
    });

    describe('Functionality: InteractionResponseType', () => {
        it('-- InteractionResponseType.PropertyGetEnd after property get ', () => {
            // Setup. Trigger values.
            const lTriggerValueChanged: number = 1;
            const lTriggerValueOriginal: number = -1;
            let lTriggerValue: number = lTriggerValueOriginal;

            // Setup.
            const lOriginalObject: { a: number; } = new class { get a(): number { lTriggerValue = lTriggerValueChanged; return 1; } }();
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredPropertyGet });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            let lTriggerValueOnEvent: number | null = null;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.triggerType;
                    lTriggerValueOnEvent = lTriggerValue;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                lDetectionProxy.proxy.a;
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.RegisteredPropertyGet);
            expect(lTriggerValueOnEvent).to.equal(lTriggerValueChanged);
        });

        it('-- InteractionResponseType.RegisteredPropertyGet on property get error', () => {
            // Setup.
            const lOriginalObject: { a: number; } = new class { get a(): number { throw 1; } }();
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredPropertyGet });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.triggerType;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                try {
                    lDetectionProxy.proxy.a;
                } catch (_) {/* Any */ }
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.RegisteredPropertyGet);
        });

        it('-- InteractionResponseType.PropertySetEnd after property set ', () => {
            // Setup.
            const lEndValue: number = 321;
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredPropertySet });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            let lPropertyValueOnEvent: number | null = null;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.triggerType;
                    lPropertyValueOnEvent = lOriginalObject.a;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                lDetectionProxy.proxy.a = lEndValue;
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.RegisteredPropertySet);
            expect(lPropertyValueOnEvent).to.equal(lEndValue);
        });

        it('-- InteractionResponseType.RegisteredPropertySet on property set error', () => {
            // Setup.
            const lEndValue: number = 321;
            const lOriginalObject: { a: number; } = new class { set a(_pAny: number) { throw 1; } }();
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredPropertySet });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.triggerType;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                try {
                    lDetectionProxy.proxy.a = lEndValue;
                } catch (_) {/* Any */ }
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.RegisteredPropertySet);
        });

        it('-- InteractionResponseType.PropertyDeleteEnd after property delete ', () => {
            // Setup.
            const lOriginalObject: { a?: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredPropertyDelete });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            let lPropertyValueOnEvent: number | undefined | null = null;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.triggerType;
                    lPropertyValueOnEvent = lOriginalObject.a;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                delete lDetectionProxy.proxy.a;
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.RegisteredPropertyDelete);
            expect(lPropertyValueOnEvent).to.be.undefined;
        });

        it('-- InteractionResponseType.RegisteredPropertyDelete on property delete error', () => {
            // Setup.
            const lOriginalObject: { a?: number; } = Object.defineProperty({}, 'a', { configurable: false, value: 1 });

            const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredPropertyDelete });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.triggerType;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                try {
                    delete lDetectionProxy.proxy.a;
                } catch (_) {/* Any */ }
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.RegisteredPropertyDelete);
        });

        it('-- InteractionResponseType.FunctionCallEnd after function call', () => {
            // Setup. Trigger values.
            const lTriggerValueChanged: number = 1;
            const lTriggerValueOriginal: number = -1;
            let lTriggerValue: number = lTriggerValueOriginal;

            // Setup.
            const lFunction: (pValue: number) => number = (pValue: number) => { lTriggerValue = lTriggerValueChanged; return pValue; };
            const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredFunction });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            let lTriggerValueOnEvent: number | null = null;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy) {
                    lResponseType |= pChangeReason.triggerType;
                    lTriggerValueOnEvent = lTriggerValue;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy(22);
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.RegisteredFunction);
            expect(lTriggerValueOnEvent).to.equal(lTriggerValueChanged);
        });

        it('-- InteractionResponseType.RegisteredFunction after function call error', () => {
            // Setup.
            const lFunction: () => number = () => { throw 1; };
            const lProxy: () => number = new InteractionDetectionProxy(lFunction).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredFunction });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy) {
                    lResponseType |= pChangeReason.triggerType;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                try {
                    lProxy();
                } catch (_) {/* Any */ }
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.RegisteredFunction);
        });
    });

    describe('Functionality: Native JS-Objects', () => {
        it('-- Map', () => {
            // Setup.
            const lProxy: Map<string, string> = new InteractionDetectionProxy(new Map()).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredFunction | InteractionResponseType.RegisteredUntrackableFunction });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy.set) {
                    lResponseType |= pChangeReason.triggerType;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy.set('', '');
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.RegisteredFunction | InteractionResponseType.RegisteredUntrackableFunction);
        });

        describe('-- Array', () => {
            it('-- Property set', () => {
                // Setup.
                const lProxy: Array<string> = new InteractionDetectionProxy(new Array<string>()).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredPropertySet });

                // Setup. InteractionZone.
                let lResponseType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lResponseType |= pChangeReason.triggerType;
                    }
                });

                // Process
                lInteractionZone.execute(() => {
                    lProxy[0] = '';
                });

                // Evaluation.
                expect(lResponseType).to.equal(InteractionResponseType.RegisteredPropertySet);
            });

            it('-- Push set', () => {
                // Setup.
                const lProxy: Array<string> = new InteractionDetectionProxy(new Array<string>()).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredFunction | InteractionResponseType.RegisteredUntrackableFunction });

                // Setup. InteractionZone.
                let lResponseType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy.push) {
                        lResponseType |= pChangeReason.triggerType;
                    }
                });

                // Process
                lInteractionZone.execute(() => {
                    lProxy.push('');
                });

                // Evaluation.
                expect(lResponseType).to.equal(InteractionResponseType.RegisteredFunction | InteractionResponseType.RegisteredUntrackableFunction);
            });
        });

        it('-- Set', () => {
            // Setup.
            const lProxy: Set<string> = new InteractionDetectionProxy(new Set<string>()).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredFunction | InteractionResponseType.RegisteredUntrackableFunction });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy.add) {
                    lResponseType |= pChangeReason.triggerType;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy.add('');
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.RegisteredFunction | InteractionResponseType.RegisteredUntrackableFunction);
        });

        it('-- TypedArray', () => {
            // Setup.
            const lProxy: Int8Array = new InteractionDetectionProxy(new Int8Array(1)).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD', { trigger: InteractionResponseType.RegisteredPropertySet });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy) {
                    lResponseType |= pChangeReason.triggerType;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy[0] = 200;
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.RegisteredPropertySet);
        });

        describe('-- EventTarget', () => {
            it('-- Custom events', async () => {
                // Setup.
                const lCustomEventName: string = 'custom-event';
                const lProxy: EventTarget = new InteractionDetectionProxy(new EventTarget()).proxy;

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
                const lProxy: HTMLDivElement = new InteractionDetectionProxy(document.createElement('div')).proxy;

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

    describe('Functionality: InteractionReason.source', () => {
        it('-- Function sync calls', () => {
            // Setup.
            const lFunction: (pValue: number) => number = (pValue: number) => { return pValue; };
            const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lChangedSource = pChangeReason.source;
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy(22);
            });

            // Evaluation.
            expect(lChangedSource).to.equal(lProxy);
        });

        it('-- Function async calls', async () => {
            // Setup.
            const lFunction: (pValue: number) => Promise<any> = async (pValue: number) => { return pValue; };
            const lProxy: (pValue: number) => Promise<number> = new InteractionDetectionProxy(lFunction).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                // Filter async call detections of patcher
                if (pChangeReason.source === lProxy) {
                    lChangedSource = pChangeReason.source;
                }
            });

            // Process
            await lInteractionZone.execute(async () => {
                return lProxy(22);
            });

            // Evaluation.
            expect(lChangedSource).to.equal(lProxy);
        });

        it('-- Set property ', () => {
            // Setup.
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lChangedSource = pChangeReason.source;
            });

            // Process.
            lInteractionZone.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            expect(lChangedSource).to.equal(lDetectionProxy.proxy);
        });

        it('-- Delete property', () => {
            // Setup.
            const lOriginalObject: { a?: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lChangedSource = pChangeReason.source;
            });

            // Process.
            lInteractionZone.execute(() => {
                delete lDetectionProxy.proxy.a;
            });

            // Evaluation.
            expect(lChangedSource).to.equal(lDetectionProxy.proxy);
        });
    });

    describe('Functionality: Proxy pollution', () => {
        it('-- Proerty set pollution', () => {
            // Setup.
            const lOriginalObject: { a: object; } = { a: {} };
            const lOriginalInnerObject: object = lOriginalObject.a;
            const lDetectionProxy: { a: object; } = new InteractionDetectionProxy(lOriginalObject).proxy;

            // Process.
            const lProxValue: object = lDetectionProxy.a;
            lDetectionProxy.a = lProxValue;

            // Evaluation.
            expect(lProxValue).to.not.equal(lOriginalInnerObject);
            expect(lOriginalObject.a).to.equal(lOriginalInnerObject);
        });

        it('-- Ignore IgnoreInteractionDetection decorator', () => {
            // Setup. Create Class with ignore decorator.
            @IgnoreInteractionDetection
            class IgnoreClass { }

            // Setup. Create class.
            const lOriginalObject: IgnoreClass = new IgnoreClass();

            // Process. Create proxy.
            const lDetectionProxy: IgnoreClass = new InteractionDetectionProxy(lOriginalObject).proxy;

            // Evaluation.
            expect(lDetectionProxy).to.equal(lOriginalObject);
        });
    });
});