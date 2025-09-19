import { INodeProperties } from 'n8n-workflow';
import { addCustomFieldDescription } from '../_components/CustomFieldsDescription';

// Invoice item interfaces
export interface IInvoiceItem {
	catalog_element_id: number;
	quantity: number;
	unit_price: number;
	discount?: number;
	unit_type?: string;
}

export interface IInvoiceItemForm {
	catalog_element_id: string;
	quantity: number;
	unit_price: number;
	discount: number;
	unit_type: string;
}

export interface IInvoiceItemsForm {
	invoice_item: Array<IInvoiceItemForm>;
}

// Invoice items UI component
export const addInvoiceItemsDescription = (): INodeProperties => {
	return {
		displayName: 'Invoice Items',
		name: 'invoice_items',
		placeholder: 'Add Invoice Item',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				displayName: 'Invoice Item',
				name: 'invoice_item',
				values: [
					{
                        displayName: 'Product Name or ID',
						name: 'catalog_element_id',
						type: 'options',
						typeOptions: {
                            loadOptionsMethod: 'getPurchaseProducts',
						},
						default: '',
						required: true,
						description: 'Select the product for this invoice item. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						default: 1,
						required: true,
						description: 'Quantity of the product',
						typeOptions: {
							minValue: 0,
							numberPrecision: 2,
						},
					},
					{
						displayName: 'Unit Price',
						name: 'unit_price',
						type: 'number',
						default: 0,
						required: true,
						description: 'Unit price of the product',
						typeOptions: {
							minValue: 0,
							numberPrecision: 2,
						},
					},
					{
						displayName: 'Discount',
						name: 'discount',
						type: 'number',
						default: 0,
						description: 'Discount amount',
						typeOptions: {
							minValue: 0,
							numberPrecision: 2,
						},
					},
					{
						displayName: 'Unit Type',
						name: 'unit_type',
						type: 'string',
						default: 'pcs',
						description: 'Unit of measurement (e.g., pcs, kg, hours)',
					},
				],
			},
		],
	};
};

// Purchase model description
export const purchaseModelDescription: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		default: 0,
		required: true,
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Name of the purchase',
	},
	{
		displayName: 'Buyer',
		name: 'buyer',
		type: 'fixedCollection',
		default: {},
		options: [
			{
				displayName: 'Buyer',
				name: 'buyer',
				values: [
					{
						displayName: 'Buyer Type',
						name: 'mode',
						type: 'options',
						default: 'id',
						options: [
							{ name: 'Contact (ID)', value: 'id' },
							{ name: 'Name (Title)', value: 'name' },
						],
					},
					{
						displayName: 'Entity ID',
						name: 'entity_id',
						type: 'number',
						default: 0,
						displayOptions: {
							show: { mode: ['id'] },
						},
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						required: true,
						description: 'Buyer name to use when not linking to a contact',
						displayOptions: {
							show: { mode: ['name'] },
						},
					},
				],
			},
		],
	},
	addInvoiceItemsDescription(),
	addCustomFieldDescription('getPurchaseCatalogCustomFields'),
];

// Helper function to convert invoice items form to API format
export const makeInvoiceItemsReqObject = (invoiceItemsForm: IInvoiceItemsForm): IInvoiceItem[] => {
	return invoiceItemsForm.invoice_item?.map((item) => ({
		catalog_element_id: parseInt(item.catalog_element_id, 10),
		quantity: item.quantity,
		unit_price: item.unit_price,
		discount: item.discount || 0,
		unit_type: item.unit_type || 'pcs',
	})) || [];
};
