import { IDisplayOptions, INodeProperties } from 'n8n-workflow';
import { IPurchasesProperties } from '../../interfaces';
import { addJsonParametersDescription } from '../../_components/JsonParametersDescription';
import { purchaseModelDescription } from '../model';
import { addRequestId } from '../../_components/RequestId';

const displayOptions: IDisplayOptions | undefined = {
	show: {
		resource: ['purchases'],
		operation: ['createPurchases'],
	},
};

export const createPurchaseModel: INodeProperties[] = [
	...purchaseModelDescription.filter((el) => el.name !== 'id'),
	addRequestId(),
];

export const description: IPurchasesProperties = [
	...addJsonParametersDescription(displayOptions),
	{
		displayName: 'Info',
		name: 'info',
		type: 'notice',
		default: '',
		description: 'O catálogo de invoices será identificado automaticamente. Certifique-se de que existe um catálogo com tipo "invoices" na sua conta Kommo.',
		displayOptions: {
			show: {
				...displayOptions.show,
				json: [false],
			},
		},
	},
    {
        displayName: 'Product Catalog Name or ID',
        name: 'product_catalog_id',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getProductCatalogs',
        },
        default: '',
        required: true,
        description: 'Select the product catalog to pick products from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        displayOptions: {
            show: {
                ...displayOptions?.show,
                json: [false],
            },
        },
    },
	{
		displayName: 'Purchases',
		name: 'collection',
		placeholder: 'Add purchase',
		type: 'fixedCollection',
		default: [],
		required: true,
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				...displayOptions.show,
				json: [false],
			},
			hide: {
				catalog_id: [''],
			},
		},
		options: [
			{
				displayName: 'Create Purchase',
				name: 'element',
				values: createPurchaseModel,
			},
		],
	},
];
