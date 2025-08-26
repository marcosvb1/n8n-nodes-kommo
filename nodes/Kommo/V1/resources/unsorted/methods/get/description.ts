import { IDisplayOptions } from 'n8n-workflow';
import { IUnsortedProperties } from '../../../interfaces';
import { addReturnAll } from '../../../_components/ReturnAllDescription';
import { addPageDescription } from '../../../_components/PageDescription';
import { addLimitDescription } from '../../../_components/LimitDescription';

const displayOptions: IDisplayOptions | undefined = {
	show: {
		resource: ['unsorted'],
		operation: ['get'],
	},
};

export const description: IUnsortedProperties = [
	addReturnAll(displayOptions),
	{
		displayName: 'Category',
		name: 'category',
		type: 'options',
		default: 'forms',
		description: 'Unsorted category to list',
		options: [
			{ name: 'Forms', value: 'forms' },
			{ name: 'Chats', value: 'chats' },
			{ name: 'SIP', value: 'sip' },
			{ name: 'Mail', value: 'mail' },
		],
		displayOptions,
	},
	addPageDescription({
		show: { ...displayOptions.show, returnAll: [false] },
	}),
	addLimitDescription(displayOptions),
];


