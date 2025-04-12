import { expect } from '@kartoffelgames/core-test';
import type { InteractionZoneEvent } from '../source/interaction-zone/interaction-zone-event.ts';
import { InteractionZone } from '../source/interaction-zone/interaction-zone.ts';
import { PromiseRejectionEvent } from './mock/error-event.ts';

Deno.test('InteractionZone.current', async (pContext) => {
    await pContext.step('Available Zone', () => {
        // Setup.
        const lFirstInteractionZone: InteractionZone = InteractionZone.current.create('Name');
        const lSecondInteractionZone: InteractionZone = InteractionZone.current.create('AnotherName');

        // Process.
        const lCurrentInteractionZone: InteractionZone = lFirstInteractionZone.execute(() => {
            return lSecondInteractionZone.execute(() => {
                return InteractionZone.current;
            });
        });

        // Evaluation.
        expect(lCurrentInteractionZone).toBe(lSecondInteractionZone);
    });

    await pContext.step('No Zone', () => {
        // Process.
        const lCurrentInteractionZone: InteractionZone = InteractionZone.current;

        // Evaluation.
        expect(lCurrentInteractionZone.name).toBe('Default');
    });
});

Deno.test('InteractionZone.enableGlobal()', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Global.
        const lGlobalScope = {
            promise: class <T> extends Promise<T> { },
            eventTarget: class extends EventTarget { }
        };

        // Process. Its patched anyway.
        const lWasPatched = InteractionZone.enableGlobalTracing({
            target: lGlobalScope,
            patches: {
                requirements: {
                    promise: 'promise',
                    eventTarget: 'eventTarget'
                }
            }
        });

        // Process. Get patched and original function.
        const lPatched: boolean = (<any>lGlobalScope).globalPatched;

        // Evaluation.
        expect(lPatched).toBeTruthy();
        expect(lWasPatched).toBeTruthy();
    });
    await pContext.step('Double patch', async () => {
        // Setup. Global.
        const lGlobalScope = {
            promise: class <T> extends Promise<T> { },
            eventTarget: class extends EventTarget { }
        };

        // Process. Its patched anyway.
        const lWasPatchedOne = InteractionZone.enableGlobalTracing({
            target: lGlobalScope,
            patches: {
                requirements: {
                    promise: 'promise',
                    eventTarget: 'eventTarget'
                }
            }
        });
        const lWasPatchedTwo = InteractionZone.enableGlobalTracing({
            target: lGlobalScope,
            patches: {
                requirements: {
                    promise: 'promise',
                    eventTarget: 'eventTarget'
                }
            }
        });

        // Process. Get patched and original function.
        const lPatched: boolean = (<any>lGlobalScope).globalPatched;

        // Evaluation.
        expect(lPatched).toBeTruthy();
        expect(lWasPatchedOne).toBeTruthy();
        expect(lWasPatchedTwo).toBeFalsy();
    });
    await pContext.step('Patch error handling without event target', async () => {
        // Setup. Global.
        const lGlobalScope = {
            promise: class <T> extends Promise<T> { },
            eventTarget: class extends EventTarget { }
        };

        // Process. Get patched and original function.
        const lErrorFunction = ()=> {
            InteractionZone.enableGlobalTracing({
                target: lGlobalScope,
                patches: {
                    requirements: {
                        promise: 'promise',
                        eventTarget: 'eventTarget'
                    }
                },
                errorHandling: true
            });
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('Global scope does not support addEventListener');
    });
});


Deno.test('InteractionZone.pushInteraction()', async (pContext) => {
    await pContext.step('Push calls listener', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
        const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
        const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;

        // Process. Add listener.
        let lCalled: boolean = false;
        lInteractionZone.addInteractionListener(lInteractionType, () => {
            lCalled = true;
        });

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, {});
        });

        // Evaluation.
        expect(lCalled).toBeTruthy();
    });

    await pContext.step('Generated event has correct origin', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
        const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
        const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;

        // Process. Add listener.
        let lReasonResult: InteractionZoneEvent<TestTriggerEnum> | null = null;
        lInteractionZone.addInteractionListener(lInteractionType, (pReason: InteractionZoneEvent<TestTriggerEnum>) => {
            lReasonResult = pReason;
        });

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, {});
        });

        // Evaluation.
        expect(lReasonResult!.origin).toBe(lInteractionZone);
    });

    await pContext.step('Generated event has correct trigger', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
        const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
        const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;

        // Process. Add listener.
        let lReasonResult: InteractionZoneEvent<TestTriggerEnum> | null = null;
        lInteractionZone.addInteractionListener(lInteractionType, (pReason: InteractionZoneEvent<TestTriggerEnum>) => {
            lReasonResult = pReason;
        });

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, {});
        });

        // Evaluation.
        expect(lReasonResult!.trigger).toBe(lInteractionTrigger);
    });

    await pContext.step('Generated event has correct type', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
        const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
        const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;

        // Process. Add listener.
        let lReasonResult: InteractionZoneEvent<TestTriggerEnum> | null = null;
        lInteractionZone.addInteractionListener(lInteractionType, (pReason: InteractionZoneEvent<TestTriggerEnum>) => {
            lReasonResult = pReason;
        });

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, {});
        });

        // Evaluation.
        expect(lReasonResult!.type).toBe(lInteractionType);
    });

    await pContext.step('Generated event has correct type data', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
        const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
        const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;
        const lInteractionData = { a: 1 };

        // Process. Add listener.
        let lReasonResult: InteractionZoneEvent<TestTriggerEnum> | null = null;
        lInteractionZone.addInteractionListener(lInteractionType, (pReason: InteractionZoneEvent<TestTriggerEnum>) => {
            lReasonResult = pReason;
        });

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, lInteractionData);
        });

        // Evaluation.
        expect(lReasonResult!.data).toBe(lInteractionData);
    });

    await pContext.step('Pass through parent', () => {
        // Setup.
        const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Name');
        const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('CD-child');
        const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
        const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;

        // Process. Add listener.
        let lCalled: boolean = false;
        lParentInteractionZone.addInteractionListener(lInteractionType, () => {
            lCalled = true;
        });

        // Process. Call listener.
        lChildInteractionZone.execute(() => {
            InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, {});
        });

        // Evaluation.
        expect(lCalled).toBeTruthy();
    });

    await pContext.step('Pass through parent correct origin', () => {
        // Setup.
        const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Name');
        const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('CD-child');
        const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
        const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;

        // Process. Add listener.
        let lReasonResult: InteractionZoneEvent<TestTriggerEnum> | null = null;
        lParentInteractionZone.addInteractionListener(lInteractionType, (pReason: InteractionZoneEvent<TestTriggerEnum>) => {
            lReasonResult = pReason;
        });

        // Process. Call listener.
        lChildInteractionZone.execute(() => {
            InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, {});
        });

        // Evaluation.
        expect(lReasonResult!.origin).toBe(lChildInteractionZone);
    });

    await pContext.step('Ignore none parent zones not in scope', () => {
        // Setup.
        const lCorrectInteractionZone: InteractionZone = InteractionZone.current.create('Correct');
        const lParalellZone: InteractionZone = InteractionZone.current.create('No so correct');
        const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
        const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;

        // Process. Add listener.
        let lCalled: boolean = false;
        lParalellZone.addInteractionListener(lInteractionType, () => {
            lCalled = true;
        });

        // Process. Call listener.
        lCorrectInteractionZone.execute(() => {
            InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, {});
        });

        // Evaluation.
        expect(lCalled).toBeFalsy();
    });
});

Deno.test('InteractionZone.name', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lName: string = 'CD-Name';
        const lInteractionZone: InteractionZone = InteractionZone.current.create(lName);

        // Process.
        const lNameResult: string = lInteractionZone.name;

        // Evaluation.
        expect(lNameResult).toBe(lName);
    });
});

Deno.test('InteractionZone.parent', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Name');
        const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('CD-child');

        // Process.
        const lParentResult: InteractionZone = lChildInteractionZone.parent;

        // Evaluation.
        expect(lParentResult).toBe(lParentInteractionZone);
    });
});

Deno.test('InteractionZone.addErrorListener()', async (pContext) => {
    await pContext.step('Synchron', async (pContext) => {
        await pContext.step('Error listener called', () => {
            // Setup. Global.
            const lGlobalScope = new (class extends EventTarget {
                public eventTarget = class extends EventTarget { };
                public promise = class <T> extends Promise<T> { };
            })();
            InteractionZone.enableGlobalTracing({
                target: lGlobalScope,
                patches: {
                    requirements: {
                        promise: 'promise',
                        eventTarget: 'eventTarget'
                    }
                },
                errorHandling: true
            });

            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            lInteractionZone.addErrorListener(() => {
                lErrorListenerCalled = true;
            });

            // Process. Throw error in zone.
            try {
                lInteractionZone.execute(() => {
                    throw new Error();
                });
            } catch (pError) {
                lGlobalScope.dispatchEvent(new ErrorEvent('error', {
                    error: <Error>pError
                }));
            }

            // Evaluation.
            expect(lErrorListenerCalled).toBeTruthy();
        });

        await pContext.step('Error listener called with correct error', () => {
            // Setup. Global.
            const lGlobalScope = new (class extends EventTarget {
                public eventTarget = class extends EventTarget { };
                public promise = class <T> extends Promise<T> { };
            })();
            InteractionZone.enableGlobalTracing({
                target: lGlobalScope,
                patches: {
                    requirements: {
                        promise: 'promise',
                        eventTarget: 'eventTarget'
                    }
                },
                errorHandling: true
            });

            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lError: Error = new Error();

            // Process. Set error listener.
            let lErrorListenerError: Error | null = null;
            lInteractionZone.addErrorListener((pError) => {
                lErrorListenerError = pError;
            });

            // Process. Throw error in zone.
            try {
                lInteractionZone.execute(() => {
                    throw lError;
                });
            } catch (pError) {
                lGlobalScope.dispatchEvent(new ErrorEvent('error', {
                    error: <Error>pError
                }));
            }

            // Evaluation.
            expect(lErrorListenerError).toBe(lError);
        });

        await pContext.step('Parent Error listener called', () => {
            // Setup. Global.
            const lGlobalScope = new (class extends EventTarget {
                public eventTarget = class extends EventTarget { };
                public promise = class <T> extends Promise<T> { };
            })();
            InteractionZone.enableGlobalTracing({
                target: lGlobalScope,
                patches: {
                    requirements: {
                        promise: 'promise',
                        eventTarget: 'eventTarget'
                    }
                },
                errorHandling: true
            });

            // Setup.
            const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
            const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('Child');

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            lParentInteractionZone.addErrorListener(() => {
                lErrorListenerCalled = true;
            });

            // Process. Throw error in zone.
            try {
                lChildInteractionZone.execute(() => {
                    throw new Error();
                });
            } catch (pError) {
                lGlobalScope.dispatchEvent(new ErrorEvent('error', {
                    error: <Error>pError
                }));
            }

            // Evaluation.
            expect(lErrorListenerCalled).toBeTruthy();
        });

        await pContext.step('Ignore Parent Error listener when default prevented', () => {
            // Setup. Global.
            const lGlobalScope = new (class extends EventTarget {
                public eventTarget = class extends EventTarget { };
                public promise = class <T> extends Promise<T> { };
            })();
            InteractionZone.enableGlobalTracing({
                target: lGlobalScope,
                patches: {
                    requirements: {
                        promise: 'promise',
                        eventTarget: 'eventTarget'
                    }
                },
                errorHandling: true
            });

            // Setup.
            const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
            const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('Child');

            lChildInteractionZone.addErrorListener(() => {
                return false;
            });

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            lParentInteractionZone.addErrorListener(() => {
                lErrorListenerCalled = true;
            });

            // Process. Throw error in zone.
            try {
                lChildInteractionZone.execute(() => {
                    throw new Error();
                });
            } catch (pError) {
                lGlobalScope.dispatchEvent(new ErrorEvent('error', {
                    error: <Error>pError
                }));
            }

            // Evaluation.
            expect(lErrorListenerCalled).toBeFalsy();
        });

        await pContext.step('Ignore Error listener for errors outside zone', () => {
            // Setup. Global.
            const lGlobalScope = new (class extends EventTarget {
                public eventTarget = class extends EventTarget { };
                public promise = class <T> extends Promise<T> { };
            })();
            InteractionZone.enableGlobalTracing({
                target: lGlobalScope,
                patches: {
                    requirements: {
                        promise: 'promise',
                        eventTarget: 'eventTarget'
                    }
                },
                errorHandling: true
            });

            // Setup.
            const lCorrectInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
            const lParallelInteractionZone: InteractionZone = lCorrectInteractionZone.create('Child');

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            lParallelInteractionZone.addErrorListener(() => {
                lErrorListenerCalled = true;
            });

            // Process. Throw error in zone.
            try {
                lCorrectInteractionZone.execute(() => {
                    throw new Error();
                });
            } catch (pError) {
                lGlobalScope.dispatchEvent(new ErrorEvent('error', {
                    error: <Error>pError
                }));
            }

            // Evaluation.
            expect(lErrorListenerCalled).toBeFalsy();
        });

        await pContext.step('Ignore Error listener for errors without zone', () => {
            // Setup. Global.
            const lGlobalScope = new (class extends EventTarget {
                public eventTarget = class extends EventTarget { };
                public promise = class <T> extends Promise<T> { };
            })();
            InteractionZone.enableGlobalTracing({
                target: lGlobalScope,
                patches: {
                    requirements: {
                        promise: 'promise',
                        eventTarget: 'eventTarget'
                    }
                },
                errorHandling: true
            });

            // Setup.
            const lCorrectInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
            const lParallelInteractionZone: InteractionZone = lCorrectInteractionZone.create('Child');

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            lParallelInteractionZone.addErrorListener(() => {
                lErrorListenerCalled = true;
            });

            // Process. Throw error outside.
            lGlobalScope.dispatchEvent(new ErrorEvent('error', {
                error: new Error()
            }));

            // Evaluation.
            expect(lErrorListenerCalled).toBeFalsy();
        });

        await pContext.step('Ignore Error listener for errors for errors that are none objects', () => {
            // Setup. Global.
            const lGlobalScope = new (class extends EventTarget {
                public eventTarget = class extends EventTarget { };
                public promise = class <T> extends Promise<T> { };
            })();
            InteractionZone.enableGlobalTracing({
                target: lGlobalScope,
                patches: {
                    requirements: {
                        promise: 'promise',
                        eventTarget: 'eventTarget'
                    }
                },
                errorHandling: true
            });

            // Setup.
            const lCorrectInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
            const lParallelInteractionZone: InteractionZone = lCorrectInteractionZone.create('Child');

            // Process. Set error listener.
            let lErrorListenerCalled: boolean = false;
            lParallelInteractionZone.addErrorListener(() => {
                lErrorListenerCalled = true;
            });

            // Process. Throw error outside.
            lGlobalScope.dispatchEvent(new ErrorEvent('error', {
                error: 'None Object'
            }));

            // Evaluation.
            expect(lErrorListenerCalled).toBeFalsy();
        });
    });

    await pContext.step('Asynchron', async (pContext) => {
        await pContext.step('Error listener called', async () => {
            // Setup. Global.
            const lGlobalScope = new (class extends EventTarget {
                public eventTarget = class extends EventTarget { };
                public promise = class <T> extends Promise<T> { };
            })();
            InteractionZone.enableGlobalTracing({
                target: lGlobalScope,
                patches: {
                    requirements: {
                        promise: 'promise',
                        eventTarget: 'eventTarget'
                    }
                },
                errorHandling: true
            });

            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Process. Set error listener.
            const lErrorCalledWaiter = new Promise<boolean>((pResolve) => {
                lInteractionZone.addErrorListener(() => {
                    pResolve(true);
                });
            });

            // Process. Create promise in zone.
            const lPromise: Promise<void> = lInteractionZone.execute(() => {
                return new lGlobalScope.promise<void>(() => { });
            });

            // Process. "Throw" promise into global scope.
            lGlobalScope.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                promise: <Promise<void>><any>lPromise,
                reason: new Error()
            }));

            // Process. Wait for error.
            const lErrorListenerCalled = await lErrorCalledWaiter;

            // Evaluation.
            expect(lErrorListenerCalled).toBeTruthy();
        });

        await pContext.step('Error listener called with correct error', async () => {
            // Setup. Global.
            const lGlobalScope = new (class extends EventTarget {
                public eventTarget = class extends EventTarget { };
                public promise = class <T> extends Promise<T> { };
            })();
            InteractionZone.enableGlobalTracing({
                target: lGlobalScope,
                patches: {
                    requirements: {
                        promise: 'promise',
                        eventTarget: 'eventTarget'
                    }
                },
                errorHandling: true
            });

            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lError: Error = new Error();

            // Process. Set error listener.
            const lErrorWaiter = new Promise<Error>((pResolve) => {
                lInteractionZone.addErrorListener(() => {
                    pResolve(lError);
                });
            });

            // Process. Create promise in zone. 
            const lPromise: Promise<void> = lInteractionZone.execute(() => {
                return new lGlobalScope.promise<void>(() => { });
            });

            // Process. "Throw" promise into global scope.
            lGlobalScope.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                promise: <Promise<void>><any>lPromise,
                reason: new Error()
            }));

            // Process. Wait for error.
            const lErrorListenerError = await lErrorWaiter;

            // Evaluation.
            expect(lErrorListenerError).toBe(lError);
        });

        await pContext.step('Parent Error listener called', async () => {
            // Setup. Global.
            const lGlobalScope = new (class extends EventTarget {
                public eventTarget = class extends EventTarget { };
                public promise = class <T> extends Promise<T> { };
            })();
            InteractionZone.enableGlobalTracing({
                target: lGlobalScope,
                patches: {
                    requirements: {
                        promise: 'promise',
                        eventTarget: 'eventTarget'
                    }
                },
                errorHandling: true
            });

            // Setup.
            const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
            const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('Child');

            // Process. Set error listener.
            const lErrorCalledWaiter = new Promise<boolean>((pResolve) => {
                lParentInteractionZone.addErrorListener(() => {
                    pResolve(true);
                });
            });

            // Process. Create promise in zone. 
            const lPromise: Promise<void> = lChildInteractionZone.execute(() => {
                return new lGlobalScope.promise<void>(() => { });
            });

            // Process. "Throw" promise into global scope.
            lGlobalScope.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                promise: <Promise<void>><any>lPromise,
                reason: new Error()
            }));

            // Process. Wait for error.
            const lErrorListenerCalled = await lErrorCalledWaiter;
            // Evaluation.
            expect(lErrorListenerCalled).toBeTruthy();
        });

        await pContext.step('Ignore Parent Error listener when default prevented', async () => {
            // Setup. Global.
            const lGlobalScope = new (class extends EventTarget {
                public eventTarget = class extends EventTarget { };
                public promise = class <T> extends Promise<T> { };
            })();
            InteractionZone.enableGlobalTracing({
                target: lGlobalScope,
                patches: {
                    requirements: {
                        promise: 'promise',
                        eventTarget: 'eventTarget'
                    }
                },
                errorHandling: true
            });

            // Setup.
            const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
            const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('Child');

            // Setup. Child listener that prevents bubbling.
            lChildInteractionZone.addErrorListener(() => {
                return false;
            });

            // Process. Set error listener.
            const lErrorCalledWaiter = new Promise<boolean>((pResolve) => {
                lParentInteractionZone.addErrorListener(() => {
                    pResolve(true);
                });

                globalThis.setTimeout(() => { pResolve(false); }, 20);
            });

            // Process. Create promise in zone. 
            const lPromise: Promise<void> = lChildInteractionZone.execute(() => {
                return new lGlobalScope.promise<void>(() => { });
            });

            // Process. "Throw" promise into global scope.
            lGlobalScope.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                promise: <Promise<void>><any>lPromise,
                reason: new Error()
            }));

            // Process. Wait for error.
            const lErrorListenerCalled = await lErrorCalledWaiter;

            // Evaluation.
            expect(lErrorListenerCalled).toBeFalsy();
        });

        await pContext.step('Ignore Error listener called outside zone', async () => {
            // Setup. Global.
            const lGlobalScope = new (class extends EventTarget {
                public eventTarget = class extends EventTarget { };
                public promise = class <T> extends Promise<T> { };
            })();
            InteractionZone.enableGlobalTracing({
                target: lGlobalScope,
                patches: {
                    requirements: {
                        promise: 'promise',
                        eventTarget: 'eventTarget'
                    }
                },
                errorHandling: true
            });

            // Setup.
            const lCorrectInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
            const lParallelInteractionZone: InteractionZone = lCorrectInteractionZone.create('Child');

            // Process. Set error listener.
            const lErrorCalledWaiter = new Promise<boolean>((pResolve) => {
                lParallelInteractionZone.addErrorListener(() => {
                    pResolve(true);
                });

                globalThis.setTimeout(() => { pResolve(false); }, 20);
            });

            // Process. Create promise in zone. 
            const lPromise: Promise<void> = lCorrectInteractionZone.execute(() => {
                return new lGlobalScope.promise<void>(() => { });
            });

            // Process. "Throw" promise into global scope.
            lGlobalScope.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                promise: <Promise<void>><any>lPromise,
                reason: new Error()
            }));

            // Process. Wait for error.
            const lErrorListenerCalled = await lErrorCalledWaiter;

            // Evaluation.
            expect(lErrorListenerCalled).toBeFalsy();
        });
    });

    await pContext.step('Convert non object errors into error objects for syncron errors', () => {
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
        expect(lErrorResult?.message).toBe(lError);
    });

    await pContext.step('Double added listener', () => {
        // Setup. Global.
        const lGlobalScope = new (class extends EventTarget {
            public eventTarget = class extends EventTarget { };
            public promise = class <T> extends Promise<T> { };
        })();
        InteractionZone.enableGlobalTracing({
            target: lGlobalScope,
            patches: {
                requirements: {
                    promise: 'promise',
                    eventTarget: 'eventTarget'
                }
            },
            errorHandling: true
        });

        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

        // Process. Set error listener.
        let lErrorListenerCallCount: number = 0;
        const lErrorListener = () => {
            lErrorListenerCallCount++;
        };
        lInteractionZone.addErrorListener(lErrorListener);
        lInteractionZone.addErrorListener(lErrorListener);

        // Process. Throw error in zone.
        try {
            lInteractionZone.execute(() => {
                throw new Error();
            });
        } catch (pError) {
            lGlobalScope.dispatchEvent(new ErrorEvent('error', {
                error: <Error>pError
            }));
        }

        // Evaluation.
        expect(lErrorListenerCallCount).toBe(1);
    });
});

Deno.test('InteractionZone.addInteractionListener()', async (pContext) => {
    await pContext.step('Listener called', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        lInteractionZone.addInteractionListener(TestTriggerEnum, () => {
            lListenerCalled = true;
        });

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeTruthy();
    });

    await pContext.step('Double add listener', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

        // Process. Add listener.
        let lListenerCounter: number = 0;
        const lListener = () => {
            lListenerCounter++;
        };
        lInteractionZone.addInteractionListener(TestTriggerEnum, lListener);
        lInteractionZone.addInteractionListener(TestTriggerEnum, lListener);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCounter).toBe(1);
    });

    await pContext.step('Parent listener called', () => {
        // Setup.
        const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
        const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('Child');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        lParentInteractionZone.addInteractionListener(TestTriggerEnum, () => {
            lListenerCalled = true;
        });

        // Process. Call listener.
        lChildInteractionZone.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeTruthy();
    });

    await pContext.step('Listener ignored wrong trigger type', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        lInteractionZone.addInteractionListener(TestTriggerEnumOther, () => {
            lListenerCalled = true;
        });

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });

    await pContext.step('Listener ignored restricted trigger', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
        lInteractionZone.addTriggerRestriction(TestTriggerEnum, TestTriggerEnum.Custom2);

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        lInteractionZone.addInteractionListener(TestTriggerEnum, () => {
            lListenerCalled = true;
        });

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });

    await pContext.step('Ignore listener outside zone', () => {
        // Setup.
        const lCorrectInteractionZone: InteractionZone = InteractionZone.current.create('Correct');
        const lParallelInteractionZone: InteractionZone = InteractionZone.current.create('Other');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        lParallelInteractionZone.addInteractionListener(TestTriggerEnum, () => {
            lListenerCalled = true;
        });

        // Process. Call listener.
        lCorrectInteractionZone.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });

    await pContext.step('Ignore parent listener when child has restriction', () => {
        // Setup.
        const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
        const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('Child');
        lChildInteractionZone.addTriggerRestriction(TestTriggerEnum, TestTriggerEnum.Custom2);

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        lParentInteractionZone.addInteractionListener(TestTriggerEnum, () => {
            lListenerCalled = true;
        });

        // Process. Call listener.
        lChildInteractionZone.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });

    await pContext.step('Skip parent chain when a zone has restriction', () => {
        // Setup.
        const lZoneLevel1: InteractionZone = InteractionZone.current.create('Level1');
        const lZoneLevel2: InteractionZone = lZoneLevel1.create('Level1');
        const lZoneLevel3: InteractionZone = lZoneLevel2.create('Level1');
        const lZoneLevel4: InteractionZone = lZoneLevel3.create('Level1');

        // Setup. Add restriction to level 2.
        lZoneLevel2.addTriggerRestriction(TestTriggerEnum, TestTriggerEnum.Custom2);

        // Process. Add zone 1 listener.
        let lListenerLevel1: boolean = false;
        lZoneLevel1.addInteractionListener(TestTriggerEnum, () => {
            lListenerLevel1 = true;
        });

        // Process. Add zone 2 listener.
        let lListenerLevel2: boolean = false;
        lZoneLevel2.addInteractionListener(TestTriggerEnum, () => {
            lListenerLevel2 = true;
        });

        // Process. Add zone 3 listener.
        let lListenerLevel3: boolean = false;
        lZoneLevel3.addInteractionListener(TestTriggerEnum, () => {
            lListenerLevel3 = true;
        });

        // Process. Add zone 4 listener.
        let lListenerLevel4: boolean = false;
        lZoneLevel4.addInteractionListener(TestTriggerEnum, () => {
            lListenerLevel4 = true;
        });

        // Process. Call listener.
        lZoneLevel4.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerLevel1).toBeFalsy();
        expect(lListenerLevel2).toBeFalsy();
        expect(lListenerLevel3).toBeTruthy();
        expect(lListenerLevel4).toBeTruthy();
    });
});

Deno.test('InteractionZone.addTriggerRestriction()', async (pContext) => {
    await pContext.step('Restrict single type', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

        // Setup. Add listener.
        let lListenerCalled: boolean = false;
        lInteractionZone.addInteractionListener(TestTriggerEnum, () => {
            lListenerCalled = true;
        });

        // Process.
        lInteractionZone.addTriggerRestriction(TestTriggerEnum, TestTriggerEnum.Custom2);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });

    await pContext.step('Dont interfere with other type', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

        // Setup. Add listener.
        let lListenerCalled: boolean = false;
        lInteractionZone.addInteractionListener(TestTriggerEnum, () => {
            lListenerCalled = true;
        });

        // Process.
        lInteractionZone.addTriggerRestriction(TestTriggerEnumOther, TestTriggerEnumOther.Custom2);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeTruthy();
    });

    await pContext.step('Override restriction', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

        // Setup. Add listener.
        let lListenerCalled: boolean = false;
        lInteractionZone.addInteractionListener(TestTriggerEnum, () => {
            lListenerCalled = true;
        });

        // Process.
        lInteractionZone.addTriggerRestriction(TestTriggerEnum, TestTriggerEnum.Custom2);
        lInteractionZone.addTriggerRestriction(TestTriggerEnum, ~0);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeTruthy();
    });
});

Deno.test('InteractionZone.create()', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Parent');

        // Process.
        const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('Child');
        const lResultParentZone: InteractionZone = lChildInteractionZone.parent;

        // Evaluation.
        expect(lResultParentZone).toBe(lParentInteractionZone);
    });
});

Deno.test('InteractionZone.execute()', async (pContext) => {
    await pContext.step('Execute inside zone', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');

        // Process.
        const lZoneResult: InteractionZone = lZone.execute(() => {
            return InteractionZone.current;
        });

        // Evaluation.
        expect(lZoneResult).toBe(lZone);
    });

    await pContext.step('With correct result', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lValue: number = 123;

        // Process.
        const lZoneResult: number = lZone.execute(() => {
            return lValue;
        });

        // Evaluation.
        expect(lZoneResult).toBe(lValue);
    });

    await pContext.step('Execute inside zone with parameter', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('Name');
        const lExecutionResult: string = 'ExecutionResult';

        // Process.
        const lResult: string = lZone.execute((pParameter: string) => {
            return pParameter;
        }, lExecutionResult);

        // Evaluation.
        expect(lResult).toBe(lExecutionResult);
    });

    await pContext.step('Execute inside zone with error', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lError: Error = new Error('ErrorName');

        // Process.
        let lErrorResult: string | null = null;
        try {
            lZone.execute(() => {
                throw lError;
            });
        } catch (pError) {
            lErrorResult = <string>pError;
        }

        // Evaluation.
        expect(lErrorResult).toBe(lError);
    });

    await pContext.step('Correct zones before and after execution with error', () => {
        // Setup.
        const lDefaultZone: InteractionZone = InteractionZone.current;
        const lExecutionZone: InteractionZone = InteractionZone.current.create('ZoneName');

        // Process.
        let lZoneResultFunktion: InteractionZone | null = null;
        let lZoneResultException: InteractionZone | null = null;
        const lZoneResultBefore: InteractionZone = InteractionZone.current;
        try {
            lExecutionZone.execute(() => {
                lZoneResultFunktion = InteractionZone.current;
                throw '';
            });
        } catch {
            lZoneResultException = InteractionZone.current;
        }
        const lZoneNameResultAfter = InteractionZone.current;

        // Evaluation.
        expect(lZoneResultBefore).toBe(lDefaultZone);
        expect(lZoneResultFunktion).toBe(lExecutionZone);
        expect(lZoneResultException).toBe(lDefaultZone);
        expect(lZoneNameResultAfter).toBe(lDefaultZone);
    });
});

Deno.test('InteractionZone.removeErrorListener()', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

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
                throw new Error();
            });
        } catch (pError) {
            globalThis.dispatchEvent(new ErrorEvent('error', {
                error: pError
            }));
        }

        // Evaluation.
        expect(lErrorListenerCalled).toBeFalsy();
    });
});

Deno.test('InteractionZone.removeInteractionListener()', async (pContext) => {
    await pContext.step('Remove existing', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lInteractionZone.addInteractionListener(TestTriggerEnum, lListener);
        lInteractionZone.removeInteractionListener(TestTriggerEnum, lListener);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });

    await pContext.step('Remove wrong trigger type', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lInteractionZone.addInteractionListener(TestTriggerEnum, lListener);
        lInteractionZone.removeInteractionListener(TestTriggerEnumOther, lListener);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeTruthy();
    });

    await pContext.step('Remove with empty listener list', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lInteractionZone.removeInteractionListener(TestTriggerEnum, lListener);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });

    await pContext.step('Remove all listener of type', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        const lListenerOne = () => {
            lListenerCalled = true;
        };
        const lListenerTwo = () => {
            lListenerCalled = true;
        };
        lInteractionZone.addInteractionListener(TestTriggerEnum, lListenerOne);
        lInteractionZone.addInteractionListener(TestTriggerEnum, lListenerTwo);
        lInteractionZone.removeInteractionListener(TestTriggerEnum);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });
});

Deno.test('InteractionZone.attachment()', async (pContext) => {
    await pContext.step('Set and get attachment in the same zone', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lKey: symbol = Symbol('Key');
        const lValue: string = 'Value';

        // Process.
        lZone.attachment(lKey, lValue);
        const lResult: string = lZone.attachment(lKey);

        // Evaluation.
        expect(lResult).toBe(lValue);
    });

    await pContext.step('Get attachment from parent zone', () => {
        // Setup.
        const lParentZone: InteractionZone = InteractionZone.current.create('ParentZone');
        const lChildZone: InteractionZone = lParentZone.create('ChildZone');
        const lKey: symbol = Symbol('Key');
        const lValue: string = 'ParentValue';

        // Process.
        lParentZone.attachment(lKey, lValue);
        const lResult: string = lChildZone.attachment(lKey);

        // Evaluation.
        expect(lResult).toBe(lValue);
    });

    await pContext.step('Isolated zone does not inherit attachment', () => {
        // Setup.
        const lParentZone: InteractionZone = InteractionZone.current.create('ParentZone');
        const lIsolatedZone: InteractionZone = lParentZone.create('IsolatedZone', { isolate: true });
        const lKey: symbol = Symbol('Key');
        const lValue: string = 'ParentValue';

        // Process.
        lParentZone.attachment(lKey, lValue);
        const lResult: string | undefined = lIsolatedZone.attachment(lKey);

        // Evaluation.
        expect(lResult).toBeUndefined();
    });

    await pContext.step('Override attachment in child zone', () => {
        // Setup.
        const lParentZone: InteractionZone = InteractionZone.current.create('ParentZone');
        const lChildZone: InteractionZone = lParentZone.create('ChildZone');
        const lKey: symbol = Symbol('Key');
        const lParentValue: string = 'ParentValue';
        const lChildValue: string = 'ChildValue';

        // Process.
        lParentZone.attachment(lKey, lParentValue);
        lChildZone.attachment(lKey, lChildValue);
        const lResult: string = lChildZone.attachment(lKey);

        // Evaluation.
        expect(lResult).toBe(lChildValue);
    });

    await pContext.step('Different attachment with same key in child and parent zone', () => {
        // Setup.
        const lParentZone: InteractionZone = InteractionZone.current.create('ParentZone');
        const lChildZone: InteractionZone = lParentZone.create('ChildZone');
        const lKey: symbol = Symbol('Key');
        const lParentValue: string = 'ParentValue';
        const lChildValue: string = 'ChildValue';

        // Process.
        lParentZone.attachment(lKey, lParentValue);
        lChildZone.attachment(lKey, lChildValue);
        const lResultChild: string = lChildZone.attachment(lKey);
        const lResultParent: string = lParentZone.attachment(lKey);

        // Evaluation.
        expect(lResultChild).toBe(lChildValue);
        expect(lResultParent).toBe(lParentValue);
    });

    await pContext.step('Value not found in any zone', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
        const lKey: symbol = Symbol('NonExistentKey');

        // Process.
        const lResult: string | undefined = lZone.attachment(lKey);

        // Evaluation.
        expect(lResult).toBeUndefined();
    });

    await pContext.step('Value not found due to isolated child zone', () => {
        // Setup.
        const lParentZone: InteractionZone = InteractionZone.current.create('ParentZone');
        const lIsolatedChildZone: InteractionZone = lParentZone.create('IsolatedChildZone', { isolate: true });
        const lKey: symbol = Symbol('Key');
        const lValue: string = 'ParentValue';

        // Process.
        lParentZone.attachment(lKey, lValue);
        const lResult: string | undefined = lIsolatedChildZone.attachment(lKey);

        // Evaluation.
        expect(lResult).toBeUndefined();
    });
});

enum TestTriggerEnum {
    Custom = 1,
    Custom2 = 2,
    Both = 3
}

enum TestTriggerEnumOther {
    Custom = 1,
    Custom2 = 2,
    Both = 3
}