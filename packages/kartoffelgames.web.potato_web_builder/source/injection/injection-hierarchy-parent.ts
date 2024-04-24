import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '@kartoffelgames/core.dependency-injection';

export class InjectionHierarchyParent {
    private readonly mInjections: Dictionary<InjectionConstructor, any>;
    private mLocked: boolean;

    /**
     * All injections of processor.
     */
    public get injections(): Dictionary<InjectionConstructor, any> {
        return this.mInjections;
    }

    public constructor(pParent: InjectionHierarchyParent | null) {
        this.mInjections = new Dictionary<InjectionConstructor, any>();
        this.mLocked = false;

        // Init injections from hierarchy parent.
        if (pParent) {
            for (const [lTarget, lValue] of pParent.injections.entries()) {
                this.setProcessorAttributes(lTarget, lValue);
            }
        }
    }

    /**
     * Get injection parameter for the processor class construction. 
     * 
     * @param pInjectionTarget - Injection type that should be provided to processor.
     */
    public getProcessorAttribute<T>(pInjectionTarget: InjectionConstructor): T | undefined {
        return this.mInjections.get(pInjectionTarget);
    }

    /**
     * Lock injections.
     * Should called before using the injections to create a object.
     */
    public lock(): void {
        this.mLocked = true;
    }

    /**
     * Set injection parameter for the module processor class construction. 
     * 
     * @param pInjectionTarget - Injection type that should be provided to processor.
     * @param pInjectionValue - Actual injected value in replacement for {@link pInjectionTarget}.
     * 
     * @throws {@link Exception}
     * When the processor was already initialized.
     */
    public setProcessorAttributes(pInjectionTarget: InjectionConstructor, pInjectionValue: any): void {
        if (this.mLocked) {
            throw new Exception('Cant add injections to after construction.', this);
        }

        this.mInjections.set(pInjectionTarget, pInjectionValue);
    }
}