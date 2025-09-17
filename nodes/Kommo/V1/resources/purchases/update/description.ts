import { IDisplayOptions, INodeProperties } from 'n8n-workflow';
import { IPurchasesProperties } from '../../interfaces';
import { addJsonParametersDescription } from '../../_components/JsonParametersDescription';
import { purchaseModelDescription } from '../model';
import { addRequestId } from '../../_components/RequestId';

const displayOptions: IDisplayOptions | undefined = {
	show: {
		resource: ['purchases'],
		operation: ['updatePurchases'],
	},
};

export const updatePurchaseModel: INodeProperties[] = [
	...purchaseModelDescription, // Include ID for updates
	addRequestId(),
];

export const description: IPurchasesProperties = [
	...addJsonParametersDescription(displayOptions),
	{
		displayName: 'Purchase Catalog',
		name: 'catalog_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getPurchaseCatalogs',
		},
		default: '',
		required: true,
		description: 'Select the purchase catalog containing the purchases to update',
		displayOptions,
	},
	{
		displayName: 'Purchases',
		name: 'collection',
		placeholder: 'Add purchase to update',
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
				displayName: 'Update Purchase',
				name: 'element',
				values: updatePurchaseModel,
			},
		],
	},
];