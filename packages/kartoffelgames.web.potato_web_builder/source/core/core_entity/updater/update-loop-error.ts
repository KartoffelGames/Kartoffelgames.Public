import { InteractionZoneEvent } from "@kartoffelgames/core-interaction-zone";
import { ComponentState } from "../component_state/component-state.ts";

export class UpdateLoopError extends Error {
    private readonly mChain: Array<InteractionZoneEvent<ComponentState>>;

    /**
     * Asynchron call chain.
     */
    public get chain(): Array<InteractionZoneEvent<ComponentState>> {
        // More of the same. Needs no testing.
        /* istanbul ignore next */
        return this.mChain;
    }

    /**
     * Constructor.
     * Create loop error.
     * @param pMessage - Error Message.
     * @param pChain - Current call chain.
     */
    public constructor(pMessage: string, pChain: Array<InteractionZoneEvent<ComponentState>>) {
        // Add first 5 reasons to message.
        const lChainMessage = pChain.slice(-20).map((pItem) => { return pItem.toString(); }).join('\n');

        super(`${pMessage}: \n${lChainMessage}`);
        this.mChain = [...pChain];
    }
}