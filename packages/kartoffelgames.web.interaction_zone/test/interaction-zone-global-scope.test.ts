import { expect } from '@kartoffelgames/core-test';
import { InteractionZoneGlobalScope } from "../source/patcher/interaction-zone-global-scope.ts";
import { InteractionZone } from "../source/zone/interaction-zone.ts";
import './mock/request-animation-frame-mock-session.ts';

Deno.test('InteractionZoneGlobalScope.enable()', async (pContext) => {
    await pContext.step('Default', async () => {
        // Setup. Global.
        const lGlobalScope = {};

        // Setup. Zone.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');

        // Process. Its patched anyway.
        const lWasPatched = InteractionZoneGlobalScope.enable({
            target: lGlobalScope,
            patches: {}
        });

        // Process. Get patched and original function.
        const lPatched: boolean = (<any>lGlobalScope).globalPatched;

        // Evaluation.
        expect(lPatched).toBeTruthy();
        expect(lWasPatched).toBeTruthy();
    });
    await pContext.step('Double patch', async () => {
        // Setup. Global.
        const lGlobalScope = {};

        // Setup. Zone.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');

        // Process. Its patched anyway.
        const lWasPatchedOne = InteractionZoneGlobalScope.enable({
            target: lGlobalScope,
            patches: {}
        });
        const lWasPatchedTwo = InteractionZoneGlobalScope.enable({
            target: lGlobalScope,
            patches: {}
        });

        // Process. Get patched and original function.
        const lPatched: boolean = (<any>lGlobalScope).globalPatched;

        // Evaluation.
        expect(lPatched).toBeTruthy();
        expect(lWasPatchedOne).toBeTruthy();
        expect(lWasPatchedTwo).toBeFalsy();
    });
});

Deno.test('InteractionZoneGlobalScope.patchClass()', async (pContext) => {
    const lOriginalEmptyClass = class { };

    // Create a local global scope.
    const lPatchClassGlobal = {
        emptyClass: lOriginalEmptyClass,
        constuctorParameterClass: class {
            a: number = 0;
            constructor(pArgOne: number) {
                this.a = pArgOne;
            }
        },
        accessorClass: class {
            private mA: number;

            public get a(): number {
                return this.mA;
            } set a(pValue: number) {
                this.mA = pValue;
            }
            constructor(pArgOne: number) {
                this.mA = pArgOne;
            }
        },
        properyClass: class {
            a: number = 0;
        },
        constructorCallbackClass: class {
            public callback: () => void;
            constructor(pArgOne: () => void) {
                this.callback = pArgOne;
            }
        },
        methodCallbackClass: class {
            public callback: (() => number) | null = null;
            public setCallback(pArgOne: () => number) {
                this.callback = pArgOne;
            }
        },
    };

    // Patch classes of local global scope.
    InteractionZoneGlobalScope.enable({
        target: lPatchClassGlobal,
        patches: {
            classes: ['emptyClass', 'constuctorParameterClass', 'accessorClass', 'properyClass', 'constructorCallbackClass', 'methodCallbackClass']
        }
    });

    await pContext.step('PatchedClass instance of original', () => {
        // Process.
        const lObject = new lPatchClassGlobal.emptyClass();

        // Evaluation.
        expect(lPatchClassGlobal.emptyClass).not.toBe(lOriginalEmptyClass);
        expect(lObject).toBeInstanceOf(lOriginalEmptyClass);
    });
    await pContext.step('Property constructor set value', () => {
        // Setup.
        const lValue = 11;

        // Process.
        const lObject = new lPatchClassGlobal.constuctorParameterClass(lValue);

        // Evaluation.
        expect(lObject.a).toBe(lValue);
    });
    await pContext.step('Property accessor set value', () => {
        // Setup.
        const lValue = 11;

        // Process.
        const lObject = new lPatchClassGlobal.accessorClass(lValue);

        // Evaluation.
        expect(lObject.a).toBe(lValue);
    });
    await pContext.step('Property property set value', () => {
        // Setup.
        const lValue = 11;

        // Process.
        const lObject = new lPatchClassGlobal.properyClass();
        lObject.a = lValue;

        // Evaluation.
        expect(lObject.a).toBe(lValue);
    });
    await pContext.step('Constructor callback correct callback zone', () => {
        // Setup. Zone.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');

        // Process. Interaction.
        let lResultZone: InteractionZone | null = null;
        const lObject: any = lZone.execute(() => {
            return new lPatchClassGlobal.constructorCallbackClass(() => {
                lResultZone = InteractionZone.current;
            });
        });

        // Call callback and wait for execution.
        lObject.callback();

        // Evaluation.
        expect(lResultZone).toBe(lZone);
    });
    await pContext.step('Method callback correct callback zone', () => {
        // Setup. Zone.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');
 
        // Process.
        const lObject = new lPatchClassGlobal.methodCallbackClass();

        // Process. Interaction.
        let lResultZone: InteractionZone | null = null;
        lZone.execute(() => {
            lObject.setCallback(() => {
                lResultZone = InteractionZone.current;
                return 1;
            });
        });

        // Call callback and wait for execution.
        lObject.callback!();

        // Evaluation.
        expect(lResultZone).toBe(lZone);
    });
    await pContext.step('Method callback correct result', () => {
        // Setup.
        const lValue: number = 11;

        // Process.
        const lObject = new lPatchClassGlobal.methodCallbackClass();
        lObject.setCallback(() => { return lValue; });

        // Process. Interaction.
        const lValueResult: number = lObject.callback!();

        // Evaluation.
        expect(lValueResult).toBe(lValue);
    });
});

Deno.test('InteractionZoneGlobalScope.patchEventTarget()', async (pContext) => {
    // TODO: Patch a global with a custom event classs.

    await pContext.step('AddEventListener correct listener zone', async () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');
        const lEventTarget: EventTarget = new EventTarget();

        // Process.
        const lResultZonePromise: Promise<InteractionZone> = lZone.execute(() => {
            return new Promise<InteractionZone>((pResolve) => {
                lEventTarget.addEventListener('custom', () => {
                    pResolve(InteractionZone.current);
                });
            });
        });
        lEventTarget.dispatchEvent(new Event('custom'));
        const lResultZone = await lResultZonePromise;

        // Evaluation.
        expect(lResultZone).toBe(lZone);
    });
    await pContext.step('Remove event listener', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');
        const lEventTarget: EventTarget = new EventTarget();

        // Setup. Init listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };

        // Process.
        lZone.execute(() => {
            lEventTarget.addEventListener('custom', lListener);
        });
        lEventTarget.removeEventListener('custom', lListener);
        lEventTarget.dispatchEvent(new Event('custom'));

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });
    await pContext.step('Remove event listener wrong type', async () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');
        const lEventTarget: EventTarget = new EventTarget();

        // Setup. Init listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };

        // Process.
        lZone.execute(() => {
            lEventTarget.addEventListener('custom', lListener);
            lEventTarget.removeEventListener('customwrong', lListener);
        });
        lEventTarget.dispatchEvent(new Event('custom'));

        // Evaluation.
        expect(lListenerCalled).toBeTruthy();
    });
    await pContext.step('AddEventListener with null as callback', () => {
        // Setup.
        const lEventTarget: EventTarget = new EventTarget();

        // Process.
        const lErroFunction = () => {
            lEventTarget.addEventListener('click', null);
        };

        // Evaluation.
        expect(lErroFunction).not.toThrow();
    });
    await pContext.step('RemoveEventListener with null as callback', () => {
        // Setup.
        const lEventTarget: EventTarget = new EventTarget();

        // Process.
        const lErroFunction = () => {
            lEventTarget.removeEventListener('click', null);
        };

        // Evaluation.
        expect(lErroFunction).not.toThrow();
    });
    await pContext.step('RemoveEventListener with string as callback', () => {
        // Setup.
        const lEventTarget: EventTarget = new EventTarget();

        // Process.
        const lErroFunction = () => {
            lEventTarget.removeEventListener('click', 'Something' as any);
        };

        // Evaluation.
        expect(lErroFunction).not.toThrow();
    });
    await pContext.step('RemoveEventListener with unregistered callback', () => {
        // Setup.
        const lEventTarget: EventTarget = new EventTarget();

        // Process.
        const lErroFunction = () => {
            lEventTarget.removeEventListener('click', () => { });
        };

        // Evaluation.
        expect(lErroFunction).not.toThrow();
    });
    await pContext.step('AddEventListener correct zone in event handler object', async () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');
        const lEventTarget: EventTarget = new EventTarget();

        // Process.
        const lZoneResultPromise = lZone.execute(() => {
            return new Promise<InteractionZone>((pResolve) => {
                const lHandlerObject = {
                    handleEvent: function () {
                        pResolve(InteractionZone.current);
                    }
                };

                lEventTarget.addEventListener('custom', lHandlerObject);
            });
        });
        lEventTarget.dispatchEvent(new Event('custom'));
        const lZoneResult = await lZoneResultPromise;

        // Evaluation.
        expect(lZoneResult).toBe(lZone);
    });
    await pContext.step('AddEventListener correct this context on event handler object call', async () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');
        const lEventTarget: EventTarget = new EventTarget();

        // Process. 
        const lEventWait = lZone.execute(() => {
            return new Promise<boolean>((pResolve) => {
                const lHandlerObject = {
                    handleEvent: function () {
                        pResolve(this === lHandlerObject);
                    }
                };

                lEventTarget.addEventListener('custom', lHandlerObject);
            });
        });
        lEventTarget.dispatchEvent(new Event('custom'));
        const lCorrectThisContxt = await lEventWait;

        // Evaluation.
        expect(lCorrectThisContxt).toBeTruthy();
    });
    await pContext.step('Remove event handler object', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');
        const lEventTarget: EventTarget = new EventTarget();

        // Setup listener.
        let lListenerCalled: boolean = false;
        const lHandlerObject = {
            handleEvent: function () {
                lListenerCalled = true;
            }
        };

        // Process.
        lZone.execute(() => {
            lEventTarget.addEventListener('custom', lHandlerObject);
            lEventTarget.removeEventListener('custom', lHandlerObject);
        });
        lEventTarget.dispatchEvent(new Event('custom'));

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });
});

Deno.test('InteractionZoneGlobalScope.patchOnEventProperties()', async (pContext) => {
    await pContext.step('Correct zone on event listener call', async () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');

        // Setup.
        const lScopeTarget = {
            eventTarget: class extends EventTarget { public oncustom: any = null; }
        };

        // Process. Patch scope.
        InteractionZoneGlobalScope.enable({
            target: lScopeTarget,
            patches: {
                eventTarget: 'eventTarget'
            }
        });
        const lEventTarget = new lScopeTarget.eventTarget();

        // Process.
        const lResultZonePromise: Promise<InteractionZone> = lZone.execute(() => {
            return new Promise<InteractionZone>((pResolve) => {
                lEventTarget.oncustom = () => {
                    pResolve(InteractionZone.current);
                };
            });
        });
        lEventTarget.dispatchEvent(new Event('custom'));
        const lResultZone: InteractionZone = await lResultZonePromise;

        // Evaluation.
        expect(lResultZone).toBe(lZone);
        expect(false).toBe(true); // TODO: WHAAAAAAT
    });
    await pContext.step('Override function with self', async () => {
        // Setup.
        const lScopeTarget = {
            eventTarget: class extends EventTarget { public oncustom: any = null; }
        };

        // Process. Patch scope.
        InteractionZoneGlobalScope.enable({
            target: lScopeTarget,
            patches: {
                eventTarget: 'eventTarget'
            }
        });
        const lEventTarget = new lScopeTarget.eventTarget();

        // Process.
        let lCallCounter: number = 0;
        const lListener = () => {
            lCallCounter++;
        };
        lEventTarget.oncustom = lListener;
        lEventTarget.oncustom = lListener;
        lEventTarget.dispatchEvent(new Event('custom'));

        // Evaluation.
        expect(lCallCounter).toBe(1);
    });
    await pContext.step('Override function with null', () => {
        // Setup.
        const lScopeTarget = {
            eventTarget: class extends EventTarget { public oncustom: any = null; }
        };

        // Process. Patch scope.
        InteractionZoneGlobalScope.enable({
            target: lScopeTarget,
            patches: {
                eventTarget: 'eventTarget'
            }
        });
        const lEventTarget = new lScopeTarget.eventTarget();

        // Process.
        let lCallCounter: number = 0;

        const lListener = () => {
            lCallCounter++;
        };
        lEventTarget.oncustom = lListener;
        lEventTarget.oncustom = null;
        lEventTarget.dispatchEvent(new Event('custom'));

        // Evaluation.
        expect(lCallCounter).toBe(0);
    });
    await pContext.step('Set string value', () => {
        // Setup.
        const lScopeTarget = {
            eventTarget: class extends EventTarget { public oncustom: any = null; }
        };

        // Process. Patch scope.
        InteractionZoneGlobalScope.enable({
            target: lScopeTarget,
            patches: {
                eventTarget: 'eventTarget'
            }
        });
        const lEventTarget = new lScopeTarget.eventTarget();

        // Process.
        lEventTarget.oncustom = 'My string';
        lEventTarget.dispatchEvent(new Event('custom'));
    });
    await pContext.step('Get string value', () => {
        // Setup.
        const lValue: string = 'ValueOrSo';
        const lScopeTarget = {
            eventTarget: class extends EventTarget { public oncustom: any = null; }
        };

        // Process. Patch scope.
        InteractionZoneGlobalScope.enable({
            target: lScopeTarget,
            patches: {
                eventTarget: 'eventTarget'
            }
        });
        const lEventTarget = new lScopeTarget.eventTarget();

        // Process.
        lEventTarget.oncustom = lValue;
        const lResultValue: string = lEventTarget.oncustom;

        // Evaluation.
        expect(lResultValue).toBe(lValue);
    });
    await pContext.step('Get function value', () => {
        // Setup.
        const lValue: () => void = () => { };
        const lScopeTarget = {
            eventTarget: class extends EventTarget { public oncustom: any = null; }
        };

        // Process. Patch scope.
        InteractionZoneGlobalScope.enable({
            target: lScopeTarget,
            patches: {
                eventTarget: 'eventTarget'
            }
        });
        const lEventTarget = new lScopeTarget.eventTarget();

        // Process.
        lEventTarget.oncustom = lValue;
        const lResultValue: string = lEventTarget.oncustom;

        // Evaluation.
        expect(lResultValue).toBe(lValue);
    });
});

Deno.test('InteractionZoneGlobalScope.patchPromise()', async (pContext) => {
    await pContext.step('Promise executor correct zone', async () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');

        // Process.
        const lResultZone: InteractionZone = await lZone.execute(() => {
            return new Promise<InteractionZone>((pResolve) => { pResolve(InteractionZone.current); });
        });

        // Evaluation.
        expect(lResultZone).toBe(lZone);
        expect(false).toBe(true); // TODO: WHAAAAAAT
    });
    await pContext.step('Promise then keep zone', async () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');
        const lPromise: Promise<void> = new Promise<void>((pResolve) => { pResolve(); });

        // Process.
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        const lResultZone: InteractionZone = await lZone.execute(() => {
            return lPromise.then(() => { return InteractionZone.current; });
        });

        // Evaluation.
        expect(lResultZone).toBe(lZone);
        expect(false).toBe(true); // TODO: WHAAAAAAT
    });
    await pContext.step('Promise catch keep zone', async () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');
        const lPromise: Promise<InteractionZone> = new Promise<InteractionZone>((_pResolve, pReject) => { pReject(); });

        // Process.
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        const lResultZone: InteractionZone = await lZone.execute(() => {
            return lPromise.catch(() => { return InteractionZone.current; });
        });

        // Evaluation.
        expect(lResultZone).toBe(lZone);
        expect(false).toBe(true); // TODO: WHAAAAAAT
    });
    await pContext.step('Promise then keep zone async execution', async () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');
        const lPromise: Promise<void> = new Promise<void>((pResolve) => { pResolve(); });

        // Process.
        const lResultZone: InteractionZone = await lZone.execute(async () => {
            return lPromise.then(() => { return InteractionZone.current; });
        });

        // Evaluation.
        expect(lResultZone).toBe(lZone);
        expect(false).toBe(true); // TODO: WHAAAAAAT
    });
    await pContext.step('Promise catch keep zone async execution', async () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.current.create('Zone');
        const lPromise: Promise<InteractionZone> = new Promise<InteractionZone>((_pResolve, pReject) => { pReject(); });

        // Process.
        const lResultZone: InteractionZone = await lZone.execute(async () => {
            return lPromise.catch(() => { return InteractionZone.current; });
        });

        // Evaluation.
        expect(lResultZone).toBe(lZone);
        expect(false).toBe(true); // TODO: WHAAAAAAT
    });
});