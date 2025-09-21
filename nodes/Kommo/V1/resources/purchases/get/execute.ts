import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../../transport';
import { getPurchasesEndpoint, validatePurchasesContext, normalizeId } from '../../../helpers/endpointUtils';

export async function execute(this: IExecuteFunctions, index: number): Promise<any> {
	// Obter tipo de operação e parâmetros de contexto
	const operationType = this.getNodeParameter('operation_type', index, 'purchase') as string;
	const catalog_id = operationType === 'purchase' ? normalizeId(this.getNodeParameter('catalog_id', index, '') as string) : undefined;
	const customer_id = operationType === 'transaction' ? normalizeId(this.getNodeParameter('customer_id', index, '') as string) : undefined;

	const context = {
		catalogId: catalog_id,
		customerId: customer_id,
		operation: operationType === 'transaction' ? 'transactions' as const : 'purchases' as const
	};

	try {
		validatePurchasesContext(context);
	} catch (error) {
		throw new NodeOperationError(this.getNode(), error.message, {
			description: 'Verifique se você forneceu catalog_id (para purchases) ou customer_id (para transactions).'
		});
	}

	const endpoint = getPurchasesEndpoint(context);
	const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
	const limit = this.getNodeParameter('limit', index, 50) as number;

	const qs: any = {};

	if (!returnAll) {
		qs.limit = limit;
	}

	if (returnAll) {
		const responseData = await apiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
		return responseData.flatMap((data) => {
			// Para transactions, a estrutura pode ser diferente
			if (context.operation === 'transactions') {
				return data?._embedded?.transactions || data || [];
			}
			// Para purchases (catalog elements)
			if (!data?._embedded?.elements) return [];
			return data._embedded.elements;
		});
	} else {
		const responseData = await apiRequest.call(this, 'GET', endpoint, {}, qs);
		// Para transactions, a estrutura pode ser diferente
		if (context.operation === 'transactions') {
			return responseData?._embedded?.transactions || responseData || [];
		}
		// Para purchases (catalog elements)
		return responseData?._embedded?.elements || [];
	}
}
