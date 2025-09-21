import { INodeProperties } from 'n8n-workflow';

// Invoice item interfaces
export interface IInvoiceItem {
    catalog_element_id?: number;
    quantity: number;
    unit_price: number;
    unit_type?: string;
    // discount will be mapped to { type: 'amount' | 'percent', value: number }
    discount?: number;
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
];

// Helper function to convert invoice items form to API format
// Baseado nos testes: campo items aceita objeto único, não array
export const makeInvoiceItemsReqObject = (invoiceItemsForm: IInvoiceItemsForm): Record<string, any> | null => {
    const items = invoiceItemsForm.invoice_item;
    if (!items || items.length === 0) {
        return null;
    }
    
    // Para campo de tipo "items", usar apenas o primeiro item como objeto
    // Se múltiplos items são necessários, devem ser enviados como múltiplos values
    const firstItem = items[0];
    const itemObject: Record<string, any> = {
        quantity: firstItem.quantity,
        unit_price: firstItem.unit_price,
        unit_type: firstItem.unit_type || 'pcs',
    };
    
    if (firstItem.catalog_element_id) {
        const parsed = parseInt(firstItem.catalog_element_id, 10);
        if (!Number.isNaN(parsed)) {
            itemObject.product_id = parsed;
        }
    }
    
    if (firstItem.discount && Number(firstItem.discount) > 0) {
        itemObject.discount = { type: 'amount', value: Number(firstItem.discount) };
    }
    
    return itemObject;
};

// Helper function para converter múltiplos items em múltiplos values
export const makeMultipleInvoiceItemsReqObject = (invoiceItemsForm: IInvoiceItemsForm): Array<{ value: Record<string, any> }> => {
    const items = invoiceItemsForm.invoice_item;
    if (!items || items.length === 0) {
        return [];
    }
    
    return items.map((item) => {
        const itemObject: Record<string, any> = {
            quantity: item.quantity,
            unit_price: item.unit_price,
            unit_type: item.unit_type || 'pcs',
        };
        
        if (item.catalog_element_id) {
            const parsed = parseInt(item.catalog_element_id, 10);
            if (!Number.isNaN(parsed)) {
                itemObject.product_id = parsed;
            }
        }
        
        if (item.discount && Number(item.discount) > 0) {
            itemObject.discount = { type: 'amount', value: Number(item.discount) };
        }
        
        return { value: itemObject };
    });
};
