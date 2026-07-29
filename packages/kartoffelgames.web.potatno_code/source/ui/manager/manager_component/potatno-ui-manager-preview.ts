import { Exception } from '@kartoffelgames/core';
import type { IPotatnoDocumentItem } from '../../../document/i-potatno-document-item.interface.ts';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoPreviewDriver } from '../../../preview/potatno-preview-driver.ts';
import type { PotatnoPreviewDisplayItem } from '../../../preview/potatno-preview.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, type PotatnoUiManager } from '../potatno-ui-manager.ts';

/**
 * Handles the UI previews by caching its driver and manages references and cleanup.
 */
export class PotatnoUiManagerPreview {
    private readonly mDriverElementBigEnough: WeakMap<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>, boolean>;
    private readonly mDriverElementVisible: WeakMap<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>, boolean>;
    private readonly mDriverElements: WeakMap<WeakRef<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>>, Element>;
    private readonly mDriverList: Array<WeakRef<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>>>;
    private readonly mDrivers: WeakMap<IPotatnoDocumentItem<PotatnoProjectTypesDefinition>, PotatnoPreviewDriver<PotatnoProjectTypesDefinition>>;
    private readonly mElementDriver: WeakMap<Element, WeakRef<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>>>;
    private readonly mManager: PotatnoUiManager;
    private readonly mPreviewIntersection: IntersectionObserver;

    /**
     * Constructor.
     *
     * @param pManager - Parent ui manager.
     */
    public constructor(pManager: PotatnoUiManager) {
        this.mManager = pManager;

        // A iterative list preview drivers without interfering garbage collection. 
        this.mDriverList = new Array<WeakRef<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>>>();

        // Different mappings
        this.mDrivers = new WeakMap<IPotatnoDocumentItem<PotatnoProjectTypesDefinition>, PotatnoPreviewDriver<PotatnoProjectTypesDefinition>>();
        this.mDriverElementVisible = new WeakMap<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>, boolean>();
        this.mDriverElementBigEnough = new WeakMap<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>, boolean>();

        // Mapping between elements and driver.
        this.mDriverElements = new WeakMap<WeakRef<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>>, Element>();
        this.mElementDriver = new WeakMap<Element, WeakRef<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>>>();

        // A new document instance replaces every item; drop the drivers so components re-request
        // fresh ones against the live graph.
        this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Document, () => {
            this.mDriverList.splice(0, this.mDriverList.length);
        });

        // Recompile live drivers after a debounce.
        let lDebounceStructureChanges: number = 0;
        const lStructuralEvents: number = PotatnoCodeUiManagerChangeType.Connection | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.NodeAdd | PotatnoCodeUiManagerChangeType.NodeDelete | PotatnoCodeUiManagerChangeType.NodeUpdate;
        this.mManager.subscribe(lStructuralEvents, () => {
            globalThis.clearTimeout(lDebounceStructureChanges);
            lDebounceStructureChanges = globalThis.setTimeout(() => this.refresh(), 1000) as unknown as number;
        });

        // Check for preview element sizes on grid zooms.
        let lDebounceGridTransformChanges: number = 0;
        this.mManager.subscribe(PotatnoCodeUiManagerChangeType.SpecialGrid, () => {
            globalThis.clearTimeout(lDebounceGridTransformChanges);
            lDebounceGridTransformChanges = globalThis.setTimeout(() => {
                // Iterate all known drivers.
                for (const lDriverReference of this.mDriverList) {
                    // Deref the driver reference
                    const lDriver: PotatnoPreviewDriver<PotatnoProjectTypesDefinition> | undefined = lDriverReference.deref();
                    if (!lDriver) {
                        continue;
                    }

                    // Get size of driver element.
                    const lElementSize: DOMRect = lDriver.element.getBoundingClientRect();

                    // Disable element when on size is smaller than 30px.
                    this.mDriverElementBigEnough.set(lDriver, !(lElementSize.width < 30 || lElementSize.height < 30));
                }
            }, 300) as unknown as number;
        });

        // Register a intersection observer that listens on preview elements in view.
        this.mPreviewIntersection = new IntersectionObserver((pEntries) => {
            for (const lEntry of pEntries) {
                // Get driver of intersection.
                const lDriverReference: WeakRef<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>> | undefined = this.mElementDriver.get(lEntry.target);
                if (!lDriverReference) {
                    continue;
                }

                // Defref the driver.
                const lDriver: PotatnoPreviewDriver<PotatnoProjectTypesDefinition> | undefined = lDriverReference.deref();
                if (!lDriver) {
                    continue;
                }

                // Update activity of driver.
                this.mDriverElementVisible.set(lDriver, lEntry.isIntersecting);
            }
        });
    }

    /**
     * Tick every live driver once, isolating per-driver failures. Drivers never compile here, so an
     * invalid document keeps its last rendered preview.
     *
     * @returns A promise resolving once every driver finished its render pass.
     */
    public execute(): void {
        // Iterate all known drivers.
        for (const lDriverReference of this.mDriverList) {
            // Deref the driver reference
            const lDriver: PotatnoPreviewDriver<PotatnoProjectTypesDefinition> | undefined = lDriverReference.deref();
            if (!lDriver) {
                continue;
            }

            // Skip drivers not in view. And only when explicit set to be disabled.
            if (this.mDriverElementVisible.get(lDriver) === false) {
                continue;
            }

            // Skip drivers not big enough. And only when explicit set to be disabled.
            if (this.mDriverElementBigEnough.get(lDriver) === false) {
                continue;
            }

            // Execute driver and ignore errors.
            try {
                lDriver.execute();
            } catch (pError) {
                // eslint-disable-next-line no-console
                console.error('[PotatnoUiManagerPreview] Driver render failed:', pError);
            }
        }
    }

    /**
     * Recompile every live driver from the latest graph. Skipped while the document is invalid so
     * drivers keep their last value instead of re-running the failing generator.
     */
    public refresh(): void {
        // Only refresh when the build has the probability to succeed.
        if (!this.mManager.integrity.isValid) {
            return;
        }

        // Iterate all driver reverse to delete and update unreferenced drivers in one go.
        for (let lIndex: number = this.mDriverList.length - 1; lIndex >= 0; lIndex--) {
            const lDriver: PotatnoPreviewDriver<PotatnoProjectTypesDefinition> | undefined = this.mDriverList[lIndex].deref();

            // Remove the driver when its not referenced any more.
            if (!lDriver) {
                this.unregister(this.mDriverList[lIndex]);

                continue;
            }

            lDriver.refresh();
        }
    }

    /**
     * Generate and register new driver for a target and display.
     * 
     * @param pTarget - Target function or port.
     * @param pDisplayId - Requested preview display.
     * 
     * @returns a already generated or new driver for the target. 
     */
    public requestDriver(pTarget: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pDisplayId: string): PotatnoPreviewDriver<PotatnoProjectTypesDefinition> | null {
        // Try to read the current driver from target hoping the correct display.
        const lCurrentDriver: PotatnoPreviewDriver<PotatnoProjectTypesDefinition> | undefined = this.mDrivers.get(pTarget);
        if (lCurrentDriver && lCurrentDriver.display.id === pDisplayId) {
            return lCurrentDriver;
        }

        // Clear the old driver.
        if (lCurrentDriver) {
            // Read driver referenc through drivers element and unregister.
            this.unregister(this.mElementDriver.get(lCurrentDriver.element)!);
        }

        // If it not, generate a new driver.
        const lPreviewDisplay: PotatnoPreviewDisplayItem<PotatnoProjectTypesDefinition> | null = pTarget.project.preview.getDisplay(pDisplayId);
        if (!lPreviewDisplay) {
            throw new Exception(`Preview has no display for "${pDisplayId}".`, this);
        }

        // Create and register driver.
        const lDriver: PotatnoPreviewDriver<PotatnoProjectTypesDefinition> = lPreviewDisplay.createDriver(pTarget);
        this.register(pTarget, lDriver);

        // Try to refresh the drivers code when the current documents integrity allows it.
        if (this.mManager.integrity.isValid) {
            lDriver.refresh();
        }

        return lDriver;
    }

    /**
     * Register the driver in all mappings and observe the preview element for intersections.
     * 
     * @param pDriver - The driver to register.
     */
    private register(pTarget: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pDriver: PotatnoPreviewDriver<PotatnoProjectTypesDefinition>): void {
        // Save the new driver as the main preview of the target.
        this.mDrivers.set(pTarget, pDriver);

        // Create a weak reference for the driver.
        const lDriverReference: WeakRef<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>> = new WeakRef(pDriver);

        // Append the driver reference to the driver list.
        this.mDriverList.push(lDriverReference);

        // Read the drivers element.
        const lPreviewElement: Element = pDriver.element;

        // Link the driver with his element.
        this.mDriverElements.set(lDriverReference, lPreviewElement);
        this.mElementDriver.set(lPreviewElement, lDriverReference);

        // Observe the preview element for view intersections.
        this.mPreviewIntersection.observe(lPreviewElement);
    }

    /**
     * Unregister a driver by its reference. Removes the driver from the driver list and unobserves its preview element.
     * 
     * @param pDriverReference - Driver reference hold by the driver list. 
     */
    private unregister(pDriverReference: WeakRef<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>>): void {
        // Find the index of the driver reference.
        const lReferenceIndex: number = this.mDriverList.indexOf(pDriverReference);
        if (lReferenceIndex === -1) {
            return;
        }

        // Remove driver reference from driver list.
        this.mDriverList.splice(lReferenceIndex, 1);

        // Get the element of the driver.
        const lPreviewElement: Element | undefined = this.mDriverElements.get(pDriverReference);
        if (!lPreviewElement) {
            return;
        }

        // Unobserve element when the driver is garbage collected.
        this.mPreviewIntersection.unobserve(lPreviewElement);
    }
}