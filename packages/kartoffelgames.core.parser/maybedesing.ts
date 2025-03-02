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

declare function defineGraphPart<TGraph>(pGraphDefinition: () => TGraph, pResult: (pData: GrapthResult<TGraph>) => any): TGraph extends Graph<any, any, any> ? GraphReference<TGraph> : never;

declare function graph<TParts extends Array<GraphNodeKey>, TValues, TTokenType extends string, TGraph extends Graph<TParts, TValues, TTokenType>>(pGraph: TGraph): TGraph;
type GrapthResult<T extends Graph> = any;






type GraphNodeKeyUnnamed = never;
type GraphNodeKeySingleNamed = string;
type GraphNodeKeySingleUnnamed = '';
type GraphNodeKeyOptionalNamed = `?${string}`;
type GraphNodeKeyOptionalUnnamed = '?';
type GraphNodeKeyBranchNamed = `#${string}`;
type GraphNodeKeyBranchUnnamed = '#';

type GraphNodeKey = GraphNodeKeyUnnamed | GraphNodeKeySingleNamed | GraphNodeKeySingleUnnamed | GraphNodeKeyOptionalNamed | GraphNodeKeyOptionalUnnamed | GraphNodeKeyBranchNamed | GraphNodeKeyBranchUnnamed;

type GraphNodeUnnamed<TTokenType extends string> = TTokenType;
type GraphNodeSingleNamed<TTokenType extends string,TName extends GraphNodeKeySingleNamed, TValue> = [TName, GraphNodeValue<TTokenType, TValue>];
type GraphNodeSingleUnnamed<TTokenType extends string,TName extends GraphNodeKeySingleUnnamed, TValue> = [TName, GraphNodeValue<TTokenType, TValue>];
type GraphNodeOptionalNamed<TTokenType extends string,TName extends GraphNodeKeyOptionalNamed, TValue> = [TName, GraphNodeValue<TTokenType, TValue>];
type GraphNodeOptionalUnnamed<TTokenType extends string,TName extends GraphNodeKeyOptionalUnnamed, TValue> = [TName, GraphNodeValue<TTokenType, TValue>];
type GraphNodeBranchNamed<TTokenType extends string,TName extends GraphNodeKeyBranchNamed, TValue> = [TName, GraphNodeValue<TTokenType, TValue>];
type GraphNodeBranchUnnamed<TTokenType extends string,TName extends GraphNodeKeyBranchUnnamed, TValue> = [TName, GraphNodeValue<TTokenType, TValue>];

type GraphNodeValue<TTokenType extends string, TValue> =
    TValue extends GraphValue<infer TInnerKey, infer TInnerValue, TTokenType> ? GraphValue<TInnerKey, TInnerValue, TTokenType> :
    TValue extends GraphReference<infer T> ? (T extends Graph<TTokenType, Array<GraphNodeKey>, any> ? T : never) :
    GraphNodeUnnamed<TTokenType>;

type GraphValue<TTokenType extends string, TKey, TValue> =
    TKey extends GraphNodeKeySingleUnnamed ? GraphNodeSingleUnnamed<TTokenType, TKey, TValue> :
    TKey extends GraphNodeKeyOptionalUnnamed ? GraphNodeOptionalUnnamed<TTokenType, TKey, TValue> :
    TKey extends GraphNodeKeyBranchUnnamed ? GraphNodeBranchUnnamed<TTokenType, TKey, TValue> :
    TKey extends GraphNodeKeyOptionalNamed ? GraphNodeOptionalNamed<TTokenType, TKey, TValue> :
    TKey extends GraphNodeKeyBranchNamed ? GraphNodeBranchNamed<TTokenType, TKey, TValue> :
    TKey extends GraphNodeKeySingleNamed ? GraphNodeSingleNamed<TTokenType, TKey, TValue> :
    TTokenType;

type Graph<TTokenType extends string, TValues extends Array<GraphValue<TTokenType, >>> = TValues;
//Array<GraphValue<TKeys[number], TValue, TTokenType>>;




declare class Parser<TTokenType extends string> {
    public testa<TKey, TValue>(pRes: GraphValue<TTokenType, TKey, TValue>): GraphValue<TTokenType, TKey, TValue>;
}

const lParser = new Parser<XmlToken>();

const nodeA = lParser.testa([``, XmlToken.OpenBracket])
const nodeB = lParser.testa([`asas`, XmlToken.OpenBracket]);
const nodeC = lParser.testa([`?`, XmlToken.OpenBracket]);
const nodeD = lParser.testa([`?asas`, XmlToken.OpenBracket]);
const nodeE = lParser.testa([`#`, XmlToken.OpenBracket]);
const nodeF = lParser.testa([`#asas`, XmlToken.OpenBracket]);
const nodeG = lParser.testa(XmlToken.OpenBracket);
