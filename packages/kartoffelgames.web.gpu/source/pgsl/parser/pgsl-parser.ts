import { CodeParser } from '@kartoffelgames/core.parser';
import { PgslToken } from './pgsl-token.enum';
import { PgslDocument } from '../pgsl-document';
import { PgslLexer } from './pgsl-lexer';

export class PgslParser extends CodeParser<PgslToken, PgslDocument> {
    /**
     * Constructor.
     */
    public constructor() {
        super(new PgslLexer());

        /* TODO:
            Split var declarations into seperate 
                var<private> => private 
                var<workgroup> => workgroupvalue???
                var<storage> => storage (how to read write?)
                var<uniform> => uniform
                var<function> => var
        */

        /* TODO:
           @group(x) @binging(y) => @groupBinding(x, y)
        */
    }

    private defineCore(): void {
        // Block. Can be a standalone inside function scope.
        //      { <statement>;* }

        // Attribute statement.
        //      @<ident>(<expression>,*)
    }

    private defineExpression(): void {
        // Compound statement
        //      <block>

        // Variable expression
        //      <ident>

        // Parenthesized Expressions
        //      (<expression>)

        // Composite Value Decomposition Expressions
        //      value[1]
        //      something.other
        //      vec3<f32>(1., 2., 3.).xyz
        //          => Maybe <expression>[x] and <expression>.prop
        //      enum.value ?? How to distinct

        // Logical Expressions
        //      !<expression>
        //      <expression> || <expression>
        //      <expression> && <expression>
        //      <expression> | <expression>
        //      <expression> & <expression>

        // Arithmetic Expressions
        //      -<expression>
        //      <expression> + <expression>
        //      <expression> - <expression>
        //      <expression> * <expression>
        //      <expression> / <expression>
        //      <expression> % <expression>

        // Comparison Expressions
        //      <expression> == <expression>
        //      <expression> != <expression>
        //      <expression> < <expression>
        //      <expression> <= <expression>
        //      <expression> > <expression>
        //      <expression> >= <expression>

        // Bit Expressions
        //      ~<expression>
        //      <expression> | <expression>
        //      <expression> & <expression>
        //      <expression> ^ <expression>
        //      <expression> << <expression>
        //      <expression> >> <expression>

        // Function call => Value used
        //      <ident><templateList>(<expression>,*)

        // AddressOf expression
        //      &<ident>

        // Pointer expression
        //      *<ident>
    }

    private defineFlow(): void {
        // If Statement
        //      if(<expression>)<block> 
        //      else if(<expression>)<block> *
        //      else <block> *

        // Switch Statement
        //      switch(<expression>){<case>|<default>}
        //      case <expression>,+: <block> *
        //      default <expression>: <block> ?

        // For-Loop
        //      for(<declaration>?;<expression>;<expression>)<block>

        // While-Loop
        //      while(<expression>)<block>

        // Do-While
        //      do <block> while(<expression>);

        // Break
        //      break;

        // Continue 
        //      continue;

        // Return 
        //      return <expression>?;

        // Discard 
        //      discard;
    }

    private defineFunctionScope(): void {
        // declaration expression.
        //      var <ident>: <ident>;
        //      var <ident>: <ident> = <expression>;

        // Assignment Statement
        //      <ident> = <expression>;
        //      _ = <expression>; //  phony assignment  ??? Eval or drop.
        //      <ident> += <expression>;
        //      <ident> -= <expression>;
        //      <ident> *= <expression>;
        //      <ident> |= <expression>;
        //      <ident> %= <expression>;
        //      <ident> &= <expression>;
        //      <ident> |= <expression>;
        //      <ident> ^= <expression>;
        //      <ident> >>= <expression>;
        //      <ident> <<= <expression>;
        //      Composite Value Decomposition Expressions 
        //          val.prop += 1
        //          val[x] += 1

        // Increment and Decrement Statements
        //      <ident>++;
        //      <ident>--;
        //      Composite Value Decomposition Expressions 
        //          val.prop++
        //          val[x]++

        // Function call statement. Same as function call expression but without value.
        //       <ident><templateList>(<expression>,*)
    }

    private defineModuleScope(): void {
        type PgslModuleScopeDeclarationGraphData = {
            attributes: Array<1>
        };
        this.defineGraphPart('ModuleScopeDeclaration',
            this.graph().loop('attributes', this.partReference('Attribute')),
            // TODO:
            (_pData: PgslModuleScopeDeclarationGraphData) => {

            }
        );

        // Enums => TODO: all of it
        // Structs . Dont forgett <paramlist>

        // Function flow
        //      <paramlist> function <ident>(<paramlist> ident:type,*): <paramlist> type? <block>

        // alias => type xxx = array<i32>

        // const expression.
        //      const <ident>: type = <expression>;

        // override expression.
        //      <paramlist> override <ident>: type = <expression>;
    }

    private defineRoot(): void {
        type PgslDocumentGraphData = {
            // TODO: Something.
        };
        this.defineGraphPart('document',
            this.graph(),
            (_pData: PgslDocumentGraphData) => {

            }
        );

        // Define root part.
        this.setRootGraphPart('document');
    }
}