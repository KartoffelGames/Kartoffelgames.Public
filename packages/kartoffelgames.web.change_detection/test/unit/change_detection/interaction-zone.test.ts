import '../../mock/request-animation-frame-mock-session';
import { expect } from 'chai';
import { InteractionZone } from '../../../source/change_detection/interaction-zone';
import { PreventableErrorEvent, PromiseRejectionEvent } from '../../mock/error-event';
import { InteractionReason } from '../../../source/change_detection/interaction-reason';
import { InteractionResponseType } from '../../../source/change_detection/enum/interaction-response-type.enum';
import { Patcher } from '../../../source/change_detection/execution_zone/patcher/patcher';
import { Exception } from '@kartoffelgames/core.data';

describe('InteractionZone', () => {
    it('Static Property: current', () => {
        it('-- Available Zone', () => {
            // Setup.
            const lName: string = 'InnerCD';
            const lFirstInteractionZone: InteractionZone = new InteractionZone('Name');
            const lSecondInteractionZone: InteractionZone = new InteractionZone(lName);

            // Process.
            let lCurrentInteractionZoneName: string | null = null;
            lFirstInteractionZone.execute(() => {
                lSecondInteractionZone.execute(() => {
                    lCurrentInteractionZoneName = InteractionZone.current.name;
                });
            });

            // Evaluation.
            expect(lCurrentInteractionZoneName).to.equal(lName);
        });

        it('-- No Zone', () => {
            // Process.
            const lCurrentInteractionZone: InteractionZone = InteractionZone.current;

            // Evaluation.
            expect(lCurrentInteractionZone).to.be.null;
        });
    });

    describe('Static Method: dispatchInteractionEvent', () => {
        it('-- Default', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.SyncronProperty, new Object(), 2);

            // Process. Add listener.
            let lReasonResult: InteractionReason | null = null;
            const lListener = (pReason: InteractionReason) => {
                lReasonResult = pReason;
            };
            lInteractionZone.addInteractionListener(lListener);

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.dispatchInteractionEvent(lReason);
            });

            // Evaluation.
            expect(lReasonResult).to.equal(lReason);
        });

        it('-- Pass through', () => {
            // Setup.
            const lParentInteractionZone: InteractionZone = new InteractionZone('Name');
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.SyncronProperty, new Object(), 2);

            // Setup. Child.
            const lChildInteractionZoneName: string = 'CD-child';
            const lInteractionZone: InteractionZone = lParentInteractionZone.execute(() => {
                return new InteractionZone(lChildInteractionZoneName);
            });

            // Process. Add listener.
            let lReasonResult: InteractionReason | null = null;
            const lListener = (pReason: InteractionReason) => {
                lReasonResult = pReason;
            };
            lParentInteractionZone.addInteractionListener(lListener);

            // Process. Dispatch event on child.
            lInteractionZone!.execute(() => {
                InteractionZone.dispatchInteractionEvent(lReason);
            });

            // Evaluation.
            expect(lReasonResult).to.equal(lReason);
        });

        it('-- Preserve interaction zone in interaction listener.', () => {
            // Setup.
            const lParentInteractionZone: InteractionZone = new InteractionZone('Name');
            const lZoneName: string = 'CD-child';

            // Setup. Child.
            const lInteractionZone: InteractionZone = lParentInteractionZone.execute(() => {
                return new InteractionZone(lZoneName);
            });

            // Process. Add listener.
            let lExecutingInteractionZoneName: string | null = null;
            const lListener = () => {
                lExecutingInteractionZoneName = InteractionZone.current.name;
            };
            lParentInteractionZone.addInteractionListener(lListener);

            // Process. Dispatch event on child.
            lInteractionZone!.execute(() => {
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.SyncronProperty, new Object()));
            });

            // Evaluation.
            expect(lExecutingInteractionZoneName).to.equal(lZoneName);
        });

        it('-- Preserve execution change detection. Zone execution.', () => {
            // Setup.
            const lParentInteractionZone: InteractionZone = new InteractionZone('Name');

            // Setup. Child.
            const lChildInteractionZoneName: string = 'CD-child';
            const lInteractionZone: InteractionZone = lParentInteractionZone.execute(() => {
                return new InteractionZone(lChildInteractionZoneName);
            });

            // Process. Add listener.
            let lExecutingInteractionZoneName: string | null = null;
            const lListener = () => {
                lExecutingInteractionZoneName = InteractionZone.current.name;
            };
            lParentInteractionZone.addInteractionListener(lListener);

            // Process. Dispatch event on child..
            lInteractionZone!.execute(() => {
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.SyncronProperty, new Object()));
            });

            // Evaluation.
            expect(lExecutingInteractionZoneName).to.equal(lChildInteractionZoneName);
        });

        it('-- Prevent loops', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.SyncronProperty, new Object(), 2);

            // Process. Add listener.
            let lCounter: number = 0;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lCounter++;
                InteractionZone.dispatchInteractionEvent(pReason);
            });

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.dispatchInteractionEvent(lReason);
            });

            // Evaluation.
            expect(lCounter).to.equal(1);
        });
    });

    describe('Static Method: registerObject', () => {
        it('-- EventTarget input event', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lEventTarget: EventTarget = new EventTarget();

            // Process. Track object.
            const lTrackedEventTarget: EventTarget = InteractionZone.registerObject(lEventTarget);

            // Process. Track change event.
            let lChangeEventCalled: boolean = false;
            lInteractionZone.addInteractionListener(() => {
                lChangeEventCalled = true;
            });

            // Process. Call input event.
            lInteractionZone.execute(() => {
                lTrackedEventTarget.dispatchEvent(new Event('input'));
            });

            // Evaluation.
            expect(lChangeEventCalled).to.be.true;
        });

        it('-- Object change detection', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lOriginalObject: { a: number; } = { a: 1 };

            // Process. Track object.
            const lTrackedEventTarget: { a: number; } = InteractionZone.registerObject(lOriginalObject);

            // Process. Track change event.
            let lChangeEventCalled: boolean = false;
            let lReason: InteractionReason | null = null;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lChangeEventCalled = true;
                lReason = pReason;
            });

            // Process. Change detection.
            lInteractionZone.execute(() => {
                lTrackedEventTarget.a = 2;
            });

            // Evaluation.
            expect(lChangeEventCalled).to.be.true;
            expect(lReason!.property).to.equal('a');
            expect(lReason!.interactionType).to.equal(InteractionResponseType.SyncronProperty);
        });
    });

    it('Static Property: current', () => {
        // Process.
        const lCurrentZone: InteractionZone = InteractionZone.current;

        // Evaluation.
        expect(lCurrentZone.name).to.equal('Default');
    });

    describe('Static Method: dispatchInteractionEvent', () => {
        it('-- Passthrough change reason', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('ZoneName');
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Syncron, {});

            // Process.
            let lResultReason: InteractionReason | null = null;
            lZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lResultReason = pChangeReason;
            });
            lZone.execute(() => {
                InteractionZone.dispatchInteractionEvent(lReason);
            });

            // Evaluation.
            expect(lResultReason).to.equal(lReason);
        });

        it('-- Keep stacktrace', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('ZoneName');

            // Process.
            let lResultStack: string = '';
            lZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lResultStack = pChangeReason.stacktrace;
            });
            lZone.execute(() => {
                function lMycoolname() {
                    InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.Syncron, {}));
                }
                lMycoolname();
            });

            // Evaluation.
            expect(lResultStack).to.contain('lMycoolname');
        });

        it('-- Inore other zones.', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('ZoneName');
            const lZoneDifferent: InteractionZone = new InteractionZone('ZoneName1');
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Syncron, {});

            // Process.
            let lResultReason: InteractionReason | null = null;
            lZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lResultReason = pChangeReason;
            });
            lZoneDifferent.execute(() => {
                InteractionZone.dispatchInteractionEvent(lReason);
            });

            // Evaluation.
            expect(lResultReason).to.be.null;
        });
    });

    it('Property: name', () => {
        // Setup.
        const lName: string = 'CD-Name';
        const lInteractionZone: InteractionZone = new InteractionZone(lName);

        // Process.
        const lNameResult: string = lInteractionZone.name;

        // Evaluation.
        expect(lNameResult).to.equal(lName);
    });

    describe('Property: parent', () => {
        it('-- Set parent', () => {
            // Setup.
            const lParentName: string = 'InnerCD';
            const lParentInteractionZone: InteractionZone = new InteractionZone(lParentName);
            const lChildInteractionZone: InteractionZone = lParentInteractionZone.execute(() => {
                return new InteractionZone('Name');
            });

            // Process.
            const lParentInteractionZoneName: string | undefined = lChildInteractionZone!.parent?.name;

            // Evaluation.
            expect(lParentInteractionZoneName).to.equal(lParentName);
        });

        it('-- No parent', () => {
            // Setup.
            const lChildInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.None, isolate: true });

            // Process.
            const lParentInteractionZone: InteractionZone | null = lChildInteractionZone.parent;

            // Evaluation.
            expect(lParentInteractionZone).to.be.null;
        });

        it('-- No parent without trigger', () => {
            // Process
            const lErrorFunction = () => {
                new InteractionZone('Name', { isolate: true });
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(Exception, 'Interactions zones without a zone needs to set trigger.');
        });
    });

    it('Method: addChangeListener', () => {
        // Setup.
        const lInteractionZone: InteractionZone = new InteractionZone('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lInteractionZone.addInteractionListener(lListener);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.SyncronProperty, new Object()));
        });

        // Evaluation.
        expect(lListenerCalled).to.be.true;
    });

    describe('Method: addErrorListener', () => {
        it('-- Get syncron error inside zone', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lError: string = 'ERROR-MESSAGE';

            // Process. Set error listener.
            const lErrorWaiter = new Promise<string>((pResolve) => {
                lInteractionZone.addErrorListener((pError: string) => {
                    pResolve(pError);
                });
            });

            // Process. Throw error in zone.
            try {
                lInteractionZone.execute(() => {
                    throw lError;
                });
            } catch (pError) {
                const lError: string = <string>pError;
                window.dispatchEvent(new ErrorEvent('error', {
                    error: lError,
                    message: lError,
                }));
            }

            // Process. Wait for error.
            const lErrorResult = await lErrorWaiter;

            // Evaluation.
            expect(lErrorResult).to.equal(lError);
        });

        it('-- Get asyncron error inside zone', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lError: string = 'ERROR-MESSAGE';

            // Process. Set error listener.
            const lErrorWaiter = new Promise<string>((pResolve) => {
                lInteractionZone.addErrorListener((pError: string) => {
                    pResolve(pError);
                });
            });

            // Process. Create promise in zone. 
            const lPromise: Promise<void> = lInteractionZone.execute(async () => {
                return new Promise<void>(() => { });
            });

            // Process. "Throw" promise into global scope.
            window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                promise: <Promise<void>><any>lPromise,
                reason: lError
            }));

            // Process. Wait for error.
            const lErrorResult = await lErrorWaiter;

            // Evaluation.
            expect(lErrorResult).to.equal(lError);
        });

        it('-- Prevent default on syncron errors in zone', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lError: string = 'ERROR-MESSAGE';

            // Setup. Set error listener.
            lInteractionZone.addErrorListener((_pError: string) => {
                return false;
            });

            // Process. Global error listener.
            let lErrorPrevented: boolean = false;
            const lErrorListener = (pEvent: PreventableErrorEvent) => {
                lErrorPrevented = pEvent.defaultWasPrevented;
            };
            window.addEventListener('error', <any>lErrorListener);

            // Process. Throw error inside change detection zone.
            try {
                lInteractionZone.execute(() => {
                    throw lError;
                });
            } catch (pError) {
                const lError: string = <string>pError;
                window.dispatchEvent(new PreventableErrorEvent('error', {
                    error: lError,
                    message: lError,
                }));
            }

            // Cleanup.
            window.removeEventListener('error', <any>lErrorListener);

            // Evaluation.
            expect(lErrorPrevented).to.be.true;
        });

        it('-- Ignore syncron errors outside zone', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            lInteractionZone.addErrorListener((_pError: string) => {
                lErrorListenerCalled = true;
            });

            // Process. Throw error in zone.
            try {
                throw 11;
            } catch (pError) {
                const lError: number = <number>pError;
                window.dispatchEvent(new ErrorEvent('error', {
                    error: lError,
                    message: lError.toString(),
                }));
            }

            // Evaluation.
            expect(lErrorListenerCalled).to.be.false;
        });

        it('-- Ignore asyncron errors outside zone', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            lInteractionZone.addErrorListener((_pError: string) => {
                lErrorListenerCalled = true;
            });

            // Process. "Throw" promise into global scope.
            window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                promise: new Promise<void>(() => { }),
                reason: 'Anything'
            }));

            // Evaluation.
            expect(lErrorListenerCalled).to.be.false;
        });

        it('-- Ignore asyncron errors without zone', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            lInteractionZone.addErrorListener((_pError: string) => {
                lErrorListenerCalled = true;
            });

            const lPromise = new Promise<void>(() => { });
            (<WeakMap<Promise<unknown>, InteractionZone>>(<any>Patcher).mPromizeZones).delete(lPromise);

            // Process. "Throw" promise into global scope.
            window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                promise: lPromise,
                reason: 'Anything'
            }));

            // Evaluation.
            expect(lErrorListenerCalled).to.be.false;
        });

        it('-- Get syncron errors of child zone', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lChildInteractionZone: InteractionZone = lInteractionZone.execute(() => {
                return new InteractionZone('Child');
            });
            const lError: string = 'ERROR-MESSAGE';

            // Process. Set error listener.
            const lErrorWaiter = new Promise<string>((pResolve) => {
                lInteractionZone.addErrorListener((pError: string) => {
                    pResolve(pError);
                });
            });

            // Process. Throw error in zone.
            try {
                lChildInteractionZone.execute(() => {
                    throw lError;
                });
            } catch (pError) {
                const lError: string = <string>pError;
                window.dispatchEvent(new ErrorEvent('error', {
                    error: lError,
                    message: lError,
                }));
            }

            const lErrorResult: string = await lErrorWaiter;

            // Evaluation.
            expect(lErrorResult).to.equal(lError);
        });

        it('-- Continue detection after error', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lEventTarget: HTMLDivElement = document.createElement('div');

            // Process. Track change event.
            let lChangeEventCalled: boolean = false;
            lInteractionZone.addInteractionListener(() => {
                lChangeEventCalled = true;
            });

            // Process. Throw error.
            try {
                lInteractionZone.execute(() => {
                    InteractionZone.registerObject(lEventTarget);
                    throw '';
                });
            } catch (_pError) { /* Empty */ }

            // Process. Call input event.
            lEventTarget.dispatchEvent(new Event('input'));

            // Evaluation.
            expect(lChangeEventCalled).to.be.true;
        });
    });

    it('Property: name', () => {
        // Setup.
        const lZoneName: string = 'ZoneName';
        const lZone: InteractionZone = new InteractionZone(lZoneName);

        // Process.
        const lNameResult: string = lZone.name;

        // Evaluation.
        expect(lNameResult).to.equal(lZoneName);
    });

    it('Method: addInteractionListener', () => {
        // Setup.
        const lZone: InteractionZone = new InteractionZone('ZoneName');
        const lSource = {};

        // Process.
        let lResultSource: any;
        lZone.addInteractionListener((pChangeReason: InteractionReason) => {
            lResultSource = pChangeReason.source;
        });
        lZone.execute(() => {
            InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.SyncronCall, lSource));
        });

        // Evaluation.
        expect(lResultSource).to.equal(lSource);
    });

    describe('Method: execute', () => {
        it('-- Execute inside zone', () => {
            // Setup.
            const lZoneName: string = 'ZoneName';
            const lZone: InteractionZone = new InteractionZone(lZoneName);

            // Process.
            let lZoneNameResult: string | null = null;
            lZone.execute(() => {
                lZoneNameResult = InteractionZone.current.name;
            });

            // Evaluation.
            expect(lZoneNameResult).to.equal(lZoneName);
        });

        it('-- Execute inside zone with parameter', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Name');
            const lExecutionResult: string = 'ExecutionResult';

            // Process.
            const lResult: string = lZone.execute((pParameter: string) => {
                return pParameter;
            }, lExecutionResult);

            // Evaluation.
            expect(lResult).to.equal(lExecutionResult);
        });

        it('-- Execute inside zone with error', () => {
            // Setup.
            const lZoneName: string = 'ZoneName';
            const lZone: InteractionZone = new InteractionZone(lZoneName);
            const lError: string = 'ErrorName';

            // Process.
            let lZoneNameResult: string | null = null;
            let lErrorResult: string | null = null;
            try {
                lZone.execute(() => {
                    lZoneNameResult = InteractionZone.current.name;
                    throw lError;
                });
            } catch (pError) {
                lErrorResult = <string>pError;
            }

            // Evaluation.
            expect(lZoneNameResult).to.equal(lZoneName);
            expect(lErrorResult).to.equal(lError);
        });

        it('-- Error inside zone, ensure correct zones', () => {
            // Setup.
            const lZoneName: string = 'ZoneName';
            const lZone: InteractionZone = new InteractionZone(lZoneName);

            // Process.
            let lZoneNameResultFunktion: string | null = null;
            let lZoneNameResultException: string | null = null;
            const lZoneNameResultBefore = InteractionZone.current.name;
            try {
                lZone.execute(() => {
                    lZoneNameResultFunktion = InteractionZone.current.name;
                    throw '';
                });
            } catch (pError) {
                lZoneNameResultException = InteractionZone.current.name;
            }
            const lZoneNameResultAfter = InteractionZone.current.name;

            // Evaluation.
            expect(lZoneNameResultBefore).to.equal('Default');
            expect(lZoneNameResultFunktion).to.equal(lZoneName);
            expect(lZoneNameResultException).to.equal('Default');
            expect(lZoneNameResultAfter).to.equal('Default');
        });

        it('-- Check interaction callback', () => {
            // Setup.
            const lZoneName: string = 'ZoneName';
            const lZone: InteractionZone = new InteractionZone(lZoneName);
            const lFunction = () => { /* Empty */ };

            // Process.
            let lExecutedFunction: any;
            let lZoneNameResult: string | null = null;
            lZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lZoneNameResult = pChangeReason.zone.name;
                lExecutedFunction = pChangeReason.source;
            });
            lZone.execute(() => {
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.SyncronCall, lFunction));
            });

            // Evaluation.
            expect(lZoneNameResult).to.equal(lZoneName);
            expect(lExecutedFunction).to.equal(lFunction);
        });
    });

    describe('Functionality: DetectionCatchType', () => {
        it('-- DetectionCatchType.None', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.None });

            // Process.
            let lResponeType: InteractionResponseType | null = null;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType = pReason.interactionType;
            });
            lInteractionZone.execute(() => {
                const lEventTarget: EventTarget = new EventTarget();
                lEventTarget.dispatchEvent(new Event('click'));
            });

            // Evaluation.
            expect(lResponeType).to.be.null;
        });

        it('-- DetectionCatchType.SyncronCall', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.SyncronCall });
            const lFunction: () => void = InteractionZone.registerObject(() => { });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            lInteractionZone.execute(() => {
                lFunction();
            });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.SyncronCall);
        });

        it('-- DetectionCatchType.SyncronProperty', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.SyncronProperty });
            const lObject: { a: number; } = InteractionZone.registerObject({ a: 0 });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            lInteractionZone.execute(() => {
                lObject.a = 2;
            });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.SyncronProperty);
        });

        it('-- DetectionCatchType.Syncron', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.Syncron });
            const lObject: { a: number; } = InteractionZone.registerObject({ a: 0 });
            const lFunction: () => void = InteractionZone.registerObject(() => { });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            lInteractionZone.execute(() => {
                lObject.a = 2;
                lFunction();
            });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.Syncron);
        });

        describe('-- DetectionCatchType.AsnychronPromise', async () => {
            it('-- Promise callback', async () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.AsnychronPromise });

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                await lInteractionZone.execute(async () => {
                    return new Promise<void>((pResolve) => {
                        pResolve();
                    });
                });

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.AsnychronPromise);
            });

            it('-- Promise then', async () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.AsnychronPromise });
                const lPromise: Promise<void> = new Promise<void>((pResolve) => { pResolve(); });

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                await lInteractionZone.execute(async () => {
                    return lPromise.then(() => { /* Empty */ });
                });

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.AsnychronPromise);
            });

            it('-- Promise catch', async () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.AsnychronPromise });
                const lPromise: Promise<void> = new Promise<void>((_pResolve, pReject) => { pReject(); });

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                await lInteractionZone.execute(async () => {
                    return lPromise.catch(() => { /* Empty */ });
                });

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.AsnychronPromise);
            });
        });

        it('-- DetectionCatchType.AsnychronCallback', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.AsnychronCallback });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            await lInteractionZone.execute(async () => {
                return new Promise<void>((pResolve) => {
                    globalThis.setTimeout(() => { pResolve(); }, 10);
                });
            });

            // Evaluation. Filter Promise async flags.
            expect(lResponeType & InteractionResponseType.AsnychronCallback).to.be.equal(InteractionResponseType.AsnychronCallback);
        });

        it('-- DetectionCatchType.AsnychronEvent', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.AsnychronEvent });
            const lEventTarget: EventTarget = new EventTarget();

            // Process.
            let lResponeType: InteractionResponseType | null = null;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType = pReason.interactionType;
            });
            lInteractionZone.execute(() => {
                lEventTarget.addEventListener('click', () => { /* This should be called. */ });
            });

            lEventTarget.dispatchEvent(new Event('click'));

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.AsnychronEvent);
        });

        it('-- DetectionCatchType.Asnychron', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.Asnychron });
            const lEventTarget: EventTarget = new EventTarget();

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            await lInteractionZone.execute(async () => {
                // AsnychronEvent calls.
                lEventTarget.addEventListener('click', () => { /* This should be called. */ });

                // Promise and async callback
                return new Promise<void>((pResolve) => {
                    globalThis.setTimeout(() => { pResolve(); }, 10);
                });
            });

            lEventTarget.dispatchEvent(new Event('click'));

            // Evaluation. Filter Promise async flags.
            expect(lResponeType).to.be.equal(InteractionResponseType.Asnychron);
        });

        it('-- DetectionCatchType.Any', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.Any });
            const lEventTarget: EventTarget = new EventTarget();
            const lObject: { a: number; } = InteractionZone.registerObject({ a: 0 });
            const lFunction: () => void = InteractionZone.registerObject(() => { });

            // Process. Async
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            await lInteractionZone.execute(async () => {
                // AsnychronEvent calls.
                lEventTarget.addEventListener('click', () => { /* This should be called. */ });

                // Promise and async callback
                return new Promise<void>((pResolve) => {
                    globalThis.setTimeout(() => { pResolve(); }, 10);
                });
            });

            lEventTarget.dispatchEvent(new Event('click'));

            // Process. Sync
            lInteractionZone.execute(() => {
                lObject.a = 2;
                lFunction();
            });

            // Evaluation. Filter Promise async flags.
            expect(lResponeType).to.be.equal(InteractionResponseType.Any);
        });

        it('-- Negative', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.AsnychronPromise });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            lInteractionZone.execute(() => {
                const lEventTarget: EventTarget = new EventTarget();
                lEventTarget.addEventListener('custom', () => { });
                lEventTarget.dispatchEvent(new Event('custom'));
            });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.None);
        });

        it('-- Negative no zone execution', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.Any });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            lInteractionZone.execute(() => { /* Empty */ });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.None);
        });
    });
});