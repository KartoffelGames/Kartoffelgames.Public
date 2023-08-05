import { Dictionary } from '@kartoffelgames/core.data';

export class DebugWindow {
    private readonly mControls: Dictionary<string, Element>;
    private readonly mGroups: Dictionary<string, Array<string>>;
    private readonly mUpdaterList: Array<() => void>;

    /**
     * Constructor.
     */
    public constructor() {
        this.mControls = new Dictionary<string, Element>();
        this.mGroups = new Dictionary<string, Array<string>>();
        this.mUpdaterList = new Array<() => void>();
    }

    /**
     * Add controler for numbers.
     * @param pName - Input name.
     * @param pGroup - Input group.
     * @param pMin - Min input.
     * @param pMax - Max input.
     * @param pSet - On data set.
     * @param pGet - On data get.
     */
    protected addControlNumber(pName: string, pGroup: string, pMin: number, pMax: number, pSet: (pData: number) => void, pGet: () => number): void {
        // Input label.
        const lLabel: HTMLLabelElement = document.createElement('label');
        lLabel.textContent = pName;

        // Range input elements.
        const lRangeInput: HTMLInputElement = document.createElement('input');
        lRangeInput.setAttribute('value', '');
        lRangeInput.setAttribute('min', pMin.toString());
        lRangeInput.setAttribute('max', pMax.toString());
        lRangeInput.setAttribute('step', '0.001');
        lRangeInput.setAttribute('type', 'range');

        // Number input element.
        const lNumberInput: HTMLInputElement = document.createElement('input');
        lNumberInput.setAttribute('value', '');
        lNumberInput.setAttribute('min', pMin.toString());
        lNumberInput.setAttribute('max', pMax.toString());
        lNumberInput.setAttribute('step', '0.001');
        lNumberInput.setAttribute('type', 'range');

        // Construct wrapper.
        const lWrapper: HTMLDivElement = document.createElement('div');
        lWrapper.append(lLabel, lRangeInput, lNumberInput);

        // Save controls under name.
        this.mControls.set(pName, lWrapper);

        // Add name to group.
        if (!this.mGroups.has(pGroup)) {
            this.mGroups.set(pGroup, new Array<string>());
        }
        this.mGroups.get(pGroup)!.push(pName);

        // Updater
        this.mUpdaterList.push(() => {
            lRangeInput.value = <any>pGet();
            lNumberInput.value = <any>pGet();
        });

        // Set data and trigger all updater on any input.
        const lSetData = (pData: any) => {
            pSet(parseFloat(pData) || 1);
            this.triggerUpdater();
        };

        lRangeInput.addEventListener('input', (pEvent) => { lSetData((<any>pEvent.target).value); });
        lNumberInput.addEventListener('input', (pEvent) => { lSetData((<any>pEvent.target).value); });

        // Update all values.
        this.triggerUpdater();
    }

    /**
     * Trigger all update functions.
     */
    private triggerUpdater(): void {
        // Set real data.
        for (const lUpdater of this.mUpdaterList) {
            lUpdater();
        }
    }
}