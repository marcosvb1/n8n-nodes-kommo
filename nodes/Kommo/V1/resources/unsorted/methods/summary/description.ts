import { IDisplayOptions } from 'n8n-workflow';
import { IUnsortedProperties } from '../../../interfaces';

const displayOptions: IDisplayOptions | undefined = {
	show: {
		resource: ['unsorted'],
		operation: ['summary'],
	},
};

export const description: IUnsortedProperties = [
	{
		displayName: 'Category',
		name: 'category',
		type: 'options',
		default: 'forms',
		description: 'Unsorted category for summary',
		options: [
			{ name: 'Forms', value: 'forms' },
			{ name: 'Chats', value: 'chats' },
			{ name: 'SIP', value: 'sip' },
			{ name: 'Mail', value: 'mail' },
		],
		displayOptions,
	},
];


