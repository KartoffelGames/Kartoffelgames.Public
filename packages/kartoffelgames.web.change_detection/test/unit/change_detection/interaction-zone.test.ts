import '../../mock/request-animation-frame-mock-session';
import { expect } from 'chai';
import { InteractionZone } from '../../../source/change_detection/interaction-zone';
import { PreventableErrorEvent, PromiseRejectionEvent } from '../../mock/error-event';
import { InteractionReason } from '../../../source/change_detection/interaction-reason';
import { InteractionResponseType } from '../../../source/change_detection/enum/interaction-response-type.enum';
import { Exception } from '@kartoffelgames/core.data';
import { Patcher } from '../../../source/change_detection/asynchron_tracker/patcher/patcher';
import { InteractionDetectionProxy } from '../../../source/change_detection/synchron_tracker/interaction-detection-proxy';

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
            const lReason: InteractionReason = new InteractionReason(InteractionResponseType.PropertyGetStart, new Object(), 2);

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
            let lErrorMessage: string = '';
            lInteractionZone.addInteractionListener((pReason: InteractionReason) => {
                try {
                    InteractionZone.dispatchInteractionEvent(pReason);
                } catch (pError) {
                    lErrorMessage = (<Exception<any>>pError).message;
                }

            });

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.dispatchInteractionEvent(lReason);
            });

            // Evaluation.
            expect(lErrorMessage).to.equal(`Can't add a static zone to interaction reason.`);
        });
    });

    // TODO: Save and restore.

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

        it('-- Error listener called syncron in correct zone', async () => {
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

            // Process. Throw error in zone.
            try {
                lInteractionErrorZone.execute(() => {
                    throw '';
                });
            } catch (pError) {
                window.dispatchEvent(new ErrorEvent('error', {
                    error: '',
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
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetStart, lFunction));
            });

            // Evaluation.
            expect(lZoneNameResult).to.equal(lZoneName);
            expect(lExecutedFunction).to.equal(lFunction);
        });

        it('-- Inherit parent trigger', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PropertyGetStart, isolate: true });
            const lZoneChild: InteractionZone = lZone.execute(() => {
                return new InteractionZone('ZoneChild');
            });

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
            expect(lResponeType).to.equal(InteractionResponseType.PropertyGetStart);
        });

        it('-- Override parent trigger', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PropertyGetStart, isolate: true });
            const lZoneChild: InteractionZone = lZone.execute(() => {
                return new InteractionZone('ZoneChild', { trigger: InteractionResponseType.PropertyGetEnd });
            });

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
            expect(lResponeType).to.equal(InteractionResponseType.PropertyGetEnd);
        });

        it('-- Passthrough child trigger', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PropertyGetStart, isolate: true });
            const lZoneChild: InteractionZone = lZone.execute(() => {
                return new InteractionZone('ZoneChild', { trigger: InteractionResponseType.PropertyGetStart | InteractionResponseType.PropertyGetEnd });
            });

            // Process.
            let lResponeType: InteractionResponseType = InteractionResponseType.None;
            lZone.addInteractionListener((pReason: InteractionReason) => {
                lResponeType |= pReason.interactionType;
            });
            lZoneChild.execute(() => {
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetStart, {}));
                InteractionZone.dispatchInteractionEvent(new InteractionReason(InteractionResponseType.PropertyGetEnd, {}));
            });

            // Evaluation.
            expect(lResponeType).to.equal(InteractionResponseType.PropertyGetStart | InteractionResponseType.PropertyGetEnd);
        });

        it('-- Dont trigger attached zones of interaction proxy when current zone does not have trigger', () => {
            // Setup. Create proxy.
            const lProxy = new InteractionDetectionProxy({ a: 1 });

            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.None });
            const lAttachedZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PropertySetStart });

            // Setup. Attach zone.
            lAttachedZone.execute(() => {
                lProxy.attachZoneStack(InteractionZone.save());
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
    });
});