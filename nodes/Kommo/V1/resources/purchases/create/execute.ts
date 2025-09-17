import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../../transport';
import { makeCustomFieldReqObject } from '../../_components/CustomFieldsDescription';
import { makeInvoiceItemsReqObject, IInvoiceItemsForm } from '../model';

interface IPurchaseForm {
	name: string;
	invoice_items?: IInvoiceItemsForm;
	custom_fields_values?: any;
	request_id?: string;
}

export async function execute(this: IExecuteFunctions, index: number): Promise<any> {
	const catalog_id = this.getNodeParameter('catalog_id', index) as string;
	const elements = (this.getNodeParameter('collection.element', index, []) as IPurchaseForm[]) || [];

	const body: any = [];

	for (const element of elements) {
		const purchaseData: any = {
			name: element.name,
		};

		// Handle invoice items - convert to proper format for API
		if (element.invoice_items?.invoice_item?.length) {
			const invoiceItems = makeInvoiceItemsReqObject(element.invoice_items);

			// In Kommo API, invoice items are stored as custom field value
			// Find the invoice_items custom field and add the data
			if (invoiceItems.length > 0) {
				purchaseData.custom_fields_values = purchaseData.custom_fields_values || [];

				// Note: This assumes there's a custom field of type 'items' for invoice items
				// In practice, you might need to get the field ID from the catalog custom fields
				purchaseData.custom_fields_values.push({
					field_code: 'invoice_items', // or use field_id if known
					values: [{ value: invoiceItems }]
				});
			}
		}

		// Handle other custom fields
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