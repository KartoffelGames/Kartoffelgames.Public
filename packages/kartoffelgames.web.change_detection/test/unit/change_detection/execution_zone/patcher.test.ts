import '../../../mock/request-animation-frame-mock-session';
import { expect } from 'chai';
import { Patcher } from '../../../../source/change_detection/execution_zone/patcher/patcher';
import { InteractionZone } from '../../../../source/change_detection/interaction-zone';
import { InteractionReason } from '../../../../source/change_detection/interaction-reason';
import { InteractionResponseType } from '../../../../source/change_detection/enum/interaction-response-type.enum';

describe('Patcher', () => {
    describe('Static Method: patch', () => {
        it('-- Default', async () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone');

            // Process. Its patched anyway.
            Patcher.patch(globalThis);

            // Process. Get patched and original function.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            await lZone.execute(async () => {
                return new Promise<void>((pResolve) => {
                    pResolve();
                });
            });

            // Evaluation.
            expect(lInteractionCounter).to.greaterThan(2); // Babel and co might call patched callbacks multimple times.
        });

        it('-- Double patch', async () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone');

            // Process. Its patched anyway.
            Patcher.patch(globalThis);
            Patcher.patch(globalThis);

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            await lZone.execute(async () => {
                return new Promise<void>((pResolve) => {
                    pResolve();
                });
            });

            // Evaluation.
            expect(lInteractionCounter).to.greaterThan(2); // Babel and co might call patched callbacks multimple times.
        });
    });

    describe('Static Method: attachZoneEvent', () => {
        it('-- Default', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lObject = document.createElement('div');

            // Process.
            Patcher.attachZoneEvent(lObject, lZone);

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((pInteraction: InteractionReason) => {
                // Filter Promises.
                if (pInteraction.interactionType === InteractionResponseType.AsnychronEvent) {
                    lInteractionCounter++;
                }
            });

            // Process. Trigger event.
            lObject.dispatchEvent(new Event('input'));

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });

        it('-- Double patch', async () => {
            // Setup.
            const lZone: InteractionZone = new InteractionZone('Zone');
            const lObject = document.createElement('div');

            // Process.
            Patcher.attachZoneEvent(lObject, lZone);
            Patcher.attachZoneEvent(lObject, lZone);

            // Process.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((pInteraction: InteractionReason) => {
                // Filter Promises.
                if (pInteraction.interactionType === InteractionResponseType.AsnychronEvent) {
                    lInteractionCounter++;
                }
            });

            // Process. Trigger event.
            lObject.dispatchEvent(new Event('input'));

            // Evaluation.
            expect(lInteractionCounter).to.equal(1);
        });
    });

    it('Static Method: promiseZone', () => {
        // Setup.
        const lZone: InteractionZone = new InteractionZone('Zone');
        const lPromise: Promise<void> = lZone.execute(async () => {
            return new Promise<void>(() => { });
        });

        // Process.
        const lPromiseZone: InteractionZone | undefined = Patcher.promiseZone(lPromise);

        // Evaluation.
        expect(lPromiseZone).to.equal(lZone);
    });

    describe('Method: patchClass', () => {
        it('-- Default', () => {
            // Setup.
            const lClass = class { };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.AsnychronCallback);
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
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.AsnychronCallback);
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
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.AsnychronCallback);
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
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.AsnychronCallback);
            const lObject = new lPatchedClass();
            lObject.a = lValue;

            // Evaluation.
            expect(lObject.a).to.equal(lValue);
        });

        it('-- Constructor callback interaction', () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone');

            // Setup.
            const lClass = class {
                public callback: () => void;
                constructor(pArgOne: () => void) {

                    this.callback = pArgOne;
                }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.AsnychronCallback);


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

        it('-- Constructor callback correct interaction type', () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone');

            // Setup.
            const lClass = class {
                public callback: () => void;
                constructor(pArgOne: () => void) {
                    this.callback = pArgOne;
                }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.AsnychronEvent);

            // Process. Interaction.
            let lInteractionType: InteractionResponseType = InteractionResponseType.None;
            lZone.addInteractionListener((pInteraction: InteractionReason) => {
                lInteractionType |= pInteraction.interactionType;
            });
            lZone.execute(() => {
                new lPatchedClass(() => { }).callback();
            });

            // Evaluation.
            expect(lInteractionType).to.equal(InteractionResponseType.AsnychronEvent);
        });

        it('-- Method callback interaction', () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone');

            // Setup.
            const lClass = class {
                public callback: (() => void) | null = null;
                public setCallback(pArgOne: () => void) {
                    this.callback = pArgOne;
                }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.AsnychronCallback);
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

        it('-- Method callback correct interaction type', () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone');

            // Setup.
            const lClass = class {
                public callback: (() => void) | null = null;
                public setCallback(pArgOne: () => void) {
                    this.callback = pArgOne;
                }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.AsnychronEvent);
            const lObject = new lPatchedClass();

            // Process. Interaction.
            let lInteractionType: InteractionResponseType = InteractionResponseType.None;
            lZone.addInteractionListener((pInteraction: InteractionReason) => {
                lInteractionType |= pInteraction.interactionType;
            });
            lZone.execute(() => {
                lObject.setCallback(() => { });
                lObject.callback();
            });

            // Evaluation.
            expect(lInteractionType).to.equal(InteractionResponseType.AsnychronEvent);
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
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.AsnychronCallback);
            const lObject = new lPatchedClass();
            lObject.setCallback(() => { return lValue; });

            // Process. Interaction.
            const lValueResult: number = lObject.callback();

            // Evaluation.
            expect(lValueResult).to.equal(lValue);
        });

        it('-- Methods not trigger interactions', () => {
            // Setup. Zone.
            const lZone: InteractionZone = new InteractionZone('Zone');

            // Setup.
            const lClass = class {
                public method() { }
            };

            // Process.
            const lPatchedClass = (<any>new Patcher()).patchClass(lClass, InteractionResponseType.AsnychronCallback);
            const lObject = new lPatchedClass();

            // Process. Interaction.
            let lInteractionCounter: number = 0;
            lZone.addInteractionListener((_pInteraction: InteractionReason) => {
                lInteractionCounter++;
            });
            lZone.execute(() => {
                lObject.method();
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
                if (pInteraction.interactionType === InteractionResponseType.AsnychronEvent) {
                    lInteractionCounter++;
                }
            });
            const lEventWait = lZone.execute(async () => {
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
                if (pInteraction.interactionType === InteractionResponseType.AsnychronEvent) {
                    lInteractionType |= pInteraction.interactionType;
                }
            });
            const lEventWait = lZone.execute(async () => {
                return new Promise<void>((pResolve) => {
                    lEventTarget.addEventListener('custom', () => {
                        pResolve();
                    });
                });
            });
            lEventTarget.dispatchEvent(new Event('custom'));
            await lEventWait;

            // Evaluation.
            expect(lInteractionType).to.equal(InteractionResponseType.AsnychronEvent);
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
                if (pInteraction.interactionType === InteractionResponseType.AsnychronEvent) {
                    lInteractionCounter++;
                }
            });
            const lEventWait = lZone.execute(async () => {
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
                if (pInteraction.interactionType === InteractionResponseType.AsnychronEvent) {
                    lInteractionCounter++;
                }
            });
            const lEventWait = lZone.execute(async () => {
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
            const lZone: InteractionZone = new InteractionZone('Zone');
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
                if (pInteraction.interactionType === InteractionResponseType.AsnychronEvent) {
                    lInteractionCounter++;
                }
            });
            const lEventWait = lZone.execute(async () => {
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
});