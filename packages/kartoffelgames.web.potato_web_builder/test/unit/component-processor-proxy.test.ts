import { InteractionZone } from '@kartoffelgames/web.interaction-zone';
import { expect } from 'chai';
import { ComponentInteractionEvent, ComponentInteractionType, ComponentProcessorProxy } from '../../source/core/component/interaction-tracker/component-processor-proxy';
import { IgnoreInteractionTracking } from '../../source/core/component/interaction-tracker/ignore-interaction-detection.decorator';

describe('ComponentProcessorProxy', () => {
    it('Property: proxy', () => {
        // Setup.
        const lOriginalObject: object = { a: 1 };
        const lDetectionProxy: ComponentProcessorProxy<object> = new ComponentProcessorProxy(lOriginalObject);

        // Process.
        const lProxy: object = lDetectionProxy.proxy;

        // Evaluation.
        expect(lProxy).to.not.equal(lOriginalObject);
    });

    describe('Functionality: InteractionZone', () => {
        it('-- Same proxy on double initialization', () => {
            // Setup.
            const lOriginalObject: object = {};

            // Process. First Proxy
            const lFirstInteractionZone: ComponentProcessorProxy<object> = new ComponentProcessorProxy(lOriginalObject);
            const lFirstProxy: object = lFirstInteractionZone.proxy;

            // Process. First Proxy
            const lSecondInteractionZone: ComponentProcessorProxy<object> = new ComponentProcessorProxy(lFirstProxy);
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
                const lDetectionProxy: ComponentProcessorProxy<{ a: number; }> = new ComponentProcessorProxy(lOriginalObject);

                // Process.
                lDetectionProxy.proxy.a = lNewValue;

                // Evaluation.
                expect(lOriginalObject.a).to.equal(lNewValue);
            });

            it('-- Correct value in layered property set', () => {
                // Setup.
                const lNewValue: number = 22;
                const lOriginalObject: { a: { b: number; }; } = { a: { b: 1 } };
                const lDetectionProxy: ComponentProcessorProxy<{ a: { b: number; }; }> = new ComponentProcessorProxy(lOriginalObject);

                // Process.
                lDetectionProxy.proxy.a.b = lNewValue;

                // Evaluation.
                expect(lOriginalObject.a.b).to.equal(lNewValue);
            });

            it('-- Correct interacted property name in reason ', () => {
                // Setup.
                const lOriginalObject: { a: number; } = { a: 1 };
                const lDetectionProxy: ComponentProcessorProxy<{ a: number; }> = new ComponentProcessorProxy(lOriginalObject);
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.property === 'a') {
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
                const lDetectionProxy: ComponentProcessorProxy<any> = new ComponentProcessorProxy(lOriginalObject);
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.property === 'a') {
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
                const lDetectionProxy: ComponentProcessorProxy<any> = new ComponentProcessorProxy(lOriginalObject);

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
                const lDetectionProxy: ComponentProcessorProxy<any> = new ComponentProcessorProxy(lOriginalObject);
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.property === 'a') {
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
                const lDetectionProxy: ComponentProcessorProxy<{ a: number; }> = new ComponentProcessorProxy(lOriginalObject);

                // Process.
                const lResultValue: number = lDetectionProxy.proxy.a;

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Object', () => {
                // Setup.
                const lValue: object = {};
                const lOriginalObject: { a: object; } = { a: lValue };
                const lDetectionProxy: ComponentProcessorProxy<{ a: object; }> = new ComponentProcessorProxy(lOriginalObject);

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
                const lDetectionProxy: ComponentProcessorProxy<{ a: () => void; }> = new ComponentProcessorProxy(lOriginalObject);

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
                const lDetectionProxy: ComponentProcessorProxy<{ a?: number; }> = new ComponentProcessorProxy(lOriginalObject);

                // Process.
                delete lDetectionProxy.proxy.a;

                // Evaluation.
                expect(lOriginalObject.a).to.be.undefined;
            });

            it('-- Detect deletion of correct property', () => {
                // Setup.
                const lOriginalObject: { a?: number; } = { a: 1 };
                const lDetectionProxy: ComponentProcessorProxy<{ a?: number; }> = new ComponentProcessorProxy(lOriginalObject);
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.property === 'a') {
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
                const lDetectionProxy: ComponentProcessorProxy<(pValue: number) => number> = new ComponentProcessorProxy((pValue: number) => { return pValue; });
                const lProxy: (pValue: number) => number = lDetectionProxy.proxy;

                // Process.
                const lResultValue: number = lProxy(lValue);

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Detect interaction on function call', () => {
                // Setup.
                const lFunction: (pValue: number) => number = (pValue: number) => { return pValue; };
                const lProxy: (pValue: number) => number = new ComponentProcessorProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.source === lProxy) {
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
                const lProxy: (pValue: number) => number = new ComponentProcessorProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.source === lProxy) {
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
                const lProxy: (pValue: number) => number = new ComponentProcessorProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.source === lProxy) {
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
                const lProxy: (pValue: number) => number = new ComponentProcessorProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.source === lProxy) {
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
                const lProxy: (pValue: number) => number = new ComponentProcessorProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.source === lProxy) {
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
                const lDetectionProxy: ComponentProcessorProxy<() => number> = new ComponentProcessorProxy(() => { throw lValue; });
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
                const lProxy: () => number = new ComponentProcessorProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.source === lProxy) {
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
                const lDetectionProxy: ComponentProcessorProxy<(pValue: number) => Promise<number>> = new ComponentProcessorProxy(async (pValue: number) => { return pValue; });
                const lProxy: (pValue: number) => Promise<number> = lDetectionProxy.proxy;

                // Process.
                const lResultValue: number = await lProxy(lValue);

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Detect interaction on asyncon calls', async () => {
                // Setup.
                const lFunction: (pValue: number) => Promise<number> = async (pValue: number) => { return pValue; };
                const lProxy: (pValue: number) => Promise<number> = new ComponentProcessorProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.source === lProxy) {
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
                const lDetectionProxy: ComponentProcessorProxy<() => Promise<number>> = new ComponentProcessorProxy(async () => { throw lValue; });
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
                const lProxy: () => Promise<number> = new ComponentProcessorProxy(lFunction).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

                // Setup. InteractionZone.
                let lPropertyChanged: boolean = false;
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.source === lProxy) {
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
                const lProxy = new ComponentProcessorProxy(lObject).proxy;

                // Evaluation.
                expect(lProxy.zone).to.equal(lInteractionZone);
                expect(lProxy.childObject).to.not.equal(lChildObject);
            });
        });

        it('-- getOwnPropertyDescriptor', () => {
            // Setup.
            const lValue: number = 22;
            const lOriginalObject: { a: number; } = { a: lValue };
            const lDetectionProxy: ComponentProcessorProxy<{ a: number; }> = new ComponentProcessorProxy(lOriginalObject);

            // Process.
            const lResultValue: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(lDetectionProxy.proxy, 'a');

            // Evaluation.
            expect(lResultValue?.value).to.equal(lValue);
        });

        it('-- Not dispatch interaction to proxy zone when current zone is silent.', async () => {
            // Setup.
            const lProxyZone: InteractionZone = InteractionZone.current.create('CD')
                .addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.PropertySet);
            const lSilentZone: InteractionZone = InteractionZone.current.create('CD')
                .addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.None);

            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: ComponentProcessorProxy<{ a: number; }> = new ComponentProcessorProxy(lOriginalObject);

            // Setup. Add proxy zone as listener.
            lDetectionProxy.addListenerZone(lProxyZone);

            // Process.
            let lInteractionCounter: number = 0;
            lProxyZone.addInteractionListener(ComponentInteractionType, () => {
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
            const lDetectionProxy: ComponentProcessorProxy<{ a: number; }> = new ComponentProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            const lListenerPromise: Promise<void> = new Promise<void>((pResolve) => {
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.property === 'a') {
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
            const lDetectionProxy: ComponentProcessorProxy<{ a: number; }> = new ComponentProcessorProxy(lOriginalObject);
            const lAttachedInteractionZone: InteractionZone = InteractionZone.current.create('CDAttach');
            const lCurrentInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            const lAttachedListenerPromise: Promise<void> = new Promise<void>((pResolve) => {
                lAttachedInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.property === 'a') {
                        pResolve();
                    }
                });
            });
            const lCurrentListenerPromise: Promise<void> = new Promise<void>((pResolve) => {
                lCurrentInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.property === 'a') {
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
            const lDetectionProxy: ComponentProcessorProxy<{ a: number; }> = new ComponentProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.PropertySet);

            // Setup. InteractionZone.
            let lInteractionCounter: number = 0;
            lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                if (pChangeReason.data.property === 'a') {
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
            const lAttachedZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.PropertySet);
            const lSilentZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.None);

            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: ComponentProcessorProxy<{ a: number; }> = new ComponentProcessorProxy(lOriginalObject);

            // Setup. InteractionZone.
            let lInteractionCounter: number = 0;
            lAttachedZone.addInteractionListener(ComponentInteractionType, () => {
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

    describe('Functionality: ComponentInteractionType', () => {
        it('-- ComponentInteractionType.PropertySetEnd after property set ', () => {
            // Setup.
            const lEndValue: number = 321;
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: ComponentProcessorProxy<{ a: number; }> = new ComponentProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD',).addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.PropertySet);

            // Setup. InteractionZone.
            let lResponseType: ComponentInteractionType = ComponentInteractionType.None;
            let lPropertyValueOnEvent: number | null = null;
            lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
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
            expect(lResponseType).to.equal(ComponentInteractionType.PropertySet);
            expect(lPropertyValueOnEvent).to.equal(lEndValue);
        });

        it('-- ComponentInteractionType.PropertySet on property set error', () => {
            // Setup.
            const lEndValue: number = 321;
            const lOriginalObject: { a: number; } = new class { set a(_pAny: number) { throw 1; } }();
            const lDetectionProxy: ComponentProcessorProxy<{ a: number; }> = new ComponentProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.PropertySet);

            // Setup. InteractionZone.
            let lResponseType: ComponentInteractionType = ComponentInteractionType.None;
            lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                if (pChangeReason.data.property === 'a') {
                    lResponseType |= pChangeReason.trigger;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                try {
                    lDetectionProxy.proxy.a = lEndValue;
                } catch (_) {/* Any */ }
            });

            // Evaluation.
            expect(lResponseType).to.equal(ComponentInteractionType.PropertySet);
        });

        it('-- ComponentInteractionType.PropertyDeleteEnd after property delete ', () => {
            // Setup.
            const lOriginalObject: { a?: number; } = { a: 1 };
            const lDetectionProxy: ComponentProcessorProxy<{ a?: number; }> = new ComponentProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.PropertyDelete);

            // Setup. InteractionZone.
            let lResponseType: ComponentInteractionType = ComponentInteractionType.None;
            let lPropertyValueOnEvent: number | undefined | null = null;
            lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
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
            expect(lResponseType).to.equal(ComponentInteractionType.PropertyDelete);
            expect(lPropertyValueOnEvent).to.be.undefined;
        });

        it('-- ComponentInteractionType.PropertyDelete on property delete error', () => {
            // Setup.
            const lOriginalObject: { a?: number; } = Object.defineProperty({}, 'a', { configurable: false, value: 1 });

            const lDetectionProxy: ComponentProcessorProxy<{ a?: number; }> = new ComponentProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.PropertyDelete);

            // Setup. InteractionZone.
            let lResponseType: ComponentInteractionType = ComponentInteractionType.None;
            lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                if (pChangeReason.data.property === 'a') {
                    lResponseType |= pChangeReason.trigger;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                try {
                    delete lDetectionProxy.proxy.a;
                } catch (_) {/* Any */ }
            });

            // Evaluation.
            expect(lResponseType).to.equal(ComponentInteractionType.PropertyDelete);
        });

        it('-- ComponentInteractionType.FunctionCallEnd after function call', () => {
            // Setup. Trigger values.
            const lTriggerValueChanged: number = 1;
            const lTriggerValueOriginal: number = -1;
            let lTriggerValue: number = lTriggerValueOriginal;

            // Setup.
            const lFunction: (pValue: number) => number = (pValue: number) => { lTriggerValue = lTriggerValueChanged; return pValue; };
            const lProxy: (pValue: number) => number = new ComponentProcessorProxy(lFunction).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.FunctionCall);

            // Setup. InteractionZone.
            let lResponseType: ComponentInteractionType = ComponentInteractionType.None;
            let lTriggerValueOnEvent: number | null = null;
            lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                if (pChangeReason.data.source === lProxy) {
                    lResponseType |= pChangeReason.trigger;
                    lTriggerValueOnEvent = lTriggerValue;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy(22);
            });

            // Evaluation.
            expect(lResponseType).to.equal(ComponentInteractionType.FunctionCall);
            expect(lTriggerValueOnEvent).to.equal(lTriggerValueChanged);
        });

        it('-- ComponentInteractionType.FunctionCall after function call error', () => {
            // Setup.
            const lFunction: () => number = () => { throw 1; };
            const lProxy: () => number = new ComponentProcessorProxy(lFunction).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.FunctionCall);

            // Setup. InteractionZone.
            let lResponseType: ComponentInteractionType = ComponentInteractionType.None;
            lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                if (pChangeReason.data.source === lProxy) {
                    lResponseType |= pChangeReason.trigger;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                try {
                    lProxy();
                } catch (_) {/* Any */ }
            });

            // Evaluation.
            expect(lResponseType).to.equal(ComponentInteractionType.FunctionCall);
        });
    });

    describe('Functionality: Native JS-Objects', () => {
        it('-- Map', () => {
            // Setup.
            const lProxy: Map<string, string> = new ComponentProcessorProxy(new Map()).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.FunctionCall | ComponentInteractionType.UntrackableFunctionCall);

            // Setup. InteractionZone.
            let lResponseType: ComponentInteractionType = ComponentInteractionType.None;
            lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                if (pChangeReason.data.source === lProxy.set) {
                    lResponseType |= pChangeReason.trigger;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy.set('', '');
            });

            // Evaluation.
            expect(lResponseType).to.equal(ComponentInteractionType.FunctionCall | ComponentInteractionType.UntrackableFunctionCall);
        });

        describe('-- Array', () => {
            it('-- Property set', () => {
                // Setup.
                const lProxy: Array<string> = new ComponentProcessorProxy(new Array<string>()).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.PropertySet);

                // Setup. InteractionZone.
                let lResponseType: ComponentInteractionType = ComponentInteractionType.None;
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.source === lProxy) {
                        lResponseType |= pChangeReason.trigger;
                    }
                });

                // Process
                lInteractionZone.execute(() => {
                    lProxy[0] = '';
                });

                // Evaluation.
                expect(lResponseType).to.equal(ComponentInteractionType.PropertySet);
            });

            it('-- Push set', () => {
                // Setup.
                const lProxy: Array<string> = new ComponentProcessorProxy(new Array<string>()).proxy;
                const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.FunctionCall | ComponentInteractionType.UntrackableFunctionCall);

                // Setup. InteractionZone.
                let lResponseType: ComponentInteractionType = ComponentInteractionType.None;
                lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                    if (pChangeReason.data.source === lProxy.push) {
                        lResponseType |= pChangeReason.trigger;
                    }
                });

                // Process
                lInteractionZone.execute(() => {
                    lProxy.push('');
                });

                // Evaluation.
                expect(lResponseType).to.equal(ComponentInteractionType.FunctionCall | ComponentInteractionType.UntrackableFunctionCall);
            });
        });

        it('-- Set', () => {
            // Setup.
            const lProxy: Set<string> = new ComponentProcessorProxy(new Set<string>()).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.FunctionCall | ComponentInteractionType.UntrackableFunctionCall);

            // Setup. InteractionZone.
            let lResponseType: ComponentInteractionType = ComponentInteractionType.None;
            lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                if (pChangeReason.data.source === lProxy.add) {
                    lResponseType |= pChangeReason.trigger;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy.add('');
            });

            // Evaluation.
            expect(lResponseType).to.equal(ComponentInteractionType.FunctionCall | ComponentInteractionType.UntrackableFunctionCall);
        });

        it('-- TypedArray', () => {
            // Setup.
            const lProxy: Int8Array = new ComponentProcessorProxy(new Int8Array(1)).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD').addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.PropertySet);

            // Setup. InteractionZone.
            let lResponseType: ComponentInteractionType = ComponentInteractionType.None;
            lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                if (pChangeReason.data.source === lProxy) {
                    lResponseType |= pChangeReason.trigger;
                }
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy[0] = 200;
            });

            // Evaluation.
            expect(lResponseType).to.equal(ComponentInteractionType.PropertySet);
        });

        describe('-- EventTarget', () => {
            it('-- Custom events', async () => {
                // Setup.
                const lCustomEventName: string = 'custom-event';
                const lProxy: EventTarget = new ComponentProcessorProxy(new EventTarget()).proxy;

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
                const lProxy: HTMLDivElement = new ComponentProcessorProxy(document.createElement('div')).proxy;

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

    describe('Functionality: ComponentInteractionEvent.source', () => {
        it('-- Function sync calls', () => {
            // Setup.
            const lFunction: (pValue: number) => number = (pValue: number) => { return pValue; };
            const lProxy: (pValue: number) => number = new ComponentProcessorProxy(lFunction).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                lChangedSource = pChangeReason.data.source;
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
            const lProxy: (pValue: number) => Promise<number> = new ComponentProcessorProxy(lFunction).proxy;
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                // Filter async call detections of patcher
                if (pChangeReason.data.source === lProxy) {
                    lChangedSource = pChangeReason.data.source;
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
            const lDetectionProxy: ComponentProcessorProxy<{ a: number; }> = new ComponentProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                lChangedSource = pChangeReason.data.source;
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
            const lDetectionProxy: ComponentProcessorProxy<{ a?: number; }> = new ComponentProcessorProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD');

            // Setup. InteractionZone.
            let lChangedSource: any = undefined;
            lInteractionZone.addInteractionListener(ComponentInteractionType, (pChangeReason: ComponentInteractionEvent) => {
                lChangedSource = pChangeReason.data.source;
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
            const lDetectionProxy: { a: object; } = new ComponentProcessorProxy(lOriginalObject).proxy;

            // Process.
            const lProxValue: object = lDetectionProxy.a;
            lDetectionProxy.a = lProxValue;

            // Evaluation.
            expect(lProxValue).to.not.equal(lOriginalInnerObject);
            expect(lOriginalObject.a).to.equal(lOriginalInnerObject);
        });

        it('-- Ignore IgnoreInteractionDetection decorator', () => {
            // Setup. Create Class with ignore decorator.
            @IgnoreInteractionTracking
            class IgnoreClass { }

            // Setup. Create class.
            const lOriginalObject: IgnoreClass = new IgnoreClass();

            // Process. Create proxy.
            const lDetectionProxy: IgnoreClass = new ComponentProcessorProxy(lOriginalObject).proxy;

            // Evaluation.
            expect(lDetectionProxy).to.equal(lOriginalObject);
        });
    });
});