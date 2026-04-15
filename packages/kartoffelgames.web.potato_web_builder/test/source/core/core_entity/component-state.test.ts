import { expect } from '@kartoffelgames/core-test';
import { InteractionZone, InteractionZoneEvent } from '@kartoffelgames/core-interaction-zone';
import { ComponentState } from '../../../../source/core/core_entity/component_state/component-state.ts';
import { ComponentStateType } from '../../../../source/core/core_entity/component_state/component-state-type.enum.ts';

Deno.test('ComponentState.get()', async (pContext) => {
    await pContext.step('Get initial value', () => {
        // Setup.
        const lInitialValue: string = 'TestValue';
        const lComponentState: ComponentState<string> = new ComponentState<string>(lInitialValue);

        // Process.
        const lResult: string = lComponentState.get();

        // Evaluation.
        expect(lResult).toBe(lInitialValue);
    });

    await pContext.step('Link interaction zone on get', () => {
        // Setup.
        const lComponentState: ComponentState<string> = new ComponentState<string>('TestValue');
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lTriggered: boolean = false;

        // Setup. Add listener to zone.
        lInteractionZone.addInteractionListener(() => {
            lTriggered = true;
        });

        // Setup. Get value within zone to link it.
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process. Set a new value to trigger linked zones.
        lComponentState.set('NewValue');

        // Evaluation.
        expect(lTriggered).toBeTruthy();
    });

    await pContext.step('Not link zone when get is called outside of zone', () => {
        // Setup.
        const lComponentState: ComponentState<string> = new ComponentState<string>('TestValue');
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lTriggered: boolean = false;

        // Setup. Add listener to zone.
        lInteractionZone.addInteractionListener(() => {
            lTriggered = true;
        });

        // Setup. Get value outside of zone.
        lComponentState.get();

        // Process. Set a new value.
        lComponentState.set('NewValue');

        // Evaluation.
        expect(lTriggered).toBeFalsy();
    });
});

Deno.test('ComponentState.set()', async (pContext) => {
    await pContext.step('Set new value', () => {
        // Setup.
        const lNewValue: string = 'NewValue';
        const lComponentState: ComponentState<string> = new ComponentState<string>('InitialValue');

        // Process.
        lComponentState.set(lNewValue);

        // Evaluation.
        expect(lComponentState.get()).toBe(lNewValue);
    });

    await pContext.step('Dispatch change with set trigger type', () => {
        // Setup.
        const lComponentState: ComponentState<string> = new ComponentState<string>('TestValue');
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lTriggerType: number | undefined;

        // Setup. Add listener to zone.
        lInteractionZone.addInteractionListener((pEvent: InteractionZoneEvent) => {
            lTriggerType = pEvent.triggerType;
        });

        // Setup. Link zone by getting value inside it.
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.set('NewValue');

        // Evaluation.
        expect(lTriggerType).toBe(ComponentStateType.set);
    });

    await pContext.step('Skip dispatch when value unchanged', () => {
        // Setup.
        const lValue: string = 'SameValue';
        const lComponentState: ComponentState<string> = new ComponentState<string>(lValue);
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lCallCount: number = 0;

        // Setup. Add listener to zone.
        lInteractionZone.addInteractionListener(() => {
            lCallCount++;
        });

        // Setup. Link zone.
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process. Set the same value.
        lComponentState.set(lValue);

        // Evaluation.
        expect(lCallCount).toBe(0);
    });

    await pContext.step('Dispatch on complex value even when value unchanged', () => {
        // Setup.
        const lValue: string = 'SameValue';
        const lComponentState: ComponentState<string> = new ComponentState<string>(lValue, { complexValue: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lCallCount: number = 0;

        // Setup. Add listener to zone.
        lInteractionZone.addInteractionListener(() => {
            lCallCount++;
        });

        // Setup. Link zone.
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process. Set the same value.
        lComponentState.set(lValue);

        // Evaluation.
        expect(lCallCount).toBe(1);
    });

    await pContext.step('Dispatch to multiple linked zones', () => {
        // Setup.
        const lComponentState: ComponentState<string> = new ComponentState<string>('TestValue');
        const lZoneOne: InteractionZone = InteractionZone.create('TestZoneOne');
        const lZoneTwo: InteractionZone = InteractionZone.create('TestZoneTwo');
        let lZoneOneTriggered: boolean = false;
        let lZoneTwoTriggered: boolean = false;

        // Setup. Add listeners to both zones.
        lZoneOne.addInteractionListener(() => {
            lZoneOneTriggered = true;
        });
        lZoneTwo.addInteractionListener(() => {
            lZoneTwoTriggered = true;
        });

        // Setup. Link both zones.
        lZoneOne.execute(() => {
            lComponentState.get();
        });
        lZoneTwo.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.set('NewValue');

        // Evaluation.
        expect(lZoneOneTriggered).toBeTruthy();
        expect(lZoneTwoTriggered).toBeTruthy();
    });

    await pContext.step('Error: Set value when proxy is enabled', () => {
        // Setup.
        const lComponentState: ComponentState<object> = new ComponentState<object>({ key: 'value' }, { proxy: true });

        // Process.
        const lFailingFunction = () => {
            lComponentState.set({ key: 'newValue' });
        };

        // Evaluation.
        expect(lFailingFunction).toThrow('Proxy is not implemented yet.');
    });
});

Deno.test('ComponentState.reaction()', async (pContext) => {
    await pContext.step('Call callback on initial setup', () => {
        // Setup.
        const lComponentState: ComponentState<string> = new ComponentState<string>('TestValue');
        let lCallCount: number = 0;

        // Process.
        ComponentState.reaction(() => {
            lComponentState.get();
            lCallCount++;
        });

        // Evaluation.
        expect(lCallCount).toBe(1);
    });

    await pContext.step('Call callback on state set', () => {
        // Setup.
        const lComponentState: ComponentState<string> = new ComponentState<string>('TestValue');
        let lCallCount: number = 0;

        // Setup. Create reaction that reads state.
        ComponentState.reaction(() => {
            lComponentState.get();
            lCallCount++;
        });

        // Process. Reset count after initial call, then set new value.
        lCallCount = 0;
        lComponentState.set('NewValue');

        // Evaluation.
        expect(lCallCount).toBe(1);
    });

    await pContext.step('Not call callback when trigger type is not set', () => {
        // Setup.
        const lComponentState: ComponentState<string> = new ComponentState<string>('TestValue');
        let lCallCount: number = 0;

        // Setup. Create reaction that reads state.
        ComponentState.reaction(() => {
            lComponentState.get();
            lCallCount++;
        });

        // Process. Reset count after initial call, then set same value to skip dispatch.
        lCallCount = 0;
        lComponentState.set('TestValue');

        // Evaluation.
        expect(lCallCount).toBe(0);
    });

    await pContext.step('Call callback on each state set', () => {
        // Setup.
        const lComponentState: ComponentState<string> = new ComponentState<string>('TestValue');
        let lCallCount: number = 0;

        // Setup. Create reaction that reads state.
        ComponentState.reaction(() => {
            lComponentState.get();
            lCallCount++;
        });

        // Process. Reset count after initial call, then set two different values.
        lCallCount = 0;
        lComponentState.set('ValueOne');
        lComponentState.set('ValueTwo');

        // Evaluation.
        expect(lCallCount).toBe(2);
    });
});

Deno.test('ComponentState - Proxy Property Changes', async (pContext) => {
    await pContext.step('First level property set', () => {
        // Setup.
        const lComponentState = new ComponentState({ propertyOne: 'TestValue' }, { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().propertyOne = 'NewValue';

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Second level property set', () => {
        // Setup.
        const lComponentState = new ComponentState({ levelOne: { propertyTwo: 'TestValue' } }, { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().levelOne.propertyTwo = 'NewValue';

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Third level property set', () => {
        // Setup.
        const lComponentState = new ComponentState({ levelOne: { levelTwo: { propertyThree: 'TestValue' } } }, { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().levelOne.levelTwo.propertyThree = 'NewValue';

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Method call that modifies object', () => {
        // Setup.
        class TestClass {
            public value: string = 'TestValue';
            public updateValue(): void {
                this.value = 'UpdatedValue';
            }
        }

        const lComponentState = new ComponentState(new TestClass(), { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().updateValue();

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });
});

Deno.test('ComponentState - Proxy Untraceable Array Functions', async (pContext) => {
    await pContext.step('Array - push', () => {
        // Setup.
        const lComponentState = new ComponentState<Array<string>>(['TestValue'], { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().push('NewValue');

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Array - pop', () => {
        // Setup.
        const lComponentState = new ComponentState<Array<string>>(['TestValue'], { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().pop();

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Array - shift', () => {
        // Setup.
        const lComponentState = new ComponentState<Array<string>>(['TestValue'], { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().shift();

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Array - unshift', () => {
        // Setup.
        const lComponentState = new ComponentState<Array<string>>(['TestValue'], { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().unshift('NewValue');

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Array - splice', () => {
        // Setup.
        const lComponentState = new ComponentState<Array<string>>(['TestValue'], { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().splice(0, 1, 'NewValue');

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Array - fill', () => {
        // Setup.
        const lComponentState = new ComponentState<Array<string>>(['TestValueOne', 'TestValueTwo'], { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().fill('FillValue');

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Array - reverse', () => {
        // Setup.
        const lComponentState = new ComponentState<Array<string>>(['TestValueOne', 'TestValueTwo'], { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().reverse();

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Array - sort', () => {
        // Setup.
        const lComponentState = new ComponentState<Array<string>>(['TestValueTwo', 'TestValueOne'], { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().sort();

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Array - concat', () => {
        // Setup.
        const lComponentState = new ComponentState<Array<string>>(['TestValue'], { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().concat(['NewValue']);

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });
});

Deno.test('ComponentState - Proxy Untraceable Map Functions', async (pContext) => {
    await pContext.step('Map - set', () => {
        // Setup.
        const lComponentState = new ComponentState(new Map<string, string>(), { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().set('TestKey', 'TestValue');

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Map - delete', () => {
        // Setup.
        const lInitialMap = new Map<string, string>([['TestKey', 'TestValue']]);
        const lComponentState = new ComponentState(lInitialMap, { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().delete('TestKey');

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Map - clear', () => {
        // Setup.
        const lInitialMap = new Map<string, string>([['TestKey', 'TestValue']]);
        const lComponentState = new ComponentState(lInitialMap, { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().clear();

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });
});

Deno.test('ComponentState - Proxy Untraceable Set Functions', async (pContext) => {
    await pContext.step('Set - add', () => {
        // Setup.
        const lComponentState = new ComponentState(new Set<string>(), { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().add('TestValue');

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Set - delete', () => {
        // Setup.
        const lInitialSet = new Set<string>(['TestValue']);
        const lComponentState = new ComponentState(lInitialSet, { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().delete('TestValue');

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });

    await pContext.step('Set - clear', () => {
        // Setup.
        const lInitialSet = new Set<string>(['TestValue']);
        const lComponentState = new ComponentState(lInitialSet, { proxy: true });
        const lInteractionZone: InteractionZone = InteractionZone.create('TestZone');
        let lSetTriggered: boolean = false;

        // Setup. Add listener and link zone.
        lInteractionZone.addInteractionListener(() => {
            lSetTriggered = true;
        });
        lInteractionZone.execute(() => {
            lComponentState.get();
        });

        // Process.
        lComponentState.get().clear();

        // Evaluation.
        expect(lSetTriggered).toBeTruthy();
    });
});
