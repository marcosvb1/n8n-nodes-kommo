import { IDisplayOptions } from 'n8n-workflow';
import { IPurchasesProperties } from '../../interfaces';
import { addJsonParametersDescription } from '../../_components/JsonParametersDescription';

const displayOptions: IDisplayOptions | undefined = {
	show: {
		resource: ['purchases'],
		operation: ['getPurchases'],
	},
};

export const description: IPurchasesProperties = [
	...addJsonParametersDescription(displayOptions),
	{
		displayName: 'Purchase Catalog Name or ID',
		name: 'catalog_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getPurchaseCatalogs',
		},
		default: '',
		required: true,
		description: 'Select the purchase catalog to get purchases from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions,
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions,
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				...displayOptions.show,
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];