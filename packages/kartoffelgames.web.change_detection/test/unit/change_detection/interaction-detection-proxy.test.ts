import '../../mock/request-animation-frame-mock-session';
import { expect } from 'chai';
import { InteractionDetectionProxy } from '../../../source/change_detection/synchron_tracker/interaction-detection-proxy';
import { InteractionZone } from '../../../source/change_detection/interaction-zone';
import { InteractionReason } from '../../../source/change_detection/interaction-reason';
import { InteractionResponseType } from '../../../source/change_detection/enum/interaction-response-type.enum';
import { IgnoreInteractionDetection } from '../../../source/change_detection/synchron_tracker/ignore-interaction-detection.decorator';

describe('InteractionDetectionProxy', () => {
    it('Property: proxy', () => {
        // Setup.
        const lOriginalObject: object = { a: 1 };
        const lDetectionProxy: InteractionDetectionProxy<object> = new InteractionDetectionProxy(lOriginalObject, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));

        // Process.
        const lProxy: object = lDetectionProxy.proxy;

        // Evaluation.
        expect(lProxy).to.not.equal(lOriginalObject);
    });

    it('Method: addChangeListener', () => {
        // Setup.
        const lInteractionZone: InteractionZone = new InteractionZone('CD');
        const lOriginalObject: { a: number; } = { a: 1 };
        const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

        // Setup. InteractionZone.
        let lInteracted: boolean = false;
        lInteractionZone.addInteractionListener(() => {
            lInteracted = true;
        });

        // Process.
        lDetectionProxy.proxy.a = 22;

        // Evaluation.
        expect(lInteracted).to.be.true;
    });

    describe('Functionality: InteractionZone', () => {
        it('-- Same proxy on double initialization with same zone.', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.None });
            const lOriginalObject: object = {};

            // Process. First Proxy
            const lFirstInteractionZone: InteractionDetectionProxy<object> = new InteractionDetectionProxy(lOriginalObject, lZone);
            const lFirstProxy: object = lFirstInteractionZone.proxy;

            // Process. First Proxy
            const lSecondInteractionZone: InteractionDetectionProxy<object> = new InteractionDetectionProxy(lFirstProxy, lZone);
            const lSecondProxy: object = lSecondInteractionZone.proxy;

            // Evaluation.
            expect(lFirstProxy).to.equal(lSecondProxy);
            expect(lFirstInteractionZone).to.equal(lSecondInteractionZone);
        });

        it('-- Different proxy on double initialization with different zone', () => {
            // Setup.
            const lOriginalObject: object = {};

            // Process. First Proxy
            const lFirstInteractionZone: InteractionDetectionProxy<object> = new InteractionDetectionProxy(lOriginalObject, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));
            const lFirstProxy: object = lFirstInteractionZone.proxy;

            // Process. First Proxy
            const lSecondInteractionZone: InteractionDetectionProxy<object> = new InteractionDetectionProxy(lFirstProxy, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));
            const lSecondProxy: object = lSecondInteractionZone.proxy;

            // Evaluation.
            expect(lFirstProxy).to.not.equal(lSecondProxy);
            expect(lFirstInteractionZone).to.not.equal(lSecondInteractionZone);
        });

        describe('-- SET', () => {
            it('-- Default', () => {
                // Setup.
                const lNewValue: number = 22;
                const lOriginalObject: { a: number; } = { a: 1 };
                const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));

                // Process.
                lDetectionProxy.proxy.a = lNewValue;

                // Evaluation.
                expect(lOriginalObject.a).to.equal(lNewValue);
            });

            it('-- Correct value in layered property set', () => {
                // Setup.
                const lNewValue: number = 22;
                const lOriginalObject: { a: { b: number; }; } = { a: { b: 1 } };
                const lDetectionProxy: InteractionDetectionProxy<{ a: { b: number; }; }> = new InteractionDetectionProxy(lOriginalObject, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));

                // Process.
                lDetectionProxy.proxy.a.b = lNewValue;

                // Evaluation.
                expect(lOriginalObject.a.b).to.equal(lNewValue);
            });

            it('-- Correct interacted property name in reason ', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('CD');
                const lOriginalObject: { a: number; } = { a: 1 };
                const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lDetectionProxy.proxy.a = 22;

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
                const lInteractionZone: InteractionZone = new InteractionZone('CD');
                const lDetectionProxy: InteractionDetectionProxy<any> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lDetectionProxy.proxy.fun().a = 22;

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
                const lDetectionProxy: InteractionDetectionProxy<any> = new InteractionDetectionProxy(lOriginalObject, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));

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
                const lInteractionZone: InteractionZone = new InteractionZone('CD');
                const lDetectionProxy: InteractionDetectionProxy<any> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);


                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lDetectionProxy.proxy.fun()().a = lNewValue;

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
                const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));

                // Process.
                const lResultValue: number = lDetectionProxy.proxy.a;

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Object', () => {
                // Setup.
                const lValue: object = {};
                const lOriginalObject: { a: object; } = { a: lValue };
                const lDetectionProxy: InteractionDetectionProxy<{ a: object; }> = new InteractionDetectionProxy(lOriginalObject, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));

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
                const lDetectionProxy: InteractionDetectionProxy<{ a: () => void; }> = new InteractionDetectionProxy(lOriginalObject, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));

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
                const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));

                // Process.
                delete lDetectionProxy.proxy.a;

                // Evaluation.
                expect(lOriginalObject.a).to.be.undefined;
            });

            it('-- Detect deletion of correct property', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('CD');
                const lOriginalObject: { a?: number; } = { a: 1 };
                const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                delete lDetectionProxy.proxy.a;

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });
        });

        describe('-- APPLY', () => {
            it('-- Correct return type on function', () => {
                // Setup.
                const lValue: number = 22;
                const lDetectionProxy: InteractionDetectionProxy<(pValue: number) => number> = new InteractionDetectionProxy((pValue: number) => { return pValue; }, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));
                const lProxy: (pValue: number) => number = lDetectionProxy.proxy;

                // Process.
                const lResultValue: number = lProxy(lValue);

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Detect interaction on function call', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('CD');
                const lFunction: (pValue: number) => number = (pValue: number) => { return pValue; };
                const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction, lInteractionZone).proxy;

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                lProxy(22);

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Forward syncron errors on call', () => {
                // Setup.
                const lValue: Error = new Error('22');
                const lDetectionProxy: InteractionDetectionProxy<() => number> = new InteractionDetectionProxy(() => { throw lValue; }, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));
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
                const lInteractionZone: InteractionZone = new InteractionZone('CD');
                const lFunction: () => number = () => { throw 22; };
                const lProxy: () => number = new InteractionDetectionProxy(lFunction, lInteractionZone).proxy;

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                try {
                    lProxy();
                } catch (e) {/* Empty */ }

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Correct return type on asyncron functions', async () => {
                // Setup.
                const lValue: number = 22;
                const lDetectionProxy: InteractionDetectionProxy<(pValue: number) => Promise<number>> = new InteractionDetectionProxy(async (pValue: number) => { return pValue; }, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));
                const lProxy: (pValue: number) => Promise<number> = lDetectionProxy.proxy;

                // Process.
                const lResultValue: number = await lProxy(lValue);

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Detect interaction on asyncon calls', async () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('CD');
                const lFunction: (pValue: number) => Promise<number> = async (pValue: number) => { return pValue; };
                const lProxy: (pValue: number) => Promise<number> = new InteractionDetectionProxy(lFunction, lInteractionZone).proxy;

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                await lProxy(22);

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Forward asyncron errors on call', async () => {
                // Setup.
                const lValue: number = 22;
                const lDetectionProxy: InteractionDetectionProxy<() => Promise<number>> = new InteractionDetectionProxy(async () => { throw lValue; }, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));
                const lProxy: () => Promise<number> = lDetectionProxy.proxy;

                // Process.
                let lResultValue: number | null = null;
                await lProxy().catch((pError) => { lResultValue = pError; });

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Detect interaction even on asynchron errors', async () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('CD');
                const lFunction: () => Promise<number> = async () => { throw 22; };
                const lProxy: () => Promise<number> = new InteractionDetectionProxy(lFunction, lInteractionZone).proxy;

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                await lProxy().catch((_pError) => { /* Empty */ });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Not proxy interaction zones', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('SameName');
                const lChildObject: object = {};
                const lObject = {
                    zone: lInteractionZone,
                    childObject: lChildObject
                };

                // Process.
                const lProxy = new InteractionDetectionProxy(lObject, lInteractionZone).proxy;

                // Evaluation.
                expect(lProxy.zone).to.equal(lInteractionZone);
                expect(lProxy.childObject).to.not.equal(lChildObject);
            });
        });

        it('-- getOwnPropertyDescriptor', () => {
            // Setup.
            const lValue: number = 22;
            const lOriginalObject: { a: number; } = { a: lValue };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, new InteractionZone('Zone', { trigger: InteractionResponseType.None }));

            // Process.
            const lResultValue: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(lDetectionProxy.proxy, 'a');

            // Evaluation.
            expect(lResultValue?.value).to.equal(lValue);
        });

        it('-- Not dispatch interaction to proxy zone when current zone is silent.', async () => {
            // Setup.
            const lProxyZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertySetStart });
            const lSilentZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.None });

            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, lProxyZone);

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

    describe('Functionality: attachZoneStack', () => {
        it('-- Dispatch interaction to attached zone', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD');
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

            // Setup. InteractionZone.
            const lListenerPromise: Promise<void> = new Promise<void>((pResolve) => {
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.property === 'a') {
                        pResolve();
                    }
                });
            });

            // Process. Attach zone stack.
            lDetectionProxy.addListenerZoneStack(InteractionZone.save());

            // Process. Trigger changes.
            lDetectionProxy.proxy.a = 22;

            // Evaluation.
            await lListenerPromise;
        });

        it('-- Dispatch interaction to attached and current zone', async () => {
            // Setup.
            const lCurrentInteractionZone: InteractionZone = new InteractionZone('CD');
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, lCurrentInteractionZone);
            const lAttachedInteractionZone: InteractionZone = new InteractionZone('CDAttach');

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

            // Process. Attach zone stack.
            lAttachedInteractionZone.execute(() => {
                lDetectionProxy.addListenerZoneStack(InteractionZone.save());
            });

            // Trigger changes.
            lDetectionProxy.proxy.a = 22;

            // Evaluation.
            await lAttachedListenerPromise;
            await lCurrentListenerPromise;
        });

        it('-- Dispatch interaction to only once to current and attached zone', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertySetStart });
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

            // Setup. InteractionZone.
            let lInteractionCounter: number = 0;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lInteractionCounter++;
                }
            });
            // Process.
            lInteractionZone.execute(() => {
                lDetectionProxy.addListenerZoneStack(InteractionZone.save());
            });
            lDetectionProxy.proxy.a = 22;

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Not dispatch interaction to attached zone when changes where made in silent zone.', async () => {
            // Setup.
            const lProxyZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertySetStart });
            const lAttachedZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertySetStart });
            const lSilentZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.None });

            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, lProxyZone);

            // Setup. InteractionZone.
            let lInteractionCounter: number = 0;
            lAttachedZone.addInteractionListener(() => {
                lInteractionCounter++;
            });

            // Process.
            lAttachedZone.execute(() => {
                lDetectionProxy.addListenerZoneStack(InteractionZone.save());
            });

            lSilentZone.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(0);
        });
    });

    describe('Functionality: InteractionResponseType', () => {
        it('-- InteractionResponseType.PropertyGetStart before property get ', () => {
            // Setup. Trigger values.
            const lTriggerValueChanged: number = 1;
            const lTriggerValueOriginal: number = -1;
            let lTriggerValue: number = lTriggerValueOriginal;

            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertyGetStart });
            const lOriginalObject: { a: number; } = new class { get a(): number { lTriggerValue = lTriggerValueChanged; return 1; } }();
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            let lTriggerValueOnEvent: number | null = null;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.interactionType;
                    lTriggerValueOnEvent = lTriggerValue;
                }
            });

            // Process.
            lDetectionProxy.proxy.a;

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertyGetStart);
            expect(lTriggerValueOnEvent).to.equal(lTriggerValueOriginal);
        });

        it('-- InteractionResponseType.PropertyGetEnd after property get ', () => {
            // Setup. Trigger values.
            const lTriggerValueChanged: number = 1;
            const lTriggerValueOriginal: number = -1;
            let lTriggerValue: number = lTriggerValueOriginal;

            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertyGetEnd });
            const lOriginalObject: { a: number; } = new class { get a(): number { lTriggerValue = lTriggerValueChanged; return 1; } }();
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            let lTriggerValueOnEvent: number | null = null;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.interactionType;
                    lTriggerValueOnEvent = lTriggerValue;
                }
            });

            // Process.
            lDetectionProxy.proxy.a;

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertyGetEnd);
            expect(lTriggerValueOnEvent).to.equal(lTriggerValueChanged);
        });

        it('-- InteractionResponseType.PropertyGetError on property get ', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertyGetError });
            const lOriginalObject: { a: number; } = new class { get a(): number { throw 1; } }();
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process.
            try {
                lDetectionProxy.proxy.a;
            } catch (_) {/* Any */ }

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertyGetError);
        });

        it('-- InteractionResponseType.PropertySetStart before property set ', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertySetStart });
            const lStartValue: number = 321;
            const lOriginalObject: { a: number; } = { a: lStartValue };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);


            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            let lPropertyValueOnEvent: number | null = null;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.interactionType;
                    lPropertyValueOnEvent = lOriginalObject.a;
                }
            });

            // Process.
            lDetectionProxy.proxy.a = 22;

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertySetStart);
            expect(lPropertyValueOnEvent).to.equal(lStartValue);
        });

        it('-- InteractionResponseType.PropertySetEnd after property set ', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertySetEnd });
            const lEndValue: number = 321;
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            let lPropertyValueOnEvent: number | null = null;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.interactionType;
                    lPropertyValueOnEvent = lOriginalObject.a;
                }
            });

            // Process.
            lDetectionProxy.proxy.a = lEndValue;

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertySetEnd);
            expect(lPropertyValueOnEvent).to.equal(lEndValue);
        });

        it('-- InteractionResponseType.PropertySetError on property set ', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertySetError });
            const lEndValue: number = 321;
            const lOriginalObject: { a: number; } = new class { set a(_pAny: number) { throw 1; } }();
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process.
            try {
                lDetectionProxy.proxy.a = lEndValue;
            } catch (_) {/* Any */ }

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertySetError);
        });

        it('-- InteractionResponseType.PropertyDeleteStart before property delete ', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertyDeleteStart });
            const lStartValue: number = 321;
            const lOriginalObject: { a?: number; } = { a: lStartValue };
            const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            let lPropertyValueOnEvent: number | undefined | null = null;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.interactionType;
                    lPropertyValueOnEvent = lOriginalObject.a;
                }
            });

            // Process.
            delete lDetectionProxy.proxy.a;

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertyDeleteStart);
            expect(lPropertyValueOnEvent).to.equal(lStartValue);
        });

        it('-- InteractionResponseType.PropertyDeleteEnd after property delete ', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertyDeleteEnd });
            const lOriginalObject: { a?: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            let lPropertyValueOnEvent: number | undefined | null = null;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.interactionType;
                    lPropertyValueOnEvent = lOriginalObject.a;
                }
            });

            // Process.
            delete lDetectionProxy.proxy.a;

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertyDeleteEnd);
            expect(lPropertyValueOnEvent).to.be.undefined;
        });

        it('-- InteractionResponseType.PropertyDeleteError on property delete ', () => {
            // Setup.
            const lOriginalObject: { a?: number; } = Object.defineProperty({}, 'a', { configurable: false, value: 1 });
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertyDeleteError });
            const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process.
            try {
                delete lDetectionProxy.proxy.a;
            } catch (_) {/* Any */ }

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertyDeleteError);
        });

        it('-- InteractionResponseType.FunctionCallStart before function call', () => {
            // Setup. Trigger values.
            const lTriggerValueChanged: number = 1;
            const lTriggerValueOriginal: number = -1;
            let lTriggerValue: number = lTriggerValueOriginal;

            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.FunctionCallStart });
            const lFunction: (pValue: number) => number = (pValue: number) => { lTriggerValue = lTriggerValueChanged; return pValue; };
            const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction, lInteractionZone).proxy;

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            let lTriggerValueOnEvent: number | null = null;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy) {
                    lResponseType |= pChangeReason.interactionType;
                    lTriggerValueOnEvent = lTriggerValue;
                }
            });

            // Process
            lProxy(22);

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.FunctionCallStart);
            expect(lTriggerValueOnEvent).to.equal(lTriggerValueOriginal);
        });

        it('-- InteractionResponseType.FunctionCallEnd after function call', () => {
            // Setup. Trigger values.
            const lTriggerValueChanged: number = 1;
            const lTriggerValueOriginal: number = -1;
            let lTriggerValue: number = lTriggerValueOriginal;

            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.FunctionCallEnd });
            const lFunction: (pValue: number) => number = (pValue: number) => { lTriggerValue = lTriggerValueChanged; return pValue; };
            const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction, lInteractionZone).proxy;

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            let lTriggerValueOnEvent: number | null = null;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy) {
                    lResponseType |= pChangeReason.interactionType;
                    lTriggerValueOnEvent = lTriggerValue;
                }
            });

            // Process
            lProxy(22);

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.FunctionCallEnd);
            expect(lTriggerValueOnEvent).to.equal(lTriggerValueChanged);
        });

        it('-- InteractionResponseType.FunctionCallError after function call', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.FunctionCallError });
            const lFunction: () => number = () => { throw 1; };
            const lProxy: () => number = new InteractionDetectionProxy(lFunction, lInteractionZone).proxy;

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy) {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process
            try {
                lProxy();
            } catch (_) {/* Any */ }

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.FunctionCallError);
        });
    });

    describe('Functionality: Native JS-Objects', () => {
        it('-- Map', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.FunctionCallStart | InteractionResponseType.FunctionCallEnd | InteractionResponseType.NativeFunctionCall });
            const lProxy: Map<string, string> = new InteractionDetectionProxy(new Map(), lInteractionZone).proxy;

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy.set) {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process
            lProxy.set('', '');

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.FunctionCallStart | InteractionResponseType.FunctionCallEnd | InteractionResponseType.NativeFunctionCall);
        });

        describe('-- Array', () => {
            it('-- Property set', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('CD');
                const lProxy: Array<string> = new InteractionDetectionProxy(new Array<string>(), lInteractionZone).proxy;

                // Setup. InteractionZone.
                let lResponseType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lResponseType |= pChangeReason.interactionType;
                    }
                });

                // Process
                lProxy[0] = '';

                // Evaluation.
                expect(lResponseType).to.equal(InteractionResponseType.PropertySetStart | InteractionResponseType.PropertySetEnd);
            });

            it('-- Push set', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.FunctionCallStart | InteractionResponseType.FunctionCallEnd });
                const lProxy: Array<string> = new InteractionDetectionProxy(new Array<string>(), lInteractionZone).proxy;

                // Setup. InteractionZone.
                let lResponseType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy.push) {
                        lResponseType |= pChangeReason.interactionType;
                    }
                });

                // Process
                lProxy.push('');

                // Evaluation.
                expect(lResponseType).to.equal(InteractionResponseType.FunctionCallStart | InteractionResponseType.FunctionCallEnd);
            });
        });

        it('-- Set', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.FunctionCallStart | InteractionResponseType.FunctionCallEnd | InteractionResponseType.NativeFunctionCall });
            const lProxy: Set<string> = new InteractionDetectionProxy(new Set<string>(), lInteractionZone).proxy;


            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy.add) {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process
            lProxy.add('');

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.FunctionCallStart | InteractionResponseType.FunctionCallEnd | InteractionResponseType.NativeFunctionCall);
        });

        it('-- TypedArray', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD');
            const lProxy: Int8Array = new InteractionDetectionProxy(new Int8Array(1), lInteractionZone).proxy;

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy) {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process
            lProxy[0] = 200;

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertySetStart | InteractionResponseType.PropertySetEnd);
        });
    });

    describe('Functionality: InteractionReason.source', () => {
        it('-- Function sync calls', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD');
            const lFunction: (pValue: number) => number = (pValue: number) => { return pValue; };
            const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction, lInteractionZone).proxy;

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lChangedSource = pChangeReason.source;
            });

            // Process
            lProxy(22);

            // Evaluation.
            expect(lChangedSource).to.equal(lProxy);
        });

        it('-- Function async calls', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD');
            const lFunction: (pValue: number) => Promise<any> = async (pValue: number) => { return pValue; };
            const lProxy: (pValue: number) => Promise<number> = new InteractionDetectionProxy(lFunction, lInteractionZone).proxy;

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                // Filter async call detections of patcher
                if (pChangeReason.source === lProxy) {
                    lChangedSource = pChangeReason.source;
                }
            });

            // Process
            await lProxy(22);

            // Evaluation.
            expect(lChangedSource).to.equal(lProxy);
        });

        it('-- Set property ', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD');
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lChangedSource = pChangeReason.source;
            });

            // Process.
            lDetectionProxy.proxy.a = 22;

            // Evaluation.
            expect(lChangedSource).to.equal(lDetectionProxy.proxy);
        });

        it('-- Delete property', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD');
            const lOriginalObject: { a?: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject, lInteractionZone);

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lChangedSource = pChangeReason.source;
            });

            // Process.
            delete lDetectionProxy.proxy.a;

            // Evaluation.
            expect(lChangedSource).to.equal(lDetectionProxy.proxy);
        });
    });

    describe('Functionality: Special behaviour', () => {
        it('-- Prevent property set pollution', () => {
            // Setup.
            const lOriginalObject: { a: object; } = { a: {} };
            const lOriginalInnerObject: object = lOriginalObject.a;
            const lDetectionProxy: { a: object; } = new InteractionDetectionProxy(lOriginalObject, new InteractionZone('Zone', { trigger: InteractionResponseType.None })).proxy;

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
            const lDetectionProxy: IgnoreClass = new InteractionDetectionProxy(lOriginalObject, new InteractionZone('Zone', { trigger: InteractionResponseType.None })).proxy;

            // Evaluation.
            expect(lDetectionProxy).to.equal(lOriginalObject);
        });
    });
});