import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { IKommo } from './interfaces';

import * as account from './account';
import * as contacts from './contacts';
import * as leads from './leads';
import * as tasks from './tasks';
import * as companies from './companies';
import * as notes from './notes';
import * as lists from './lists';
import * as purchases from './purchases';
import * as unsorted from './unsorted';

function simplifyPayload(payload: any): any {
	if (Array.isArray(payload)) return payload.map(simplifyPayload);
	if (!payload || typeof payload !== 'object') return payload;

	// Extract main embedded arrays if present
	if (payload._embedded && typeof payload._embedded === 'object') {
		const embedded = payload._embedded as Record<string, any>;
		const firstKey = Object.keys(embedded)[0];
		if (firstKey && Array.isArray(embedded[firstKey])) {
			return embedded[firstKey].map((el: any) => simplifyPayload(el));
		}
	}

	// Remove noise keys
	const { _links, _embedded, ...rest } = payload as Record<string, any>;
	// Recursively simplify nested objects/arrays
	for (const key of Object.keys(rest)) rest[key] = simplifyPayload(rest[key]);
	return rest;
}

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const operationResult: INodeExecutionData[] = [];
	let responseData: IDataObject | IDataObject[] = [];

	for (let i = 0; i < items.length; i++) {
		const resource = this.getNodeParameter<IKommo>('resource', i);
		let operation = '' as string;
		try {
			operation = this.getNodeParameter('operation', i) as string;
		} catch (e) {
			// fallback for compatibility with older n8n versions
			try {
				const nodeParams = this.getNode().parameters as any;
				operation = nodeParams?.operation || '';
			} catch (fallbackError) {
				// if all fails, provide empty string
				operation = '';
			}
		}

		// validate we have operation
		if (!operation) {
			// Set default operation based on resource
			if (resource === 'purchases') {
				operation = 'getPurchases';
			} else if (resource === 'account') {
				operation = 'getInfo';
			} else if (resource === 'leads') {
				operation = 'getLeads';
			} else if (resource === 'contacts') {
				operation = 'getContacts';
			} else if (resource === 'companies') {
				operation = 'getCompany';
			} else if (resource === 'notes') {
				operation = 'getNotes';
			} else if (resource === 'tasks') {
				operation = 'getTasks';
			} else if (resource === 'lists') {
				operation = 'getLists';
			} else if (resource === 'unsorted') {
				operation = 'get';
			} else {
				throw new Error(`Missing operation parameter for resource: ${resource}`);
			}
		}

		const kommo = {
			resource,
			operation,
		} as IKommo;

		try {
			if (kommo.resource === 'account') {
				responseData = await account[kommo.operation].execute.call(this, i);
			} else if (kommo.resource === 'contacts') {
				responseData = await contacts[kommo.operation].execute.call(this, i);
			} else if (kommo.resource === 'leads') {
				responseData = await leads[kommo.operation].execute.call(this, i);
			} else if (kommo.resource === 'tasks') {
				responseData = await tasks[kommo.operation].execute.call(this, i);
			} else if (kommo.resource === 'companies') {
				responseData = await companies[kommo.operation].execute.call(this, i);
			} else if (kommo.resource === 'notes') {
				responseData = await notes[kommo.operation].execute.call(this, i);
			} else if (kommo.resource === 'lists') {
				responseData = await lists[kommo.operation].execute.call(this, i);
			} else if (kommo.resource === 'purchases') {
				responseData = await purchases[kommo.operation].execute.call(this, i);
			} else if (kommo.resource === 'unsorted') {
				if (kommo.operation === 'get') {
					responseData = await unsorted.get.execute.call(this, i);
				} else if (kommo.operation === 'summary') {
					responseData = await unsorted.summary.execute.call(this, i);
				} else if (kommo.operation === 'create') {
					responseData = await unsorted.create.execute.call(this, i);
				} else if (kommo.operation === 'accept') {
					responseData = await unsorted.accept.execute.call(this, i);
				} else if (kommo.operation === 'link') {
					responseData = await unsorted.link.execute.call(this, i);
				} else if (kommo.operation === 'reject') {
					responseData = await unsorted.reject.execute.call(this, i);
				}
			}

			const simplify = this.getNodeParameter('simplify', 0, true) as boolean;
			const normalized = simplify ? simplifyPayload(responseData) : responseData;

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(normalized as IDataObject[]),
				{ itemData: { item: i } },
			);
			operationResult.push(...executionData);
		} catch (err) {
			if (this.continueOnFail()) {
				operationResult.push({ json: this.getInputData(i)[0].json, error: err });
			} else {
				if (err.context) err.context.itemIndex = i;
				throw err;
			}
		}
	}

	return [operationResult];
}
