import { Injection } from '@kartoffelgames/core-dependency-injection';
import type { PotatnoDocumentPort } from '../document/potatno-document-port.ts';
import { PotatnoUiProject } from "./manager/potatno-ui-manager.ts";

/**
 * Shared registry mapping each rendered {@link PotatnoDocumentPort} to its circle DOM element.
 *
 * Port components register their element on connect and unregister on deconstruct, so consumers that
 * live in a different part of the component tree can resolve a port's on-screen position without the
 * old node → graph event re-emit chain. The connection layer reads it to anchor wires; the node
 * graph reads it to hit-test wire drop targets.
 */
@Injection.injectable('singleton')
export class PotatnoPortRegistry {
    private readonly mElements: Map<PotatnoDocumentPort<PotatnoUiProject>, HTMLElement>;

    /**
     * Create an empty registry.
     */
    public constructor() {
        this.mElements = new Map<PotatnoDocumentPort<PotatnoUiProject>, HTMLElement>();
    }

    /**
     * Iterate every registered port/element pair.
     *
     * @returns An iterator over the registered entries.
     */
    public entries(): IterableIterator<[PotatnoDocumentPort<PotatnoUiProject>, HTMLElement]> {
        return this.mElements.entries();
    }

    /**
     * Resolve the circle element registered for a port.
     *
     * @param pPort - The port whose element to resolve.
     *
     * @returns The registered element, or `undefined` when the port is not rendered.
     */
    public get(pPort: PotatnoDocumentPort<PotatnoUiProject>): HTMLElement | undefined {
        return this.mElements.get(pPort);
    }

    /**
     * Register (or replace) the circle element backing a port.
     *
     * @param pPort - The port being rendered.
     * @param pElement - The port's circle element.
     */
    public register(pPort: PotatnoDocumentPort<PotatnoUiProject>, pElement: HTMLElement): void {
        this.mElements.set(pPort, pElement);
    }

    /**
     * Drop a port's registration.
     *
     * @param pPort - The port whose element to forget.
     */
    public unregister(pPort: PotatnoDocumentPort<PotatnoUiProject>): void {
        this.mElements.delete(pPort);
    }
}
