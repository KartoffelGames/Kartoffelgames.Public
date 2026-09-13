/**
 * Every benchmark input of the xml parser.
 *
 * The small and medium input are hardcoded documents, because their value lies in their exact
 * shape. Every input of the full benchmark is generated, because a hardcoded 50 MB document
 * would neither be readable nor storable.
 * Keeping every input in one place makes the three benchmark files differ in their input only.
 *
 * Two lexer rules constrain every generated document. Only space and newline are valid
 * whitespace, so no tab or carriage return may be emitted. Text content is matched by
 * `[^<>"]+`, so no text may contain a quote.
 */
export class BenchmarkSource {
    /**
     * Smallest input that still produces a complete document.
     * One root node with one child node.
     */
    public static readonly SMALL: string = `<root>
    <child>Text content</child>
</root>`;

    /**
     * Everyday sized input.
     *
     * One shallow nested document of roughly 20 elements that uses every construct a normal
     * document is built from: a default namespace, prefixed namespaces, prefixed attributes,
     * value less attributes, self closing tags, comments and text content.
     */
    public static readonly MEDIUM: string = `<!-- Application layout. -->
<application xmlns="urn:kartoffelgames:layout" xmlns:ui="urn:kartoffelgames:ui" xmlns:data="urn:kartoffelgames:data" version="2.1" id="main-window">
    <head title="Dashboard" theme="dark" locale="en-us">
        <meta name="author" value="kartoffelgames" />
        <meta name="revision" value="184" />
        <meta name="generated" value="2026-01-01" />
    </head>

    <!-- Toolbar with a data bound item source. -->
    <ui:toolbar id="top-bar" data:source="toolbar.items" data:track="item.id" collapsed>
        <ui:button id="new" icon="plus" ui:tooltip="Create a new entry">New</ui:button>
        <ui:button id="open" icon="folder" ui:tooltip="Open an existing entry">Open</ui:button>
        <ui:button id="save" icon="disk" ui:tooltip="Save the current entry" disabled>Save</ui:button>
        <ui:separator />
        <ui:button id="help" icon="question">Help</ui:button>
    </ui:toolbar>

    <content id="body" layout="split" ratio="0.35">
        <ui:panel id="navigation" title="Projects" data:source="project.list">
            <ui:list id="project-list" data:item="project" selection="single">
                <ui:entry value="alpha" icon="cube">Project Alpha</ui:entry>
                <ui:entry value="beta" icon="cube">Project Beta</ui:entry>
                <ui:entry value="gamma" icon="cube" data:badge="3">Project Gamma</ui:entry>
            </ui:list>
        </ui:panel>

        <!-- Detail panel of the selected project. -->
        <ui:panel id="detail" title="Details" data:source="project.selected">
            <description>
                Every selected project shows its description, its owner and the date of the last change.
            </description>
            <field name="owner" type="text" data:bind="project.owner" readonly />
            <field name="changed" type="date" data:bind="project.changed" readonly />
            <field name="tags" type="list" data:bind="project.tags" />
        </ui:panel>
    </content>

    <footer id="status-bar" data:bind="status.text">Ready</footer>
</application>`;

    /**
     * One node with a lot of attributes.
     *
     * Every attribute is prefixed on every third position, so the namespace branch of the
     * attribute graph is taken as often as the plain branch.
     *
     * @param pAttributeCount - Count of attributes on the node.
     *
     * @returns Xml document of the attribute case.
     */
    public static attributes(pAttributeCount: number): string {
        const lAttributeList: Array<string> = new Array<string>();

        for (let lAttributeIndex: number = 0; lAttributeIndex < pAttributeCount; lAttributeIndex++) {
            // Every third attribute carries a namespace prefix.
            if (lAttributeIndex % 3 === 0) {
                lAttributeList.push(`data:attribute-${lAttributeIndex}="value-${lAttributeIndex}"`);
            } else {
                lAttributeList.push(`attribute-${lAttributeIndex}="value-${lAttributeIndex}"`);
            }
        }

        return `<root xmlns:data="urn:kartoffelgames:data" ${lAttributeList.join(' ')} />`;
    }

    /**
     * Document of roughly a target byte size.
     *
     * The size comes from text content and not from the element count, so this case measures
     * raw throughput on a huge document instead of measuring the sibling cost a second time.
     * Entries are chunked into groups, so no element ever gets an extreme sibling count.
     *
     * @param pTargetByteSize - Target size of the document in bytes.
     *
     * @returns Xml document of the file size case.
     */
    public static fileSize(pTargetByteSize: number): string {
        // Text block of one entry. Roughly four kilobyte.
        const lEntryText: string = 'lorem ipsum dolor sit amet consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore '.repeat(39);

        // Size of one rendered entry, used to calculate how many entries reach the target size.
        const lEntrySize: number = BenchmarkSource.fileSizeEntry(0, lEntryText).length;
        const lEntryCount: number = Math.ceil(pTargetByteSize / lEntrySize);

        // Chunk the entries into groups of hundred, so no sibling list gets extreme.
        const lGroupSize: number = 100;
        const lDocumentPartList: Array<string> = new Array<string>();

        lDocumentPartList.push('<archive xmlns="urn:kartoffelgames:archive">');

        for (let lEntryIndex: number = 0; lEntryIndex < lEntryCount; lEntryIndex++) {
            // Open a new group whenever the current group is full.
            if (lEntryIndex % lGroupSize === 0) {
                // Close the previous group first.
                if (lEntryIndex !== 0) {
                    lDocumentPartList.push('    </group>');
                }

                lDocumentPartList.push(`    <group index="${lEntryIndex / lGroupSize}">`);
            }

            lDocumentPartList.push(BenchmarkSource.fileSizeEntry(lEntryIndex, lEntryText));
        }

        // Close the last group and the root.
        lDocumentPartList.push('    </group>');
        lDocumentPartList.push('</archive>');

        return lDocumentPartList.join('\n');
    }

    /**
     * One root node with a lot of direct child nodes.
     *
     * Every child is a flat self closing node, so the cost of this case is the length of the
     * sibling list and never the depth or the content of a child.
     *
     * @param pChildCount - Count of direct children of the root node.
     *
     * @returns Xml document of the linear case.
     */
    public static linear(pChildCount: number): string {
        const lChildList: Array<string> = new Array<string>();

        for (let lChildIndex: number = 0; lChildIndex < pChildCount; lChildIndex++) {
            lChildList.push(`    <item index="${lChildIndex}" name="item-${lChildIndex}" />`);
        }

        return `<root>\n${lChildList.join('\n')}\n</root>`;
    }

    /**
     * One root node with a single chain of children.
     *
     * Every node holds exactly one child, so the cost of this case is the nesting depth and
     * never the length of a sibling list.
     *
     * @param pDepth - Depth of the child chain below the root node.
     *
     * @returns Xml document of the nested case.
     */
    public static nested(pDepth: number): string {
        const lOpeningList: Array<string> = new Array<string>();
        const lClosingList: Array<string> = new Array<string>();

        for (let lDepthIndex: number = 0; lDepthIndex < pDepth; lDepthIndex++) {
            lOpeningList.push('<node>');
            lClosingList.push('</node>');
        }

        return `<root>${lOpeningList.join('')}${lClosingList.join('')}</root>`;
    }

    /**
     * One entry of the file size document.
     *
     * @param pEntryIndex - Index of the entry.
     * @param pEntryText - Text content of the entry.
     *
     * @returns Xml of one file size entry.
     */
    private static fileSizeEntry(pEntryIndex: number, pEntryText: string): string {
        return `        <entry id="entry-${pEntryIndex}" index="${pEntryIndex}" type="document">${pEntryText}</entry>`;
    }
}
