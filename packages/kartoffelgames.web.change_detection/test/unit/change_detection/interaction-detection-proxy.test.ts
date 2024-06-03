import '../../mock/request-animation-frame-mock-session';
import { expect } from 'chai';
import { InteractionDetectionProxy } from '../../../source/change_detection/synchron_tracker/interaction-detection-proxy';
import { InteractionZone } from '../../../source/change_detection/interaction-zone';
import { InteractionReason } from '../../../source/change_detection/interaction-reason';
import { InteractionResponseType } from '../../../source/change_detection/enum/interaction-response-type.enum';

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
        const lInteractionZone: InteractionZone = new InteractionZone('CD');

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
                const lInteractionZone: InteractionZone = new InteractionZone('CD');

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
                const lInteractionZone: InteractionZone = new InteractionZone('CD');

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
                const lInteractionZone: InteractionZone = new InteractionZone('CD');

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
                const lInteractionZone: InteractionZone = new InteractionZone('CD');

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
                const lInteractionZone: InteractionZone = new InteractionZone('CD');

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
                const lInteractionZone: InteractionZone = new InteractionZone('CD');

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
                const lInteractionZone: InteractionZone = new InteractionZone('CD');

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
                const lInteractionZone: InteractionZone = new InteractionZone('CD');

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
                const lInteractionZone: InteractionZone = new InteractionZone('SameName');
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
    });

    describe('Functionality: attachZone', () => {
        it('-- Dispatch interaction to attached zone', async () => {
            // Setup.
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = new InteractionZone('CD');

            // Setup. InteractionZone.
            const lListenerPromise: Promise<void> = new Promise<void>((pResolve) => {
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.property === 'a') {
                        pResolve();
                    }
                });
            });

            // Process.
            lDetectionProxy.attachZone(lInteractionZone);
            lDetectionProxy.proxy.a = 22;

            // Evaluation.
            await lListenerPromise;
        });

        it('-- Dispatch interaction to attached and current zone', async () => {
            // Setup.
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lAttachedInteractionZone: InteractionZone = new InteractionZone('CDAttach');
            const lCurrentInteractionZone: InteractionZone = new InteractionZone('CD');

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

            // Process.
            lDetectionProxy.attachZone(lAttachedInteractionZone);
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
            const lInteractionZone: InteractionZone = new InteractionZone('CD');

            // Setup. InteractionZone.
            let lInteractionCounter: number = 0;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lInteractionCounter++;
                }
            });
            // Process.
            lDetectionProxy.attachZone(lInteractionZone);
            lInteractionZone.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });
    });

    describe('Functionality: InteractionResponseType', () => {
        it('-- InteractionResponseType.PropertySetStart before property set ', () => {
            // Setup. Trigger values.
            const lTriggerValueChanged: number = 1;
            const lTriggerValueOriginal: number = -1;
            let lTriggerValue: number = lTriggerValueOriginal;

            // Setup.
            const lOriginalObject: { a: number; } = new class { get a(): number { lTriggerValue = lTriggerValueChanged; return 1; } }();
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertySetStart });

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
            lInteractionZone.execute(() => {
                lDetectionProxy.proxy.a;
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertySetStart);
            expect(lTriggerValueOnEvent).to.equal(lTriggerValueOriginal);
        });

        it('-- InteractionResponseType.PropertyGetEnd after property get ', () => {
            // Setup. Trigger values.
            const lTriggerValueChanged: number = 1;
            const lTriggerValueOriginal: number = -1;
            let lTriggerValue: number = lTriggerValueOriginal;

            // Setup.
            const lOriginalObject: { a: number; } = new class { get a(): number { lTriggerValue = lTriggerValueChanged; return 1; } }();
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertyGetEnd });

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
            lInteractionZone.execute(() => {
                lDetectionProxy.proxy.a;
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertyGetEnd);
            expect(lTriggerValueOnEvent).to.equal(lTriggerValueChanged);
        });

        it('-- InteractionResponseType.PropertyGetError on property get ', () => {
            // Setup.
            const lOriginalObject: { a: number; } = new class { get a(): number { throw 1; } }();
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertyGetError });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                try {
                    lDetectionProxy.proxy.a;
                } catch (_) {/* Any */ }
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertyGetError);
        });

        it('-- InteractionResponseType.PropertySetStart before property set ', () => {
            // Setup.
            const lStartValue: number = 321;
            const lOriginalObject: { a: number; } = { a: lStartValue };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertySetStart });

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
            lInteractionZone.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertySetStart);
            expect(lPropertyValueOnEvent).to.equal(lStartValue);
        });

        it('-- InteractionResponseType.PropertySetEnd after property set ', () => {
            // Setup.
            const lEndValue: number = 321;
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertySetEnd });

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
            lInteractionZone.execute(() => {
                lDetectionProxy.proxy.a = lEndValue;
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertySetEnd);
            expect(lPropertyValueOnEvent).to.equal(lEndValue);
        });

        it('-- InteractionResponseType.PropertySetError on property set ', () => {
            // Setup.
            const lEndValue: number = 321;
            const lOriginalObject: { a: number; } = new class { set a(_pAny: number) { throw 1; } }();
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertySetError });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                try {
                    lDetectionProxy.proxy.a = lEndValue;
                } catch (_) {/* Any */ }
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertySetError);
        });

        it('-- InteractionResponseType.PropertyDeleteStart before property delete ', () => {
            // Setup.
            const lStartValue: number = 321;
            const lOriginalObject: { a?: number; } = { a: lStartValue };
            const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertyDeleteStart });

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
            lInteractionZone.execute(() => {
                delete lDetectionProxy.proxy.a;
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertyDeleteStart);
            expect(lPropertyValueOnEvent).to.equal(lStartValue);
        });

        it('-- InteractionResponseType.PropertySetEnd after property delete ', () => {
            // Setup.
            const lOriginalObject: { a?: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertySetEnd });

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
            lInteractionZone.execute(() => {
                delete lDetectionProxy.proxy.a;
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertySetEnd);
            expect(lPropertyValueOnEvent).to.be.undefined;
        });

        it('-- InteractionResponseType.PropertySetError on property delete ', () => {
            // Setup.
            const lOriginalObject: { a?: number; } = new class { set a(_pAny: number) { throw 1; } }();
            const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.PropertySetError });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                try {
                    delete lDetectionProxy.proxy.a;
                } catch (_) {/* Any */ }
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertySetError);
        });

        it('-- InteractionResponseType.FunctionCallStart before function call', () => {
            // Setup. Trigger values.
            const lTriggerValueChanged: number = 1;
            const lTriggerValueOriginal: number = -1;
            let lTriggerValue: number = lTriggerValueOriginal;

            // Setup.
            const lFunction: (pValue: number) => number = (pValue: number) => { lTriggerValue = lTriggerValueChanged; return pValue; };
            const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction).proxy;
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.FunctionCallStart });

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
            lInteractionZone.execute(() => {
                lProxy(22);
            });

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
            const lFunction: (pValue: number) => number = (pValue: number) => { lTriggerValue = lTriggerValueChanged; return pValue; };
            const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction).proxy;
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.FunctionCallEnd });

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
            lInteractionZone.execute(() => {
                lProxy(22);
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.FunctionCallEnd);
            expect(lTriggerValueOnEvent).to.equal(lTriggerValueChanged);
        });

        it('-- InteractionResponseType.FunctionCallError after function call', () => {
            // Setup.
            const lFunction: () => number = () => { throw 1; };
            const lProxy: () => number = new InteractionDetectionProxy(lFunction).proxy;
            const lInteractionZone: InteractionZone = new InteractionZone('CD', { trigger: InteractionResponseType.FunctionCallError });

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy) {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                try {
                    lProxy();
                } catch (_) {/* Any */ }
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.FunctionCallError);
        });
    });

    describe('Functionality: Native JS-Objects', () => {
        it('-- Map', () => {
            // Setup.
            const lProxy: Map<string, string> = new InteractionDetectionProxy(new Map()).proxy;
            const lInteractionZone: InteractionZone = new InteractionZone('CD');

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy.set) {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy.set('', '');
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.FunctionCallStart | InteractionResponseType.FunctionCallEnd);
        });

        describe('-- Array', () => {
            it('-- Property set', () => {
                // Setup.
                const lProxy: Array<string> = new InteractionDetectionProxy(new Array<string>()).proxy;
                const lInteractionZone: InteractionZone = new InteractionZone('CD');

                // Setup. InteractionZone.
                let lResponseType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy) {
                        lResponseType |= pChangeReason.interactionType;
                    }
                });

                // Process
                lInteractionZone.execute(() => {
                    lProxy[0] = '';
                });

                // Evaluation.
                expect(lResponseType).to.equal(InteractionResponseType.PropertySetStart | InteractionResponseType.PropertySetEnd);
            });

            it('-- Push set', () => {
                // Setup.
                const lProxy: Array<string> = new InteractionDetectionProxy(new Array<string>()).proxy;
                const lInteractionZone: InteractionZone = new InteractionZone('CD');

                // Setup. InteractionZone.
                let lResponseType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                    if (pChangeReason.source === lProxy.push) {
                        lResponseType |= pChangeReason.interactionType;
                    }
                });

                // Process
                lInteractionZone.execute(() => {
                    lProxy.push('');
                });

                // Evaluation.
                expect(lResponseType).to.equal(InteractionResponseType.FunctionCallStart | InteractionResponseType.FunctionCallEnd);
            });
        });

        it('-- Set', () => {
            // Setup.
            const lProxy: Set<string> = new InteractionDetectionProxy(new Set<string>()).proxy;
            const lInteractionZone: InteractionZone = new InteractionZone('CD');

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy.add) {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy.add('');
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.FunctionCallStart | InteractionResponseType.FunctionCallEnd);
        });

        it('-- TypedArray', () => {
            // Setup.
            const lProxy: Int8Array = new InteractionDetectionProxy(new Int8Array(1)).proxy;
            const lInteractionZone: InteractionZone = new InteractionZone('CD');

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.source === lProxy) {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy[0] = 200;
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.PropertySetStart | InteractionResponseType.PropertySetEnd);
        });
    });

    describe('Functionality: InteractionReason.source', () => {
        it('-- Function sync calls', () => {
            // Setup.
            const lFunction: (pValue: number) => number = (pValue: number) => { return pValue; };
            const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction).proxy;
            const lInteractionZone: InteractionZone = new InteractionZone('CD');

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
            const lInteractionZone: InteractionZone = new InteractionZone('CD');

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
            const lInteractionZone: InteractionZone = new InteractionZone('CD');

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
            const lInteractionZone: InteractionZone = new InteractionZone('CD');

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
    });
});