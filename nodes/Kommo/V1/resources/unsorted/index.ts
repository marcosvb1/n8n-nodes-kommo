import { INodeProperties } from 'n8n-workflow';

import * as get from './methods/get';
import * as summary from './methods/summary';
import * as create from './methods/createForms';
import * as accept from './methods/accept';
import * as link from './methods/link';
import * as reject from './methods/reject';
export { get, summary, create, accept, link, reject };

export const descriptions: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['unsorted'],
			},
		},
		options: [
			{
				name: 'Accept',
				value: 'accept',
				description: 'Accept an incoming lead by UID',
				action: 'Accept unsorted by uid',
			},
			{
				name: 'Create (Forms)',
				value: 'create',
				description: 'Create incoming leads of type forms',
				action: 'Create unsorted forms',
			},
			{
				name: 'Get Incoming Leads',
				value: 'get',
				description: 'List incoming leads (unsorted)',
				action: 'Get unsorted',
			},
			{
				name: 'Get Summary',
				value: 'summary',
				description: 'Get unsorted summary',
				action: 'Get unsorted summary',
			},
			{
				name: 'Link',
				value: 'link',
				description: 'Link a chat-type incoming lead to an entity',
				action: 'Link unsorted by uid',
			},
			{
				name: 'Reject',
				value: 'reject',
				description: 'Reject an incoming lead by UID',
				action: 'Reject unsorted by uid',
			},
		],
		default: 'get',
	},
	...get.description,
	...create.description,
	...summary.description,
	...accept.description,
	...link.description,
	...reject.description,
];


