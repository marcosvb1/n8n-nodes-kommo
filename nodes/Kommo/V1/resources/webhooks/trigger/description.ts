import { INodeProperties } from 'n8n-workflow';

export const description: INodeProperties[] = [
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		options: [
			{
				name: 'Company Added',
				value: 'company_added',
				description: 'Trigger when a new company is created',
			},
			{
				name: 'Company Deleted',
				value: 'company_deleted',
				description: 'Trigger when a company is deleted',
			},
			{
				name: 'Company Updated',
				value: 'company_updated',
				description: 'Trigger when a company is modified',
			},
			{
				name: 'Contact Added',
				value: 'contact_added',
				description: 'Trigger when a new contact is created',
			},
			{
				name: 'Contact Deleted',
				value: 'contact_deleted',
				description: 'Trigger when a contact is deleted',
			},
			{
				name: 'Contact Updated',
				value: 'contact_updated',
				description: 'Trigger when a contact is modified',
			},
			{
				name: 'Lead Added',
				value: 'lead_added',
				description: 'Trigger when a new lead is created',
			},
			{
				name: 'Lead Deleted',
				value: 'lead_deleted',
				description: 'Trigger when a lead is deleted',
			},
			{
				name: 'Lead Updated',
				value: 'lead_updated',
				description: 'Trigger when a lead is modified',
			},
			{
				name: 'Purchase Added',
				value: 'purchase_added',
				description: 'Trigger when a new purchase is created',
			},
			{
				name: 'Purchase Deleted',
				value: 'purchase_deleted',
				description: 'Trigger when a purchase is deleted',
			},
			{
				name: 'Purchase Updated',
				value: 'purchase_updated',
				description: 'Trigger when a purchase is modified',
			},
			{
				name: 'Task Added',
				value: 'task_added',
				description: 'Trigger when a new task is created',
			},
			{
				name: 'Task Deleted',
				value: 'task_deleted',
				description: 'Trigger when a task is deleted',
			},
			{
				name: 'Task Updated',
				value: 'task_updated',
				description: 'Trigger when a task is modified',
			},
		],
		default: [],
		description: 'Select which events should trigger this webhook. Leave empty to receive all events.',
	},
	{
		displayName: 'Secret Key',
		name: 'secretKey',
		type: 'string',
		typeOptions: {
			password: true,
		},
		default: '',
		placeholder: 'your-webhook-secret-key',
		description: 'Secret key used to validate webhook signatures from Kommo. Generate a secure random string.',
	},
	{
		displayName: 'Validate Signature',
		name: 'validateSignature',
		type: 'boolean',
		default: true,
		description: 'Whether to validate the webhook signature for security. Highly recommended for production.',
	},
	{
		displayName: 'Validate Timestamp',
		name: 'validateTimestamp',
		type: 'boolean',
		default: true,
		description: 'Whether to validate that the webhook timestamp is recent (within 5 minutes). Prevents replay attacks.',
	},
	{
		displayName: 'Prevent Duplicates',
		name: 'preventDuplicates',
		type: 'boolean',
		default: true,
		description: 'Whether to ignore duplicate events within a 1-minute window. Prevents processing the same event multiple times.',
	},
	{
		displayName: 'Enable Logging',
		name: 'enableLogging',
		type: 'boolean',
		default: false,
		description: 'Whether to log webhook events to the console for debugging purposes',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				displayName: 'Duplicate Window (Seconds)',
				name: 'duplicateWindow',
				type: 'number',
				default: 60,
				description: 'Time window in seconds to check for duplicate events',
				typeOptions: {
					minValue: 10,
					maxValue: 300,
				},
			},
			{
				displayName: 'Include Headers',
				name: 'includeHeaders',
				type: 'boolean',
				default: false,
				description: 'Whether to include HTTP headers in the workflow data',
			},
			{
				displayName: 'Include Query Parameters',
				name: 'includeQuery',
				type: 'boolean',
				default: false,
				description: 'Whether to include query parameters in the workflow data',
			},
			{
				displayName: 'Max Event Age (Seconds)',
				name: 'maxEventAge',
				type: 'number',
				default: 300,
				description: 'Maximum age of webhook events in seconds. Events older than this will be rejected.',
				typeOptions: {
					minValue: 60,
					maxValue: 3600,
				},
			},
			{
				displayName: 'Response Format',
				name: 'responseFormat',
				type: 'options',
				options: [
					{
						name: 'Simple',
						value: 'simple',
						description: 'Return simple success/error messages',
					},
					{
						name: 'Detailed',
						value: 'detailed',
						description: 'Return detailed processing information',
					},
				],
				default: 'simple',
				description: 'Format of the webhook response sent back to Kommo',
			},
		],
	},
];
