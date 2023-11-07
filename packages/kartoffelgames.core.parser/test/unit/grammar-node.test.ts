import { Exception } from '@kartoffelgames/core.data';
import { expect } from 'chai';
import { AnonymoutGrammarNode } from '../../source/graph/node/anonymous-grammar-node';
import { BaseGrammarNode } from '../../source/graph/node/base-grammar-node';
import { GrammarBranchNode } from '../../source/graph/node/grammer-branch-node';
import { GrammarLoopNode } from '../../source/graph/node/grammer-loop-node';
import { GrammarSingleNode } from '../../source/graph/node/grammer-single-node';

describe('GrammarNode', () => {

    describe('Functionality: Chainging', () => {
        it('-- Error on Node double chaining', () => {
            // Setup.
            const lSingleNode: BaseGrammarNode<string> = new GrammarSingleNode<string>(null, 'Value', true, null);

            // Process.
            lSingleNode.single('Value');
            const lErrorFunction = () => {
                lSingleNode.single('Value');
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(Exception);
        });
    });



    describe('-- AnonymousGrammarNode', () => {
        it('-- Create with chaining single', () => {
            // Setup.
            const lAnonymousNode: AnonymoutGrammarNode<string> = new AnonymoutGrammarNode<string>();

            // Process.
            const lGraph: BaseGrammarNode<string> = lAnonymousNode.single('Value');

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarSingleNode);
        });

        it('-- Create with chaining branch', () => {
            // Setup.
            const lAnonymousNode: AnonymoutGrammarNode<string> = new AnonymoutGrammarNode<string>();

            // Process.
            const lGraph: BaseGrammarNode<string> = lAnonymousNode.branch(['Value']);

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarBranchNode);
        });

        it('-- Create with chaining loop', () => {
            // Setup.
            const lAnonymousNode: AnonymoutGrammarNode<string> = new AnonymoutGrammarNode<string>();

            // Process.
            const lGraph: BaseGrammarNode<string> = lAnonymousNode.loop('Value');

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarLoopNode);
        });

        describe('-- Errors', () => {
            it('-- Anonymous node next', () => {
                // Setup.
                const lAnonymousNode: AnonymoutGrammarNode<string> = new AnonymoutGrammarNode<string>();

                // Process.
                const lErrorFunction = () => {
                    lAnonymousNode.next();
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(Exception);
            });

            it('-- Anonymous node values', () => {
                // Setup.
                const lAnonymousNode: AnonymoutGrammarNode<string> = new AnonymoutGrammarNode<string>();

                // Process.
                const lErrorFunction = () => {
                    lAnonymousNode.nodeValues;
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(Exception);
            });
        });
    });
});