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

    describe('Functionality: InteractionResponseType', () => {
        it('-- InteractionResponseType.SyncronProperty on property set ', () => {
            // Setup.
            const lOriginalObject: { a: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = new InteractionZone('CD');

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                lDetectionProxy.proxy.a = 22;
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.SyncronProperty);
        });

        it('-- InteractionResponseType.SyncronProperty on property delete', () => {
            // Setup.
            const lOriginalObject: { a?: number; } = { a: 1 };
            const lDetectionProxy: InteractionDetectionProxy<{ a?: number; }> = new InteractionDetectionProxy(lOriginalObject);
            const lInteractionZone: InteractionZone = new InteractionZone('CD');

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                if (pChangeReason.property === 'a') {
                    lResponseType |= pChangeReason.interactionType;
                }
            });

            // Process.
            lInteractionZone.execute(() => {
                delete lDetectionProxy.proxy.a;
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.SyncronProperty);
        });

        it('-- InteractionResponseType.SyncronCall on function call', () => {
            // Setup.
            const lFunction: (pValue: number) => number = (pValue: number) => { return pValue; };
            const lProxy: (pValue: number) => number = new InteractionDetectionProxy(lFunction).proxy;
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
                lProxy(22);
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.SyncronCall);
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
            expect(lResponseType).to.equal(InteractionResponseType.SyncronCall);
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
                expect(lResponseType).to.equal(InteractionResponseType.SyncronProperty);
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
                expect(lResponseType).to.equal(InteractionResponseType.SyncronCall);
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
            expect(lResponseType).to.equal(InteractionResponseType.SyncronCall);
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
            expect(lResponseType).to.equal(InteractionResponseType.SyncronProperty);
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

    describe('-- Functionality: Ignore InteractionZones', () => {
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
});