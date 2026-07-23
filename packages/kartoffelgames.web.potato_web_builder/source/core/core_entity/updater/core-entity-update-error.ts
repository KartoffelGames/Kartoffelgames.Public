import type { InteractionZone } from '@kartoffelgames/core-interaction-zone';

/**
 * Wraps an error thrown inside an asynchronous update cycle and keeps a reference to the
 * {@link InteractionZone} it originated from.
 * The zone reference allows an application to attribute the error to its own interaction zone
 * hierarchy once it surfaces as an uncaught error. The original error is available on the standard
 * {@link Error.cause} property.
 */
export class CoreEntityUpdateError extends Error {
    private readonly mZone: InteractionZone;

    /**
     * Interaction zone the wrapped error originated from.
     */
    public get zone(): InteractionZone {
        return this.mZone;
    }

    /**
     * Constructor.
     * Wrap an error thrown inside an update zone.
     *
     * @param pError - Original error thrown during the update.
     * @param pZone - Interaction zone the error originated from.
     */
    public constructor(pError: unknown, pZone: InteractionZone) {
        // Read message from the wrapped error.
        const lErrorMessage: string = (pError instanceof Error) ? pError.message : 'Non-error value thrown';

        // Keep the original error as the standard error cause.
        super(`Update error in zone "${pZone.name}": ${lErrorMessage}`, { cause: pError });

        // Store the origin zone.
        this.mZone = pZone;
    }
}
