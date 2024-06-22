import { expect } from 'chai';
import { Patcher } from '../../../../source/change_detection/asynchron_tracker/patcher/patcher';
import { InteractionResponseType } from '../../../../source/change_detection/enum/interaction-response-type.enum';
import { InteractionReason } from '../../../../source/change_detection/interaction-reason';
import { InteractionZone } from '../../../../source/change_detection/interaction-zone';
import '../../../mock/request-animation-frame-mock-session';

describe('Patcher', () => {
    describe('Static Method: patch', () => {
        it('-- Default', async () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseStart });

            // Process. Its patched anyway.
            Patcher.patch(globalThis);

            // Process. Get patched and original function.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            await lZone.execute(() => {
                return new Promise<void>((pResolve) => {
                    pResolve();
                });
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Double patch', async () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseStart });

            // Process. Its patched anyway.
            Patcher.patch(globalThis);
            Patcher.patch(globalThis);

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            await lZone.execute(() => {
                return new Promise<void>((pResolve) => {
                    pResolve();
                });
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });
    });

    describe('Static Method: attachZone', () => {
        it('-- Default', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lObject = document.createElement('div');

            // Process.
            lZone.execute(() => {
                Patcher.attachZone(lObject, InteractionZone.current);
            });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((pInteraction: InteractionReason) => {
                // Filter Promises.
                if (pInteraction.interactionType === InteractionResponseType.EventlistenerEnd) {
                    lInteractionCounter++;
                }
            });

            // Process. Trigger event.
            lObject.dispatchEvent(new Event('input'));

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Double patch same zone', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lObject = document.createElement('div');

            // Process.
            Patcher.attachZone(lObject, lZone);
            Patcher.attachZone(lObject, lZone);

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((pInteraction: InteractionReason) => {
                // Filter Promises.
                if (pInteraction.interactionType === InteractionResponseType.EventlistenerEnd) {
                    lInteractionCounter++;
                }
            });

            // Process. Trigger event.
            lObject.dispatchEvent(new Event('input'));

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Double patch different zone', async () => {
            // Setup.
            const lZoneOne: InteractionZone = new InteractionZone('ZoneOne', { trigger: InteractionResponseType.EventlistenerEnd });
            const lZoneTwo: InteractionZone = new InteractionZone('ZoneTwo', { trigger: InteractionResponseType.EventlistenerEnd });

            const lObject = document.createElement('div');

            // Process.
            lZoneOne.execute(() => {
                Patcher.attachZone(lObject, InteractionZone.current);
            });
            lZoneTwo.execute(() => {
                Patcher.attachZone(lObject, InteractionZone.current);
            });

            // Process.
            const lZoneOneWaiter = new Promise<boolean>((pResolve) => {
                lZoneOne.addInteractionListener(() => {
                    pResolve(true);
                });
            });
            const lZoneTwoWaiter = new Promise<boolean>((pResolve) => {
                lZoneTwo.addInteractionListener(() => {
                    pResolve(true);
                });
            });

            // Process. Trigger event.
            lObject.dispatchEvent(new Event('input'));

            const lWaiterResult = await Promise.all([lZoneOneWaiter, lZoneTwoWaiter]);

            // Evaluation.
            expect(lWaiterResult).to.deep.equal([true, true]);
        });
    });

    describe('Method: patchClass', () => {
        it('-- Default', () => {
            // Setup.
            const lClass = class { };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);
            const lObject = new lPatchedClass();

            // Evaluation.
            expect(lPatchedClass).to.not.equal(lClass);
            expect(lObject).to.be.instanceOf(lClass);
        });

        it('-- Property constructor set value', () => {
            // Setup.
            const lValue = 11;
            const lClass = class {
                a: number = 0;
                constructor(pArgOne: number) {
                    this.a = pArgOne;
                }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);
            const lObject = new lPatchedClass(lValue);

            // Evaluation.
            expect(lObject.a).to.equal(lValue);
        });

        it('-- Property accessor set value', () => {
            // Setup.
            const lValue = 11;
            const lClass = class {
                private mA: number;

                public get a(): number {
                    return this.mA;
                } set a(pValue: number) {
                    this.mA = pValue;
                }
                constructor(pArgOne: number) {
                    this.mA = pArgOne;
                }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);
            const lObject = new lPatchedClass(lValue);

            // Evaluation.
            expect(lObject.a).to.equal(lValue);
        });

        it('-- Property property set value', () => {
            // Setup.
            const lValue = 11;
            const lClass = class {
                a: number = 0;
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);
            const lObject = new lPatchedClass();
            lObject.a = lValue;

            // Evaluation.
            expect(lObject.a).to.equal(lValue);
        });

        it('-- Constructor callback interaction start', () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.CallbackCallStart });

            // Setup.
            const lClass = class {
                public callback: () => void;
                constructor(pArgOne: () => void) {

                    this.callback = pArgOne;
                }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);


            // Process. Interaction.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            lZone.execute(() => {
                new lPatchedClass(() => { }).callback();
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Constructor callback interaction end ', () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.CallbackCallEnd });

            // Setup.
            const lClass = class {
                public callback: () => void;
                constructor(pArgOne: () => void) {

                    this.callback = pArgOne;
                }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);


            // Process. Interaction.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            lZone.execute(() => {
                new lPatchedClass(() => { }).callback();
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Constructor callback interaction error ', () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.CallbackCallError });

            // Setup.
            const lClass = class {
                public callback: () => void;
                constructor(pArgOne: () => void) {

                    this.callback = pArgOne;
                }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);


            // Process. Interaction.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            lZone.execute(() => {
                try {
                    new lPatchedClass(() => { throw 1; }).callback();
                } catch (_pAny) {/* Any */ }
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Method callback interaction start', () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.CallbackCallStart });

            // Setup.
            const lClass = class {
                public callback: (() => void) | null = null;
                public setCallback(pArgOne: () => void) {
                    this.callback = pArgOne;
                }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);
            const lObject = new lPatchedClass();

            // Process. Interaction.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            lZone.execute(() => {
                lObject.setCallback(() => { });
                lObject.callback();
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Method callback interaction end', () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.CallbackCallEnd });

            // Setup.
            const lClass = class {
                public callback: (() => void) | null = null;
                public setCallback(pArgOne: () => void) {
                    this.callback = pArgOne;
                }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);
            const lObject = new lPatchedClass();

            // Process. Interaction.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            lZone.execute(() => {
                lObject.setCallback(() => { });
                lObject.callback();
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Method callback interaction error', () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.CallbackCallError });

            // Setup.
            const lClass = class {
                public callback: (() => void) | null = null;
                public setCallback(pArgOne: () => void) {
                    this.callback = pArgOne;
                }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);
            const lObject = new lPatchedClass();

            // Process. Interaction.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            lZone.execute(() => {
                lObject.setCallback(() => { throw 1; });

                try {
                    lObject.callback();
                } catch (_pAny) {/* Any */ }
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Method callback correct result', () => {
            // Setup.
            const lValue: number = 11;
            const lClass = class {
                public callback: (() => number) | null = null;
                public setCallback(pArgOne: () => number) {
                    this.callback = pArgOne;
                }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.EventlistenerStart, InteractionResponseType.EventlistenerEnd, InteractionResponseType.EventlistenerError);
            const lObject = new lPatchedClass();
            lObject.setCallback(() => { return lValue; });

            // Process. Interaction.
            const lValueResult: number = lObject.callback();

            // Evaluation.
            expect(lValueResult).to.equal(lValue);
        });

        it('-- Methods and construction not trigger interactions', () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone');

            // Setup.
            const lClass = class {
                public method() { }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.CallbackCallStart, InteractionResponseType.CallbackCallEnd, InteractionResponseType.CallbackCallError);

            // Process. Interaction.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            lZone.execute(() => {
                new lPatchedClass().method();
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(0);
        });
    });

    describe('Method: patchEventTarget', () => {
        // Execute patcher before.
        before(() => {
            Patcher.patch(globalThis);
        });

        it('-- AddEventListener trigger interaction on event listener call', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lEventTarget: EventTarget = new EventTarget();

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((pInteraction: InteractionReason) => {
                // Filter Promises.
                if (pInteraction.interactionType === InteractionResponseType.EventlistenerEnd) {
                    lInteractionCounter++;
                }
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            const lEventWait = lZone.execute(() => {
                return new Promise<void>((pResolve) => {
                    lEventTarget.addEventListener('custom', () => {
                        pResolve();
                    });
                });
            });
            lEventTarget.dispatchEvent(new Event('custom'));
            await lEventWait;

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- AddEventListener not trigger interaction without calling event listener', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lEventTarget: EventTarget = new EventTarget();

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            lZone.execute(() => {
                lEventTarget.addEventListener('custom', () => { });
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(0);
        });

        it('-- AddEventListener trigger interaction correct type', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lEventTarget: EventTarget = new EventTarget();

            // Process.
            let lInteractionType: InteractionResponseType = InteractionResponseType.None;
            lZone.addInteractionListener((pInteraction: InteractionReason) => {
                // Filter Promises.
                if (pInteraction.interactionType === InteractionResponseType.EventlistenerEnd) {
                    lInteractionType |= pInteraction.interactionType;
                }
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            const lEventWait = lZone.execute(() => {
                return new Promise<void>((pResolve) => {
                    lEventTarget.addEventListener('custom', () => {
                        pResolve();
                    });
                });
            });
            lEventTarget.dispatchEvent(new Event('custom'));
            await lEventWait;

            // Evaluation.
            expect(lInteractionType).to.equal(InteractionResponseType.EventlistenerEnd);
        });

        it('-- Remove event listener', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lEventTarget: EventTarget = new EventTarget();
            const lListener = () => { };

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            lZone.execute(() => {
                lEventTarget.addEventListener('custom', lListener);
            });
            lEventTarget.removeEventListener('custom', lListener);
            lEventTarget.dispatchEvent(new Event('custom'));

            // Evaluation.
            expect(lInteractionCounter).to.equal(0);
        });

        it('-- Remove event listener wrong type', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lEventTarget: EventTarget = new EventTarget();

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((pInteraction: InteractionReason) => {
                // Filter Promises.
                if (pInteraction.interactionType === InteractionResponseType.EventlistenerEnd) {
                    lInteractionCounter++;
                }
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            const lEventWait = lZone.execute(() => {
                return new Promise<void>((pResolve) => {
                    const lListener = () => { pResolve(); };
                    lEventTarget.addEventListener('custom', lListener);
                    lEventTarget.removeEventListener('customwrong', lListener);
                });
            });
            lEventTarget.dispatchEvent(new Event('custom'));
            await lEventWait;

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- AddEventListener with null as callback', () => {
            // Setup.
            const lEventTarget: EventTarget = new EventTarget();

            // Process.
            const lErroFunction = () => {
                lEventTarget.addEventListener('click', null);
            };

            // Evaluation.
            expect(lErroFunction).to.not.throw();
        });

        it('-- RemoveEventListener with null as callback', () => {
            // Setup.
            const lEventTarget: EventTarget = new EventTarget();

            // Process.
            const lErroFunction = () => {
                lEventTarget.removeEventListener('click', null);
            };

            // Evaluation.
            expect(lErroFunction).to.not.throw();
        });

        it('-- RemoveEventListener with string as callback', () => {
            // Setup.
            const lEventTarget: EventTarget = new EventTarget();

            // Process.
            const lErroFunction = () => {
                lEventTarget.removeEventListener('click', 'Something' as any);
            };

            // Evaluation.
            expect(lErroFunction).to.throw();
        });

        it('-- RemoveEventListener with unregistered callbacl', () => {
            // Setup.
            const lEventTarget: EventTarget = new EventTarget();

            // Process.
            const lErroFunction = () => {
                lEventTarget.removeEventListener('click', () => { });
            };

            // Evaluation.
            expect(lErroFunction).to.not.throw();
        });

        it('-- AddEventListener trigger interaction on event handler object call', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lEventTarget: EventTarget = new EventTarget();

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((pInteraction: InteractionReason) => {
                // Filter Promises.
                if (pInteraction.interactionType === InteractionResponseType.EventlistenerEnd) {
                    lInteractionCounter++;
                }
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            const lEventWait = lZone.execute(() => {
                return new Promise<void>((pResolve) => {
                    const lHandlerObject = {
                        handleEvent: function () {
                            pResolve();
                        }
                    };

                    lEventTarget.addEventListener('custom', lHandlerObject);
                });
            });
            lEventTarget.dispatchEvent(new Event('custom'));
            await lEventWait;

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- AddEventListener correct this context on event handler object call', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lEventTarget: EventTarget = new EventTarget();

            // Process. 
            // eslint-disable-next-line @typescript-eslint/promise-function-async
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
            expect(lCorrectThisContxt).to.be.true;
        });

        it('-- Remove event handler object', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lEventTarget: EventTarget = new EventTarget();
            const lHandlerObject = {
                handleEvent: function () { }
            };

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            lZone.execute(() => {
                lEventTarget.addEventListener('custom', lHandlerObject);
            });
            lEventTarget.removeEventListener('custom', lHandlerObject);
            lEventTarget.dispatchEvent(new Event('custom'));

            // Evaluation.
            expect(lInteractionCounter).to.equal(0);
        });
    });

    describe('Method: patchOnEventProperties', () => {
        it('-- Trigger interaction on event listener call', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lEventTarget = new class extends EventTarget { public oncustom: any = null; }();

            // Process. Patch
            (<any>new Patcher()).patchOnEventProperties(lEventTarget, ['custom']);

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((pInteraction: InteractionReason) => {
                // Filter Promises.
                if (pInteraction.interactionType === InteractionResponseType.EventlistenerEnd) {
                    lInteractionCounter++;
                }
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            const lEventWait = lZone.execute(() => {
                return new Promise<void>((pResolve) => {
                    lEventTarget.oncustom = () => {
                        pResolve();
                    };
                });
            });
            lEventTarget.dispatchEvent(new Event('custom'));
            await lEventWait;

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Double patch', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.EventlistenerStart });
            const lEventTarget = new class extends EventTarget { public oncustom: any = null; }();

            // Process. Patch
            (<any>new Patcher()).patchOnEventProperties(lEventTarget, ['custom']);
            (<any>new Patcher()).patchOnEventProperties(lEventTarget, ['custom']);

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            lZone.execute(() => {
                lEventTarget.oncustom = () => { };
            });
            lEventTarget.dispatchEvent(new Event('custom'));

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Override function with self', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lEventTarget = new class extends EventTarget { public oncustom: any = null; }();

            // Process. Patch
            (<any>new Patcher()).patchOnEventProperties(lEventTarget, ['custom']);

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((pInteraction: InteractionReason) => {
                // Filter Promises.
                if (pInteraction.interactionType === InteractionResponseType.EventlistenerEnd) {
                    lInteractionCounter++;
                }
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            const lEventWait = lZone.execute(() => {
                return new Promise<void>((pResolve) => {
                    const lListener = () => { pResolve(); };
                    lEventTarget.oncustom = lListener;
                    lEventTarget.oncustom = lListener;
                });
            });
            lEventTarget.dispatchEvent(new Event('custom'));
            await lEventWait;

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Override function with null', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lEventTarget = new class extends EventTarget { public oncustom: any = null; }();

            // Process. Patch
            (<any>new Patcher()).patchOnEventProperties(lEventTarget, ['custom']);

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            lZone.execute(() => {
                lEventTarget.oncustom = () => { };
                lEventTarget.oncustom = null;
            });
            lEventTarget.dispatchEvent(new Event('custom'));

            // Evaluation.
            expect(lInteractionCounter).to.equal(0);
        });

        it('-- Set string value', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lEventTarget = new class extends EventTarget { public oncustom: any = null; }();

            // Process. Patch
            (<any>new Patcher()).patchOnEventProperties(lEventTarget, ['custom']);

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            lZone.execute(() => {
                lEventTarget.oncustom = 'string';
            });
            lEventTarget.dispatchEvent(new Event('custom'));

            // Evaluation.
            expect(lInteractionCounter).to.equal(0);
        });

        it('-- Get string value', () => {
            // Setup.
            const lValue: string = 'ValueOrSo';
            const lEventTarget = new class extends EventTarget { public oncustom: any = null; }();

            // Process. Patch
            (<any>new Patcher()).patchOnEventProperties(lEventTarget, ['custom']);

            // Process.
            lEventTarget.oncustom = lValue;
            const lResultValue: string = lEventTarget.oncustom;

            // Evaluation.
            expect(lResultValue).to.equal(lValue);
        });

        it('-- Get function value', () => {
            // Setup.
            const lValue: () => void = () => { };
            const lEventTarget = new class extends EventTarget { public oncustom: any = null; }();

            // Process. Patch
            (<any>new Patcher()).patchOnEventProperties(lEventTarget, ['custom']);

            // Process.
            lEventTarget.oncustom = lValue;
            const lResultValue: string = lEventTarget.oncustom;

            // Evaluation.
            expect(lResultValue).to.equal(lValue);
        });
    });

    describe('Method: patchPromise', () => {
        // Execute patcher before.
        before(() => {
            Patcher.patch(globalThis);
        });

        it('-- Promise executor trigger PromiseStart interaction', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseStart });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            await lZone.execute(() => {
                return new Promise<void>((pResolve) => { pResolve(); });
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Promise executor trigger PromiseEnd interaction', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseEnd });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            await lZone.execute(() => {
                return new Promise<void>((pResolve) => { pResolve(); });
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Promise resolve trigger PromiseResolve interaction', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseResolve });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            await lZone.execute(() => {
                return new Promise<void>((pResolve) => { pResolve(); });
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Promise reject trigger PromiseReject interaction', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseReject });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            try {
                // eslint-disable-next-line @typescript-eslint/promise-function-async
                await lZone.execute(() => {
                    return new Promise<void>((_pResolve, pReject) => { pReject(); });
                });
            } catch (_err) { /* Nothing */ }

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Promise throw error trigger PromiseReject interaction', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseReject });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            try {
                // eslint-disable-next-line @typescript-eslint/promise-function-async
                await lZone.execute(() => {
                    return new Promise<void>(() => { throw 1; });
                });
            } catch (_err) { /* Nothing */ }

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Promise then trigger PromiseStart interaction without callback.', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseStart });
            const lPromise: Promise<void> = new Promise<void>((pResolve) => { pResolve(); });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            await lZone.execute(() => {
                return lPromise.then();
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Promise then trigger PromiseStart interaction without callback.', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseStart });
            const lPromise: Promise<void> = new Promise<void>((pResolve) => { pResolve(); });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            await lZone.execute(() => {
                return lPromise.then(() => { });
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Promise catch trigger PromiseStart interaction without callback.', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseStart });
            const lPromise: Promise<void> = new Promise<void>((_pResolve, pReject) => { pReject('Something'); });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            try {
                // eslint-disable-next-line @typescript-eslint/promise-function-async
                await lZone.execute(() => {
                    return lPromise.catch();
                });
            } catch (_err) { /* Nothing */ }

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Promise catch trigger PromiseStart interaction with callback.', async () => {
            /// Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseStart });
            const lPromise: Promise<void> = new Promise<void>((_pResolve, pReject) => { pReject('Something'); });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            try {
                // eslint-disable-next-line @typescript-eslint/promise-function-async
                await lZone.execute(() => {
                    return lPromise.catch(() => { });
                });
            } catch (_err) { /* Nothing */ }

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Promise async function trigger PromiseStart interaction', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseStart });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            await lZone.execute(() => {
                return (async (): Promise<void> => {
                    return;
                })();
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Trigger syncron PromiseStart on execution of executor', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseStart });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            await lZone.execute(() => {
                return new Promise<void>((pResolve) => { pResolve(); });
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Trigger syncron PromiseEnd on execution of executor', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseEnd });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            await lZone.execute(() => {
                return new Promise<void>((pResolve) => { pResolve(); });
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Trigger syncron PromiseResolve on execution of executor', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseResolve });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            await lZone.execute(() => {
                return new Promise<void>((pResolve) => { pResolve(); });
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Dont trigger PromiseResolve without promise resolve or reject', (pDone: Mocha.Done) => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseResolve });

            // Process.
            lZone.addInteractionListener(() => {
                pDone();
            });

            // eslint-disable-next-line @typescript-eslint/promise-function-async
            lZone.execute(() => {
                new Promise<void>(() => { });
            });

            // Race with promise.
            setTimeout(() => {
                pDone();
            }, 100);
        });

        it('-- Dont trigger PromiseReject without promise resolve or reject', (pDone: Mocha.Done) => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseReject });

            // Process.
            lZone.addInteractionListener(() => {
                pDone();
            });

            // eslint-disable-next-line @typescript-eslint/promise-function-async
            lZone.execute(() => {
                new Promise<void>(() => { });
            });

            // Race with promise.
            setTimeout(() => {
                pDone();
            }, 100);
        });

        it('-- Trigger PromiseStart without promise resolve or reject', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseStart });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            lZone.execute(() => {
                new Promise<void>(() => { });
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Trigger PromiseEnd without promise resolve or reject', () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone', { trigger: InteractionResponseType.PromiseEnd });

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener(() => {
                lInteractionCounter++;
            });
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            lZone.execute(() => {
                new Promise<void>(() => { });
            });

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });
    });
});