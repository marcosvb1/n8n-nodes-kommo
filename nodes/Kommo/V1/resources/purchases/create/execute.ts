import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../../transport';
import { makeCustomFieldReqObject } from '../../_components/CustomFieldsDescription';
import { makeInvoiceItemsReqObject, IInvoiceItemsForm } from '../model';

interface IPurchaseForm {
	name: string;
	invoice_items?: IInvoiceItemsForm;
	custom_fields_values?: any;
	request_id?: string;
    buyer?: {
        buyer?: {
            entity_type?: 'contacts';
            mode: 'id' | 'name';
            entity_id?: number;
            contact_name?: string;
            title?: string;
        }
    };
}

export async function execute(this: IExecuteFunctions, index: number): Promise<any> {
    const jsonParams = (await this.getNodeParameter('json', 0)) as boolean;
    const catalog_id = this.getNodeParameter('catalog_id', index) as string;

    if (jsonParams) {
        const jsonString = (await this.getNodeParameter('jsonString', 0)) as string;
        const endpoint = `catalogs/${catalog_id}/elements`;
        return await apiRequest.call(this, 'POST', endpoint, JSON.parse(jsonString));
    }

    const elements = (this.getNodeParameter('collection.element', index, []) as IPurchaseForm[]) || [];

    const body: any = [];

    for (const element of elements) {
        const purchaseData: any = {
            name: element.name,
        };

        // Buyer handling: allow by contact ID or by contact Name
        const buyerBlock = element?.buyer?.buyer;
        if (buyerBlock) {
            if (buyerBlock.mode === 'id' && buyerBlock.entity_id) {
                purchaseData._embedded = purchaseData._embedded || {};
                const entityType = buyerBlock.entity_type || 'contacts';
                purchaseData._embedded[entityType] = [ { id: buyerBlock.entity_id } ];
            } else if (buyerBlock.mode === 'name' && buyerBlock.title) {
                // When not linking to a contact, use Title as purchase name
                purchaseData.name = buyerBlock.title;
            }
        }

        if (element.invoice_items?.invoice_item?.length) {
            const invoiceItems = makeInvoiceItemsReqObject(element.invoice_items);

            if (invoiceItems.length > 0) {
                purchaseData.custom_fields_values = purchaseData.custom_fields_values || [];

                purchaseData.custom_fields_values.push({
                    field_code: 'items',
                    values: [{ value: invoiceItems }]
                });
            }
        }

        if (element.custom_fields_values) {
            const customFields = makeCustomFieldReqObject(element.custom_fields_values);
            if (customFields.length > 0) {
                purchaseData.custom_fields_values = [
                    ...(purchaseData.custom_fields_values || []),
                    ...customFields
                ];
            }
        }

        if (element.request_id) {
            purchaseData.request_id = element.request_id;
        }

        body.push(purchaseData);
    }

    const endpoint = `catalogs/${catalog_id}/elements`;
    return await apiRequest.call(this, 'POST', endpoint, body);
}
