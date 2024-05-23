import '../../mock/request-animation-frame-mock-session';
import { expect } from 'chai';
import { InteractionZone } from '../../../source/change_detection/interaction-zone';
import { PreventableErrorEvent, PromiseRejectionEvent } from '../../mock/error-event';
import { InteractionReason } from '../../../source/change_detection/interaction-reason';
import { InteractionResponseType } from '../../../source/change_detection/enum/interaction-response-type.enum';

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
            let lChildInteractionZone: InteractionZone;
            lParentInteractionZone.execute(() => {
                lChildInteractionZone = new InteractionZone('Name');
            });

            // Process.
            const lParentInteractionZoneName: string | undefined = lChildInteractionZone!.parent?.name;

            // Evaluation.
            expect(lParentInteractionZoneName).to.equal(lParentName);
        });

        it('-- No parent', () => {
            // Setup.
            const lChildInteractionZone: InteractionZone = new InteractionZone('Name', { isolate: true });

            // Process.
            const lParentInteractionZone: InteractionZone | null = lChildInteractionZone.parent;

            // Evaluation.
            expect(lParentInteractionZone).to.be.null;
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

    it('Method: addErrorListener', () => {
        // Setup.
        const lInteractionZone: InteractionZone = new InteractionZone('Name');

        // Process. Add and remove listener.
        let lListenerCalled: boolean = false;
        lInteractionZone.addErrorListener(() => {
            lListenerCalled = true;
        });

        // Process. Throw error inside change detection zone.
        try {
            lInteractionZone.execute(() => {
                throw 11;
            });
        } catch (pError) {
            const lError: number = <number>pError;
            window.dispatchEvent(new ErrorEvent('error', {
                error: lError,
                message: lError.toString(),
            }));
        }

        // Evaluation.
        expect(lListenerCalled).to.be.true;
    });

    describe('Method: dispatchChangeEvent', () => {
        it('-- Default', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.SyncronProperty, new Object(), 2);

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            let lReasonResult: InteractionReason | null = null;
            const lListener = (pReason: InteractionReason) => {
                lListenerCalled = true;
                lReasonResult = pReason;
            };
            lInteractionZone.addInteractionListener(lListener);

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.dispatchInteractionEvent(lReason);
            });

            // Evaluation.
            expect(lListenerCalled).to.be.true;
            expect(lReasonResult).to.equal(lReason);
        });

        it('-- Pass through', () => {
            // Setup.
            const lParentInteractionZone: InteractionZone = new InteractionZone('Name');
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.SyncronProperty, new Object(), 2);

            // Setup. Child.
            const lChildInteractionZoneName: string = 'CD-child';
            let lInteractionZone: InteractionZone;
            lParentInteractionZone.execute(() => {
                lInteractionZone = new InteractionZone(lChildInteractionZoneName);
            });

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            let lReasonResult: InteractionReason | null = null;
            const lListener = (pReason: InteractionReason) => {
                lListenerCalled = true;
                lReasonResult = pReason;
            };
            lParentInteractionZone.addInteractionListener(lListener);

            // Process. Dispatch event on child.
            lInteractionZone!.execute(() => {
                InteractionZone.dispatchInteractionEvent(lReason);
            });

            // Evaluation.
            expect(lListenerCalled).to.be.true;
            expect(lReasonResult).to.equal(lReason);
        });

        it('-- Preserve interaction zone in interaction listener.', () => {
            // Setup.
            const lParentInteractionZone: InteractionZone = new InteractionZone('Name');
            const lZoneName: string = 'CD-child';

            // Setup. Child.
            let lInteractionZone: InteractionZone;
            lParentInteractionZone.execute(() => {
                lInteractionZone = new InteractionZone(lZoneName);
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
            let lInteractionZone: InteractionZone;
            lParentInteractionZone.execute(() => {
                lInteractionZone = new InteractionZone(lChildInteractionZoneName);
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
    });

    it('Method: execute', () => {
        // Setup.
        const lName: string = 'CD-Name';
        const lExecutionResult: number = 12;
        const lInteractionZone: InteractionZone = new InteractionZone(lName);

        // Process.
        let lExecutingInteractionZoneName: string | null = null;
        const lResult: number = lInteractionZone.execute((pResult: number) => {
            lExecutingInteractionZoneName = InteractionZone.current.name;
            return pResult;
        }, lExecutionResult);

        // Evaluation.
        expect(lExecutingInteractionZoneName).to.equal(lName);
        expect(lResult).to.equal(lExecutionResult);
    });

    describe('Method: registerObject', () => {
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

    describe('Method: executeInZone', () => {
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

    describe('Method: executeInZoneSilent', () => {
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
            const lZone: InteractionZone = new InteractionZone('ZoneName');

            // Process.
            let lInteractionCallbackCalled: boolean = false;
            lZone.addInteractionListener(() => {
                lInteractionCallbackCalled = true;
            });
            lZone.execute(() => { /* Empty */ });

            // Evaluation.
            expect(lInteractionCallbackCalled).to.be.false;
        });
    });

    it('Functionality: Zone error handling', () => {
        it('-- Zone sync uncatched error report', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lError: string = 'ERROR-MESSAGE';

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            let lErrorResult: string | null = null;
            lInteractionZone.addErrorListener((pError: string) => {
                lErrorListenerCalled = true;
                lErrorResult = pError;
            });

            // Process. Throw error in zone.
            let lErrorCatched: string | null = null;
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
                lErrorCatched = lError;
            }

            // Evaluation.
            expect(lErrorListenerCalled).to.be.true;
            expect(lErrorResult).to.equal(lError);
            expect(lErrorCatched).to.equal(lError);
        });

        it('-- Zone async uncatched error report', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lError: string = 'ERROR-MESSAGE';

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            let lErrorResult: string | null = null;

            // Async assertion
            await new Promise<void>((pResolve) => {
                lInteractionZone.addErrorListener((pError: string) => {
                    lErrorListenerCalled = true;
                    lErrorResult = pError;
                    pResolve();
                });

                let lPromise: Promise<void> | null = null;
                lInteractionZone.execute(() => {
                    lPromise = new Promise<void>(() => {
                        throw lError;
                    });
                });

                window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                    promise: <Promise<void>><any>lPromise,
                    reason: lError
                }));
            });

            // Evaluation.
            expect(lErrorListenerCalled).to.be.true;
            expect(lErrorResult).to.equal(lError);
        });

        it('-- Zone async uncatched rejection report', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lError: string = 'ERROR-MESSAGE';

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            let lErrorResult: string | null = null;

            // Async assertion
            await new Promise<void>((pResolve) => {
                lInteractionZone.addErrorListener((pError: string) => {
                    lErrorListenerCalled = true;
                    lErrorResult = pError;
                    pResolve();
                });

                let lPromise: Promise<void> | null = null;
                lInteractionZone.execute(() => {
                    lPromise = new Promise<void>((_pResolve, pReject) => {
                        pReject(lError);
                    });
                });

                window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                    promise: <Promise<void>><any>lPromise,
                    reason: lError
                }));
            });

            // Evaluation.
            expect(lErrorListenerCalled).to.be.true;
            expect(lErrorResult).to.equal(lError);
        });

        it('-- Zone sync uncatched rejection prevent default', async () => {
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

        it('-- Sync uncatched error outside zone', () => {
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

        it('-- Parent Zone sync uncatched error report', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            let lChildInteractionZone: InteractionZone;
            lInteractionZone.execute(() => {
                lChildInteractionZone = new InteractionZone('Child');
            });
            const lError: string = 'ERROR-MESSAGE';

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            let lErrorResult: string | null = null;
            lInteractionZone.addErrorListener((pError: string) => {
                lErrorListenerCalled = true;
                lErrorResult = pError;
            });

            // Process. Throw error in zone.
            let lErrorCatched: string | null = null;
            try {
                lChildInteractionZone!.execute(() => {
                    throw lError;
                });
            } catch (pError) {
                const lError: string = <string>pError;
                window.dispatchEvent(new ErrorEvent('error', {
                    error: lError,
                    message: lError,
                }));
                lErrorCatched = lError;
            }

            // Evaluation.
            expect(lErrorListenerCalled).to.be.true;
            expect(lErrorResult).to.equal(lError);
            expect(lErrorCatched).to.equal(lError);
        });

        it('-- Continue detection after error', () => {
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

            // Process. Trow error.
            try {
                lInteractionZone.execute(() => {
                    throw '';
                });
            } catch (_pError) { /* Empty */ }

            // Process. Call input event.
            lTrackedEventTarget.dispatchEvent(new Event('input'));

            // Evaluation.
            expect(lChangeEventCalled).to.be.true;
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