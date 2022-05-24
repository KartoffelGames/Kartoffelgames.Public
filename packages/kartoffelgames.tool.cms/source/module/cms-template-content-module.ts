import { XmlElement } from '@kartoffelgames/core.xml';
import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { ComponentScopeExecutor, LayerValues, ModuleAttributeReference, ModuleLayerValuesReference, MultiplicatorResult, PwbMultiplicatorAttributeModule } from '@kartoffelgames/web.potato-web-builder';
import { IPwbMultiplicatorModuleOnUpdate } from '@kartoffelgames/web.potato-web-builder/library/source/module/interface/module';
import { CmsElementData } from '../type';

@PwbMultiplicatorAttributeModule({
    selector: /^\*cmsTemplateContent$/
})
export class CmsTemplateContenModule implements IPwbMultiplicatorModuleOnUpdate {
    private readonly mCompareHandler: CompareHandler<any>;
    private readonly mDataExpression: string;
    private readonly mLayerValues: LayerValues;

    /**
     * Constructor
     * @param pAttributeReference - Attribute reference.
     * @param pTemplateReference - Template reference.
     */
    public constructor(pAttributeReference: ModuleAttributeReference, pValueReference: ModuleLayerValuesReference) {
        this.mDataExpression = pAttributeReference.value.value;
        this.mLayerValues = pValueReference.value;
        this.mCompareHandler = new CompareHandler(Symbol('Uncompareable'), 4);
    }

    /**
     * On update. Replace current template with list of elements.
     */
    public onUpdate(): MultiplicatorResult | null {
        // Read element data from data expression.
        const lElementData: Array<CmsElementData> = ComponentScopeExecutor.executeSilent(this.mDataExpression, this.mLayerValues);

        // Optimize by checking data with CompareHandler.
        // Skip when values are the same.
        if (this.mCompareHandler.compareAndUpdate(lElementData)) {
            return null;
        }

        // Create all elements from element data and add those to current template childs.
        const lResult: MultiplicatorResult = new MultiplicatorResult();
        for (const lContentData of lElementData) {
            // Create new value layer.
            const lData: LayerValues = new LayerValues(this.mLayerValues);

            // Create element with element selector as tagname.
            const lElement: XmlElement = new XmlElement();
            lElement.tagName = lContentData.element;

            // Add data as layer value and bind to element.
            lData.setLayerValue('data', lContentData.data);
            lElement.setAttribute('[data]', 'data');

            // Add style as layer value and bind to element.
            lData.setLayerValue('style', lContentData.data);
            lElement.setAttribute('[style]', 'style');

            console.log(lContentData);

            // Add element and layer values to results.
            lResult.addElement(lElement, lData);
        }

        return lResult;
    }

}