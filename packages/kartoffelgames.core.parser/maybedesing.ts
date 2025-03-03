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


declare class GraphReference<TTokenType extends string, TGraph extends Graph<TTokenType, Array<any>>> { }


type GraphNodeKeySingleNamed = string;
type GraphNodeKeySingleUnnamed = '';
type GraphNodeKeyOptionalNamed = `?${string}`;
type GraphNodeKeyOptionalUnnamed = '?';
type GraphNodeKeyBranchNamed = `#${string}`;
type GraphNodeKeyBranchUnnamed = '#';

type GraphNodeKey = GraphNodeKeySingleNamed | GraphNodeKeySingleUnnamed | GraphNodeKeyOptionalNamed | GraphNodeKeyOptionalUnnamed | GraphNodeKeyBranchNamed | GraphNodeKeyBranchUnnamed;

type GraphNodeSingleNamed<TTokenType extends string, TName extends GraphNodeKeySingleNamed, TValue extends GraphNodeValue<TTokenType, unknown>> = [TName, TValue];
type GraphNodeSingleUnnamed<TTokenType extends string, TName extends GraphNodeKeySingleUnnamed, TValue extends GraphNodeValue<TTokenType, unknown>> = [TName, TValue];
type GraphNodeOptionalNamed<TTokenType extends string, TName extends GraphNodeKeyOptionalNamed, TValue extends GraphNodeValue<TTokenType, unknown>> = [TName, TValue];
type GraphNodeOptionalUnnamed<TTokenType extends string, TName extends GraphNodeKeyOptionalUnnamed, TValue extends GraphNodeValue<TTokenType, unknown>> = [TName, TValue];
type GraphNodeBranchNamed<TTokenType extends string, TName extends GraphNodeKeyBranchNamed, TValue extends GraphNodeValue<TTokenType, unknown>> = [TName, TValue];
type GraphNodeBranchUnnamed<TTokenType extends string, TName extends GraphNodeKeyBranchUnnamed, TValue extends GraphNodeValue<TTokenType, unknown>> = [TName, TValue];

type GraphNodeValue<TTokenType extends string, TValue> =
    TValue extends GraphValue<TTokenType, GraphNodeKey, any> ? TValue :
    TValue extends GraphReference<TTokenType, infer T> ? T :
    TValue extends Graph<TTokenType, any> ? TValue :
    TTokenType;

type GraphValue<TTokenType extends string, TKey extends GraphNodeKey, TValue extends GraphNodeValue<TTokenType, unknown>> =
    TKey extends GraphNodeKeySingleUnnamed ? GraphNodeSingleUnnamed<TTokenType, TKey, TValue> :
    TKey extends GraphNodeKeyOptionalUnnamed ? GraphNodeOptionalUnnamed<TTokenType, TKey, TValue> :
    TKey extends GraphNodeKeyBranchUnnamed ? GraphNodeBranchUnnamed<TTokenType, TKey, TValue> :
    TKey extends GraphNodeKeyOptionalNamed ? GraphNodeOptionalNamed<TTokenType, TKey, TValue> :
    TKey extends GraphNodeKeyBranchNamed ? GraphNodeBranchNamed<TTokenType, TKey, TValue> :
    TKey extends GraphNodeKeySingleNamed ? GraphNodeSingleNamed<TTokenType, TKey, TValue> :
    never;

type Graph<TTokenType extends string, TValues extends Array<GraphValue<TTokenType, GraphNodeKey, GraphNodeValue<TTokenType, unknown>>>> = TValues; // TODO:???

type GrapthResult<TTokenType extends string, TGraphValue extends Graph<TTokenType, any> | GraphValue<TTokenType, any, any> | TTokenType, TRoot extends object = {}> =
    TGraphValue extends Graph<TTokenType, infer TValues> ? (
        TValues // TODO: 
    ) :
    TGraphValue extends GraphValue<TTokenType, infer TGraphNodeKey, infer TGraphNodeValue> ? (
        TGraphNodeKey extends GraphNodeKeySingleUnnamed ? TRoot & GrapthResult<TTokenType, TGraphNodeValue> :
        TGraphNodeKey extends GraphNodeKeyOptionalUnnamed ? TRoot & GrapthResult<TTokenType, TGraphNodeValue> :
        TGraphNodeKey extends GraphNodeKeyBranchUnnamed ? TRoot & GrapthResult<TTokenType, TGraphNodeValue> :
        TGraphNodeKey extends GraphNodeKeyOptionalNamed ? TRoot & { [x in TGraphNodeKey]?: GrapthResult<TTokenType, TGraphNodeValue> } :
        TGraphNodeKey extends GraphNodeKeyBranchNamed ? GraphNodeBranchNamed<TTokenType, TKey, TValue> :
        TGraphNodeKey extends GraphNodeKeySingleNamed ? TRoot & { [x in TGraphNodeKey]: GrapthResult<TTokenType, TGraphNodeValue> } :
        never
    ) : never;


declare class GraphBuilder<TTokenType extends string, TCurrentGraph extends Array<GraphValue<TTokenType, GraphNodeKey, any>> = []> {
    public result: Graph<TTokenType, TCurrentGraph>;

    public single<TKey extends string, TValue extends TTokenType>(pKey: TKey, pValue: TValue): GraphBuilder<TTokenType, [...TCurrentGraph, GraphNodeSingleNamed<TTokenType, TKey, TValue>]>;
    public single<TValue extends TTokenType>(pValue: TValue): GraphBuilder<TTokenType, [...TCurrentGraph, GraphNodeSingleUnnamed<TTokenType, GraphNodeKeySingleUnnamed, TValue>]>;

    public optional<TKey extends string, TValue extends TTokenType>(pKey: TKey, pValue: TValue): GraphBuilder<TTokenType, [...TCurrentGraph, GraphNodeOptionalNamed<TTokenType, `?${TKey}`, TValue>]>;
    public optional<TValue extends TTokenType>(pValue: TValue): GraphBuilder<TTokenType, [...TCurrentGraph, GraphNodeOptionalUnnamed<TTokenType, GraphNodeKeyOptionalUnnamed, TValue>]>;
}


const lBuilder = new GraphBuilder<XmlToken>();

const lMyGraph = lBuilder
    .single(`test`, XmlToken.OpenBracket)
    .single(XmlToken.OpenBracket)
    .optional(XmlToken.CloseBracket)
    .optional('test2', XmlToken.Identifier)
    .result;

// TODO: I might be ready to start prototyping. Dont forget to use the type shitting from BaseGrammarNode.



declare class Parser<TTokenType extends string> {

    public graphNode<const TNode extends GraphValue<TTokenType, GraphNodeKey, GraphNodeValue<TTokenType, any>>>(pRes: TNode): TNode;

    public graph<const TGraph extends Graph<TTokenType, Array<any>>>(pGraph: TGraph): TGraph;

    public graphRef<const TGraph extends Graph<TTokenType, Array<any>>>(pGraph: TGraph): GraphReference<TTokenType, TGraph>;

}

const lParser = new Parser<XmlToken>();

const nodeA = lParser.graphNode([``, XmlToken.OpenBracket]);
const nodeB = lParser.graphNode([`asas`, XmlToken.OpenBracket]);
const nodeC = lParser.graphNode([`?`, XmlToken.OpenBracket]);
const nodeD = lParser.graphNode([`?asas`, XmlToken.OpenBracket]);
const nodeE = lParser.graphNode([`#`, XmlToken.OpenBracket]);
const nodeF = lParser.graphNode([`#asas`, XmlToken.OpenBracket]);
const nodeG = lParser.graphNode([`#asas`, [``, [`?asas`, [``, XmlToken.OpenBracket]]]]);
const nodeH = lParser.graphNode([`_`, XmlToken.OpenBracket]);
const nodeI = lParser.graphNode([`#asas`, [``, 111]]); // Should fail

const graphA = lParser.graph([
    [``, XmlToken.OpenBracket]
]);
const graphARef = lParser.graphRef(graphA);

const graphB = lParser.graph([
    XmlToken.OpenBracket,
    ['?openingNamespace', [ // ? => Optional
        ['name', XmlToken.Identifier],
        XmlToken.NamespaceDelimiter,
    ]],
    ['openingTagName', XmlToken.Identifier],
    ['$attributes', graphARef], // $ => Loop, "SELF" => Reference to the current graph part
    ['#ending', [ // # => Branch
        ['', XmlToken.CloseClosingBracket],
        ['', [
            XmlToken.CloseBracket,
            ['values',],
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
const graphBRef = lParser.graphRef(graphB);