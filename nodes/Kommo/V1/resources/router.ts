import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { IKommo } from './interfaces';

import * as account from './account';
import * as contacts from './contacts';
import * as leads from './leads';
import * as tasks from './tasks';
import * as companies from './companies';
import * as notes from './notes';
import * as lists from './lists';
import * as customers from './customers';
import * as transactions from './transactions';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const operationResult: INodeExecutionData[] = [];
	let responseData: IDataObject | IDataObject[] = [];

	for (let i = 0; i < items.length; i++) {
        const resource = this.getNodeParameter<IKommo>('resource', i);
        // Read operation with resource-specific fallback to avoid runtime crashes when UI fails to provide it
        let operation: string;
        if (resource === 'account') operation = this.getNodeParameter('operation', i, 'getInfo') as string;
        else if (resource === 'contacts') operation = this.getNodeParameter('operation', i, 'getContacts') as string;
        else if (resource === 'leads') operation = this.getNodeParameter('operation', i, 'getLeads') as string;
        else if (resource === 'tasks') operation = this.getNodeParameter('operation', i, 'getTasks') as string;
        else if (resource === 'companies') operation = this.getNodeParameter('operation', i, 'getCompany') as string;
        else if (resource === 'notes') operation = this.getNodeParameter('operation', i, 'getNotes') as string;
        else if (resource === 'lists') operation = this.getNodeParameter('operation', i, 'getLists') as string;
        else if (resource === 'customers') operation = this.getNodeParameter('operation', i, 'getCustomers') as string;
        else if (resource === 'transactions') operation = this.getNodeParameter('operation', i, 'getTransactions') as string;
        else operation = this.getNodeParameter('operation', i) as string;

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
            } else if (kommo.resource === 'customers') {
                responseData = await customers[kommo.operation].execute.call(this, i);
            } else if (kommo.resource === 'transactions') {
                responseData = await transactions[kommo.operation].execute.call(this, i);
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
