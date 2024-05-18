import '../../mock/request-animation-frame-mock-session';
import { expect } from 'chai';
import { InteractionDetectionProxy } from '../../../source/change_detection/synchron_tracker/interaction-detection-proxy';
import { ChangeDetection } from '../../../source/change_detection/change-detection';
import { ChangeDetectionReason } from '../../../source/change_detection/change-detection-reason';

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
        const lChangeDetection: ChangeDetection = new ChangeDetection('CD');

        // Setup. ChangeDetection.
        let lPropertyChanged: boolean = false;
        lChangeDetection.addInteractionListener((pChangeReason: ChangeDetectionReason) => {
            if (pChangeReason.property === 'a') {
                lPropertyChanged = true;
            }
        });

        // Process.
        lChangeDetection.execute(() => {
            lDetectionProxy.proxy.a = 22;
        });

        // Evaluation.
        expect(lPropertyChanged).to.be.true;
    });

    describe('Functionality: ChangeDetection', () => {
        it('-- Double initialization', () => {
            // Setup.
            const lOriginalObject: object = {};

            // Process. First Proxy
            const lFirstChangeDetection: InteractionDetectionProxy<object> = new InteractionDetectionProxy(lOriginalObject);
            const lFirstProxy: object = lFirstChangeDetection.proxy;

            // Process. First Proxy
            const lSecondChangeDetection: InteractionDetectionProxy<object> = new InteractionDetectionProxy(lFirstProxy);
            const lSecondProxy: object = lSecondChangeDetection.proxy;

            // Evaluation.
            expect(lFirstProxy).to.equal(lSecondProxy);
            expect(lFirstChangeDetection).to.equal(lSecondChangeDetection);
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

            it('-- Layered change', () => {
                // Setup.
                const lNewValue: number = 22;
                const lOriginalObject: { a: { b: number; }; } = { a: { b: 1 } };
                const lDetectionProxy: InteractionDetectionProxy<{ a: { b: number; }; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                lDetectionProxy.proxy.a.b = lNewValue;

                // Evaluation.
                expect(lOriginalObject.a.b).to.equal(lNewValue);
            });

            it('-- Hook', () => {
                // Setup.
                const lOriginalObject: { a: number; } = { a: 1 };
                const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
                const lChangeDetection: ChangeDetection = new ChangeDetection('CD');

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.addInteractionListener((pChangeReason: ChangeDetectionReason) => {
                    if (pChangeReason.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lChangeDetection.execute(() => {
                    lDetectionProxy.proxy.a = 22;
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Nested callback', () => {
                const lNewValue: number = 22;
                const lOriginalObject = {
                    a: 0,
                    fun: function () {
                        return this;
                    }
                };
                const lDetectionProxy: InteractionDetectionProxy<any> = new InteractionDetectionProxy(lOriginalObject);
                const lChangeDetection: ChangeDetection = new ChangeDetection('CD');

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.addErrorListener((pChangeReason: ChangeDetectionReason) => {
                    if (pChangeReason.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lChangeDetection.execute(() => {
                    lDetectionProxy.proxy.fun().a = lNewValue;
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
                expect(lOriginalObject.a).to.equal(lNewValue);
            });

            it('-- Deep nested callback with arrow functions', () => {
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
                const lChangeDetection: ChangeDetection = new ChangeDetection('CD');

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.addInteractionListener((pChangeReason: ChangeDetectionReason) => {
                    if (pChangeReason.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lChangeDetection.execute(() => {
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

            it('-- Layered change detection', () => {
                // Setup.
                const lOriginalObject: { a: { b: number; }; } = { a: { b: 1 } };
                const lDetectionProxy: InteractionDetectionProxy<{ a: { b: number; }; }> = new InteractionDetectionProxy(lOriginalObject);
                const lChangeDetection: ChangeDetection = new ChangeDetection('CD');

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.addInteractionListener((pChangeReason: ChangeDetectionReason) => {
                    if (pChangeReason.property === 'b') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lChangeDetection.execute(() => {
                    lDetectionProxy.proxy.a.b = 22;
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });
        });

        describe('-- DELETE', () => {
            it('-- Default', () => {
                // Setup.
                const lOriginalObject: { a?: number; } = { a: 1 };
                const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject);

                // Process.
                delete lDetectionProxy.proxy.a;

                // Evaluation.
                expect(lOriginalObject.a).to.be.undefined;
            });

            it('-- Hook', () => {
                // Setup.
                const lOriginalObject: { a?: number; } = { a: 1 };
                const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject);
                const lChangeDetection: ChangeDetection = new ChangeDetection('CD');

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.addInteractionListener((pChangeReason: ChangeDetectionReason) => {
                    if (pChangeReason.property === 'a') {
                        lPropertyChanged = true;
                    }
                });

                // Process.
                lChangeDetection.execute(() => {
                    delete lDetectionProxy.proxy.a;
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });
        });

        describe('-- APPLY', () => {
            it('-- Sync call success', () => {
                // Setup.
                const lValue: number = 22;
                const lDetectionProxy: InteractionDetectionProxy<(pValue: number) => number> = new InteractionDetectionProxy((pValue: number) => { return pValue; });
                const lProxy: (pValue: number) => number = lDetectionProxy.proxy;

                // Process.
                const lResultValue: number = lProxy(lValue);

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Hook - Sync call success', () => {
                // Setup.
                const lFunction: (pValue: number) => number = (pValue: number) => { return pValue; };
                const lDetectionProxy: InteractionDetectionProxy<(pValue: number) => number> = new InteractionDetectionProxy(lFunction);
                const lProxy: (pValue: number) => number = lDetectionProxy.proxy;
                const lChangeDetection: ChangeDetection = new ChangeDetection('CD');

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.addInteractionListener((pChangeReason: ChangeDetectionReason) => {
                    if (pChangeReason.source === lFunction) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                lChangeDetection.execute(() => {
                    lProxy(22);
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Sync call error', () => {
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

            it('-- Hook - Sync call error', () => {
                // Setup.
                const lFunction: () => number = () => { throw 22; };
                const lDetectionProxy: InteractionDetectionProxy<() => number> = new InteractionDetectionProxy(lFunction);
                const lProxy: () => number = lDetectionProxy.proxy;
                const lChangeDetection: ChangeDetection = new ChangeDetection('CD');

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.addInteractionListener((pChangeReason: ChangeDetectionReason) => {
                    if (pChangeReason.source === lFunction) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                try {
                    lChangeDetection.execute(() => {
                        lProxy();
                    });
                } catch (e) {/* Empty */ }

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Async call success', async () => {
                // Setup.
                const lValue: number = 22;
                const lDetectionProxy: InteractionDetectionProxy<(pValue: number) => Promise<number>> = new InteractionDetectionProxy(async (pValue: number) => { return pValue; });
                const lProxy: (pValue: number) => Promise<number> = lDetectionProxy.proxy;

                // Process.
                const lResultValue: number = await lProxy(lValue);

                // Evaluation.
                expect(lResultValue).to.equal(lValue);
            });

            it('-- Hook - async call success', async () => {
                // Setup.
                const lFunction: (pValue: number) => Promise<number> = async (pValue: number) => { return pValue; };
                const lDetectionProxy: InteractionDetectionProxy<(pValue: number) => Promise<number>> = new InteractionDetectionProxy(lFunction);
                const lProxy: (pValue: number) => Promise<number> = lDetectionProxy.proxy;
                const lChangeDetection: ChangeDetection = new ChangeDetection('CD');

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.addInteractionListener((pChangeReason: ChangeDetectionReason) => {
                    if (pChangeReason.source === lFunction) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                await lChangeDetection.execute(async () => {
                    return lProxy(22);
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });

            it('-- Async call error', async () => {
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

            it('-- Hook - Async call error', async () => {
                // Setup.
                const lFunction: () => Promise<number> = async () => { throw 22; };
                const lDetectionProxy: InteractionDetectionProxy<() => Promise<number>> = new InteractionDetectionProxy(lFunction);
                const lProxy: () => Promise<number> = lDetectionProxy.proxy;
                const lChangeDetection: ChangeDetection = new ChangeDetection('CD');

                // Setup. ChangeDetection.
                let lPropertyChanged: boolean = false;
                lChangeDetection.addInteractionListener((pChangeReason: ChangeDetectionReason) => {
                    if (pChangeReason.source === lFunction) {
                        lPropertyChanged = true;
                    }
                });

                // Process
                await lChangeDetection.execute(async () => {
                    return lProxy().catch((_pError) => { /* Empty */ });
                });

                // Evaluation.
                expect(lPropertyChanged).to.be.true;
            });
        });

        describe('-- getOwnPropertyDescriptor', () => {
            it('-- Default', () => {
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
    });
});