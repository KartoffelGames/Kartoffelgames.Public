import { Exception } from '@kartoffelgames/core';
import { expect } from 'chai';
import { AnonymousGrammarNode } from '../../source/graph/node/anonymous-grammar-node';
import { BaseGrammarNode } from '../../source/graph/node/base-grammar-node';
import { GrammarBranchNode } from '../../source/graph/node/grammer-branch-node';
import { GrammarLoopNode } from '../../source/graph/node/grammer-loop-node';
import { GrammarSingleNode } from '../../source/graph/node/grammer-single-node';
import { GrammarNodeValueType } from '../../source/graph/node/grammer-node-value-type.enum';

describe('GrammarNode', () => {
    it('Property: branchRoot', () => {
        // Setup.
        const lSingleNode: GrammarSingleNode<string> = new GrammarSingleNode<string>(null, 'Value', true, null);

        // Process.
        const lGraph: BaseGrammarNode<string> = lSingleNode.single('Value');

        // Evaluation.
        expect(lGraph.branchRoot).to.equal(lSingleNode);
    });

    it('Property: identifier', () => {
        // Process.
        const lSingleNode: GrammarSingleNode<string> = new GrammarSingleNode<string>(null, 'Value', true, 'Name');

        // Evaluation.
        expect(lSingleNode.identifier).to.equal('Name');
    });

    it('Property: required', () => {
        // Process.
        const lSingleNode: GrammarSingleNode<string> = new GrammarSingleNode<string>(null, 'Value', true, null);

        // Evaluation.
        expect(lSingleNode.required).to.be.true;
    });

    it('Property: valueType', () => {
        // Process.
        const lSingleNode: GrammarSingleNode<string> = new GrammarSingleNode<string>(null, 'Value', true, null);

        // Evaluation.
        expect(lSingleNode.valueType).to.equal(GrammarNodeValueType.Single);
    });

    describe('Functionality: Chainging', () => {
        it('-- Create with chaining single unnamed', () => {
            // Setup.
            const lSingleNode: GrammarSingleNode<string> = new GrammarSingleNode<string>(null, 'Value', true, null);

            // Process.
            const lGraph: BaseGrammarNode<string> = lSingleNode.single('Value');

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarSingleNode);
            expect(lGraph.branchRoot).to.equal(lSingleNode);
            expect(lGraph.required).to.be.true;
        });

        it('-- Create with chaining optional unnamed', () => {
            // Setup.
            const lSingleNode: GrammarSingleNode<string> = new GrammarSingleNode<string>(null, 'Value', true, null);

            // Process.
            const lGraph: BaseGrammarNode<string> = lSingleNode.optional('Value');

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarSingleNode);
            expect(lGraph.branchRoot).to.equal(lSingleNode);
            expect(lGraph.required).to.be.false;
        });

        it('-- Create with chaining branch unnamed', () => {
            // Setup.
            const lSingleNode: GrammarSingleNode<string> = new GrammarSingleNode<string>(null, 'Value', true, null);

            // Process.
            const lGraph: BaseGrammarNode<string> = lSingleNode.branch(['Value']);

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarBranchNode);
            expect(lGraph.branchRoot).to.equal(lSingleNode);
            expect(lGraph.required).to.be.true;
        });

        it('-- Create with chaining optional branch unnamed', () => {
            // Setup.
            const lSingleNode: GrammarSingleNode<string> = new GrammarSingleNode<string>(null, 'Value', true, null);

            // Process.
            const lGraph: BaseGrammarNode<string> = lSingleNode.optionalBranch(['Value']);

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarBranchNode);
            expect(lGraph.branchRoot).to.equal(lSingleNode);
            expect(lGraph.required).to.be.false;
        });

        it('-- Create with chaining loop unnamed', () => {
            // Setup.
            const lSingleNode: GrammarSingleNode<string> = new GrammarSingleNode<string>(null, 'Value', true, null);

            // Process.
            const lGraph: BaseGrammarNode<string> = lSingleNode.loop('Value');

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarLoopNode);
            expect(lGraph.branchRoot).to.equal(lSingleNode);
            expect(lGraph.required).to.be.false;
        });

        it('-- Create with chaining single named', () => {
            // Setup.
            const lSingleNode: GrammarSingleNode<string> = new GrammarSingleNode<string>(null, 'Value', true, null);

            // Process.
            const lGraph: BaseGrammarNode<string> = lSingleNode.single('Name', 'Value');

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarSingleNode);
            expect(lGraph.branchRoot).to.equal(lSingleNode);
            expect(lGraph.required).to.be.true;
            expect(lGraph.identifier).to.equal('Name');
        });

        it('-- Create with chaining optional named', () => {
            // Setup.
            const lSingleNode: GrammarSingleNode<string> = new GrammarSingleNode<string>(null, 'Value', true, null);

            // Process.
            const lGraph: BaseGrammarNode<string> = lSingleNode.optional('Name', 'Value');

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarSingleNode);
            expect(lGraph.branchRoot).to.equal(lSingleNode);
            expect(lGraph.required).to.be.false;
            expect(lGraph.identifier).to.equal('Name');
        });

        it('-- Create with chaining branch named', () => {
            // Setup.
            const lSingleNode: GrammarSingleNode<string> = new GrammarSingleNode<string>(null, 'Value', true, null);

            // Process.
            const lGraph: BaseGrammarNode<string> = lSingleNode.branch('Name', ['Value']);

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarBranchNode);
            expect(lGraph.branchRoot).to.equal(lSingleNode);
            expect(lGraph.required).to.be.true;
            expect(lGraph.identifier).to.equal('Name');
        });

        it('-- Create with chaining optional branch named', () => {
            // Setup.
            const lSingleNode: GrammarSingleNode<string> = new GrammarSingleNode<string>(null, 'Value', true, null);

            // Process.
            const lGraph: BaseGrammarNode<string> = lSingleNode.optionalBranch('Name', ['Value']);

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarBranchNode);
            expect(lGraph.branchRoot).to.equal(lSingleNode);
            expect(lGraph.required).to.be.false;
            expect(lGraph.identifier).to.equal('Name');
        });

        it('-- Create with chaining loop named', () => {
            // Setup.
            const lSingleNode: GrammarSingleNode<string> = new GrammarSingleNode<string>(null, 'Value', true, null);

            // Process.
            const lGraph: BaseGrammarNode<string> = lSingleNode.loop('Name', 'Value');

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarLoopNode);
            expect(lGraph.branchRoot).to.equal(lSingleNode);
            expect(lGraph.required).to.be.false;
            expect(lGraph.identifier).to.equal('Name');
        });

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
        it('-- Create with chaining single unnamed', () => {
            // Setup.
            const lAnonymousNode: AnonymousGrammarNode<string> = new AnonymousGrammarNode<string>();

            // Process.
            const lGraph: BaseGrammarNode<string> = lAnonymousNode.single('Value');

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarSingleNode);
            expect(lGraph.branchRoot).to.equal(lGraph);
            expect(lGraph.required).to.be.true;
        });

        it('-- Create with chaining optional unnamed', () => {
            // Setup.
            const lAnonymousNode: AnonymousGrammarNode<string> = new AnonymousGrammarNode<string>();

            // Process.
            const lGraph: BaseGrammarNode<string> = lAnonymousNode.optional('Value');

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarSingleNode);
            expect(lGraph.branchRoot).to.equal(lGraph);
            expect(lGraph.required).to.be.false;
        });

        it('-- Create with chaining branch unnamed', () => {
            // Setup.
            const lAnonymousNode: AnonymousGrammarNode<string> = new AnonymousGrammarNode<string>();

            // Process.
            const lGraph: BaseGrammarNode<string> = lAnonymousNode.branch(['Value']);

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarBranchNode);
            expect(lGraph.branchRoot).to.equal(lGraph);
            expect(lGraph.required).to.be.true;
        });

        it('-- Create with chaining optional branch unnamed', () => {
            // Setup.
            const lAnonymousNode: AnonymousGrammarNode<string> = new AnonymousGrammarNode<string>();

            // Process.
            const lGraph: BaseGrammarNode<string> = lAnonymousNode.optionalBranch(['Value']);

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarBranchNode);
            expect(lGraph.branchRoot).to.equal(lGraph);
            expect(lGraph.required).to.be.false;
        });

        it('-- Create with chaining loop unnamed', () => {
            // Setup.
            const lAnonymousNode: AnonymousGrammarNode<string> = new AnonymousGrammarNode<string>();

            // Process.
            const lGraph: BaseGrammarNode<string> = lAnonymousNode.loop('Value');

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarLoopNode);
            expect(lGraph.branchRoot).to.equal(lGraph);
            expect(lGraph.required).to.be.false;
        });

        it('-- Create with chaining single named', () => {
            // Setup.
            const lAnonymousNode: AnonymousGrammarNode<string> = new AnonymousGrammarNode<string>();

            // Process.
            const lGraph: BaseGrammarNode<string> = lAnonymousNode.single('Name', 'Value');

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarSingleNode);
            expect(lGraph.branchRoot).to.equal(lGraph);
            expect(lGraph.required).to.be.true;
            expect(lGraph.identifier).to.equal('Name');
        });

        it('-- Create with chaining optional named', () => {
            // Setup.
            const lAnonymousNode: AnonymousGrammarNode<string> = new AnonymousGrammarNode<string>();

            // Process.
            const lGraph: BaseGrammarNode<string> = lAnonymousNode.optional('Name', 'Value');

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarSingleNode);
            expect(lGraph.branchRoot).to.equal(lGraph);
            expect(lGraph.required).to.be.false;
            expect(lGraph.identifier).to.equal('Name');
        });

        it('-- Create with chaining branch named', () => {
            // Setup.
            const lAnonymousNode: AnonymousGrammarNode<string> = new AnonymousGrammarNode<string>();

            // Process.
            const lGraph: BaseGrammarNode<string> = lAnonymousNode.branch('Name', ['Value']);

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarBranchNode);
            expect(lGraph.branchRoot).to.equal(lGraph);
            expect(lGraph.required).to.be.true;
            expect(lGraph.identifier).to.equal('Name');
        });

        it('-- Create with chaining optional branch named', () => {
            // Setup.
            const lAnonymousNode: AnonymousGrammarNode<string> = new AnonymousGrammarNode<string>();

            // Process.
            const lGraph: BaseGrammarNode<string> = lAnonymousNode.optionalBranch('Name', ['Value']);

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarBranchNode);
            expect(lGraph.branchRoot).to.equal(lGraph);
            expect(lGraph.required).to.be.false;
            expect(lGraph.identifier).to.equal('Name');
        });

        it('-- Create with chaining loop named', () => {
            // Setup.
            const lAnonymousNode: AnonymousGrammarNode<string> = new AnonymousGrammarNode<string>();

            // Process.
            const lGraph: BaseGrammarNode<string> = lAnonymousNode.loop('Name', 'Value');

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarLoopNode);
            expect(lGraph.branchRoot).to.equal(lGraph);
            expect(lGraph.required).to.be.false;
            expect(lGraph.identifier).to.equal('Name');
        });

        describe('-- Errors', () => {
            it('-- Anonymous node next', () => {
                // Setup.
                const lAnonymousNode: AnonymousGrammarNode<string> = new AnonymousGrammarNode<string>();

                // Process.
                const lErrorFunction = () => {
                    lAnonymousNode.next();
                };

                // Evaluation.
                expect(lErrorFunction).to.throw(Exception);
            });

            it('-- Anonymous node values', () => {
                // Setup.
                const lAnonymousNode: AnonymousGrammarNode<string> = new AnonymousGrammarNode<string>();

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