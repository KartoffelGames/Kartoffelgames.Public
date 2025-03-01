/*
 * Generate Token chains from Object on startup.
 * Generate result type from object. I dont know if this is possible.
 * Reference parts with generated parts. How is it possible to cross reference???
 * Own placeholder function for Self reference to generate good types.
 * 
 * Should loops be possible? How is it possible to generate a loop without a actual loop but to return a array of values?? 
 */

/*
 * Dont use string names to reference lexer templates. Use the object reference.
 * Loops should not be possible.
 */

// How to stop the formater from doing its job?

const lContentGrapth = '... lParser.defineGraphPart(';

// Process.
const lXmlAttribute = lParser.defineGraphPart([
    XmlToken.OpenBracket,
    { '?openingNamespace': [ // ? => Optional
        { 'name': XmlToken.Identifier },
        XmlToken.NamespaceDelimiter
    ]},
    { 'openingTagName': XmlToken.Identifier },
    { '$attributes': Graph.SELF }, // $ => Loop, "SELF" => Reference to the current graph part
    { '#ending': [ // # => Branch
        { '': XmlToken.CloseClosingBracket },
        { '': [
            XmlToken.CloseBracket,
            { 'values': lContentGrapth },
            XmlToken.OpenClosingBracket,
            {
                '?closingNamespace': [ // ? => Optional
                    { 'name': XmlToken.Identifier },
                    XmlToken.NamespaceDelimiter
                ]
            },
            { 'closingTageName': XmlToken.Identifier },
            XmlToken.CloseBracket
        ]}
    ]}
]);