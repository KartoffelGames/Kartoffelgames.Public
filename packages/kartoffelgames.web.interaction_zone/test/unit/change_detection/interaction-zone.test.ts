import { Exception } from '@kartoffelgames/core';
import { expect } from 'chai';
import { ErrorAllocation } from '../../../source/change_detection/error-allocation';
import { InteractionReason } from '../../../source/change_detection/interaction-reason';
import { InteractionZone } from '../../../source/change_detection/interaction-zone';
import { InteractionDetectionProxy } from '../../../source/change_detection/synchron_tracker/interaction-detection-proxy';
import { PreventableErrorEvent, PromiseRejectionEvent } from '../../mock/error-event';
import '../../mock/request-animation-frame-mock-session';

describe('InteractionZone', () => {
    it('Static Property: current', () => {
        it('-- Available Zone', () => {
            // Setup.
            const lName: string = 'InnerCD';
            const lFirstInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lSecondInteractionZone: InteractionZone = InteractionZone.current.create(lName);

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
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Custom, new Object(), 2);

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
            const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lChildInteractionZone: InteractionZone = lParentInteractionZone.execute(() => {
                return InteractionZone.current.create('CD-child');
            });
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Custom, new Object(), 2);

            // Process. Add listener.
            let lReasonResult: InteractionReason | null = null;
            const lListener = (pReason: InteractionReason) => {
                lReasonResult = pReason;
            };
            lParentInteractionZone.addInteractionListener(lListener);

            // Process. Dispatch event on child.
            lChildInteractionZone.execute(() => {
                InteractionZone.dispatchInteractionEvent(lReason);
            });

            // Evaluation.
            expect(lReasonResult).to.equal(lReason);
        });

        it('-- Preserve execution interaction zone. Zone execution.', async () => {
            // Setup.
            const lInteractionInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lInteractionListenerZone: InteractionZone = InteractionZone.current.create('Name');

            // Setup. Set error lister on error zone but attach it inside listener zone.
            const lInteractionZoneWaiter = new Promise<InteractionZone>((pResolve) => {
                lInteractionListenerZone.execute(() => {
                    lInteractionInteractionZone.addInteractionListener(() => {
                        pResolve(InteractionZone.current);
                    });
                });
            });

            // Process. Throw error in zone.
            lInteractionInteractionZone.execute(() => {
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.Custom, new Object()));
            });

            const lInteractionZone: InteractionZone = await lInteractionZoneWaiter;

            // Evaluation.
            expect(lInteractionZone).to.be.equal(lInteractionListenerZone);
        });

        it('-- Prevent redispatch of event.', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Custom, new Object(), 2);

            // Process. Add listener.
            let lCounter: number = 0;
            lInteractionZone.execute(() => {
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lCounter++;
                    InteractionZone.dispatchInteractionEvent(pReason);
                });
            });

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.dispatchInteractionEvent(lReason);
            });

            // Evaluation.
            expect(lCounter).to.equal(1);
        });

        it('-- Passthrough change reason', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Custom, {});

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
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName');

            // Process.
            let lResultStack: Error | null = null;
            lZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lResultStack = pChangeReason.stacktrace;
            });
            lZone.execute(() => {
                function lMycoolname() {
                    InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.Custom, {}));
                }
                lMycoolname();
            });

            // Evaluation.
            expect(lResultStack!.stack).to.contain('lMycoolname');
        });

        it('-- Keep source', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
            const lSource = {};

            // Process.
            let lResultSource: any;
            lZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lResultSource = pChangeReason.source;
            });
            lZone.execute(() => {
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.Custom, lSource));
            });

            // Evaluation.
            expect(lResultSource).to.equal(lSource);
        });

        it('-- Ignore other zones.', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
            const lZoneDifferent: InteractionZone = InteractionZone.current.create('ZoneName1');
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Custom, {});

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

    describe('Static Method: registerObject', () => {
        it('-- Trigger interaction on EventTarget input event outside zone', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lEventTarget: EventTarget = new EventTarget();

            // Process. Track object.
            const lTrackedEventTarget: EventTarget = lInteractionZone.registerObject(lEventTarget);

            // Process. Track change event.
            let lChangeEventCalled: boolean = false;
            lInteractionZone.addInteractionListener(() => {
                lChangeEventCalled = true;
            });

            // Process. Call input event.
            lTrackedEventTarget.dispatchEvent(new Event('input'));

            // Evaluation.
            expect(lChangeEventCalled).to.be.true;
        });

        it('-- Object interaction zone', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.RegisteredPropertySet });
            const lOriginalObject: { a: number; } = { a: 1 };

            // Process. Track object.
            const lTrackedEventTarget: { a: number; } = lInteractionZone.registerObject(lOriginalObject);

            // Process. Track change event.
            let lReason: InteractionReason | null = null;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lReason = pReason;
            });

            // Process. interaction zone.
            lTrackedEventTarget.a = 2;

            // Evaluation.
            expect(lReason!.property).to.equal('a');
            expect(lReason!.interactionType).to.equal(InteractionResponseType.RegisteredPropertySet);
        });
    });

    it('Static Property: current', () => {
        // Process.
        const lCurrentZone: InteractionZone = InteractionZone.current;

        // Evaluation.
        expect(lCurrentZone.name).to.equal('Default');
    });

    it('Property: name', () => {
        // Setup.
        const lName: string = 'CD-Name';
        const lInteractionZone: InteractionZone = InteractionZone.current.create(lName);

        // Process.
        const lNameResult: string = lInteractionZone.name;

        // Evaluation.
        expect(lNameResult).to.equal(lName);
    });

    describe('Method: addErrorListener', () => {
        it('-- Error listener called for syncron errors', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lError: string = 'ERROR-MESSAGE';

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            const lErrorListener = () => {
                lErrorListenerCalled = true;
            };
            lInteractionZone.addErrorListener(lErrorListener);

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

            // Evaluation.
            expect(lErrorListenerCalled).to.be.true;
        });

        it('-- Get syncron error message inside zone', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lError: Error = new Error('ERROR-MESSAGE');

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
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
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
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
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

            // Process. Throw error inside interaction zone.
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
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            lInteractionZone.addErrorListener((_pError: string) => {
                lErrorListenerCalled = true;
            });

            // Process. Throw error outside zone.
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
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

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
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            lInteractionZone.addErrorListener((_pError: string) => {
                lErrorListenerCalled = true;
            });

            const lPromise = new Promise<void>(() => { });
            (<WeakMap<Promise<unknown>, InteractionZone>>(<any>ErrorAllocation).mAsyncronErrorZones).delete(lPromise);

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
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lChildInteractionZone: InteractionZone = lInteractionZone.execute(() => {
                return InteractionZone.current.create('Child');
            });
            const lError: Error = new Error('ERROR-MESSAGE');

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
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lEventTarget: HTMLDivElement = document.createElement('div');

            // Process. Track change event.
            let lChangeEventCalled: boolean = false;
            lInteractionZone.addInteractionListener(() => {
                lChangeEventCalled = true;
            });

            // Process. Throw error.
            try {
                lInteractionZone.registerObject(lEventTarget);
                throw '';
            } catch (_pError) { /* Empty */ }

            // Process. Call input event.
            lEventTarget.dispatchEvent(new Event('input'));

            // Evaluation.
            expect(lChangeEventCalled).to.be.true;
        });

        it('-- Error listener called syncron in correct zone', async () => {
            // Setup.
            const lInteractionErrorZone: InteractionZone = InteractionZone.current.create('Name');
            const lInteractionListenerZone: InteractionZone = InteractionZone.current.create('Name');
            const lError: Error = new Error('Error');

            // Setup. Set error lister on error zone but attach it inside listener zone.
            const lErrorZoneWaiter = new Promise<InteractionZone>((pResolve) => {
                lInteractionListenerZone.execute(() => {
                    lInteractionErrorZone.addErrorListener(() => {
                        pResolve(InteractionZone.current);
                    });
                });
            });

            // Process. Throw error in zone.
            try {
                lInteractionErrorZone.execute(() => {
                    throw lError;
                });
            } catch (pError) {
                window.dispatchEvent(new ErrorEvent('error', {
                    error: pError,
                    message: '',
                }));
            }

            const lErrorZone: InteractionZone = await lErrorZoneWaiter;

            // Evaluation.
            expect(lErrorZone).to.be.equal(lInteractionListenerZone);
        });

        it('-- Error listener called asyncron in correct zone', async () => {
            // Setup.
            const lInteractionErrorZone: InteractionZone = InteractionZone.current.create('Name');
            const lInteractionListenerZone: InteractionZone = InteractionZone.current.create('Name');

            // Setup. Set error lister on error zone but attach it inside listener zone.
            const lErrorZoneWaiter = new Promise<InteractionZone>((pResolve) => {
                lInteractionListenerZone.execute(() => {
                    lInteractionErrorZone.addErrorListener(() => {
                        pResolve(InteractionZone.current);
                    });
                });
            });

            // Process. Create promise in zone. 
            const lPromise: Promise<void> = lInteractionErrorZone.execute(async () => {
                return new Promise<void>(() => { });
            });

            // Process. "Throw" promise into global scope.
            window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                promise: <Promise<void>><any>lPromise,
                reason: 'Something'
            }));

            const lErrorZone: InteractionZone = await lErrorZoneWaiter;

            // Evaluation.
            expect(lErrorZone).to.be.equal(lInteractionListenerZone);
        });

        it('-- Send error to correct zone. Nested zone execution', async () => {
            // Setup.
            const lRootZone: InteractionZone = InteractionZone.current.create('Name');
            const lRestoredZone: InteractionZone = lRootZone.execute(() => {
                return InteractionZone.current.create('Child');
            });
            const lError: Error = new Error('ERROR-MESSAGE');

            // Process. Set error listener.
            const lErrorWaiter = new Promise<string>((pResolve) => {
                lRestoredZone.addErrorListener((pError: string) => {
                    pResolve(pError);
                });
            });

            // Process. Throw error in zone.
            try {
                lRestoredZone.execute(() => {
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

        it('-- Convert non object errors into error objects.', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lError: string = 'ERROR-MESSAGE';

            // Process. Throw error in zone.
            let lErrorResult: Error | null = null;
            try {
                lInteractionZone.execute(() => {
                    throw lError;
                });
            } catch (pError) {
                lErrorResult = <Error>pError;
            }

            // Evaluation.
            expect(lErrorResult?.message).to.equal(lError);
        });
    });


    describe('Method: registerObject', () => {
        it('-- Trigger interaction on EventTarget input event outside zone', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lEventTarget: EventTarget = document.createElement('div');

            // Process. Track object.
            const lTrackedEventTarget = lInteractionZone.registerObject(lEventTarget);

            // Process. Track change event.
            const lEventWaiter = new Promise<void>((pResolve) => {
                lInteractionZone.addInteractionListener(() => {
                    pResolve();
                });
            });

            // Process. Call input event.
            lTrackedEventTarget.dispatchEvent(new Event('input'));

            // Evaluation.
            await lEventWaiter;
        });

        it('-- Object interaction zone', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.RegisteredPropertySet });

            // Process. Track object.
            const lTrackedEventTarget: { a: number; } = lInteractionZone.registerObject({ a: 1 });

            // Process. Track change event.
            let lReason: InteractionReason | null = null;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lReason = pReason;
            });

            // Process. interaction zone.
            lTrackedEventTarget.a = 2;

            // Evaluation.
            expect(lReason!.property).to.equal('a');
            expect(lReason!.interactionType).to.equal(InteractionResponseType.RegisteredPropertySet);
        });

        it('-- Dispatch interaction in current zone.', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.RegisteredPropertySet });
            const lRegistered: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.None });

            // Process. Track object.
            const lTrackedEventTarget: { a: number; } = lRegistered.registerObject({ a: 1 });

            // Process. Track change event.
            let lReason: InteractionReason | null = null;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lReason = pReason;
            });

            // Process. interaction zone.
            lInteractionZone.execute(() => {
                lTrackedEventTarget.a = 2;
            });

            // Evaluation.
            expect(lReason!.property).to.equal('a');
            expect(lReason!.interactionType).to.equal(InteractionResponseType.RegisteredPropertySet);
        });
    });

    it('Method: removeErrorListener', async () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
        const lError: string = 'ERROR-MESSAGE';

        // Process. Set error listener.
        let lErrorListenerCalled: boolean = false;
        const lErrorListener = () => {
            lErrorListenerCalled = true;
        };
        lInteractionZone.addErrorListener(lErrorListener);
        lInteractionZone.removeErrorListener(lErrorListener);


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

        // Evaluation.
        expect(lErrorListenerCalled).to.be.false;
    });

    it('Property: name', () => {
        // Setup.
        const lZoneName: string = 'ZoneName';
        const lZone: InteractionZone = InteractionZone.current.create(lZoneName);

        // Process.
        const lNameResult: string = lZone.name;

        // Evaluation.
        expect(lNameResult).to.equal(lZoneName);
    });

    it('Method: addInteractionListener', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lInteractionZone.addInteractionListener(lListener);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.dispatchInteractionEvent(1, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).to.be.true;
    });

    it('Method: removeInteractionListener', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lInteractionZone.addInteractionListener(lListener);
        lInteractionZone.removeInteractionListener(lListener);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.dispatchInteractionEvent(1, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).to.be.false;
    });

    describe('Method: execute', () => {
        it('-- Execute inside zone', () => {
            // Setup.
            const lZoneName: string = 'ZoneName';
            const lZone: InteractionZone = InteractionZone.current.create(lZoneName);

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
            const lZone: InteractionZone = InteractionZone.current.create('Name');
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
            const lZone: InteractionZone = InteractionZone.current.create(lZoneName);
            const lError: Error = new Error('ErrorName');

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
            const lZone: InteractionZone = InteractionZone.current.create(lZoneName);

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
            const lZone: InteractionZone = InteractionZone.current.create(lZoneName);
            const lFunction = () => { /* Empty */ };

            // Process.
            let lExecutedFunction: any;
            let lZoneNameResult: string | null = null;
            lZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lZoneNameResult = pChangeReason.origin.name;
                lExecutedFunction = pChangeReason.source;
            });
            lZone.execute(() => {
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.Custom, lFunction));
            });

            // Evaluation.
            expect(lZoneNameResult).to.equal(lZoneName);
            expect(lExecutedFunction).to.equal(lFunction);
        });

        it('-- Ignore parent trigger', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('Zone', { trigger: InteractionResponseType.Custom, isolate: true });
            const lZoneChild: InteractionZone = lZone.execute(() => {
                return InteractionZone.current.create('ZoneChild');
            });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lZoneChild.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.triggerType;
            });
            lZoneChild.execute(() => {
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.Custom, {}));
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.RegisteredPropertyGet, {}));
            });

            // Evaluation.
            expect(lResponeType).to.equal(InteractionResponseType.Custom | InteractionResponseType.RegisteredPropertyGet);
        });

        it('-- Default any trigger.', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('Zone');

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.triggerType;
            });
            lZone.execute(() => {
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.RegisteredPropertySet, {}));
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.RegisteredPropertyGet, {}));
            });

            // Evaluation.
            expect(lResponeType).to.equal(InteractionResponseType.RegisteredPropertyGet | InteractionResponseType.RegisteredPropertySet);
        });

        it('-- Dont passthrough child trigger', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('Zone', { trigger: InteractionResponseType.RegisteredPropertyDelete | InteractionResponseType.RegisteredPropertySet, isolate: true });
            const lZoneChild: InteractionZone = lZone.execute(() => {
                return InteractionZone.current.create('ZoneChild', { trigger: InteractionResponseType.RegisteredPropertyDelete | InteractionResponseType.RegisteredPropertyGet });
            });
            const lZoneChildChild: InteractionZone = lZoneChild.execute(() => {
                return InteractionZone.current.create('ZoneChild', { trigger: InteractionResponseType.RegisteredPropertyDelete | InteractionResponseType.RegisteredPropertyGet | InteractionResponseType.RegisteredPropertySet });
            });

            // Process. Setup listener child child.
            let lResponeTypeChildChild: InteractionResponseType = InteractionResponseType.None;
            lZoneChildChild.addInteractionListener((pReason: InteractionReason) => {
                lResponeTypeChildChild |= pReason.triggerType;
            });

            // Process. Setup listener child child.
            let lResponeTypeChild: InteractionResponseType = InteractionResponseType.None;
            lZoneChild.addInteractionListener((pReason: InteractionReason) => {
                lResponeTypeChild |= pReason.triggerType;
            });

            // Process. Setup listener child child.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.triggerType;
            });
            lZoneChildChild.execute(() => {
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.RegisteredPropertyDelete, {}));
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.RegisteredPropertyGet, {}));
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.RegisteredPropertySet, {}));
            });

            // Evaluation.
            expect(lResponeTypeChildChild).to.equal(InteractionResponseType.RegisteredPropertyDelete | InteractionResponseType.RegisteredPropertyGet | InteractionResponseType.RegisteredPropertySet);
            expect(lResponeTypeChild).to.equal(InteractionResponseType.RegisteredPropertyDelete | InteractionResponseType.RegisteredPropertyGet);
            expect(lResponeType).to.equal(InteractionResponseType.RegisteredPropertyDelete);
        });

        it('-- Dont trigger attached zones of interaction proxy when current zone does not have trigger', () => {
            // Setup. Create proxy.
            const lProxy = new InteractionDetectionProxy({ a: 1 });

            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('Zone', { trigger: InteractionResponseType.None });
            const lAttachedZone: InteractionZone = InteractionZone.current.create('Zone', { trigger: InteractionResponseType.RegisteredPropertySet });

            // Setup. Attach zone.
            lProxy.addListenerZone(lAttachedZone);

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lAttachedZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.triggerType;
            });
            lZone.execute(() => {
                lProxy.proxy.a = 2;
            });

            // Evaluation.
            expect(lResponeType).to.equal(InteractionResponseType.None);
        });
    });

    describe('Functionality: DetectionCatchType', () => {
        it('-- DetectionCatchType.None', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.None });

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

        it('-- DetectionCatchType.RegisteredFunction', () => {
            it('-- Default', () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.RegisteredFunction });
                const lFunction: () => void = lInteractionZone.registerObject(() => { });

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                lFunction();

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.RegisteredFunction);
            });

            it('-- On error', () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.RegisteredFunction });
                const lFunction: () => void = lInteractionZone.registerObject(() => { throw 1; });

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                try {
                    lFunction();
                } catch (_pError) {/* Any */ }

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.RegisteredFunction);
            });
        });

        describe('-- DetectionCatchType.PatchedCallback', () => {
            it('-- Default', (pDone: Mocha.Done) => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.PatchedCallback });

                // Process.
                lInteractionZone.addInteractionListener(() => {
                    pDone();
                });
                lInteractionZone.execute(() => {
                    globalThis.setTimeout(() => { }, 0);
                });
            });

            // Unable to test error case :(
        });

        describe('-- DetectionCatchType.RegisteredPropertySet', () => {
            it('-- Default', () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.RegisteredPropertySet });
                const lObject: { a: number; } = lInteractionZone.registerObject({ a: 0 });

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                lObject.a = 2;

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.RegisteredPropertySet);
            });

            it('-- On error', () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.RegisteredPropertySet });
                const lObject: { a: number; } = lInteractionZone.registerObject(new class { set a(_pVal: number) { throw 1; } }());

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                try {
                    lObject.a = 2;
                } catch (_pError) {/* Any */ }

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.RegisteredPropertySet);
            });
        });

        describe('-- DetectionCatchType.RegisteredPropertyGet', () => {
            it('-- Default', () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.RegisteredPropertyGet });
                const lObject: { a: number; } = lInteractionZone.registerObject({ a: 0 });

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                lObject.a;

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.RegisteredPropertyGet);
            });

            it('-- On error', () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.RegisteredPropertyGet });
                const lObject: { a: number; } = lInteractionZone.registerObject(new class { get a(): number { throw 1; } }());

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                try {
                    lObject.a;
                } catch (_pError) {/* Any */ }

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.RegisteredPropertyGet);
            });
        });

        describe('-- DetectionCatchType.RegisteredPropertyDelete', () => {
            it('-- Default', () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.RegisteredPropertyDelete });
                const lObject: { a?: number; } = lInteractionZone.registerObject({ a: 0 });

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                delete lObject.a;

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.RegisteredPropertyDelete);
            });

            it('-- On error', () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.RegisteredPropertyDelete });
                const lObject: { a?: number; } = lInteractionZone.registerObject(Object.defineProperty({}, 'a', { configurable: false, value: 1 }));

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                try {
                    delete lObject.a;
                } catch (_pError) {/* Any */ }

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.RegisteredPropertyDelete);
            });
        });

        it('-- InteractionResponseType.PatchedPromise', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Zone', { trigger: InteractionResponseType.PatchedPromise });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            await lInteractionZone.execute(async () => {
                return new Promise<void>((pResolve) => { pResolve(); });
            });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.PatchedPromise);
        });

        describe('-- DetectionCatchType.PatchedEventlistener', () => {
            it('-- Default', () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.PatchedEventlistener });
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
                expect(lResponeType).to.be.equal(InteractionResponseType.PatchedEventlistener);
            });

            it('-- On error', () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.PatchedEventlistener });
                const lEventTarget: EventTarget = new EventTarget();

                // Process.
                let lResponeType: InteractionResponseType | null = null;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType = pReason.interactionType;
                });
                lInteractionZone.execute(() => {
                    lEventTarget.addEventListener('click', () => { throw 1; });
                });

                lEventTarget.dispatchEvent(new Event('click'));

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.PatchedEventlistener);
            });
        });

        it('-- DetectionCatchType.RegisteredUntrackableFunction', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('CD-Native', { trigger: InteractionResponseType.RegisteredUntrackableFunction });
            const lProxy: Set<string> = new InteractionDetectionProxy(new Set<string>()).proxy;

            // Setup. InteractionZone.
            let lResponseType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lResponseType |= pChangeReason.interactionType;
            });

            // Process
            lInteractionZone.execute(() => {
                lProxy.add('');
            });

            // Evaluation.
            expect(lResponseType).to.equal(InteractionResponseType.RegisteredUntrackableFunction);
        });

        it('-- Negative', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.PatchedPromise });

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
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name', { trigger: InteractionResponseType.PatchedCallback });

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

    describe('Functionality: InteractionReason', () => {
        it('-- Read origin zone without dispatch', () => {
            // Setup.
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.None, {});

            // Process
            const lErrorFunction = () => {
                lReason.origin;
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(Exception, 'Interaction reason not dispatched.');
        });

        it('-- Passthrough function name.', () => {
            // Setup. 
            const lTarget = function lFunctionName() { };
            const lTrigger: number = 112233;

            // Setup. Create reason.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName', { trigger: InteractionResponseType.Custom });
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Custom, lTarget);
            lReason.setOrigin(lZone);

            // Process
            const lReasonAsString = lReason.toString();

            // Evaluation.
            expect(lReasonAsString).to.equal(`${lZone.name}: ${typeof lTarget}:${'lFunctionName'} -> ${lTrigger}`);
        });

        it('-- Passthrough class name.', () => {
            // Setup. 
            const lTarget = new class ClassName { }();
            const lTrigger: number = 112233;

            // Setup. Create reason.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName', { trigger: InteractionResponseType.Custom });
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Custom, lTarget);
            lReason.setOrigin(lZone);

            // Process
            const lReasonAsString = lReason.toString();

            // Evaluation.
            expect(lReasonAsString).to.equal(`${lZone.name}: ${typeof lTarget}:${'ClassName'} -> ${lTrigger}`);
        });

        it('-- Passthrough property name.', () => {
            // Setup. 
            const lTarget = new class ClassName { }();
            const lPropertyName: string = 'PropertyName';
            const lTrigger: number = 112233;

            // Setup. Create reason.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName', { trigger: InteractionResponseType.Custom });
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Custom, lTarget, lPropertyName);
            lReason.setOrigin(lZone);

            // Process
            const lReasonAsString = lReason.toString();

            // Evaluation.
            expect(lReasonAsString).to.equal(`${lZone.name}: ${typeof lTarget}:${'ClassName'}[${lPropertyName}] -> ${lTrigger}`);
        });

        it('-- Correct origin', () => {
            // Setup. Create reason.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName', { trigger: InteractionResponseType.Custom });
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Custom, {});
            lReason.setOrigin(lZone);

            // Process
            const lReasonOrigin = lReason.origin;

            // Evaluation.
            expect(lReasonOrigin).to.equal(lZone);
        });
    });
});