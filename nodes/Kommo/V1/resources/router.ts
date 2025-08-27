import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { IKommo } from './interfaces';

import * as account from './account';
import * as contacts from './contacts';
import * as leads from './leads';
import * as tasks from './tasks';
import * as companies from './companies';
import * as notes from './notes';
import * as lists from './lists';
import * as unsorted from './unsorted';

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
			throw new Error(`Missing operation parameter for resource: ${resource}`);
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

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData),
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
