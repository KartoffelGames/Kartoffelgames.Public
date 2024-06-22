import { Exception } from '@kartoffelgames/core.data';
import { expect } from 'chai';
import { InteractionResponseType } from '../../../source/change_detection/enum/interaction-response-type.enum';
import { ErrorAllocation } from '../../../source/change_detection/error-allocation';
import { InteractionReason } from '../../../source/change_detection/interaction-reason';
import { InteractionZone, InteractionZoneStack } from '../../../source/change_detection/interaction-zone';
import { InteractionDetectionProxy } from '../../../source/change_detection/synchron_tracker/interaction-detection-proxy';
import { PreventableErrorEvent, PromiseRejectionEvent } from '../../mock/error-event';
import '../../mock/request-animation-frame-mock-session';

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
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.PropertyGetStart, new Object(), 2);

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
            const lChildInteractionZone: InteractionZone = new InteractionZone('CD-child');
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.PropertyGetStart, new Object(), 2);

            // Process. Add listener.
            let lReasonResult: InteractionReason | null = null;
            const lListener = (pReason: InteractionReason) => {
                lReasonResult = pReason;
            };
            lParentInteractionZone.addInteractionListener(lListener);

            // Process. Dispatch event on child.
            lParentInteractionZone.execute(() => {
                lChildInteractionZone.execute(() => {
                    InteractionZone.dispatchInteractionEvent(lReason);
                });
            });

            // Evaluation.
            expect(lReasonResult).to.equal(lReason);
        });

        it('-- Preserve execution interaction zone. Zone execution.', async () => {
            // Setup.
            const lInteractionInteractionZone: InteractionZone = new InteractionZone('Name');
            const lInteractionListenerZone: InteractionZone = new InteractionZone('Name');

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
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetStart, new Object()));
            });

            const lInteractionZone: InteractionZone = await lInteractionZoneWaiter;

            // Evaluation.
            expect(lInteractionZone).to.be.equal(lInteractionListenerZone);
        });

        it('-- Prevent redispatch of event.', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.PropertyGetStart, new Object(), 2);

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
    });

    describe('Static Method: save', () => {
        it('-- Save current stack', () => {
            // Setup.
            const lInteractionZone1: InteractionZone = new InteractionZone('Name');
            const lInteractionZone2: InteractionZone = new InteractionZone('Name');
            const lInteractionZone3: InteractionZone = new InteractionZone('Name');

            // Process. Save stack.
            const lStack: InteractionZoneStack = lInteractionZone1.execute(() => {
                return lInteractionZone2.execute(() => {
                    return lInteractionZone3.execute(() => {
                        return InteractionZone.save();
                    });
                });
            });

            // Evaluation.
            expect(lStack.toArray()).to.deep.equal([lInteractionZone1, lInteractionZone2, lInteractionZone3, InteractionZone.current]);
        });

        it('-- Save restored and continued stack', () => {
            // Setup.
            const lInteractionZone1: InteractionZone = new InteractionZone('Name');
            const lInteractionZone2: InteractionZone = new InteractionZone('Name');
            const lInteractionZone3: InteractionZone = new InteractionZone('Name');

            // Setup. Save stack.
            const lStack: InteractionZoneStack = lInteractionZone1.execute(() => {
                return lInteractionZone2.execute(() => {
                    return lInteractionZone3.execute(() => {
                        return InteractionZone.save();
                    });
                });
            });

            // Process. Save continued stack.
            const lContinuedStack: InteractionZoneStack = InteractionZone.restore(lStack, () => {
                return lInteractionZone1.execute(() => {
                    return lInteractionZone2.execute(() => {
                        return InteractionZone.save();
                    });
                });
            });

            // Evaluation.
            expect(lContinuedStack.toArray()).to.deep.equal([lInteractionZone1, lInteractionZone2, lInteractionZone1, lInteractionZone2, lInteractionZone3, InteractionZone.current]);
        });
    });

    describe('Static Method: restore', () => {
        it('-- Restore stack', () => {
            // Setup.
            const lInteractionZone1: InteractionZone = new InteractionZone('Name');
            const lInteractionZone2: InteractionZone = new InteractionZone('Name');
            const lInteractionZone3: InteractionZone = new InteractionZone('Name');

            // Setup. Save stack.
            const lStack: InteractionZoneStack = lInteractionZone1.execute(() => {
                return lInteractionZone2.execute(() => {
                    return lInteractionZone3.execute(() => {
                        return InteractionZone.save();
                    });
                });
            });

            // Process. Restore stack.
            const lCurrentStack: InteractionZoneStack = InteractionZone.restore(lStack, () => {
                return InteractionZone.save();
            });

            // Evaluation.
            expect(lStack.toArray()).to.deep.equal(lCurrentStack.toArray());
        });
    });

    describe('Static Method: registerObject', () => {
        it('-- Trigger interaction on EventTarget input event outside zone', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lEventTarget: EventTarget = new EventTarget();

            // Process. Track object.
            const lTrackedEventTarget: EventTarget = lInteractionZone.execute(() => {
                return InteractionZone.registerObject(lEventTarget);
            });

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
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PropertySetStart });
            const lOriginalObject: { a: number; } = { a: 1 };

            // Process. Track object.
            const lTrackedEventTarget: { a: number; } = InteractionZone.registerObject(lOriginalObject);

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
            expect(lReason!.interactionType).to.equal(InteractionResponseType.PropertySetStart);
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
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.PropertyGetStart, {});

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
                    InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetStart, {}));
                }
                lMycoolname();
            });

            // Evaluation.
            expect(lResultStack).to.contain('lMycoolname');
        });

        it('-- Keep source', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('ZoneName');
            const lSource = {};

            // Process.
            let lResultSource: any;
            lZone.addInteractionListener((pChangeReason: InteractionReason) => {
                lResultSource = pChangeReason.source;
            });
            lZone.execute(() => {
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetStart, lSource));
            });

            // Evaluation.
            expect(lResultSource).to.equal(lSource);
        });

        it('-- Ignore other zones.', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('ZoneName');
            const lZoneDifferent: InteractionZone = new InteractionZone('ZoneName1');
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.PropertyGetStart, {});

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

    describe('Method: addErrorListener', () => {
        it('-- Error listener called for syncron errors', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
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
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
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
            const lInteractionZone: InteractionZone = new InteractionZone('Name');

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
            (<WeakMap<Promise<unknown>, InteractionZoneStack>>(<any>ErrorAllocation).mAsyncronErrorZoneStacks).delete(lPromise);

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
            const lChildInteractionZone: InteractionZone = new InteractionZone('Child');
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
                    lChildInteractionZone.execute(() => {
                        throw lError;
                    });
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

        it('-- Error listener called syncron in correct zone', async () => {
            // Setup.
            const lInteractionErrorZone: InteractionZone = new InteractionZone('Name');
            const lInteractionListenerZone: InteractionZone = new InteractionZone('Name');
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
            const lInteractionErrorZone: InteractionZone = new InteractionZone('Name');
            const lInteractionListenerZone: InteractionZone = new InteractionZone('Name');

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

        it('-- Send error to correct zone stack. Direct restore error.', async () => {
            // Setup.
            const lRootZone: InteractionZone = new InteractionZone('Name');
            const lRestoredZone: InteractionZone = new InteractionZone('Child');
            const lError: Error = new Error('ERROR-MESSAGE');

            // Setup. Create restore point.
            const lRestorePoint: InteractionZoneStack = lRestoredZone.execute(() => {
                return InteractionZone.save();
            });

            // Process. Set error listener.
            const lErrorWaiter = new Promise<string>((pResolve) => {
                lRestoredZone.addErrorListener((pError: string) => {
                    pResolve(pError);
                });
            });

            // Process. Throw error in zone.
            try {
                lRootZone.execute(() => {
                    InteractionZone.restore(lRestorePoint, () => {
                        throw lError;
                    });
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

        it('-- Dont send error to original stack when thrown in restored stack.', async () => {
            // Setup.
            const lRootZone: InteractionZone = new InteractionZone('Name');
            const lRestoredZone: InteractionZone = new InteractionZone('Child');
            const lError: string = 'ERROR-MESSAGE';

            // Setup. Create restore point.
            const lRestorePoint: InteractionZoneStack = lRestoredZone.execute(() => {
                return InteractionZone.save();
            });

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            lRootZone.addErrorListener(() => {
                lErrorListenerCalled = true;
            });

            // Process. Set error listener.
            const lErrorWaiter = new Promise<string>((pResolve) => {
                lRestoredZone.addErrorListener((pError: string) => {
                    pResolve(pError);
                });
            });

            // Process. Throw error in zone.
            try {
                lRootZone.execute(() => {
                    InteractionZone.restore(lRestorePoint, () => {
                        throw lError;
                    });
                });
            } catch (pError) {
                const lError: string = <string>pError;
                window.dispatchEvent(new ErrorEvent('error', {
                    error: lError,
                    message: lError,
                }));
            }

            await lErrorWaiter;

            // Evaluation.
            expect(lErrorListenerCalled).to.be.false;
        });

        it('-- Convert non object errors into error objects.', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
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
            const lInteractionZone: InteractionZone = new InteractionZone('Name');
            const lEventTarget: EventTarget = document.createElement('div');

            // Process. Track object.
            const lTrackedEventTarget = lInteractionZone.execute(() => {
                return InteractionZone.registerObject(lEventTarget);
            });

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
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PropertySetStart });

            // Process. Track object.
            const lTrackedEventTarget: { a: number; } = lInteractionZone.execute(() => {
                return InteractionZone.registerObject({ a: 1 });
            });

            // Process. Track change event.
            let lReason: InteractionReason | null = null;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lReason = pReason;
            });

            // Process. interaction zone.
            lTrackedEventTarget.a = 2;

            // Evaluation.
            expect(lReason!.property).to.equal('a');
            expect(lReason!.interactionType).to.equal(InteractionResponseType.PropertySetStart);
        });
    });

    it('Method: removeErrorListener', async () => {
        // Setup.
        const lInteractionZone: InteractionZone = new InteractionZone('Name');
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
        const lZone: InteractionZone = new InteractionZone(lZoneName);

        // Process.
        const lNameResult: string = lZone.name;

        // Evaluation.
        expect(lNameResult).to.equal(lZoneName);
    });

    it('Method: addInteractionListener', () => {
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
            InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetStart, new Object()));
        });

        // Evaluation.
        expect(lListenerCalled).to.be.true;
    });

    it('Method: removeInteractionListener', () => {
        // Setup.
        const lInteractionZone: InteractionZone = new InteractionZone('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lInteractionZone.addInteractionListener(lListener);
        lInteractionZone.removeInteractionListener(lListener);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetStart, new Object()));
        });

        // Evaluation.
        expect(lListenerCalled).to.be.false;
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
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetStart, lFunction));
            });

            // Evaluation.
            expect(lZoneNameResult).to.equal(lZoneName);
            expect(lExecutedFunction).to.equal(lFunction);
        });

        it('-- Ignore parent trigger', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PropertyGetStart, isolate: true });
            const lZoneChild: InteractionZone = new InteractionZone('ZoneChild');

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lZoneChild.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });

            lZone.execute(() => {
                lZoneChild.execute(() => {
                    InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetStart, {}));
                    InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetEnd, {}));
                });
            });

            // Evaluation.
            expect(lResponeType).to.equal(InteractionResponseType.PropertyGetStart | InteractionResponseType.PropertyGetEnd);
        });

        it('-- Default any trigger.', () => {
            // Setup.
            const lZoneChild: InteractionZone = new InteractionZone('ZoneChild');

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lZoneChild.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            lZoneChild.execute(() => {
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetStart, {}));
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetEnd, {}));
            });

            // Evaluation.
            expect(lResponeType).to.equal(InteractionResponseType.PropertyGetEnd | InteractionResponseType.PropertyGetStart);
        });

        it('-- Dont passthrough child trigger', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PropertyGetStart | InteractionResponseType.PropertySetStart, isolate: true });
            const lZoneChild: InteractionZone = new InteractionZone('ZoneChild', { trigger: InteractionResponseType.PropertyGetStart | InteractionResponseType.PropertyGetEnd });
            const lZoneChildChild: InteractionZone = new InteractionZone('ZoneChild', { trigger: InteractionResponseType.PropertyGetStart | InteractionResponseType.PropertyGetEnd | InteractionResponseType.PropertySetStart });

            // Process. Setup listener child child.
            let lResponeTypeChildChild: InteractionResponseType = InteractionResponseType.None;
            lZoneChildChild.addInteractionListener((pReason: InteractionReason) => {
                lResponeTypeChildChild |= pReason.interactionType;
            });

            // Process. Setup listener child child.
            let lResponeTypeChild: InteractionResponseType = InteractionResponseType.None;
            lZoneChild.addInteractionListener((pReason: InteractionReason) => {
                lResponeTypeChild |= pReason.interactionType;
            });

            // Process. Setup listener child child.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });

            lZone.execute(() => {
                lZoneChild.execute(() => {
                    lZoneChildChild.execute(() => {
                        InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetStart, {}));
                        InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetEnd, {}));
                        InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertySetStart, {}));
                    });
                });
            });

            // Evaluation.
            expect(lResponeTypeChildChild).to.equal(InteractionResponseType.PropertyGetStart | InteractionResponseType.PropertyGetEnd | InteractionResponseType.PropertySetStart);
            expect(lResponeTypeChild).to.equal(InteractionResponseType.PropertyGetStart | InteractionResponseType.PropertyGetEnd);
            expect(lResponeType).to.equal(InteractionResponseType.PropertyGetStart);
        });

        it('-- Dont trigger attached zones of interaction proxy when current zone does not have trigger', () => {
            // Setup. Create proxy.
            const lProxy = new InteractionDetectionProxy({ a: 1 });

            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.None });
            const lAttachedZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PropertySetStart });

            // Setup. Attach zone.
            lAttachedZone.execute(() => {
                lProxy.addListenerZone(InteractionZone.save());
            });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lAttachedZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
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

        it('-- DetectionCatchType.FunctionCallStart', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.FunctionCallStart });
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
            expect(lResponeType).to.be.equal(InteractionResponseType.FunctionCallStart);
        });

        it('-- DetectionCatchType.FunctionCallEnd', () => {
            it('-- Default', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.FunctionCallEnd });
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
                expect(lResponeType).to.be.equal(InteractionResponseType.FunctionCallEnd);
            });

            it('-- On error', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.FunctionCallEnd });
                const lFunction: () => void = InteractionZone.registerObject(() => { throw 1; });

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                lInteractionZone.execute(() => {
                    try {
                        lFunction();
                    } catch (_pError) {/* Any */ }
                });

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.FunctionCallEnd);
            });
        });

        it('-- DetectionCatchType.FunctionCallError', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.FunctionCallError });
            const lFunction: () => void = InteractionZone.registerObject(() => { throw 1; });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            lInteractionZone.execute(() => {
                try {
                    lFunction();
                } catch (_pError) {/* Any */ }
            });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.FunctionCallError);
        });

        it('-- DetectionCatchType.CallbackCallStart', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.CallbackCallStart });

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
            expect(lResponeType).to.be.equal(InteractionResponseType.CallbackCallStart);
        });

        describe('-- DetectionCatchType.CallbackCallEnd', () => {
            it('-- Default', (pDone: Mocha.Done) => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.CallbackCallEnd });

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

        it('-- DetectionCatchType.CallbackCallError', (pDone: Mocha.Done) => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.CallbackCallError });

            // Process.
            lInteractionZone.addInteractionListener(() => {
                pDone();
            });
            lInteractionZone.execute(() => {
                // Unable to catch async callback errors :(
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.CallbackCallError, {}));
            });
        });

        it('-- DetectionCatchType.PropertySetStart', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PropertySetStart });
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
            expect(lResponeType).to.be.equal(InteractionResponseType.PropertySetStart);
        });

        describe('-- DetectionCatchType.PropertySetEnd', () => {
            it('-- Default', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PropertySetEnd });
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
                expect(lResponeType).to.be.equal(InteractionResponseType.PropertySetEnd);
            });

            it('-- On error', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PropertySetEnd });
                const lObject: { a: number; } = InteractionZone.registerObject(new class { set a(_pVal: number) { throw 1; } }());

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                lInteractionZone.execute(() => {
                    try {
                        lObject.a = 2;
                    } catch (_pError) {/* Any */ }
                });

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.PropertySetEnd);
            });
        });

        it('-- DetectionCatchType.PropertySetError', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PropertySetError });
            const lObject: { a: number; } = InteractionZone.registerObject(new class { set a(_pVal: number) { throw 1; } }());

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            lInteractionZone.execute(() => {
                try {
                    lObject.a = 2;
                } catch (_pError) {/* Any */ }
            });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.PropertySetError);
        });

        it('-- DetectionCatchType.PropertyGetStart', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PropertyGetStart });
            const lObject: { a: number; } = InteractionZone.registerObject({ a: 0 });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            lInteractionZone.execute(() => {
                lObject.a;
            });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.PropertyGetStart);
        });

        describe('-- DetectionCatchType.PropertyGetEnd', () => {
            it('-- Default', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PropertyGetEnd });
                const lObject: { a: number; } = InteractionZone.registerObject({ a: 0 });

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                lInteractionZone.execute(() => {
                    lObject.a;
                });

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.PropertyGetEnd);
            });

            it('-- On error', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PropertyGetEnd });
                const lObject: { a: number; } = InteractionZone.registerObject(new class { get a(): number { throw 1; } }());

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                lInteractionZone.execute(() => {
                    try {
                        lObject.a;
                    } catch (_pError) {/* Any */ }
                });

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.PropertyGetEnd);
            });
        });

        it('-- DetectionCatchType.PropertyGetError', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PropertyGetError });
            const lObject: { a: number; } = InteractionZone.registerObject(new class { get a(): number { throw 1; } }());

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            lInteractionZone.execute(() => {
                try {
                    lObject.a;
                } catch (_pError) {/* Any */ }
            });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.PropertyGetError);
        });

        it('-- DetectionCatchType.PropertyDeleteStart', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PropertyDeleteStart });
            const lObject: { a?: number; } = InteractionZone.registerObject({ a: 0 });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            lInteractionZone.execute(() => {
                delete lObject.a;
            });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.PropertyDeleteStart);
        });

        describe('-- DetectionCatchType.PropertyDeleteEnd', () => {
            it('-- Default', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PropertyDeleteEnd });
                const lObject: { a?: number; } = InteractionZone.registerObject({ a: 0 });

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                lInteractionZone.execute(() => {
                    delete lObject.a;
                });

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.PropertyDeleteEnd);
            });

            it('-- On error', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PropertyDeleteEnd });
                const lObject: { a?: number; } = InteractionZone.registerObject(Object.defineProperty({}, 'a', { configurable: false, value: 1 }));

                // Process.
                let lResponeType: InteractionResponseType = InteractionResponseType.None;
                lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                    lResponeType |= pReason.interactionType;
                });
                lInteractionZone.execute(() => {
                    try {
                        delete lObject.a;
                    } catch (_pError) {/* Any */ }
                });

                // Evaluation.
                expect(lResponeType).to.be.equal(InteractionResponseType.PropertyDeleteEnd);
            });
        });

        it('-- DetectionCatchType.PropertyDeleteError', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PropertyDeleteError });
            const lObject: { a?: number; } = InteractionZone.registerObject(Object.defineProperty({}, 'a', { configurable: false, value: 1 }));

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            lInteractionZone.execute(() => {
                try {
                    delete lObject.a;
                } catch (_) {/* Any */ }
            });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.PropertyDeleteError);
        });

        it('-- InteractionResponseType.PromiseStart', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseStart });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            await lInteractionZone.execute(async () => {
                return new Promise<void>((pResolve) => { pResolve(); });
            });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.PromiseStart);
        });

        it('-- InteractionResponseType.PromiseEnd', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseEnd });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            await lInteractionZone.execute(async () => {
                return new Promise<void>((pResolve) => { pResolve(); });
            });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.PromiseEnd);
        });

        it('-- InteractionResponseType.PromiseResolve', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseResolve });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            await lInteractionZone.execute(async () => {
                return new Promise<void>((pResolve) => { pResolve(); });
            });

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.PromiseResolve);
        });

        it('-- InteractionResponseType.PromiseReject', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseReject });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            try {
                await lInteractionZone.execute(async () => {
                    return new Promise<void>((_pResolve, pReject) => { pReject(); });
                });
            } catch (_err) { /* Nothing */ }

            // Evaluation.
            expect(lResponeType).to.be.equal(InteractionResponseType.PromiseReject);
        });


        it('-- DetectionCatchType.EventlistenerStart', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.EventlistenerStart });
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
            expect(lResponeType).to.be.equal(InteractionResponseType.EventlistenerStart);
        });

        describe('-- DetectionCatchType.EventlistenerEnd', () => {
            it('-- Default', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.EventlistenerEnd });
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
                expect(lResponeType).to.be.equal(InteractionResponseType.EventlistenerEnd);
            });

            it('-- On error', () => {
                // Setup.
                const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.EventlistenerEnd });
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
                expect(lResponeType).to.be.equal(InteractionResponseType.EventlistenerEnd);
            });
        });

        it('-- DetectionCatchType.EventlistenerError', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.EventlistenerError });
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
            expect(lResponeType).to.be.equal(InteractionResponseType.EventlistenerError);
        });

        it('-- DetectionCatchType.NativeFunctionCall', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('CD-Native', { trigger: InteractionResponseType.NativeFunctionCall });
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
            expect(lResponseType).to.equal(InteractionResponseType.NativeFunctionCall);
        });

        it('-- Negative', () => {
            // Setup.
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.PromiseStart });

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
            const lInteractionZone: InteractionZone = new InteractionZone('Name', { trigger: InteractionResponseType.CallbackCallStart });

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
        it('-- Read reason zone without dispatch', () => {
            // Setup.
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.None, {});

            // Process
            const lErrorFunction = () => {
                lReason.zone;
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(Exception, 'Interaction reason not dispatched.');
        });

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

            // Setup. Create reason.
            const lZone: InteractionZone = new InteractionZone('ZoneName', { trigger: InteractionResponseType.Custom });
            const lReason: InteractionReason = lZone.execute(() => {
                const lReason = new InteractionReason(InteractionResponseType.Custom, lTarget);
                lReason.setOrigin(InteractionZone.save());

                return lReason;
            });

            // Process
            const lReasonAsString = lReason.toString();

            // Evaluation.
            expect(lReasonAsString).to.equal(`${lZone.name}: ${typeof lTarget}:${'lFunctionName'} -> ${InteractionResponseType[InteractionResponseType.Custom]}`);
        });

        it('-- Passthrough class name.', () => {
            // Setup. 
            const lTarget = new class ClassName { }();

            // Setup. Create reason.
            const lZone: InteractionZone = new InteractionZone('ZoneName', { trigger: InteractionResponseType.Custom });
            const lReason: InteractionReason = lZone.execute(() => {
                const lReason = new InteractionReason(InteractionResponseType.Custom, lTarget);
                lReason.setOrigin(InteractionZone.save());

                return lReason;
            });

            // Process
            const lReasonAsString = lReason.toString();

            // Evaluation.
            expect(lReasonAsString).to.equal(`${lZone.name}: ${typeof lTarget}:${'ClassName'} -> ${InteractionResponseType[InteractionResponseType.Custom]}`);
        });

        it('-- Passthrough property name.', () => {
            // Setup. 
            const lTarget = new class ClassName { }();
            const lPropertyName: string = 'PropertyName';

            // Setup. Create reason.
            const lZone: InteractionZone = new InteractionZone('ZoneName', { trigger: InteractionResponseType.Custom });
            const lReason: InteractionReason = lZone.execute(() => {
                const lReason = new InteractionReason(InteractionResponseType.Custom, lTarget, lPropertyName);
                lReason.setOrigin(InteractionZone.save());

                return lReason;
            });

            // Process
            const lReasonAsString = lReason.toString();

            // Evaluation.
            expect(lReasonAsString).to.equal(`${lZone.name}: ${typeof lTarget}:${'ClassName'}[${lPropertyName}] -> ${InteractionResponseType[InteractionResponseType.Custom]}`);
        });

        it('-- Correct origin', () => {
            // Setup. Create reason.
            const lZone: InteractionZone = new InteractionZone('ZoneName', { trigger: InteractionResponseType.Custom });
            let lOrigin: InteractionZoneStack | null = null;
            const lReason: InteractionReason = lZone.execute(() => {
                lOrigin = InteractionZone.save();

                const lReason = new InteractionReason(InteractionResponseType.Custom, {});
                lReason.setOrigin(lOrigin);

                return lReason;
            });

            // Process
            const lReasonOrigin = lReason.origin;

            // Evaluation.
            expect(lReasonOrigin).to.equal(lOrigin);
        });
    });
});