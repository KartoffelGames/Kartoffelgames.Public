import { expect } from '@kartoffelgames/core-test';
import type { InteractionZoneEvent } from '../source/interaction-zone/interaction-zone-event.ts';
import { InteractionZone } from '../source/interaction-zone/interaction-zone.ts';

Deno.test('InteractionZone.current', async (pContext) => {
    await pContext.step('Available Zone', () => {
        // Setup.
        const lFirstInteractionZone: InteractionZone = InteractionZone.create('Name');
        const lSecondInteractionZone: InteractionZone = InteractionZone.create('AnotherName');

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

Deno.test('InteractionZone.current.pushInteraction()', async (pContext) => {
    await pContext.step('Push calls listener', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.create('Name');
        const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;

        // Process. Add listener.
        let lCalled: boolean = false;
        lInteractionZone.addInteractionListener(() => {
            lCalled = true;
        });

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.current.pushInteraction(lInteractionTrigger, {});
        });

        // Evaluation.
        expect(lCalled).toBeTruthy();
    });

    await pContext.step('Generated event has correct origin', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.create('Name');
        const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;

        // Process. Add listener.
        let lReasonResult: InteractionZoneEvent | null = null;
        lInteractionZone.addInteractionListener((pReason: InteractionZoneEvent) => {
            lReasonResult = pReason;
        });

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.current.pushInteraction(lInteractionTrigger, {});
        });

        // Evaluation.
        expect(lReasonResult!.origin).toBe(lInteractionZone);
    });

    await pContext.step('Generated event has correct trigger', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.create('Name');
        const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;

        // Process. Add listener.
        let lReasonResult: InteractionZoneEvent | null = null;
        lInteractionZone.addInteractionListener((pReason: InteractionZoneEvent) => {
            lReasonResult = pReason;
        });

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.current.pushInteraction(lInteractionTrigger, {});
        });

        // Evaluation.
        expect(lReasonResult!.triggerType).toBe(lInteractionTrigger);
    });

    await pContext.step('Generated event has correct data', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.create('Name');
        const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
        const lInteractionData = { a: 1 };

        // Process. Add listener.
        let lReasonResult: InteractionZoneEvent | null = null;
        lInteractionZone.addInteractionListener((pReason: InteractionZoneEvent) => {
            lReasonResult = pReason;
        });

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.current.pushInteraction(lInteractionTrigger, lInteractionData);
        });

        // Evaluation.
        expect(lReasonResult!.data).toBe(lInteractionData);
    });

    await pContext.step('Ignore zones not in scope', () => {
        // Setup.
        const lCorrectInteractionZone: InteractionZone = InteractionZone.create('Correct');
        const lParalellZone: InteractionZone = InteractionZone.create('No so correct');
        const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;

        // Process. Add listener.
        let lCalled: boolean = false;
        lParalellZone.addInteractionListener(() => {
            lCalled = true;
        });

        // Process. Call listener.
        lCorrectInteractionZone.execute(() => {
            InteractionZone.current.pushInteraction(lInteractionTrigger, {});
        });

        // Evaluation.
        expect(lCalled).toBeFalsy();
    });
});

Deno.test('InteractionZone.name', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lName: string = 'CD-Name';
        const lInteractionZone: InteractionZone = InteractionZone.create(lName);

        // Process.
        const lNameResult: string = lInteractionZone.name;

        // Evaluation.
        expect(lNameResult).toBe(lName);
    });
});

Deno.test('InteractionZone.addInteractionListener()', async (pContext) => {
    await pContext.step('Listener called', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.create('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        lInteractionZone.addInteractionListener(() => {
            lListenerCalled = true;
        });

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.current.pushInteraction(TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeTruthy();
    });

    await pContext.step('Double add listener', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.create('Name');

        // Process. Add listener.
        let lListenerCounter: number = 0;
        const lListener = () => {
            lListenerCounter++;
        };
        lInteractionZone.addInteractionListener(lListener);
        lInteractionZone.addInteractionListener(lListener);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.current.pushInteraction(TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCounter).toBe(1);
    });

    await pContext.step('Ignore listener outside zone', () => {
        // Setup.
        const lCorrectInteractionZone: InteractionZone = InteractionZone.create('Correct');
        const lParallelInteractionZone: InteractionZone = InteractionZone.create('Other');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        lParallelInteractionZone.addInteractionListener(() => {
            lListenerCalled = true;
        });

        // Process. Call listener.
        lCorrectInteractionZone.execute(() => {
            InteractionZone.current.pushInteraction(TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });

    await pContext.step('Listener ignored restricted trigger', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.create('Name');
        lInteractionZone.setTriggerRestriction(TestTriggerEnum.Custom2);

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        lInteractionZone.addInteractionListener(() => {
            lListenerCalled = true;
        });

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.current.pushInteraction(TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });
});

Deno.test('InteractionZone.setTriggerRestriction()', async (pContext) => {
    await pContext.step('Restrict trigger', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.create('Name');

        // Setup. Add listener.
        let lListenerCalled: boolean = false;
        lInteractionZone.addInteractionListener(() => {
            lListenerCalled = true;
        });

        // Process.
        lInteractionZone.setTriggerRestriction(TestTriggerEnum.Custom2);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.current.pushInteraction(TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });

    await pContext.step('Override restriction', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.create('Name');

        // Setup. Add listener.
        let lListenerCalled: boolean = false;
        lInteractionZone.addInteractionListener(() => {
            lListenerCalled = true;
        });

        // Process.
        lInteractionZone.setTriggerRestriction(TestTriggerEnum.Custom2);
        lInteractionZone.setTriggerRestriction(~0);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.current.pushInteraction(TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeTruthy();
    });
});

Deno.test('InteractionZone.execute()', async (pContext) => {
    await pContext.step('Execute inside zone', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.create('ZoneName');

        // Process.
        const lZoneResult: InteractionZone = lZone.execute(() => {
            return InteractionZone.current;
        });

        // Evaluation.
        expect(lZoneResult).toBe(lZone);
    });

    await pContext.step('With correct result', () => {
        // Setup.
        const lZone: InteractionZone = InteractionZone.create('ZoneName');
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
        const lZone: InteractionZone = InteractionZone.create('Name');
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
        const lZone: InteractionZone = InteractionZone.create('ZoneName');
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
        const lExecutionZone: InteractionZone = InteractionZone.create('ZoneName');

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

Deno.test('InteractionZone.removeInteractionListener()', async (pContext) => {
    await pContext.step('Remove existing', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.create('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        const lListener = () => {
            lListenerCalled = true;
        };
        lInteractionZone.addInteractionListener(lListener);
        lInteractionZone.removeInteractionListener(lListener);

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.current.pushInteraction(TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });

    await pContext.step('Remove with empty listener list', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.create('Name');

        // Process. Remove listener that was never added.
        const lRemoveFunction = () => {
            lInteractionZone.removeInteractionListener(() => { });
        };

        // Evaluation.
        expect(lRemoveFunction).not.toThrow();
    });

    await pContext.step('Remove all listeners', () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.create('Name');

        // Process. Add listener.
        let lListenerCalled: boolean = false;
        const lListenerOne = () => {
            lListenerCalled = true;
        };
        const lListenerTwo = () => {
            lListenerCalled = true;
        };
        lInteractionZone.addInteractionListener(lListenerOne);
        lInteractionZone.addInteractionListener(lListenerTwo);
        lInteractionZone.removeInteractionListener();

        // Process. Call listener.
        lInteractionZone.execute(() => {
            InteractionZone.current.pushInteraction(TestTriggerEnum.Custom, new Object());
        });

        // Evaluation.
        expect(lListenerCalled).toBeFalsy();
    });
});

enum TestTriggerEnum {
    Custom = 1,
    Custom2 = 2,
    Both = 3
}
