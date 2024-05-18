import '../../mock/request-animation-frame-mock-session';
import { expect } from 'chai';
import { ChangeDetection } from '../../../source/change_detection/change-detection';
import { PreventableErrorEvent, PromiseRejectionEvent } from '../../mock/error-event';
import { ChangeDetectionReason } from '../../../source/change_detection/change-detection-reason';
import { DetectionCatchType } from '../../../source/change_detection/enum/detection-catch-type.enum';

describe('ChangeDetection', () => {
    it('Static Property: current', () => {
        it('-- Available Zone', () => {
            // Setup.
            const lName: string = 'InnerCD';
            const lFirstChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lSecondChangeDetection: ChangeDetection = new ChangeDetection(lName);

            // Process.
            let lCurrentChangeDetectionName: string | null = null;
            lFirstChangeDetection.execute(() => {
                lSecondChangeDetection.execute(() => {
                    lCurrentChangeDetectionName = ChangeDetection.current.name;
                });
            });

            // Evaluation.
            expect(lCurrentChangeDetectionName).to.equal(lName);
        });

        it('-- No Zone', () => {
            // Process.
            const lCurrentChangeDetection: ChangeDetection = ChangeDetection.current;

            // Evaluation.
            expect(lCurrentChangeDetection).to.be.null;
        });
    });

    it('Property: name', () => {
        // Setup.
        const lName: string = 'CD-Name';
        const lChangeDetection: ChangeDetection = new ChangeDetection(lName);

        // Process.
        const lNameResult: string = lChangeDetection.name;

        // Evaluation.
        expect(lNameResult).to.equal(lName);
    });

    describe('Property: parent', () => {
        it('-- Set parent', () => {
            // Setup.
            const lParentName: string = 'InnerCD';
            const lParentChangeDetection: ChangeDetection = new ChangeDetection(lParentName);
            let lChildChangeDetection: ChangeDetection;
            lParentChangeDetection.execute(() => {
                lChildChangeDetection = new ChangeDetection('Name');
            });

            // Process.
            const lParentChangeDetectionName: string | undefined = lChildChangeDetection!.parent?.name;

            // Evaluation.
            expect(lParentChangeDetectionName).to.equal(lParentName);
        });

        it('-- No parent', () => {
            // Setup.
            const lChildChangeDetection: ChangeDetection = new ChangeDetection('Name');

            // Process.
            const lParentChangeDetection: ChangeDetection | null = lChildChangeDetection.parent;

            // Evaluation.
            expect(lParentChangeDetection).to.be.null;
        });
    });

    it('Method: addChangeListener', () => {
        // Setup.
        const lChangeDetection: ChangeDetection = new ChangeDetection('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lChangeDetection.addInteractionListener(lListener);

        // Process. Call listener.
        lChangeDetection.execute(() => {
            ChangeDetection.dispatchInteractionEvent(new ChangeDetectionReason(DetectionCatchType.SyncronProperty, new Object()));
        });

        // Evaluation.
        expect(lListenerCalled).to.be.true;
    });

    it('Method: addErrorListener', () => {
        // Setup.
        const lChangeDetection: ChangeDetection = new ChangeDetection('Name');

        // Process. Add and remove listener.
        let lListenerCalled: boolean = false;
        lChangeDetection.addErrorListener(() => {
            lListenerCalled = true;
        });

        // Process. Throw error inside change detection zone.
        try {
            lChangeDetection.execute(() => {
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
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lReason: ChangeDetectionReason = new ChangeDetectionReason(DetectionCatchType.SyncronProperty, new Object(), 2);

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            let lReasonResult: ChangeDetectionReason | null = null;
            const lListener = (pReason: ChangeDetectionReason) => {
                lListenerCalled = true;
                lReasonResult = pReason;
            };
            lChangeDetection.addInteractionListener(lListener);

            // Process. Call listener.
            lChangeDetection.execute(() => {
                ChangeDetection.dispatchInteractionEvent(lReason);
            });

            // Evaluation.
            expect(lListenerCalled).to.be.true;
            expect(lReasonResult).to.equal(lReason);
        });

        it('-- Pass through', () => {
            // Setup.
            const lParentChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lReason: ChangeDetectionReason = new ChangeDetectionReason(DetectionCatchType.SyncronProperty, new Object(), 2);

            // Setup. Child.
            const lChildChangeDetectionName: string = 'CD-child';
            let lChangeDetection: ChangeDetection;
            lParentChangeDetection.execute(() => {
                lChangeDetection = new ChangeDetection(lChildChangeDetectionName);
            });

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            let lReasonResult: ChangeDetectionReason | null = null;
            const lListener = (pReason: ChangeDetectionReason) => {
                lListenerCalled = true;
                lReasonResult = pReason;
            };
            lParentChangeDetection.addInteractionListener(lListener);

            // Process. Dispatch event on child.
            lChangeDetection!.execute(() => {
                ChangeDetection.dispatchInteractionEvent(lReason);
            });

            // Evaluation.
            expect(lListenerCalled).to.be.true;
            expect(lReasonResult).to.equal(lReason);
        });

        it('-- Preserve execution change detection. Default execution.', () => {
            // Setup.
            const lParentChangeDetection: ChangeDetection = new ChangeDetection('Name');

            // Setup. Child.
            let lChangeDetection: ChangeDetection;
            lParentChangeDetection.execute(() => {
                lChangeDetection = new ChangeDetection('CD-child');
            });

            // Process. Add listener.
            let lExecutingChangeDetectionName: string | null = null;
            const lListener = () => {
                lExecutingChangeDetectionName = ChangeDetection.current.name;
            };
            lParentChangeDetection.addInteractionListener(lListener);

            // Process. Dispatch event on child.
            lChangeDetection!.execute(() => {
                ChangeDetection.dispatchInteractionEvent(new ChangeDetectionReason(DetectionCatchType.SyncronProperty, new Object()));
            });

            // Evaluation.
            expect(lExecutingChangeDetectionName).to.equal('Default');
        });

        it('-- Preserve execution change detection. Zone execution.', () => {
            // Setup.
            const lParentChangeDetection: ChangeDetection = new ChangeDetection('Name');

            // Setup. Child.
            const lChildChangeDetectionName: string = 'CD-child';
            let lChangeDetection: ChangeDetection;
            lParentChangeDetection.execute(() => {
                lChangeDetection = new ChangeDetection(lChildChangeDetectionName);
            });

            // Process. Add listener.
            let lExecutingChangeDetectionName: string | null = null;
            const lListener = () => {
                lExecutingChangeDetectionName = ChangeDetection.current.name;
            };
            lParentChangeDetection.addInteractionListener(lListener);

            // Process. Dispatch event on child..
            lChangeDetection!.execute(() => {
                ChangeDetection.dispatchInteractionEvent(new ChangeDetectionReason(DetectionCatchType.SyncronProperty, new Object()));
            });

            // Evaluation.
            expect(lExecutingChangeDetectionName).to.equal(lChildChangeDetectionName);
        });
    });

    it('Method: execute', () => {
        // Setup.
        const lName: string = 'CD-Name';
        const lExecutionResult: number = 12;
        const lChangeDetection: ChangeDetection = new ChangeDetection(lName);

        // Process.
        let lExecutingChangeDetectionName: string | null = null;
        const lResult: number = lChangeDetection.execute((pResult: number) => {
            lExecutingChangeDetectionName = ChangeDetection.current.name;
            return pResult;
        }, lExecutionResult);

        // Evaluation.
        expect(lExecutingChangeDetectionName).to.equal(lName);
        expect(lResult).to.equal(lExecutionResult);
    });

    describe('Method: registerObject', () => {
        it('-- EventTarget input event', () => {
            // Setup.
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lEventTarget: EventTarget = new EventTarget();

            // Process. Track object.
            const lTrackedEventTarget: EventTarget = lChangeDetection.registerObject(lEventTarget);

            // Process. Track change event.
            let lChangeEventCalled: boolean = false;
            lChangeDetection.addInteractionListener(() => {
                lChangeEventCalled = true;
            });

            // Process. Call input event.
            lTrackedEventTarget.dispatchEvent(new Event('input'));

            // Evaluation.
            expect(lChangeEventCalled).to.be.true;
        });

        it('-- Object change detection', () => {
            // Setup.
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lOriginalObject: { a: number; } = { a: 1 };

            // Process. Track object.
            const lTrackedEventTarget: { a: number; } = lChangeDetection.registerObject(lOriginalObject);

            // Process. Track change event.
            let lChangeEventCalled: boolean = false;
            let lReason: ChangeDetectionReason | null = null;
            lChangeDetection.addInteractionListener((pReason: ChangeDetectionReason) => {
                lChangeEventCalled = true;
                lReason = pReason;
            });

            // Process. Change detection.
            lTrackedEventTarget.a = 2;

            // Evaluation.
            expect(lChangeEventCalled).to.be.true;
            expect(lReason!.property).to.equal('a');
            expect(lReason!.catchType).to.equal(DetectionCatchType.SyncronProperty);
        });
    });

    it('Method: removeChangeListener', () => {
        // Setup.
        const lChangeDetection: ChangeDetection = new ChangeDetection('Name');

        // Process. Add and remove listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lChangeDetection.addInteractionListener(lListener);
        lChangeDetection.removeChangeListener(lListener);

        // Process. Call listener.
        lChangeDetection.execute(() => {
            ChangeDetection.dispatchInteractionEvent(new ChangeDetectionReason(DetectionCatchType.SyncronProperty, new Object()));
        });

        // Evaluation.
        expect(lListenerCalled).to.be.false;
    });

    it('Method: removeErrorListener', () => {
        // Setup.
        const lChangeDetection: ChangeDetection = new ChangeDetection('Name');

        // Process. Add and remove listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lChangeDetection.addErrorListener(lListener);
        lChangeDetection.removeErrorListener(lListener);

        // Process. Throw error inside change detection zone.
        try {
            lChangeDetection.execute(() => {
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
        expect(lListenerCalled).to.be.false;
    });

    it('Static Property: current', () => {
        // Process.
        const lCurrentZone: ChangeDetection = ChangeDetection.current;

        // Evaluation.
        expect(lCurrentZone.name).to.equal('Default');
    });

    describe('Static Method: dispatchInteractionEvent', () => {
        it('-- Passthrough change reason', () => {
            // Setup.
            const lZone: ChangeDetection = new ChangeDetection('ZoneName');
            const lReason: ChangeDetectionReason = new ChangeDetectionReason(DetectionCatchType.Syncron, {});

            // Process.
            let lResultReason: ChangeDetectionReason | null = null;
            lZone.addInteractionListener((pChangeReason: ChangeDetectionReason) => {
                lResultReason = pChangeReason;
            });
            lZone.execute(() => {
                ChangeDetection.dispatchInteractionEvent(lReason);
            });

            // Evaluation.
            expect(lResultReason).to.equal(lReason);
        });

        it('-- Inore other zones.', () => {
            // Setup.
            const lZone: ChangeDetection = new ChangeDetection('ZoneName');
            const lZoneDifferent: ChangeDetection = new ChangeDetection('ZoneName1');
            const lReason: ChangeDetectionReason = new ChangeDetectionReason(DetectionCatchType.Syncron, {});

            // Process.
            let lResultReason: ChangeDetectionReason | null = null;
            lZone.addInteractionListener((pChangeReason: ChangeDetectionReason) => {
                lResultReason = pChangeReason;
            });
            lZoneDifferent.execute(() => {
                ChangeDetection.dispatchInteractionEvent(lReason);
            });

            // Evaluation.
            expect(lResultReason).to.be.null;
        });
    });

    it('Property: name', () => {
        // Setup.
        const lZoneName: string = 'ZoneName';
        const lZone: ChangeDetection = new ChangeDetection(lZoneName);

        // Process.
        const lNameResult: string = lZone.name;

        // Evaluation.
        expect(lNameResult).to.equal(lZoneName);
    });

    it('Method: addInteractionListener', () => {
        // Setup.
        const lZone: ChangeDetection = new ChangeDetection('ZoneName');
        const lSource = {};

        // Process.
        let lResultSource: any;
        lZone.addInteractionListener((pChangeReason: ChangeDetectionReason) => {
            lResultSource = pChangeReason.source;
        });
        lZone.execute(() => {
            ChangeDetection.dispatchInteractionEvent(new ChangeDetectionReason(DetectionCatchType.SyncronCall, lSource));
        });

        // Evaluation.
        expect(lResultSource).to.equal(lSource);
    });

    describe('Method: executeInZone', () => {
        it('-- Execute inside zone', () => {
            // Setup.
            const lZoneName: string = 'ZoneName';
            const lZone: ChangeDetection = new ChangeDetection(lZoneName);

            // Process.
            let lZoneNameResult: string | null = null;
            lZone.execute(() => {
                lZoneNameResult = ChangeDetection.current.name;
            });

            // Evaluation.
            expect(lZoneNameResult).to.equal(lZoneName);
        });

        it('-- Execute inside zone with parameter', () => {
            // Setup.
            const lZone: ChangeDetection = new ChangeDetection('Name');
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
            const lZone: ChangeDetection = new ChangeDetection(lZoneName);
            const lError: string = 'ErrorName';

            // Process.
            let lZoneNameResult: string | null = null;
            let lErrorResult: string | null = null;
            try {
                lZone.execute(() => {
                    lZoneNameResult = ChangeDetection.current.name;
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
            const lZone: ChangeDetection = new ChangeDetection(lZoneName);

            // Process.
            let lZoneNameResultFunktion: string | null = null;
            let lZoneNameResultException: string | null = null;
            const lZoneNameResultBefore = ChangeDetection.current.name;
            try {
                lZone.execute(() => {
                    lZoneNameResultFunktion = ChangeDetection.current.name;
                    throw '';
                });
            } catch (pError) {
                lZoneNameResultException = ChangeDetection.current.name;
            }
            const lZoneNameResultAfter = ChangeDetection.current.name;

            // Evaluation.
            expect(lZoneNameResultBefore).to.equal('Default');
            expect(lZoneNameResultFunktion).to.equal(lZoneName);
            expect(lZoneNameResultException).to.equal('Default');
            expect(lZoneNameResultAfter).to.equal('Default');
        });

        it('-- Check interaction callback', () => {
            // Setup.
            const lZoneName: string = 'ZoneName';
            const lZone: ChangeDetection = new ChangeDetection(lZoneName);
            const lFunction = () => { /* Empty */ };

            // Process.
            let lExecutedFunction: any;
            lZone.addInteractionListener((pChangeReason: ChangeDetectionReason) => {
                // lZoneNameResult = pZoneName; TODO: Add zone or cd identifier to reason.
                lExecutedFunction = pChangeReason.source;
            });
            lZone.execute(() => {
                ChangeDetection.dispatchInteractionEvent(new ChangeDetectionReason(DetectionCatchType.SyncronCall, lFunction));
            });


            // Evaluation.
            // expect(lZoneNameResult).to.equal(lZoneName);
            expect(lExecutedFunction).to.equal(lFunction);
        });
    });

    describe('Method: executeInZoneSilent', () => {
        it('-- Execute inside zone', () => {
            // Setup.
            const lZoneName: string = 'ZoneName';
            const lZone: ChangeDetection = new ChangeDetection(lZoneName);

            // Process.
            let lZoneNameResult: string | null = null;
            lZone.execute(() => {
                lZoneNameResult = ChangeDetection.current.name;
            });

            // Evaluation.
            expect(lZoneNameResult).to.equal(lZoneName);
        });

        it('-- Execute inside zone with parameter', () => {
            // Setup.
            const lZone: ChangeDetection = new ChangeDetection('Name');
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
            const lZone: ChangeDetection = new ChangeDetection(lZoneName);
            const lError: string = 'ErrorName';

            // Process.
            let lZoneNameResult: string | null = null;
            let lErrorResult: string | null = null;
            try {
                lZone.execute(() => {
                    lZoneNameResult = ChangeDetection.current.name;
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
            const lZone: ChangeDetection = new ChangeDetection(lZoneName);

            // Process.
            let lZoneNameResultFunktion: string | null = null;
            let lZoneNameResultException: string | null = null;
            const lZoneNameResultBefore = ChangeDetection.current.name;
            try {
                lZone.execute(() => {
                    lZoneNameResultFunktion = ChangeDetection.current.name;
                    throw '';
                });
            } catch (pError) {
                lZoneNameResultException = ChangeDetection.current.name;
            }
            const lZoneNameResultAfter = ChangeDetection.current.name;

            // Evaluation.
            expect(lZoneNameResultBefore).to.equal('Default');
            expect(lZoneNameResultFunktion).to.equal(lZoneName);
            expect(lZoneNameResultException).to.equal('Default');
            expect(lZoneNameResultAfter).to.equal('Default');
        });

        it('-- Check interaction callback', () => {
            // Setup.
            const lZone: ChangeDetection = new ChangeDetection('ZoneName');

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
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lError: string = 'ERROR-MESSAGE';

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            let lErrorResult: string | null = null;
            lChangeDetection.addErrorListener((pError: string) => {
                lErrorListenerCalled = true;
                lErrorResult = pError;
            });

            // Process. Throw error in zone.
            let lErrorCatched: string | null = null;
            try {
                lChangeDetection.execute(() => {
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
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lError: string = 'ERROR-MESSAGE';

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            let lErrorResult: string | null = null;

            // Async assertion
            await new Promise<void>((pResolve) => {
                lChangeDetection.addErrorListener((pError: string) => {
                    lErrorListenerCalled = true;
                    lErrorResult = pError;
                    pResolve();
                });

                let lPromise: Promise<void> | null = null;
                lChangeDetection.execute(() => {
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
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lError: string = 'ERROR-MESSAGE';

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            let lErrorResult: string | null = null;

            // Async assertion
            await new Promise<void>((pResolve) => {
                lChangeDetection.addErrorListener((pError: string) => {
                    lErrorListenerCalled = true;
                    lErrorResult = pError;
                    pResolve();
                });

                let lPromise: Promise<void> | null = null;
                lChangeDetection.execute(() => {
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
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lError: string = 'ERROR-MESSAGE';

            // Setup. Set error listener.
            lChangeDetection.addErrorListener((_pError: string) => {
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
                lChangeDetection.execute(() => {
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
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            lChangeDetection.addErrorListener((_pError: string) => {
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
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
            let lChildChangeDetection: ChangeDetection;
            lChangeDetection.execute(() => {
                lChildChangeDetection = new ChangeDetection('Child');
            });
            const lError: string = 'ERROR-MESSAGE';

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            let lErrorResult: string | null = null;
            lChangeDetection.addErrorListener((pError: string) => {
                lErrorListenerCalled = true;
                lErrorResult = pError;
            });

            // Process. Throw error in zone.
            let lErrorCatched: string | null = null;
            try {
                lChildChangeDetection!.execute(() => {
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
            const lChangeDetection: ChangeDetection = new ChangeDetection('Name');
            const lEventTarget: EventTarget = new EventTarget();

            // Process. Track object.
            const lTrackedEventTarget: EventTarget = lChangeDetection.registerObject(lEventTarget);

            // Process. Track change event.
            let lChangeEventCalled: boolean = false;
            lChangeDetection.addInteractionListener(() => {
                lChangeEventCalled = true;
            });

            // Process. Trow error.
            try {
                lChangeDetection.execute(() => {
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
        describe('-- DetectionCatchType.None', () => {
            it('-- Positive', () => { });
            it('-- Negative', () => { });
        });

        describe('-- DetectionCatchType.SyncronCall', () => {
            it('-- Positive', () => { });
            it('-- Negative', () => { });
        });

        describe('-- DetectionCatchType.SyncronProperty', () => {
            it('-- Positive', () => { });
            it('-- Negative', () => { });
        });

        describe('-- DetectionCatchType.Syncron', () => {
            it('-- Positive', () => { });
            it('-- Negative', () => { });
        });

        describe('-- DetectionCatchType.AsnychronPromise', () => {
            it('-- Positive', () => { });
            it('-- Negative', () => { });
        });

        describe('-- DetectionCatchType.AsnychronCallback', () => {
            it('-- Positive', () => { });
            it('-- Negative', () => { });
        });

        describe('-- DetectionCatchType.AsnychronEvent', () => {
            it('-- Positive', () => { });
            it('-- Negative', () => { });
        });

        describe('-- DetectionCatchType.Asnychron', () => {
            it('-- Positive', () => { });
            it('-- Negative', () => { });
        });

        describe('-- DetectionCatchType.All', () => {
            it('-- Positive', () => { });
            it('-- Negative', () => { });
        });
    });
});