import { INodeProperties } from 'n8n-workflow';

import * as getPurchases from './get';
import * as createPurchases from './create';
import * as updatePurchases from './update';

export { getPurchases, createPurchases, updatePurchases };

export const descriptions: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['purchases'],
			},
		},
		options: [
			{
				name: 'Get Purchases',
				value: 'getPurchases',
				description: 'Get list of purchases from invoice catalogs',
				action: 'Get list of purchases',
			},
			{
				name: 'Create Purchase',
				value: 'createPurchases',
				description: 'Create new purchase with invoice items',
				action: 'Create new purchase',
			},
			{
				name: 'Update Purchase',
				value: 'updatePurchases',
				description: 'Update existing purchase',
				action: 'Update purchase',
			},
		],
		default: 'getPurchases',
	},
	...getPurchases.description,
	...createPurchases.description,
	...updatePurchases.description,
];