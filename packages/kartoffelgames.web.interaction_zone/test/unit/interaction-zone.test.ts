import { Exception } from '@kartoffelgames/core';
import { expect } from 'chai';
import { ErrorAllocation } from '../../source/zone/error-allocation';
import { InteractionEvent } from '../../source/zone/interaction-event';
import { InteractionZone } from '../../source/zone/interaction-zone';
import { PreventableErrorEvent, PromiseRejectionEvent } from '../mock/error-event';
import '../mock/request-animation-frame-mock-session';

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
            const lReason: InteractionEvent = new InteractionEvent(InteractionResponseType.Custom, new Object(), 2);

            // Process. Add listener.
            let lReasonResult: InteractionEvent | null = null;
            const lListener = (pReason: InteractionEvent) => {
                lReasonResult = pReason;
            };
            lInteractionZone.addInteractionListener(lListener);

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(lReason);
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
            const lReason: InteractionEvent = new InteractionEvent(InteractionResponseType.Custom, new Object(), 2);

            // Process. Add listener.
            let lReasonResult: InteractionEvent | null = null;
            const lListener = (pReason: InteractionEvent) => {
                lReasonResult = pReason;
            };
            lParentInteractionZone.addInteractionListener(lListener);

            // Process. Dispatch event on child.
            lChildInteractionZone.execute(() => {
                InteractionZone.pushInteraction(lReason);
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
                InteractionZone.pushInteraction(new InteractionEvent(InteractionResponseType.Custom, new Object()));
            });

            const lInteractionZone: InteractionZone = await lInteractionZoneWaiter;

            // Evaluation.
            expect(lInteractionZone).to.be.equal(lInteractionListenerZone);
        });

        it('-- Prevent redispatch of event.', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lReason: InteractionEvent = new InteractionEvent(InteractionResponseType.Custom, new Object(), 2);

            // Process. Add listener.
            let lCounter: number = 0;
            lInteractionZone.execute(() => {
                lInteractionZone.addInteractionListener((pReason: InteractionEvent) => {
                    lCounter++;
                    InteractionZone.pushInteraction(pReason);
                });
            });

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(lReason);
            });

            // Evaluation.
            expect(lCounter).to.equal(1);
        });

        it('-- Passthrough change reason', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
            const lReason: InteractionEvent = new InteractionEvent(InteractionResponseType.Custom, {});

            // Process.
            let lResultReason: InteractionEvent | null = null;
            lZone.addInteractionListener((pChangeReason: InteractionEvent) => {
                lResultReason = pChangeReason;
            });
            lZone.execute(() => {
                InteractionZone.pushInteraction(lReason);
            });

            // Evaluation.
            expect(lResultReason).to.equal(lReason);
        });

        it('-- Keep source', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
            const lSource = {};

            // Process.
            let lResultSource: any;
            lZone.addInteractionListener((pChangeReason: InteractionEvent) => {
                lResultSource = pChangeReason.source;
            });
            lZone.execute(() => {
                InteractionZone.pushInteraction(new InteractionEvent(InteractionResponseType.Custom, lSource));
            });

            // Evaluation.
            expect(lResultSource).to.equal(lSource);
        });

        it('-- Ignore other zones.', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
            const lZoneDifferent: InteractionZone = InteractionZone.current.create('ZoneName1');
            const lReason: InteractionEvent = new InteractionEvent(InteractionResponseType.Custom, {});

            // Process.
            let lResultReason: InteractionEvent | null = null;
            lZone.addInteractionListener((pChangeReason: InteractionEvent) => {
                lResultReason = pChangeReason;
            });
            lZoneDifferent.execute(() => {
                InteractionZone.pushInteraction(lReason);
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
            let lReason: InteractionEvent | null = null;
            lInteractionZone.addInteractionListener((pReason: InteractionEvent) => {
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
            let lReason: InteractionEvent | null = null;
            lInteractionZone.addInteractionListener((pReason: InteractionEvent) => {
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
            let lReason: InteractionEvent | null = null;
            lInteractionZone.addInteractionListener((pReason: InteractionEvent) => {
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
            InteractionZone.pushInteraction(1, new Object());
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
            InteractionZone.pushInteraction(1, new Object());
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
            lZone.addInteractionListener((pChangeReason: InteractionEvent) => {
                lZoneNameResult = pChangeReason.origin.name;
                lExecutedFunction = pChangeReason.source;
            });
            lZone.execute(() => {
                InteractionZone.pushInteraction(new InteractionEvent(InteractionResponseType.Custom, lFunction));
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
            lZoneChild.addInteractionListener((pReason: InteractionEvent) => {
                lResponeType |= pReason.triggerType;
            });
            lZoneChild.execute(() => {
                InteractionZone.pushInteraction(new InteractionEvent(InteractionResponseType.Custom, {}));
                InteractionZone.pushInteraction(new InteractionEvent(InteractionResponseType.RegisteredPropertyGet, {}));
            });

            // Evaluation.
            expect(lResponeType).to.equal(InteractionResponseType.Custom | InteractionResponseType.RegisteredPropertyGet);
        });

        it('-- Default any trigger.', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('Zone');

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lZone.addInteractionListener((pReason: InteractionEvent) => {
                lResponeType |= pReason.triggerType;
            });
            lZone.execute(() => {
                InteractionZone.pushInteraction(new InteractionEvent(InteractionResponseType.RegisteredPropertySet, {}));
                InteractionZone.pushInteraction(new InteractionEvent(InteractionResponseType.RegisteredPropertyGet, {}));
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
            lZoneChildChild.addInteractionListener((pReason: InteractionEvent) => {
                lResponeTypeChildChild |= pReason.triggerType;
            });

            // Process. Setup listener child child.
            let lResponeTypeChild: InteractionResponseType = InteractionResponseType.None;
            lZoneChild.addInteractionListener((pReason: InteractionEvent) => {
                lResponeTypeChild |= pReason.triggerType;
            });

            // Process. Setup listener child child.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lZone.addInteractionListener((pReason: InteractionEvent) => {
                lResponeType |= pReason.triggerType;
            });
            lZoneChildChild.execute(() => {
                InteractionZone.pushInteraction(new InteractionEvent(InteractionResponseType.RegisteredPropertyDelete, {}));
                InteractionZone.pushInteraction(new InteractionEvent(InteractionResponseType.RegisteredPropertyGet, {}));
                InteractionZone.pushInteraction(new InteractionEvent(InteractionResponseType.RegisteredPropertySet, {}));
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
            lAttachedZone.addInteractionListener((pReason: InteractionEvent) => {
                lResponeType |= pReason.triggerType;
            });
            lZone.execute(() => {
                lProxy.proxy.a = 2;
            });

            // Evaluation.
            expect(lResponeType).to.equal(InteractionResponseType.None);
        });
    });
});