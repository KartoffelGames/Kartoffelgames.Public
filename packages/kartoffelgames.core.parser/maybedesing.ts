/*
 * Generate Token chains from Object on startup.
 * Generate result type from object. I dont know if this is possible.
 * Reference parts with generated parts. How is it possible to cross reference???
 * Own placeholder function for Self reference to generate good types.
 * 
 * Should loops be possible? How is it possible to generate a loop without a actual loop but to return a array of values?? 
 */

enum XmlToken {
    OpenBracket = 'Open braket',
    CloseBracket = 'Close braket',
    Comment = 'Comment',
    OpenClosingBracket = 'Open closing braket',
    CloseClosingBracket = 'Close closing braket',
    Identifier = 'Identifier',
    Value = 'Value',
    Assignment = 'Assignment',
    NamespaceDelimiter = 'Namespace delimiter'
}

const lContentGrapth = '... lParser.defineGraphPart(';

// Process.
const lXmlAttributeGraph = defineGraphPart(() => {
    const lGraph = graph([
        XmlToken.OpenBracket,
        ['?openingNamespace', [ // ? => Optional
            ['name', XmlToken.Identifier],
            XmlToken.NamespaceDelimiter
        ]],
        ['openingTagName', XmlToken.Identifier],
        ['$attributes', lXmlAttributeGraph], // $ => Loop, "SELF" => Reference to the current graph part
        ['#ending', [ // # => Branch
            ['', XmlToken.CloseClosingBracket],
            ['', [
                XmlToken.CloseBracket,
                ['values', lContentGrapth],
                XmlToken.OpenClosingBracket,
                [
                    '?closingNamespace', [ // ? => Optional
                        ['name', XmlToken.Identifier],
                        XmlToken.NamespaceDelimiter
                    ]
                ],
                ['closingTageName', XmlToken.Identifier],
                XmlToken.CloseBracket
            ]]
        ]]
    ]);

    return lGraph;
}, (_pData) => {

});

declare class GraphReference<TGraph> { }
declare function graph<TGrapth extends Graph>(pGraph: TGrapth): TGrapth;
declare function defineGraphPart<TParts extends string | number, TGraph extends Graph<Array<Elem>>>(pGraphDefinition: () => TGraph, pResult: (pData: GrapthResult<TGraph>) => any): GraphReference<TGraph>;


type GraphKeySingleNamed = string;
type GraphKeySingleUnnamed = '';
type GraphKeyOptionalNamed = `?${string}`;
type GraphKeyOptionalUnnamed = '?';
type GraphKeyBranchNamed = `#${string}`;
type GraphKeyBranchUnnamed = '#';

type GraphKey = GraphKeySingleNamed | GraphKeySingleUnnamed | GraphKeyOptionalNamed | GraphKeyOptionalUnnamed | GraphKeyBranchNamed | GraphKeyBranchUnnamed;

type GraphUnnamed = string;
type GraphSingleNamed<TName extends GraphKeySingleNamed> = [TName, GraphValue | Graph];
type GraphSingleUnnamed<TName extends GraphKeySingleUnnamed> = [TName, GraphValue | Graph];
type GraphOptionalNamed<TName extends GraphKeyOptionalNamed> = [TName, GraphValue | Graph];
type GraphOptionalUnnamed<TName extends GraphKeyOptionalUnnamed> = [TName, GraphValue | Graph];
type GraphBranchNamed<TName extends GraphKeyBranchNamed> = [TName, GraphValue | Graph];
type GraphBranchUnnamed<TName extends GraphKeyBranchUnnamed> = [TName, GraphValue | Graph];


type GraphValue<TWhat> = TWhat extends GraphKeySingleNamed ? GraphSingleNamed<TWhat> :
    TWhat extends GraphKeySingleUnnamed ? GraphSingleUnnamed<TWhat> :
    TWhat extends GraphKeyOptionalNamed ? GraphOptionalNamed<TWhat> :
    TWhat extends GraphKeyOptionalUnnamed ? GraphOptionalUnnamed<TWhat> :
    TWhat extends GraphKeyBranchNamed ? GraphBranchNamed<TWhat> :
    TWhat extends GraphKeyBranchUnnamed ? GraphBranchUnnamed<TWhat> :
    GraphReference | GraphUnnamed;


type Graph<TKeys extends Array<GraphKey>> = Array<GraphValue<TKeys[number]>>;


type GrapthResult<T extends Graph> = any;











type GraphTuble<TName extends string, TValue extends any> = [TName, TValue];

type GraphTubleExtractKey<T extends GraphTuble<string, any>> = T[0] extends GraphTuble<infer V, any> ? V : never;
type GraphTubleExtractValue<T extends GraphTuble<string, any>> = T[1] extends GraphTuble<string, infer V> ? V : never;


const a: GraphTuble = ['aaa', XmlToken.CloseClosingBracket] as const;

const b: GraphTubleExtractKey<typeof a> = 'aaa';
const c: GraphTubleExtractValue<typeof a> = 'aaa';

const x = tuplify(['aaa', XmlToken.CloseClosingBracket]);

declare function tuplify<TKey extends string, TValue>(ary: [TKey, TValue]): GraphTuble<TKey, TValue>;