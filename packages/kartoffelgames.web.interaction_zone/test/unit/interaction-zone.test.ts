import { expect } from 'chai';
import { InteractionEvent } from '../../source/zone/interaction-event';
import { InteractionZone } from '../../source/zone/interaction-zone';
import { PromiseRejectionEvent } from '../mock/error-event';

describe('InteractionZone', () => {
    describe('Static Property: current', () => {
        it('-- Available Zone', () => {
            // Setup.
            const lFirstInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lSecondInteractionZone: InteractionZone = InteractionZone.current.create('AnotherName');

            // Process.
            const lCurrentInteractionZone: InteractionZone = lFirstInteractionZone.execute(() => {
                return lSecondInteractionZone.execute(() => {
                    return InteractionZone.current;
                });
            });

            // Evaluation.
            expect(lCurrentInteractionZone).to.equal(lSecondInteractionZone);
        });

        it('-- No Zone', () => {
            // Process.
            const lCurrentInteractionZone: InteractionZone = InteractionZone.current;

            // Evaluation.
            expect(lCurrentInteractionZone.name).to.equal('Default');
        });
    });

    describe('Static Method: pushInteraction', () => {
        it('-- Push calls listener', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
            const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;

            // Process. Add listener.
            let lCalled: boolean = false;
            lInteractionZone.addInteractionListener(lInteractionType, () => {
                lCalled = true;
            });

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, {});
            });

            // Evaluation.
            expect(lCalled).to.be.true;
        });

        it('-- Generated event has correct origin', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
            const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;

            // Process. Add listener.
            let lReasonResult: InteractionEvent<TestTriggerEnum> | null = null;
            lInteractionZone.addInteractionListener(lInteractionType, (pReason: InteractionEvent<TestTriggerEnum>) => {
                lReasonResult = pReason;
            });

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, {});
            });

            // Evaluation.
            expect(lReasonResult!.origin).to.equal(lInteractionZone);
        });

        it('-- Generated event has correct trigger', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
            const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;

            // Process. Add listener.
            let lReasonResult: InteractionEvent<TestTriggerEnum> | null = null;
            lInteractionZone.addInteractionListener(lInteractionType, (pReason: InteractionEvent<TestTriggerEnum>) => {
                lReasonResult = pReason;
            });

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, {});
            });

            // Evaluation.
            expect(lReasonResult!.interactionTrigger).to.equal(lInteractionTrigger);
        });

        it('-- Generated event has correct type', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
            const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;

            // Process. Add listener.
            let lReasonResult: InteractionEvent<TestTriggerEnum> | null = null;
            lInteractionZone.addInteractionListener(lInteractionType, (pReason: InteractionEvent<TestTriggerEnum>) => {
                lReasonResult = pReason;
            });

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, {});
            });

            // Evaluation.
            expect(lReasonResult!.interactionType).to.equal(lInteractionType);
        });

        it('-- Generated event has correct type data', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
            const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;
            const lInteractionData = { a: 1 };

            // Process. Add listener.
            let lReasonResult: InteractionEvent<TestTriggerEnum> | null = null;
            lInteractionZone.addInteractionListener(lInteractionType, (pReason: InteractionEvent<TestTriggerEnum>) => {
                lReasonResult = pReason;
            });

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, lInteractionData);
            });

            // Evaluation.
            expect(lReasonResult!.data).to.equal(lInteractionData);
        });

        it('-- Pass through parent', () => {
            // Setup.
            const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('CD-child');
            const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
            const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;

            // Process. Add listener.
            let lCalled: boolean = false;
            lParentInteractionZone.addInteractionListener(lInteractionType, () => {
                lCalled = true;
            });

            // Process. Call listener.
            lChildInteractionZone.execute(() => {
                InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, {});
            });

            // Evaluation.
            expect(lCalled).to.be.true;
        });

        it('-- Pass through parent correct origin', () => {
            // Setup.
            const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('CD-child');
            const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
            const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;

            // Process. Add listener.
            let lReasonResult: InteractionEvent<TestTriggerEnum> | null = null;
            lParentInteractionZone.addInteractionListener(lInteractionType, (pReason: InteractionEvent<TestTriggerEnum>) => {
                lReasonResult = pReason;
            });

            // Process. Call listener.
            lChildInteractionZone.execute(() => {
                InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, {});
            });

            // Evaluation.
            expect(lReasonResult!.origin).to.equal(lChildInteractionZone);
        });

        it('-- Ignore none parent zones not in scope.', () => {
            // Setup.
            const lCorrectInteractionZone: InteractionZone = InteractionZone.current.create('Correct');
            const lParalellZone: InteractionZone = InteractionZone.current.create('No so correct');
            const lInteractionTrigger: TestTriggerEnum = TestTriggerEnum.Custom;
            const lInteractionType: typeof TestTriggerEnum = TestTriggerEnum;

            // Process. Add listener.
            let lCalled: boolean = false;
            lParalellZone.addInteractionListener(lInteractionType, () => {
                lCalled = true;
            });

            // Process. Call listener.
            lCorrectInteractionZone.execute(() => {
                InteractionZone.pushInteraction(lInteractionType, lInteractionTrigger, {});
            });

            // Evaluation.
            expect(lCalled).to.be.false;
        });
    });

    it('Property: name', () => {
        // Setup.
        const lName: string = 'CD-Name';
        const lInteractionZone: InteractionZone = InteractionZone.current.create(lName);

        // Process.
        const lNameResult: string = lInteractionZone.name;

        // Evaluation.
        expect(lNameResult).to.equal(lName);
    });


    it('Property: parent', () => {
        // Setup.
        const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Name');
        const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('CD-child');

        // Process.
        const lParentResult: InteractionZone = lChildInteractionZone.parent;

        // Evaluation.
        expect(lParentResult).to.equal(lParentInteractionZone);
    });

    describe('Method: addErrorListener', () => {
        describe('-- Synchron', () => {
            it('-- Error listener called', async () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

                // Process. Set error listener.
                let lErrorListenerCalled: boolean = false;
                lInteractionZone.addErrorListener(() => {
                    lErrorListenerCalled = true;
                });

                // Process. Throw error in zone.
                try {
                    lInteractionZone.execute(() => {
                        throw new Error();
                    });
                } catch (pError) {
                    window.dispatchEvent(new ErrorEvent('error', {
                        error: <Error>pError
                    }));
                }

                // Evaluation.
                expect(lErrorListenerCalled).to.be.true;
            });

            it('-- Error listener called with correct error', async () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
                const lError: Error = new Error();

                // Process. Set error listener.
                let lErrorListenerError: Error | null = null;
                lInteractionZone.addErrorListener((pError) => {
                    lErrorListenerError = pError;
                });

                // Process. Throw error in zone.
                try {
                    lInteractionZone.execute(() => {
                        throw lError;
                    });
                } catch (pError) {
                    window.dispatchEvent(new ErrorEvent('error', {
                        error: <Error>pError
                    }));
                }

                // Evaluation.
                expect(lErrorListenerError).to.equal(lError);
            });

            it('-- Parent Error listener called', async () => {
                // Setup.
                const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
                const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('Child');

                // Process. Set error listener.
                let lErrorListenerCalled: boolean = false;
                lParentInteractionZone.addErrorListener(() => {
                    lErrorListenerCalled = true;
                });

                // Process. Throw error in zone.
                try {
                    lChildInteractionZone.execute(() => {
                        throw new Error();
                    });
                } catch (pError) {
                    window.dispatchEvent(new ErrorEvent('error', {
                        error: <Error>pError
                    }));
                }

                // Evaluation.
                expect(lErrorListenerCalled).to.be.true;
            });

            it('-- Ignore Parent Error listener when default prevented.', async () => {
                // Setup.
                const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
                const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('Child');

                lChildInteractionZone.addErrorListener(() => {
                    return false;
                });

                // Process. Set error listener.
                let lErrorListenerCalled: boolean = false;
                lParentInteractionZone.addErrorListener(() => {
                    lErrorListenerCalled = true;
                });

                // Process. Throw error in zone.
                try {
                    lChildInteractionZone.execute(() => {
                        throw new Error();
                    });
                } catch (pError) {
                    window.dispatchEvent(new ErrorEvent('error', {
                        error: <Error>pError
                    }));
                }

                // Evaluation.
                expect(lErrorListenerCalled).to.be.true;
            });

            it('-- Ignore Error listener called outside zone', async () => {
                // Setup.
                const lCorrectInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
                const lParallelInteractionZone: InteractionZone = lCorrectInteractionZone.create('Child');

                // Process. Set error listener.
                let lErrorListenerCalled: boolean = false;
                lParallelInteractionZone.addErrorListener(() => {
                    lErrorListenerCalled = true;
                });

                // Process. Throw error in zone.
                try {
                    lCorrectInteractionZone.execute(() => {
                        throw new Error();
                    });
                } catch (pError) {
                    window.dispatchEvent(new ErrorEvent('error', {
                        error: <Error>pError
                    }));
                }

                // Evaluation.
                expect(lErrorListenerCalled).to.be.false;
            });
        });

        describe('-- Asynchron', () => {
            it('-- Error listener called', async () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

                // Process. Set error listener.
                const lErrorCalledWaiter = new Promise<boolean>((pResolve) => {
                    lInteractionZone.addErrorListener(() => {
                        pResolve(true);
                    });
                });

                // Process. Create promise in zone. 
                const lPromise: Promise<void> = lInteractionZone.execute(async () => {
                    return new Promise<void>(() => { });
                });

                // Process. "Throw" promise into global scope.
                window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                    promise: <Promise<void>><any>lPromise,
                    reason: new Error()
                }));

                // Process. Wait for error.
                const lErrorListenerCalled = await lErrorCalledWaiter;

                // Evaluation.
                expect(lErrorListenerCalled).to.be.true;
            });

            it('-- Error listener called with correct error', async () => {
                // Setup.
                const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
                const lError: Error = new Error();

                // Process. Set error listener.
                const lErrorWaiter = new Promise<Error>((pResolve) => {
                    lInteractionZone.addErrorListener(() => {
                        pResolve(lError);
                    });
                });

                // Process. Create promise in zone. 
                const lPromise: Promise<void> = lInteractionZone.execute(async () => {
                    return new Promise<void>(() => { });
                });

                // Process. "Throw" promise into global scope.
                window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                    promise: <Promise<void>><any>lPromise,
                    reason: new Error()
                }));

                // Process. Wait for error.
                const lErrorListenerError = await lErrorWaiter;

                // Evaluation.
                expect(lErrorListenerError).to.equal(lError);
            });

            it('-- Parent Error listener called', async () => {
                // Setup.
                const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
                const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('Child');

                // Process. Set error listener.
                const lErrorCalledWaiter = new Promise<boolean>((pResolve) => {
                    lParentInteractionZone.addErrorListener(() => {
                        pResolve(true);
                    });
                });

                // Process. Create promise in zone. 
                const lPromise: Promise<void> = lChildInteractionZone.execute(async () => {
                    return new Promise<void>(() => { });
                });

                // Process. "Throw" promise into global scope.
                window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                    promise: <Promise<void>><any>lPromise,
                    reason: new Error()
                }));

                // Process. Wait for error.
                const lErrorListenerCalled = await lErrorCalledWaiter;
                // Evaluation.
                expect(lErrorListenerCalled).to.be.true;
            });

            it('-- Ignore Parent Error listener when default prevented.', async () => {
                // Setup.
                const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
                const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('Child');

                // Setup. Child listener that prevents bubbling.
                lChildInteractionZone.addErrorListener(() => {
                    return false;
                });

                // Process. Set error listener.
                const lErrorCalledWaiter = new Promise<boolean>((pResolve) => {
                    lParentInteractionZone.addErrorListener(() => {
                        pResolve(true);
                    });

                    window.setTimeout(() => { pResolve(false); }, 20);
                });

                // Process. Create promise in zone. 
                const lPromise: Promise<void> = lChildInteractionZone.execute(async () => {
                    return new Promise<void>(() => { });
                });

                // Process. "Throw" promise into global scope.
                window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                    promise: <Promise<void>><any>lPromise,
                    reason: new Error()
                }));

                // Process. Wait for error.
                const lErrorListenerCalled = await lErrorCalledWaiter;

                // Evaluation.
                expect(lErrorListenerCalled).to.be.true;
            });

            it('-- Ignore Error listener called outside zone', async () => {
                // Setup.
                const lCorrectInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
                const lParallelInteractionZone: InteractionZone = lCorrectInteractionZone.create('Child');

                // Process. Set error listener.
                const lErrorCalledWaiter = new Promise<boolean>((pResolve) => {
                    lParallelInteractionZone.addErrorListener(() => {
                        pResolve(true);
                    });

                    window.setTimeout(() => { pResolve(false); }, 20);
                });

                // Process. Create promise in zone. 
                const lPromise: Promise<void> = lCorrectInteractionZone.execute(async () => {
                    return new Promise<void>(() => { });
                });

                // Process. "Throw" promise into global scope.
                window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                    promise: <Promise<void>><any>lPromise,
                    reason: new Error()
                }));

                // Process. Wait for error.
                const lErrorListenerCalled = await lErrorCalledWaiter;

                // Evaluation.
                expect(lErrorListenerCalled).to.be.false;
            });
        });

        it('-- Convert non object errors into error objects for syncron errors.', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            const lError: string = 'ERROR-MESSAGE';

            // Process. Throw error in zone.
            let lErrorResult: Error | null = null;
            try {
                lInteractionZone.execute(() => {
                    throw lError;
                });
            } catch (pError) {
                lErrorResult = <Error>pError;
            }

            // Evaluation.
            expect(lErrorResult?.message).to.equal(lError);
        });

        it('-- Double added listener', async () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Process. Set error listener.
            let lErrorListenerCallCount: number = 0;
            const lErrorListener = () => {
                lErrorListenerCallCount++;
            };
            lInteractionZone.addErrorListener(lErrorListener);
            lInteractionZone.addErrorListener(lErrorListener);

            // Process. Throw error in zone.
            try {
                lInteractionZone.execute(() => {
                    throw new Error();
                });
            } catch (pError) {
                window.dispatchEvent(new ErrorEvent('error', {
                    error: <Error>pError
                }));
            }

            // Evaluation.
            expect(lErrorListenerCallCount).to.equal(1);
        });
    });

    describe('Method: addInteractionListener', () => {
        it('-- Listener called.', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            lInteractionZone.addInteractionListener(TestTriggerEnum, () => {
                lListenerCalled = true;
            });

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
            });

            // Evaluation.
            expect(lListenerCalled).to.be.true;
        });

        it('-- Double add listener', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Process. Add listener.
            let lListenerCounter: number = 0;
            const lListener = () => {
                lListenerCounter++;
            };
            lInteractionZone.addInteractionListener(TestTriggerEnum, lListener);
            lInteractionZone.addInteractionListener(TestTriggerEnum, lListener);

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
            });

            // Evaluation.
            expect(lListenerCounter).to.be.true;
        });

        it('-- Parent listener called', () => {
            // Setup.
            const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
            const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('Child');

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            lParentInteractionZone.addInteractionListener(TestTriggerEnum, () => {
                lListenerCalled = true;
            });

            // Process. Call listener.
            lChildInteractionZone.execute(() => {
                InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
            });

            // Evaluation.
            expect(lListenerCalled).to.be.true;
        });

        it('-- Listener ignored wrong trigger type.', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            lInteractionZone.addInteractionListener(TestTriggerEnumOther, () => {
                lListenerCalled = true;
            });

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
            });

            // Evaluation.
            expect(lListenerCalled).to.be.false;
        });

        it('-- Listener ignored restricted trigger.', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');
            lInteractionZone.addTriggerRestriction(TestTriggerEnum, TestTriggerEnum.Custom2);

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            lInteractionZone.addInteractionListener(TestTriggerEnum, () => {
                lListenerCalled = true;
            });

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
            });

            // Evaluation.
            expect(lListenerCalled).to.be.false;
        });

        it('-- Ignore listener outside zone.', () => {
            // Setup.
            const lCorrectInteractionZone: InteractionZone = InteractionZone.current.create('Correct');
            const lParallelInteractionZone: InteractionZone = InteractionZone.current.create('Other');

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            lParallelInteractionZone.addInteractionListener(TestTriggerEnum, () => {
                lListenerCalled = true;
            });

            // Process. Call listener.
            lCorrectInteractionZone.execute(() => {
                InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
            });

            // Evaluation.
            expect(lListenerCalled).to.be.false;
        });

        it('-- Ignore parent listener when child has restriction', () => {
            // Setup.
            const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Parent');
            const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('Child');
            lChildInteractionZone.addTriggerRestriction(TestTriggerEnum, TestTriggerEnum.Custom2);

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            lParentInteractionZone.addInteractionListener(TestTriggerEnum, () => {
                lListenerCalled = true;
            });

            // Process. Call listener.
            lChildInteractionZone.execute(() => {
                InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
            });

            // Evaluation.
            expect(lListenerCalled).to.be.false;
        });
    });

    describe('Method: addTriggerRestriction', () => {
        it('-- Restrict single type.', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Setup. Add listener.
            let lListenerCalled: boolean = false;
            lInteractionZone.addInteractionListener(TestTriggerEnum, () => {
                lListenerCalled = true;
            });

            // Process.
            lInteractionZone.addTriggerRestriction(TestTriggerEnum, TestTriggerEnum.Custom2);

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
            });

            // Evaluation.
            expect(lListenerCalled).to.be.false;
        });

        it('-- Dont interfere with other type..', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Setup. Add listener.
            let lListenerCalled: boolean = false;
            lInteractionZone.addInteractionListener(TestTriggerEnum, () => {
                lListenerCalled = true;
            });

            // Process.
            lInteractionZone.addTriggerRestriction(TestTriggerEnumOther, TestTriggerEnumOther.Custom2);

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
            });

            // Evaluation.
            expect(lListenerCalled).to.be.false;
        });

        it('-- Override restriction.', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Setup. Add listener.
            let lListenerCalled: boolean = false;
            lInteractionZone.addInteractionListener(TestTriggerEnum, () => {
                lListenerCalled = true;
            });

            // Process.
            lInteractionZone.addTriggerRestriction(TestTriggerEnum, TestTriggerEnum.Custom2);
            lInteractionZone.addTriggerRestriction(TestTriggerEnum, ~0);

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
            });

            // Evaluation.
            expect(lListenerCalled).to.be.true;
        });
    });

    it('Method: create', () => {
        // Setup.
        const lParentInteractionZone: InteractionZone = InteractionZone.current.create('Parent');

        // Process.
        const lChildInteractionZone: InteractionZone = lParentInteractionZone.create('Child');
        const lResultParentZone: InteractionZone = lChildInteractionZone.parent;

        // Evaluation.
        expect(lResultParentZone).to.equal(lParentInteractionZone);
    });

    describe('Method: execute', () => {
        it('-- Execute inside zone', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName');

            // Process.
            const lZoneResult: InteractionZone = lZone.execute(() => {
                return InteractionZone.current;
            });

            // Evaluation.
            expect(lZoneResult).to.equal(lZone);
        });

        it('-- With correct result', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
            const lValue: number = 123;

            // Process.
            const lZoneResult: number = lZone.execute(() => {
                return lValue;
            });

            // Evaluation.
            expect(lZoneResult).to.equal(lValue);
        });

        it('-- Execute inside zone with parameter', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('Name');
            const lExecutionResult: string = 'ExecutionResult';

            // Process.
            const lResult: string = lZone.execute((pParameter: string) => {
                return pParameter;
            }, lExecutionResult);

            // Evaluation.
            expect(lResult).to.equal(lExecutionResult);
        });

        it('-- Execute inside zone with error', () => {
            // Setup.
            const lZone: InteractionZone = InteractionZone.current.create('ZoneName');
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
            expect(lErrorResult).to.equal(lError);
        });

        it('-- Correct zones before and after execution with error', () => {
            // Setup.
            const lDefaultZone: InteractionZone = InteractionZone.current;
            const lExecutionZone: InteractionZone = InteractionZone.current.create('ZoneName');

            // Process.
            let lZoneResultFunktion: InteractionZone | null = null;
            let lZoneResultException: InteractionZone | null = null;
            const lZoneResultBefore: InteractionZone = InteractionZone.current;
            try {
                lExecutionZone.execute(() => {
                    lZoneResultFunktion = InteractionZone.current;
                    throw '';
                });
            } catch (pError) {
                lZoneResultException = InteractionZone.current;
            }
            const lZoneNameResultAfter = InteractionZone.current;

            // Evaluation.
            expect(lZoneResultBefore).to.equal(lDefaultZone);
            expect(lZoneResultFunktion).to.equal(lExecutionZone);
            expect(lZoneResultException).to.equal(lDefaultZone);
            expect(lZoneNameResultAfter).to.equal(lDefaultZone);
        });
    });

    it('Method: removeErrorListener', async () => {
        // Setup.
        const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

        // Process. Set error listener.
        let lErrorListenerCalled: boolean = false;
        const lErrorListener = () => {
            lErrorListenerCalled = true;
        };
        lInteractionZone.addErrorListener(lErrorListener);
        lInteractionZone.removeErrorListener(lErrorListener);

        // Process. Throw error in zone.
        try {
            lInteractionZone.execute(() => {
                throw new Error();
            });
        } catch (pError) {
            window.dispatchEvent(new ErrorEvent('error', {
                error: pError
            }));
        }

        // Evaluation.
        expect(lErrorListenerCalled).to.be.false;
    });

    describe('Method: removeInteractionListener', () => {
        it('-- Remove existing', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            const lListener = () => {
                lListenerCalled = true;
            };
            lInteractionZone.addInteractionListener(TestTriggerEnum, lListener);
            lInteractionZone.removeInteractionListener(TestTriggerEnum, lListener);

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
            });

            // Evaluation.
            expect(lListenerCalled).to.be.false;
        });

        it('-- Remove wrong trigger type existing', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            const lListener = () => {
                lListenerCalled = true;
            };
            lInteractionZone.addInteractionListener(TestTriggerEnum, lListener);
            lInteractionZone.removeInteractionListener({}, lListener);

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
            });

            // Evaluation.
            expect(lListenerCalled).to.be.true;
        });

        it('-- Remove with empty listener list', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            const lListener = () => {
                lListenerCalled = true;
            };
            lInteractionZone.removeInteractionListener(TestTriggerEnum, lListener);

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
            });

            // Evaluation.
            expect(lListenerCalled).to.be.true;
        });

        it('-- Remove all listener of type', () => {
            // Setup.
            const lInteractionZone: InteractionZone = InteractionZone.current.create('Name');

            // Process. Add listener.
            let lListenerCalled: boolean = false;
            const lListenerOne = () => {
                lListenerCalled = true;
            };
            const lListenerTwo = () => {
                lListenerCalled = true;
            };
            lInteractionZone.addInteractionListener(TestTriggerEnum, lListenerOne);
            lInteractionZone.addInteractionListener(TestTriggerEnum, lListenerTwo);
            lInteractionZone.removeInteractionListener(TestTriggerEnum);

            // Process. Call listener.
            lInteractionZone.execute(() => {
                InteractionZone.pushInteraction(TestTriggerEnum, TestTriggerEnum.Custom, new Object());
            });

            // Evaluation.
            expect(lListenerCalled).to.be.false;
        });
    });
});

enum TestTriggerEnum {
    Custom = 1,
    Custom2 = 2,
    Both = 3
}

enum TestTriggerEnumOther {
    Custom = 1,
    Custom2 = 2,
    Both = 3
}