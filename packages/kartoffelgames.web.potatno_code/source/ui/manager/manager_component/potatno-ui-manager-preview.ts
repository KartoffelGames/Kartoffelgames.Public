import { Exception } from '@kartoffelgames/core';
import type { IPotatnoDocumentItem } from '../../../document/i-potatno-document-item.interface.ts';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoPreviewDriver } from '../../../preview/potatno-preview-driver.ts';
import type { PotatnoPreviewDisplayItem } from '../../../preview/potatno-preview.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, type PotatnoUiManager } from '../potatno-ui-manager.ts';

/**
 * Owner of every live preview driver. Each previewable document item — a node with a preview opt-in
 * or a document function shown in the main panel — maps to at most one {@link PotatnoPreviewDriver}.
 * Components request a driver via {@link nodeDriver} / {@link functionDriver}; a weak list of all
 * live drivers is recompiled on a structural change ({@link refresh}) and rendered every frame
 * ({@link execute}).
 *
 * Drivers are self-contained — building the preview element, regenerating and compiling the code
 * and rendering all happen inside the driver. This component only decides when each driver
 * refreshes and executes, and which driver belongs to which document item.
 */
export class PotatnoUiManagerPreview {
    private readonly mDriverActivity: WeakMap<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>, boolean>;
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
        this.mDriverActivity = new WeakMap<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>, boolean>();

        // Mapping between elements and driver.
        this.mDriverElements = new WeakMap<WeakRef<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>>, Element>();
        this.mElementDriver = new WeakMap<Element, WeakRef<PotatnoPreviewDriver<PotatnoProjectTypesDefinition>>>();

        // A new document instance replaces every item; drop the drivers so components re-request
        // fresh ones against the live graph.
        this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Document, null, () => {
            this.mDriverList.splice(0, this.mDriverList.length);
        });

        // In-place edits keep the same items: recompile live drivers after a debounce.
        let lDebounce: number = 0;
        const lStructuralEvents: number = PotatnoCodeUiManagerChangeType.Connection | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.Node;
        this.mManager.subscribe(lStructuralEvents, null, () => {
            globalThis.clearTimeout(lDebounce);
            lDebounce = globalThis.setTimeout(() => this.refresh(), 1000) as unknown as number;
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
                this.mDriverActivity.set(lDriver, lEntry.isIntersecting);
            }
        });
    }

    /**
     * Tick every live driver once, isolating per-driver failures. Drivers never compile here, so an
     * invalid document keeps its last rendered preview.
     *
     * @returns A promise resolving once every driver finished its render pass.
     */
    public async execute(): Promise<void> {
        const lExecutionList: Array<Promise<void>> = this.mDriverList.map(async (pDriverReference) => {
            // Deref the driver reference
            const lDriver: PotatnoPreviewDriver<PotatnoProjectTypesDefinition> | undefined = pDriverReference.deref();
            if (!lDriver) {
                return;
            }

            // Skip drivers not in view.
            if (!this.mDriverActivity.get(lDriver)) {
                return;
            }

            // Execute driver and ignore errors.
            try {
                await lDriver.execute();
            } catch (pError) {
                // eslint-disable-next-line no-console
                console.error('[PotatnoUiManagerPreview] Driver render failed:', pError);
            }
        });

        // Wait for all driver executions to finish.
        await Promise.all(lExecutionList);
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

        // For the next step a project must be setup.
        if (!this.mManager.project) {
            return null;
        }

        // If it not, generate a new driver.
        const lPreviewDisplay: PotatnoPreviewDisplayItem<PotatnoProjectTypesDefinition> | null = this.mManager.project.preview.getDisplay(pDisplayId);
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