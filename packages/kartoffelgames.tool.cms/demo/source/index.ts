import { CmsApp } from '../../source/cms-app';
import { CmsElement } from '../../source/cms-element/cms-element';
import { PwbCmsElement } from '../../source/cms-element/pwb-cms-element.decorator';

@PwbCmsElement({
    selector: 'my-heading-element',
    componentTemplate: `
    <h1 *pwbIf="this.data.headingType === 'h1'" >{{this.data.text}}</h1>
    <h2 *pwbIf="this.data.headingType === 'h2'" >{{this.data.text}}</h2>
    <h3 *pwbIf="this.data.headingType === 'h3'" >{{this.data.text}}</h3>
    `,
    formularTemplate: `
    <select [(value)]="this.data.headingType">
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
    </select>
    <input [(value)]="this.data.text" />
    `
})
class MyHeadingElement extends CmsElement<MyHeadingElementData>{
    public constructor() {
        super();
        this.data.headingType = 'h1';
        this.data.text = 'My Cool Heading';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const lApp = new CmsApp('CMS-App');
    lApp.addMenuItem('Main', 'Heading', MyHeadingElement);
    lApp.addMenuItem('Main', 'Heading H2', MyHeadingElement, { headingType: 'h2', text: 'This is a H2' });
    lApp.appendTo(document.body);
});

type MyHeadingElementData = {
    headingType: 'h1' | 'h2' | 'h3';
    text: string;
};
